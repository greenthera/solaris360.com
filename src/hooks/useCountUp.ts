import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface Options {
  duration?: number
  decimals?: number
}

/**
 * Counts from 0 to `end` when scrolled into view. SSR / reduced-motion / failure
 * all resolve to `end` - the number is never left stuck low.
 * Returns [displayValue, ref].
 */
export function useCountUp(
  end: number,
  { duration = 900, decimals = 0 }: Options = {},
): [number, React.RefObject<HTMLElement | null>] {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(end)
  const ref = useRef<HTMLElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (reduced || started.current) return
    const node = ref.current
    if (!node) return

    const run = () => {
      if (started.current) return
      started.current = true
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(Math.max((now - t0) / duration, 0), 1)
        const eased = 1 - Math.pow(1 - p, 3)
        const v = eased * end
        setValue(decimals ? Number(v.toFixed(decimals)) : Math.round(v))
        if (p < 1) requestAnimationFrame(tick)
        else setValue(end)
      }
      setValue(0)
      requestAnimationFrame(tick)
      // failsafe: if rAF never advances (throttled tab), land on the real number
      window.setTimeout(() => setValue(end), duration + 400)
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [end, duration, decimals, reduced])

  return [value, ref]
}
