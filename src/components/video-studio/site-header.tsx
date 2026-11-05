'use client'

import { Clapperboard, Github, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import type { TabKey } from '@/lib/types'
import { cn } from '@/lib/utils'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'styles', label: '风格素材库' },
  { key: 'prompts', label: 'Prompt 库' },
  { key: 'effects', label: '动效库' },
  { key: 'methodology', label: '创作方法论' },
  { key: 'studio', label: 'AI 分镜工坊' },
]

export function SiteHeader() {
  const tab = useAppStore((s) => s.tab)
  const setTab = useAppStore((s) => s.setTab)
  const setPaletteOpen = useAppStore((s) => s.setPaletteOpen)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          className="flex items-center gap-2.5"
          onClick={() => setTab('styles')}
          aria-label="回到首页"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
            <Clapperboard className="size-5 text-zinc-950" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-base font-bold tracking-tight text-zinc-50">
              FrameForge
            </span>
            <span className="block text-[11px] text-zinc-500">分镜工坊 · AI 视频灵感库</span>
          </span>
        </button>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? 'page' : undefined}
              className={cn(
                'h-9 rounded-lg px-3.5 text-sm font-medium transition-colors',
                tab === t.key
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100'
              )}
            >
              {t.label}
            </button>
          ))}
          <Button
            size="sm"
            onClick={() => setTab('studio')}
            className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-zinc-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400"
          >
            <Sparkles className="size-3.5" />
            开始创作
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          {/* 全局搜索入口（⌘K 命令面板） */}
          <button
            onClick={() => setPaletteOpen(true)}
            aria-label="打开全局搜索（Ctrl+K）"
            className="hidden h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 pl-2.5 pr-1.5 text-sm text-zinc-500 transition-colors hover:border-zinc-700 hover:bg-zinc-800/70 hover:text-zinc-300 lg:flex"
          >
            <Search className="size-3.5" />
            <span className="pr-6">搜索风格 / 提示词 / 动效</span>
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setPaletteOpen(true)}
            aria-label="打开全局搜索"
            className="flex size-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100 lg:hidden"
          >
            <Search className="size-4" />
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 xl:flex"
            aria-label="开源灵感仓库"
          >
            <Github className="size-3.5" />
            灵感源自开源社区
          </a>
        </div>
      </div>

      {/* 移动端导航 */}
      <nav
        className="relative flex items-center gap-1 overflow-x-auto scrollbar-thin border-t border-zinc-800/60 px-3 py-2 md:hidden"
        aria-label="移动端导航"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key ? 'page' : undefined}
            className={cn(
              'h-9 shrink-0 rounded-lg px-3 text-[13px] font-medium transition-colors',
              tab === t.key
                ? 'bg-amber-500/15 text-amber-300'
                : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100'
            )}
          >
            {t.label}
          </button>
        ))}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-zinc-950 to-transparent"
          aria-hidden="true"
        />
      </nav>
    </header>
  )
}
