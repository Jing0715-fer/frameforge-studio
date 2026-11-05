// HTML 分镜稿解析器（纯字符串处理，浏览器/Node 通用）
// 两级策略：
//  1. embedded-json：手册类 HTML（内嵌 const BOARD = [...] 等 JS 数据）——逐字段的精准解析
//  2. generic-html：任意 HTML —— 提取 <title> 与带时间码的文本行作为镜头
// 同时提供 LRC/TXT 歌词规范化

export interface BoardShot {
  tc: string // 原始时间码，如 0:00.6
  t: number // 秒
  visual: string // 画面
  direction: string // 调度/备注
  sound: string // 声音设计
}

export interface BoardUnit {
  name: string
  range: string // 原始区间文本
  start: number
  end: number
  dur: number
  bars: string // 小节数描述
  lyric: string // 本单元起点歌词
  shots: BoardShot[]
}

export interface ParsedStoryboard {
  source: 'embedded-json' | 'generic-html'
  title: string
  subline: string
  units: BoardUnit[]
  frameIds: string[] // 连续帧素材 id
  stillIds: string[] // 静帧素材 id
  totalShots: number
}

/** 从 HTML 中提取顶层 const NAME = [...] / {...} 的原始文本（字符串感知的平衡括号扫描） */
export function extractConstBlock(src: string, name: string): string | null {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*`)
  const m = re.exec(src)
  if (!m) return null
  let i = m.index + m[0].length
  while (i < src.length && /\s/.test(src[i])) i++
  const openCh = src[i]
  if (openCh !== '[' && openCh !== '{') return null
  const closeCh = openCh === '[' ? ']' : '}'
  let depth = 0
  let inStr: string | null = null
  let j = i
  while (j < src.length) {
    const c = src[j]
    if (inStr) {
      if (c === '\\') {
        j += 2
        continue
      }
      if (c === inStr) inStr = null
    } else {
      if (c === '"' || c === "'") inStr = c
      else if (c === openCh) depth++
      else if (c === closeCh) {
        depth--
        if (depth === 0) return src.slice(i, j + 1)
      }
    }
    j++
  }
  return null
}

/** 时间码 → 秒：支持 m:ss.d / mm:ss / h:mm:ss.d / 12.5（纯秒） */
export function parseTimecode(tc: string): number | null {
  const s = tc.trim()
  let m = /^(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?$/.exec(s)
  if (m) {
    const sec = parseInt(m[2], 10) + (m[3] ? parseFloat(`0.${m[3]}`) : 0)
    return parseInt(m[1], 10) * 60 + sec
  }
  m = /^(\d{1,2}):(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?$/.exec(s)
  if (m) {
    return parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseInt(m[3], 10) + (m[4] ? parseFloat(`0.${m[4]}`) : 0)
  }
  m = /^(\d{1,4}(?:\.\d{1,2})?)$/.exec(s)
  if (m) return parseFloat(s)
  return null
}

/** 区间文本 → {start,end}：如 "0:00.0 – 0:18.6（一镜到底）" */
export function parseRange(range: string): { start: number; end: number } | null {
  const parts = range.split(/[–—]|(?<!\d)-(?!\d)/)
  const times: number[] = []
  for (const p of parts) {
    const m = /(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\.\d{1,3})?)/.exec(p)
    if (m) {
      const t = parseTimecode(m[1])
      if (t !== null) times.push(t)
    }
  }
  if (times.length >= 2) return { start: times[0], end: times[1] }
  return null
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/** 主入口：解析上传的 HTML 分镜稿 */
export function parseStoryboardHtml(html: string): ParsedStoryboard {
  const title = extractTitle(html)

  // ---- 策略 1：内嵌 BOARD 数据 ----
  const boardRaw = extractConstBlock(html, 'BOARD')
  if (boardRaw) {
    try {
      const board = JSON.parse(boardRaw) as Array<Record<string, unknown>>
      const units: BoardUnit[] = []
      for (const u of board) {
        const name = String(u.u ?? u.name ?? '').trim()
        const range = String(u.r ?? u.range ?? '').trim()
        const rng = parseRange(range) ?? { start: units.length ? units[units.length - 1].end : 0, end: 0 }
        const rows = Array.isArray(u.rows) ? u.rows : []
        const shots: BoardShot[] = []
        for (const row of rows) {
          if (!Array.isArray(row) || row.length < 2) continue
          const tc = String(row[0] ?? '').trim()
          const t = parseTimecode(tc) ?? (shots.length ? shots[shots.length - 1].t : rng.start)
          shots.push({
            tc,
            t: Math.round(t * 10) / 10,
            visual: String(row[1] ?? '').trim(),
            direction: String(row[2] ?? '').trim(),
            sound: String(row[3] ?? '').trim(),
          })
        }
        const start = shots.length && rng.start === 0 && units.length === 0 ? shots[0].t : rng.start
        units.push({
          name,
          range,
          start: Math.round(start * 10) / 10,
          end: Math.round(rng.end * 10) / 10,
          dur: Math.round((rng.end - start) * 10) / 10,
          bars: String(u.bars ?? '').trim(),
          lyric: String(u.lyric ?? '').trim(),
          shots,
        })
      }
      if (units.length > 0 && units.some((u) => u.shots.length > 0)) {
        const frameIds = extractIdList(html, 'FRAME')
        const stillIds = extractIdList(html, 'STILL')
        return {
          source: 'embedded-json',
          title: title || '未命名分镜手册',
          subline: extractSubline(html),
          units,
          frameIds,
          stillIds,
          totalShots: units.reduce((s, u) => s + u.shots.length, 0),
        }
      }
    } catch {
      // 落到通用策略
    }
  }

  // ---- 策略 2：通用 HTML 文本提取 ----
  return parseGenericHtml(html, title)
}

/** 提取 FRAME/STILL 的 id 列表（不载入完整数据，避免超大载荷） */
function extractIdList(html: string, name: string): string[] {
  const raw = extractConstBlock(html, name)
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as Array<Record<string, unknown>>
    return arr.map((x) => String(x.id ?? '')).filter(Boolean)
  } catch {
    return []
  }
}

function extractTitle(html: string): string {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)
  return m ? decodeEntities(m[1]).trim() : ''
}

function extractSubline(html: string): string {
  const metaRaw = extractConstBlock(html, 'META')
  if (metaRaw) {
    try {
      const meta = JSON.parse(metaRaw) as Record<string, unknown>
      if (typeof meta.subline === 'string') return meta.subline.replace(/<[^>]+>/g, '').trim()
    } catch {
      /* ignore */
    }
  }
  return ''
}

/** 通用 HTML：抽掉样式与脚本后，按「时间码开头」的行聚合成镜头 */
function parseGenericHtml(html: string, title: string): ParsedStoryboard {
  let text = html.replace(/<style[\s\S]*?<\/style>/gi, ' ')
  text = text.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  text = text.replace(/data:image\/[a-z+;=\/\w]{50,}/gi, '') // 去掉内嵌大图
  text = text.replace(/<(h[1-6]|div|p|li|tr|section|article|table|br)[^>]*>/gi, '\n')
  text = text.replace(/<[^>]+>/g, ' ')
  text = decodeEntities(text)
  const lines = text
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const shots: BoardShot[] = []
  for (const line of lines) {
    const m = /^(\d{1,2}:\d{2}(?::\d{2})?(?:\.\d{1,2})?)\s*(?:[|·:：\-–—]\s*)?(.+)$/.exec(line)
    if (!m) continue
    const t = parseTimecode(m[1])
    if (t === null) continue
    shots.push({ tc: m[1], t: Math.round(t * 10) / 10, visual: m[2].slice(0, 300), direction: '', sound: '' })
  }

  const units: BoardUnit[] = shots.length
    ? [
        {
          name: '解析出的镜头',
          range: `${shots[0].tc} – ${shots[shots.length - 1].tc}`,
          start: shots[0].t,
          end: shots[shots.length - 1].t,
          dur: Math.round((shots[shots.length - 1].t - shots[0].t) * 10) / 10,
          bars: '',
          lyric: '',
          shots,
        },
      ]
    : []

  return {
    source: 'generic-html',
    title: title || '未命名分镜稿',
    subline: '',
    units,
    frameIds: [],
    stillIds: [],
    totalShots: shots.length,
  }
}

/** 歌词规范化：LRC 时间标签 → 「m:ss 歌词」行；纯文本原样保留 */
export function normalizeLyrics(raw: string): string {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const out: string[] = []
  for (const line of lines) {
    // [00:12.34] 歌词（可能有多个时间标签）
    const tags = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:]\d{1,3})?\]/g)]
    if (tags.length > 0) {
      const text = line.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim()
      if (!text) continue // 纯元数据行（[ti:] 等）
      for (const tag of tags) {
        out.push(`${tag[1]}:${tag[2]} ${text}`)
      }
    } else if (!/^\[[a-z]+:/i.test(line)) {
      out.push(line)
    }
  }
  return out.join('\n').slice(0, 8000)
}
