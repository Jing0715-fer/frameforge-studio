import { NextResponse } from 'next/server'
import { z } from 'zod'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import type { StoryboardResult } from '@/lib/types'
import {
  ASPECT_GUIDES,
  ASPECT_LABELS,
  FRAMEWORK_GUIDES,
  FRAMEWORK_GUIDE_LABELS,
  PACING_GUIDES,
  PACING_LABELS,
  SYSTEM_PROMPT,
  TASK_CARD_PROMPT,
  extractJson,
  normalizeShot,
} from '@/lib/storyboard'

export const maxDuration = 300

// ============================================================
// 输入校验：白名单枚举 + 长度上限（防止任意字符串注入提示词 / 超长生成）
// ============================================================
const GenerateInput = z.object({
  idea: z.string().trim().min(4, '创意描述至少 4 个字').max(2000, '创意描述过长（上限 2000 字）'),
  videoType: z.string().trim().min(1).max(40),
  styleSlug: z.string().trim().min(1).max(120),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(90)]),
  aspect: z.enum(['16:9', '9:16', '1:1']),
  framework: z.enum(['hyperframes', 'remotion', 'p5js', 'generic']),
  pacing: z.enum(['slow', 'medium', 'fast']),
  extra: z.string().trim().max(500, '附加要求过长（上限 500 字）'),
  outputMode: z.enum(['storyboard', 'taskcard']),
})
type GenerateInputBody = z.infer<typeof GenerateInput>

// 提示词与解析管线集中在 src/lib/storyboard.ts（与 /api/generate/refine 共用）

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => ({}))
    const parsedInput = GenerateInput.safeParse(raw)
    if (!parsedInput.success) {
      const first = parsedInput.error.issues[0]
      const field = String(first?.path?.[0] ?? "参数")
      return NextResponse.json(
        { error: `参数不合法：${field} ${first?.message ?? ''}` },
        { status: 400 }
      )
    }
    const { idea, videoType, styleSlug, duration, aspect, framework, pacing, extra, outputMode } =
      parsedInput.data as GenerateInputBody

    // 解析风格：优先注入完整风格提示词原文（fy 方法论：读全文再决定）
    let styleName = '由 AI 自由发挥'
    let stylePrompt = ''
    let styleBrief = ''
    if (styleSlug && styleSlug !== 'auto') {
      const style = await db.style.findUnique({ where: { slug: styleSlug } })
      if (style) {
        styleName = style.name
        const full = style.promptFull || style.starterPrompt
        // 完整原文过长时截断到 1800 字，保留开头（视觉语法核心通常在前部）
        stylePrompt = full.length > 1800 ? `${full.slice(0, 1800)}\n…（原文截断，语法核心已保留）` : full
        styleBrief = [
          style.suitableFor ? `适合讲：${style.suitableFor}` : '',
          style.looksLike ? `长什么样：${style.looksLike}` : '',
        ]
          .filter(Boolean)
          .join('；')
      }
    }

    const userPrompt = [
      '【创作需求】',
      `- 创意描述：${idea}`,
      `- 视频类型：${videoType}`,
      `- 视觉风格：${styleSlug === 'auto' ? '由你决定最合适的风格（先想想内容最贴近哪种材质与运动语法），并在 styleGuide.name 中写明选择理由' : `${styleName}（${styleBrief}）`}`,
      stylePrompt
        ? `- 风格提示词原文（必须完整保留其视觉语法：材质、构图、运动语法、镜头语言都要体现在分镜里，不只是配色）：\n<<<\n${stylePrompt}\n>>>`
        : '',
      `- 总时长：${duration} 秒（shots 时间轴必须从 0 连续覆盖到 ${duration}）`,
      `- 画幅：${aspect}（${ASPECT_LABELS[aspect] ?? ''}，${ASPECT_GUIDES[aspect] ?? ''}）`,
      `- 实现框架：${FRAMEWORK_GUIDE_LABELS[framework] ?? framework}——${FRAMEWORK_GUIDES[framework] ?? ''}`,
      `- 节奏：${PACING_LABELS[pacing] ?? pacing}（${PACING_GUIDES[pacing] ?? ''}）`,
      extra ? `- 附加要求：${extra}` : '',
      '',
      outputMode === 'taskcard'
        ? '请输出完整任务卡 Markdown 文档（12 节），只输出文档本身。'
        : '请开始创作，只输出 JSON。',
    ]
      .filter(Boolean)
      .join('\n')

    const zai = await ZAI.create()
    const callLlm = (systemPrompt: string, userPromptText: string) =>
      zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPromptText },
        ],
        thinking: { type: 'disabled' },
      })

    let content = ''
    if (outputMode === 'taskcard') {
      const completion = await callLlm(TASK_CARD_PROMPT, userPrompt)
      content = completion.choices[0]?.message?.content ?? ''
    } else {
      const completion = await callLlm(SYSTEM_PROMPT, userPrompt)
      content = completion.choices[0]?.message?.content ?? ''
      // 首次解析失败 → 带纠错提示重试一次
      const first = extractJson(content) as StoryboardResult | null
      if (!first || !Array.isArray(first.shots) || first.shots.length === 0) {
        console.warn('[api/generate] 首次 JSON 解析失败，带纠错提示重试')
        const retry = await callLlm(
          SYSTEM_PROMPT +
            '\n\n【格式硬约束（上一次输出解析失败）】必须是严格合法的 JSON：所有冒号用英文半角\":\"；键名不加空格；字符串值内的引号用「」；不要任何注释、尾逗号或 markdown 围栏；输出完整，不得截断。',
          userPrompt + '\n\n请重新输出，只输出严格合法的完整 JSON。'
        )
        content = retry.choices[0]?.message?.content ?? content
        const retryParsed = extractJson(content) as StoryboardResult | null
        if (!retryParsed || !Array.isArray(retryParsed.shots) || retryParsed.shots.length === 0) {
          // 重试仍失败则回退首次输出（交给下方统一解析/报错）
        }
      }
    }

    // ============ 任务卡模式：原文即交付 ============
    if (outputMode === 'taskcard') {
      let markdown = content.trim()
      const fenced = markdown.match(/```(?:markdown)?\s*([\s\S]*?)```/)
      if (fenced && fenced[1].trim().length > 200) markdown = fenced[1].trim()
      if (markdown.length < 300) {
        console.error('[api/generate] 任务卡输出过短，前 400 字：', content.slice(0, 400))
        return NextResponse.json({ error: 'AI 返回内容过短，请再试一次' }, { status: 502 })
      }
      const titleMatch = markdown.match(/^#\s*(?:任务卡[：:]?)?\s*(.+)$/m)
      const title = (titleMatch?.[1] ?? '动画任务卡').trim()
      const saved = await db.generation.create({
        data: {
          title: title.slice(0, 120),
          logline: `fy 任务卡 · ${styleSlug === 'auto' ? 'AI 自选风格' : styleName}`,
          framework,
          styleName: styleSlug === 'auto' ? 'AI 自由发挥' : styleName,
          ideaText: idea,
          input: JSON.stringify({ idea, videoType, styleSlug, duration, aspect, framework, pacing, extra, outputMode }),
          output: JSON.stringify({ title, markdown }),
        },
      })
      return NextResponse.json({
        generation: {
          id: saved.id,
          title: saved.title,
          logline: saved.logline,
          framework: saved.framework,
          styleName: saved.styleName,
          input: saved.input,
          output: { title, markdown },
          createdAt: saved.createdAt,
        },
      })
    }

    // ============ 分镜稿模式：JSON 解析 ============
    const parsed = extractJson(content) as StoryboardResult | null
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.shots) || parsed.shots.length === 0) {
      console.error('[api/generate] JSON 解析失败，原始输出前 600 字：', content.slice(0, 600))
      return NextResponse.json(
        { error: 'AI 返回格式异常，请再试一次（通常第二次即可成功）' },
        { status: 502 }
      )
    }

    const shots = parsed.shots.map((s, i) =>
      normalizeShot(s as unknown as Record<string, unknown>, i)
    )
    const result: StoryboardResult = {
      title: String(parsed.title ?? '未命名分镜'),
      logline: String(parsed.logline ?? ''),
      styleGuide: parsed.styleGuide ?? {},
      musicStyle: String(parsed.musicStyle ?? ''),
      totalDuration: Number(parsed.totalDuration) || duration,
      shots,
      meaningArc: typeof parsed.meaningArc === 'string' ? parsed.meaningArc : undefined,
      energyCurve: typeof parsed.energyCurve === 'string' ? parsed.energyCurve : undefined,
      musicPlans: Array.isArray(parsed.musicPlans) ? parsed.musicPlans.map(String).slice(0, 6) : undefined,
      implementationNotes: Array.isArray(parsed.implementationNotes)
        ? parsed.implementationNotes.map(String)
        : [],
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist.map(String) : [],
    }

    const saved = await db.generation.create({
      data: {
        title: result.title,
        logline: result.logline,
        framework,
        styleName: styleSlug === 'auto' ? (result.styleGuide?.name ?? 'AI 自由发挥') : styleName,
        ideaText: idea,
        input: JSON.stringify({ idea, videoType, styleSlug, duration, aspect, framework, pacing, extra, outputMode }),
        output: JSON.stringify(result),
      },
    })

    return NextResponse.json({
      generation: {
        id: saved.id,
        title: saved.title,
        logline: saved.logline,
        framework: saved.framework,
        styleName: saved.styleName,
        input: saved.input,
        output: result,
        createdAt: saved.createdAt,
      },
    })
  } catch (err) {
    console.error('[api/generate]', err)
    // 不把内部错误细节透给客户端，统一友好文案（原始错误只进日志）
    return NextResponse.json({ error: '生成失败，请稍后重试' }, { status: 500 })
  }
}
