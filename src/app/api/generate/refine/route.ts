import { NextResponse } from 'next/server'
import { z } from 'zod'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import type { StoryboardResult } from '@/lib/types'
import {
  REFINE_STORYBOARD_PROMPT,
  REFINE_TASKCARD_PROMPT,
  extractJson,
  normalizeShot,
} from '@/lib/storyboard'

export const maxDuration = 300

const RefineInput = z.object({
  id: z.number().int().positive(),
  instruction: z.string().trim().min(4, '修改指令至少 4 个字').max(500, '修改指令过长（上限 500 字）'),
})

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => ({}))
    const parsed = RefineInput.safeParse(raw)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return NextResponse.json(
        { error: `参数不合法：${String(first?.path?.[0] ?? '参数')} ${first?.message ?? ''}` },
        { status: 400 }
      )
    }
    const { id, instruction } = parsed.data

    const generation = await db.generation.findUnique({ where: { id } })
    if (!generation) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    // 判定记录类型：分镜稿（output.shots）或任务卡（output.markdown）
    let outputObj: { shots?: unknown[]; markdown?: string; title?: string } = {}
    try {
      outputObj = JSON.parse(generation.output)
    } catch {
      return NextResponse.json({ error: '该记录数据异常，无法改稿' }, { status: 422 })
    }

    const inputObj: Record<string, unknown> = (() => {
      try {
        return JSON.parse(generation.input || '{}')
      } catch {
        return {}
      }
    })()

    const zai = await ZAI.create()
    const callLlm = (systemPrompt: string, userPromptText: string) =>
      zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPromptText },
        ],
        thinking: { type: 'disabled' },
      })

    if (Array.isArray(outputObj.shots) && outputObj.shots.length > 0) {
      // ============ 分镜稿改稿：输出修改后的完整 JSON ============
      const userPrompt = [
        '【当前分镜稿 JSON】',
        '```',
        generation.output,
        '```',
        '',
        '【原始创作需求（背景参考，不要重新创作）】',
        `- 创意描述：${generation.ideaText || (typeof inputObj.idea === 'string' ? inputObj.idea : '')}`,
        `- 实现框架：${String(inputObj.framework ?? generation.framework)} · 画幅：${String(inputObj.aspect ?? '')} · 节奏：${String(inputObj.pacing ?? '')}`,
        '',
        '【修改指令】',
        instruction,
        '',
        '请输出修改后的完整分镜 JSON。',
      ].join('\n')

      const completion = await callLlm(REFINE_STORYBOARD_PROMPT, userPrompt)
      let content: string = completion.choices[0]?.message?.content ?? ''

      let parsedResult = extractJson(content) as StoryboardResult | null
      if (!parsedResult || !Array.isArray(parsedResult.shots) || parsedResult.shots.length === 0) {
        // 首次解析失败 → 带纠错提示重试一次
        const retry = await callLlm(
          REFINE_STORYBOARD_PROMPT +
            '\n\n【格式硬约束（上一次输出解析失败）】必须是严格合法的 JSON：所有冒号用英文半角":"；键名不加空格；字符串值内的引号用「」；不要任何注释、尾逗号或 markdown 围栏；输出完整，不得截断。',
          userPrompt + '\n\n请重新输出修改后的完整 JSON。'
        )
        content = retry.choices[0]?.message?.content ?? content
        parsedResult = extractJson(content) as StoryboardResult | null
      }
      if (!parsedResult || !Array.isArray(parsedResult.shots) || parsedResult.shots.length === 0) {
        console.error('[api/generate/refine] JSON 解析失败，原始输出前 600 字：', content.slice(0, 600))
        return NextResponse.json({ error: 'AI 返回格式异常，请再试一次' }, { status: 502 })
      }

      const result: StoryboardResult = {
        title: String(parsedResult.title ?? generation.title),
        logline: String(parsedResult.logline ?? generation.logline),
        styleGuide: parsedResult.styleGuide ?? {},
        musicStyle: String(parsedResult.musicStyle ?? ''),
        totalDuration: Number(parsedResult.totalDuration) || undefined,
        shots: parsedResult.shots.map((s, i) => normalizeShot(s as unknown as Record<string, unknown>, i)),
        meaningArc: typeof parsedResult.meaningArc === 'string' ? parsedResult.meaningArc : undefined,
        energyCurve: typeof parsedResult.energyCurve === 'string' ? parsedResult.energyCurve : undefined,
        musicPlans: Array.isArray(parsedResult.musicPlans) ? parsedResult.musicPlans.map(String).slice(0, 6) : undefined,
        implementationNotes: Array.isArray(parsedResult.implementationNotes)
          ? parsedResult.implementationNotes.map(String)
          : [],
        checklist: Array.isArray(parsedResult.checklist) ? parsedResult.checklist.map(String) : [],
      }

      const updated = await db.generation.update({
        where: { id },
        data: {
          title: result.title,
          logline: result.logline,
          output: JSON.stringify(result),
        },
      })

      return NextResponse.json({
        generation: {
          id: updated.id,
          title: updated.title,
          logline: updated.logline,
          framework: updated.framework,
          styleName: updated.styleName,
          input: updated.input,
          output: result,
          createdAt: updated.createdAt,
        },
      })
    }

    if (typeof outputObj.markdown === 'string' && outputObj.markdown.length > 0) {
      // ============ 任务卡改稿：输出修改后的完整 Markdown ============
      const userPrompt = [
        '【当前任务卡 Markdown】',
        '```markdown',
        outputObj.markdown,
        '```',
        '',
        '【修改指令】',
        instruction,
        '',
        '请输出修改后的完整任务卡 Markdown。',
      ].join('\n')

      const completion = await callLlm(REFINE_TASKCARD_PROMPT, userPrompt)
      let markdown: string = completion.choices[0]?.message?.content ?? ''
      const fenced = markdown.match(/```(?:markdown)?\s*([\s\S]*?)```/)
      if (fenced && fenced[1].trim().length > 200) markdown = fenced[1].trim()
      if (markdown.length < 300) {
        console.error('[api/generate/refine] 任务卡输出过短，前 400 字：', markdown.slice(0, 400))
        return NextResponse.json({ error: 'AI 返回内容过短，请再试一次' }, { status: 502 })
      }
      const titleMatch = markdown.match(/^#\s*(?:任务卡[：:]?)?\s*(.+)$/m)
      const title = (titleMatch?.[1] ?? generation.title).trim()
      const output = { title, markdown }

      const updated = await db.generation.update({
        where: { id },
        data: { title: title.slice(0, 120), output: JSON.stringify(output) },
      })

      return NextResponse.json({
        generation: {
          id: updated.id,
          title: updated.title,
          logline: updated.logline,
          framework: updated.framework,
          styleName: updated.styleName,
          input: updated.input,
          output,
          createdAt: updated.createdAt,
        },
      })
    }

    return NextResponse.json({ error: '该记录类型不支持改稿' }, { status: 422 })
  } catch (err) {
    if ((err as { code?: string })?.code === 'P2025') {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }
    console.error('[api/generate/refine]', err)
    return NextResponse.json({ error: '改稿失败，请稍后重试' }, { status: 500 })
  }
}
