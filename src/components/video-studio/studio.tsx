'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Clapperboard,
  Clock,
  Download,
  FileText,
  Loader2,
  Monitor,
  Smartphone,
  Sparkles,
  Square,
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
import { buildStoryboardMarkdown, downloadTextFile, type StoryboardMeta } from '@/lib/markdown'
import { copyText, useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  FRAMEWORK_LABELS,
  PACING_LABELS,
  VIDEO_TYPES,
  type AspectKey,
  type FrameworkKey,
  type GenerationRecord,
  type PacingKey,
  type PromptItem,
  type StoryboardResult,
  type StyleItem,
} from '@/lib/types'
import { cn } from '@/lib/utils'

export interface CurrentGeneration {
  id: number
  meta: StoryboardMeta
  result: StoryboardResult
}

export function parseGeneration(g: GenerationRecord): CurrentGeneration | null {
  try {
    const result = JSON.parse(g.output) as StoryboardResult
    const input = JSON.parse(g.input || '{}')
    if (!result?.shots?.length) return null
    return {
      id: g.id,
      meta: {
        framework: g.framework,
        styleName: g.styleName,
        aspect: input.aspect,
        duration: input.duration,
        pacing: input.pacing,
      },
      result,
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
  '正在理解你的创意…',
  '正在匹配视觉风格与色板…',
  '正在设计镜头语言与构图…',
  '正在编排时间轴与节奏卡点…',
  '正在撰写逐镜头实现提示词…',
  '正在做镜头连贯性验收…',
]

export function Studio({
  styles,
  prompts,
  history,
  onHistoryChange,
}: {
  styles: StyleItem[]
  prompts: PromptItem[]
  history: GenerationRecord[]
  onHistoryChange: (h: GenerationRecord[]) => void
}) {
  const form = useAppStore((s) => s.form)
  const patchForm = useAppStore((s) => s.patchForm)

  const [generating, setGenerating] = useState(false)
  const [current, setCurrent] = useState<CurrentGeneration | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  const styleCategories = useMemo(
    () => Array.from(new Set(styles.map((s) => s.category))),
    [styles]
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
    setElapsed(0)
    setStatusIdx(0)

    timersRef.current.forEach(clearInterval)
    const t1 = setInterval(() => setElapsed((e) => e + 1), 1000)
    const t2 = setInterval(() => setStatusIdx((i) => (i + 1) % LOADING_MESSAGES.length), 4500)
    timersRef.current = [t1, t2]

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '生成失败')

      const gen = data.generation as GenerationRecord & { output: StoryboardResult | string }
      const result: StoryboardResult =
        typeof gen.output === 'string' ? JSON.parse(gen.output) : gen.output
      setCurrent({
        id: gen.id,
        meta: {
          framework: form.framework,
          styleName: form.styleSlug === 'auto' ? result.styleGuide?.name ?? 'AI 自由发挥' : (styles.find((s) => s.slug === form.styleSlug)?.name ?? 'AI 自由发挥'),
          aspect: form.aspect,
          duration: form.duration,
          pacing: form.pacing,
        },
        result,
      })
      onHistoryChange([
        { ...gen, output: JSON.stringify(result), createdAt: gen.createdAt ?? new Date().toISOString() },
        ...history,
      ].slice(0, 24))
      toast.success(`分镜稿《${result.title}》已生成`, {
        description: `${result.shots.length} 个镜头 · 总时长 ${result.totalDuration ?? form.duration} 秒`,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '生成失败，请重试')
    } finally {
      timersRef.current.forEach(clearInterval)
      timersRef.current = []
      setGenerating(false)
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
          描述你的创意，AI 导演将产出逐镜头分镜稿 + 可直接投喂 Claude Code
          的实现提示词（支持 Hyperframes / Remotion / p5.js / 通用剪辑）
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
                <Select value={form.styleSlug} onValueChange={(v) => patchForm({ styleSlug: v })}>
                  <SelectTrigger className="h-9 border-zinc-800 bg-zinc-950/60 text-sm text-zinc-200 focus-visible:ring-amber-500/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 border-zinc-800 bg-zinc-900 text-zinc-200">
                    <SelectItem value="auto">✨ AI 自动决定</SelectItem>
                    {styleCategories.map((cat) => (
                      <SelectGroup key={cat}>
                        <SelectLabel className="text-zinc-500">{cat}</SelectLabel>
                        {styles
                          .filter((s) => s.category === cat)
                          .map((s) => (
                            <SelectItem key={s.slug} value={s.slug}>
                              {s.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
            <LoadingPanel elapsed={elapsed} message={LOADING_MESSAGES[statusIdx]} />
          ) : current ? (
            <StoryboardResultView
              current={current}
              onCopyMarkdown={copyMarkdown}
              onDownload={downloadMarkdown}
              onCopyAllPrompts={copyAllPrompts}
            />
          ) : (
            <EmptyPanel onPick={(idea) => patchForm({ idea })} />
          )}
        </div>
      </div>

      {/* ===== 生成历史 ===== */}
      <HistorySection
        history={history}
        currentId={current?.id}
        onLoad={(g) => {
          const parsed = parseGeneration(g)
          if (parsed) {
            setCurrent(parsed)
            toast.success(`已载入《${parsed.result.title}》`)
          } else {
            toast.error('该记录数据异常，无法载入')
          }
        }}
        onDelete={async (id) => {
          const res = await fetch(`/api/generations?id=${id}`, { method: 'DELETE' })
          if (res.ok) {
            onHistoryChange(history.filter((h) => h.id !== id))
            if (current?.id === id) setCurrent(null)
            toast.success('已删除该记录')
          } else {
            toast.error('删除失败')
          }
        }}
      />
    </div>
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
