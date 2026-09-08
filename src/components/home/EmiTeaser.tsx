import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'
import { simpleEmi } from '../../lib/emi'
import { inr } from '../../lib/format'

export function EmiTeaser() {
  const [price, setPrice] = useState(400000)
  const [months, setMonths] = useState(60)
  const { monthlyEmi } = useMemo(() => simpleEmi({ price, months }), [price, months])

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">Financing</p>
        <h2 className="mt-3 text-2xl md:text-4xl">What will it cost per month?</h2>
        <p className="mt-4 max-w-sm text-muted">
          Slide to estimate. The full calculator adds reducing-balance interest, processing fee, GST,
          the PM Surya Ghar subsidy and a month-by-month schedule.
        </p>
        <Link to="/emi-calculator/" className="btn btn-ghost mt-6">
          Open the full calculator
        </Link>
      </Reveal>

      <Reveal className="kw-card">
        <label className="block text-sm">
          <span className="mb-1 flex justify-between text-muted">
            <span>System price</span>
            <span className="font-mono text-paper">{inr(price)}</span>
          </span>
          <input
            type="range"
            min={150000}
            max={1500000}
            step={10000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-orange"
            aria-label="System price"
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="mb-1 flex justify-between text-muted">
            <span>Tenure</span>
            <span className="font-mono text-paper">{months} months</span>
          </span>
          <input
            type="range"
            min={12}
            max={84}
            step={6}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-orange"
            aria-label="Tenure in months"
          />
        </label>
        <p className="mt-5 border-t border-white/10 pt-4 font-mono text-lg">
          EMI approx <span className="text-orange">{inr(monthlyEmi)}</span>
          <span className="text-muted"> / month</span>
        </p>
      </Reveal>
    </div>
  )
}
