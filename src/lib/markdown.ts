import type { StoryboardResult } from './types'
import { FRAMEWORK_LABELS, PACING_LABELS, type FrameworkKey, type PacingKey } from './types'

/** 秒 → mm:ss 时间码 */
export function formatTC(sec: number): string {
  const s = Math.max(0, Math.round(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export interface StoryboardMeta {
  framework: string
  styleName: string
  aspect?: string
  duration?: number
  pacing?: string
}

/** 把分镜结果导出为 Markdown 文档 */
export function buildStoryboardMarkdown(
  result: StoryboardResult,
  meta: StoryboardMeta
): string {
  const L: string[] = []
  const frameworkLabel =
    FRAMEWORK_LABELS[meta.framework as FrameworkKey] ?? meta.framework ?? '-'
  const pacingLabel = PACING_LABELS[meta.pacing as PacingKey] ?? meta.pacing

  L.push(`# ${result.title || '未命名分镜稿'}`)
  L.push('')
  if (result.logline) L.push(`> ${result.logline}`)
  L.push('')
  L.push(
    `**视觉风格**：${result.styleGuide?.name ?? meta.styleName} ｜ **总时长**：${formatTC(
      result.totalDuration ?? meta.duration ?? 0
    )} ｜ **画幅**：${meta.aspect ?? '16:9'} ｜ **节奏**：${pacingLabel ?? '-'}`
  )
  L.push(`**实现框架**：${frameworkLabel}`)
  L.push('')

  if (result.meaningArc || result.energyCurve) {
    L.push('## 全文理解与节奏')
    L.push('')
    if (result.meaningArc) L.push(`- **语义弧线**：${result.meaningArc}`)
    if (result.energyCurve) L.push(`- **能量曲线**：${result.energyCurve}`)
    L.push('')
  }

  if (result.styleGuide) {
    L.push('## 视觉风格指南')
    L.push('')
    if (result.styleGuide.palette?.length) {
      L.push(`- **色板**：${result.styleGuide.palette.join(' ')}`)
    }
    if (result.styleGuide.typography) L.push(`- **字体版式**：${result.styleGuide.typography}`)
    if (result.styleGuide.texture) L.push(`- **质感纹理**：${result.styleGuide.texture}`)
    if (result.styleGuide.motionTone) L.push(`- **动效基调**：${result.styleGuide.motionTone}`)
    L.push('')
  }

  if (result.musicStyle) {
    L.push('## 配乐与音效')
    L.push('')
    L.push(result.musicStyle)
    L.push('')
    if (result.musicPlans?.length) {
      for (const [i, m] of result.musicPlans.entries()) {
        L.push(`- **方案 ${String.fromCharCode(65 + i)}**：${m}`)
      }
      L.push('')
    }
  }

  L.push(`## 分镜脚本（共 ${result.shots.length} 镜）`)
  L.push('')
  for (const shot of result.shots) {
    L.push(
      `### 镜头 ${String(shot.index).padStart(2, '0')} ｜ ${formatTC(shot.start)} – ${formatTC(
        shot.end
      )} ｜ ${shot.shotSize}`
    )
    L.push('')
    if (shot.scene) L.push(`- **画面**：${shot.scene}`)
    if (shot.motion) L.push(`- **动效/运镜**：${shot.motion}`)
    if (typeof shot.energy === 'number') L.push(`- **运动能量**：${shot.energy}/5`)
    if (shot.transition) L.push(`- **转场**：${shot.transition}`)
    if (shot.seamHandoff) L.push(`- **接缝（与下一镜）**：${shot.seamHandoff}`)
    if (shot.readingWindow) L.push(`- **阅读窗**：${shot.readingWindow}`)
    if (shot.emphasisWords) L.push(`- **重点词**：${shot.emphasisWords}`)
    if (shot.caption) L.push(`- **字幕**：${shot.caption}`)
    if (shot.narration) L.push(`- **旁白**：${shot.narration}`)
    if (shot.sfx) L.push(`- **音效**：${shot.sfx}`)
    if (shot.prompt) {
      L.push('')
      L.push('**实现提示词（可直接投喂 AI 编程工具）**')
      L.push('')
      L.push('```')
      L.push(shot.prompt)
      L.push('```')
    }
    L.push('')
  }

  if (result.implementationNotes?.length) {
    L.push('## 整体实现建议')
    L.push('')
    for (const n of result.implementationNotes) L.push(`- ${n}`)
    L.push('')
  }

  if (result.checklist?.length) {
    L.push('## 交付验收清单')
    L.push('')
    for (const c of result.checklist) L.push(`- [ ] ${c}`)
    L.push('')
  }

  L.push('---')
  L.push('由 FrameForge 分镜工坊生成 · 融汇 15 个开源项目 + 341 风格库附件 + fy-code-animation 方法论')
  return L.join('\n')
}

/** 下载文本文件 */
export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
