'use client'

// 灵感骰子：随机掷出一套「风格 × 提示词 × 动效」组合
// 解决「素材太多不知道选哪个」的选择困难：一键随机搭配，不满意就再掷
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Copy,
  Dices,
  Lightbulb,
  Palette,
  RefreshCw,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StylePreview } from './style-preview'
import { copyText, useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import type { EffectItem, PromptItem, StyleItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  styles: StyleItem[]
  prompts: PromptItem[]
  effects: EffectItem[]
}

interface DiceCombo {
  style: StyleItem
  prompt: PromptItem
  effectA: EffectItem
  effectB: EffectItem
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 掷骰：风格取带提示词的优先池；动效取两个不同类别，组合更有戏剧性 */
function roll(styles: StyleItem[], prompts: PromptItem[], effects: EffectItem[]): DiceCombo {
  const stylePool = styles.filter((s) => s.promptFull || s.starterPrompt)
  const promptPool = prompts.filter((p) => p.content.length >= 20)
  const e1 = pick(effects)
  const others = effects.filter((e) => e.category !== e1.category)
  return {
    style: pick(stylePool.length ? stylePool : styles),
    prompt: pick(promptPool.length ? promptPool : prompts),
    effectA: e1,
    effectB: others.length ? pick(others) : pick(effects),
  }
}

export function InspirationDice({ styles, prompts, effects }: Props) {
  const open = useAppStore((s) => s.diceOpen)
  const setOpen = useAppStore((s) => s.setDiceOpen)
  const applyStyle = useAppStore((s) => s.applyStyle)
  const applyPrompt = useAppStore((s) => s.applyPrompt)

  const [combo, setCombo] = useState<DiceCombo | null>(null)
  const [rolling, setRolling] = useState(false)

  const rollOnce = useCallback(() => {
    setRolling(true)
    // 滚动动画 600ms 后定格
    const next = roll(styles, prompts, effects)
    window.setTimeout(() => {
      setCombo(next)
      setRolling(false)
    }, 600)
  }, [styles, prompts, effects])

  // 每次打开自动掷一次（setTimeout 避免在 effect 内同步 setState）
  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      wasOpenRef.current = true
      const t = setTimeout(rollOnce, 60)
      return () => clearTimeout(t)
    }
    if (!open) wasOpenRef.current = false
  }, [open, rollOnce])

  const masterPrompt = useMemo(() => {
    if (!combo) return ''
    const stylePrompt = combo.style.promptFull || combo.style.starterPrompt
    return [
      `【风格】${combo.style.name}（${combo.style.sid || combo.style.series}）`,
      stylePrompt.slice(0, 400),
      '',
      `【创意方向】${combo.prompt.title}`,
      combo.prompt.content.slice(0, 600),
      '',
      `【动效配方】`,
      `1. ${combo.effectA.name}：${combo.effectA.prompt.slice(0, 200)}`,
      `2. ${combo.effectB.name}：${combo.effectB.prompt.slice(0, 200)}`,
    ].join('\n')
  }, [combo])

  async function copyMaster() {
    if (!masterPrompt) return
    const ok = await copyText(masterPrompt)
    if (ok) toast.success('整套灵感提示词已复制', { description: '可直接投喂 AI 编程工具' })
    else toast.error('复制失败')
  }

  function applyToStudio() {
    if (!combo) return
    applyStyle(combo.style.slug)
    // 把创意方向拼进想法框：骰子创意 + 动效建议
    const ideaText = [
      combo.prompt.content.slice(0, 800),
      '',
      `（希望融入动效：${combo.effectA.name}、${combo.effectB.name}）`,
    ].join('\n')
    // applyStyle 已切到 studio，这里再补 idea（直接 patch，避免两次 setTab）
    useAppStore.getState().patchForm({ idea: ideaText })
    setOpen(false)
    toast.success('灵感已就位！', {
      description: `风格「${combo.style.name}」+ 创意已带入工坊，可直接生成`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[88vh] overflow-y-auto scrollbar-thin border-zinc-800 bg-zinc-950 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className={cn(
                'flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600',
                rolling && 'ff-dice-rolling'
              )}
            >
              <Dices className="size-4.5 text-zinc-950" />
            </span>
            灵感骰子
            <span className="text-xs font-normal text-zinc-500">随机风格 × 提示词 × 动效</span>
          </DialogTitle>
          <DialogDescription className="text-left">
            534 件素材随机搭配一套开机组合。不满意？再掷一次就好。
          </DialogDescription>
        </DialogHeader>

        {!combo ? (
          <div className="flex h-40 items-center justify-center text-sm text-zinc-500">
            <RefreshCw className="mr-2 size-4 animate-spin" />
            掷骰中…
          </div>
        ) : (
          <div className={cn('space-y-4 transition-opacity', rolling && 'ff-dice-blur')}>
            {/* 风格 */}
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
              <div className="relative">
                <StylePreview style={combo.style} className="aspect-[21/9] w-full" rounded="rounded-none" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                  <Badge className="border-white/20 bg-black/60 text-[11px] text-white/90 backdrop-blur">
                    <Palette className="mr-1 size-3" />
                    {combo.style.sid || combo.style.series} · {combo.style.name}
                  </Badge>
                </div>
              </div>
              <div className="px-3.5 py-3">
                <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                  {combo.style.looksLike || combo.style.description}
                </p>
              </div>
            </div>

            {/* 提示词 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Lightbulb className="size-3.5 text-amber-400" />
                创意方向 · {combo.prompt.title}
              </div>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                {combo.prompt.content}
              </p>
            </div>

            {/* 动效 */}
            <div className="grid grid-cols-2 gap-3">
              {[combo.effectA, combo.effectB].map((e, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    <Zap className="size-3.5 text-amber-400" />
                    {e.name}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
                    {e.description}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 border-zinc-800 px-1.5 text-[10px] font-normal text-zinc-500"
                  >
                    {e.category}
                  </Badge>
                </div>
              ))}
            </div>

            {/* 动作 */}
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={rollOnce} disabled={rolling}
                className="border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800">
                <RefreshCw className={cn('size-3.5', rolling && 'animate-spin')} />
                再掷一次
              </Button>
              <Button variant="outline" size="sm" onClick={copyMaster}
                className="border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800">
                <Copy className="size-3.5" />
                复制整套提示词
              </Button>
              <Button size="sm" onClick={applyToStudio}
                className="bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-zinc-950 hover:from-amber-400 hover:to-orange-400">
                <Wand2 className="size-3.5" />
                用这套灵感去生成
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/** 触发按钮（Hero / 空状态复用） */
export function DiceButton({ label = '掷个灵感骰子', size = 'lg' }: { label?: string; size?: 'sm' | 'lg' }) {
  const setDiceOpen = useAppStore((s) => s.setDiceOpen)
  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => setDiceOpen(true)}
      className={
        size === 'lg'
          ? 'h-12 border-amber-500/40 bg-amber-500/10 px-6 text-base text-amber-300 hover:bg-amber-500/20 hover:text-amber-200'
          : 'border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800'
      }
    >
      <Dices className="size-4" />
      {label}
      <Sparkles className="size-3.5 opacity-60" />
    </Button>
  )
}
