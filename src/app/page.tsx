import { db } from '@/lib/db'
import { VideoStudioApp } from '@/components/video-studio/video-studio-app'
import type {
  EffectItem,
  HistoryListItem,
  PromptItem,
  StyleItem,
} from '@/lib/types'

export const dynamic = 'force-dynamic'

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p
  } catch (err) {
    console.error('[page] 数据加载失败', err)
    return fallback
  }
}

export default async function Page() {
  const [styles, prompts, effects, generations] = await Promise.all([
    safe(db.style.findMany({ orderBy: { id: 'asc' } }), []),
    safe(db.prompt.findMany({ orderBy: { id: 'asc' } }), []),
    safe(db.effect.findMany({ orderBy: { id: 'asc' } }), []),
    // 历史列表不带 output 大字段：列表只展示概要，载入时按需拉取 /api/generations/[id]
    safe(
      db.generation.findMany({
        orderBy: [{ starred: 'desc' }, { createdAt: 'desc' }],
        take: 24,
        select: {
          id: true,
          title: true,
          logline: true,
          framework: true,
          styleName: true,
          starred: true,
          ideaText: true,
          createdAt: true,
        },
      }),
      []
    ),
  ])

  const initialStyles: StyleItem[] = styles.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }))
  const initialPrompts: PromptItem[] = prompts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }))
  const initialEffects: EffectItem[] = effects.map((e) => ({ ...e }))
  const initialHistory: HistoryListItem[] = generations.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
  }))

  return (
    <VideoStudioApp
      initialStyles={initialStyles}
      initialPrompts={initialPrompts}
      initialEffects={initialEffects}
      initialHistory={initialHistory}
    />
  )
}
