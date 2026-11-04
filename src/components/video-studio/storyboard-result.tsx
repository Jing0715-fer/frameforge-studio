'use client'

import { useState } from 'react'
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  CornerDownRight,
  ListChecks,
  Mic,
  MonitorSmartphone,
  Music,
  Palette,
  Sparkles,
  Terminal,
  Volume2,
  Wand2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CopyButton } from './copy-button'
import { ResultActions, type CurrentGeneration } from './studio'
import { formatTC } from '@/lib/markdown'
import { FRAMEWORK_LABELS, PACING_LABELS, type FrameworkKey, type PacingKey } from '@/lib/types'
import type { StoryboardShot } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StoryboardResultView({
  current,
  onCopyMarkdown,
  onDownload,
  onCopyAllPrompts,
}: {
  current: CurrentGeneration
  onCopyMarkdown: () => void
  onDownload: () => void
  onCopyAllPrompts: () => void
}) {
  const { result, meta } = current
  const totalSec = result.totalDuration ?? meta.duration ?? 0

  return (
    <div className="space-y-5">
      {/* ===== 头部总览 ===== */}
      <Card className="animate-in fade-in slide-in-from-bottom-2 border-zinc-800 bg-zinc-900/50 duration-500">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] font-medium text-amber-400">
                <Sparkles className="size-3.5" />
                AI 分镜稿已交付
              </div>
              <h3 className="mt-1.5 text-xl font-bold leading-snug text-zinc-50 sm:text-2xl">
                {result.title}
              </h3>
              {result.logline && (
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{result.logline}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <MetaBadge icon={<Palette className="size-3" />} text={result.styleGuide?.name ?? meta.styleName} />
                <MetaBadge icon={<Clock className="size-3" />} text={`${result.shots.length} 镜头 · ${formatTC(totalSec)}`} />
                <MetaBadge icon={<MonitorSmartphone className="size-3" />} text={meta.aspect ?? '16:9'} />
                <MetaBadge
                  icon={<Music className="size-3" />}
                  text={PACING_LABELS[(meta.pacing as PacingKey) ?? 'medium'] ?? '标准节奏'}
                />
                <MetaBadge
                  icon={<Terminal className="size-3" />}
                  text={FRAMEWORK_LABELS[(meta.framework as FrameworkKey) ?? 'generic'] ?? meta.framework}
                />
              </div>
            </div>
            <ResultActions
              onCopyMarkdown={onCopyMarkdown}
              onDownload={onDownload}
              onCopyAllPrompts={onCopyAllPrompts}
            />
          </div>

          {(result.styleGuide || result.musicStyle) && (
            <>
              <Separator className="my-5 bg-zinc-800/80" />
              <div className="grid gap-4 sm:grid-cols-2">
                {result.styleGuide && (
                  <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-3.5">
                    <div className="text-xs font-semibold text-zinc-300">视觉风格指南</div>
                    {result.styleGuide.palette?.length ? (
                      <div className="mt-2 flex gap-1.5">
                        {result.styleGuide.palette.map((c, i) => (
                          <span
                            key={i}
                            className="h-7 flex-1 rounded-md border border-white/10"
                            style={{ background: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    ) : null}
                    <dl className="mt-2.5 space-y-1 text-[11px] leading-relaxed text-zinc-500">
                      {result.styleGuide.typography && (
                        <div>
                          <dt className="inline text-zinc-600">字体版式 · </dt>
                          <dd className="inline">{result.styleGuide.typography}</dd>
                        </div>
                      )}
                      {result.styleGuide.texture && (
                        <div>
                          <dt className="inline text-zinc-600">质感纹理 · </dt>
                          <dd className="inline">{result.styleGuide.texture}</dd>
                        </div>
                      )}
                      {result.styleGuide.motionTone && (
                        <div>
                          <dt className="inline text-zinc-600">动效基调 · </dt>
                          <dd className="inline">{result.styleGuide.motionTone}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
                {result.musicStyle && (
                  <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Music className="size-3.5 text-amber-400/80" />
                      配乐与音效
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                      {result.musicStyle}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ===== 镜头时间轴 ===== */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Camera className="size-4 text-amber-400" />
          分镜脚本 · {result.shots.length} 个镜头
        </h4>
        <div className="space-y-4">
          {result.shots.map((shot, i) => (
            <ShotCard key={i} shot={shot} index={i} />
          ))}
        </div>
      </div>

      {/* ===== 实现建议 + 验收清单 ===== */}
      {(result.implementationNotes?.length || result.checklist?.length) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {result.implementationNotes?.length ? (
            <Card className="animate-in fade-in slide-in-from-bottom-2 border-zinc-800 bg-zinc-900/50 duration-500">
              <CardContent className="p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <ListChecks className="size-4 text-amber-400" />
                  整体实现建议
                </h4>
                <ul className="mt-3 space-y-2">
                  {result.implementationNotes.map((n, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-zinc-400">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-500/70" />
                      {n}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          {result.checklist?.length ? (
            <Card className="animate-in fade-in slide-in-from-bottom-2 border-zinc-800 bg-zinc-900/50 duration-500">
              <CardContent className="p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  交付验收清单
                </h4>
                <ul className="mt-3 space-y-2">
                  {result.checklist.map((c, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-zinc-400">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500/70" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}

function MetaBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Badge
      variant="outline"
      className="gap-1 border-zinc-800 bg-zinc-950/60 px-2 text-[11px] font-normal text-zinc-400"
    >
      {icon}
      {text}
    </Badge>
  )
}

function ShotCard({ shot, index }: { shot: StoryboardShot; index: number }) {
  const [showPrompt, setShowPrompt] = useState(index < 1) // 默认展开第一个
  const duration = Math.max(0, shot.end - shot.start)

  return (
    <div
      className="relative animate-in fade-in slide-in-from-bottom-2 pl-14 duration-500 sm:pl-16"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      {/* 时间轴轨道 */}
      <div className="absolute bottom-3 left-[22px] top-3 w-px bg-zinc-800" aria-hidden="true" />
      <div
        className="absolute left-[17px] top-[26px] size-3 rounded-full border-2 border-amber-500 bg-zinc-950"
        aria-hidden="true"
      />
      <div className="absolute left-0 top-3.5 w-11 text-right sm:w-12">
        <div className="font-mono text-[11px] font-bold text-amber-400">
          {formatTC(shot.start)}
        </div>
        <div className="font-mono text-[10px] text-zinc-600">{formatTC(shot.end)}</div>
        <div className="mt-0.5 font-mono text-[9px] text-zinc-700">{duration.toFixed(1)}s</div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500/15 text-[11px] font-bold text-amber-300 hover:bg-amber-500/15">
              镜头 {String(shot.index).padStart(2, '0')}
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-[11px] text-zinc-300">
              {shot.shotSize}
            </Badge>
            {shot.transition && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                <CornerDownRight className="size-3" />
                转场：{shot.transition}
              </span>
            )}
          </div>

          {shot.scene && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500">
                <Camera className="size-3" />
                画面
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-200">{shot.scene}</p>
            </div>
          )}

          {shot.motion && (
            <div className="mt-3 rounded-lg border-l-2 border-amber-500/70 bg-amber-500/[0.06] px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400/90">
                <Wand2 className="size-3" />
                运镜与动效
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-300">{shot.motion}</p>
            </div>
          )}

          <div className="mt-3 space-y-2">
            {shot.caption && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-500">字幕</span>
                <span className="rounded-md bg-black/70 px-3 py-1.5 text-[13px] font-medium text-zinc-100 shadow-inner">
                  {shot.caption}
                </span>
              </div>
            )}
            {shot.narration && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
                  <Mic className="size-3" />
                  旁白
                </span>
                <span className="text-xs italic leading-relaxed text-zinc-400">
                  「{shot.narration}」
                </span>
              </div>
            )}
            {shot.sfx && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
                  <Volume2 className="size-3" />
                  音效
                </span>
                <span className="text-xs text-zinc-400">{shot.sfx}</span>
              </div>
            )}
          </div>

          {shot.prompt && (
            <div className="mt-4 border-t border-zinc-800/80 pt-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowPrompt((v) => !v)}
                  aria-expanded={showPrompt}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 transition-colors hover:text-amber-300"
                >
                  <Terminal className="size-3" />
                  实现提示词 · 可直接投喂 AI 编程工具
                  <ChevronDown
                    className={cn('size-3 transition-transform', showPrompt && 'rotate-180')}
                  />
                </button>
                <CopyButton
                  text={shot.prompt}
                  label=""
                  size="sm"
                  variant="ghost"
                  className="h-6 w-7 px-0 text-zinc-500 hover:text-amber-300"
                  toastMessage={`镜头 ${shot.index} 实现提示词已复制`}
                />
              </div>
              {showPrompt && (
                <div className="mt-2.5 overflow-x-auto scrollbar-thin rounded-lg border border-zinc-800 bg-zinc-950/80 p-3.5">
                  <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-zinc-300">
                    <code>{shot.prompt}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
