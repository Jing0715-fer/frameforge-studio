'use client'

import { useMemo, useState } from 'react'
import { Clock, History, Loader2, Search, Star, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FRAMEWORK_LABELS, type FrameworkKey, type HistoryListItem } from '@/lib/types'
import { cn } from '@/lib/utils'

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export function HistorySection({
  history,
  currentId,
  loadingId,
  onLoad,
  onDelete,
  onToggleStar,
}: {
  history: HistoryListItem[]
  currentId?: number
  /** 正在载入的记录 id（点击卡片后按需拉取全文） */
  loadingId?: number | null
  onLoad: (id: number) => void
  onDelete: (id: number) => void
  onToggleStar: (id: number, next: boolean) => void
}) {
  // 搜索/过滤在组件内完成（数据量 ≤ 60 条，纯客户端过滤即可，不额外打接口）
  const [query, setQuery] = useState('')
  const [starredOnly, setStarredOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return history.filter((h) => {
      if (starredOnly && !h.starred) return false
      if (!q) return true
      const hay = `${h.title}\n${h.logline}\n${h.styleName}\n${h.ideaText ?? ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [history, query, starredOnly])

  const starredCount = history.filter((h) => h.starred).length
  // 有筛选时始终显示区块（否则用户以为没生效）；无记录且无筛选时隐藏
  if (!history.length && !query && !starredOnly) return null

  return (
    <Card className="mt-8 border-zinc-800 bg-zinc-900/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <History className="size-4 text-amber-400" />
          生成历史
          <Badge variant="outline" className="border-zinc-800 text-[11px] font-normal text-zinc-500">
            {history.length} 条 · 自动保存
          </Badge>
          {starredCount > 0 && (
            <Badge variant="outline" className="border-zinc-800 text-[11px] font-normal text-amber-500/80">
              <Star className="mr-0.5 size-2.5 fill-current" />
              {starredCount}
            </Badge>
          )}
        </CardTitle>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="relative min-w-40 flex-1 sm:max-w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-600" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题 / 概述 / 创意 / 风格…"
              className="h-8 border-zinc-800 bg-zinc-950/60 pl-8 text-xs text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
            />
          </div>
          <button
            onClick={() => setStarredOnly((v) => !v)}
            aria-pressed={starredOnly}
            className={cn(
              'flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-medium transition-colors',
              starredOnly
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            )}
          >
            <Star className={cn('size-3', starredOnly && 'fill-current')} />
            仅看收藏
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-zinc-600">
            {query || starredOnly ? '没有匹配的记录，换个关键词试试' : '暂无生成记录'}
          </p>
        ) : (
          <div className="grid max-h-96 gap-3 overflow-y-auto scrollbar-thin pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h) => {
              const busy = loadingId === h.id
              return (
                <div
                  key={h.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => !busy && onLoad(h.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !busy && onLoad(h.id)}
                  className={cn(
                    'group cursor-pointer rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5',
                    currentId === h.id
                      ? 'border-amber-500/50 bg-amber-500/[0.06]'
                      : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="line-clamp-1 text-[13px] font-semibold text-zinc-100">
                      {h.title || '未命名分镜'}
                    </h4>
                    <span className="flex shrink-0 items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleStar(h.id, !h.starred)
                        }}
                        aria-label={h.starred ? `取消收藏 ${h.title}` : `收藏 ${h.title}`}
                        aria-pressed={h.starred}
                        className={cn(
                          'rounded p-1 transition-colors hover:bg-amber-500/10',
                          h.starred
                            ? 'text-amber-400'
                            : 'text-zinc-700 opacity-0 hover:text-amber-400 focus-visible:opacity-100 group-hover:opacity-100'
                        )}
                      >
                        <Star className={cn('size-3.5', h.starred && 'fill-current')} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(h.id)
                        }}
                        aria-label={`删除 ${h.title}`}
                        className="rounded p-1 text-zinc-600 opacity-0 transition-opacity hover:bg-rose-500/10 hover:text-rose-400 focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-relaxed text-zinc-500">
                    {h.logline || '（暂无概述）'}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-zinc-600">
                    <span className="text-amber-500/80">{h.styleName}</span>
                    <span>·</span>
                    <span>{FRAMEWORK_LABELS[h.framework as FrameworkKey] ?? h.framework}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5" suppressHydrationWarning>
                      <Clock className="size-2.5" />
                      {formatDateTime(h.createdAt)}
                    </span>
                    {busy && <Loader2 className="ml-auto size-3 animate-spin text-amber-400" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
