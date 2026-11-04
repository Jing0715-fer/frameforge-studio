'use client'

import { Clapperboard, Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { REPOS } from '@/lib/repos'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600">
                <Clapperboard className="size-4 text-zinc-950" />
              </span>
              <span className="text-sm font-bold text-zinc-100">FrameForge 分镜工坊</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-zinc-500">
              视频风格、提示词与动效素材库，加上 AI
              分镜导演。所有资产整理自开源社区，可自由取用；用 AI 把灵感炼成成片。
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              灵感来源 · 15 个开源项目 + 341 风格库附件
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {REPOS.map((r) => (
                <li
                  key={r.slug}
                  title={r.desc}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-[11px] text-zinc-400"
                >
                  <span className="font-mono text-amber-500/80">#{r.rank}</span>
                  <span className="max-w-56 truncate">{r.name}</span>
                  <span className="flex items-center gap-0.5 text-zinc-600">
                    <Star className="size-3 fill-current" />
                    {r.stars}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="my-6 bg-zinc-800/80" />
        <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-zinc-600 sm:flex-row">
          <span>© 2025 FrameForge 分镜工坊 · 用 AI 把灵感炼成成片</span>
          <span>Next.js · Prisma · shadcn/ui · z-ai-web-dev-sdk</span>
        </div>
      </div>
    </footer>
  )
}
