'use client'

/** 动效库卡片上的实时 CSS 演示（按 demo key 渲染） */
export function EffectDemo({ demo }: { demo: string }) {
  switch (demo) {
    case 'zoom':
      return (
        <div className="size-16 rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-700 to-zinc-800 demo-zoom">
          <div className="flex h-full items-center justify-center text-[10px] font-mono text-zinc-300">
            SCALE
          </div>
        </div>
      )

    case 'punch':
      return (
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 demo-punch" />
        </div>
      )

    case 'orbit':
      return (
        <div className="demo-orbit">
          <div className="demo-orbit-core" />
          <div className="demo-orbit-dot" />
        </div>
      )

    case 'parallax':
      return (
        <div className="flex items-center gap-2.5">
          <div className="demo-pl-layer demo-pl-3 w-10 bg-zinc-800" />
          <div className="demo-pl-layer demo-pl-2 w-14 bg-zinc-700" />
          <div className="demo-pl-layer demo-pl-1 w-20 bg-gradient-to-br from-amber-500/80 to-orange-600/80" />
          <div className="demo-pl-layer demo-pl-2 w-14 bg-zinc-700" />
          <div className="demo-pl-layer demo-pl-3 w-10 bg-zinc-800" />
        </div>
      )

    case 'shake':
      return (
        <div className="size-16 rounded-xl border border-zinc-700 bg-zinc-800 p-2.5 demo-shake">
          <div className="h-2 w-8 rounded bg-amber-500/70" />
          <div className="mt-2 h-2 w-12 rounded bg-zinc-600" />
          <div className="mt-2 h-2 w-6 rounded bg-zinc-600" />
        </div>
      )

    case 'morph':
      return (
        <div className="size-16 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 demo-morph" />
      )

    case 'glitch':
      return (
        <div className="demo-glitch" data-text="GLITCH">
          GLITCH
        </div>
      )

    case 'wipe':
      return (
        <div className="relative h-14 w-36 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
          <div className="demo-wipe absolute inset-0 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-600">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-950">WIPE</span>
          </div>
        </div>
      )

    case 'flash':
      return (
        <div className="relative h-14 w-36 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-zinc-400">
            NEXT SCENE
          </div>
          <div className="demo-flash absolute inset-0 bg-white" />
        </div>
      )

    case 'typewriter':
      return (
        <div className="flex items-center">
          <span className="demo-type">TYPEWRITER</span>
          <span className="demo-caret" />
        </div>
      )

    case 'bounce':
      return (
        <div className="flex items-end gap-2.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="demo-bounce-dot size-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )

    case 'stroke':
      return (
        <svg viewBox="0 0 120 60" className="h-14 w-28" aria-hidden="true">
          <path
            d="M10 40 Q 35 8 60 40 T 110 40"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            className="demo-stroke-path"
          />
        </svg>
      )

    case 'highlight':
      return <div className="demo-highlight">重点文案高亮</div>

    case 'flip':
      return (
        <div className="demo-flip-wrap">
          <div className="demo-flip flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 font-mono text-sm font-bold text-zinc-950">
            3D
          </div>
        </div>
      )

    case 'pulse':
      return (
        <div className="relative flex size-24 items-center justify-center">
          <div className="demo-pulse-ring absolute inset-0 rounded-full border-2 border-amber-500/70" />
          <div
            className="demo-pulse-ring absolute inset-0 rounded-full border-2 border-orange-500/50"
            style={{ animationDelay: '1s' }}
          />
          <div className="demo-pulse-core size-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600" />
        </div>
      )

    case 'particles':
      return (
        <div className="relative h-24 w-40">
          {[
            { left: '12%', dur: '2.8s', delay: '0s', size: 6 },
            { left: '28%', dur: '3.4s', delay: '0.8s', size: 4 },
            { left: '45%', dur: '2.6s', delay: '1.6s', size: 7 },
            { left: '62%', dur: '3.8s', delay: '0.4s', size: 4 },
            { left: '78%', dur: '3s', delay: '1.2s', size: 6 },
            { left: '90%', dur: '3.6s', delay: '2s', size: 4 },
          ].map((p, i) => (
            <div
              key={i}
              className="demo-particle absolute bottom-2 rounded-full bg-amber-400/90"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: p.dur,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      )

    case 'trail':
      return (
        <div className="relative flex h-16 w-40 items-center">
          <div
            className="demo-trail absolute size-8 rounded-full bg-amber-500/20"
            style={{ animationDelay: '0.12s' }}
          />
          <div
            className="demo-trail absolute size-8 rounded-full bg-amber-500/45"
            style={{ animationDelay: '0.06s' }}
          />
          <div className="demo-trail absolute size-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600" />
        </div>
      )

    default:
      return (
        <div className="size-14 rounded-lg border border-dashed border-zinc-700 bg-zinc-800/60" />
      )
  }
}
