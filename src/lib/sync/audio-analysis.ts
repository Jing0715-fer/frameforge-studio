// 音频结构分析（纯函数，浏览器/Node 通用）
// 输入解码后的 PCM 通道数据，输出：能量包络 / 段落切分 / BPM / 节拍点 / 静音缺口
// 供「音画对齐」工坊把分镜稿与歌曲音波结构对齐

export type Intensity = 'quiet' | 'medium' | 'loud' | 'climax'

export interface AudioSection {
  start: number
  end: number
  energy: number // 0–1（相对全曲最大能量）
  intensity: Intensity
  label: string // 如「前奏 · 安静」「副歌 · 强」
}

export interface AudioAnalysis {
  duration: number
  sampleRate: number
  bpm: number
  bpmConfidence: number // 0–1
  envelope: number[] // 归一化能量包络（ENVELOPE_POINTS 点，0–1）
  sections: AudioSection[]
  onsets: number[] // 主要节拍/冲击点（秒，升序）
  silenceGaps: { start: number; end: number }[]
  energyStats: { mean: number; max: number; p90: number }
}

export const ENVELOPE_POINTS = 480

const FRAME_SIZE = 2048
const HOP = 512
const MIN_BPM = 70
const MAX_BPM = 180

/** 多通道混成单声道 */
export function mixdownToMono(channels: Float32Array[]): Float32Array {
  if (channels.length === 0) return new Float32Array(0)
  if (channels.length === 1) return channels[0]
  const n = channels[0].length
  const out = new Float32Array(n)
  for (let c = 0; c < channels.length; c++) {
    const ch = channels[c]
    for (let i = 0; i < n; i++) out[i] += ch[i] / channels.length
  }
  return out
}

/** 主入口：分析 PCM 数据 */
export function analyzeAudio(channels: Float32Array[], sampleRate: number, durationHint?: number): AudioAnalysis {
  const mono = mixdownToMono(channels)
  const duration = durationHint && durationHint > 0 ? durationHint : mono.length / sampleRate
  const empty: AudioAnalysis = {
    duration,
    sampleRate,
    bpm: 0,
    bpmConfidence: 0,
    envelope: new Array(ENVELOPE_POINTS).fill(0),
    sections: [{ start: 0, end: duration, energy: 0, intensity: 'quiet', label: '整曲 · 安静' }],
    onsets: [],
    silenceGaps: [],
    energyStats: { mean: 0, max: 0, p90: 0 },
  }
  if (mono.length < sampleRate * 2) return empty // 少于 2 秒不分析

  const fps = sampleRate / HOP // 每秒帧数
  const nFrames = Math.max(1, Math.floor((mono.length - FRAME_SIZE) / HOP))

  // ---- 1. 逐帧 RMS ----
  const rms = new Float32Array(nFrames)
  for (let f = 0; f < nFrames; f++) {
    const off = f * HOP
    let sum = 0
    for (let i = 0; i < FRAME_SIZE; i++) {
      const v = mono[off + i] || 0
      sum += v * v
    }
    rms[f] = Math.sqrt(sum / FRAME_SIZE)
  }
  const maxRms = Float32Array.from(rms).sort()[nFrames - 1] || 1e-9
  const norm = new Float32Array(nFrames)
  for (let f = 0; f < nFrames; f++) norm[f] = rms[f] / maxRms

  const stats = {
    mean: mean(norm),
    max: 1,
    p90: percentile(norm, 0.9),
  }

  // ---- 2. 起音包络（半波整流的能量差分）----
  const flux = new Float32Array(nFrames)
  for (let f = 1; f < nFrames; f++) flux[f] = Math.max(0, norm[f] - norm[f - 1])
  smoothInPlace(flux, 2)

  // ---- 3. BPM：起音包络的自相关 ----
  const { bpm, confidence } = estimateBpm(flux, fps)

  // ---- 4. 主要节拍/冲击点 ----
  const onsets = detectOnsets(flux, fps, duration)

  // ---- 5. 段落切分：能量 + 起音密度的变化点检测 ----
  const sections = detectSections(norm, flux, fps, duration)

  // ---- 6. 静音缺口（需前后明显更响，过滤安静段落内的误报）----
  const silenceGaps = detectSilenceGaps(norm, fps, duration)

  // ---- 7. 降采样包络（可视化/传输）----
  const envelope = downsample(norm, ENVELOPE_POINTS)

  return { duration, sampleRate, bpm, bpmConfidence: confidence, envelope, sections, onsets, silenceGaps, energyStats: stats }
}

// ============ 内部算法 ============

function mean(arr: Float32Array | number[]): number {
  let s = 0
  for (let i = 0; i < arr.length; i++) s += arr[i]
  return arr.length ? s / arr.length : 0
}

function percentile(arr: Float32Array, p: number): number {
  const sorted = Float32Array.from(arr).sort()
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)))
  return sorted[idx]
}

function smoothInPlace(arr: Float32Array, radius: number) {
  if (radius <= 0 || arr.length < 3) return
  const src = Float32Array.from(arr)
  for (let i = 0; i < arr.length; i++) {
    let s = 0
    let c = 0
    for (let j = Math.max(0, i - radius); j <= Math.min(arr.length - 1, i + radius); j++) {
      s += src[j]
      c++
    }
    arr[i] = s / c
  }
}

function estimateBpm(flux: Float32Array, fps: number): { bpm: number; confidence: number } {
  const minLag = Math.max(2, Math.floor((60 / MAX_BPM) * fps))
  const maxLag = Math.min(Math.floor(flux.length / 3), Math.ceil((60 / MIN_BPM) * fps))
  if (maxLag <= minLag) return { bpm: 0, confidence: 0 }

  // 去均值
  const m = mean(flux)
  const f = Float32Array.from(flux, (v) => v - m)

  let bestLag = 0
  let bestVal = 0
  let sumAll = 0
  let countAll = 0
  const ac: number[] = []
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0
    for (let i = 0; i + lag < f.length; i++) s += f[i] * f[i + lag]
    const v = s / (f.length - lag)
    ac.push(v)
    sumAll += v
    countAll++
    if (v > bestVal) {
      bestVal = v
      bestLag = lag
    }
  }
  if (!bestLag) return { bpm: 0, confidence: 0 }

  // 折叠到 70–170 的常见区间（倍频歧义）
  let bpm = (60 * fps) / bestLag
  while (bpm < 80) bpm *= 2
  while (bpm > 170) bpm /= 2
  const avg = sumAll / countAll
  const confidence = Math.max(0, Math.min(1, avg > 0 ? (bestVal - avg) / (Math.abs(bestVal) + Math.abs(avg) + 1e-9) : 0))
  return { bpm: Math.round(bpm * 10) / 10, confidence }
}

function detectOnsets(flux: Float32Array, fps: number, duration: number): number[] {
  const m = mean(flux)
  const std = Math.sqrt(mean(Float32Array.from(flux, (v) => (v - m) * (v - m))))
  const threshold = m + 1.6 * std
  const minGap = Math.max(2, Math.round(1.1 * fps)) // 至少间隔 1.1s
  const candidates: { t: number; v: number }[] = []
  for (let i = 1; i < flux.length - 1; i++) {
    if (flux[i] > threshold && flux[i] >= flux[i - 1] && flux[i] >= flux[i + 1]) {
      candidates.push({ t: i / fps, v: flux[i] })
    }
  }
  candidates.sort((a, b) => b.v - a.v)
  const picked: { t: number; v: number }[] = []
  for (const c of candidates) {
    if (picked.every((p) => Math.abs(p.t - c.t) >= 1.1)) picked.push(c)
    if (picked.length >= 48) break
  }
  return picked.map((p) => round1(Math.min(p.t, duration))).sort((a, b) => a - b)
}

function detectSections(norm: Float32Array, flux: Float32Array, fps: number, duration: number): AudioSection[] {
  // 约 1.5s 平滑窗
  const w = Math.max(1, Math.round(1.5 * fps))
  const sm = Float32Array.from(norm)
  smoothInPlace(sm, Math.floor(w / 2))

  // 双通道新奇度：能量差 + 起音密度差（配器变化是段落边界的重要线索）
  const half = Math.max(1, Math.round(2 * fps))
  const on = Float32Array.from(flux)
  smoothInPlace(on, Math.round(fps)) // 1s 窗口的局部起音强度
  const novE = new Float32Array(sm.length)
  const novO = new Float32Array(sm.length)
  let maxE = 1e-9
  let maxO = 1e-9
  for (let i = 0; i < sm.length; i++) {
    const aE = sm[Math.max(0, i - half)]
    const bE = sm[Math.min(sm.length - 1, i + half)]
    const aO = on[Math.max(0, i - half)]
    const bO = on[Math.min(sm.length - 1, i + half)]
    novE[i] = Math.abs(bE - aE)
    novO[i] = Math.abs(bO - aO)
    if (novE[i] > maxE) maxE = novE[i]
    if (novO[i] > maxO) maxO = novO[i]
  }
  const novelty = new Float32Array(sm.length)
  for (let i = 0; i < sm.length; i++) novelty[i] = 0.65 * (novE[i] / maxE) + 0.35 * (novO[i] / maxO)

  // 候选边界：新奇度局部极大，彼此至少间隔 12s，最多 11 个内部边界
  const minGap = Math.max(2, Math.round(12 * fps))
  const cands: { i: number; v: number }[] = []
  for (let i = 1; i < novelty.length - 1; i++) {
    if (novelty[i] > novelty[i - 1] && novelty[i] >= novelty[i + 1]) cands.push({ i, v: novelty[i] })
  }
  cands.sort((a, b) => b.v - a.v)
  const picked: number[] = []
  for (const c of cands) {
    if (picked.every((p) => Math.abs(p - c.i) >= minGap)) picked.push(c.i)
    if (picked.length >= 11) break
  }
  // 边界吸附：±1s 内起音最强的帧（段落切换通常落在重拍上）
  const snapFrames = Math.max(2, Math.round(1 * fps))
  const snapped = picked.map((i) => {
    let best = i
    let bestV = -1
    for (let j = Math.max(1, i - snapFrames); j <= Math.min(flux.length - 1, i + snapFrames); j++) {
      if (flux[j] > bestV) {
        bestV = flux[j]
        best = j
      }
    }
    return best
  })
  // 过滤太靠边的边界（离首尾 < 8s）
  const edge = Math.round(8 * fps)
  const bounds = [0, ...snapped.filter((i) => i > edge && i < novelty.length - edge).sort((a, b) => a - b), novelty.length - 1]

  // 分段并按能量分级
  const raw = bounds.slice(0, -1).map((b, k) => {
    const e = bounds[k + 1]
    const start = b / fps
    const end = Math.min(duration, e / fps)
    let s = 0
    let c = 0
    for (let i = b; i < e; i++) {
      s += sm[i]
      c++
    }
    return { start, end, energy: c ? round2(s / c) : 0 }
  })

  // 按能量强度分级（分位阈值）+ 依邻居上下文命名
  const energies = raw.map((r) => r.energy).sort((a, b) => a - b)
  const q = (p: number) => energies[Math.min(energies.length - 1, Math.floor(p * energies.length))] ?? 0
  const t1 = Math.max(0.16, q(0.3))
  const t2 = Math.max(t1 + 0.06, q(0.62))
  const t3 = Math.max(t2 + 0.06, q(0.88))

  const intensities = raw.map((r) =>
    r.energy < t1 ? ('quiet' as Intensity) : r.energy < t2 ? ('medium' as Intensity) : r.energy < t3 ? ('loud' as Intensity) : ('climax' as Intensity)
  )
  return raw.map((r, k) => ({
    ...r,
    intensity: intensities[k],
    label: sectionLabel(k, raw.length, intensities[k], intensities[k - 1], intensities[k + 1]),
  }))
}

function sectionLabel(index: number, total: number, cur: Intensity, prev?: Intensity, next?: Intensity): string {
  const pos = index === 0 ? '前奏' : index === total - 1 ? '尾奏' : ''
  const lvl: Record<Intensity, string> = { quiet: '安静', medium: '铺陈', loud: '强', climax: '爆发' }
  if (pos) return `${pos} · ${lvl[cur]}`
  const stronger = (x?: Intensity) => x === 'loud' || x === 'climax'
  if (stronger(cur)) return index >= total - 3 ? `终副歌 · ${lvl[cur]}` : `副歌 · ${lvl[cur]}`
  if (cur === 'quiet') {
    // 夹在两个更强段之间 → 间奏；前半段的安静 → 主歌（歌曲通常从安静主歌开始）
    if (stronger(prev) && stronger(next)) return `间奏 · ${lvl[cur]}`
    if (index < total * 0.45 && !stronger(prev)) return `主歌 · ${lvl[cur]}`
    if (stronger(prev)) return `间奏 · ${lvl[cur]}`
    return `安静段 · ${lvl[cur]}`
  }
  return `主歌 · ${lvl[cur]}`
}

function detectSilenceGaps(norm: Float32Array, fps: number, duration: number): { start: number; end: number }[] {
  const threshold = 0.045 // 相对最大能量
  const minLen = Math.max(2, Math.round(0.5 * fps))
  const raw: { start: number; end: number }[] = []
  let runStart = -1
  const closeRun = (endIdx: number) => {
    if (runStart >= 0 && endIdx - runStart >= minLen) {
      raw.push({ start: runStart / fps, end: endIdx / fps })
    }
    runStart = -1
  }
  for (let i = 0; i < norm.length; i++) {
    const silent = norm[i] < threshold
    if (silent && runStart < 0) runStart = i
    if (!silent) closeRun(i)
  }
  closeRun(norm.length)

  // 上下文校验：缺口前后 8s 必须明显更响（≥3 倍阈值），
  // 否则视为安静段内部的正常低电平，不算设计性静音
  const ctxFrames = Math.round(8 * fps)
  const verified = raw.filter((g) => {
    const s0 = Math.max(0, Math.floor(g.start * fps) - ctxFrames)
    const s1 = Math.floor(g.start * fps)
    const e0 = Math.min(norm.length - 1, Math.ceil(g.end * fps) + ctxFrames)
    const e1 = Math.ceil(g.end * fps)
    let before = 0
    let bc = 0
    for (let i = s0; i < s1; i++) {
      before += norm[i]
      bc++
    }
    let after = 0
    let ac = 0
    for (let i = e1; i < e0; i++) {
      after += norm[i]
      ac++
    }
    const ctx = Math.max(bc ? before / bc : 0, ac ? after / ac : 0)
    return ctx >= threshold * 3
  })

  // 合并相隔 <0.8s 的相邻缺口
  const merged: { start: number; end: number }[] = []
  for (const g of verified) {
    const last = merged[merged.length - 1]
    if (last && g.start - last.end < 0.8) last.end = g.end
    else merged.push({ ...g })
  }
  // 只保留曲中的静音缺口（首尾的静音是留白，不是设计点）
  return merged
    .map((g) => ({ start: round1(g.start), end: round1(g.end) }))
    .filter((g) => g.start > 1 && g.end < duration - 1 && g.end - g.start >= 0.5)
}

function downsample(arr: Float32Array, points: number): number[] {
  const out: number[] = []
  const bucket = arr.length / points
  for (let p = 0; p < points; p++) {
    const a = Math.floor(p * bucket)
    const b = Math.min(arr.length, Math.floor((p + 1) * bucket))
    let s = 0
    let c = 0
    for (let i = a; i < b; i++) {
      s += arr[i]
      c++
    }
    out.push(round2(c ? s / c : 0))
  }
  return out
}

// ============ 展示辅助 ============

export const INTENSITY_LABEL: Record<Intensity, string> = {
  quiet: '安静',
  medium: '铺陈',
  loud: '强',
  climax: '爆发',
}

/** 秒 → m:ss.d 时间码（与手册格式一致） */
export function formatTc(sec: number): string {
  const s = Math.max(0, sec)
  const m = Math.floor(s / 60)
  const r = s - m * 60
  const whole = Math.floor(r)
  const tenth = Math.floor((r - whole) * 10)
  return `${m}:${String(whole).padStart(2, '0')}.${tenth}`
}

function round1(v: number): number {
  return Math.round(v * 10) / 10
}
function round2(v: number): number {
  return Math.round(v * 100) / 100
}
