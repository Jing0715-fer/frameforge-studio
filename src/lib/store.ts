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
  /** 命令面板（⌘K）开关：瞬态，不持久化 */
  paletteOpen: boolean
  setPaletteOpen: (open: boolean) => void
  /** 灵感骰子弹窗开关：瞬态，不持久化 */
  diceOpen: boolean
  setDiceOpen: (open: boolean) => void
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
      paletteOpen: false,
      setPaletteOpen: (open) => set({ paletteOpen: open }),
      diceOpen: false,
      setDiceOpen: (open) => set({ diceOpen: open }),
    }),
    {
      name: 'frameforge-app',
      // 只持久化表单：tab 等瞬态不存（刷新回到素材库首页更符合直觉）
      partialize: (s) => ({ form: s.form }),
      // 关闭自动同步 rehydrate：localStorage 状态若在水合前注入，客户端首帧会与
      // SSR HTML 不一致 → useId 树上下文错位 → hydration mismatch。
      // 改为挂载后由 VideoStudioApp 手动 rehydrate()（见 video-studio-app.tsx）
      skipHydration: true,
    }
  )
)

// ============================================================
// 收藏夹中心：风格 slug / 提示词 id / 动效 id 三类素材统一收藏
// localStorage 持久化（534 件素材太长，收藏后秒找）
// ============================================================
interface FavState {
  /** 收藏的风格 slug 列表 */
  favSlugs: string[]
  /** 收藏的提示词 id 列表 */
  favPromptIds: number[]
  /** 收藏的动效 id 列表 */
  favEffectIds: number[]
  toggleFav: (slug: string) => void
  toggleFavPrompt: (id: number) => void
  toggleFavEffect: (id: number) => void
  isFav: (slug: string) => boolean
  /** 各库的「我的收藏」过滤开关（瞬态，不持久化） */
  promptFavOnly: boolean
  effectFavOnly: boolean
  setPromptFavOnly: (v: boolean) => void
  setEffectFavOnly: (v: boolean) => void
}

export const useFavStore = create<FavState>()(
  persist(
    (set, get) => ({
      favSlugs: [],
      favPromptIds: [],
      favEffectIds: [],
      toggleFav: (slug) =>
        set((s) => ({
          favSlugs: s.favSlugs.includes(slug)
            ? s.favSlugs.filter((x) => x !== slug)
            : [...s.favSlugs, slug],
        })),
      toggleFavPrompt: (id) =>
        set((s) => ({
          favPromptIds: s.favPromptIds.includes(id)
            ? s.favPromptIds.filter((x) => x !== id)
            : [...s.favPromptIds, id],
        })),
      toggleFavEffect: (id) =>
        set((s) => ({
          favEffectIds: s.favEffectIds.includes(id)
            ? s.favEffectIds.filter((x) => x !== id)
            : [...s.favEffectIds, id],
        })),
      isFav: (slug) => get().favSlugs.includes(slug),
      promptFavOnly: false,
      effectFavOnly: false,
      setPromptFavOnly: (v) => set({ promptFavOnly: v }),
      setEffectFavOnly: (v) => set({ effectFavOnly: v }),
    }),
    {
      name: 'frameforge-style-favs',
      // 同上：挂载后手动 rehydrate，避免收藏状态早于水合注入导致 mismatch
      skipHydration: true,
      partialize: (s) => ({
        favSlugs: s.favSlugs,
        favPromptIds: s.favPromptIds,
        favEffectIds: s.favEffectIds,
      }),
    }
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
