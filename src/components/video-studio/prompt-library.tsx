'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Dices, Github, Lightbulb, Search, Star, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CategoryChips } from './category-chips'
import { CopyButton } from './copy-button'
import { getRepo } from '@/lib/repos'
import { useAppStore, useFavStore } from '@/lib/store'
import { toast } from 'sonner'
import type { PromptItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export const PROMPT_CATEGORIES = [
  '一句话灵感',
  '完整模板',
  '参考图驱动',
  '长提示词',
  '分镜脚本',
  '技术实现',
  '方法论 · fy 创作法',
  '仓库精华',
]

const CATEGORY_STYLES: Record<string, string> = {
  一句话灵感: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  完整模板: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  参考图驱动: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
  长提示词: 'border-violet-500/40 bg-violet-500/10 text-violet-400',
  分镜脚本: 'border-teal-500/40 bg-teal-500/10 text-teal-400',
  技术实现: 'border-zinc-600 bg-zinc-800/60 text-zinc-300',
  '方法论 · fy 创作法': 'border-orange-500/40 bg-orange-500/10 text-orange-400',
  仓库精华: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
}

export function PromptLibrary({
  prompts,
  onCopyCountChange,
}: {
  prompts: PromptItem[]
  onCopyCountChange: (id: number) => void
}) {
  const [category, setCategory] = useState('全部')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'latest' | 'hot'>('latest')
  const favPromptIds = useFavStore((s) => s.favPromptIds)
  const favOnly = useFavStore((s) => s.promptFavOnly)
  const setFavOnly = useFavStore((s) => s.setPromptFavOnly)

  const counts = useMemo(() => {
    const m: Record<string, number> = { 全部: prompts.length }
    for (const p of prompts) m[p.category] = (m[p.category] ?? 0) + 1
    return m
  }, [prompts])

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    const list = prompts.filter((p) => {
      if (favOnly && !favPromptIds.includes(p.id)) return false
      if (category !== '全部' && p.category !== category) return false
      if (kw && !`${p.title}${p.content}${p.tags}${p.useCase}`.toLowerCase().includes(kw))
        return false
      return true
    })
    return sort === 'hot' ? [...list].sort((a, b) => b.copyCount - a.copyCount) : list
  }, [prompts, category, q, sort, favOnly, favPromptIds])

  const randomInspire = () => {
    const pool = prompts.length ? prompts : []
    if (!pool.length) return
    const pick = pool[Math.floor(Math.random() * pool.length)]
    const { applyPrompt } = useAppStore.getState()
    applyPrompt(pick.content)
    toast.success(`已带入灵感「${pick.title}」到工坊`, {
      description: '可直接生成，或改写后再生成',
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-50">Prompt 提示词库</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {prompts.length} 条精选提示词 · 精选自 awesome-opus5-5-videos / opus-video-prompts /
            shipvideo 等项目 + fy-code-animation 方法论模板，按「一句话 / 模板 / 参考图 /
            长提示词 / 方法论 / 仓库精华」分类
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={randomInspire}
          className="border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-amber-500/40 hover:text-amber-300"
        >
          <Dices className="size-3.5" />
          随机来点灵感
        </Button>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索提示词，如：产品发布、水墨…"
            aria-label="搜索提示词"
            className="h-10 border-zinc-800 bg-zinc-900/60 pl-9 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
          />
        </div>
        <CategoryChips
          categories={PROMPT_CATEGORIES}
          value={category}
          onChange={setCategory}
          counts={counts}
          className="lg:flex-1"
        />
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setFavOnly(!favOnly)}
            aria-pressed={favOnly}
            aria-label="只看收藏的提示词"
            disabled={favPromptIds.length === 0 && !favOnly}
            className={cn(
              'flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
              favOnly
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
            )}
          >
            <Star className={cn('size-3.5', favOnly && 'fill-current')} />
            收藏 {favPromptIds.length > 0 && `(${favPromptIds.length})`}
          </button>
          <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5">
            {(
              [
                ['latest', '最新'],
                ['hot', '最热'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={cn(
                  'h-7 rounded-md px-3 text-xs font-medium transition-colors',
                  sort === k ? 'bg-amber-500/15 text-amber-300' : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
          <Lightbulb className="size-8 text-zinc-700" />
          <p className="mt-3 text-sm text-zinc-500">
            {favOnly ? '收藏夹里还没有匹配的提示词' : '没有匹配的提示词'}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            {favOnly ? '点卡片右上角的星标即可收藏' : '换个关键词或分类试试'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((p) => (
            <PromptCard key={p.id} prompt={p} onCopyCountChange={onCopyCountChange} />
          ))}
        </div>
      )}
    </div>
  )
}

function PromptCard({
  prompt,
  onCopyCountChange,
}: {
  prompt: PromptItem
  onCopyCountChange: (id: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const repo = getRepo(prompt.sourceRepo)
  const favPromptIds = useFavStore((s) => s.favPromptIds)
  const toggleFavPrompt = useFavStore((s) => s.toggleFavPrompt)
  const isFav = favPromptIds.includes(prompt.id)

  function handleUse() {
    const { applyPrompt } = useAppStore.getState()
    applyPrompt(prompt.content)
    toast.success('已带入「AI 分镜工坊」', { description: prompt.title })
  }

  return (
    <Card
      className={cn(
        'flex flex-col border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700',
        isFav && 'border-amber-500/40'
      )}
    >
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-snug text-zinc-100">{prompt.title}</h3>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => {
                toggleFavPrompt(prompt.id)
                toast.success(isFav ? '已取消收藏' : '已收藏该提示词', {
                  description: isFav ? undefined : '点右上角「收藏」可只看收藏内容',
                })
              }}
              aria-label={isFav ? `取消收藏 ${prompt.title}` : `收藏 ${prompt.title}`}
              aria-pressed={isFav}
              className={cn(
                'rounded-md p-1 transition-colors hover:bg-zinc-800',
                isFav ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'
              )}
            >
              <Star className={cn('size-4', isFav && 'fill-current')} />
            </button>
            <Badge
              variant="outline"
              className={cn('shrink-0 text-[11px]', CATEGORY_STYLES[prompt.category])}
            >
              {prompt.category}
            </Badge>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-zinc-600">{prompt.useCase}</p>

        <div
          className={cn(
            'relative mt-3 flex-1 rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3 font-mono text-[12.5px] leading-relaxed text-zinc-300',
            !expanded && 'line-clamp-4'
          )}
        >
          {prompt.content}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {prompt.tags
            .split(',')
            .slice(0, 4)
            .map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="border-zinc-800 px-1.5 text-[10px] font-normal text-zinc-500"
              >
                #{t}
              </Badge>
            ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 pt-3">
          <div className="flex min-w-0 items-center gap-3 text-[11px] text-zinc-600">
            <span className="flex shrink-0 items-center gap-1" title={`已被复制 ${prompt.copyCount} 次`}>
              <Copy className="size-3" />
              {prompt.copyCount} 次
            </span>
            <span className="flex min-w-0 max-w-28 items-center gap-1 sm:max-w-36">
              <Github className="size-3 shrink-0" />
              <span className="truncate">{repo?.name ?? prompt.sourceRepo}</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              className="h-7 px-2 text-[11px] text-zinc-500 hover:text-zinc-200"
              aria-expanded={expanded}
            >
              {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              {expanded ? '收起' : '展开'}
            </Button>
            <CopyButton
              text={prompt.content}
              label="复制"
              size="sm"
              variant="outline"
              className="h-7 border-zinc-700 bg-transparent px-2 text-[11px] text-zinc-300 hover:bg-zinc-800"
              onCopied={() => onCopyCountChange(prompt.id)}
            />
            <Button
              size="sm"
              onClick={handleUse}
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
