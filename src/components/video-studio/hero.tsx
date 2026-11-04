'use client'

import { ArrowRight, Layers, Lightbulb, Palette, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export interface HeroStats {
  styles: number
  prompts: number
  effects: number
}

export function Hero({ stats }: { stats: HeroStats }) {
  const setTab = useAppStore((s) => s.setTab)

  const statItems = [
    { icon: Githublike, value: '15+1', label: '源开源项目/附件' },
    { icon: Palette, value: String(stats.styles), label: '影片风格' },
    { icon: Lightbulb, value: String(stats.prompts), label: '精选提示词' },
    { icon: Wand2, value: String(stats.effects), label: '动效预设' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/60">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 ff-grid-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl ff-glow"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:py-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Sparkles className="size-3.5" />
            融汇 15 个开源项目 + 341 风格库附件 + fy-code-animation 方法论
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-5xl">
            从一句话，
            <br className="hidden sm:block" />
            到
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              可直接开拍
            </span>
            的分镜稿
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
            风格素材库 × Prompt 库 × 动效预设库 × 创作方法论四位一体。AI
            导演按 fy 语义分镜方法产出逐镜头分镜稿或 12
            节任务卡，含动效规格与实现提示词，
            直接驱动 Claude Code + Hyperframes / Remotion / p5.js 出片。
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => setTab('studio')}
              className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-base font-semibold text-zinc-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400"
            >
              <Sparkles className="size-4" />
              生成我的分镜稿
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setTab('styles')}
              className="h-12 border-zinc-700 bg-zinc-900/50 px-6 text-base text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50"
            >
              <Layers className="size-4" />
              浏览素材库
            </Button>
          </div>

          <dl className="mt-9 grid max-w-lg grid-cols-4 gap-3">
            {statItems.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3 py-3 text-center"
              >
                <dt className="flex items-center justify-center gap-1 text-[11px] text-zinc-500">
                  <s.icon className="size-3" />
                  {s.label}
                </dt>
                <dd className="mt-1 text-xl font-bold text-zinc-100">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 装饰：动态分镜条 */}
        <div className="relative hidden lg:block" aria-hidden="true">
          <div className="relative -rotate-2">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-lg border border-zinc-700/80 bg-zinc-900/80 shadow-xl ${
                    i === 0 ? 'ff-float' : i === 1 ? 'ff-float-2' : 'ff-float-3'
                  }`}
                >
                  <div className="relative aspect-video">
                    {i === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-zinc-800 to-zinc-900 p-3">
                        <div className="h-2.5 w-3/4 rounded bg-amber-400/70" />
                        <div className="mt-2 h-1.5 w-1/2 rounded bg-zinc-600" />
                        <div className="absolute bottom-3 left-3 font-mono text-[9px] text-amber-300/80">
                          00:00 · 特写
                        </div>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-zinc-800 to-zinc-900 p-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-rose-400/80 to-orange-500/60" />
                        <div className="mt-3 h-1.5 w-2/3 rounded bg-zinc-600" />
                        <div className="absolute bottom-3 left-3 font-mono text-[9px] text-rose-300/80">
                          00:08 · 中景
                        </div>
                      </div>
                    )}
                    {i === 2 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-zinc-800 to-zinc-900 p-3">
                        <div className="flex gap-1.5">
                          <div className="h-10 w-5 rounded bg-teal-400/70" />
                          <div className="h-10 w-5 rounded bg-zinc-600" />
                          <div className="h-10 w-5 rounded bg-amber-400/60" />
                        </div>
                        <div className="mt-3 h-1.5 w-1/2 rounded bg-zinc-600" />
                        <div className="absolute bottom-3 left-3 font-mono text-[9px] text-teal-300/80">
                          00:16 · 全景
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex h-5 items-center px-2 ff-sprocket bg-zinc-950" />
                </div>
              ))}
            </div>
            {/* 播放头 */}
            <div className="pointer-events-none absolute -top-2 bottom-0 w-px bg-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.9)] ff-playhead" />
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-zinc-600">
            <span>00:00</span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <ArrowRight className="size-3" />
              TIMELINE · 30 FPS · 1080P
            </span>
            <span>00:24</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Githublike(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}
