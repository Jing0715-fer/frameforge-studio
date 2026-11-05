'use client'

// 演示歌曲合成：纯 JS 数值合成 PCM（不经 WebAudio 渲染图，快且完全确定）
// 段落边界/能量与《声》分镜手册的 10 个单元一致，并埋入手册设计的 2:56.5 静音缺口
// 用于「音画对齐」工坊的一键演示（无需上传音频也能体验完整链路）
// 注：合成数学与《声》结构（103 BPM · Am-F-C-G · 各段配器随能量增减）对应

import { DEMO_SONG_SECTIONS, DEMO_SILENCE_GAP, DEMO_BPM } from './demo-data'
import type { AudioSection } from './audio-analysis'

const SR = 22050
const BEAT = 60 / DEMO_BPM // 103 BPM → 0.5825s

/** 与 AudioBuffer 兼容的最小接口（分析与 WAV 编码只需要这些） */
export interface RenderedAudio {
  numberOfChannels: number
  length: number
  sampleRate: number
  getChannelData(channel: number): Float32Array
}

/** 和弦进行 Am–F–C–G（每小节一个） */
const CHORDS: { bass: number; pad: number[] }[] = [
  { bass: 110.0, pad: [220.0, 261.63, 329.63] }, // Am
  { bass: 87.31, pad: [174.61, 220.0, 261.63] }, // F
  { bass: 130.81, pad: [261.63, 329.63, 392.0] }, // C
  { bass: 98.0, pad: [196.0, 246.94, 293.66] }, // G
]
const LEAD_SCALE = [440.0, 493.88, 523.25, 587.33, 659.25] // A4 B4 C5 D5 E5

function sectionAt(t: number): (typeof DEMO_SONG_SECTIONS)[number] | null {
  for (const s of DEMO_SONG_SECTIONS) {
    if (t >= s.start && t < s.end) return s
  }
  return null
}

/** 合成演示歌曲（同步、确定性、约几百毫秒） */
export function synthesizeDemoSong(): RenderedAudio {
  const duration = DEMO_SONG_SECTIONS[DEMO_SONG_SECTIONS.length - 1].end + 0.15
  const n = Math.ceil(SR * duration)
  const pcm = new Float32Array(n)

  // ---- 节拍栅格：鼓组 / 贝斯 / 主音 ----
  const totalBeats = Math.floor(duration / BEAT)
  for (let k = 0; k < totalBeats; k++) {
    const t = k * BEAT
    const sec = sectionAt(t)
    if (!sec) continue
    // 静音缺口内完全静默（手册：2:56.5 抽掉环境声）
    if (t >= DEMO_SILENCE_GAP.start - 0.1 && t < DEMO_SILENCE_GAP.end) continue

    const energy = sec.energy
    const barPos = k % 4
    const bar = Math.floor(k / 4)
    const chord = CHORDS[bar % CHORDS.length]
    const i0 = Math.floor(t * SR)

    // 底鼓：爆发/强段每拍；中段每 2 拍；安静段每 4 拍且更弱
    const kickEvery = energy >= 0.6 ? 1 : energy >= 0.35 ? 2 : 4
    if (k % kickEvery === 0) {
      const vel = 0.5 + 0.5 * energy
      const len = Math.floor(0.26 * SR)
      for (let i = 0; i < len && i0 + i < n; i++) {
        const tt = i / SR
        const env = 0.9 * vel * Math.exp(-tt / 0.035)
        const f = 130 * Math.exp(-tt / 0.05) + 44 * (1 - Math.exp(-tt / 0.05))
        pcm[i0 + i] += env * Math.sin(2 * Math.PI * f * tt) * Math.exp(-tt / 0.05) * 5
      }
    }
    // 踩镲（反拍）：中强以上
    if (energy >= 0.45) {
      const len = Math.floor(0.05 * SR)
      const ih = Math.floor((t + BEAT / 2) * SR)
      const v = 0.1 + 0.22 * energy
      for (let i = 0; i < len && ih + i < n; i++) {
        const tt = i / SR
        pcm[ih + i] += v * Math.exp(-tt / 0.012) * (Math.random() * 2 - 1)
      }
    }
    // 军鼓（拍 2/4）：强段
    if (energy >= 0.6 && barPos % 2 === 1) {
      const len = Math.floor(0.16 * SR)
      const v = 0.25 + 0.45 * energy
      for (let i = 0; i < len && i0 + i < n; i++) {
        const tt = i / SR
        pcm[i0 + i] += v * 0.7 * Math.exp(-tt / 0.05) * (Math.random() * 2 - 1)
      }
    }
    // 贝斯：安静段每小节头，其他每拍（锯齿 + 指数衰减）
    if (energy >= 0.35 || barPos === 0) {
      const len = Math.floor(BEAT * 0.9 * SR)
      const v = (0.1 + 0.16 * energy) * 0.6
      const f = chord.bass
      for (let i = 0; i < len && i0 + i < n; i++) {
        const tt = i / SR
        pcm[i0 + i] += v * Math.exp(-tt / 0.18) * Math.sign(Math.sin(2 * Math.PI * f * tt))
      }
    }
    // 主音旋律：副歌/爆发段的偶数拍（三角波）
    if (energy >= 0.7 && barPos % 2 === 0) {
      const len = Math.floor(BEAT * 0.85 * SR)
      const v = 0.08 + 0.12 * energy
      const f = LEAD_SCALE[(bar * 2 + barPos) % LEAD_SCALE.length]
      for (let i = 0; i < len && i0 + i < n; i++) {
        const tt = i / SR
        const tri = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * f * tt))
        pcm[i0 + i] += v * Math.exp(-tt / 0.3) * tri
      }
    }
  }

  // ---- 长音铺底：每段一个和弦，幅度随能量 ----
  for (const sec of DEMO_SONG_SECTIONS) {
    const v = 0.028 + 0.075 * sec.energy
    const chord = CHORDS[Math.floor(sec.start / (BEAT * 4)) % CHORDS.length]
    const i0 = Math.floor(sec.start * SR)
    const i1 = Math.min(n, Math.floor(sec.end * SR))
    const [f1, , f3] = chord.pad
    for (let i = i0; i < i1; i++) {
      const tt = (i - i0) / SR
      const attack = Math.min(1, tt / 1.4)
      pcm[i] += v * attack * 0.8 * (Math.sin(2 * Math.PI * f1 * tt) + Math.sin(2 * Math.PI * f3 * tt)) / 2
    }
  }

  // ---- 尾奏淡出 + 削波 ----
  const fadeStart = Math.floor(258 * SR)
  for (let i = fadeStart; i < n; i++) {
    pcm[i] *= Math.max(0, 1 - (i / SR - 258) / (duration - 258))
  }
  for (let i = 0; i < n; i++) {
    pcm[i] = Math.max(-1, Math.min(1, pcm[i]))
  }

  return {
    numberOfChannels: 1,
    length: n,
    sampleRate: SR,
    getChannelData: () => pcm,
  }
}

// ============ WAV 编码（演示曲 PCM → 可播放 URL） ============

export function audioBufferToWavUrl(buffer: RenderedAudio): string {
  const channels = Math.min(2, buffer.numberOfChannels)
  const len = buffer.length
  const bytesPerSample = 2
  const blockAlign = channels * bytesPerSample
  const dataSize = len * blockAlign
  const ab = new ArrayBuffer(44 + dataSize)
  const view = new DataView(ab)

  writeStr(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(view, 8, 'WAVE')
  writeStr(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, channels, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeStr(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  const chData: Float32Array[] = []
  for (let c = 0; c < channels; c++) chData.push(buffer.getChannelData(c))
  let offset = 44
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < channels; c++) {
      const s = Math.max(-1, Math.min(1, chData[c][i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
      offset += 2
    }
  }
  return URL.createObjectURL(new Blob([ab], { type: 'audio/wav' }))
}

function writeStr(view: DataView, offset: number, s: string) {
  for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i))
}

/** 演示段落标注（供 UI 对照展示「设计值 vs 分析值」） */
export const DEMO_DESIGN_SECTIONS: AudioSection[] = DEMO_SONG_SECTIONS.map((s) => ({
  start: s.start,
  end: s.end,
  energy: s.energy,
  intensity: s.intensity as AudioSection['intensity'],
  label: s.label,
}))
