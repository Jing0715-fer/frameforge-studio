'use client'

import { useState } from 'react'
import { SiteHeader } from './site-header'
import { Hero } from './hero'
import { SiteFooter } from './site-footer'
import { StylesLibrary } from './styles-library'
import { PromptLibrary } from './prompt-library'
import { EffectsLibrary } from './effects-library'
import { Studio } from './studio'
import { useAppStore } from '@/lib/store'
import type { EffectItem, GenerationRecord, PromptItem, StyleItem } from '@/lib/types'

interface Props {
  initialStyles: StyleItem[]
  initialPrompts: PromptItem[]
  initialEffects: EffectItem[]
  initialHistory: GenerationRecord[]
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
        />
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {tab === 'styles' && <StylesLibrary styles={initialStyles} />}
          {tab === 'prompts' && (
            <PromptLibrary prompts={prompts} onCopyCountChange={bumpCopyCount} />
          )}
          {tab === 'effects' && <EffectsLibrary effects={initialEffects} />}
          {tab === 'studio' && (
            <Studio
              styles={initialStyles}
              prompts={prompts}
              history={history}
              onHistoryChange={setHistory}
            />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
