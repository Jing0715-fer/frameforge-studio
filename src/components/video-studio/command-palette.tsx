'use client'

// 全局命令面板（⌘K / Ctrl+K）：跨素材库的全局搜索 + 快捷动作
// 汇聚 369 风格 / 80 提示词 / 85 动效，键盘直达，不用翻页找素材
// 注：cmdk 会对已渲染的 CommandItem 按 value 做客户端过滤，因此全部渲染、由其过滤
import { useEffect } from 'react'
import {
  Clapperboard,
  Command as CommandIcon,
  Copy,
  Dices,
  Lightbulb,
  Palette,
  Search,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { copyText, useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import type { EffectItem, PromptItem, StyleItem, TabKey } from '@/lib/types'

interface Props {
  styles: StyleItem[]
  prompts: PromptItem[]
  effects: EffectItem[]
}

const NAV_ITEMS: { key: TabKey; label: string; icon: typeof Palette }[] = [
  { key: 'styles', label: '风格素材库', icon: Palette },
  { key: 'prompts', label: 'Prompt 库', icon: Lightbulb },
  { key: 'effects', label: '动效库', icon: Zap },
  { key: 'methodology', label: '创作方法论', icon: Clapperboard },
  { key: 'studio', label: 'AI 分镜工坊', icon: Wand2 },
]

export function CommandPalette({ styles, prompts, effects }: Props) {
  const open = useAppStore((s) => s.paletteOpen)
  const setOpen = useAppStore((s) => s.setPaletteOpen)
  const setTab = useAppStore((s) => s.setTab)
  const applyStyle = useAppStore((s) => s.applyStyle)
  const applyPrompt = useAppStore((s) => s.applyPrompt)
  const setDiceOpen = useAppStore((s) => s.setDiceOpen)

  // 全局快捷键：⌘K / Ctrl+K 开关
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!useAppStore.getState().paletteOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  async function copyAndToast(text: string, label: string) {
    const ok = await copyText(text)
    if (ok) toast.success(`${label}已复制`)
    else toast.error('复制失败，请手动选择复制')
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="border-zinc-800 bg-zinc-950/95 backdrop-blur-xl"
    >
      <CommandInput placeholder="搜索风格 / 提示词 / 动效，或执行快捷动作…" />
      <CommandList className="scrollbar-thin">
        <CommandEmpty className="py-8 text-center text-sm text-zinc-500">
          没有匹配的素材，换个关键词试试
        </CommandEmpty>

        {/* 快捷动作 */}
        <CommandGroup heading={<GroupLabel icon={Sparkles} text="快捷动作" />}>
          <CommandItem
            value="打开 分镜工坊 生成 studio generate"
            onSelect={() => {
              setOpen(false)
              setTab('studio')
            }}
            className="text-zinc-300 aria-selected:bg-amber-500/15 aria-selected:text-amber-300"
          >
            <Wand2 className="size-4 text-amber-400" />
            <span>打开 AI 分镜工坊</span>
            <CommandShortcut>生成分镜稿</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="灵感骰子 随机 搭配 dice random lucky"
            onSelect={() => {
              setOpen(false)
              setDiceOpen(true)
            }}
            className="text-zinc-300 aria-selected:bg-amber-500/15 aria-selected:text-amber-300"
          >
            <Dices className="size-4 text-amber-400" />
            <span>掷一次灵感骰子</span>
            <CommandShortcut>随机风格 × 提示词 × 动效</CommandShortcut>
          </CommandItem>
          {NAV_ITEMS.map((n) => (
            <CommandItem
              key={n.key}
              value={`前往 goto ${n.label} ${n.key} 导航 navigate`}
              onSelect={() => {
                setOpen(false)
                setTab(n.key)
              }}
              className="text-zinc-300 aria-selected:bg-zinc-800/80 aria-selected:text-zinc-100"
            >
              <n.icon className="size-4 text-zinc-500" />
              <span>前往{n.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="bg-zinc-800/80" />

        {/* 风格：全部渲染，cmdk 按 value 过滤 */}
        <CommandGroup heading={<GroupLabel icon={Palette} text={`风格 · ${styles.length} 种`} suffix="回车套用并去生成" />}>
          {styles.map((s) => {
            const colors = s.palette.split(',').map((c) => c.trim()).filter(Boolean)
            return (
              <CommandItem
                key={s.id}
                value={`风格 style ${s.name} ${s.nameEn} ${s.sid} ${s.tags} ${s.series} ${s.description}`}
                onSelect={() => {
                  setOpen(false)
                  applyStyle(s.slug)
                  toast.success(`已应用风格「${s.name}」`, { description: '表单已就绪，补充创意即可生成' })
                }}
                className="text-zinc-300 aria-selected:bg-amber-500/15 aria-selected:text-amber-300"
              >
                <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
                  {colors.length >= 2 ? (
                    <span
                      className="size-3.5 rounded-full border border-white/20"
                      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                    />
                  ) : (
                    <Palette className="size-4 text-zinc-600" />
                  )}
                </span>
                <span className="min-w-0 truncate">{s.name}</span>
                <span className="ml-1.5 shrink-0 font-mono text-[10px] uppercase text-zinc-600">
                  {s.sid || s.series}
                </span>
                <CommandShortcut>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyAndToast(s.promptFull || s.starterPrompt, '风格提示词')
                    }}
                    className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                    aria-label={`复制 ${s.name} 提示词`}
                  >
                    <Copy className="size-3" />
                    提示词
                  </button>
                </CommandShortcut>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator className="bg-zinc-800/80" />

        {/* 提示词 */}
        <CommandGroup heading={<GroupLabel icon={Lightbulb} text={`提示词 · ${prompts.length} 条`} suffix="回车带入工坊" />}>
          {prompts.map((p) => (
            <CommandItem
              key={p.id}
              value={`提示词 prompt ${p.title} ${p.tags} ${p.category} ${p.useCase}`}
              onSelect={() => {
                setOpen(false)
                applyPrompt(p.content)
                toast.success(`已带入创意「${p.title}」`)
              }}
              className="text-zinc-300 aria-selected:bg-zinc-800/80 aria-selected:text-zinc-100"
            >
              <Lightbulb className="size-4 shrink-0 text-amber-400/80" />
              <span className="min-w-0 truncate">{p.title}</span>
              <CommandShortcut>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyAndToast(p.content, '提示词')
                  }}
                  className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                  aria-label={`复制 ${p.title}`}
                >
                  <Copy className="size-3" />
                  复制
                </button>
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="bg-zinc-800/80" />

        {/* 动效 */}
        <CommandGroup heading={<GroupLabel icon={Zap} text={`动效 · ${effects.length} 个`} suffix="回车复制动效提示词" />}>
          {effects.map((e) => (
            <CommandItem
              key={e.id}
              value={`动效 effect ${e.name} ${e.nameEn} ${e.category}`}
              onSelect={() => copyAndToast(e.prompt, `动效「${e.name}」提示词`)}
              className="text-zinc-300 aria-selected:bg-zinc-800/80 aria-selected:text-zinc-100"
            >
              <Zap className="size-4 shrink-0 text-amber-400/80" />
              <span className="min-w-0 truncate">{e.name}</span>
              <span className="ml-1.5 shrink-0 rounded border border-zinc-800 bg-zinc-900 px-1 text-[10px] text-zinc-500">
                {e.category}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <PaletteFooter />
    </CommandDialog>
  )
}

function GroupLabel({
  icon: Icon,
  text,
  suffix,
}: {
  icon: typeof Palette
  text: string
  suffix?: string
}) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
      <Icon className="size-3" />
      {text}
      {suffix && (
        <span className="ml-1 font-normal normal-case tracking-normal text-zinc-600">· {suffix}</span>
      )}
    </span>
  )
}

function PaletteFooter() {
  return (
    <div className="flex items-center justify-between border-t border-zinc-800/80 px-3 py-2 text-[11px] text-zinc-600">
      <span className="flex items-center gap-1.5">
        <Search className="size-3" />
        输入即搜全部素材
      </span>
      <span className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 font-mono">↑↓</kbd> 选择
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 font-mono">↵</kbd> 执行
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 font-mono">esc</kbd> 关闭
        </span>
      </span>
    </div>
  )
}
