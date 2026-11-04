'use client'

// 风格小样预览：为 369 种风格渲染专属 CSS 动画小样
// 颜色 c[0]=背景 c[1]=主色 c[2]=次色 c[3]=点缀
import { resolvePreview, type MotifKey } from '@/lib/style-preview-registry'
import type { StyleItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const A = (name: string, dur = '3s', ease = 'ease-in-out', delay = '0s', iter = 'infinite') =>
  `${name} ${dur} ${ease} ${delay} ${iter}`

interface SceneProps {
  c: string[]
  name: string
}

/* ============================ 文字 / 数字 ============================ */

function MatrixScene({ c, name }: SceneProps) {
  const cols = [8, 22, 36, 52, 68, 84]
  return (
    <>
      {cols.map((left, i) => (
        <div
          key={i}
          className="absolute top-0 flex flex-col gap-[0.4cqw] font-mono leading-none"
          style={{
            left: `${left}%`,
            color: c[1],
            opacity: 0.35 + (i % 3) * 0.25,
            fontSize: '4cqw',
            writingMode: 'vertical-rl',
            animation: A('ff-fall', `${2 + (i % 4)}s`, 'linear', `${i * 0.4}s`),
          }}
        >
          {name.split('').map((ch, j) => (
            <span key={j} style={{ opacity: 1 - j * 0.09 }}>
              {ch}
            </span>
          ))}
          {name.split('').map((ch, j) => (
            <span key={`b${j}`} style={{ opacity: 1 - j * 0.09 }}>
              {ch}
            </span>
          ))}
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 55%, ${c[0]}ee)` }} />
    </>
  )
}

function CursorTypeScene({ c, name }: SceneProps) {
  const txt = name.slice(0, 8)
  return (
    <div className="absolute inset-0 p-[6cqw]">
      <div className="flex items-center gap-[2cqw] font-mono" style={{ color: c[1], fontSize: '7cqw' }}>
        <span>{txt}</span>
        <span
          className="inline-block h-[7cqw] w-[3.5cqw]"
          style={{ background: c[2], animation: A('ff-caret-step', '0.9s', 'steps(1)', '0s') }}
        />
      </div>
      <div className="mt-[3cqw] space-y-[1.6cqw]">
        {[70, 88, 55].map((w, i) => (
          <div
            key={i}
            className="h-[2.2cqw] rounded-full"
            style={{
              width: `${w}%`,
              background: c[1],
              opacity: 0.28,
              animation: A('ff-grow-h', '0.6s', 'ease-out', `${0.5 + i * 0.35}s`, '1') + ', ' + A('ff-blink', '4s', 'steps(1)', `${1.5 + i}s`),
            }}
          />
        ))}
      </div>
      <div
        className="absolute bottom-[6cqw] left-[6cqw] font-mono"
        style={{ color: c[2], fontSize: '3.4cqw', opacity: 0.8, animation: A('ff-blink', '2s', 'steps(1)') }}
      >
        _ ready
      </div>
    </div>
  )
}

function BigTypeScene({ c, name }: SceneProps) {
  const t = name.slice(0, 5)
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <span
          className="absolute inset-0 font-black tracking-tight"
          style={{
            color: 'transparent',
            WebkitTextStroke: `0.6cqw ${c[3]}`,
            fontSize: '17cqw',
            transform: 'scale(1.18)',
            opacity: 0.5,
          }}
          aria-hidden
        >
          {t}
        </span>
        <span
          className="relative font-black tracking-tight"
          style={{ color: c[1], fontSize: '17cqw', animation: A('ff-appear', '2.4s', 'cubic-bezier(.2,1.4,.4,1)') }}
        >
          {t}
        </span>
      </div>
      <div
        className="absolute h-[26cqw] w-[26cqw] rounded-full border-2"
        style={{ borderColor: c[2], opacity: 0.35, animation: A('ff-breathe', '2.2s', 'ease-out', '0.6s') }}
      />
    </div>
  )
}

function TypeTunnelScene({ c, name }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '120px' }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center rounded-full border-2 font-black"
          style={{
            width: '34cqw',
            height: '34cqw',
            borderColor: i % 2 ? c[2] : c[1],
            color: i % 2 ? c[2] : c[1],
            fontSize: '5cqw',
            animation: A('ff-tunnel', '3.2s', 'linear', `${i * 0.8}s`),
          }}
        >
          {name.slice(0, 4)}
        </div>
      ))}
    </div>
  )
}

function ScatterScene({ c, name }: SceneProps) {
  const chars = name.slice(0, 6).split('')
  const dirs = [
    [-40, -26], [30, -34], [44, 18], [-34, 30], [26, 40], [-20, -44],
  ]
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[1cqw]">
      {chars.map((ch, i) => (
        <span
          key={i}
          className="font-black"
          style={
            {
              color: i % 3 === 2 ? c[2] : c[1],
              fontSize: '10cqw',
              ['--gx' as string]: `${dirs[i % 6][0]}cqw`,
              ['--gy' as string]: `${dirs[i % 6][1]}cqw`,
              animation: A('ff-gather', '2.6s', 'cubic-bezier(.2,1.3,.4,1)', `${i * 0.12}s`),
            } as React.CSSProperties
          }
        >
          {ch}
        </span>
      ))}
    </div>
  )
}

function KineticBlocksScene({ c, name }: SceneProps) {
  const rows = [
    { dir: 'normal', color: c[1], y: 26, h: 13 },
    { dir: 'reverse', color: c[3], y: 44, h: 13 },
    { dir: 'normal', color: c[2], y: 62, h: 13 },
  ]
  return (
    <>
      {rows.map((r, i) => (
        <div key={i} className="absolute left-0 flex w-[200%] gap-[2cqw]" style={{ top: `${r.y}%` }}>
          <div className="flex w-1/2 shrink-0 gap-[2cqw]" style={{ animation: A('ff-marquee', `${5 + i * 2}s`, 'linear', '0s'), animationDirection: r.dir }}>
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="flex h-[10cqw] shrink-0 items-center justify-center rounded-[1cqw] font-black"
                style={{
                  width: `${16 + ((j * 7) % 18)}cqw`,
                  background: j % 2 ? r.color : 'transparent',
                  border: j % 2 ? 'none' : `0.5cqw solid ${r.color}`,
                  color: j % 2 ? c[0] : r.color,
                  fontSize: '6cqw',
                }}
              >
                {name.slice(0, 3)}
              </div>
            ))}
          </div>
          <div className="flex w-1/2 shrink-0 gap-[2cqw]" aria-hidden style={{ animation: A('ff-marquee', `${5 + i * 2}s`, 'linear', '0s'), animationDirection: r.dir }}>
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="flex h-[10cqw] shrink-0 items-center justify-center rounded-[1cqw] font-black"
                style={{
                  width: `${16 + ((j * 7) % 18)}cqw`,
                  background: j % 2 ? r.color : 'transparent',
                  border: j % 2 ? 'none' : `0.5cqw solid ${r.color}`,
                  color: j % 2 ? c[0] : r.color,
                  fontSize: '6cqw',
                }}
              >
                {name.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function SplitFlapScene({ c, name }: SceneProps) {
  const chars = (name.slice(0, 4) + '··').split('')
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[1.4cqw]">
      {chars.map((ch, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-[0.8cqw] font-mono font-bold"
          style={{
            width: '9cqw',
            height: '12cqw',
            background: c[1],
            color: c[0],
            fontSize: '7cqw',
            border: `0.4cqw solid ${c[3]}`,
            boxShadow: 'inset 0 -0.8cqw 0 rgba(0,0,0,.25)',
            animation: A('ff-flap', '2.4s', 'ease-in-out', `${i * 0.3}s`),
          }}
        >
          {ch}
        </div>
      ))}
    </div>
  )
}

function NeonSignScene({ c, name }: SceneProps) {
  const t = name.slice(0, 5)
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute inset-[8%] rounded-[2cqw] border-[0.7cqw]"
        style={{ borderColor: c[2], boxShadow: `0 0 3cqw ${c[2]}, inset 0 0 3cqw ${c[2]}55`, animation: A('ff-flicker', '4s', 'linear') }}
      />
      <span
        className="relative font-black"
        style={{
          color: c[1],
          fontSize: '12cqw',
          textShadow: `0 0 1.4cqw ${c[1]}, 0 0 3cqw ${c[1]}88, 0 0 6cqw ${c[3]}66`,
          animation: A('ff-flicker', '3.4s', 'linear', '0.4s'),
        }}
      >
        {t}
      </span>
      <span className="absolute bottom-[10%] font-mono" style={{ color: c[3], fontSize: '3.6cqw', textShadow: `0 0 1.6cqw ${c[3]}`, animation: A('ff-blink', '1.6s', 'steps(1)') }}>
        OPEN
      </span>
    </div>
  )
}

function TickerScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute left-[5%] top-[16%] flex items-center gap-[1.4cqw]">
        <span
          className="flex items-center justify-center rounded-[0.6cqw] font-black"
          style={{ background: c[1], color: c[0], fontSize: '4.2cqw', padding: '0.4cqw 1.4cqw' }}
        >
          LIVE
        </span>
        <span className="font-mono" style={{ color: c[2], fontSize: '4.2cqw' }}>
          {new Date().getFullYear()} · BREAKING
        </span>
      </div>
      <div className="absolute left-[5%] top-[34%] max-w-[80%] truncate font-black" style={{ color: c[2], fontSize: '9cqw' }}>
        {name.slice(0, 8)}
      </div>
      <div className="absolute bottom-0 left-0 h-[22%] w-full" style={{ background: c[1] }}>
        <div className="flex h-full w-[200%] items-center" style={{ animation: A('ff-marquee', '7s', 'linear') }}>
          {[0, 1].map((k) => (
            <span key={k} className="w-1/2 shrink-0 truncate font-mono" style={{ color: c[0], fontSize: '4.6cqw' }}>
              {`${name} · ${name} · ${name} · ${name} · ${name} · ${name} · ${name} · `}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

function ThermalScene({ c, name }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ animation: A('ff-jitter', '0.5s', 'linear') }}>
      <div
        className="flex h-[86%] w-[38%] flex-col gap-[1.2cqw] p-[2.4cqw] font-mono"
        style={{ background: c[0], boxShadow: '0 0.6cqw 2cqw rgba(0,0,0,.35)', maskImage: 'linear-gradient(180deg,#000 78%,transparent)' }}
      >
        <div className="text-center font-bold" style={{ color: c[1], fontSize: '3.4cqw' }}>
          *** {name.slice(0, 6)} ***
        </div>
        {[92, 70, 84, 60].map((w, i) => (
          <div key={i} className="h-[0.8cqw]" style={{ width: `${w}%`, background: c[1], opacity: 0.55 }} />
        ))}
        <div className="my-[0.6cqw] border-t border-dashed" style={{ borderColor: `${c[1]}66` }} />
        <div className="flex justify-between" style={{ color: c[1], fontSize: '3cqw' }}>
          <span>TOTAL</span>
          <span style={{ color: c[3], fontWeight: 700 }}>¥99.00</span>
        </div>
        <div
          className="mt-[1cqw] h-[4cqw]"
          style={{ background: `repeating-linear-gradient(90deg, ${c[1]} 0 0.5cqw, transparent 0.5cqw 1.4cqw)` }}
        />
        <div className="text-center" style={{ color: c[2], fontSize: '2.6cqw' }}>
          THANK YOU ♡
        </div>
      </div>
    </div>
  )
}

function UiMorphScene({ c }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center gap-[4cqw] p-[6cqw]">
      <div
        className="relative h-[54cqw] w-[34cqw] shrink-0"
        style={{
          background: '#ffffff',
          borderRadius: '3cqw',
          boxShadow: `0 1cqw 3cqw ${c[1]}22`,
          border: `0.4cqw solid ${c[1]}33`,
          animation: A('ff-blob-morph', '6s', 'ease-in-out'),
        }}
      >
        <div className="m-[2.4cqw] h-[12cqw] rounded-[1.4cqw]" style={{ background: `linear-gradient(120deg, ${c[1]}, ${c[3]})`, animation: A('ff-shimmer-x', '3s', 'linear') , backgroundSize: '200% 100%'}} />
        <div className="mx-[2.4cqw] space-y-[1.2cqw]">
          {[80, 64, 72].map((w, i) => (
            <div key={i} className="h-[1.8cqw] rounded-full bg-zinc-200" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="absolute bottom-[2.4cqw] left-[2.4cqw] right-[2.4cqw] h-[3.4cqw] overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full" style={{ width: '62%', background: c[1], animation: A('ff-karaoke-wipe', '2.8s', 'ease-in-out', '0.5s', '1') }} />
        </div>
      </div>
      <div className="flex flex-col gap-[2cqw]">
        <div className="h-[8cqw] w-[8cqw] rounded-full" style={{ background: c[3], animation: A('ff-pulse-soft', '2.4s') }} />
        <div className="h-[8cqw] w-[8cqw] rounded-[2cqw]" style={{ background: c[1], opacity: 0.8, animation: A('ff-squish', '3s') }} />
        <div className="h-[8cqw] w-[8cqw] rounded-[1cqw]" style={{ border: `0.5cqw solid ${c[2]}`, animation: A('ff-spin', '8s', 'linear') }} />
      </div>
    </div>
  )
}

function HoloHudScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0 opacity-30" style={{ color: c[1] }}>
        <div className="ff-grid-lines absolute inset-0" />
      </div>
      {[46, 32, 18].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${s}%`,
            height: `${s}%`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            borderColor: i === 1 ? c[2] : c[1],
            borderStyle: i === 1 ? 'solid' : 'dashed',
            animation: A(i % 2 ? 'ff-spin-rev' : 'ff-spin', `${10 + i * 6}s`, 'linear'),
            opacity: 0.75,
          }}
        />
      ))}
      <div
        className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${c[1]}55, transparent 70deg, transparent 360deg)`,
          animation: A('ff-sweep-conic', '3.6s', 'linear'),
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono" style={{ color: c[3], fontSize: '5cqw', textShadow: `0 0 1.2cqw ${c[1]}` }}>
        {name.slice(0, 3)}
      </div>
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} size-[5cqw]`} style={{ borderLeft: `0.5cqw solid ${c[1]}`, borderTop: `0.5cqw solid ${c[1]}`, opacity: 0.8 }} />
      ))}
    </>
  )
}

function VhsScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c[0]}, ${c[2]}33 60%, ${c[1]}22)` }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="absolute font-black" style={{ color: c[3], fontSize: '11cqw', transform: 'translate(-1cqw,-0.5cqw)', opacity: 0.8 }}>
          ▶ {name.slice(0, 4)}
        </span>
        <span className="absolute font-black" style={{ color: c[1], fontSize: '11cqw', transform: 'translate(1cqw,0.5cqw)', opacity: 0.8 }}>
          ▶ {name.slice(0, 4)}
        </span>
        <span className="relative font-black text-white" style={{ fontSize: '11cqw' }}>
          ▶ {name.slice(0, 4)}
        </span>
      </div>
      <div className="absolute inset-0 ff-scanlines opacity-60" />
      <div
        className="absolute left-0 h-[8%] w-full"
        style={{
          background: `linear-gradient(180deg, transparent, ${c[3]}44, transparent)`,
          animation: A('ff-scan-track', '2.6s', 'linear'),
        }}
      />
      <div className="absolute left-[4%] top-[6%] font-mono" style={{ color: c[3], fontSize: '3.6cqw' }}>
        SP 00:12:34
      </div>
    </>
  )
}

function GlitchScene({ c, name }: SceneProps) {
  const t = name.slice(0, 5)
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="absolute font-black" style={{ color: c[1], fontSize: '13cqw', transform: 'translate(-1.2cqw,0)', animation: A('ff-glitch-x', '1.1s', 'linear') }}>
        {t}
      </span>
      <span className="absolute font-black" style={{ color: c[2], fontSize: '13cqw', transform: 'translate(1.2cqw,0)', animation: A('ff-glitch-x', '0.9s', 'linear', '0.2s') }}>
        {t}
      </span>
      <span className="relative font-black" style={{ color: c[3], fontSize: '13cqw', animation: A('ff-glitch-x', '1.6s', 'linear', '0.1s') }}>
        {t}
      </span>
      {[20, 48, 74].map((top, i) => (
        <div
          key={i}
          className="absolute left-0 w-full"
          style={{
            top: `${top}%`,
            height: `${2 + i}%`,
            background: c[1],
            opacity: 0.5,
            transform: 'translateX(-4%)',
            animation: A('ff-glitch-x', `${0.7 + i * 0.3}s`, 'steps(3)', `${i * 0.2}s`),
          }}
        />
      ))}
    </div>
  )
}

/* ============================ 粒子 / 线条 / 自然 ============================ */

function FlowLinesScene({ c }: SceneProps) {
  const paths = [
    'M -10 70 C 25 20, 55 85, 110 40',
    'M -10 45 C 30 90, 60 15, 110 65',
    'M -10 90 C 35 40, 65 95, 110 25',
  ]
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="ff-fl-g" x1="0" x2="1">
          <stop offset="0" stopColor={c[1]} stopOpacity="0" />
          <stop offset="0.5" stopColor={c[1]} />
          <stop offset="1" stopColor={c[3]} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i === 1 ? c[3] : c[2]}
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeDasharray="30 120"
          style={{ animation: A('ff-dash-draw', `${3 + i}s`, 'linear', `${i * 0.7}s`), ['--dash' as string]: '150' } as React.CSSProperties}
        />
      ))}
      <path d="M -10 70 C 25 20, 55 85, 110 40" fill="none" stroke="url(#ff-fl-g)" strokeWidth="2.4" opacity="0.7" />
    </svg>
  )
}

function FirefliesScene({ c }: SceneProps) {
  const dots = [
    { l: 12, t: 30, d: 3.2, s: 5 }, { l: 28, t: 62, d: 4.1, s: 4 },
    { l: 45, t: 24, d: 2.7, s: 6 }, { l: 58, t: 70, d: 3.6, s: 3.5 },
    { l: 70, t: 38, d: 4.4, s: 5 }, { l: 85, t: 58, d: 3, s: 4.5 },
    { l: 20, t: 80, d: 3.9, s: 3.5 }, { l: 66, t: 16, d: 4.7, s: 3 },
  ]
  return (
    <>
      <div className="absolute inset-0" style={{ background: `radial-gradient(60% 80% at 50% 40%, ${c[1]}14, transparent)` }} />
      {dots.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: `${p.s * 0.28}cqw`,
            height: `${p.s * 0.28}cqw`,
            background: c[1],
            boxShadow: `0 0 ${p.s * 0.3}cqw ${c[1]}`,
            animation: `${A('ff-float', `${p.d}s`, 'ease-in-out', `${i * 0.4}s`)}, ${A('ff-caret-step', '2.2s', 'steps(1)', `${i * 0.3}s`)}`,
          }}
        />
      ))}
    </>
  )
}

function ParticleShapeScene({ c }: SceneProps) {
  // 心形参数点
  const pts: Array<[number, number]> = [
    [0, -32], [-14, -26], [-24, -14], [-26, 0], [-18, 12], [-8, 20],
    [0, 28], [8, 20], [18, 12], [26, 0], [24, -14], [14, -26],
  ]
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {pts.map(([x, y], i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${x * 0.55}cqw)`,
            top: `calc(50% + ${y * 0.55}cqw)`,
            width: '2.4cqw',
            height: '2.4cqw',
            background: i % 3 === 0 ? c[3] : c[1],
            boxShadow: `0 0 1.2cqw ${c[1]}88`,
            animation: A('ff-pulse-soft', '2.6s', 'ease-in-out', `${i * 0.18}s`),
          }}
        />
      ))}
      {[
        { l: 12, t: 20 }, { l: 82, t: 24 }, { l: 16, t: 78 }, { l: 86, t: 70 },
      ].map((p, i) => (
        <div
          key={`f${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.l}%`, top: `${p.t}%`,
            width: '1.6cqw', height: '1.6cqw',
            background: c[2], opacity: 0.7,
            animation: A('ff-float', `${3 + i}s`, 'ease-in-out', `${i * 0.5}s`),
          }}
        />
      ))}
    </div>
  )
}

function ConstellationScene({ c }: SceneProps) {
  const nodes = [
    [12, 30], [30, 16], [46, 38], [62, 20], [80, 36], [22, 62], [44, 74], [68, 66], [88, 60],
  ]
  const edges: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [3, 4], [2, 6], [5, 6], [6, 7], [7, 8], [1, 5], [3, 7]]
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={c[2]} strokeWidth="0.4" strokeDasharray="2 3"
          opacity="0.6"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill={i % 4 === 0 ? c[3] : c[1]} style={{ animation: A('ff-pulse-soft', `${2 + (i % 4)}s`, 'ease-in-out', `${i * 0.3}s`) }} />
      ))}
    </svg>
  )
}

function BreathingScene({ c }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border-2"
          style={{ width: '34%', height: '34%', borderColor: c[1], animation: A('ff-breathe', '3.6s', 'ease-out', `${i * 1.2}s`) }}
        />
      ))}
      <div
        className="size-[10%] rounded-full"
        style={{ background: `radial-gradient(circle at 35% 30%, ${c[3]}, ${c[1]})`, boxShadow: `0 0 4cqw ${c[1]}88`, animation: A('ff-pulse-soft', '1.8s') }}
      />
    </div>
  )
}

function ContourScene({ c }: SceneProps) {
  const levels = [40, 32, 24, 16, 9]
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
      {levels.map((r, i) => (
        <ellipse
          key={i}
          cx={50 + (i % 2 ? 3 : -2)}
          cy={54 - i * 2}
          rx={r * 1.35}
          ry={r}
          fill="none"
          stroke={i === levels.length - 1 ? c[3] : c[1]}
          strokeWidth={i === levels.length - 1 ? 1 : 0.6}
          strokeDasharray="220"
          style={{ animation: A('ff-dash-draw', '2.6s', 'ease-out', `${i * 0.35}s`), ['--dash' as string]: '220' } as React.CSSProperties}
        />
      ))}
      <circle cx={50} cy={52} r="2" fill={c[3]} style={{ animation: A('ff-pulse-soft', '2s') }} />
    </svg>
  )
}

function RippleScene({ c }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute rounded-[50%] border-2"
          style={{ width: '44%', height: '16%', borderColor: c[1], animation: A('ff-breathe', '3s', 'ease-out', `${i * 0.75}s`) }}
        />
      ))}
      <div className="absolute rounded-[50%]" style={{ width: '7%', height: '2.6%', background: c[3], animation: A('ff-pulse-soft', '2.4s') }} />
    </div>
  )
}

function RainGlassScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `radial-gradient(85% 110% at 32% 18%, ${c[2]}55, transparent 72%), radial-gradient(70% 90% at 78% 80%, ${c[3]}22, transparent 70%), ${c[0]}` }} />
      <div className="absolute left-[18%] top-[8%] h-[40%] w-[26%] rounded-[2cqw]" style={{ background: `linear-gradient(180deg, ${c[2]}66, ${c[2]}11)`, boxShadow: `0 0 4cqw ${c[2]}33` }} />
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[0.4%]"
          style={{
            left: `${(i * 7.3) % 100}%`,
            height: `${14 + (i % 4) * 8}%`,
            top: '-20%',
            background: `linear-gradient(180deg, transparent, ${c[1]}cc, transparent)`,
            animation: A('ff-rain-diag', `${0.8 + (i % 5) * 0.25}s`, 'linear', `${i * 0.13}s`),
          }}
        />
      ))}
      {[30, 58, 76].map((left, i) => (
        <div
          key={`d${i}`}
          className="absolute rounded-full"
          style={{
            left: `${left}%`,
            top: `${20 + i * 22}%`,
            width: '4cqw',
            height: '5.6cqw',
            background: `radial-gradient(circle at 35% 30%, ${c[3]}aa, ${c[1]}33 70%)`,
            animation: A('ff-drop-slow', `${5 + i * 2}s`, 'ease-in', `${i}s`),
          }}
        />
      ))}
    </>
  )
}

function DawnSkyScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c[0]} 0%, ${c[1]}55 55%, ${c[1]} 100%)` }} />
      <div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 rounded-full"
        style={{ width: '20%', height: '20%', background: `radial-gradient(circle, ${c[2]}, ${c[3] || c[1]})`, boxShadow: `0 0 8cqw ${c[2]}cc`, animation: A('ff-float', '6s') }}
      />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 78 L22 58 L38 74 L58 52 L78 76 L100 60 L100 100 L0 100 Z" fill={c[0]} opacity="0.55" />
        <path d="M0 92 L18 76 L42 90 L66 72 L86 92 L100 82 L100 100 L0 100 Z" fill={c[0]} opacity="0.9" />
      </svg>
    </>
  )
}

function SnowEmberScene({ c }: SceneProps) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`s${i}`}
          className="absolute rounded-full"
          style={{
            left: `${(i * 11 + 4) % 96}%`,
            top: '-10%',
            width: `${1 + (i % 3) * 0.5}cqw`,
            height: `${1 + (i % 3) * 0.5}cqw`,
            background: c[1],
            opacity: 0.8,
            filter: 'blur(0.08cqw)',
            animation: A('ff-fall', `${3 + (i % 4)}s`, 'linear', `${i * 0.5}s`),
          }}
        />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={`e${i}`}
          className="absolute rounded-full"
          style={{
            left: `${(i * 15 + 8) % 90}%`,
            top: '105%',
            width: '1.4cqw',
            height: '1.4cqw',
            background: c[2],
            boxShadow: `0 0 1.4cqw ${c[2]}`,
            animation: `${A('ff-rise', `${2.4 + (i % 3)}s`, 'linear', `${i * 0.6}s`)}, ${A('ff-flicker', '1.8s', 'linear', `${i * 0.2}s`)}`,
          }}
        />
      ))}
    </>
  )
}

function SandFallScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c[0]}, ${c[1]}22)` }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${(i % 4 - 1.5) * 1.1}cqw)`,
            top: '-6%',
            width: '0.8cqw',
            height: '0.8cqw',
            background: c[3],
            animation: A('ff-fall', `${0.7 + (i % 3) * 0.25}s`, 'linear', `${i * 0.18}s`),
          }}
        />
      ))}
      <div
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2"
        style={{
          width: '34%',
          height: '20%',
          background: c[1],
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          transformOrigin: 'bottom',
          animation: A('ff-grow-v', '12s', 'ease-out', '0s', '1 forwards') ,
          boxShadow: `0 0 3cqw ${c[1]}66`,
        }}
      />
    </>
  )
}

function AuroraScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute -inset-[10%] opacity-80" style={{ filter: 'blur(3cqw)' }}>
        <div className="absolute left-[-10%] top-[10%] h-[46%] w-[120%] rounded-[50%]" style={{ background: `linear-gradient(90deg, transparent, ${c[1]}, ${c[3]}55, transparent)`, animation: A('ff-wave-tilt', '5s') }} />
        <div className="absolute left-[-10%] top-[36%] h-[38%] w-[120%] rounded-[50%]" style={{ background: `linear-gradient(90deg, transparent, ${c[2]}88, ${c[1]}44, transparent)`, animation: A('ff-wave-tilt', '7s', 'ease-in-out', '1s') }} />
        <div className="absolute left-[-10%] top-[60%] h-[30%] w-[120%] rounded-[50%]" style={{ background: `linear-gradient(90deg, transparent, ${c[3]}55, ${c[2]}66, transparent)`, animation: A('ff-wave-tilt', '6s', 'ease-in-out', '2s') }} />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white" style={{ left: `${12 + i * 18}%`, top: `${14 + (i % 3) * 8}%`, width: '0.7cqw', height: '0.7cqw', animation: A('ff-caret-step', '3s', 'steps(1)', `${i * 0.5}s`) }} />
      ))}
    </>
  )
}

/* ============================ 水墨 / 绘画 / 纸艺 ============================ */

function InkBloomScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div
        className="absolute left-[38%] top-[30%]"
        style={{
          width: '34%',
          height: '34%',
          background: `radial-gradient(circle at 42% 38%, ${c[1]} 0%, ${c[1]}cc 45%, ${c[2]}55 75%, transparent 80%)`,
          filter: 'blur(0.3cqw)',
          animation: A('ff-blob-morph', '7s'),
        }}
      />
      <div className="absolute left-[64%] top-[58%]" style={{ width: '10%', height: '10%', background: `radial-gradient(circle, ${c[1]}, transparent 70%)`, filter: 'blur(0.2cqw)', animation: A('ff-pulse-soft', '4s', 'ease-out', '0.8s') }} />
      <div className="absolute left-[24%] top-[64%]" style={{ width: '6%', height: '6%', background: `radial-gradient(circle, ${c[2]}, transparent 70%)`, filter: 'blur(0.15cqw)', animation: A('ff-pulse-soft', '5s', 'ease-out', '1.6s') }} />
      <div className="absolute right-[12%] top-[14%] font-serif italic" style={{ color: c[2], fontSize: '5cqw', writingMode: 'vertical-rl', opacity: 0.75, animation: A('ff-float', '6s') }}>
        墨
      </div>
    </>
  )
}

function InkMountainScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c[0]}, ${c[0]})` }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 72 L18 46 L30 60 L48 34 L64 62 L78 48 L100 68 L100 100 L0 100 Z" fill={c[2]} opacity="0.35" />
        <path d="M0 86 L22 62 L40 78 L58 56 L76 80 L100 66 L100 100 L0 100 Z" fill={c[1]} opacity="0.8" />
      </svg>
      <div className="absolute left-0 top-[46%] h-[10%] w-full" style={{ background: `linear-gradient(90deg, transparent, ${c[3]}88, transparent)`, filter: 'blur(1.2cqw)', animation: A('ff-drift', '14s', 'linear') }} />
      <div className="absolute left-0 top-[66%] h-[8%] w-full" style={{ background: `linear-gradient(90deg, transparent, ${c[0]}cc, transparent)`, filter: 'blur(1cqw)', animation: A('ff-drift', '20s', 'linear', '3s') }} />
      <div className="absolute right-[8%] top-[10%] size-[7%] rounded-full" style={{ background: c[3], opacity: 0.5, boxShadow: `0 0 3cqw ${c[3]}` }} />
    </>
  )
}

function OneStrokeScene({ c, name }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <path
        d="M14 44 C 20 20, 34 16, 40 28 C 44 36, 52 40, 60 34 M60 34 C 70 28, 84 30, 90 20 M60 34 C 64 44, 74 48, 84 46"
        fill="none"
        stroke={c[1]}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="240"
        style={{ animation: A('ff-dash-draw', '4s', 'ease-in-out', '0s', 'infinite alternate'), ['--dash' as string]: '240' } as React.CSSProperties}
      />
      <circle cx="26" cy="24" r="1.6" fill={c[3]} style={{ animation: A('ff-pulse-soft', '2s') }} />
      <text x="76" y="14" fontSize="7" fill={c[3]} fontStyle="italic" fontFamily="serif">
        {name.slice(0, 2)}
      </text>
    </svg>
  )
}

function WatercolorScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      {[
        { l: 22, t: 22, s: 34, col: c[1], d: 0 },
        { l: 48, t: 38, s: 40, col: c[2], d: 1.2 },
        { l: 34, t: 54, s: 30, col: c[3], d: 2.2 },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${b.l}%`,
            top: `${b.t}%`,
            width: `${b.s}%`,
            height: `${b.s * 0.8}%`,
            background: `radial-gradient(circle at 40% 40%, ${b.col}bb, ${b.col}33 60%, transparent 75%)`,
            filter: 'blur(1cqw)',
            mixBlendMode: 'multiply',
            animation: A('ff-blob-morph', `${6 + i * 2}s`, 'ease-in-out', `${b.d}s`),
          }}
        />
      ))}
    </>
  )
}

function ImpastoScene({ c }: SceneProps) {
  const strokes = [
    { w: 46, h: 9, l: 8, t: 30, col: c[1], r: -4 },
    { w: 34, h: 8, l: 38, t: 46, col: c[2], r: 3 },
    { w: 52, h: 10, l: 16, t: 62, col: c[3], r: -2 },
  ]
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-[0.07]" style={{ background: `repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 4px)` }} />
      {strokes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.l}%`,
            top: `${s.t}%`,
            width: `${s.w}%`,
            height: `${s.h}%`,
            background: `linear-gradient(100deg, ${s.col}, ${s.col}cc)`,
            boxShadow: `inset 0 0.5cqw 0.8cqw rgba(255,255,255,.25), inset 0 -0.5cqw 0.8cqw rgba(0,0,0,.35), 0 0.5cqw 1.4cqw rgba(0,0,0,.4)`,
            transform: `rotate(${s.r}deg)`,
            animation: A('ff-appear-up', '1.6s', 'cubic-bezier(.2,1.2,.4,1)', `${i * 0.5}s`, '1 both') ,
          }}
        />
      ))}
    </>
  )
}

function CrayonScene({ c }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <circle cx="76" cy="16" r="9" fill="none" stroke={c[1]} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 2.2" style={{ animation: A('ff-spin', '12s', 'linear') , transformOrigin: '76px 16px' }} />
      <path d="M12 46 Q 22 30 32 44 T 52 42" fill="none" stroke={c[2]} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0.5 2" style={{ animation: A('ff-jitter', '0.7s', 'linear') }} />
      <path d="M40 50 q 4 -8 8 0 M56 24 l 3 6 6 1 -4 4 1 6 -6 -3 -6 3 1 -6 -4 -4 6 -1 z" fill="none" stroke={c[3]} strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 2" style={{ animation: A('ff-jitter', '0.9s', 'linear', '0.2s') }} />
      <path d="M60 52 h 26 M64 52 v -6 M72 52 v -8" fill="none" stroke={c[1]} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.5 2" />
    </svg>
  )
}

function GongbiScene({ c }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <path d="M18 52 C 30 40 38 30 52 24 M52 24 C 60 20 66 22 70 28" fill="none" stroke={c[1]} strokeWidth="1" strokeDasharray="120" style={{ animation: A('ff-dash-draw', '3.5s', 'ease-out', '0s', 'infinite alternate'), ['--dash' as string]: '120' } as React.CSSProperties} />
      {[
        { cx: 52, cy: 24, r: 7 },
        { cx: 68, cy: 40, r: 5.5 },
        { cx: 34, cy: 36, r: 5 },
      ].map((f, i) => (
        <g key={i}>
          {Array.from({ length: 6 }).map((_, j) => {
            const ang = (Math.PI * 2 * j) / 6
            return (
              <ellipse
                key={j}
                cx={f.cx + Math.cos(ang) * f.r * 0.6}
                cy={f.cy + Math.sin(ang) * f.r * 0.6}
                rx="2.6" ry="1.4"
                fill={i === 0 ? c[2] : c[3]}
                opacity="0.85"
                transform={`rotate(${(ang * 180) / Math.PI} ${f.cx + Math.cos(ang) * f.r * 0.6} ${f.cy + Math.sin(ang) * f.r * 0.6})`}
                style={{ animation: A('ff-appear', '2.4s', 'ease-out', `${i * 0.6 + j * 0.1}s`, '1 both') }}
              />
            )
          })}
          <circle cx={f.cx} cy={f.cy} r="1.6" fill={c[1]} />
        </g>
      ))}
    </svg>
  )
}

function PorcelainScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="30" r="21" fill="none" stroke={c[1]} strokeWidth="1.4" strokeDasharray="140" style={{ animation: A('ff-dash-draw', '3s', 'ease-out', '0s', 'infinite alternate'), ['--dash' as string]: '140' } as React.CSSProperties} />
        <circle cx="50" cy="30" r="15" fill="none" stroke={c[2]} strokeWidth="0.8" strokeDasharray="100" style={{ animation: A('ff-dash-draw', '3s', 'ease-out', '0.5s', 'infinite alternate'), ['--dash' as string]: '100' } as React.CSSProperties} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4
          return <ellipse key={i} cx={50 + Math.cos(a) * 18} cy={30 + Math.sin(a) * 18} rx="3" ry="1.4" fill={c[2]} opacity="0.8" transform={`rotate(${(a * 180) / Math.PI} ${50 + Math.cos(a) * 18} ${30 + Math.sin(a) * 18})`} />
        })}
        <path d="M20 8 q 6 -5 12 0 q 6 5 12 0" fill="none" stroke={c[1]} strokeWidth="1.2" strokeDasharray="40" style={{ animation: A('ff-dash-draw', '2.4s', 'linear', '0.8s'), ['--dash' as string]: '40' } as React.CSSProperties} />
        <path d="M56 52 q 6 -5 12 0 q 6 5 12 0" fill="none" stroke={c[3]} strokeWidth="1.2" strokeDasharray="40" style={{ animation: A('ff-dash-draw', '2.4s', 'linear', '1.4s'), ['--dash' as string]: '40' } as React.CSSProperties} />
      </svg>
    </>
  )
}

function ShadowPlayScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `radial-gradient(60% 90% at 50% 45%, ${c[2]}55, ${c[0]})` }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <g style={{ animation: A('ff-sway', '2.8s', 'ease-in-out'), transformOrigin: '48px 20px' }}>
          <line x1="48" y1="20" x2="30" y2="38" stroke={c[1]} strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="20" x2="66" y2="36" stroke={c[1]} strokeWidth="2" strokeLinecap="round" />
        </g>
        <g style={{ animation: A('ff-sway', '3.4s', 'ease-in-out', '0.5s'), transformOrigin: '48px 34px' }}>
          <line x1="48" y1="34" x2="38" y2="52" stroke={c[1]} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="48" y1="34" x2="58" y2="52" stroke={c[1]} strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <ellipse cx="48" cy="14" rx="6" ry="7" fill={c[1]} />
        <path d="M40 58 q 8 -6 16 0 z" fill={c[1]} />
        <line x1="66" y1="6" x2="66" y2="36" stroke={c[3]} strokeWidth="0.6" opacity="0.7" strokeDasharray="3 2" />
        <line x1="30" y1="6" x2="30" y2="38" stroke={c[3]} strokeWidth="0.6" opacity="0.7" strokeDasharray="3 2" />
      </svg>
    </>
  )
}

function StainedGlassScene({ c }: SceneProps) {
  const panes = [
    { d: 'M20 50 L20 20 L35 8 L50 20 L50 50 Z', col: c[1] },
    { d: 'M50 50 L50 20 L65 8 L80 20 L80 50 Z', col: c[2] },
    { d: 'M20 50 L50 50 L50 56 L20 56 Z', col: c[3] },
    { d: 'M50 50 L80 50 L80 56 L50 56 Z', col: c[1] },
  ]
  return (
    <>
      <div className="absolute inset-0" style={{ background: `radial-gradient(70% 100% at 50% 30%, ${c[1]}22, ${c[0]})` }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        {panes.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.col}
            stroke="#0a0a0a"
            strokeWidth="1.6"
            opacity="0.85"
            style={{ animation: A('ff-flicker', `${4 + i}s`, 'linear', `${i * 0.7}s`) }}
          />
        ))}
      </svg>
    </>
  )
}

function UkiyoeScene({ c }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <path d="M14 40 L30 26 L44 38 L54 30 L66 40 Z" fill={c[2]} opacity="0.7" />
      <path
        d="M0 56 C 12 42 24 52 34 42 C 44 32 54 50 66 40 C 74 33 86 44 100 36 L100 60 L0 60 Z"
        fill={c[1]}
        strokeDasharray="220"
        style={{ animation: A('ff-dash-draw', '4s', 'ease-out', '0s', 'infinite alternate'), ['--dash' as string]: '220' } as React.CSSProperties}
      />
      {[18, 32, 48, 62, 78].map((x, i) => (
        <path key={i} d={`M${x} 52 q 3 -7 6 -10 M${x + 2} 52 q 4 -5 9 -7`} fill="none" stroke={c[3]} strokeWidth="1.4" strokeLinecap="round" style={{ animation: A('ff-appear', '2s', 'ease-out', `${0.8 + i * 0.25}s`, '1 both') }} />
      ))}
    </svg>
  )
}

function OperaMaskScene({ c }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 60 80" className="h-[86%]">
        <ellipse cx="30" cy="40" rx="22" ry="30" fill={c[2]} stroke={c[1]} strokeWidth="2" />
        <path d="M30 10 C 22 10 16 18 18 26 L30 22 Z" fill={c[1]} style={{ animation: A('ff-appear', '2s', 'ease-out', '0.3s', '1 both') }} />
        <path d="M30 10 C 38 10 44 18 42 26 L30 22 Z" fill={c[3]} style={{ animation: A('ff-appear', '2s', 'ease-out', '0.6s', '1 both') }} />
        <path d="M12 32 q 8 -6 14 0 M34 32 q 8 -6 14 0" fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="19" cy="36" rx="2.6" ry="3.4" fill="#0a0a0a" style={{ animation: A('ff-pulse-soft', '3s') }} />
        <ellipse cx="41" cy="36" rx="2.6" ry="3.4" fill="#0a0a0a" style={{ animation: A('ff-pulse-soft', '3s', 'ease-in-out', '0.2s') }} />
        <path d="M24 50 q 6 4 12 0" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M30 40 l -3 6 h 6 z" fill={c[1]} />
      </svg>
    </div>
  )
}

function DunhuangScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c[0]}, ${c[1]}22)` }} />
      <div className="absolute left-1/2 top-[28%] size-[16%] -translate-x-1/2 rounded-full border-2" style={{ borderColor: c[3], opacity: 0.8, animation: A('ff-pulse-soft', '3s') }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <path d="M10 44 C 24 28 40 30 50 22 C 58 16 70 20 78 14" fill="none" stroke={c[3]} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="140" style={{ animation: A('ff-dash-draw', '3.4s', 'ease-in-out', '0s', 'infinite alternate'), ['--dash' as string]: '140' } as React.CSSProperties} />
        <path d="M16 52 C 30 42 44 44 58 36 C 66 32 76 34 88 26" fill="none" stroke={c[2]} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="120" style={{ animation: A('ff-dash-draw', '3.8s', 'ease-in-out', '0.8s', 'infinite alternate'), ['--dash' as string]: '120' } as React.CSSProperties} />
        {[22, 42, 62, 82].map((x, i) => (
          <circle key={i} cx={x} cy={46 - (i % 3) * 12} r="1.4" fill={c[3]} opacity="0.8" style={{ animation: A('ff-caret-step', '2.6s', 'steps(1)', `${i * 0.4}s`) }} />
        ))}
      </svg>
    </>
  )
}

/* ============================ 几何 / 数据 ============================ */

function BauhausScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute left-[14%] top-[18%] size-[34%] rounded-full" style={{ background: c[1], animation: A('ff-pulse-soft', '5s') }} />
      <div className="absolute right-[16%] top-[22%] size-[36%] overflow-hidden">
        <div className="h-1/2 w-full" style={{ background: c[3], animation: A('ff-grow-v', '2s', 'cubic-bezier(.2,1.2,.4,1)', '0.4s', '1 both') }} />
        <div className="h-1/2 w-full bg-transparent" />
      </div>
      <div
        className="absolute bottom-[14%] left-[24%] h-0 w-0"
        style={{
          borderLeft: '9cqw solid transparent',
          borderRight: '9cqw solid transparent',
          borderBottom: `14cqw solid ${c[3]}`,
          animation: A('ff-sway', '6s'),
          transformOrigin: '50% 100%',
        }}
      />
      <div className="absolute bottom-[12%] right-[14%] h-[10%] w-[40%]" style={{ background: '#0a0a0a', animation: A('ff-grow-h', '1.6s', 'ease-out', '0.8s', '1 both') }} />
      <div className="absolute bottom-[26%] right-[30%] size-[8%] rounded-full" style={{ border: `0.8cqw solid #0a0a0a`, animation: A('ff-spin', '9s', 'linear') }} />
    </>
  )
}

function LowPolyScene({ c }: SceneProps) {
  const tris = [
    { p: '50,4 20,40 50,40', col: c[1], o: 0.9 },
    { p: '50,4 50,40 82,32', col: c[2], o: 0.75 },
    { p: '20,40 50,40 34,58', col: c[3], o: 0.7 },
    { p: '50,40 82,32 66,58', col: c[1], o: 0.6 },
    { p: '34,58 50,40 66,58', col: c[2], o: 0.85 },
    { p: '20,40 8,20 50,4', col: c[3], o: 0.5 },
  ]
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      {tris.map((t, i) => (
        <polygon
          key={i}
          points={t.p}
          fill={t.col}
          opacity={t.o}
          style={{ animation: A('ff-pulse-soft', `${3 + i * 0.6}s`, 'ease-in-out', `${i * 0.4}s`) }}
        />
      ))}
    </svg>
  )
}

interface IsoCubeProps {
  x: string
  y: string
  s: string
  delay: string
  top: string
  left: string
  right: string
}

function IsoCube({ x, y, s, delay, top, left, right }: IsoCubeProps) {
  return (
    <div className="absolute" style={{ left: x, top: y, animation: A('ff-appear-up', '1.4s', 'cubic-bezier(.2,1.3,.4,1)', delay, '1 both') }}>
      <div
        style={{
          width: s,
          height: s,
          background: top,
          clipPath: 'polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%)',
        }}
      />
      <div className="flex">
        <div style={{ width: `calc(${s} / 2)`, height: s, background: left, clipPath: 'polygon(0% 0%, 50% 25%, 50% 75%, 0% 50%)' }} />
        <div style={{ width: `calc(${s} / 2)`, height: s, background: right, clipPath: 'polygon(50% 25%, 100% 0%, 100% 50%, 50% 75%)' }} />
      </div>
    </div>
  )
}

function IsoBlocksScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-25" style={{ color: c[1] }}>
        <div className="ff-grid-lines absolute inset-0" />
      </div>
      <IsoCube x="24%" y="18%" s="24cqw" delay="0s" top={c[1]} left={c[3]} right={c[2]} />
      <IsoCube x="46%" y="38%" s="18cqw" delay="0.5s" top={c[2]} left={c[1]} right={c[3]} />
      <IsoCube x="16%" y="46%" s="14cqw" delay="1s" top={c[3]} left={c[2]} right={c[1]} />
    </>
  )
}

function ChartGrowScene({ c }: SceneProps) {
  const bars = [34, 52, 42, 66, 58]
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-15" style={{ color: c[1] }}>
        <div className="ff-grid-lines absolute inset-0" />
      </div>
      <div className="absolute bottom-[16%] left-[10%] flex h-[58%] items-end gap-[4%]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-[9%] rounded-t-[0.6cqw]"
            style={{
              height: `${h}%`,
              background: i === 3 ? c[3] : c[1],
              transformOrigin: 'bottom',
              animation: A('ff-grow-v', '1s', 'cubic-bezier(.2,1.2,.4,1)', `${i * 0.18}s`, '1 both') + ', ' + A('ff-pulse-soft', '3s', 'ease-in-out', `${1 + i * 0.2}s`),
            }}
          />
        ))}
      </div>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M12 44 L30 32 L48 36 L66 18 L84 24"
          fill="none"
          stroke={c[3]}
          strokeWidth="1.6"
          strokeDasharray="140"
          style={{ animation: A('ff-dash-draw', '2.4s', 'ease-out', '0.9s'), ['--dash' as string]: '140' } as React.CSSProperties}
        />
        <circle cx="66" cy="18" r="2" fill={c[3]} style={{ animation: A('ff-pulse-soft', '2s', 'ease-out', '2s') }} />
      </svg>
    </>
  )
}

function NetworkScene({ c }: SceneProps) {
  const nodes = [
    [20, 20], [50, 12], [78, 24], [32, 44], [62, 40], [16, 62], [48, 66], [80, 58],
  ]
  const edges: Array<[number, number]> = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4], [3, 5], [3, 6], [4, 6], [4, 7], [2, 7], [5, 6]]
  return (
    <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={i % 3 === 0 ? c[3] : c[2]}
          strokeWidth="0.5"
          strokeDasharray="4 44"
          opacity="0.8"
          style={{ animation: A('ff-dash-draw', `${2 + (i % 4)}s`, 'linear', `${i * 0.3}s`), ['--dash' as string]: '48' } as React.CSSProperties}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 2.2 : 1.5}
          fill={i % 4 === 0 ? c[3] : c[1]}
          style={{ animation: A('ff-pulse-soft', `${2.2 + (i % 5) * 0.5}s`, 'ease-in-out', `${i * 0.25}s`) }}
        />
      ))}
    </svg>
  )
}

function TimelineScene({ c, name }: SceneProps) {
  const marks = ['2019', '2021', '2023', '2025', 'NOW']
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute left-[8%] right-[8%] top-1/2 h-[0.8cqw] -translate-y-1/2 rounded-full" style={{ background: `${c[1]}33`, transformOrigin: 'left', animation: A('ff-grow-h', '2.2s', 'ease-out', '0s', '1 both') }} />
      <div className="absolute left-[8%] right-[8%] top-1/2 h-[0.8cqw] -translate-y-1/2 overflow-hidden rounded-full">
        <div className="h-full w-full origin-left" style={{ background: `linear-gradient(90deg, ${c[1]}, ${c[2]})`, animation: A('ff-grow-h', '2.2s', 'ease-out', '0.2s', '1 both') }} />
      </div>
      {marks.map((m, i) => (
        <div key={i} className="absolute -translate-x-1/2" style={{ left: `${12 + i * 19}%`, top: '50%', animation: A('ff-appear', '0.8s', 'cubic-bezier(.2,1.4,.4,1)', `${0.4 + i * 0.3}s`, '1 both') }}>
          <div className="size-[2.6cqw] -translate-y-1/2 rounded-full" style={{ background: i === marks.length - 1 ? c[3] : c[1], boxShadow: i === marks.length - 1 ? `0 0 2cqw ${c[3]}` : 'none' }} />
          <div className="mt-[1cqw] -translate-y-1/2 whitespace-nowrap font-mono" style={{ color: i === marks.length - 1 ? c[3] : c[2], fontSize: '3cqw' }}>
            {m}
          </div>
        </div>
      ))}
      <div className="absolute left-[8%] top-[14%] font-mono" style={{ color: c[2], fontSize: '3.4cqw', opacity: 0.7 }}>
        {name.slice(0, 8)}
      </div>
    </>
  )
}

function SplitCompareScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[1], clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)', animation: A('ff-pulse-soft', '4s') }} />
      <div className="absolute inset-0" style={{ background: c[2], clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 42% 100%)' }} />
      <div className="absolute left-1/2 top-1/2 flex size-[26cqw] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-black" style={{ background: c[0], color: c[3], fontSize: '8cqw', border: `0.7cqw solid ${c[3]}`, animation: A('ff-appear', '1.2s', 'cubic-bezier(.2,1.5,.4,1)', '0.4s', '1 both') }}>
        VS
      </div>
      <div className="absolute left-[10%] top-[20%] font-black" style={{ color: c[0], fontSize: '7cqw' }}>
        {name.slice(0, 3)}
      </div>
      <div className="absolute bottom-[18%] right-[10%] font-black" style={{ color: c[0], fontSize: '7cqw' }}>
        {name.slice(3, 6) || 'B'}
      </div>
    </>
  )
}

function MosaicTilesScene({ c }: SceneProps) {
  return (
    <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 gap-[0.8cqw] p-[6cqw]">
      {Array.from({ length: 15 }).map((_, i) => {
        const col = [c[1], c[2], c[3]][i % 3]
        return (
          <div key={i} className="relative overflow-hidden rounded-[0.8cqw]" style={{ background: c[0], perspective: '20cqw' }}>
            <div
              className="absolute inset-0"
              style={{
                background: col,
                transform: 'rotateX(0deg)',
                animation: A('ff-tile-flip', '3.6s', 'ease-in-out', `${(i % 5) * 0.24 + Math.floor(i / 5) * 0.5}s`),
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function MetroMapScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <path d="M8 44 C 26 44 26 16 48 16 S 74 40 92 40" fill="none" stroke={c[1]} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M8 20 C 30 20 40 52 60 52 S 82 28 92 28" fill="none" stroke={c[2]} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M22 6 C 22 24 50 30 66 52" fill="none" stroke={c[3]} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        {[
          [8, 44], [30, 34], [48, 16], [70, 34], [92, 40],
          [8, 20], [34, 34], [60, 52], [92, 28], [22, 6], [66, 52],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#fff" stroke={c[1]} strokeWidth="1.2" style={{ animation: A('ff-pulse-soft', `${2.4 + (i % 4) * 0.5}s`, 'ease-in-out', `${i * 0.2}s`) }} />
        ))}
        <circle r="2.6" fill={c[3]} stroke="#fff" strokeWidth="1.2" style={{ offsetPath: "path('M8 44 C 26 44 26 16 48 16 S 74 40 92 40')", animation: A('ff-train-move', '6s', 'linear') } as React.CSSProperties} />
      </svg>
    </>
  )
}

function SatelliteMapScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-30" style={{ color: c[1] }}>
        <div className="ff-grid-lines absolute inset-0" style={{ backgroundSize: '12cqw 12cqw' }} />
      </div>
      <div className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border" style={{ borderColor: `${c[1]}88` }}>
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, ${c[3]}55, transparent 80deg)`,
            animation: A('ff-sweep-conic', '3s', 'linear'),
          }}
        />
        <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${c[1]}44`, animation: A('ff-spin', '14s', 'linear') }} />
      </div>
      {[
        { l: 30, t: 30, d: 0 }, { l: 62, t: 42, d: 0.8 }, { l: 44, t: 62, d: 1.6 },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute size-[2cqw] rounded-full"
          style={{
            left: `${b.l}%`, top: `${b.t}%`, background: c[3],
            boxShadow: `0 0 1.6cqw ${c[3]}`,
            animation: A('ff-appear', '1s', 'ease-out', `${b.d}s`, '1 both') + ', ' + A('ff-pulse-soft', '2.4s', 'ease-in-out', `${b.d + 1}s`),
          }}
        />
      ))}
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <path d="M30 30 L44 42 L62 42" fill="none" stroke={c[3]} strokeWidth="0.8" strokeDasharray="3 3" style={{ animation: A('ff-dash-draw', '3s', 'linear', '0.6s'), ['--dash' as string]: '40' } as React.CSSProperties} />
      </svg>
    </>
  )
}

function BlueprintScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-30" style={{ color: c[1] }}>
        <div className="ff-grid-lines absolute inset-0" />
      </div>
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <circle cx="36" cy="28" r="14" fill="none" stroke={c[1]} strokeWidth="1" strokeDasharray="90" style={{ animation: A('ff-dash-draw', '2.8s', 'ease-out', '0s', 'infinite alternate'), ['--dash' as string]: '90' } as React.CSSProperties} />
        <rect x="52" y="16" width="30" height="22" fill="none" stroke={c[1]} strokeWidth="1" strokeDasharray="104" style={{ animation: A('ff-dash-draw', '2.8s', 'ease-out', '0.4s', 'infinite alternate'), ['--dash' as string]: '104' } as React.CSSProperties} />
        <line x1="36" y1="6" x2="36" y2="50" stroke={c[2]} strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="8" y1="28" x2="66" y2="28" stroke={c[2]} strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M22 28 h 28 M36 14 v 28" stroke={c[3]} strokeWidth="0.7" strokeDasharray="60" style={{ animation: A('ff-dash-draw', '2s', 'linear', '1s'), ['--dash' as string]: '60' } as React.CSSProperties} />
        <path d="M52 12 l 4 -4 h 26 l 4 4" fill="none" stroke={c[2]} strokeWidth="0.8" />
      </svg>
      <div className="absolute bottom-[8%] right-[6%] font-mono" style={{ color: c[3], fontSize: '3cqw' }}>
        {name.slice(0, 6)} · 1:50
      </div>
    </>
  )
}

function PixelSpriteScene({ c, name }: SceneProps) {
  const heart = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
  ]
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-15" style={{ color: c[1] }}>
        <div className="ff-grid-lines absolute inset-0" style={{ backgroundSize: '6cqw 6cqw' }} />
      </div>
      <div
        className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2"
        style={{ gridTemplateColumns: 'repeat(8, 4cqw)', gap: '0.2cqw', animation: A('ff-pixel-steps', '3s', 'steps(4)') }}
      >
        {heart.flatMap((row, y) =>
          row.map((on, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: '4cqw',
                height: '4cqw',
                background: on ? (x >= 3 && y === 2 ? c[0] : c[1]) : 'transparent',
                borderRadius: '0.3cqw',
              }}
            />
          )),
        )}
      </div>
      <div className="absolute right-[10%] top-[16%] font-mono" style={{ color: c[3], fontSize: '3.4cqw', animation: A('ff-caret-step', '1s', 'steps(1)') }}>
        {name.slice(0, 4)}
      </div>
    </>
  )
}

function RpgDialogScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c[0]}, ${c[0]}dd)` }} />
      <div className="absolute left-[8%] top-[12%] flex items-end gap-[1cqw]">
        <div className="h-[10cqw] w-[8cqw]" style={{ background: c[1], clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
        <div className="h-[7cqw] w-[6cqw] rounded-[1cqw_1cqw_0_0]" style={{ background: c[1], opacity: 0.75 }} />
      </div>
      <div
        className="absolute bottom-[10%] left-[6%] right-[6%] rounded-[1.2cqw] p-[2.6cqw]"
        style={{ background: '#0c1020ee', border: `0.5cqw solid ${c[2]}`, boxShadow: `0 0 0 0.5cqw #0c1020, 0 0 2cqw ${c[2]}44` }}
      >
        <div className="font-bold" style={{ color: c[2], fontSize: '4cqw' }}>
          {name.slice(0, 6)}
        </div>
        <div className="mt-[1cqw] space-y-[1cqw]">
          <div className="h-[1.6cqw] w-[70%] rounded bg-white/70" />
          <div className="h-[1.6cqw] w-[52%] rounded bg-white/50" />
        </div>
        <div className="mt-[1.6cqw] flex items-center gap-[1cqw]">
          <span className="font-mono" style={{ color: c[3], fontSize: '2.8cqw' }}>
            HP
          </span>
          <div className="h-[1.8cqw] w-[46%] overflow-hidden rounded-full border border-white/30">
            <div style={{ height: '100%', width: '72%', background: c[3], animation: A('ff-karaoke-wipe', '3s', 'ease-in-out', '0.5s', '1 both') }} />
          </div>
        </div>
        <div className="absolute bottom-[1.4cqw] right-[1.8cqw]" style={{ color: c[2], fontSize: '3.4cqw', animation: A('ff-float', '1s', 'ease-in-out') }}>
          ▼
        </div>
      </div>
    </>
  )
}

/* ============================ 纸艺 / 手绘 / 板式 ============================ */

function PaperCutScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      {[
        { col: c[1], inset: '4%', delay: '0s', op: 1 },
        { col: c[2], inset: '13%', delay: '0.4s', op: 0.95 },
        { col: c[3], inset: '22%', delay: '0.8s', op: 0.9 },
      ].map((layer, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            inset: layer.inset,
            background: layer.col,
            opacity: layer.op,
            clipPath:
              i === 2
                ? 'polygon(0% 68%, 12% 52%, 26% 64%, 40% 46%, 56% 60%, 72% 44%, 86% 58%, 100% 48%, 100% 100%, 0% 100%)'
                : 'polygon(0% 100%, 0% 78%, 14% 66%, 30% 76%, 46% 60%, 62% 72%, 78% 58%, 92% 68%, 100% 60%, 100% 100%)',
            boxShadow: '0 0.8cqw 1.6cqw rgba(0,0,0,.28)',
            animation: A('ff-sway', `${4 + i}s`, 'ease-in-out', layer.delay),
            transformOrigin: '50% 100%',
          }}
        />
      ))}
      <div
        className="absolute left-[62%] top-[16%] size-[14%]"
        style={{
          background: c[3],
          clipPath: 'polygon(50% 0%, 80% 12%, 100% 42%, 72% 100%, 28% 100%, 0% 42%, 20% 12%)',
          filter: 'drop-shadow(0 0.5cqw 0.8cqw rgba(0,0,0,.3))',
          animation: A('ff-float', '4s', 'ease-in-out'),
        }}
      />
      <div className="absolute left-[8%] top-[12%] font-serif" style={{ color: c[1], fontSize: '5cqw', writingMode: 'vertical-rl' }}>
        {name.slice(0, 2)}
      </div>
    </>
  )
}

function StickyScene({ c, name }: SceneProps) {
  const notes = [
    { l: 8, t: 14, r: -5, col: c[1] },
    { l: 40, t: 20, r: 3, col: c[2] },
    { l: 70, t: 12, r: -2, col: c[3] },
    { l: 18, t: 56, r: 2, col: c[3] },
    { l: 52, t: 60, r: -4, col: c[1] },
  ]
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      {notes.map((n, i) => (
        <div
          key={i}
          className="absolute flex flex-col gap-[1cqw] p-[1.6cqw]"
          style={{
            left: `${n.l}%`,
            top: `${n.t}%`,
            width: '22%',
            height: '30%',
            background: n.col,
            transform: `rotate(${n.r}deg)`,
            boxShadow: '0 0.6cqw 1.4cqw rgba(0,0,0,.18)',
            animation: A('ff-float', `${3.4 + i * 0.6}s`, 'ease-in-out', `${i * 0.4}s`),
          }}
        >
          <div className="h-[1cqw] w-[70%] rounded bg-black/15" />
          <div className="h-[1cqw] w-[85%] rounded bg-black/15" />
          <div className="h-[1cqw] w-[55%] rounded bg-black/15" />
          {i === 1 && (
            <div className="absolute -top-[1.4cqw] left-1/2 h-[2.4cqw] w-[40%] -translate-x-1/2" style={{ background: `${c[3]}99`, opacity: 0.85 }} />
          )}
          {i === 3 && <div className="mt-auto font-serif italic" style={{ color: 'rgba(0,0,0,.45)', fontSize: '3.6cqw' }}>{name.slice(0, 3)}</div>}
        </div>
      ))}
    </>
  )
}

function WhiteboardScene({ c, name }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <ellipse cx="28" cy="22" rx="14" ry="10" fill="none" stroke={c[1]} strokeWidth="1.6" strokeDasharray="76" style={{ animation: A('ff-dash-draw', '2.4s', 'ease-out', '0s', 'infinite alternate'), ['--dash' as string]: '76' } as React.CSSProperties} />
      <path d="M50 12 v 22 M50 34 l -7 -8 M50 34 l 7 -8" fill="none" stroke={c[3]} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="60" style={{ animation: A('ff-dash-draw', '1.8s', 'ease-out', '0.6s'), ['--dash' as string]: '60' } as React.CSSProperties} />
      <path d="M62 16 h 26 M62 24 h 20 M62 32 h 24" stroke={c[1]} strokeWidth="1.6" strokeLinecap="round" opacity="0.75" strokeDasharray="80" style={{ animation: A('ff-dash-draw', '2s', 'ease-out', '0.9s'), ['--dash' as string]: '80' } as React.CSSProperties} />
      <path d="M14 46 q 12 -8 24 0 t 24 0 t 24 0" fill="none" stroke={c[2]} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="90" style={{ animation: A('ff-dash-draw', '2.2s', 'ease-out', '1.2s'), ['--dash' as string]: '90' } as React.CSSProperties} />
      <text x="30" y="57" fontSize="6.4" fill={c[3]} fontWeight="700" fontFamily="sans-serif" style={{ animation: A('ff-appear', '1.4s', 'ease-out', '1.6s', '1 both') }}>
        {name.slice(0, 5)}
      </text>
    </svg>
  )
}

function SketchyScene({ c, name }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <path
        d="M8 8 L91 7 L92 51 L9 52 Z"
        fill="none"
        stroke={c[1]}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="210"
        style={{ animation: A('ff-jitter', '0.6s', 'linear') + ', ' + A('ff-dash-draw', '2.8s', 'ease-out', '0s', 'infinite alternate'), ['--dash' as string]: '210' } as React.CSSProperties}
      />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={16 + i * 9} y1={14} x2={22 + i * 9} y2={26} stroke={c[2]} strokeWidth="0.9" opacity="0.6" />
      ))}
      <circle cx="66" cy="20" r="7" fill="none" stroke={c[1]} strokeWidth="1.4" style={{ animation: A('ff-jitter', '0.8s', 'linear', '0.2s') }} />
      <circle cx="64" cy="18" r="1.2" fill={c[3]} />
      <circle cx="69" cy="18" r="1.2" fill={c[3]} />
      <path d="M62 24 q 4 3 8 0" fill="none" stroke={c[3]} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 38 h 48" stroke={c[3]} strokeWidth="1.6" strokeLinecap="round" style={{ animation: A('ff-jitter', '0.7s', 'linear', '0.4s') }} />
      <text x="16" y="47" fontSize="6" fill={c[1]} fontFamily="sans-serif" fontWeight="600" style={{ animation: A('ff-jitter', '1s', 'linear', '0.1s') }}>
        {name.slice(0, 6)}
      </text>
    </svg>
  )
}

function DoodleScene({ c }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <path d="M20 18 l 3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" fill="none" stroke={c[2]} strokeWidth="1.6" strokeLinejoin="round" style={{ animation: A('ff-jitter', '0.8s', 'linear') }} />
      <path d="M64 12 a 8 8 0 1 0 8 12 a 6 6 0 1 1 -8 -12" fill="none" stroke={c[1]} strokeWidth="1.6" strokeLinecap="round" style={{ animation: A('ff-spin', '10s', 'linear'), transformOrigin: '70px 19px' } as React.CSSProperties} />
      <path d="M14 44 q 10 -10 20 0 q 10 10 20 0" fill="none" stroke={c[3]} strokeWidth="1.6" strokeLinecap="round" style={{ animation: A('ff-jitter', '0.9s', 'linear', '0.3s') }} />
      <circle cx="80" cy="42" r="8" fill="none" stroke={c[1]} strokeWidth="1.6" style={{ animation: A('ff-jitter', '1s', 'linear', '0.6s') }} />
      <circle cx="77" cy="40" r="1.1" fill={c[1]} />
      <circle cx="83" cy="40" r="1.1" fill={c[1]} />
      <path d="M76 45 q 4 3 8 0" fill="none" stroke={c[1]} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M48 30 l 8 3 -3 -8 M52 26 l 4 7" fill="none" stroke={c[2]} strokeWidth="1.4" strokeLinecap="round" style={{ animation: A('ff-appear', '2.4s', 'ease-out', '0.5s', '1 both') }} />
    </svg>
  )
}

function EngravingScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute left-1/2 top-1/2 size-[64%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[50%]" style={{ boxShadow: `inset 0 0 0 0.4cqw ${c[1]}, inset 0 0 0 0.9cqw transparent, inset 0 0 0 1.2cqw ${c[1]}55` }}>
        <div className="absolute inset-0 opacity-50" style={{ background: `repeating-linear-gradient(45deg, ${c[1]} 0 0.15cqw, transparent 0.15cqw 0.55cqw), repeating-linear-gradient(-45deg, ${c[2]} 0 0.15cqw, transparent 0.15cqw 0.8cqw)` }} />
        <div className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]" style={{ background: c[1], opacity: 0.85 }} />
        <div className="absolute left-1/2 top-[38%] size-[10%] -translate-x-1/2 rounded-[50%]" style={{ background: c[0] }} />
      </div>
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 font-serif italic" style={{ color: c[3], fontSize: '4cqw' }}>
        {name.slice(0, 6)}
      </div>
    </>
  )
}

function HalftonePopScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-40" style={{ color: c[2] }}>
        <div className="ff-halftone-dots absolute inset-0" />
      </div>
      <div
        className="absolute left-1/2 top-1/2 flex h-[40cqw] w-[40cqw] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{
          background: c[1],
          clipPath: 'polygon(50% 0%, 61% 12%, 76% 4%, 79% 20%, 95% 20%, 88% 34%, 100% 44%, 88% 56%, 95% 72%, 79% 72%, 72% 88%, 58% 80%, 50% 94%, 42% 80%, 28% 88%, 22% 72%, 5% 72%, 12% 56%, 0% 44%, 12% 34%, 5% 20%, 21% 20%, 25% 4%, 39% 12%)',
          animation: A('ff-jitter', '0.5s', 'linear'),
        }}
      >
        <span className="font-black" style={{ color: c[3], fontSize: '8cqw', textShadow: `0.4cqw 0.4cqw 0 ${c[2]}` }}>
          {name.slice(0, 4)}
        </span>
      </div>
    </>
  )
}

function ComicBurstScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 opacity-30" style={{ color: c[2] }}>
        <div className="ff-halftone-dots absolute inset-0" style={{ backgroundSize: '1.6cqw 1.6cqw' }} />
      </div>
      <div className="absolute inset-[6%] rounded-[1cqw] border-[0.7cqw] border-black bg-white/0" style={{ animation: A('ff-pulse-soft', '4s') }} />
      {[
        { l: 14, t: 18, r: -12 },
        { l: 66, t: 46, r: 8 },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute flex h-[16cqw] w-[30cqw] items-center justify-center font-black italic"
          style={{
            left: `${b.l}%`,
            top: `${b.t}%`,
            transform: `rotate(${b.r}deg)`,
            background: i === 0 ? c[1] : c[3],
            color: '#fff',
            fontSize: '6cqw',
            clipPath: 'polygon(3% 0%, 97% 6%, 100% 90%, 60% 100%, 0% 96%)',
            boxShadow: '0.5cqw 0.5cqw 0 rgba(0,0,0,.8)',
            animation: A('ff-jitter', `${0.4 + i * 0.2}s`, 'linear'),
          }}
        >
          {i === 0 ? name.slice(0, 3) : name.slice(3, 6) || 'BAM'}
        </div>
      ))}
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 10
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 26}
              y1={30 + Math.sin(a) * 16}
              x2={50 + Math.cos(a) * 60}
              y2={30 + Math.sin(a) * 40}
              stroke={c[2]}
              strokeWidth="0.8"
              opacity="0.5"
            />
          )
        })}
      </svg>
    </>
  )
}

/* ============================ 3D / 材质 / 物件 ============================ */

function ClayBlobScene({ c }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[6cqw]">
      <div
        className="relative h-[34cqw] w-[36cqw]"
        style={{
          background: `radial-gradient(circle at 35% 28%, ${c[3]}55, transparent 45%), radial-gradient(circle at 70% 75%, rgba(0,0,0,.22), transparent 50%), ${c[1]}`,
          boxShadow: 'inset -1.4cqw -1.8cqw 2.6cqw rgba(0,0,0,.25), inset 1cqw 1.2cqw 2cqw rgba(255,255,255,.35), 0 1.4cqw 2.4cqw rgba(0,0,0,.25)',
          animation: A('ff-squish', '3.2s', 'ease-in-out'),
        }}
      >
        <div className="absolute left-[24%] top-[34%] size-[15%] rounded-[50%] bg-black/25" />
        <div className="absolute right-[26%] top-[38%] size-[12%] rounded-[50%] bg-black/20" />
        <div
          className="absolute inset-0 opacity-25"
          style={{ background: `repeating-radial-gradient(circle at 30% 30%, transparent 0 1.2cqw, rgba(0,0,0,.12) 1.2cqw 1.4cqw)` }}
        />
      </div>
      <div
        className="h-[16cqw] w-[17cqw]"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.5), transparent 45%), ${c[2]}`,
          boxShadow: 'inset -0.7cqw -1cqw 1.6cqw rgba(0,0,0,.25), 0 0.8cqw 1.4cqw rgba(0,0,0,.2)',
          animation: A('ff-blob-morph', '5s', 'ease-in-out', '0.6s'),
        }}
      />
    </div>
  )
}

function GlassShapesScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(130deg, ${c[0]}, ${c[1]}88 55%, ${c[2]}66)` }} />
      {[
        { l: 10, t: 16, w: 34, h: 44, r: 14, d: 0 },
        { l: 52, t: 34, w: 30, h: 36, r: 20, d: 0.8 },
      ].map((g, i) => (
        <div
          key={i}
          className="absolute overflow-hidden"
          style={{
            left: `${g.l}%`,
            top: `${g.t}%`,
            width: `${g.w}%`,
            height: `${g.h}%`,
            borderRadius: `${g.r * 0.25}cqw`,
            background: 'rgba(255,255,255,0.16)',
            border: '0.4cqw solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(0.6cqw)',
            boxShadow: `0 1cqw 3cqw rgba(255,255,255,.15), inset 0 0 2cqw rgba(255,255,255,.25)`,
            animation: A('ff-float', `${4 + i}s`, 'ease-in-out', `${g.d}s`),
          }}
        >
          <div
            className="absolute inset-y-0 w-[40%]"
            style={{
              background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.5), transparent)',
              animation: A('ff-drift', '3.6s', 'linear'),
            }}
          />
          <div className="absolute bottom-[12%] left-[12%] h-[8%] w-[50%] rounded-full bg-white/30" />
          <div className="absolute bottom-[24%] left-[12%] h-[8%] w-[36%] rounded-full bg-white/20" />
        </div>
      ))}
    </>
  )
}

function LiquidScene({ c }: SceneProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative h-[38cqw] w-[38cqw]"
        style={{
          background: `linear-gradient(135deg, ${c[1]}, ${c[2]})`,
          boxShadow: `0 0 4cqw ${c[1]}55`,
          animation: A('ff-blob-morph', '6s', 'ease-in-out'),
        }}
      >
        <div
          className="absolute left-[18%] top-[16%] h-[36%] w-[30%] opacity-70"
          style={{ background: c[3], filter: 'blur(0.8cqw)', animation: A('ff-blob-morph', '4.4s', 'ease-in-out', '0.5s') }}
        />
        <div
          className="absolute bottom-[16%] right-[18%] size-[22%] opacity-60"
          style={{ background: c[3], filter: 'blur(0.6cqw)', animation: A('ff-blob-morph', '5.2s', 'ease-in-out', '1s') }}
        />
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="absolute bottom-[8%] rounded-full"
          style={{
            left: `${30 + i * 30}%`,
            width: '2.4cqw',
            height: '2.4cqw',
            background: c[2],
            animation: A('ff-fall', `${2.4 + i}s`, 'ease-in', `${i * 1.1}s`),
          }}
        />
      ))}
    </div>
  )
}

function LegoBricksScene({ c }: SceneProps) {
  const bricks = [
    { b: '12%', l: 8, w: 40, col: c[1], d: 0 },
    { b: '12%', l: 54, w: 26, col: c[2], d: 0.4 },
    { b: '38%', l: 20, w: 34, col: c[3], d: 0.8 },
    { b: '38%', l: 60, w: 20, col: c[1], d: 1.2 },
    { b: '64%', l: 34, w: 28, col: c[2], d: 1.6 },
  ]
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      {bricks.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{ bottom: b.b, left: `${b.l}%`, width: `${b.w}%`, animation: A('ff-bounce-soft', '2.8s', 'ease-in-out', `${b.d}s`) }}
        >
          <div className="flex justify-around px-[8%]">
            {Array.from({ length: b.w > 30 ? 3 : 2 }).map((_, j) => (
              <div key={j} className="h-[2.2cqw] w-[18%] rounded-t-full" style={{ background: b.col, boxShadow: 'inset 0 -0.3cqw 0.4cqw rgba(0,0,0,.3)' }} />
            ))}
          </div>
          <div
            className="h-[6cqw] rounded-[0.6cqw]"
            style={{
              background: b.col,
              boxShadow: `inset 0.4cqw 0.6cqw 1cqw rgba(255,255,255,.35), inset -0.4cqw -0.6cqw 1cqw rgba(0,0,0,.3), 0 0.6cqw 1.2cqw rgba(0,0,0,.3)`,
            }}
          />
        </div>
      ))}
    </>
  )
}

function PopUpBookScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute bottom-[16%] left-[10%] right-[10%] h-[4cqw] rounded-[1cqw]" style={{ background: '#d6c7a8', boxShadow: '0 0.6cqw 1.2cqw rgba(0,0,0,.25)' }} />
      <div
        className="absolute bottom-[19%] left-[24%] h-[26cqw] w-[24cqw] origin-bottom"
        style={{
          background: `linear-gradient(120deg, ${c[1]}, ${c[1]}cc)`,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          boxShadow: '0 1cqw 2cqw rgba(0,0,0,.3)',
          animation: A('ff-grow-v', '2.4s', 'cubic-bezier(.2,1.3,.4,1)', '0.3s', '1 both'),
        }}
      />
      <div
        className="absolute bottom-[19%] left-[44%] h-[18cqw] w-[16cqw] origin-bottom"
        style={{
          background: `linear-gradient(120deg, ${c[2]}, ${c[2]}cc)`,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          animation: A('ff-grow-v', '2.4s', 'cubic-bezier(.2,1.3,.4,1)', '0.7s', '1 both'),
        }}
      />
      <div
        className="absolute bottom-[19%] right-[18%] size-[12cqw] rounded-full"
        style={{ background: c[3], animation: A('ff-appear-up', '1.8s', 'cubic-bezier(.2,1.4,.4,1)', '1s', '1 both') }}
      />

    </>
  )
}

function FlatSceneScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute left-[12%] top-[14%] size-[16cqw] rounded-full" style={{ background: c[1], animation: A('ff-pulse-soft', '4s') }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <g style={{ animation: A('ff-spin', '16s', 'linear'), transformOrigin: '19px 16px' } as React.CSSProperties}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 8
            return <line key={i} x1={19 + Math.cos(a) * 10} y1={16 + Math.sin(a) * 10} x2={19 + Math.cos(a) * 14} y2={16 + Math.sin(a) * 14} stroke={c[2]} strokeWidth="1.6" strokeLinecap="round" />
          })}
        </g>
      </svg>
      <div className="absolute right-[16%] top-[16%] h-[5cqw] w-[16cqw] rounded-full" style={{ background: '#ffffffcc', animation: A('ff-drift', '16s', 'linear') }} />
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <ellipse cx="30" cy="70" rx="34" ry="16" fill={c[2]} opacity="0.9" />
        <ellipse cx="78" cy="76" rx="30" ry="14" fill={c[3]} opacity="0.9" />
      </svg>
      <div className="absolute bottom-[8%] left-[52%]">
        <div className="h-[8cqw] w-[10cqw] rounded-[0.6cqw]" style={{ background: c[3] }} />
        <div
          className="h-[6cqw] w-[12cqw]"
          style={{ background: c[1], clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', transform: 'translateY(0.2cqw)' }}
        />
      </div>
    </>
  )
}

function AssemblyStepsScene({ c, name }: SceneProps) {
  const steps = [c[1], c[2], c[3]]
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 flex items-center justify-center gap-[2.5cqw] px-[6cqw]">
        {steps.map((col, i) => (
          <div key={i} className="flex flex-col items-center gap-[1.4cqw]" style={{ animation: A('ff-appear-up', '1s', 'cubic-bezier(.2,1.2,.4,1)', `${i * 0.5}s`, '1 both') }}>
            <div className="flex size-[9cqw] items-center justify-center rounded-full font-black text-white" style={{ background: col, fontSize: '4.6cqw' }}>
              {i + 1}
            </div>
            <div className="relative h-[14cqw] w-[12cqw]">
              <div className="absolute inset-0 rounded-[1cqw] border-[0.45cqw] border-dashed" style={{ borderColor: col, opacity: 0.7 }} />
              <div
                className="absolute left-1/2 top-1/2 size-[55%] -translate-x-1/2 -translate-y-1/2 rounded-[0.6cqw]"
                style={{ background: col, animation: A('ff-pulse-soft', `${2.6 + i * 0.4}s`, 'ease-in-out', `${i * 0.3}s`) }}
              />
            </div>
            <div className="h-[1cqw] w-[80%] rounded-full" style={{ background: col, opacity: 0.4 }} />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <path d="M32 30 h 10 M58 30 h 10" stroke={c[1]} strokeWidth="1.4" strokeDasharray="2 2" opacity="0.7" />
        <path d="M40 30 l -3 -3 M40 30 l -3 3 M58 30 l 3 -3 M58 30 l 3 3" stroke={c[1]} strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 font-mono" style={{ color: c[1], fontSize: '3.2cqw', opacity: 0.75 }}>
        {name.slice(0, 6)}
      </div>
    </>
  )
}

function DetectiveBoardScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, ${c[0]} 0 1.6cqw, ${c[0]}dd 1.6cqw 3.2cqw)` }} />
      <div className="absolute left-[10%] top-[14%] h-[30%] w-[24%] rotate-[-6deg] p-[0.8cqw]" style={{ background: '#f5f0e6', boxShadow: '0 0.6cqw 1.4cqw rgba(0,0,0,.4)' }}>
        <div className="h-full w-full" style={{ background: `linear-gradient(140deg, ${c[3]}44, ${c[1]}33)` }} />
        <div className="absolute -top-[1cqw] left-1/2 size-[1.6cqw] -translate-x-1/2 rounded-full" style={{ background: c[2] }} />
      </div>
      <div className="absolute right-[12%] top-[20%] h-[32%] w-[22%] rotate-[5deg] p-[0.8cqw]" style={{ background: '#f5f0e6', boxShadow: '0 0.6cqw 1.4cqw rgba(0,0,0,.4)' }}>
        <div className="h-full w-full" style={{ background: `linear-gradient(200deg, ${c[1]}55, ${c[3]}33)` }} />
        <div className="absolute -top-[1cqw] left-1/2 size-[1.6cqw] -translate-x-1/2 rounded-full" style={{ background: c[2] }} />
      </div>
      <div className="absolute bottom-[10%] left-[38%] h-[24%] w-[20%] rotate-[-3deg] bg-amber-50 p-[1cqw]" style={{ boxShadow: '0 0.6cqw 1.4cqw rgba(0,0,0,.4)' }}>
        <div className="h-[0.8cqw] w-[70%] rounded bg-zinc-300" />
        <div className="mt-[0.8cqw] h-[0.8cqw] w-[50%] rounded bg-zinc-300" />
        <div className="absolute -top-[1cqw] left-1/2 size-[1.6cqw] -translate-x-1/2 rounded-full" style={{ background: c[2] }} />
      </div>
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <path d="M22 26 L50 40 M50 40 L74 30 M50 40 L48 52 M22 26 L74 30" stroke={c[2]} strokeWidth="0.7" strokeDasharray="3 2" fill="none" style={{ animation: A('ff-dash-draw', '3s', 'linear'), ['--dash' as string]: '120' } as React.CSSProperties} />
      </svg>
      <div className="absolute left-[6%] bottom-[8%] font-serif italic" style={{ color: c[1], fontSize: '4cqw' }}>
        {name.slice(0, 5)}?
      </div>
    </>
  )
}

function GalleryWallScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `radial-gradient(90% 120% at 50% 0%, ${c[1]}26, transparent 60%), ${c[0]}` }} />
      {[
        { l: 10, t: 16, w: 24, h: 34, col: c[2], d: 0 },
        { l: 40, t: 22, w: 20, h: 28, col: c[3], d: 0.5 },
        { l: 66, t: 14, w: 22, h: 32, col: c[2], d: 1 },
      ].map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f.l}%`,
            top: `${f.t}%`,
            width: `${f.w}%`,
            height: `${f.h}%`,
            padding: '1.4cqw',
            background: '#0a0a0a',
            boxShadow: `0 1cqw 2.4cqw rgba(0,0,0,.6), 0 0 ${4 + i * 2}cqw ${f.col}44`,
            animation: A('ff-flicker', `${5 + i}s`, 'linear', `${f.d}s`),
          }}
        >
          <div className="h-full w-full" style={{ background: `linear-gradient(150deg, ${f.col}66, ${c[1]}22 60%, ${f.col}33)` }} />
        </div>
      ))}
      <div
        className="absolute left-0 top-0 h-full w-[30%]"
        style={{ background: `linear-gradient(100deg, ${c[1]}22, transparent)`, animation: A('ff-drift', '9s', 'linear') }}
      />
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 font-serif italic" style={{ color: c[1], fontSize: '3.6cqw', opacity: 0.8 }}>
        {name.slice(0, 6)}
      </div>
    </>
  )
}

function KaraokeScene({ c, name }: SceneProps) {
  const lyric = name.slice(0, 9)
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: `radial-gradient(70% 100% at 50% 80%, ${c[1]}22, ${c[0]})` }} />
      {['♫', '♪', '♬'].map((n, i) => (
        <div
          key={i}
          className="absolute font-black"
          style={{
            left: `${14 + i * 34}%`,
            top: `${16 + (i % 2) * 10}%`,
            color: c[3],
            fontSize: '5cqw',
            animation: `${A('ff-float', `${3 + i}s`, 'ease-in-out', `${i * 0.5}s`)}, ${A('ff-caret-step', '2s', 'steps(1)', `${i * 0.4}s`)}`,
          }}
        >
          {n}
        </div>
      ))}
      <div className="absolute bottom-[22%] left-1/2 w-[86%] -translate-x-1/2 text-center">
        <div className="relative inline-block">
          <span className="font-black" style={{ color: `${c[3]}44`, fontSize: '8cqw' }}>
            {lyric}
          </span>
          <span
            className="absolute left-0 top-0 overflow-hidden whitespace-nowrap font-black"
            style={{ color: c[1], fontSize: '8cqw', animation: A('ff-karaoke-wipe', '4s', 'linear', '0.5s', 'infinite') }}
          >
            {lyric}
          </span>
        </div>
        <div className="mx-auto mt-[1.4cqw] h-[0.8cqw] w-[60%] overflow-hidden rounded-full" style={{ background: `${c[3]}33` }}>
          <div className="h-full" style={{ width: '45%', background: c[2], animation: A('ff-karaoke-wipe', '4s', 'linear', '0.5s', 'infinite') }} />
        </div>
      </div>
    </div>
  )
}

function BeatBarsScene({ c }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute inset-0 flex items-center justify-center gap-[2.2cqw]">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="w-[4.4cqw] rounded-[0.6cqw]"
            style={{
              height: `${16 + (i % 3) * 6}cqw`,
              background: i % 3 === 0 ? c[3] : i % 2 === 0 ? c[1] : c[2],
              transformOrigin: 'center',
              animation: A('ff-equal', `${0.8 + (i % 4) * 0.2}s`, 'ease-in-out', `${i * 0.08}s`),
            }}
          />
        ))}
      </div>
      <div
        className="absolute left-1/2 top-1/2 size-[30cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={{ borderColor: c[1], animation: A('ff-breathe', '0.9s', 'ease-out') }}
      />
    </>
  )
}

/* ============================ 电影 / 复古 ============================ */

function FilmGrainScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c[1]}44, ${c[0]})` }} />
      <div className="absolute inset-x-0 top-0 h-[12%]" style={{ background: '#050505' }} />
      <div className="absolute inset-x-0 bottom-0 h-[12%]" style={{ background: '#050505' }} />
      <div className="absolute left-[8%] top-[20%] font-mono" style={{ color: c[2], fontSize: '3.4cqw', opacity: 0.9 }}>
        {name.slice(0, 6)}
      </div>
      <div className="absolute bottom-[18%] left-1/2 flex -translate-x-1/2 items-center gap-[1.4cqw]">
        <div className="relative flex size-[11cqw] items-center justify-center rounded-full border-2" style={{ borderColor: `${c[2]}99` }}>
          <span className="font-mono font-bold" style={{ color: c[2], fontSize: '5cqw' }}>
            3
          </span>
          <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full">
            <path d="M20 2 A 18 18 0 0 1 38 20" fill="none" stroke={c[3] ?? c[2]} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="57" style={{ animation: A('ff-dash-draw', '3s', 'linear'), ['--dash' as string]: '57' } as React.CSSProperties} />
          </svg>
        </div>
        <div className="size-[2cqw] rounded-full" style={{ background: c[3] ?? '#ef4444', animation: A('ff-blink', '1.4s', 'steps(1)') }} />
      </div>
      <div className="ff-grain-layer absolute -inset-[10%] opacity-40" style={{ animation: A('ff-grain-shift', '0.9s', 'steps(5)') }} />
      <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 6cqw ${c[0]}`, animation: A('ff-flicker', '3.2s', 'linear') }} />
    </>
  )
}

function SpyFilmScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(-55deg, ${c[0]} 0 5cqw, ${c[1]}18 5cqw 10cqw)` }} />
      {[38, 26, 14].map((s, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.6cqw]"
          style={{
            width: `${s * 1.6}%`,
            height: `${s * 1.6 * 0.62}%`,
            borderColor: i === 1 ? c[3] : c[2],
            borderStyle: i === 2 ? 'dashed' : 'solid',
            animation: A(i % 2 ? 'ff-spin-rev' : 'ff-spin', `${8 + i * 5}s`, 'linear'),
          }}
        />
      ))}
      <div
        className="absolute bottom-[16%] left-[16%] h-[26cqw] w-[10cqw] rounded-[5cqw_5cqw_1cqw_1cqw]"
        style={{ background: c[2], animation: A('ff-drift', '7s', 'ease-in-out') }}
      />
      <div className="absolute right-[10%] top-[14%] font-black italic tracking-tight" style={{ color: c[1], fontSize: '8cqw', textShadow: `0.4cqw 0.4cqw 0 ${c[3]}` }}>
        {name.slice(0, 4)}
      </div>
    </>
  )
}

function SunburstScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div
        className="absolute left-1/2 top-[62%] h-[200%] w-[200%] -translate-x-1/2 -translate-y-0"
        style={{
          background: `repeating-conic-gradient(from -90deg at 50% 0%, ${c[1]}33 0deg 9deg, transparent 9deg 18deg)`,
          animation: A('ff-spin', '30s', 'linear'),
        }}
      />
      <div className="absolute left-1/2 top-[62%] size-[24cqw] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, ${c[2]}, ${c[1]})`, boxShadow: `0 0 5cqw ${c[1]}88` }} />
      <div className="absolute inset-x-[16%] top-[6%] h-[10cqw] border-x-[0.6cqw] border-t-[0.6cqw]" style={{ borderColor: c[2], borderBottom: 'none', borderRadius: '5cqw 5cqw 0 0' }} />
      <div className="absolute inset-x-[24%] top-[22%] h-[6cqw] border-x-[0.4cqw] border-t-[0.4cqw]" style={{ borderColor: `${c[2]}88`, borderBottom: 'none', borderRadius: '3cqw 3cqw 0 0' }} />
      <div className="absolute left-[10%] top-[12%] font-serif" style={{ color: c[2], fontSize: '4.6cqw', letterSpacing: '0.5cqw' }}>
        {name.slice(0, 4)}
      </div>
    </>
  )
}

function ConstructivismScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[2] }} />
      <div
        className="absolute -left-[6%] top-[8%] h-[120%] w-[64%]"
        style={{ background: c[1], clipPath: 'polygon(18% 0%, 100% 0%, 46% 100%, 0% 100%)', transform: 'rotate(-8deg)' }}
      />
      <div className="absolute right-[6%] top-[10%] h-[8%] w-[52%]" style={{ background: c[2], transform: 'rotate(-8deg)' }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <path
          d="M60 40 l 3.4 -7 3.4 7 -1.8 0 -1.6 -3.4 -1.6 3.4 z M63.4 33 l 4 -4 -0.6 3 M63.4 33 l -4 -4 0.6 3"
          fill={c[3]}
          style={{ animation: A('ff-appear', '2s', 'cubic-bezier(.2,1.4,.4,1)', '0.6s', '1 both') }}
        />
      </svg>
      <div
        className="absolute bottom-[10%] right-[8%] origin-bottom-right font-black"
        style={{ color: c[3], fontSize: '10cqw', lineHeight: 1, transform: 'rotate(-8deg)', animation: A('ff-appear-up', '1.4s', 'cubic-bezier(.2,1.2,.4,1)', '0.3s', '1 both') }}
      >
        {name.slice(0, 4)}
      </div>
      <div className="absolute left-[10%] top-[46%] h-[4%] w-[30%]" style={{ background: c[3], transform: 'rotate(-8deg)' }} />
    </>
  )
}

function RubberHoseScene({ c, name }: SceneProps) {
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
      <g style={{ animation: A('ff-bounce-soft', '1.2s', 'ease-in-out') }}>
        <circle cx="50" cy="18" r="12" fill={c[1]} />
        <circle cx="46" cy="15" r="3.4" fill="#fff" />
        <circle cx="55" cy="15" r="3.4" fill="#fff" />
        <circle cx="46.6" cy="15.4" r="1.4" fill="#000" />
        <circle cx="55.6" cy="15.4" r="1.4" fill="#000" />
        <path d="M45 24 q 5 5 10 0" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g style={{ animation: A('ff-sway', '1.2s', 'ease-in-out') }}>
        <path d="M42 26 C 28 30 26 40 30 48" fill="none" stroke={c[1]} strokeWidth="4" strokeLinecap="round" />
        <circle cx="30" cy="48" r="3" fill="#fff" stroke={c[1]} strokeWidth="1.6" />
      </g>
      <g style={{ animation: A('ff-sway', '1.2s', 'ease-in-out', '0.6s') }}>
        <path d="M58 26 C 72 30 74 40 70 48" fill="none" stroke={c[1]} strokeWidth="4" strokeLinecap="round" />
        <circle cx="70" cy="48" r="3" fill="#fff" stroke={c[1]} strokeWidth="1.6" />
      </g>
      <path d="M44 30 C 40 40 40 46 42 54 M56 30 C 60 40 60 46 58 54" fill="none" stroke={c[1]} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="50" cy="56" rx="14" ry="2" fill={c[2]} opacity="0.4" />
      <text x="76" y="14" fontSize="6" fontWeight="800" fill={c[3]} fontFamily="sans-serif" fontStyle="italic" style={{ animation: A('ff-jitter', '0.8s', 'linear') }}>
        {name.slice(0, 3)}!
      </text>
    </svg>
  )
}

function CelSpeedScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c[1]}33, ${c[0]})` }} />
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 14
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 14}
              y1={30 + Math.sin(a) * 9}
              x2={50 + Math.cos(a) * 70}
              y2={30 + Math.sin(a) * 44}
              stroke="#ffffff"
              strokeWidth={i % 2 ? 0.5 : 0.9}
              opacity={i % 2 ? 0.25 : 0.5}
            />
          )
        })}
      </svg>
      <div
        className="absolute left-1/2 top-1/2 size-[20cqw] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle at 32% 30%, ${c[3]}, ${c[2]} 70%)`,
          border: `0.5cqw solid ${c[3]}`,
          boxShadow: `0.5cqw 0.5cqw 0 ${c[0]}88`,
          animation: A('ff-zoom-slow', '3s', 'ease-out', '0s', '3 alternate'),
        }}
      />
      <div
        className="absolute right-[12%] top-[18%] font-black italic"
        style={{
          color: c[3],
          fontSize: '7cqw',
          textShadow: `0.3cqw 0.3cqw 0 ${c[0]}`,
          transform: 'rotate(-6deg)',
          animation: A('ff-jitter', '0.5s', 'linear'),
        }}
      >
        {name.slice(0, 4)}
      </div>
    </>
  )
}

function TacticsScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c[0]}, ${c[0]}cc)` }} />
      <div className="absolute inset-0 opacity-40" style={{ border: `0.4cqw solid ${c[2]}66`, margin: '6cqw', borderRadius: '0.6cqw' }} />
      <div className="absolute left-1/2 top-[6%] bottom-[6%] w-[0.3cqw] -translate-x-1/2" style={{ background: `${c[2]}66` }} />
      <div className="absolute left-[6%] right-[6%] top-1/2 h-[0.3cqw]" style={{ background: `${c[2]}66` }} />
      <div className="absolute left-[6%] top-1/2 size-[24cqw] -translate-y-1/2 rounded-[50%] border" style={{ borderColor: `${c[2]}66` }} />
      {[
        { l: 26, t: 22 }, { l: 34, t: 58 }, { l: 58, t: 34 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute flex size-[5cqw] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[50%] font-black"
          style={{ left: `${p.l}%`, top: `${p.t}%`, background: c[2], color: c[0], fontSize: '3cqw', animation: A('ff-pulse-soft', '2.4s', 'ease-in-out', `${i * 0.4}s`) }}
        >
          X
        </div>
      ))}
      {[
        { l: 70, t: 20 }, { l: 78, t: 60 },
      ].map((p, i) => (
        <div
          key={`o${i}`}
          className="absolute size-[5cqw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[0.5cqw]"
          style={{ left: `${p.l}%`, top: `${p.t}%`, borderColor: c[3], animation: A('ff-pulse-soft', '2.8s', 'ease-in-out', `${i * 0.5}s`) }}
        />
      ))}
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <path
          d="M30 22 C 40 12 52 20 58 34"
          fill="none"
          stroke={c[1]}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="4 3"
          style={{ animation: A('ff-dash-draw', '2.6s', 'linear'), ['--dash' as string]: '70' } as React.CSSProperties}
        />
        <path d="M58 34 l -4 -2 M58 34 l -1 -4.4" fill="none" stroke={c[1]} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-[2%] left-[8%] font-mono" style={{ color: c[1], fontSize: '3.2cqw' }}>
        {name.slice(0, 5)}
      </div>
    </>
  )
}

function EditorialScene({ c, name }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: c[0] }} />
      <div className="absolute left-[8%] right-[8%] top-[12%]">
        <div className="h-[0.4cqw] w-full" style={{ background: c[1] }} />
        <div className="mt-[1.4cqw] font-serif font-black leading-none" style={{ color: c[1], fontSize: '9.5cqw', animation: A('ff-appear-up', '1.2s', 'ease-out', '0.1s', '1 both') }}>
          {name.slice(0, 5)}
        </div>
        <div className="mt-[1cqw] flex items-center gap-[1.4cqw] font-mono" style={{ color: c[3], fontSize: '3cqw' }}>
          <span>VOL.369</span>
          <span className="h-[0.2cqw] flex-1" style={{ background: `${c[3]}55` }} />
          <span>ISSUE 15</span>
        </div>
        <div className="mt-[1.8cqw] flex gap-[3cqw]">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex-1 space-y-[0.9cqw]">
              {Array.from({ length: col === 0 ? 5 : 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[0.8cqw] rounded-full"
                  style={{
                    width: `${68 + ((i * 13 + col * 29) % 30)}%`,
                    background: c[3],
                    opacity: 0.45,
                    animation: A('ff-appear', '0.8s', 'ease-out', `${0.4 + col * 0.3 + i * 0.08}s`, '1 both'),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="absolute -left-[1%] top-[4%] font-serif text-[14cqw] font-black leading-none" style={{ color: `${c[2]}22` }}>
          {name.slice(0, 1)}
        </div>
      </div>
    </>
  )
}

/* ============================ 渲染分发 ============================ */

const MOTIF_COMPONENTS: Record<MotifKey, React.ComponentType<SceneProps>> = {
  matrix: MatrixScene,
  cursorType: CursorTypeScene,
  bigType: BigTypeScene,
  typeTunnel: TypeTunnelScene,
  scatter: ScatterScene,
  kineticBlocks: KineticBlocksScene,
  splitFlap: SplitFlapScene,
  neonSign: NeonSignScene,
  ticker: TickerScene,
  thermal: ThermalScene,
  uiMorph: UiMorphScene,
  holoHud: HoloHudScene,
  vhs: VhsScene,
  glitch: GlitchScene,
  flowLines: FlowLinesScene,
  fireflies: FirefliesScene,
  particleShape: ParticleShapeScene,
  constellation: ConstellationScene,
  breathing: BreathingScene,
  contour: ContourScene,
  ripple: RippleScene,
  rainGlass: RainGlassScene,
  dawnSky: DawnSkyScene,
  snowEmber: SnowEmberScene,
  sandFall: SandFallScene,
  aurora: AuroraScene,
  inkBloom: InkBloomScene,
  inkMountain: InkMountainScene,
  oneStroke: OneStrokeScene,
  watercolor: WatercolorScene,
  impasto: ImpastoScene,
  crayon: CrayonScene,
  gongbi: GongbiScene,
  porcelain: PorcelainScene,
  shadowPlay: ShadowPlayScene,
  stainedGlass: StainedGlassScene,
  ukiyoe: UkiyoeScene,
  operaMask: OperaMaskScene,
  dunhuang: DunhuangScene,
  bauhaus: BauhausScene,
  lowPoly: LowPolyScene,
  isoBlocks: IsoBlocksScene,
  chartGrow: ChartGrowScene,
  network: NetworkScene,
  timeline: TimelineScene,
  splitCompare: SplitCompareScene,
  mosaicTiles: MosaicTilesScene,
  metroMap: MetroMapScene,
  satelliteMap: SatelliteMapScene,
  blueprint: BlueprintScene,
  pixelSprite: PixelSpriteScene,
  rpgDialog: RpgDialogScene,
  paperCut: PaperCutScene,
  sticky: StickyScene,
  whiteboard: WhiteboardScene,
  sketchy: SketchyScene,
  doodle: DoodleScene,
  engraving: EngravingScene,
  halftonePop: HalftonePopScene,
  comicBurst: ComicBurstScene,
  clayBlob: ClayBlobScene,
  glassShapes: GlassShapesScene,
  liquid: LiquidScene,
  legoBricks: LegoBricksScene,
  popUpBook: PopUpBookScene,
  flatScene: FlatSceneScene,
  assemblySteps: AssemblyStepsScene,
  detectiveBoard: DetectiveBoardScene,
  galleryWall: GalleryWallScene,
  karaoke: KaraokeScene,
  beatBars: BeatBarsScene,
  filmGrain: FilmGrainScene,
  spyFilm: SpyFilmScene,
  sunburst: SunburstScene,
  constructivism: ConstructivismScene,
  rubberHose: RubberHoseScene,
  celSpeed: CelSpeedScene,
  tactics: TacticsScene,
  editorial: EditorialScene,
}

export function StylePreview({
  style,
  className,
  rounded = 'rounded-xl',
}: {
  style: StyleItem
  className?: string
  rounded?: string
}) {
  const { motif, colors, label } = resolvePreview(style)
  const Motif = MOTIF_COMPONENTS[motif] ?? MOTIF_COMPONENTS.bauhaus
  return (
    <div
      className={cn('ff-scene', rounded, className)}
      style={{ background: colors[0], containerType: 'inline-size' }}
      role="img"
      aria-label={`${style.name} 风格动画小样`}
    >
      <Motif c={colors} name={style.name} />
    </div>
  )
}
