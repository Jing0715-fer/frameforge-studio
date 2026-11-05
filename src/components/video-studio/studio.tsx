'use client'

import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Check,
  ChevronsUpDown,
  Clapperboard,
  Clock,
  Download,
  FileText,
  LayoutTemplate,
  Loader2,
  MessageSquare,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  Square,
  Star,
  Wand2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { HistorySection } from './history-section'
import { StoryboardResultView } from './storyboard-result'
import { StylePreview } from './style-preview'
import { buildStoryboardMarkdown, downloadTextFile, type StoryboardMeta } from '@/lib/markdown'
import { copyText, useAppStore, useFavStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  FRAMEWORK_LABELS,
  OUTPUT_MODE_LABELS,
  PACING_LABELS,
  VIDEO_TYPES,
  type AspectKey,
  type FrameworkKey,
  type GenerationRecord,
  type HistoryListItem,
  type OutputModeKey,
  type PacingKey,
  type PromptItem,
  type StoryboardResult,
  type StyleItem,
} from '@/lib/types'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface CurrentGeneration {
  id: number
  meta: StoryboardMeta
  result: StoryboardResult
}

export interface CurrentTaskCard {
  id: number
  meta: StoryboardMeta
  title: string
  markdown: string
}

export function parseGeneration(g: GenerationRecord): CurrentGeneration | null {
  try {
    const output = typeof g.output === 'string' ? JSON.parse(g.output) : g.output
    const input = typeof g.input === 'string' ? JSON.parse(g.input || '{}') : g.input ?? {}
    if (!output?.shots?.length) return null
    return {
      id: g.id,
      meta: {
        framework: g.framework,
        styleName: g.styleName,
        aspect: input.aspect,
        duration: input.duration,
        pacing: input.pacing,
      },
      result: output as StoryboardResult,
    }
  } catch {
    return null
  }
}

export function parseTaskCard(g: GenerationRecord): CurrentTaskCard | null {
  try {
    const output = typeof g.output === 'string' ? JSON.parse(g.output) : g.output
    if (!output?.markdown) return null
    const input = typeof g.input === 'string' ? JSON.parse(g.input || '{}') : g.input ?? {}
    return {
      id: g.id,
      meta: {
        framework: g.framework,
        styleName: g.styleName,
        aspect: input.aspect,
        duration: input.duration,
        pacing: input.pacing,
      },
      title: output.title ?? g.title,
      markdown: output.markdown as string,
    }
  } catch {
    return null
  }
}

const EXAMPLE_IDEAS = [
  '一支 30 秒的本土咖啡品牌宣传片：清晨烘焙工坊，咖啡豆从生豆到研磨的特写，蒸汽与暖光交织，最后落在品牌 slogan「每一杯都有 Sunrise」上',
  '9:16 竖屏手机 App 发布短视频：快节奏卡点展示 5 个核心功能界面，科技感十足，结尾引导「点击下载」',
  '水墨风格的古诗意境短片：一叶扁舟从留白处划入，远山以浓淡墨色晕染展开，诗句逐字浮现，古琴配乐',
]

const LOADING_MESSAGES = [
  '正在读懂你的创意与语义结构…',
  '正在检索风格库并翻译视觉语法…',
  '正在做语义分段与镜头信息任务设计…',
  '正在编排时间轴、阅读窗与接缝…',
  '正在撰写逐镜头实现提示词…',
  '正在按质量底线做连贯性验收…',
]

const TASKCARD_LOADING_MESSAGES = [
  '正在做全文理解与语义分段…',
  '正在设计重点词三级力度…',
  '正在写风格卡与统一视觉系统…',
  '正在写逐镜分镜与事件表…',
  '正在设计音乐四案与音效表…',
  '正在整理检查计划与风险清单…',
]

const REFINING_MESSAGES = [
  'AI 导演正在重读原稿…',
  '正在按指令逐处修改…',
  '正在核对时间轴与阅读窗…',
  '正在做修改后的连贯性验收…',
]

// AI 改稿常用指令
const QUICK_REFINE_INSTRUCTIONS = [
  '整体节奏再紧凑一些，去掉铺垫镜头',
  '第 1 镜改成更抓眼的开场钩子',
  '字幕全部缩短到 10 字以内',
  '结尾加一个品牌 Logo 收束镜头',
  '每个镜头的实现提示词再具体一点，写清缓动参数',
]

export function Studio({
  styles,
  prompts,
  history,
  onHistoryChange,
}: {
  styles: StyleItem[]
  prompts: PromptItem[]
  history: HistoryListItem[]
  onHistoryChange: Dispatch<SetStateAction<HistoryListItem[]>>
}) {
  const form = useAppStore((s) => s.form)
  const patchForm = useAppStore((s) => s.patchForm)

  const [generating, setGenerating] = useState(false)
  const [current, setCurrent] = useState<CurrentGeneration | null>(null)
  const [taskCard, setTaskCard] = useState<CurrentTaskCard | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  // 历史载入状态（按需拉全文）
  const [loadingHistoryId, setLoadingHistoryId] = useState<number | null>(null)

  // 风格下拉按系列分组
  const styleSeries = useMemo(() => {
    const order = ['精选', 'AG', 'M', 'K', 'Z', 'H', 'L', 'V', 'X', 'R', 'O']
    const labels: Record<string, string> = {
      精选: '精选详解',
      AG: 'A–G 代码样片',
      M: 'M 动态风格',
      K: 'K 卡通画风',
      Z: 'Z 中国风',
      H: 'H 现成版式',
      L: 'L Lemo-Opuscar',
      V: 'V mg-styles-15',
      X: 'X code-video',
      R: 'R 照参考学来的',
      O: 'O 奥斯卡 98 部',
    }
    return order
      .map((key) => ({
        key,
        label: labels[key] ?? key,
        items: styles.filter((s) => (s.series || '精选') === key),
      }))
      .filter((g) => g.items.length > 0)
  }, [styles])

  // 当前选中的风格（auto 时为 null）
  const selectedStyle = useMemo(
    () => (form.styleSlug === 'auto' ? null : styles.find((s) => s.slug === form.styleSlug) ?? null),
    [form.styleSlug, styles]
  )

  useEffect(() => {
    return () => timersRef.current.forEach(clearInterval)
  }, [])

  function randomIdea() {
    if (!prompts.length) return
    const oneLiners = prompts.filter((p) => p.category === '一句话灵感')
    const pool = oneLiners.length ? oneLiners : prompts
    const pick = pool[Math.floor(Math.random() * pool.length)]
    patchForm({ idea: pick.content })
    toast.success(`已填入灵感：${pick.title}`)
  }

  async function handleGenerate() {
    if (!form.idea.trim()) {
      toast.error('请先描述你的视频创意', {
        description: '也可以点击「随机灵感」或从 Prompt 库带入一条',
      })
      return
    }
    setGenerating(true)
    setCurrent(null)
    setTaskCard(null)
    setElapsed(0)
    setStatusIdx(0)

    const messages = form.outputMode === 'taskcard' ? TASKCARD_LOADING_MESSAGES : LOADING_MESSAGES
    timersRef.current.forEach(clearInterval)
    const t1 = setInterval(() => setElapsed((e) => e + 1), 1000)
    const t2 = setInterval(() => setStatusIdx((i) => (i + 1) % messages.length), 4500)
    timersRef.current = [t1, t2]

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '生成失败')

      const gen = data.generation as GenerationRecord & {
        output: StoryboardResult | { title: string; markdown: string } | string
      }
      const meta: StoryboardMeta = {
        framework: form.framework,
        styleName:
          form.styleSlug === 'auto'
            ? 'AI 自由发挥'
            : (styles.find((s) => s.slug === form.styleSlug)?.name ?? 'AI 自由发挥'),
        aspect: form.aspect,
        duration: form.duration,
        pacing: form.pacing,
      }

      if (form.outputMode === 'taskcard') {
        const output = typeof gen.output === 'string' ? JSON.parse(gen.output) : gen.output
        const card: CurrentTaskCard = {
          id: gen.id,
          meta,
          title: (output as { title?: string })?.title ?? '动画任务卡',
          markdown: (output as { markdown?: string })?.markdown ?? '',
        }
        setTaskCard(card)
        // 函数式更新：用最新 state 拼接，避免长请求期间删除被覆盖（竞态）
        onHistoryChange((prev) =>
          [
            {
              id: gen.id,
              title: card.title,
              logline: gen.logline ?? '',
              framework: gen.framework ?? form.framework,
              styleName: card.meta.styleName,
              starred: false,
              ideaText: form.idea,
              createdAt: gen.createdAt ?? new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 24)
        )
        toast.success(`任务卡《${card.title}》已生成`, {
          description: '12 节 fy 全案设计文档 · 可直接交给工程阶段开工',
        })
      } else {
        const result: StoryboardResult =
          typeof gen.output === 'string' ? JSON.parse(gen.output) : (gen.output as StoryboardResult)
        setCurrent({
          id: gen.id,
          meta: {
            ...meta,
            styleName:
              form.styleSlug === 'auto' ? result.styleGuide?.name ?? 'AI 自由发挥' : meta.styleName,
          },
          result,
        })
        onHistoryChange((prev) =>
          [
            {
              id: gen.id,
              title: result.title,
              logline: result.logline ?? '',
              framework: gen.framework ?? form.framework,
              styleName: result.styleGuide?.name ?? meta.styleName,
              starred: false,
              ideaText: form.idea,
              createdAt: gen.createdAt ?? new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 24)
        )
        toast.success(`分镜稿《${result.title}》已生成`, {
          description: `${result.shots.length} 个镜头 · 总时长 ${result.totalDuration ?? form.duration} 秒`,
        })
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '生成失败，请重试')
    } finally {
      timersRef.current.forEach(clearInterval)
      timersRef.current = []
      setGenerating(false)
    }
  }

  /** 历史载入：列表项不含大字段，按需拉 /api/generations/[id] 全文 */
  async function loadFromHistory(id: number) {
    if (loadingHistoryId) return
    setLoadingHistoryId(id)
    try {
      const res = await fetch(`/api/generations/${id}`)
      if (!res.ok) {
        toast.error(res.status === 404 ? '该记录不存在或已删除' : '载入失败')
        return
      }
      const data = await res.json()
      const g = data.generation as GenerationRecord
      const card = parseTaskCard(g)
      if (card) {
        setCurrent(null)
        setTaskCard(card)
        toast.success(`已载入任务卡《${card.title}》`)
        return
      }
      const parsed = parseGeneration(g)
      if (parsed) {
        setTaskCard(null)
        setCurrent(parsed)
        toast.success(`已载入《${parsed.result.title}》`)
      } else {
        toast.error('该记录数据异常，无法载入')
      }
    } catch {
      toast.error('载入失败，请检查网络')
    } finally {
      setLoadingHistoryId(null)
    }
  }

  async function deleteHistory(id: number) {
    const res = await fetch(`/api/generations?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      onHistoryChange((prev) => prev.filter((h) => h.id !== id))
      if (current?.id === id) setCurrent(null)
      if (taskCard?.id === id) setTaskCard(null)
      toast.success('已删除该记录')
    } else if (res.status === 404) {
      onHistoryChange((prev) => prev.filter((h) => h.id !== id))
      toast.error('该记录已不存在')
    } else {
      toast.error('删除失败')
    }
  }

  async function toggleStar(id: number, next: boolean) {
    // 乐观更新：先改 UI，失败再回滚
    onHistoryChange((prev) => prev.map((h) => (h.id === id ? { ...h, starred: next } : h)))
    try {
      const res = await fetch('/api/generations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, starred: next }),
      })
      if (!res.ok) throw new Error()
    } catch {
      onHistoryChange((prev) => prev.map((h) => (h.id === id ? { ...h, starred: !next } : h)))
      toast.error('收藏状态保存失败')
    }
  }

  async function copyMarkdown() {
    if (!current) return
    const md = buildStoryboardMarkdown(current.result, current.meta)
    if (await copyText(md)) toast.success('完整分镜稿 Markdown 已复制')
  }

  function downloadMarkdown() {
    if (!current) return
    const md = buildStoryboardMarkdown(current.result, current.meta)
    downloadTextFile(`分镜稿-${current.result.title || 'untitled'}.md`, md)
    toast.success('已下载 .md 文件')
  }

  async function copyAllPrompts() {
    if (!current) return
    const text = current.result.shots
      .map((s, i) => `【镜头 ${String(i + 1).padStart(2, '0')} · ${s.shotSize}】\n${s.prompt}`)
      .join('\n\n')
    if (await copyText(text)) toast.success(`${current.result.shots.length} 条实现提示词已复制`)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-50">AI 分镜工坊</h2>
        <p className="mt-1 text-sm text-zinc-500">
          fy 语义分镜方法驱动 · 可产出逐镜头分镜稿（含阅读窗/接缝/能量曲线）或 12
          节任务卡全案设计，实现提示词直接投喂 Claude Code（Hyperframes / Remotion /
          p5.js / 通用剪辑）
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">
        {/* ===== 左侧表单 ===== */}
        <Card className="border-zinc-800 bg-zinc-900/50 lg:sticky lg:top-20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-amber-400" />
              创作需求
            </CardTitle>
            <CardDescription>表单越具体，分镜越精准</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* 输出模式 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">输出模式</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { key: 'storyboard', label: '分镜稿', desc: '逐镜 JSON · 快', icon: Clapperboard },
                    { key: 'taskcard', label: '任务卡', desc: '12 节全案 · 深', icon: LayoutTemplate },
                  ] as { key: OutputModeKey; label: string; desc: string; icon: typeof Clapperboard }[]
                ).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => patchForm({ outputMode: m.key })}
                    className={cn(
                      'flex flex-col items-start rounded-lg border p-2.5 text-left transition-colors',
                      form.outputMode === m.key
                        ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    )}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-semibold">
                      <m.icon className="size-3.5" />
                      {m.label}
                    </span>
                    <span className="mt-0.5 text-[10px] opacity-70">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 创意描述 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="idea" className="text-xs font-medium text-zinc-300">
                  创意描述 <span className="text-rose-400">*</span>
                </label>
                <button
                  onClick={randomIdea}
                  className="flex items-center gap-1 text-[11px] text-amber-400/90 hover:text-amber-300"
                >
                  <Sparkles className="size-3" />
                  随机灵感
                </button>
              </div>
              <Textarea
                id="idea"
                value={form.idea}
                onChange={(e) => patchForm({ idea: e.target.value })}
                placeholder="例：为「山野」气泡水做一支 30 秒发布短片，画面要清爽自然，突出 0 糖 0 脂，结尾是产品全家福…"
                rows={4}
                className="resize-none border-zinc-800 bg-zinc-950/60 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
              />
            </div>

            {/* 视频类型 + 风格 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">视频类型</label>
                <Select
                  value={form.videoType}
                  onValueChange={(v) => patchForm({ videoType: v })}
                >
                  <SelectTrigger className="h-9 border-zinc-800 bg-zinc-950/60 text-sm text-zinc-200 focus-visible:ring-amber-500/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-200">
                    {VIDEO_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">视觉风格</label>
                <StyleCombobox styles={styles} series={styleSeries} />
              </div>
            </div>

            {/* 选中风格的小样预览（全宽） */}
            {selectedStyle && (
              <div className="flex gap-3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                <StylePreview style={selectedStyle} className="h-[4.5rem] w-28 shrink-0 sm:h-20 sm:w-32" rounded="rounded-md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-semibold text-zinc-200">{selectedStyle.name}</span>
                    <span className="shrink-0 font-mono text-[10px] uppercase text-zinc-500">
                      {selectedStyle.sid || selectedStyle.nameEn}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
                    {selectedStyle.looksLike || selectedStyle.description}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {(selectedStyle.palette || '').split(',').filter((x) => x.trim()).slice(0, 4).map((col, i) => (
                      <span key={i} className="size-2.5 rounded-full border border-white/20" style={{ background: col.trim() }} />
                    ))}
                    <span className="text-[10px] text-zinc-600">风格小样 · 完整提示词见风格素材库</span>
                  </div>
                </div>
              </div>
            )}

            {/* 时长 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">总时长</label>
              <SegmentedControl
                options={[
                  { value: '15', label: '15s' },
                  { value: '30', label: '30s' },
                  { value: '60', label: '60s' },
                  { value: '90', label: '90s' },
                ]}
                value={String(form.duration)}
                onChange={(v) => patchForm({ duration: Number(v) })}
              />
            </div>

            {/* 画幅 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">画幅</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: '16:9', label: '横屏 16:9', icon: <Monitor className="size-3.5" /> },
                    { key: '9:16', label: '竖屏 9:16', icon: <Smartphone className="size-3.5" /> },
                    { key: '1:1', label: '方形 1:1', icon: <Square className="size-3.5" /> },
                  ] as { key: AspectKey; label: string; icon: React.ReactNode }[]
                ).map((a) => (
                  <button
                    key={a.key}
                    onClick={() => patchForm({ aspect: a.key })}
                    className={cn(
                      'flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors',
                      form.aspect === a.key
                        ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    )}
                  >
                    {a.icon}
                    {a.key}
                  </button>
                ))}
              </div>
            </div>

            {/* 框架 + 节奏 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">实现框架</label>
              <Select
                value={form.framework}
                onValueChange={(v) => patchForm({ framework: v as FrameworkKey })}
              >
                <SelectTrigger className="h-9 border-zinc-800 bg-zinc-950/60 text-sm text-zinc-200 focus-visible:ring-amber-500/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-200">
                  {(Object.keys(FRAMEWORK_LABELS) as FrameworkKey[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {FRAMEWORK_LABELS[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">节奏</label>
              <SegmentedControl
                options={[
                  { value: 'slow', label: PACING_LABELS.slow },
                  { value: 'medium', label: PACING_LABELS.medium },
                  { value: 'fast', label: PACING_LABELS.fast },
                ]}
                value={form.pacing}
                onChange={(v) => patchForm({ pacing: v as PacingKey })}
              />
            </div>

            {/* 附加要求 */}
            <div className="space-y-1.5">
              <label htmlFor="extra" className="text-xs font-medium text-zinc-300">
                附加要求 <span className="text-zinc-600">（可选）</span>
              </label>
              <Input
                id="extra"
                value={form.extra}
                onChange={(e) => patchForm({ extra: e.target.value })}
                placeholder="如：必须露出 Logo、参考 Apple 发布会调性…"
                className="h-9 border-zinc-800 bg-zinc-950/60 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="h-12 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-base font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400"
            >
              {generating ? (
                <>
                  <Loader2 className="size-4 ff-spin-slow" />
                  AI 导演创作中…
                </>
              ) : (
                <>
                  <Clapperboard className="size-4" />
                  生成完整分镜
                </>
              )}
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-zinc-600">
              通常需要 30~90 秒 · 生成结果自动保存到历史
            </p>
          </CardContent>
        </Card>

        {/* ===== 右侧结果区 ===== */}
        <div className="min-h-96">
          {generating ? (
            <LoadingPanel
              elapsed={elapsed}
              message={
                (form.outputMode === 'taskcard' ? TASKCARD_LOADING_MESSAGES : LOADING_MESSAGES)[
                  statusIdx
                ]
              }
            />
          ) : current ? (
            <StoryboardResultView
              current={current}
              onCopyMarkdown={copyMarkdown}
              onDownload={downloadMarkdown}
              onCopyAllPrompts={copyAllPrompts}
            />
          ) : taskCard ? (
            <TaskCardView
              card={taskCard}
              onCopy={async () => {
                if (await copyText(taskCard.markdown)) toast.success('任务卡 Markdown 已复制')
              }}
              onDownload={() => {
                downloadTextFile(`任务卡-${taskCard.title || 'untitled'}.md`, taskCard.markdown)
                toast.success('已下载 .md 文件')
              }}
            />
          ) : (
            <EmptyPanel onPick={(idea) => patchForm({ idea })} />
          )}

          {/* ===== AI 改稿：对当前结果下增量修改指令 ===== */}
          {!generating && (current || taskCard) && (
            <RefinePanel
              key={current?.id ?? taskCard?.id}
              targetId={(current ?? taskCard)!.id}
              kind={current ? 'storyboard' : 'taskcard'}
              onRefined={(gen) => {
                if (current) {
                  const parsed = parseGeneration(gen)
                  if (parsed) {
                    setCurrent(parsed)
                    onHistoryChange((prev) =>
                      prev.map((h) =>
                        h.id === parsed.id
                          ? { ...h, title: parsed.result.title, logline: parsed.result.logline ?? h.logline }
                          : h
                      )
                    )
                    toast.success(`已改稿《${parsed.result.title}》`, {
                      description: `${parsed.result.shots.length} 个镜头 · 原记录已更新`,
                    })
                  } else {
                    toast.error('改稿返回数据异常')
                  }
                } else if (taskCard) {
                  const card = parseTaskCard(gen)
                  if (card) {
                    setTaskCard(card)
                    onHistoryChange((prev) =>
                      prev.map((h) => (h.id === card.id ? { ...h, title: card.title } : h))
                    )
                    toast.success(`已改稿《${card.title}》`, { description: '原任务卡已更新' })
                  } else {
                    toast.error('改稿返回数据异常')
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* ===== 生成历史 ===== */}
      <HistorySection
        history={history}
        currentId={current?.id ?? taskCard?.id}
        loadingId={loadingHistoryId}
        onLoad={loadFromHistory}
        onDelete={deleteHistory}
        onToggleStar={toggleStar}
      />
    </div>
  )
}

// ============================================================
// 风格选择 combobox：369 个风格可搜索 + 收藏置顶（替代无搜索的长下拉）
// ============================================================
function StyleCombobox({
  styles,
  series,
}: {
  styles: StyleItem[]
  series: { key: string; label: string; items: StyleItem[] }[]
}) {
  const form = useAppStore((s) => s.form)
  const patchForm = useAppStore((s) => s.patchForm)
  const favSlugs = useFavStore((s) => s.favSlugs)
  const toggleFav = useFavStore((s) => s.toggleFav)
  const [open, setOpen] = useState(false)

  const selected =
    form.styleSlug === 'auto' ? null : styles.find((s) => s.slug === form.styleSlug) ?? null

  const favStyles = useMemo(
    () => styles.filter((s) => favSlugs.includes(s.slug)),
    [styles, favSlugs]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          aria-controls="style-combobox-list"
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-zinc-950/60 px-3 text-sm text-zinc-200 transition-colors',
            'border-zinc-800 hover:border-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 [&[data-state=open]]:border-amber-500/60'
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            {selected ? (
              <>
                {favSlugs.includes(selected.slug) && (
                  <Star className="size-3 shrink-0 fill-current text-amber-400" />
                )}
                <span className="truncate">{selected.name}</span>
              </>
            ) : (
              <span className="text-zinc-500">✨ AI 自动决定</span>
            )}
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent id="style-combobox-list" className="w-[min(92vw,420px)] border-zinc-800 bg-zinc-900 p-0" align="start">
        <Command loop shouldFilter>
          <CommandInput
            placeholder="搜索风格名称 / 编号 / 关键词…"
            className="border-b border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-600"
          />
          <CommandList className="max-h-80 scrollbar-thin">
            <CommandEmpty className="py-6 text-center text-xs text-zinc-600">
              没有匹配的风格，试试其他关键词
            </CommandEmpty>

            <CommandGroup
              value="auto"
              heading=""
              className="[&>[cmdk-group-heading]]:hidden"
            >
              <CommandItem
                value="auto AI 自动决定 附选择理由"
                onSelect={() => {
                  patchForm({ styleSlug: 'auto' })
                  setOpen(false)
                }}
                className="text-zinc-200 aria-selected:bg-amber-500/10"
              >
                <Sparkles className="size-3.5 text-amber-400" />
                AI 自动决定（附选择理由）
                {form.styleSlug === 'auto' && <Check className="ml-auto size-3.5 text-amber-400" />}
              </CommandItem>
            </CommandGroup>

            {favStyles.length > 0 && (
              <CommandGroup
                heading={
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400/90">
                    <Star className="size-2.5 fill-current" /> 我的收藏（{favStyles.length}）
                  </span>
                }
              >
                {favStyles.map((s) => (
                  <CommandItem
                    key={`fav-${s.slug}`}
                    value={`收藏 ${s.slug} ${s.name} ${s.nameEn} ${s.sid} ${s.tags}`}
                    onSelect={() => {
                      patchForm({ styleSlug: s.slug })
                      setOpen(false)
                    }}
                    className="text-zinc-200 aria-selected:bg-amber-500/10"
                  >
                    <Star
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFav(s.slug)
                      }}
                      className="mr-0.5 size-3 shrink-0 cursor-pointer fill-current text-amber-400 hover:text-amber-300"
                      aria-label={`取消收藏 ${s.name}`}
                    />
                    <span className="truncate">
                      {s.sid ? `${s.sid} · ` : ''}
                      {s.name}
                    </span>
                    {form.styleSlug === s.slug && <Check className="ml-auto size-3.5 text-amber-400" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {series.map((g) => (
              <CommandGroup
                key={g.key}
                heading={`${g.label}（${g.items.length}）`}
              >
                {g.items.map((s) => {
                  const fav = favSlugs.includes(s.slug)
                  return (
                    <CommandItem
                      key={s.slug}
                      value={`${s.slug} ${s.name} ${s.nameEn} ${s.sid} ${s.tags} ${g.label}`}
                      onSelect={() => {
                        patchForm({ styleSlug: s.slug })
                        setOpen(false)
                      }}
                      className="text-zinc-300 aria-selected:bg-zinc-800/80"
                    >
                      <Star
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFav(s.slug)
                        }}
                        className={cn(
                          'mr-0.5 size-3 shrink-0 cursor-pointer hover:text-amber-400',
                          fav ? 'fill-current text-amber-400' : 'text-zinc-700'
                        )}
                        aria-label={fav ? `取消收藏 ${s.name}` : `收藏 ${s.name}`}
                      />
                      <span className="truncate">
                        {s.sid ? `${s.sid} · ` : ''}
                        {s.name}
                      </span>
                      {form.styleSlug === s.slug && <Check className="ml-auto size-3.5 text-amber-400" />}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================
// AI 改稿面板：对当前分镜稿/任务卡下增量修改指令
// ============================================================
function RefinePanel({
  targetId,
  kind,
  onRefined,
}: {
  targetId: number
  kind: 'storyboard' | 'taskcard'
  onRefined: (gen: GenerationRecord) => void
}) {
  const [instruction, setInstruction] = useState('')
  const [refining, setRefining] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  useEffect(() => {
    return () => timersRef.current.forEach(clearInterval)
  }, [])

  async function handleRefine() {
    const text = instruction.trim()
    if (text.length < 4) {
      toast.error('修改指令至少 4 个字', { description: '例如：第 2 镜改成特写，节奏放缓' })
      return
    }
    setRefining(true)
    setElapsed(0)
    setStatusIdx(0)
    timersRef.current.forEach(clearInterval)
    const t1 = setInterval(() => setElapsed((e) => e + 1), 1000)
    const t2 = setInterval(() => setStatusIdx((i) => (i + 1) % REFINING_MESSAGES.length), 5000)
    timersRef.current = [t1, t2]

    try {
      const res = await fetch('/api/generate/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: targetId, instruction: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '改稿失败')
      onRefined(data.generation as GenerationRecord)
      setInstruction('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '改稿失败，请重试')
    } finally {
      timersRef.current.forEach(clearInterval)
      timersRef.current = []
      setRefining(false)
    }
  }

  return (
    <Card className="mt-5 border-zinc-800 bg-zinc-900/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageSquare className="size-4 text-amber-400" />
          AI 改稿
          <Badge variant="outline" className="border-zinc-800 text-[10px] font-normal text-zinc-500">
            {kind === 'storyboard' ? '分镜稿 · 增量修改' : '任务卡 · 增量修改'}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          对当前结果下修改指令，未提及的部分保持原样；改动会更新到同一条历史记录
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_REFINE_INSTRUCTIONS.map((q) => (
            <button
              key={q}
              onClick={() => setInstruction(q)}
              disabled={refining}
              className="rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !refining && handleRefine()}
            disabled={refining}
            maxLength={500}
            placeholder="例：第 3 镜改成俯拍特写，字幕改成「每一杯都有 Sunrise」"
            className="h-9 border-zinc-800 bg-zinc-950/60 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
          />
          <Button
            onClick={handleRefine}
            disabled={refining || instruction.trim().length < 4}
            className="h-9 shrink-0 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
          >
            {refining ? (
              <>
                <Loader2 className="size-3.5 ff-spin-slow" />
                {REFINING_MESSAGES[statusIdx]}
                <span className="ml-1 font-mono text-[11px] text-zinc-500">{elapsed}s</span>
              </>
            ) : (
              <>
                <Wand2 className="size-3.5" />
                改稿
              </>
            )}
          </Button>
        </div>
        <p className="flex items-center gap-1 text-[11px] text-zinc-600">
          <Search className="size-3" />
          试过的指令：换开场钩子 / 调镜头时长 / 改字幕文案 / 增删镜头 / 统一色调
        </p>
      </CardContent>
    </Card>
  )
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex rounded-lg border border-zinc-800 bg-zinc-950/60 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'h-8 flex-1 rounded-md text-xs font-medium transition-colors',
            value === o.value
              ? 'bg-amber-500/15 text-amber-300'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function EmptyPanel({ onPick }: { onPick: (idea: string) => void }) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10">
        <Clapperboard className="size-7 text-amber-400" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-100">
        描述你的视频创意，AI 导演来分镜
      </h3>
      <p className="mt-1.5 max-w-md text-xs leading-relaxed text-zinc-500">
        你将获得：完整分镜脚本（景别 / 运镜 / 转场 / 字幕 / 音效）、视觉风格指南、逐镜头实现提示词、
        整体实现建议与验收清单
      </p>
      <div className="mt-6 grid w-full max-w-lg gap-2">
        {EXAMPLE_IDEAS.map((ex, i) => (
          <button
            key={i}
            onClick={() => onPick(ex)}
            className="group rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-left text-xs leading-relaxed text-zinc-400 transition-colors hover:border-amber-500/40 hover:text-zinc-200"
          >
            <Sparkles className="mr-1.5 inline size-3 text-amber-500/70 group-hover:text-amber-400" />
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

function LoadingPanel({ elapsed, message }: { elapsed: number; message: string }) {
  return (
    <div className="min-h-96 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm font-medium text-amber-300">
          <Loader2 className="size-4 ff-spin-slow" />
          {message}
        </div>
        <span className="font-mono text-xs text-zinc-500">{elapsed}s</span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className="ff-bar-fill h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
      </div>

      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-14 shrink-0 space-y-2">
              <Skeleton className="h-3 w-12 bg-zinc-800" />
              <Skeleton className="h-3 w-8 bg-zinc-800" />
            </div>
            <Skeleton className="h-28 flex-1 rounded-xl bg-zinc-800/70" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-600">
        <Badge variant="outline" className="border-zinc-800 text-[10px] font-normal text-zinc-500">
          <Clock className="mr-1 size-2.5" />
          平均 45 秒
        </Badge>
        <span>AI 正在逐镜头编排画面、动效规格与实现提示词…</span>
      </div>
    </div>
  )
}

export function ResultActions({
  onCopyMarkdown,
  onDownload,
  onCopyAllPrompts,
}: {
  onCopyMarkdown: () => void
  onDownload: () => void
  onCopyAllPrompts: () => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onCopyMarkdown}
        className="border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
      >
        <FileText className="size-3.5" />
        复制 Markdown
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onDownload}
        className="border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
      >
        <Download className="size-3.5" />
        下载 .md
      </Button>
      <Button
        size="sm"
        onClick={onCopyAllPrompts}
        className="bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
      >
        <Sparkles className="size-3.5" />
        复制全部实现 Prompt
      </Button>
    </div>
  )
}

/** fy 任务卡渲染：12 节全案设计文档 */
function TaskCardView({
  card,
  onCopy,
  onDownload,
}: {
  card: CurrentTaskCard
  onCopy: () => void
  onDownload: () => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/70 px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-zinc-50">
            <LayoutTemplate className="mr-1.5 inline size-4 text-amber-400" />
            {card.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            fy 任务卡 · 12 节全案设计 · 风格 {card.meta.styleName} ·{' '}
            {FRAMEWORK_LABELS[card.meta.framework as FrameworkKey] ?? card.meta.framework}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onCopy}
            className="border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
          >
            <FileText className="size-3.5" />
            复制 Markdown
          </Button>
          <Button
            size="sm"
            onClick={onDownload}
            className="bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
          >
            <Download className="size-3.5" />
            下载 .md
          </Button>
        </div>
      </div>
      <div className="max-h-[72vh] overflow-y-auto scrollbar-thin px-5 py-4">
        <article className="ff-taskcard">
          <ReactMarkdown
            components={{
              h1: (p) => <h1 className="mb-3 mt-1 text-xl font-bold text-amber-300" {...p} />,
              h2: (p) => (
                <h2 className="mb-2 mt-6 border-b border-zinc-800 pb-1.5 text-base font-bold text-zinc-50" {...p} />
              ),
              h3: (p) => <h3 className="mb-1.5 mt-4 text-sm font-semibold text-amber-200/90" {...p} />,
              p: (p) => <p className="my-2 text-[13px] leading-relaxed text-zinc-300" {...p} />,
              ul: (p) => <ul className="my-2 list-disc space-y-1 pl-5 text-[13px] text-zinc-300" {...p} />,
              ol: (p) => <ol className="my-2 list-decimal space-y-1 pl-5 text-[13px] text-zinc-300" {...p} />,
              li: (p) => <li className="leading-relaxed" {...p} />,
              strong: (p) => <strong className="font-semibold text-zinc-100" {...p} />,
              blockquote: (p) => (
                <blockquote
                  className="my-2 border-l-2 border-amber-500/50 bg-amber-500/5 px-3 py-1.5 text-[13px] text-zinc-300"
                  {...p}
                />
              ),
              code: (p) => (
                <code className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[12px] text-amber-200" {...p} />
              ),
              pre: (p) => (
                <pre
                  className="my-2 overflow-x-auto scrollbar-thin rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 font-mono text-[12px] leading-relaxed text-zinc-300"
                  {...p}
                />
              ),
              table: (p) => (
                <div className="my-3 overflow-x-auto scrollbar-thin">
                  <table className="w-full border-collapse text-left text-xs" {...p} />
                </div>
              ),
              th: (p) => (
                <th
                  className="whitespace-nowrap border-b border-zinc-700 bg-zinc-900/80 px-2.5 py-2 font-semibold text-zinc-200"
                  {...p}
                />
              ),
              td: (p) => (
                <td className="border-b border-zinc-800/70 px-2.5 py-2 align-top leading-relaxed text-zinc-400" {...p} />
              ),
              hr: () => <hr className="my-4 border-zinc-800" />,
            }}
          >
            {card.markdown}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
