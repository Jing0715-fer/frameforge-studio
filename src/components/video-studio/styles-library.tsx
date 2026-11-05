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
  Scale,
  Search,
  Shapes,
  Sparkles,
  Star,
  Trophy,
  Type,
  Wand2,
  X,
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
import { StylePreview } from './style-preview'
import { getRepo } from '@/lib/repos'
import { useAppStore, useFavStore } from '@/lib/store'
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
  const [compare, setCompare] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const favSlugs = useFavStore((s) => s.favSlugs)
  const hasFav = favSlugs.length > 0

  function toggleCompare(slug: string) {
    setCompare((prev) =>
      prev.includes(slug)
        ? prev.filter((x) => x !== slug)
        : prev.length >= 3
          ? (toast.warning('最多对比 3 种风格，先移除一个吧'), prev)
          : [...prev, slug]
    )
  }

  // 系列优先分组：精选 | AG | M | K | Z | H | L | V | X | R | O（收藏过风格时最前面加「我的收藏」）
  const seriesOrder = ['精选', 'AG', 'M', 'K', 'Z', 'H', 'L', 'V', 'X', 'R', 'O']
  const categories = useMemo(() => {
    const present = new Set(styles.map((s) => s.series || '精选'))
    const list = seriesOrder.filter((k) => present.has(k)).map(seriesKeyToLabel)
    return hasFav ? ['我的收藏', ...list] : list
  }, [styles, hasFav])

  const counts = useMemo(() => {
    const m: Record<string, number> = { 全部: styles.length }
    for (const s of styles) {
      const key = seriesKeyToLabel(s.series || '精选')
      m[key] = (m[key] ?? 0) + 1
    }
    if (hasFav) m['我的收藏'] = favSlugs.length
    return m
  }, [styles, favSlugs, hasFav])

  const activeSeries = useMemo(() => {
    if (category === '我的收藏') return '收藏'
    const entry = Object.entries(SERIES_LABELS).find(([, label]) => label === category)
    return entry?.[0] ?? '全部'
  }, [category])

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return styles.filter((s) => {
      if (activeSeries === '收藏' && !favSlugs.includes(s.slug)) return false
      if (activeSeries !== '全部' && activeSeries !== '收藏' && (s.series || '精选') !== activeSeries)
        return false
      if (
        kw &&
        !`${s.name}${s.nameEn}${s.sid}${s.tags}${s.description}${s.looksLike}${s.suitableFor}`.toLowerCase().includes(kw)
      )
        return false
      return true
    })
  }, [styles, activeSeries, q, favSlugs])

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
            placeholder="搜索风格：水墨 / L36 / 奥斯卡…"
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
              <StyleCard
                key={s.id}
                style={s}
                onOpen={setActive}
                compareOn={compare.includes(s.slug)}
                compareFull={compare.length >= 3 && !compare.includes(s.slug)}
                onToggleCompare={toggleCompare}
              />
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

      {/* 风格对比：浮动操作条 + 对比弹窗 */}
      <CompareBar
        styles={styles}
        compare={compare}
        onToggle={toggleCompare}
        onClear={() => setCompare([])}
        onOpen={() => setCompareOpen(true)}
      />
      <CompareDialog
        styles={styles}
        compare={compare}
        open={compareOpen}
        onOpenChange={setCompareOpen}
      />
    </div>
  )
}

function StyleCard({
  style,
  onOpen,
  compareOn,
  compareFull,
  onToggleCompare,
}: {
  style: StyleItem
  onOpen: (s: StyleItem) => void
  compareOn: boolean
  compareFull: boolean
  onToggleCompare: (slug: string) => void
}) {
  const seriesKey = style.series || '精选'
  const Icon = CATEGORY_ICONS[seriesKey] ?? Palette
  const colors = style.palette.split(',').map((c) => c.trim()).filter(Boolean)
  const repo = getRepo(style.sourceRepo)
  const applyStyle = useAppStore((s) => s.applyStyle)
  const favSlugs = useFavStore((s) => s.favSlugs)
  const toggleFav = useFavStore((s) => s.toggleFav)
  const isFav = favSlugs.includes(style.slug)
  const hasPalette = colors.length > 0

  return (
    <Card
      className={cn(
        'group overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5',
        compareOn && 'border-amber-500/60 ring-1 ring-amber-500/30'
      )}
    >
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => onOpen(style)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(style)}
        aria-label={`查看 ${style.name} 详情`}
      >
        <StylePreview style={style} className="aspect-[16/10] w-full" rounded="rounded-none" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <Icon className="pointer-events-none absolute -bottom-3 -right-3 size-20 text-white/10 transition-transform duration-300 group-hover:scale-110" />
        <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
          <Badge className="border-white/20 bg-black/55 text-[11px] text-white/90 backdrop-blur">
            {style.sid || seriesKey}
          </Badge>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {style.difficulty && (
            <Badge
              variant="outline"
              className="pointer-events-none border bg-black/55 text-[11px] backdrop-blur"
              style={undefined}
            >
              <span className={cn(DIFFICULTY_STYLES[style.difficulty])}>{style.difficulty}</span>
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFav(style.slug)
            }}
            aria-label={isFav ? `取消收藏 ${style.name}` : `收藏 ${style.name}`}
            aria-pressed={isFav}
            className={cn(
              'rounded-full p-1.5 backdrop-blur transition-colors hover:bg-black/70',
              isFav ? 'bg-black/55 text-amber-400' : 'bg-black/55 text-white/60 opacity-0 hover:text-amber-400 focus-visible:opacity-100 group-hover:opacity-100'
            )}
          >
            <Star className={cn('size-4', isFav && 'fill-current')} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleCompare(style.slug)
            }}
            aria-label={compareOn ? `把 ${style.name} 移出对比` : `把 ${style.name} 加入对比`}
            aria-pressed={compareOn}
            title={compareFull && !compareOn ? '对比已满（3 个）' : '加入对比' }
            className={cn(
              'rounded-full p-1.5 backdrop-blur transition-colors hover:bg-black/70',
              compareOn
                ? 'bg-amber-500/90 text-zinc-950'
                : cn(
                    'bg-black/55 text-white/60 hover:text-amber-300 focus-visible:opacity-100',
                    !compareFull && 'opacity-0 group-hover:opacity-100'
                  )
            )}
          >
            <Scale className="size-4" />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 flex gap-1.5" aria-hidden="true">
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
              <div className="relative mb-1 overflow-hidden rounded-lg">
                <StylePreview style={style} className="aspect-video w-full" rounded="rounded-lg" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 flex gap-1.5">
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
                <FavToggle slug={style.slug} name={style.name} size="default" variant="outline" />
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

/** 弹窗/卡片通用：收藏切换按钮 */
function FavToggle({
  slug,
  name,
  size,
  variant,
}: {
  slug: string
  name: string
  size?: 'sm' | 'default'
  variant?: 'outline' | 'ghost'
}) {
  const favSlugs = useFavStore((s) => s.favSlugs)
  const toggleFav = useFavStore((s) => s.toggleFav)
  const isFav = favSlugs.includes(slug)
  return (
    <Button
      onClick={() => {
        toggleFav(slug)
        toast.success(isFav ? `已取消收藏「${name}」` : `已收藏「${name}」`, {
          description: isFav ? undefined : '可在风格素材库「我的收藏」与工坊下拉顶部快速找到',
        })
      }}
      aria-pressed={isFav}
      size={size}
      variant={variant}
      className={cn(
        'border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800',
        isFav && 'text-amber-400 hover:text-amber-300'
      )}
    >
      <Star className={cn('size-3.5', isFav && 'fill-current')} />
      {isFav ? '已收藏' : '收藏'}
    </Button>
  )
}

// ============================================================
// 风格对比：最多 3 种风格并排比较（预览动画 / 色板 / 提示词节选）
// ============================================================
function CompareBar({
  styles,
  compare,
  onToggle,
  onClear,
  onOpen,
}: {
  styles: StyleItem[]
  compare: string[]
  onToggle: (slug: string) => void
  onClear: () => void
  onOpen: () => void
}) {
  if (compare.length === 0) return null
  const picked = compare.map((slug) => styles.find((s) => s.slug === slug)).filter(Boolean) as StyleItem[]
  return (
    <div
      className="ff-compare-bar fixed inset-x-0 bottom-4 z-40 flex justify-center px-16 sm:px-4"
      role="region"
      aria-label="风格对比操作条"
    >
      <div className="flex max-w-full items-center gap-2 rounded-2xl border border-zinc-700/80 bg-zinc-900/95 p-2 pl-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <Scale className="size-4 shrink-0 text-amber-400" aria-hidden="true" />
        <div className="flex max-w-[52vw] items-center gap-1.5 overflow-x-auto scrollbar-thin sm:max-w-md">
          {picked.map((s) => (
            <span
              key={s.slug}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800/80 py-1 pl-2 pr-1 text-xs text-zinc-200"
            >
              <span className="max-w-28 truncate">{s.name}</span>
              <button
                onClick={() => onToggle(s.slug)}
                aria-label={`把 ${s.name} 移出对比`}
                className="rounded p-0.5 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden text-[11px] text-zinc-500 sm:block">已选 {compare.length}/3</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 px-2.5 text-xs text-zinc-400 hover:text-zinc-100"
          >
            清空
          </Button>
          <Button
            size="sm"
            onClick={onOpen}
            disabled={compare.length < 2}
            className="h-8 bg-gradient-to-r from-amber-500 to-orange-500 px-3 text-xs font-semibold text-zinc-950 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40"
          >
            <Scale className="size-3.5" />
            对比
          </Button>
        </div>
      </div>
    </div>
  )
}

function CompareDialog({
  styles,
  compare,
  open,
  onOpenChange,
}: {
  styles: StyleItem[]
  compare: string[]
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const picked = compare.map((slug) => styles.find((s) => s.slug === slug)).filter(Boolean) as StyleItem[]
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto scrollbar-thin border-zinc-800 bg-zinc-950 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="size-4.5 text-amber-400" />
            风格对比
            <span className="text-xs font-normal text-zinc-500">{picked.length} 种风格并排看</span>
          </DialogTitle>
          <DialogDescription>
            对比动态小样、色板、难度与适合题材，挑出最合适的那一个。
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            'grid gap-4',
            picked.length <= 1 && 'grid-cols-1',
            picked.length === 2 && 'grid-cols-1 md:grid-cols-2',
            picked.length >= 3 && 'grid-cols-1 md:grid-cols-3'
          )}
        >
          {picked.map((s) => {
            const colors = s.palette.split(',').map((c) => c.trim()).filter(Boolean)
            const fullPrompt = s.promptFull || s.starterPrompt
            return (
              <div
                key={s.slug}
                className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                <div className="relative">
                  <StylePreview style={s} className="aspect-video w-full" rounded="rounded-none" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <Badge className="absolute left-2 top-2 border-white/20 bg-black/60 text-[10px] text-white/90 backdrop-blur">
                    {s.sid || s.series}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-3.5">
                  <div>
                    <h4 className="truncate text-sm font-semibold text-zinc-100">{s.name}</h4>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
                      {s.looksLike || s.description}
                    </p>
                  </div>

                  {colors.length > 0 && (
                    <div className="flex items-center gap-1.5" aria-label="色板">
                      {colors.slice(0, 5).map((c, i) => (
                        <span
                          key={i}
                          className="size-4 rounded-full border border-white/25"
                          style={{ background: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5">
                    {s.difficulty && (
                      <Badge variant="outline" className={cn('px-1.5 text-[10px]', DIFFICULTY_STYLES[s.difficulty])}>
                        {s.difficulty}
                      </Badge>
                    )}
                    {s.suitableFor && (
                      <span className="line-clamp-1 text-[10px] text-zinc-600">适合：{s.suitableFor}</span>
                    )}
                  </div>

                  <div className="mt-auto border-t border-zinc-800/80 pt-2.5">
                    <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      提示词节选
                    </div>
                    <p className="line-clamp-4 font-mono text-[11px] leading-relaxed text-zinc-400">
                      {fullPrompt || '（暂无提示词）'}
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    <CopyButton
                      text={fullPrompt}
                      label="复制提示词"
                      size="sm"
                      className="flex-1 border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
                      variant="outline"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        useAppStore.getState().applyStyle(s.slug)
                        onOpenChange(false)
                        toast.success(`已应用风格「${s.name}」`)
                      }}
                      className="flex-1 bg-amber-500/15 text-[11px] font-medium text-amber-300 hover:bg-amber-500/25 hover:text-amber-200"
                    >
                      <Wand2 className="size-3" />
                      去生成
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
