'use client'

import { Clock, History, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FRAMEWORK_LABELS, type FrameworkKey, type GenerationRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export function HistorySection({
  history,
  currentId,
  onLoad,
  onDelete,
}: {
  history: GenerationRecord[]
  currentId?: number
  onLoad: (g: GenerationRecord) => void
  onDelete: (id: number) => void
}) {
  if (!history.length) return null

  return (
    <Card className="mt-8 border-zinc-800 bg-zinc-900/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="size-4 text-amber-400" />
          生成历史
          <Badge variant="outline" className="border-zinc-800 text-[11px] font-normal text-zinc-500">
            {history.length} 条 · 自动保存
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid max-h-96 gap-3 overflow-y-auto scrollbar-thin pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((h) => (
            <div
              key={h.id}
              role="button"
              tabIndex={0}
              onClick={() => onLoad(h)}
              onKeyDown={(e) => e.key === 'Enter' && onLoad(h)}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(h.id)
                  }}
                  aria-label={`删除 ${h.title}`}
                  className="shrink-0 rounded p-1 text-zinc-600 opacity-0 transition-opacity hover:bg-rose-500/10 hover:text-rose-400 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
