import { NextResponse } from 'next/server'
import { z } from 'zod'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import { extractJson } from '@/lib/storyboard'
import { SYNC_SYSTEM_PROMPT, buildSyncUserPrompt, rebuildSyncResult, normalizeIntensity } from '@/lib/sync/sync-prompt'
import type { ParsedStoryboard } from '@/lib/sync/storyboard-parser'

export const maxDuration = 300

// ============================================================
// 输入校验：结构化白名单 + 长度上限（分析来自客户端本地测量，仍做防御）
// ============================================================
const ShotInput = z.object({
  tc: z.string().trim().max(20),
  t: z.number().min(-1).max(3600),
  visual: z.string().max(800),
  direction: z.string().max(400).default(''),
  sound: z.string().max(300).default(''),
})

const UnitInput = z.object({
  name: z.string().trim().min(1).max(160),
  range: z.string().trim().max(120),
  start: z.number().min(-1).max(3600),
  end: z.number().min(-1).max(3600),
  dur: z.number().min(0).max(3600),
  bars: z.string().max(80).default(''),
  lyric: z.string().max(300).default(''),
  shots: z.array(ShotInput).max(120),
})

const BoardInput = z.object({
  source: z.enum(['embedded-json', 'generic-html']),
  title: z.string().trim().max(300),
  subline: z.string().max(500).default(''),
  units: z.array(UnitInput).min(1).max(40),
  frameIds: z.array(z.string().max(40)).max(200).default([]),
  stillIds: z.array(z.string().max(40)).max(200).default([]),
  totalShots: z.number().int().min(0).max(4800),
})

const AnalysisInput = z.object({
  duration: z.number().min(1).max(1800),
  bpm: z.number().min(0).max(400),
  bpmConfidence: z.number().min(0).max(1).default(0),
  sections: z
    .array(
      z.object({
        start: z.number().min(0).max(1800),
        end: z.number().min(0).max(1800),
        energy: z.number().min(0).max(1),
        intensity: z.string().max(12),
        label: z.string().max(40),
      })
    )
    .max(30),
  onsets: z.array(z.number().min(0).max(1800)).max(96),
  silenceGaps: z
    .array(z.object({ start: z.number().min(0).max(1800), end: z.number().min(0).max(1800) }))
    .max(30)
    .default([]),
  energyStats: z.object({ mean: z.number(), max: z.number(), p90: z.number() }).default({ mean: 0, max: 0, p90: 0 }),
  envelope: z.array(z.number().min(0).max(1)).max(600).default([]),
})

const OptimizeInput = z.object({
  songName: z.string().trim().min(1).max(160),
  analysis: AnalysisInput,
  lyrics: z.string().max(8000).default(''),
  board: BoardInput,
  extra: z.string().trim().max(200).default(''),
})

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => ({}))
    const parsed = OptimizeInput.safeParse(raw)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      const field = String(first?.path?.[0] ?? '参数')
      return NextResponse.json({ error: `参数不合法：${field} ${first?.message ?? ''}` }, { status: 400 })
    }
    const { songName, lyrics, extra } = parsed.data
    const analysis = {
      ...parsed.data.analysis,
      sections: parsed.data.analysis.sections.map((s) => ({ ...s, intensity: normalizeIntensity(s.intensity) })),
      envelope: parsed.data.analysis.envelope ?? [],
    }
    const board: ParsedStoryboard = parsed.data.board

    const userPrompt = buildSyncUserPrompt({ songName, analysis, lyrics, board, extra })

    const zai = await ZAI.create()
    const callLlm = (system: string, user: string) =>
      zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: system },
          { role: 'user', content: user },
        ],
        thinking: { type: 'disabled' },
      })

    let content = ''
    const completion = await callLlm(SYNC_SYSTEM_PROMPT, userPrompt)
    content = completion.choices[0]?.message?.content ?? ''

    let result = rebuildSyncResult(extractJson(content), board, analysis)
    if (!result || result.units.length === 0) {
      console.warn('[api/sync/optimize] 首次解析失败，带纠错提示重试')
      const retry = await callLlm(
        SYNC_SYSTEM_PROMPT +
          '\n\n【格式硬约束（上一次输出解析失败）】必须是严格合法的完整 JSON：只输出 JSON 本体；键名与字符串用英文双引号；不要注释、尾逗号或 markdown 围栏；units 必须覆盖全部单元且每个单元 shots 非空。',
        userPrompt + '\n\n请重新输出，只输出严格合法的完整 JSON。'
      )
      content = retry.choices[0]?.message?.content ?? ''
      result = rebuildSyncResult(extractJson(content), board, analysis)
    }
    if (!result || result.units.length === 0) {
      console.error('[api/sync/optimize] 重建失败，原始输出前 500 字：', content.slice(0, 500))
      return NextResponse.json({ error: 'AI 返回格式异常，请再试一次' }, { status: 502 })
    }

    // 存档
    const shotCount = result.units.reduce((s, u) => s + u.shots.length, 0)
    const saved = await db.syncProject.create({
      data: {
        songName: songName.slice(0, 160),
        duration: analysis.duration,
        bpm: analysis.bpm,
        analysis: JSON.stringify(analysis),
        lyrics: lyrics.slice(0, 8000),
        board: JSON.stringify(board),
        result: JSON.stringify(result),
      },
    })

    return NextResponse.json({
      result,
      projectId: saved.id,
      shotCount,
    })
  } catch (err) {
    console.error('[api/sync/optimize]', err)
    return NextResponse.json({ error: '对齐优化失败，请稍后重试' }, { status: 500 })
  }
}
