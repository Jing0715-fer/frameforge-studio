'use client'

import { useMemo, useState } from 'react'
import {
  Boxes,
  Clapperboard,
  Disc3,
  Github,
  Image as ImageIcon,
  Palette,
  PenTool,
  Search,
  Shapes,
  Sparkles,
  Star,
  Trophy,
  Type,
  Wand2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CategoryChips } from './category-chips'
import { CopyButton } from './copy-button'
import { getRepo } from '@/lib/repos'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import type { StyleItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  精选: Clapperboard,
  AG: Sparkles,
  M: Shapes,
  K: PenTool,
  Z: Palette,
  H: Type,
  L: Boxes,
  V: Disc3,
  X: Star,
  R: Trophy,
  O: ImageIcon,
}

const DIFFICULTY_STYLES: Record<string, string> = {
  入门: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  进阶: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  专业: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
}

const PAGE_SIZE = 24

// 系列 key → 显示名
const SERIES_LABELS: Record<string, string> = {
  全部: '全部',
  精选: '精选详解',
  AG: 'A–G 代码样片',
  M: 'M 动态风格',
  K: 'K 卡通画风',
  Z: 'Z 中国风',
  H: 'H 现成版式',
  L: 'L Lemo-Opuscar',
  V: 'V mg-styles-15',
  X: 'X code-video',
  R: 'R 照参考',
  O: 'O 奥斯卡 98 部',
}

function seriesKeyToLabel(k: string): string {
  return SERIES_LABELS[k] ?? k
}

export function StylesLibrary({ styles }: { styles: StyleItem[] }) {
  const [category, setCategory] = useState('全部')
  const [q, setQ] = useState('')
  const [active, setActive] = useState<StyleItem | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  // 系列优先分组：精选 | AG | M | K | Z | H | L | V | X | R | O
  const seriesOrder = ['精选', 'AG', 'M', 'K', 'Z', 'H', 'L', 'V', 'X', 'R', 'O']
  const categories = useMemo(() => {
    const present = new Set(styles.map((s) => s.series || '精选'))
    return seriesOrder.filter((k) => present.has(k)).map(seriesKeyToLabel)
  }, [styles])

  const counts = useMemo(() => {
    const m: Record<string, number> = { 全部: styles.length }
    for (const s of styles) {
      const key = seriesKeyToLabel(s.series || '精选')
      m[key] = (m[key] ?? 0) + 1
    }
    return m
  }, [styles])

  const activeSeries = useMemo(() => {
    const entry = Object.entries(SERIES_LABELS).find(([, label]) => label === category)
    return entry?.[0] ?? '全部'
  }, [category])

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return styles.filter((s) => {
      if (activeSeries !== '全部' && (s.series || '精选') !== activeSeries) return false
      if (
        kw &&
        !`${s.name}${s.nameEn}${s.sid}${s.tags}${s.description}${s.looksLike}${s.suitableFor}`.toLowerCase().includes(kw)
      )
        return false
      return true
    })
  }, [styles, activeSeries, q])

  const shown = filtered.slice(0, visible)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-50">风格素材库</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {styles.length} 种可复用影片风格 · 精选详解（带色板/难度） + 附件《代码动画》333
          种系列风格（L Lemo / V mg-styles / X code-video / O 奥斯卡 98 部…），每种附完整提示词原文
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setVisible(PAGE_SIZE)
            }}
            placeholder="搜索风格/编号，如：水墨、L36、奥斯卡、粒子…"
            aria-label="搜索风格"
            className="h-10 border-zinc-800 bg-zinc-900/60 pl-9 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
          />
        </div>
        <CategoryChips
          categories={categories}
          value={category}
          onChange={(c) => {
            setCategory(c)
            setVisible(PAGE_SIZE)
          }}
          counts={counts}
          className="sm:flex-1"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState keyword={q} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((s) => (
              <StyleCard key={s.id} style={s} onOpen={setActive} />
            ))}
          </div>
          {filtered.length > shown.length && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
              >
                加载更多（{shown.length} / {filtered.length}）
              </Button>
            </div>
          )}
        </>
      )}

      <StyleDialog style={active} onClose={() => setActive(null)} />
    </div>
  )
}

function StyleCard({ style, onOpen }: { style: StyleItem; onOpen: (s: StyleItem) => void }) {
  const seriesKey = style.series || '精选'
  const Icon = CATEGORY_ICONS[seriesKey] ?? Palette
  const colors = style.palette.split(',').map((c) => c.trim()).filter(Boolean)
  const repo = getRepo(style.sourceRepo)
  const applyStyle = useAppStore((s) => s.applyStyle)
  const hasPalette = colors.length > 0

  return (
    <Card className="group overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5">
      <div
        className="relative h-28 cursor-pointer overflow-hidden"
        style={{
          background: hasPalette
            ? `linear-gradient(130deg, ${colors[0] ?? '#27272a'}, ${colors[1] ?? '#3f3f46'} 55%, ${colors[2] ?? '#52525b'})`
            : seriesGradient(seriesKey),
        }}
        onClick={() => onOpen(style)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(style)}
        aria-label={`查看 ${style.name} 详情`}
      >
        <div className="absolute inset-0 ff-style-pattern opacity-60" />
        <Icon className="absolute -bottom-3 -right-3 size-24 text-white/15 transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge className="border-white/20 bg-black/45 text-[11px] text-white/90 backdrop-blur">
            {style.sid || seriesKey}
          </Badge>
        </div>
        {style.difficulty && (
          <div className="absolute right-3 top-3">
            <Badge
              variant="outline"
              className={cn('border bg-black/45 text-[11px] backdrop-blur', DIFFICULTY_STYLES[style.difficulty])}
            >
              {style.difficulty}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-1.5" aria-hidden="true">
          {hasPalette ? (
            colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="size-3.5 rounded-full border border-white/30 shadow"
                style={{ background: c }}
              />
            ))
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
              {style.category}
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold text-zinc-100">{style.name}</h3>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-zinc-600">
            {style.nameEn || style.sid}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-zinc-400">
          {style.looksLike || style.description}
        </p>
        {style.suitableFor && (
          <p className="mt-1 line-clamp-1 text-[11px] text-zinc-600">适合：{style.suitableFor}</p>
        )}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {style.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 3)
            .map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="border-zinc-800 bg-zinc-900 px-1.5 text-[10px] font-normal text-zinc-500"
              >
                {t}
              </Badge>
            ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-3">
          <span className="flex min-w-0 max-w-24 items-center gap-1 truncate text-[10px] text-zinc-600 sm:max-w-28">
            <Github className="size-3 shrink-0" />
            <span className="truncate">{repo?.name ?? style.sourceRepo}</span>
          </span>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpen(style)}
              className="h-7 px-2 text-[11px] text-zinc-400 hover:text-zinc-100"
            >
              提示词
            </Button>
            <Button
              size="sm"
              onClick={() => applyStyle(style.slug)}
              className="h-7 bg-amber-500/15 px-2.5 text-[11px] font-medium text-amber-300 hover:bg-amber-500/25 hover:text-amber-200"
            >
              <Wand2 className="size-3" />
              去生成
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function seriesGradient(series: string): string {
  const map: Record<string, string> = {
    AG: 'linear-gradient(130deg, #1e293b, #0f766e 60%, #14532d)',
    M: 'linear-gradient(130deg, #292524, #9a3412 60%, #7c2d12)',
    K: 'linear-gradient(130deg, #27272a, #be185d 60%, #831843)',
    Z: 'linear-gradient(130deg, #1c1917, #57534e 60%, #a8a29e)',
    H: 'linear-gradient(130deg, #18181b, #3f3f46 60%, #71717a)',
    L: 'linear-gradient(130deg, #191924, #3730a3 60%, #1e1b4b)',
    V: 'linear-gradient(130deg, #20124d, #701a75 60%, #4c1d95)',
    X: 'linear-gradient(130deg, #0c1929, #155e75 60%, #0e7490)',
    R: 'linear-gradient(130deg, #0f0f1a, #a21caf 60%, #c026d3)',
    O: 'linear-gradient(130deg, #292018, #b45309 60%, #92400e)',
    精选: 'linear-gradient(130deg, #27272a, #3f3f46 55%, #52525b)',
  }
  return map[series] ?? map['精选']
}

function StyleDialog({ style, onClose }: { style: StyleItem | null; onClose: () => void }) {
  const repo = style ? getRepo(style.sourceRepo) : null
  const colors = style?.palette.split(',').map((c) => c.trim()).filter(Boolean) ?? []
  const fullPrompt = style?.promptFull || style?.starterPrompt || ''
  return (
    <Dialog open={!!style} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto scrollbar-thin border-zinc-800 bg-zinc-950 sm:max-w-xl">
        {style && (
          <>
            <DialogHeader>
              <div
                className="relative mb-1 h-24 overflow-hidden rounded-lg"
                style={{
                  background: colors.length
                    ? `linear-gradient(130deg, ${colors[0]}, ${colors[1] ?? colors[0]} 55%, ${colors[2] ?? colors[2 - 1] ?? colors[0]})`
                    : seriesGradient(style.series || '精选'),
                }}
              >
                <div className="absolute inset-0 ff-style-pattern opacity-60" />
                <div className="absolute bottom-2 left-3 flex gap-1.5">
                  {colors.map((c, i) => (
                    <span
                      key={i}
                      className="size-4 rounded-full border border-white/40 shadow"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                {style.hasStill && (
                  <Badge className="absolute right-2 top-2 border-white/20 bg-black/50 text-[10px] text-white/80 backdrop-blur">
                    <ImageIcon className="mr-1 size-3" />
                    附静帧参考
                  </Badge>
                )}
              </div>
              <DialogTitle className="flex items-baseline gap-2 text-left">
                {style.name}
                <span className="font-mono text-xs font-normal uppercase tracking-wide text-zinc-500">
                  {style.sid || style.nameEn}
                </span>
              </DialogTitle>
              <DialogDescription className="text-left leading-relaxed">
                {style.looksLike || style.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-amber-500/40 text-amber-400">
                  {style.category}
                </Badge>
                {style.difficulty && (
                  <Badge variant="outline" className={cn(DIFFICULTY_STYLES[style.difficulty])}>
                    {style.difficulty}
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <Star className="size-3 fill-amber-500/70 text-amber-500/70" />
                  来自 {repo?.name ?? style.sourceRepo}
                </span>
              </div>

              {style.suitableFor && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-400">
                  <span className="text-zinc-300">适合：</span>
                  {style.suitableFor}
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                  <Sparkles className="size-3.5 text-amber-400" />
                  风格提示词原文 · 直接投喂 AI 编程工具
                </div>
                <div className="max-h-72 overflow-y-auto scrollbar-thin rounded-lg border border-zinc-800 bg-zinc-900/60 p-3.5 font-mono text-[13px] leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {fullPrompt || '（暂无提示词）'}
                </div>
              </div>

              {style.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {style.tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="border-zinc-800 text-[11px] font-normal text-zinc-500"
                      >
                        #{t}
                      </Badge>
                    ))}
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <CopyButton text={fullPrompt} label="复制提示词" size="default" />
                <Button
                  onClick={() => {
                    const { applyStyle } = useAppStore.getState()
                    applyStyle(style.slug)
                    onClose()
                    toast.success(`已应用风格「${style.name}」`)
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-zinc-950 hover:from-amber-400 hover:to-orange-400"
                >
                  <Wand2 className="size-4" />
                  用此风格生成分镜
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function EmptyState({ keyword }: { keyword: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
      <Palette className="size-8 text-zinc-700" />
      <p className="mt-3 text-sm text-zinc-500">
        {keyword ? `没有找到与「${keyword}」相关的风格` : '暂无风格数据'}
      </p>
      <p className="mt-1 text-xs text-zinc-600">试试其他关键词，或切换系列</p>
    </div>
  )
}
