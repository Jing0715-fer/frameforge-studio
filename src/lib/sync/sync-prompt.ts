// 音画对齐：LLM 提示词与结果重建
// 输出协议采用「省写约定」：未改动的镜头只回 {i, tc, t, changed:false}，
// 改写镜头覆盖 visual/direction/sound 字段，新增镜头带 new 标记——
// 服务端据此与原分镜合并重建出完整结果（省 token、抗截断）

import { formatTc, type AudioAnalysis, type Intensity } from './audio-analysis'
import type { BoardUnit, ParsedStoryboard } from './storyboard-parser'
import type { SyncResult, SyncShotResult, SyncUnitResult } from '@/lib/types'

export const SYNC_SYSTEM_PROMPT = `你是 MAD / 音乐录影带的音画对齐剪辑顾问，精通用画面踩住音乐的呼吸。
你的输入：一首歌的客观音波结构分析（段落/能量/BPM/节拍点/静音缺口）+ 一份初版分镜稿（它可能没有考虑歌曲本身的声音）。
你的任务：输出「对齐优化版」分镜——保留原稿的叙事创意与画面设计，把时间码、镜头密度、声音设计重新对齐到音乐结构上。

【工作原则】
1. 尊重原稿：visual（画面）与 direction（调度）是素材不是重写对象。除非确有必要，原样保留（输出时省略该字段即视为保留原文）。
2. 单元吸附：把每个分镜单元的 start/end 微调（±3s 内）到最近的音乐段落边界；matchedSection 写明它落在哪个音乐段落（用分析给出的 label）。
3. 密度跟能量走：安静段镜头更少更长（让观众呼吸），强/爆发段镜头更多更短（卡点）。通过「新增镜头」和「删除镜头」（在 shots 里不输出该 i）调整密度，全片镜头总数变化控制在 ±20% 内。
4. 时间码卡节拍：优先把切点吸附到 onsets 里的节拍/冲击点（±0.4s）；已知 BPM 时按拍计算（如 103 BPM → 1 拍 ≈ 0.583s，2 拍 ≈ 1.165s）。时间码格式 m:ss.d（如 0:18.6、2:56.5），t 写对应秒数。
5. 声音设计对齐音波：静音缺口（silenceGaps）是全曲最响的留白——前后镜头要为它让出空间、缺口内不安排任何声音事件；起音密集段 sound 写节拍化设计；安静段写环境声。sound 字段是你重点重写的对象。
6. 每处调整给一句 reason（从什么→到什么、为什么对齐更好）。changed 只在真改动时为 true。
7. 单元内镜头时间码必须单调递增，且落在该单元区间内；不得出现重复时间码。

【输出 JSON 结构】只输出 JSON，不要任何解释、不要 markdown 围栏：
{
  "overall": "总评（150 字内）：原稿与音波结构的匹配度、最突出的问题",
  "bpmAdvice": "卡点建议：基于 BPM 的剪辑节奏方案（如强段每 2 拍一切）",
  "retimingNotes": ["关键调整说明，最多 8 条"],
  "units": [
    {
      "name": "单元名（照抄原稿）",
      "range": "m:ss.d – m:ss.d",
      "start": 0, "end": 18.6,
      "matchedSection": "对应音乐段落 label",
      "cutAdvice": "本段剪辑节奏建议（一句话）",
      "shots": [
        {"i": 0, "tc": "0:00.0", "t": 0, "changed": false},
        {"i": 1, "tc": "0:02.5", "t": 2.5, "changed": true, "reason": "切点从 0:02.3 吸附到 0:02.9 的节拍点", "sound": "改写后的声音设计"},
        {"new": true, "after": 3, "tc": "0:05.2", "t": 5.2, "visual": "新镜头画面", "direction": "调度", "sound": "声音", "reason": "爆发段加密剪辑"}
      ]
    }
  ]
}

【省写约定（务必遵守）】
- 未改动镜头：只给 {"i": 编号, "tc": "原时间码", "t": 秒, "changed": false}
- 只改时间码：给 i/tc/t/changed/reason，省略 visual/direction/sound
- 改写字段：只输出被改的字段（如仅 sound）
- 新增镜头：必须给完整 visual/direction/sound + new:true + after:原镜头编号
- units 数组必须覆盖原稿全部单元，顺序不变`

/** 构建用户提示词（紧凑序列化，控制 token） */
export function buildSyncUserPrompt(input: {
  songName: string
  analysis: Pick<AudioAnalysis, 'duration' | 'bpm' | 'bpmConfidence' | 'sections' | 'onsets' | 'silenceGaps' | 'energyStats'>
  lyrics: string
  board: ParsedStoryboard
  extra: string
}): string {
  const { analysis, lyrics, board, extra } = input
  const music = {
    时长: `${analysis.duration.toFixed(1)}s (${formatTc(analysis.duration)})`,
    BPM: analysis.bpm > 0 ? `${analysis.bpm}（置信度 ${analysis.bpmConfidence.toFixed(2)}；1 拍 ≈ ${(60 / Math.max(1, analysis.bpm)).toFixed(3)}s）` : '未能测定',
    段落: analysis.sections.map((s) => ({
      区间: `${formatTc(s.start)}–${formatTc(s.end)}`,
      时长: `${(s.end - s.start).toFixed(1)}s`,
      能量: s.energy,
      强度: s.intensity,
      label: s.label,
    })),
    节拍冲击点: analysis.onsets.slice(0, 48).map((t) => formatTc(t)),
    静音缺口: analysis.silenceGaps.map((g) => `${formatTc(g.start)}–${formatTc(g.end)}（${(g.end - g.start).toFixed(1)}s 全曲留白）`),
    能量统计: analysis.energyStats,
  }
  const units = board.units.map((u, k) => ({
    单元: `U${k + 1} ${u.name}`,
    区间: `${formatTc(u.start)}–${formatTc(u.end)}（${u.dur.toFixed(1)}s）`,
    小节: u.bars || undefined,
    起点歌词: u.lyric || undefined,
    镜头: u.shots.map((s, i) => [i, s.tc, s.visual, s.direction || '', s.sound || '']),
  }))

  return [
    `【歌曲】${input.songName}`,
    '',
    '【音波结构分析（客观测量）】',
    JSON.stringify(music, null, 1),
    '',
    lyrics ? `【歌词】\n${lyrics}` : '【歌词】未提供',
    '',
    `【初版分镜稿】${board.title}${board.subline ? ` —— ${board.subline}` : ''}`,
    `共 ${board.units.length} 个单元 / ${board.totalShots} 个镜头（镜头行格式：[编号, 时间码, 画面, 调度, 声音]）`,
    JSON.stringify(units, null, 1),
    '',
    extra ? `【用户附加要求】${extra}` : '【用户附加要求】无（按默认策略：保留画面创意，重点对齐时间码与声音设计）',
    '',
    '请输出对齐优化后的分镜 JSON（严格遵守省写约定，units 覆盖全部单元）。',
  ].join('\n')
}

// ============ 结果重建 ============

interface LlmShot {
  i?: number
  tc?: string
  t?: number
  changed?: boolean
  reason?: string
  visual?: string
  direction?: string
  sound?: string
  new?: boolean
  after?: number
}

interface LlmUnit {
  name?: string
  range?: string
  start?: number
  end?: number
  matchedSection?: string
  cutAdvice?: string
  shots?: LlmShot[]
}

function str(x: unknown): string | undefined {
  return typeof x === 'string' && x.trim() ? x.trim() : undefined
}

/**
 * 把 LLM 紧凑输出与原分镜合并重建为完整 SyncResult。
 * 容错策略：单镜失败丢弃该镜的覆盖（保留原文），单元失败回退原单元——保证总是能给出完整可用的结果。
 */
export function rebuildSyncResult(parsed: unknown, board: ParsedStoryboard, analysis: Pick<AudioAnalysis, 'sections'>): SyncResult | null {
  if (!parsed || typeof parsed !== 'object') return null
  const p = parsed as Record<string, unknown>
  const llmUnits = Array.isArray(p.units) ? (p.units as LlmUnit[]) : []
  if (llmUnits.length === 0) return null

  const nearestSection = (t: number): string => {
    let best = analysis.sections[0]
    let bestD = Infinity
    for (const s of analysis.sections) {
      const mid = (s.start + s.end) / 2
      const d = Math.abs(mid - t)
      if (d < bestD) {
        bestD = d
        best = s
      }
    }
    return best ? best.label : ''
  }

  const outUnits: SyncUnitResult[] = board.units.map((orig: BoardUnit, k): SyncUnitResult => {
    // 按 index / 名称匹配 LLM 输出单元
    let lu = llmUnits[k]
    if (!lu || (str(lu.name) && str(lu.name) !== orig.name)) {
      lu = llmUnits.find((x) => str(x.name) === orig.name) ?? lu
    }
    if (!lu || !Array.isArray(lu.shots) || lu.shots.length === 0) {
      // 回退：原单元原样返回，matchedSection 由最近段落推断
      return {
        name: orig.name,
        range: orig.range,
        start: orig.start,
        end: orig.end,
        matchedSection: nearestSection((orig.start + orig.end) / 2),
        cutAdvice: '',
        shots: orig.shots.map((s) => ({ ...s, changed: false })),
      }
    }

    const uStart = typeof lu.start === 'number' ? lu.start : orig.start
    const uEnd = typeof lu.end === 'number' ? lu.end : orig.end
    const resultShots: SyncShotResult[] = []
    const usedIdx = new Set<number>()

    const pushOrig = (i: number, override?: LlmShot) => {
      if (i < 0 || i >= orig.shots.length || usedIdx.has(i)) return
      usedIdx.add(i)
      const o = orig.shots[i]
      const tc = str(override?.tc) ?? o.tc
      let t = typeof override?.t === 'number' ? override.t : o.t
      t = Math.max(0, Math.round(t * 10) / 10)
      // 单调性：不小于前一镜
      const prev = resultShots[resultShots.length - 1]
      if (prev && t < prev.t) t = prev.t
      const visual = str(override?.visual) ?? o.visual
      const direction = str(override?.direction) ?? o.direction
      const sound = str(override?.sound) ?? o.sound
      const changed =
        override?.changed === true || tc !== o.tc || Math.abs(t - o.t) > 0.049 || visual !== o.visual || direction !== o.direction || sound !== o.sound
      resultShots.push({ tc, t, visual, direction, sound, changed, reason: str(override?.reason) })
    }

    for (const s of lu.shots) {
      if (!s || typeof s !== 'object') continue
      if (s.new === true) {
        const visual = str(s.visual)
        if (!visual) continue
        const tc = str(s.tc) ?? formatTc(typeof s.t === 'number' ? s.t : uStart)
        let t = typeof s.t === 'number' ? s.t : parseTcSafe(tc)
        const prev = resultShots[resultShots.length - 1]
        if (prev && t < prev.t) t = prev.t
        t = Math.max(0, Math.round(t * 10) / 10)
        resultShots.push({
          tc,
          t,
          visual,
          direction: str(s.direction) ?? '',
          sound: str(s.sound) ?? '',
          changed: true,
          isNew: true,
          reason: str(s.reason),
        })
      } else if (typeof s.i === 'number') {
        pushOrig(s.i, s)
      } else if (typeof s.tc === 'string') {
        // 没给编号：按位置对应原镜头
        pushOrig(resultShots.length, s)
      }
    }
    // LLM 丢掉了部分原镜头属正常（删镜调密度）；但若几乎全丢则视为异常，回退原镜头序列
    if (resultShots.length < Math.max(1, Math.floor(orig.shots.length * 0.4))) {
      return {
        name: orig.name,
        range: str(lu.range) ?? orig.range,
        start: uStart,
        end: uEnd,
        matchedSection: str(lu.matchedSection) ?? nearestSection((uStart + uEnd) / 2),
        cutAdvice: str(lu.cutAdvice) ?? '',
        shots: orig.shots.map((s) => ({ ...s, changed: false })),
      }
    }

    return {
      name: orig.name,
      range: str(lu.range) ?? `${formatTc(uStart)} – ${formatTc(uEnd)}`,
      start: Math.round(uStart * 10) / 10,
      end: Math.round(uEnd * 10) / 10,
      matchedSection: str(lu.matchedSection) ?? nearestSection((uStart + uEnd) / 2),
      cutAdvice: str(lu.cutAdvice) ?? '',
      shots: resultShots,
    }
  })

  return {
    overall: str(p.overall) ?? '',
    bpmAdvice: str(p.bpmAdvice) ?? '',
    retimingNotes: Array.isArray(p.retimingNotes) ? p.retimingNotes.map((x) => String(x)).filter(Boolean).slice(0, 10) : [],
    units: outUnits,
  }
}

function parseTcSafe(tc: string): number {
  const m = /^(\d{1,2}):(\d{1,2})(?:\.(\d))?$/.exec(tc.trim())
  if (!m) return 0
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) / 10 : 0)
}

/** 强度枚举收敛（LLM 可能输出别的词） */
export function normalizeIntensity(x: unknown): Intensity {
  return x === 'loud' || x === 'climax' || x === 'medium' ? x : 'quiet'
}
