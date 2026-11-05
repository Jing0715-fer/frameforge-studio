'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowUp } from 'lucide-react'
import { SiteHeader } from './site-header'
import { Hero } from './hero'
import { SiteFooter } from './site-footer'
import { StylesLibrary } from './styles-library'
import { PromptLibrary } from './prompt-library'
import { EffectsLibrary } from './effects-library'
import { MethodologyGuide } from './methodology-guide'
import { Studio } from './studio'
import { AudioSync } from './audio-sync'
import { CommandPalette } from './command-palette'
import { InspirationDice } from './inspiration-dice'
import { useAppStore, useFavStore } from '@/lib/store'
import type { EffectItem, HistoryListItem, PromptItem, StyleItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  initialStyles: StyleItem[]
  initialPrompts: PromptItem[]
  initialEffects: EffectItem[]
  initialHistory: HistoryListItem[]
}

export function VideoStudioApp({
  initialStyles,
  initialPrompts,
  initialEffects,
  initialHistory,
}: Props) {
  const tab = useAppStore((s) => s.tab)
  // 提示词的复制计数在客户端维护（乐观更新 + 后端持久化）
  const [prompts, setPrompts] = useState(initialPrompts)
  const [history, setHistory] = useState(initialHistory)
  // 弹层类组件（Radix useId 消费者）仅客户端挂载，避免 SSR/水合 useId 错位
  // useSyncExternalStore：服务端快照 false / 客户端快照 true，水合后自动切换
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  useEffect(() => {
    // 持久化状态（表单/收藏）挂载后再注入，保证首帧与 SSR HTML 完全一致
    useAppStore.persist.rehydrate()
    useFavStore.persist.rehydrate()
  }, [])
  // 切换标签时回到内容区顶部（避开吸顶导航）
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const y = (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 76
    if (Math.abs(window.scrollY - y) > 4) window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' })
  }, [tab])

  function bumpCopyCount(id: number) {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, copyCount: p.copyCount + 1 } : p))
    )
    fetch('/api/prompts/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {
      /* 计数失败静默处理 */
    })
  }

  // Hero 轮播池：精选系列里带色板的风格（视觉冲击力优先）
  const showcaseStyles = initialStyles.filter(
    (s) => (s.series || '精选') === '精选' && s.palette.trim().length > 0
  )

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <main className="flex-1">
        <Hero
          stats={{
            styles: initialStyles.length,
            prompts: prompts.length,
            effects: initialEffects.length,
          }}
          showcaseStyles={showcaseStyles}
        />
        <section ref={sectionRef} className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10">
          {tab === 'styles' && <StylesLibrary styles={initialStyles} />}
          {tab === 'prompts' && (
            <PromptLibrary prompts={prompts} onCopyCountChange={bumpCopyCount} />
          )}
          {tab === 'effects' && <EffectsLibrary effects={initialEffects} />}
          {tab === 'methodology' && <MethodologyGuide />}
          {tab === 'studio' && (
            <Studio
              styles={initialStyles}
              prompts={prompts}
              history={history}
              onHistoryChange={setHistory}
            />
          )}
          {tab === 'sync' && <AudioSync />}
        </section>
      </main>
      <SiteFooter />

      {/* 全局能力：⌘K 命令面板 + 灵感骰子 + 回到顶部 */}
      {mounted && (
        <CommandPalette
          styles={initialStyles}
          prompts={prompts}
          effects={initialEffects}
        />
      )}
      {mounted && (
        <InspirationDice
          styles={initialStyles}
          prompts={prompts}
          effects={initialEffects}
        />
      )}
      <BackToTop />
    </div>
  )
}

/** 滚动较深后出现的回到顶部悬浮按钮 */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 640)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
      className={cn(
        'fixed bottom-4 right-4 z-40 flex size-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-zinc-300 shadow-xl shadow-black/40 backdrop-blur transition-all hover:border-amber-500/50 hover:text-amber-300',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <ArrowUp className="size-4" />
    </button>
  )
}
