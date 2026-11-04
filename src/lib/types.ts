// 共享类型定义

export type TabKey = 'styles' | 'prompts' | 'effects' | 'studio'

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
}

// ===== 工坊表单 =====

export type AspectKey = '16:9' | '9:16' | '1:1'
export type FrameworkKey = 'hyperframes' | 'remotion' | 'p5js' | 'generic'
export type PacingKey = 'slow' | 'medium' | 'fast'

export interface StudioFormState {
  idea: string
  videoType: string
  styleSlug: string // 'auto' 或风格 slug
  duration: number // 15 | 30 | 60 | 90
  aspect: AspectKey
  framework: FrameworkKey
  pacing: PacingKey
  extra: string
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
