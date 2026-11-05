'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StudioFormState, TabKey } from './types'

interface AppState {
  tab: TabKey
  setTab: (tab: TabKey) => void
  form: StudioFormState
  patchForm: (patch: Partial<StudioFormState>) => void
  /** 从素材库一键套用风格 → 跳到工坊 */
  applyStyle: (slug: string) => void
  /** 从提示词库一键带入创意 → 跳到工坊 */
  applyPrompt: (content: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tab: 'styles',
      setTab: (tab) => set({ tab }),
      form: {
        idea: '',
        videoType: '产品发布',
        styleSlug: 'auto',
        duration: 30,
        aspect: '16:9',
        framework: 'hyperframes',
        pacing: 'medium',
        extra: '',
        outputMode: 'storyboard',
      },
      patchForm: (patch) => set((s) => ({ form: { ...s.form, ...patch } })),
      applyStyle: (slug) => set((s) => ({ tab: 'studio', form: { ...s.form, styleSlug: slug } })),
      applyPrompt: (content) =>
        set((s) => ({ tab: 'studio', form: { ...s.form, idea: content.slice(0, 1200) } })),
    }),
    {
      name: 'frameforge-app',
      // 只持久化表单：tab 等瞬态不存（刷新回到素材库首页更符合直觉）
      partialize: (s) => ({ form: s.form }),
    }
  )
)

// ============================================================
// 风格收藏夹：localStorage 持久化（369 个风格太长，收藏后秒找）
// ============================================================
interface FavState {
  /** 收藏的风格 slug 列表 */
  favSlugs: string[]
  toggleFav: (slug: string) => void
  isFav: (slug: string) => boolean
}

export const useFavStore = create<FavState>()(
  persist(
    (set, get) => ({
      favSlugs: [],
      toggleFav: (slug) =>
        set((s) => ({
          favSlugs: s.favSlugs.includes(slug)
            ? s.favSlugs.filter((x) => x !== slug)
            : [...s.favSlugs, slug],
        })),
      isFav: (slug) => get().favSlugs.includes(slug),
    }),
    { name: 'frameforge-style-favs' }
  )
)

/** 通用剪贴板复制（含降级方案） */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      return true
    } catch {
      return false
    }
  }
}
