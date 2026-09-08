import { useEffect, useState } from 'react'
import { inrPlain } from '../../lib/format'

/**
 * Illustrative "live" generation tiles for the hero - seeded plausible values
 * with small increments so the hero feels alive. Explicitly labelled as an
 * example, not real telemetry. Frozen under reduced motion.
 */
export function LiveMeter() {
  const [gen, setGen] = useState(18.4)
  const [saved, setSaved] = useState(2147)
  const [co2, setCo2] = useState(4.7)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setGen((g) => g + Math.random() * 0.05)
      setSaved((s) => s + Math.round(Math.random() * 3))
      setCo2((c) => c + Math.random() * 0.002)
    }, 1400)
    return () => clearInterval(id)
  }, [])

  const tiles = [
    { v: gen.toFixed(1), label: 'kWh generated today' },
    { v: inrPlain(saved), label: '₹ saved this month' },
    { v: co2.toFixed(2), label: 't CO₂ avoided this year' },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <div
            key={i}
            className="flex items-baseline gap-3 border border-white/10 bg-white/[0.04] p-3 sm:block sm:p-4"
          >
            <div
              className={`font-mono tabular-nums ${i === 0 ? 'text-orange' : 'text-paper'} text-xl sm:text-2xl`}
            >
              {t.v}
            </div>
            <div className="text-[0.7rem] leading-tight text-muted sm:mt-1 sm:text-xs">{t.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted/70">
        Illustrative - example figures, not a live plant
      </p>
    </div>
  )
}
