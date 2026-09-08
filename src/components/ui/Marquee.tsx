import { type ReactNode } from 'react'

interface MarqueeProps {
  items: ReactNode[]
  reverse?: boolean
  className?: string
  'aria-label'?: string
}

/**
 * Infinite horizontal ticker (axenr-style). The track holds the items twice so
 * translateX(-50%) loops seamlessly. Pauses on hover/focus; frozen under
 * reduced motion via the global media query.
 */
export function Marquee({ items, reverse = false, className, ...rest }: MarqueeProps) {
  const track = [...items, ...items]
  return (
    <div
      className={[
        'group relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <div
        className={`flex w-max items-center gap-0 pl-7 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none ${
          reverse ? 'animate-marquee-rev' : 'animate-marquee'
        }`}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="flex flex-shrink-0 items-center whitespace-nowrap px-7 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted"
          >
            {item}
            <span className="ml-7 h-1 w-1 rounded-full bg-orange/60" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  )
}
