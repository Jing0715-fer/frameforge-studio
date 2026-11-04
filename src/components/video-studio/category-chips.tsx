'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  categories: string[]
  value: string
  onChange: (v: string) => void
  counts?: Record<string, number>
  className?: string
}

/** 可横滑分类 chips，两端带渐隐提示（有更多内容时出现） */
export function CategoryChips({ categories, value, onChange, counts, className }: CategoryChipsProps) {
  const all = ['全部', ...categories]
  const scroller = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState({ left: false, right: false })

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const update = () => {
      setFade({
        left: el.scrollLeft > 8,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
      })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [categories.length])

  return (
    <div className={cn('relative min-w-0', className)}>
      <div
        ref={scroller}
        role="tablist"
        aria-label="分类筛选"
        className="flex gap-2 overflow-x-auto scrollbar-thin pb-1"
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
      {fade.right && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-zinc-950 to-transparent"
          aria-hidden="true"
        />
      )}
      {fade.left && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-zinc-950 to-transparent"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
