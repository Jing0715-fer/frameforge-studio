// 共享类型定义

export type TabKey = 'styles' | 'prompts' | 'effects' | 'methodology' | 'studio' | 'sync'

export interface StyleItem {
  id: number
  slug: string
  name: string
  nameEn: string
  category: string
  description: string
  tags: string
  palette: string
  sourceRepo: string
  difficulty: string
  starterPrompt: string
  createdAt: string
  // 附件《代码动画》341 风格库扩展
  series: string // 精选 | AG | M | K | Z | H | L | V | X | R | O
  sid: string // 附件内原始编号，如 A1 / L36 / O12
  looksLike: string // 长什么样
  suitableFor: string // 适合讲什么
  promptFull: string // 完整风格提示词原文
  hasStill: boolean // 是否带静帧参考
}

export interface PromptItem {
  id: number
  title: string
  category: string
  content: string
  tags: string
  sourceRepo: string
  useCase: string
  copyCount: number
  createdAt: string
}

export interface EffectItem {
  id: number
  name: string
  nameEn: string
  category: string
  description: string
  codeSnippet: string
  prompt: string
  sourceRepo: string
  demo: string
}

export interface GenerationRecord {
  id: number
  title: string
  logline: string
  framework: string
  styleName: string
  input: string
  output: string
  createdAt: string
  starred?: boolean
  ideaText?: string
}

// 历史列表项：不带 output/input 大字段（列表 UI 只展示概要；载入时按 id 拉全文）
export interface HistoryListItem {
  id: number
  title: string
  logline: string
  framework: string
  styleName: string
  starred: boolean
  ideaText: string
  createdAt: string
}

// ===== AI 分镜生成结果 =====

export interface StoryboardShot {
  index: number
  start: number
  end: number
  shotSize: string
  scene: string
  motion: string
  transition: string
  caption: string
  narration: string
  sfx: string
  prompt: string
  // fy 方法论增强字段
  energy?: number // 运动能量 0–5
  readingWindow?: string // 静读窗说明
  seamHandoff?: string // 与下一镜的接缝方式
  emphasisWords?: string // 本镜重点词与力度
}

export interface StoryboardStyleGuide {
  name?: string
  palette?: string[]
  typography?: string
  texture?: string
  motionTone?: string
}

export interface StoryboardResult {
  title: string
  logline: string
  styleGuide?: StoryboardStyleGuide
  musicStyle?: string
  totalDuration?: number
  shots: StoryboardShot[]
  implementationNotes?: string[]
  checklist?: string[]
  // fy 方法论增强字段
  meaningArc?: string // 全文理解：主旨与观众理解变化
  energyCurve?: string // 节奏与能量曲线说明
  musicPlans?: string[] // 音乐四案
}

// ===== 任务卡模式 =====

export interface TaskCardResult {
  title: string
  markdown: string // 完整任务卡 Markdown 文档
}

// ===== 工坊表单 =====

export type AspectKey = '16:9' | '9:16' | '1:1'
export type FrameworkKey = 'hyperframes' | 'remotion' | 'p5js' | 'generic'
export type PacingKey = 'slow' | 'medium' | 'fast'
export type OutputModeKey = 'storyboard' | 'taskcard'

export interface StudioFormState {
  idea: string
  videoType: string
  styleSlug: string // 'auto' 或风格 slug
  duration: number // 15 | 30 | 60 | 90
  aspect: AspectKey
  framework: FrameworkKey
  pacing: PacingKey
  extra: string
  outputMode: OutputModeKey // 分镜稿 | 任务卡
}

export const FRAMEWORK_LABELS: Record<FrameworkKey, string> = {
  hyperframes: 'Hyperframes · HTML/CSS→MP4',
  remotion: 'Remotion · React 视频',
  p5js: 'p5.js · 代码手绘',
  generic: '通用 · 剪映/AE/Blender',
}

export const PACING_LABELS: Record<PacingKey, string> = {
  slow: '舒缓叙事',
  medium: '标准节奏',
  fast: '快节奏卡点',
}

export const OUTPUT_MODE_LABELS: Record<OutputModeKey, string> = {
  storyboard: '分镜稿 · 逐镜实现提示词',
  taskcard: '任务卡 · fy 全案设计文档',
}

export const VIDEO_TYPES = [
  '产品发布',
  '品牌宣传片',
  '音乐 MV',
  '知识科普',
  '社交短视频',
  '手绘动画故事',
  '歌词卡拉OK',
  '纪录片叙事',
] as const

// ===== 音画对齐（歌曲 × 分镜稿）=====

export type { AudioAnalysis, AudioSection, Intensity } from './sync/audio-analysis'
export type { BoardShot, BoardUnit, ParsedStoryboard } from './sync/storyboard-parser'

/** AI 优化后的单帧镜头 */
export interface SyncShotResult {
  tc: string
  t: number
  visual: string
  direction: string
  sound: string
  changed: boolean
  reason?: string
  isNew?: boolean
}

/** AI 优化后的分镜单元 */
export interface SyncUnitResult {
  name: string
  range: string
  start: number
  end: number
  matchedSection: string
  cutAdvice: string
  shots: SyncShotResult[]
}

/** 音画对齐优化结果（LLM 输出重建后） */
export interface SyncResult {
  overall: string
  bpmAdvice: string
  retimingNotes: string[]
  units: SyncUnitResult[]
}

/** 历史项目列表项（不带大字段） */
export interface SyncProjectListItem {
  id: number
  songName: string
  duration: number
  bpm: number
  unitCount: number
  shotCount: number
  createdAt: string
}

// ===== 风格系列元数据 =====
export interface SeriesInfo {
  key: string
  label: string
  desc: string
}

export const STYLE_SERIES: SeriesInfo[] = [
  { key: '精选', label: '精选详解', desc: '带色板/难度/起始提示词的手工精讲风格' },
  { key: 'AG', label: 'A–G 代码样片', desc: '字/粒子/线与墨/光与天气/图形与纸/讲解/质感，附参考实现代码' },
  { key: 'M', label: 'M 动态风格', desc: '整段视频怎么动、怎么剪、怎么讲的结构风格' },
  { key: 'K', label: 'K 卡通画风', desc: '角色和画面长什么样的卡通画风' },
  { key: 'Z', label: 'Z 中国风', desc: '水墨、工笔、剪纸、皮影、敦煌、青花、书法…' },
  { key: 'H', label: 'H 现成版式', desc: '配色加字体的整套现成搭配' },
  { key: 'L', label: 'L Lemo-Opuscar', desc: 'Lemo-Opuscar 59 种风格，每种有完整做法' },
  { key: 'V', label: 'V mg-styles-15', desc: 'mg-styles-15 的 15 种 MG 动效风格' },
  { key: 'X', label: 'X code-video', desc: 'code-video 的 31 种风格' },
  { key: 'R', label: 'R 照参考学来的', desc: '照参考学着用代码画的赛博朋克等' },
  { key: 'O', label: 'O 奥斯卡 98 部', desc: '98 部奥斯卡最佳影片，每部一种画风' },
]
