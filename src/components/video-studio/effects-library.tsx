'use client'

import { useMemo, useState } from 'react'
import { Code2, Github, Move, Search, Star, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CategoryChips } from './category-chips'
import { CopyButton } from './copy-button'
import { EffectDemo } from './effect-demo'
import { getRepo } from '@/lib/repos'
import { useFavStore } from '@/lib/store'
import { toast } from 'sonner'
import type { EffectItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export const EFFECT_CATEGORIES = ['运镜', '转场', '文字动效', '节奏', '视觉效果', '代码样片']

export function EffectsLibrary({ effects }: { effects: EffectItem[] }) {
  const [category, setCategory] = useState('全部')
  const [q, setQ] = useState('')
  const favEffectIds = useFavStore((s) => s.favEffectIds)
  const favOnly = useFavStore((s) => s.effectFavOnly)
  const setFavOnly = useFavStore((s) => s.setEffectFavOnly)

  const categories = useMemo(
    () => Array.from(new Set([...EFFECT_CATEGORIES, ...effects.map((e) => e.category)])),
    [effects]
  )

  const counts = useMemo(() => {
    const m: Record<string, number> = { 全部: effects.length }
    for (const e of effects) m[e.category] = (m[e.category] ?? 0) + 1
    return m
  }, [effects])

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return effects.filter((e) => {
      if (favOnly && !favEffectIds.includes(e.id)) return false
      if (category !== '全部' && e.category !== category) return false
      if (kw && !`${e.name}${e.nameEn}${e.description}`.toLowerCase().includes(kw)) return false
      return true
    })
  }, [effects, category, q, favOnly, favEffectIds])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-50">动效预设库</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {effects.length} 个可复用动效 · 沉淀自 mg-styles-15 / huashu-art-motion /
          remotion-skills / fy-code-animation 转场镜头配方 / 附件 A–G 代码样片（Canvas
          参考实现），每个动效附「实时演示 + 代码片段 + 实现 Prompt」
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索动效，如：转场、打字机…"
            aria-label="搜索动效"
            className="h-10 border-zinc-800 bg-zinc-900/60 pl-9 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
          />
        </div>
        <CategoryChips
          categories={categories}
          value={category}
          onChange={setCategory}
          counts={counts}
          className="sm:flex-1"
        />
        <button
          onClick={() => setFavOnly(!favOnly)}
          aria-pressed={favOnly}
          aria-label="只看收藏的动效"
          disabled={favEffectIds.length === 0 && !favOnly}
          className={cn(
            'flex h-10 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
            favOnly
              ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
              : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
          )}
        >
          <Star className={cn('size-3.5', favOnly && 'fill-current')} />
          收藏 {favEffectIds.length > 0 && `(${favEffectIds.length})`}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
          <Move className="size-8 text-zinc-700" />
          <p className="mt-3 text-sm text-zinc-500">
            {favOnly ? '收藏夹里还没有匹配的动效' : '没有匹配的动效'}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            {favOnly ? '点演示区右上角的星标即可收藏' : '换个关键词或分类试试'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EffectCard key={e.id} effect={e} />
          ))}
        </div>
      )}
    </div>
  )
}

function EffectCard({ effect }: { effect: EffectItem }) {
  const [showCode, setShowCode] = useState(false)
  const repo = getRepo(effect.sourceRepo)
  const favEffectIds = useFavStore((s) => s.favEffectIds)
  const toggleFavEffect = useFavStore((s) => s.toggleFavEffect)
  const isFav = favEffectIds.includes(effect.id)

  return (
    <Card
      className={cn(
        'group overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:-translate-y-0.5 hover:border-amber-500/40',
        isFav && 'border-amber-500/50'
      )}
    >
      <div className="demo-stage relative h-36 border-b border-zinc-800 bg-zinc-950">
        <div className="absolute inset-0 ff-grid-bg opacity-60" aria-hidden="true" />
        <EffectDemo demo={effect.demo} />
        <Badge className="absolute left-3 top-3 border-white/15 bg-black/50 text-[11px] text-zinc-200 backdrop-blur">
          {effect.category}
        </Badge>
        <button
          onClick={() => {
            toggleFavEffect(effect.id)
            toast.success(isFav ? '已取消收藏' : '已收藏该动效', {
              description: isFav ? undefined : '点上方「收藏」可只看收藏内容',
            })
          }}
          aria-label={isFav ? `取消收藏 ${effect.name}` : `收藏 ${effect.name}`}
          aria-pressed={isFav}
          className={cn(
            'absolute right-3 top-3 rounded-full p-1.5 backdrop-blur transition-colors hover:bg-black/70',
            isFav ? 'bg-black/55 text-amber-400' : 'bg-black/55 text-white/60 hover:text-amber-300'
          )}
        >
          <Star className={cn('size-4', isFav && 'fill-current')} />
        </button>
        <span className="absolute bottom-2.5 right-3 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          LIVE DEMO
        </span>
      </div>

      <CardContent className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-zinc-100">{effect.name}</h3>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-zinc-600">
            {effect.nameEn}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-zinc-400">
          {effect.description}
        </p>

        {showCode && (
          <div className="mt-3 overflow-x-auto scrollbar-thin rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
            <pre className="font-mono text-[11px] leading-relaxed text-zinc-400">
              <code>{effect.codeSnippet}</code>
            </pre>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 pt-3">
          <span className="flex min-w-0 max-w-28 items-center gap-1 text-[10px] text-zinc-600 sm:max-w-32">
            <Github className="size-3 shrink-0" />
            <span className="truncate">{repo?.name ?? effect.sourceRepo}</span>
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCode((v) => !v)}
              aria-expanded={showCode}
              className="h-7 px-2 text-[11px] text-zinc-400 hover:text-zinc-100"
            >
              <Code2 className="size-3" />
              {showCode ? '隐藏代码' : '代码'}
            </Button>
            <CopyButton
              text={effect.prompt}
              label="复制 Prompt"
              size="sm"
              variant="outline"
              className="h-7 border-zinc-700 bg-transparent px-2 text-[11px] text-zinc-300 hover:bg-zinc-800"
              toastMessage="动效实现 Prompt 已复制"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EffectLegend() {
  return (
    <div className="flex items-center gap-2">
      <Wand2 className="size-4 text-amber-400" />
      <span className="text-xs text-zinc-500">所有演示均为纯 CSS 实时渲染</span>
    </div>
  )
}
