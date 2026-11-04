'use client'

import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  categories: string[]
  value: string
  onChange: (v: string) => void
  counts?: Record<string, number>
  className?: string
}

export function CategoryChips({ categories, value, onChange, counts, className }: CategoryChipsProps) {
  const all = ['全部', ...categories]
  return (
    <div
      role="tablist"
      aria-label="分类筛选"
      className={cn('flex gap-2 overflow-x-auto scrollbar-thin pb-1', className)}
    >
      {all.map((c) => {
        const active = value === c
        return (
          <button
            key={c}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c)}
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
              active
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            )}
          >
            {c}
            {counts && counts[c] !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px] leading-4',
                  active ? 'bg-amber-500/25 text-amber-200' : 'bg-zinc-800 text-zinc-500'
                )}
              >
                {counts[c]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
