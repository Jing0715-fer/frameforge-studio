'use client'

// 音画对齐工坊：歌曲音波 × HTML 分镜稿 → AI 对齐优化
// 流程：上传（歌曲/歌词/分镜稿 HTML）→ 客户端音波结构分析（BPM/段落/静音缺口）
//      → 与分镜单元的可视化对齐诊断 → AI 按音波结构重排时间码/镜头密度/声音设计 → 导出
// 全程在浏览器内解码分析（音频不上传服务器），仅把结构化 JSON 交给 AI

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  AudioWaveform,
  Check,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Copy,
  Download,
  FileText,
  Gauge,
  History,
  Loader2,
  Music,
  Pause,
  Play,
  Scissors,
  Sparkles,
  Trash2,
  VolumeX,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  analyzeAudio,
  formatTc,
  type AudioAnalysis,
  type AudioSection,
  type Intensity,
} from '@/lib/sync/audio-analysis'
import {
  parseRange,
  parseTimecode,
  parseStoryboardHtml,
  normalizeLyrics,
  type BoardUnit,
  type ParsedStoryboard,
} from '@/lib/sync/storyboard-parser'
import { DEMO_BOARD, DEMO_LYRICS, DEMO_STILL_IDS, DEMO_FRAME_IDS, DEMO_SUBLINE, DEMO_TITLE } from '@/lib/sync/demo-data'
import { audioBufferToWavUrl, synthesizeDemoSong } from '@/lib/sync/demo-song'
import type { SyncProjectListItem, SyncResult, SyncShotResult, SyncUnitResult } from '@/lib/types'
import { cn } from '@/lib/utils'

// ============ 小工具 ============

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const INTENSITY_STYLE: Record<Intensity, { bar: string; chip: string; label: string }> = {
  quiet: { bar: 'bg-zinc-600', chip: 'bg-zinc-800/80 text-zinc-400 border-zinc-700', label: '安静' },
  medium: { bar: 'bg-amber-900/80', chip: 'bg-amber-950/60 text-amber-300/90 border-amber-800/50', label: '铺陈' },
  loud: { bar: 'bg-amber-500/80', chip: 'bg-amber-500/15 text-amber-300 border-amber-500/40', label: '强' },
  climax: { bar: 'bg-orange-500', chip: 'bg-orange-500/20 text-orange-300 border-orange-500/50', label: '爆发' },
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
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

// ============ 状态类型 ============

interface AudioState {
  name: string
  url: string | null
  analysis: AudioAnalysis | null
  loading: boolean
  error: string | null
}

interface BoardState {
  name: string
  parsed: ParsedStoryboard | null
  loading: boolean
  error: string | null
}

// 模块级工作台缓存：切换 tab 不丢状态（组件卸载后仍在；刷新页面自然清空）
// 音频 blob URL 挂在 document 上，重新挂载后 <audio> 仍可用同一 URL 播放
interface SyncCache {
  audio: AudioState
  lyrics: { name: string; text: string } | null
  board: BoardState
  result: SyncResult | null
  resultProjectId: number | null
}
let wsCache: SyncCache | null = null

// ============ 主组件 ============

export function AudioSync() {
  const [audio, setAudio] = useState<AudioState>(
    wsCache?.audio ?? { name: '', url: null, analysis: null, loading: false, error: null }
  )
  const [lyrics, setLyrics] = useState<{ name: string; text: string } | null>(wsCache?.lyrics ?? null)
  const [board, setBoard] = useState<BoardState>(
    wsCache?.board ?? { name: '', parsed: null, loading: false, error: null }
  )
  const [extra, setExtra] = useState('')
  const [optimizing, setOptimizing] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(wsCache?.result ?? null)
  const [resultProjectId, setResultProjectId] = useState<number | null>(wsCache?.resultProjectId ?? null)
  const [history, setHistory] = useState<SyncProjectListItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/sync/projects')
      const data = await res.json()
      setHistory(Array.isArray(data.projects) ? data.projects : [])
    } catch {
      /* 历史加载失败不阻塞主流程 */
    } finally {
      setLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // 工作台状态同步到模块缓存（切 tab 后回来可恢复）
  useEffect(() => {
    wsCache = { audio, lyrics, board, result, resultProjectId }
  })

  const setAudioUrl = (url: string | null) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = url
  }

  // ---------- 上传处理 ----------

  const onAudioFile = useCallback(async (file: File) => {
    if (file.size > 40 * 1024 * 1024) {
      toast.error('音频文件过大（上限 40MB）')
      return
    }
    setAudio({ name: file.name, url: null, analysis: null, loading: true, error: null })
    setResult(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
      const channels: Float32Array[] = []
      for (let c = 0; c < buffer.numberOfChannels; c++) channels.push(buffer.getChannelData(c))
      const analysis = analyzeAudio(channels, buffer.sampleRate, buffer.duration)
      ctx.close().catch(() => {})
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      setAudio({ name: file.name, url, analysis, loading: false, error: null })
      toast.success(`音频分析完成：${analysis.bpm ? `约 ${analysis.bpm} BPM · ` : ''}${analysis.sections.length} 个段落`)
    } catch {
      setAudio({ name: file.name, url: null, analysis: null, loading: false, error: '无法解码该音频（试试 mp3 / wav / m4a）' })
      toast.error('音频解码失败，请换一个格式')
    }
  }, [])

  const onLyricsFile = useCallback(async (file: File) => {
    const text = await file.text()
    const normalized = normalizeLyrics(text)
    if (!normalized.trim()) {
      toast.error('歌词文件为空')
      return
    }
    setLyrics({ name: file.name, text: normalized })
    toast.success(`歌词已载入（${normalized.split('\n').length} 行）`)
  }, [])

  const onBoardFile = useCallback(async (file: File) => {
    setBoard({ name: file.name, parsed: null, loading: true, error: null })
    setResult(null)
    try {
      const html = await file.text()
      const parsed = parseStoryboardHtml(html)
      if (parsed.units.length === 0 || parsed.totalShots === 0) {
        setBoard({ name: file.name, parsed: null, loading: false, error: '没有解析出带时间码的镜头（支持内嵌 BOARD 数据或含「m:ss」时间行的 HTML）' })
        toast.error('分镜稿里没有找到镜头数据')
        return
      }
      setBoard({ name: file.name, parsed, loading: false, error: null })
      toast.success(`分镜稿解析成功：${parsed.units.length} 单元 · ${parsed.totalShots} 镜${parsed.source === 'embedded-json' ? ' · 手册级数据' : ' · 通用文本'}`)
    } catch {
      setBoard({ name: file.name, parsed: null, loading: false, error: 'HTML 文件读取失败' })
    }
  }, [])

  // ---------- 演示数据 ----------

  const loadDemo = useCallback(async () => {
    setAudio({ name: '羊文学《声》· 结构演示曲（程序合成）', url: null, analysis: null, loading: true, error: null })
    setResult(null)
    try {
      // 纯 JS 数值合成（同步、确定性，几百毫秒）
      const buffer = synthesizeDemoSong()
      const channels: Float32Array[] = [buffer.getChannelData(0)]
      const analysis = analyzeAudio(channels, buffer.sampleRate, buffer.length / buffer.sampleRate)
      const url = audioBufferToWavUrl(buffer)
      setAudioUrl(url)
      setAudio({ name: '羊文学《声》· 结构演示曲（程序合成）', url, analysis, loading: false, error: null })

      // 真实分镜数据（从手册 v3 提取）
      const units: BoardUnit[] = DEMO_BOARD.map((u) => {
        const rng = parseRange(u.r) ?? { start: 0, end: 0 }
        return {
          name: u.u,
          range: u.r,
          start: rng.start,
          end: rng.end,
          dur: Math.round((rng.end - rng.start) * 10) / 10,
          bars: u.bars ?? '',
          lyric: u.lyric ?? '',
          shots: u.rows
            .filter((r) => r && r.length >= 2)
            .map((r) => {
              const tc = r[0] ?? ''
              return {
                tc,
                t: parseTimecode(tc) ?? 0,
                visual: r[1] ?? '',
                direction: r[2] ?? '',
                sound: r[3] ?? '',
              }
            }),
        }
      })
      setBoard({
        name: '《声》×millsage MAD 制作手册 v3（演示）',
        parsed: {
          source: 'embedded-json',
          title: DEMO_TITLE,
          subline: DEMO_SUBLINE.replace(/<[^>]+>/g, ''),
          units,
          frameIds: DEMO_FRAME_IDS,
          stillIds: DEMO_STILL_IDS,
          totalShots: units.reduce((s, x) => s + x.shots.length, 0),
        },
        loading: false,
        error: null,
      })
      setLyrics({ name: '《声》歌词（单元起点行 · 演示）', text: DEMO_LYRICS })
      toast.success('演示已载入：合成歌曲 + 真实分镜手册（10 单元 112 镜），可以直接「开始对齐优化」')
    } catch {
      setAudio({ name: '', url: null, analysis: null, loading: false, error: '演示歌曲合成失败（浏览器不支持离屏音频）' })
    }
  }, [])

  // ---------- AI 对齐优化 ----------

  const optimize = useCallback(async () => {
    if (!audio.analysis || !board.parsed) return
    setOptimizing(true)
    setResult(null)
    try {
      const res = await fetch('/api/sync/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songName: audio.name,
          analysis: {
            duration: audio.analysis.duration,
            bpm: audio.analysis.bpm,
            bpmConfidence: audio.analysis.bpmConfidence,
            sections: audio.analysis.sections,
            onsets: audio.analysis.onsets,
            silenceGaps: audio.analysis.silenceGaps,
            energyStats: audio.analysis.energyStats,
            envelope: audio.analysis.envelope,
          },
          lyrics: lyrics?.text ?? '',
          board: board.parsed,
          extra: extra.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '优化失败')
      setResult(data.result as SyncResult)
      setResultProjectId(data.projectId ?? null)
      loadHistory()
      toast.success('对齐优化完成，已存入历史')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '优化失败，请重试')
    } finally {
      setOptimizing(false)
    }
  }, [audio, board.parsed, lyrics, extra, loadHistory])

  // ---------- 历史 ----------

  const loadProject = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/sync/projects/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '载入失败')
      const p = data.project
      setAudio({ name: p.songName, url: null, analysis: p.analysis, loading: false, error: null })
      setAudioUrl(null)
      objectUrlRef.current = null
      setLyrics(p.lyrics ? { name: '历史歌词', text: p.lyrics } : null)
      setBoard({ name: `${p.songName} · 分镜稿`, parsed: p.board, loading: false, error: null })
      setResult(p.result)
      setResultProjectId(p.id)
      toast.success(`已载入历史项目 #${p.id}`)
      window.scrollTo({ top: (document.getElementById('sync-workspace')?.getBoundingClientRect().top ?? 0) + window.scrollY - 90, behavior: 'smooth' })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '载入失败')
    }
  }, [])

  const deleteProject = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`/api/sync/projects/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('删除失败')
        setHistory((h) => h.filter((x) => x.id !== id))
        if (resultProjectId === id) setResultProjectId(null)
        setConfirmDelete(null)
        toast.success('已删除')
      } catch {
        toast.error('删除失败')
      }
    },
    [resultProjectId]
  )

  const canOptimize = !!audio.analysis && !!board.parsed && !optimizing

  return (
    <div id="sync-workspace" className="space-y-8">
      {/* ===== 标题区 ===== */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
            <AudioWaveform className="size-5 text-zinc-950" />
          </span>
          <h2 className="text-xl font-bold tracking-tight text-zinc-50">音画对齐工坊</h2>
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
            歌曲音波 × 分镜稿
          </span>
        </div>
        <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-zinc-400">
          上传<b className="text-zinc-200">歌曲</b>与<b className="text-zinc-200">HTML 初版分镜稿</b>（歌词可选）。
          浏览器本地解析音波结构（BPM / 段落 / 能量 / 静音缺口），AI 据此重排时间码、镜头密度与声音设计，
          让每一刀都踩在音波上。音频全程不上传服务器。
        </p>
      </div>

      {/* ===== 上传区 ===== */}
      <div className="grid gap-4 md:grid-cols-3">
        <UploadCard
          icon={<Music className="size-5" />}
          title="歌曲音频"
          hint="mp3 / wav / m4a / flac · ≤40MB"
          accept="audio/*"
          loading={audio.loading}
          fileName={audio.name}
          status={
            audio.analysis
              ? `${fmt(audio.analysis.duration)} · ${audio.analysis.bpm ? `${audio.analysis.bpm} BPM` : 'BPM 未知'} · ${audio.analysis.sections.length} 段`
              : undefined
          }
          error={audio.error ?? undefined}
          onFile={onAudioFile}
          accent="amber"
        />
        <UploadCard
          icon={<FileText className="size-5" />}
          title="歌词（可选）"
          hint="txt / lrc · 支持 LRC 时间标签"
          accept=".txt,.lrc,text/plain"
          fileName={lyrics?.name}
          status={lyrics ? `${lyrics.text.split('\n').length} 行` : undefined}
          onFile={(f) => onLyricsFile(f)}
          onClear={() => setLyrics(null)}
          accent="zinc"
        />
        <UploadCard
          icon={<Clapperboard className="size-5" />}
          title="HTML 分镜稿"
          hint="内嵌 BOARD 数据的手册或含时间码的 HTML"
          accept=".html,.htm,text/html"
          loading={board.loading}
          fileName={board.name}
          status={
            board.parsed
              ? `${board.parsed.units.length} 单元 · ${board.parsed.totalShots} 镜${board.parsed.source === 'embedded-json' ? ' · 手册级' : ' · 通用'}`
              : undefined
          }
          error={board.error ?? undefined}
          onFile={onBoardFile}
          accent="amber"
        />
      </div>

      {/* 一键演示 */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 px-4 py-3">
        <Sparkles className="size-4 shrink-0 text-amber-400" />
        <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-zinc-400">
          没有素材在手边？一键载入<b className="text-zinc-200">《声》×millsage 演示</b>：
          程序合成的结构化歌曲（103 BPM · 10 段 · 埋入 2:56.5 静音缺口）+ 手册 v3 真实分镜（10 单元 112 镜）。
        </p>
        <button
          onClick={loadDemo}
          disabled={audio.loading || board.loading}
          className="shrink-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-2 text-[13px] font-semibold text-zinc-950 shadow-md shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400 disabled:opacity-50"
        >
          {audio.loading || board.loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="size-3.5 animate-spin" />
              合成中…
            </span>
          ) : (
            '载入演示数据'
          )}
        </button>
      </div>

      {/* ===== 音乐结构分析 ===== */}
      {audio.analysis && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Gauge className="size-4 text-amber-400" />
              音乐结构分析
              <span className="text-[11px] font-normal text-zinc-500">本地解码 · 音频未上传</span>
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <Badge>{fmt(audio.analysis.duration)}</Badge>
              <Badge accent>
                <Gauge className="size-3" />
                {audio.analysis.bpm ? `${audio.analysis.bpm} BPM` : 'BPM 未知'}
              </Badge>
              <Badge>{audio.analysis.sections.length} 段落</Badge>
              {audio.analysis.silenceGaps.length > 0 && (
                <Badge>
                  <VolumeX className="size-3 text-rose-400" />
                  {audio.analysis.silenceGaps.length} 静音缺口
                </Badge>
              )}
            </div>
          </div>

          <WaveformView analysis={audio.analysis} units={board.parsed?.units} audioRef={audioRef} url={audio.url} />

          {/* 段落图例 */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {audio.analysis.sections.map((s, i) => (
              <span
                key={i}
                className={cn('rounded-md border px-2 py-0.5 text-[11px] leading-5', INTENSITY_STYLE[s.intensity].chip)}
                title={`能量 ${s.energy} · 时长 ${(s.end - s.start).toFixed(1)}s`}
              >
                {s.label} {fmt(s.start)}–{fmt(s.end)}
              </span>
            ))}
          </div>
          {audio.analysis.silenceGaps.length > 0 && (
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
              静音缺口：
              {audio.analysis.silenceGaps.map((g) => ` ${formatTc(g.start)}–${formatTc(g.end)}`).join('、')}
              （前后明显更响的曲中留白——分镜上适合「比台词都响」的静默设计）
            </p>
          )}
        </section>
      )}

      {/* ===== 分镜稿解析 + 对齐诊断 ===== */}
      {board.parsed && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Clapperboard className="size-4 text-amber-400" />
              分镜稿 · {board.parsed.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              {board.parsed.source === 'embedded-json' && <Badge accent>手册级数据</Badge>}
              <Badge>{board.parsed.units.length} 单元</Badge>
              <Badge>{board.parsed.totalShots} 镜</Badge>
              {board.parsed.frameIds.length > 0 && <Badge>{board.parsed.frameIds.length} 套连续帧</Badge>}
              {board.parsed.stillIds.length > 0 && <Badge>{board.parsed.stillIds.length} 张静帧</Badge>}
            </div>
          </div>

          {audio.analysis ? (
            <AlignMap sections={audio.analysis.sections} units={board.parsed.units} duration={audio.analysis.duration} />
          ) : (
            <p className="rounded-lg border border-dashed border-zinc-700 px-3 py-2.5 text-[12px] text-zinc-500">
              上传歌曲后，这里会显示「音乐段落 × 分镜单元」的对齐诊断。
            </p>
          )}

          <BoardPreview board={board.parsed} />
        </section>
      )}

      {/* ===== AI 对齐优化 ===== */}
      {(audio.analysis || board.parsed) && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Wand2 className="size-4 text-amber-400" />
            AI 对齐优化
          </h3>
          {!canOptimize && !optimizing ? (
            <p className="rounded-lg border border-dashed border-zinc-700 px-3 py-2.5 text-[12px] text-zinc-500">
              {audio.analysis ? '还差 HTML 分镜稿' : '还差歌曲音频'}——两项都就绪后即可开始。
            </p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-[11px] text-zinc-500">附加要求（可选，如「尽量保留原画面描述」「副歌段加速剪辑」）</span>
                <input
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  maxLength={200}
                  placeholder="留空则按默认策略：保留画面创意，重点对齐时间码与声音设计"
                  className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none"
                />
              </label>
              <button
                onClick={optimize}
                disabled={!canOptimize}
                className="h-10 shrink-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-sm font-semibold text-zinc-950 shadow-md shadow-amber-500/25 transition hover:from-amber-400 hover:to-orange-400 disabled:opacity-50"
              >
                {optimizing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    AI 对齐中…（约 1–2 分钟）
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-4" />
                    开始对齐优化
                  </span>
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ===== 优化结果 ===== */}
      {result && (
        <ResultView
          result={result}
          board={board.parsed}
          songName={audio.name}
          analysis={audio.analysis}
          projectId={resultProjectId}
        />
      )}

      {/* ===== 历史 ===== */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <History className="size-4 text-amber-400" />
            对齐历史
          </h3>
          <button onClick={loadHistory} className="text-[11px] text-zinc-500 transition hover:text-zinc-300">
            刷新
          </button>
        </div>
        {loadingHistory ? (
          <div className="flex items-center gap-2 py-3 text-[12px] text-zinc-500">
            <Loader2 className="size-3.5 animate-spin" />
            加载中…
          </div>
        ) : history.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-700 px-3 py-2.5 text-[12px] text-zinc-500">
            还没有历史项目。完成第一次对齐优化后会自动存档（含音波分析与优化结果，可随时载入回看）。
          </p>
        ) : (
          <ul className="max-h-72 space-y-1.5 overflow-y-auto scrollbar-thin pr-1">
            {history.map((h) => (
              <li
                key={h.id}
                className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 transition hover:border-zinc-700"
              >
                <button onClick={() => loadProject(h.id)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-[13px] font-medium text-zinc-200 group-hover:text-amber-300">{h.songName}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {fmt(h.duration)} · {h.bpm ? `${h.bpm} BPM` : 'BPM 未知'} · {h.unitCount} 单元 / {h.shotCount} 镜 ·{' '}
                    {new Date(h.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
                {confirmDelete === h.id ? (
                  <span className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => deleteProject(h.id)}
                      className="rounded-md bg-rose-500/90 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-rose-500"
                    >
                      确认删除
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="rounded-md px-1.5 py-1 text-[11px] text-zinc-500 hover:text-zinc-300">
                      取消
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(h.id)}
                    aria-label="删除项目"
                    className="shrink-0 rounded-md p-1.5 text-zinc-600 opacity-0 transition group-hover:opacity-100 hover:bg-zinc-800 hover:text-rose-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

// ============ 上传卡片 ============

function UploadCard({
  icon,
  title,
  hint,
  accept,
  onFile,
  onClear,
  loading = false,
  fileName,
  status,
  error,
  accent,
}: {
  icon: React.ReactNode
  title: string
  hint: string
  accept: string
  onFile: (f: File) => void
  onClear?: () => void
  loading?: boolean
  fileName?: string
  status?: string
  error?: string
  accent: 'amber' | 'zinc'
}) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f)
      }}
      className={cn(
        'relative flex min-h-[132px] flex-col justify-between rounded-xl border bg-zinc-900/40 p-4 transition',
        dragOver ? 'border-amber-500/70 bg-amber-500/5' : 'border-zinc-800 hover:border-zinc-700',
        error && 'border-rose-500/50'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg',
            accent === 'amber' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-800 text-zinc-400'
          )}
        >
          {icon}
        </div>
        {fileName && onClear && (
          <button
            onClick={onClear}
            className="rounded p-1 text-[11px] text-zinc-600 transition hover:text-zinc-300"
            aria-label="清除"
          >
            ✕
          </button>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-zinc-200">{title}</p>
        {loading ? (
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-300">
            <Loader2 className="size-3 animate-spin" />
            解析中…
          </p>
        ) : fileName ? (
          <div className="mt-1">
            <p className="truncate text-[11px] text-zinc-400" title={fileName}>
              {fileName}
            </p>
            {status && (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <Check className="size-3" />
                {status}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{hint}</p>
        )}
        {error && (
          <p className="mt-1 flex items-start gap-1 text-[11px] leading-relaxed text-rose-400">
            <AlertTriangle className="mt-0.5 size-3 shrink-0" />
            {error}
          </p>
        )}
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="mt-3 h-8 w-full rounded-lg border border-zinc-700 bg-zinc-950/50 text-[12px] text-zinc-300 transition hover:border-amber-500/50 hover:text-amber-300"
      >
        {fileName ? '重新选择' : '选择文件 / 拖放'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}

// ============ 徽章 ============

function Badge({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium',
        accent ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' : 'border-zinc-700 bg-zinc-800/60 text-zinc-300'
      )}
    >
      {children}
    </span>
  )
}

// ============ 波形可视化 ============

function WaveformView({
  analysis,
  units,
  audioRef,
  url,
}: {
  analysis: AudioAnalysis
  units?: BoardUnit[]
  audioRef: React.RefObject<HTMLAudioElement | null>
  url: string | null
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const rafRef = useRef<number>(0)

  const duration = analysis.duration

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = wrap.clientWidth
    const h = 168
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    const topPad = 22 // 段落标签区
    const waveTop = topPad + 4
    const waveH = h - waveTop - 26 // 底部单元刻度区
    const waveBottom = waveTop + waveH
    const xOf = (t: number) => (t / duration) * w

    // 背景区块（段落能量底色）
    for (const s of analysis.sections) {
      ctx.fillStyle =
        s.intensity === 'climax'
          ? 'rgba(249,115,22,0.13)'
          : s.intensity === 'loud'
            ? 'rgba(245,158,11,0.10)'
            : s.intensity === 'medium'
              ? 'rgba(245,158,11,0.05)'
              : 'rgba(113,113,122,0.07)'
      ctx.fillRect(xOf(s.start), waveTop, Math.max(1, xOf(s.end) - xOf(s.start)), waveH)
    }

    // 波形条
    const n = analysis.envelope.length
    const barW = Math.max(1, w / n)
    for (let i = 0; i < n; i++) {
      const t = (i / n) * duration
      const sec = analysis.sections.find((s) => t >= s.start && t < s.end)
      const v = analysis.envelope[i]
      const barH = Math.max(1.5, Math.pow(v, 0.72) * waveH) // 感知拉伸
      ctx.fillStyle = sec
        ? sec.intensity === 'climax'
          ? 'rgba(249,115,22,0.95)'
          : sec.intensity === 'loud'
            ? 'rgba(245,158,11,0.88)'
            : sec.intensity === 'medium'
              ? 'rgba(217,160,73,0.7)'
              : 'rgba(161,161,170,0.62)'
        : 'rgba(161,161,170,0.62)'
      ctx.fillRect(i * barW, waveBottom - barH, Math.max(1, barW - 0.5), barH)
    }

    // 静音缺口
    for (const g of analysis.silenceGaps) {
      ctx.fillStyle = 'rgba(244,63,94,0.16)'
      ctx.fillRect(xOf(g.start), waveTop, Math.max(2, xOf(g.end) - xOf(g.start)), waveH)
      ctx.strokeStyle = 'rgba(244,63,94,0.65)'
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(xOf(g.start), waveTop)
      ctx.lineTo(xOf(g.start), waveBottom)
      ctx.moveTo(xOf(g.end), waveTop)
      ctx.lineTo(xOf(g.end), waveBottom)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 段落边界 + 标签（交错高低避免重叠）
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    analysis.sections.forEach((s, i) => {
      const x = xOf(s.start)
      if (i > 0) {
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'
        ctx.beginPath()
        ctx.moveTo(x, topPad)
        ctx.lineTo(x, waveBottom)
        ctx.stroke()
      }
      const short = s.label.split(' · ')[0]
      const label = `${short}`
      const y = i % 2 === 0 ? 10 : 20
      ctx.fillStyle = 'rgba(228,228,231,0.85)'
      const tx = Math.min(Math.max(2, x + 3), w - 30)
      ctx.fillText(label, tx, y)
    })

    // 分镜单元边界（底部刻度区）
    if (units && units.length > 0) {
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
      units.forEach((u, i) => {
        const x = xOf(u.start)
        ctx.strokeStyle = 'rgba(251,191,36,0.55)'
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.moveTo(x, waveTop)
        ctx.lineTo(x, waveBottom + 24)
        ctx.stroke()
        ctx.setLineDash([])
        const num = `U${i + 1}`
        ctx.fillStyle = 'rgba(251,191,36,0.9)'
        const tx = Math.min(Math.max(2, x + 2), w - 16)
        ctx.fillText(num, tx, h - 4)
      })
    }

    // 时间刻度（每 30s）
    ctx.fillStyle = 'rgba(113,113,122,0.8)'
    ctx.font = '9px ui-monospace, monospace'
    for (let t = 0; t <= duration; t += 30) {
      const x = xOf(t)
      ctx.fillRect(x, waveBottom + 2, 1, 4)
      if (t > 0 && x < w - 24) ctx.fillText(fmt(t), x + 2, waveBottom + 12)
    }

    // 播放头
    const px = xOf(time)
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(px, topPad)
    ctx.lineTo(px, waveBottom + 6)
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    ctx.arc(px, topPad - 4, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }, [analysis, units, duration, time])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => draw())
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [draw])

  // 播放时 rAF 刷新播放头
  useEffect(() => {
    if (!playing) return
    const loop = () => {
      const el = audioRef.current
      if (el) setTime(el.currentTime)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, audioRef])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play()
      setPlaying(true)
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    if (el && Number.isFinite(ratio)) {
      el.currentTime = Math.max(0, Math.min(duration, ratio * duration))
      setTime(el.currentTime)
      draw()
    }
  }

  return (
    <div>
      <div ref={wrapRef} className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70" onClick={seek} role="slider" aria-label="音频时间轴（点击跳转播放位置）" aria-valuenow={Math.round(time)} aria-valuemin={0} aria-valuemax={Math.round(duration)} tabIndex={0}>
        <canvas ref={canvasRef} className="block cursor-crosshair" />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={toggle}
          disabled={!url}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25 transition hover:bg-amber-400 disabled:opacity-40"
          aria-label={playing ? '暂停' : '播放'}
        >
          {playing ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
        </button>
        <span className="font-mono text-[12px] tabular-nums text-zinc-400">
          {fmt(time)} / {fmt(duration)}
        </span>
        <span className="text-[11px] text-zinc-600">点击波形跳转 · U1–U{units?.length ?? '-'} 为分镜单元边界</span>
      </div>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          className="hidden"
        />
      )}
    </div>
  )
}

// ============ 对齐诊断图（音乐段落 × 分镜单元） ============

function AlignMap({
  sections,
  units,
  duration,
}: {
  sections: AudioSection[]
  units: BoardUnit[]
  duration: number
}) {
  const total = Math.max(duration, units[units.length - 1]?.end ?? 0, sections[sections.length - 1]?.end ?? 0) || 1
  const pct = (v: number) => `${(v / total) * 100}%`

  // 每个单元边界与最近段落边界的偏移
  const sectionBounds = useMemo(() => {
    const set = new Set<number>()
    sections.forEach((s) => {
      set.add(Math.round(s.start * 10) / 10)
      set.add(Math.round(s.end * 10) / 10)
    })
    return [...set]
  }, [sections])

  const boundaries = useMemo(() => {
    const drift = (t: number) => {
      let best = Infinity
      for (const b of sectionBounds) best = Math.min(best, Math.abs(b - t))
      return best
    }
    const list: { t: number; d: number }[] = []
    for (let i = 1; i < units.length; i++) {
      const t = units[i].start
      list.push({ t, d: drift(t) })
    }
    return list
  }, [units, sectionBounds])

  const worst = boundaries.reduce((m, b) => Math.max(m, b.d), 0)
  const good = boundaries.filter((b) => b.d <= 1.2).length

  return (
    <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-zinc-400">对齐诊断：音乐段落（上） × 分镜单元（下）</p>
        <p className="text-[11px] text-zinc-500">
          单元边界贴合度：
          <span className={cn('font-semibold', worst <= 2 ? 'text-emerald-400' : worst <= 4 ? 'text-amber-300' : 'text-rose-400')}>
            {good}/{boundaries.length || 0} 个 ±1.2s 内
          </span>
          {worst > 2 && <span className="ml-1.5">最偏 {worst.toFixed(1)}s</span>}
        </p>
      </div>
      {/* 音乐段落条 */}
      <div className="flex h-7 w-full overflow-hidden rounded-md">
        {sections.map((s, i) => (
          <div
            key={i}
            className={cn('flex min-w-0 items-center justify-center overflow-hidden border-r border-zinc-950/60 text-[9px] text-zinc-100/90 last:border-r-0', INTENSITY_STYLE[s.intensity].bar)}
            style={{ width: pct(s.end - s.start) }}
            title={`${s.label} ${fmt(s.start)}–${fmt(s.end)} · 能量 ${s.energy}`}
          >
            <span className="truncate px-1">{s.end - s.start > 14 ? s.label.split(' · ')[0] : ''}</span>
          </div>
        ))}
      </div>
      {/* 分镜单元条 */}
      <div className="flex h-7 w-full overflow-hidden rounded-md">
        {units.map((u, i) => (
          <div
            key={i}
            className="flex min-w-0 items-center justify-center overflow-hidden border-r border-zinc-950/60 bg-zinc-800 text-[9px] text-amber-200/90 last:border-r-0"
            style={{ width: pct(u.end - u.start) }}
            title={`${u.name} ${u.range}`}
          >
            <span className="truncate px-1">{u.end - u.start > 14 ? `U${i + 1}` : ''}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] leading-relaxed text-zinc-600">
        U1 {units[0]?.name} → U{units.length} {units[units.length - 1]?.name}；色块越亮音乐能量越强。
        {worst > 2 ? ' 有明显错位——AI 优化会把这些边界吸附到音乐段落上。' : ' 边界基本贴合，AI 将聚焦镜头密度与卡点微调。'}
      </p>
    </div>
  )
}

// ============ 分镜稿预览 ============

function BoardPreview({ board }: { board: ParsedStoryboard }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mt-3 space-y-1.5">
      {board.units.map((u, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition hover:bg-zinc-900/60"
            aria-expanded={open === i}
          >
            {open === i ? <ChevronDown className="size-3.5 shrink-0 text-zinc-500" /> : <ChevronRight className="size-3.5 shrink-0 text-zinc-500" />}
            <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-300">U{i + 1}</span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-zinc-200">{u.name}</span>
            <span className="hidden shrink-0 font-mono text-[10px] text-zinc-500 sm:inline">{u.range}</span>
            <span className="shrink-0 text-[10px] text-zinc-500">{u.shots.length} 镜</span>
          </button>
          {open === i && (
            <div className="border-t border-zinc-800/80">
              {u.lyric && <p className="border-b border-zinc-800/60 bg-zinc-900/30 px-3 py-1.5 text-[11px] text-zinc-500">起点歌词：{u.lyric}</p>}
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {u.shots.map((s, j) => (
                  <div key={j} className="grid grid-cols-[52px_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-zinc-800/50 px-3 py-2 last:border-b-0 sm:grid-cols-[52px_minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,0.9fr)]">
                    <span className="font-mono text-[11px] leading-5 text-amber-300/80">{s.tc}</span>
                    <span className="text-[12px] leading-relaxed text-zinc-300">{s.visual}</span>
                    <span className="col-span-2 text-[11px] leading-relaxed text-zinc-500 sm:col-span-1">{s.direction}</span>
                    <span className="col-span-2 flex items-start gap-1 text-[11px] leading-relaxed text-zinc-500 sm:col-span-1">
                      <VolumeX className="mt-0.5 size-3 shrink-0 text-zinc-600" />
                      {s.sound || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============ 优化结果 ============

function ResultView({
  result,
  board,
  songName,
  analysis,
  projectId,
}: {
  result: SyncResult
  board: ParsedStoryboard | null
  songName: string
  analysis: AudioAnalysis | null
  projectId: number | null
}) {
  const [open, setOpen] = useState<number | null>(0)
  const changedShots = result.units.reduce((s, u) => s + u.shots.filter((x) => x.changed).length, 0)
  const newShots = result.units.reduce((s, u) => s + u.shots.filter((x) => x.isNew).length, 0)
  const totalShots = result.units.reduce((s, u) => s + u.shots.length, 0)

  const downloadHtml = () => {
    const html = buildExportHtml(result, songName, analysis)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `音画对齐 · ${songName.slice(0, 40)} · 优化分镜.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-transparent p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <Sparkles className="size-4 text-amber-400" />
          对齐优化结果
          {projectId && <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">#{projectId}</span>}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge>{totalShots} 镜</Badge>
          <Badge accent>
            <Scissors className="size-3" />
            {changedShots} 处调整
          </Badge>
          {newShots > 0 && <Badge accent>+{newShots} 新镜</Badge>}
          <button
            onClick={async () => {
              const ok = await copyToClipboard(JSON.stringify(result, null, 2))
              if (ok) toast.success('结果 JSON 已复制')
              else toast.error('复制失败')
            }}
            className="inline-flex h-7 items-center gap-1 rounded-md border border-zinc-700 px-2 text-[11px] text-zinc-300 transition hover:border-amber-500/50 hover:text-amber-300"
          >
            <Copy className="size-3" />
            复制 JSON
          </button>
          <button
            onClick={downloadHtml}
            className="inline-flex h-7 items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 text-[11px] font-medium text-amber-300 transition hover:bg-amber-500/20"
          >
            <Download className="size-3" />
            下载优化分镜 HTML
          </button>
        </div>
      </div>

      {/* 总评 */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3.5">
          <p className="mb-1.5 text-[11px] font-semibold text-zinc-500">总评</p>
          <p className="text-[13px] leading-relaxed text-zinc-300">{result.overall}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3.5">
          <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
            <Gauge className="size-3" />
            卡点建议
          </p>
          <p className="text-[13px] leading-relaxed text-zinc-300">{result.bpmAdvice}</p>
        </div>
      </div>

      {result.retimingNotes.length > 0 && (
        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3.5">
          <p className="mb-2 text-[11px] font-semibold text-zinc-500">关键调整</p>
          <ul className="space-y-1.5">
            {result.retimingNotes.map((n, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-zinc-400">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-400" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 优化后单元 */}
      <div className="mt-4 space-y-1.5">
        {result.units.map((u, i) => {
          const orig = board?.units[i]
          return (
            <div key={i} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition hover:bg-zinc-900/60"
                aria-expanded={open === i}
              >
                {open === i ? <ChevronDown className="size-3.5 shrink-0 text-zinc-500" /> : <ChevronRight className="size-3.5 shrink-0 text-zinc-500" />}
                <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-300">U{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-zinc-200">{u.name}</span>
                <span className="hidden max-w-[180px] shrink-0 truncate rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline" title={u.matchedSection}>
                  {u.matchedSection}
                </span>
                <span className="hidden shrink-0 font-mono text-[10px] text-zinc-500 md:inline">{u.range}</span>
                <span className="shrink-0 text-[10px] text-amber-300/80">{u.shots.filter((s) => s.changed).length} 调整</span>
              </button>
              {open === i && (
                <div className="border-t border-zinc-800/80">
                  <div className="border-b border-zinc-800/60 bg-zinc-900/30 px-3 py-2">
                    {u.matchedSection && (
                      <p className="text-[11px] text-zinc-400">
                        对应音乐段落：<span className="font-medium text-amber-300">{u.matchedSection}</span>
                      </p>
                    )}
                    {u.cutAdvice && <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">剪辑建议：{u.cutAdvice}</p>}
                  </div>
                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {u.shots.map((s, j) => (
                      <ShotResultRow key={j} shot={s} origTc={orig?.shots[j]?.tc} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ShotResultRow({ shot, origTc }: { shot: SyncShotResult; origTc?: string }) {
  const tcChanged = origTc !== undefined && origTc !== shot.tc
  return (
    <div
      className={cn(
        'grid grid-cols-[52px_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-zinc-800/50 px-3 py-2 last:border-b-0',
        shot.isNew ? 'bg-emerald-500/[0.04]' : shot.changed ? 'bg-amber-500/[0.04]' : ''
      )}
    >
      <span className={cn('font-mono text-[11px] leading-5', shot.changed || shot.isNew ? 'font-semibold text-amber-300' : 'text-zinc-500')}>
        {shot.tc}
      </span>
      <div className="min-w-0">
        <p className="text-[12px] leading-relaxed text-zinc-300">
          {shot.isNew && (
            <span className="mr-1.5 rounded bg-emerald-500/15 px-1 py-0.5 align-middle text-[9px] font-semibold text-emerald-400">新增</span>
          )}
          {shot.visual}
        </p>
        {(shot.direction || shot.sound) && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
            {shot.direction && <span className="mr-2">{shot.direction}</span>}
            {shot.sound && (
              <span className="inline-flex items-center gap-1">
                <VolumeX className="size-3 shrink-0 text-zinc-600" />
                {shot.sound}
              </span>
            )}
          </p>
        )}
        {(tcChanged || shot.isNew) && origTc && (
          <p className="mt-1 font-mono text-[10px] text-zinc-600">
            原 {origTc} → <span className="text-amber-400">{shot.tc}</span>
          </p>
        )}
        {shot.reason && (
          <p className="mt-1 flex items-start gap-1 text-[11px] leading-relaxed text-amber-300/70">
            <Wand2 className="mt-0.5 size-3 shrink-0" />
            {shot.reason}
          </p>
        )}
      </div>
    </div>
  )
}

// ============ 导出 HTML ============

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildExportHtml(result: SyncResult, songName: string, analysis: AudioAnalysis | null): string {
  const sections = analysis
    ? analysis.sections
        .map(
          (s) =>
            `<span class="sec ${s.intensity}" title="能量 ${s.energy}">${esc(s.label)} ${fmt(s.start)}–${fmt(s.end)}</span>`
        )
        .join('')
    : ''
  const units = result.units
    .map(
      (u) => `
  <section class="unit">
    <header><b>${esc(u.name)}</b><span class="rng">${esc(u.range)}</span><span class="match">${esc(u.matchedSection)}</span></header>
    ${u.cutAdvice ? `<p class="advice">剪辑建议：${esc(u.cutAdvice)}</p>` : ''}
    <table>
      <thead><tr><th>时间码</th><th>画面</th><th>调度</th><th>声音</th><th>调整</th></tr></thead>
      <tbody>
        ${u.shots
          .map(
            (s) =>
              `<tr class="${s.isNew ? 'new' : s.changed ? 'chg' : ''}"><td class="tc">${esc(s.tc)}</td><td>${esc(s.visual)}${
                s.isNew ? '<i class="tag">新增</i>' : ''
              }</td><td class="dim">${esc(s.direction)}</td><td class="dim">${esc(s.sound)}</td><td class="why">${esc(s.reason ?? '')}</td></tr>`
          )
          .join('\n        ')}
      </tbody>
    </table>
  </section>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>音画对齐 · 优化分镜 · ${esc(songName)}</title>
<style>
:root{--primary:#F3A04C;--accent:#E58522;--bg:#F4F4F6;--card:#fff;--text:rgba(0,0,0,.82);--sub:rgba(0,0,0,.55);--line:rgba(0,0,0,.1)}
@media(prefers-color-scheme:dark){:root{--bg:#232324;--card:#2E2E2E;--text:rgba(255,255,255,.85);--sub:rgba(255,255,255,.55);--line:rgba(255,255,255,.12)}}
*{box-sizing:border-box}
body{margin:0;padding:20px;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}
.wrap{max-width:1280px;margin:0 auto}
h1{font-size:18px;margin:0 0 4px}
h1 em{font-style:normal;font-size:10px;font-weight:700;color:#fff;background:var(--accent);border-radius:5px;padding:2px 6px;vertical-align:2px;margin-left:6px}
.meta{font-size:12px;color:var(--sub);margin:0 0 14px;line-height:1.7}
.secbox{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:14px}
.secbox h3,.notes h3{margin:0 0 8px;font-size:12px;color:var(--accent)}
.sec{display:inline-block;font-size:10px;padding:3px 8px;border-radius:6px;border:1px solid var(--line);margin:2px;background:rgba(0,0,0,.04);color:var(--sub)}
.sec.loud,.sec.climax{background:rgba(229,133,34,.14);border-color:rgba(229,133,34,.35);color:var(--accent);font-weight:600}
.notes{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:14px;font-size:12.5px;line-height:1.8;color:var(--text)}
.notes ul{margin:6px 0 0;padding-left:18px}
.unit{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:14px}
.unit header{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}
.unit header b{font-size:14px}
.rng{font-family:ui-monospace,monospace;font-size:11px;color:var(--sub)}
.match{font-size:10px;color:var(--accent);background:rgba(229,133,34,.12);border-radius:5px;padding:2px 7px}
.advice{font-size:11.5px;color:var(--sub);margin:6px 0;line-height:1.7}
table{width:100%;border-collapse:collapse;font-size:11.5px}
th{text-align:left;font-size:10px;color:var(--sub);border-bottom:1px solid var(--line);padding:5px 7px}
td{border-bottom:1px solid var(--line);padding:7px;vertical-align:top;line-height:1.65}
td.tc{font-family:ui-monospace,monospace;white-space:nowrap;color:var(--accent)}
td.dim{color:var(--sub);width:24%}
td.why{color:var(--accent);font-size:10.5px;width:17%}
tr.chg td{background:rgba(229,133,34,.055)}
tr.new td{background:rgba(64,180,62,.07)}
.tag{font-style:normal;font-size:9px;font-weight:700;color:#2E7D32;background:rgba(64,180,62,.15);border-radius:4px;padding:1px 5px;margin-left:5px;vertical-align:1px}
@media(max-width:720px){td.dim,th:nth-child(3),th:nth-child(4),td:nth-child(3),td:nth-child(4){display:none}table,thead,tbody,tr,td,th{display:block}tr{border-bottom:6px solid var(--bg);padding:4px 0}th{display:none}td{border:0;padding:3px 7px}}
</style>
</head>
<body>
<div class="wrap">
<h1>音画对齐 · 优化分镜<em>AI 对齐</em></h1>
<p class="meta">歌曲：${esc(songName)}${analysis ? ` · ${analysis.bpm ? `${analysis.bpm} BPM · ` : ''}${fmt(analysis.duration)} · ${analysis.sections.length} 段落` : ''} · ${result.units.reduce((s, u) => s + u.shots.length, 0)} 镜 · 生成于 ${new Date().toLocaleString('zh-CN')}</p>
${sections ? `<div class="secbox"><h3>音乐结构</h3>${sections}</div>` : ''}
<div class="notes"><h3>总评</h3>${esc(result.overall)}${result.bpmAdvice ? `<h3 style="margin-top:10px">卡点建议</h3>${esc(result.bpmAdvice)}` : ''}${
    result.retimingNotes.length
      ? `<h3 style="margin-top:10px">关键调整</h3><ul>${result.retimingNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`
      : ''
  }</div>
${units}
</div>
</body>
</html>`
}

// 兼容引用：避免 SyncUnitResult/SyncShotResult 仅类型导入被 tree-shake 报未使用
export type { SyncUnitResult }
