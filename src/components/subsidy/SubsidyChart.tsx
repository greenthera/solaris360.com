import { useState } from 'react'
import { inr } from '../../lib/format'
import type { SubsidyResult } from '../../lib/subsidy'

/** SVG segments expose amounts to mouse, touch and keyboard without a chart dependency. */
export function SubsidyChart({ result }: { result: SubsidyResult }) {
  const [active, setActive] = useState<string | null>(null)
  const segments = [
    { label: 'Central subsidy', amount: result.central, color: '#17163f' },
    { label: 'Gujarat subsidy', amount: result.state, color: '#f3a02e' },
    { label: 'You pay', amount: result.youPay, color: '#777476' },
  ]
  const total = segments.reduce((sum, s) => sum + s.amount, 0)
  let offset = 0
  const selected = segments.find(s => s.label === active)
  return <figure className="subsidy-chart">
    <svg viewBox="0 0 240 240" role="group" aria-label={`Funding breakdown: ${segments.map(s => `${s.label} ${inr(s.amount)}`).join(', ')}`}>
      <circle cx="120" cy="120" r="82" fill="none" stroke="#eeeef2" strokeWidth="28"/>
      {segments.filter(s => s.amount > 0).map(s => {
        const share = s.amount / total * 100, start = offset
        offset += share
        return <circle key={s.label} cx="120" cy="120" r="82" fill="none" stroke={s.color} strokeWidth={active === s.label ? 33 : 28}
          pathLength="100" strokeDasharray={`${share} ${100 - share}`} strokeDashoffset={-start} transform="rotate(-90 120 120)"
          role="img" aria-label={`${s.label}: ${inr(s.amount)}`} tabIndex={0}
          onMouseEnter={() => setActive(s.label)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(s.label)} onBlur={() => setActive(null)} onClick={() => setActive(active === s.label ? null : s.label)}/>
      })}
      <text x="120" y="113" textAnchor="middle" fontSize="12" fill="#777476">Total subsidy</text>
      <text x="120" y="139" textAnchor="middle" fontSize="20" fontWeight="700" fill="#17163f">{inr(result.totalSubsidy)}</text>
    </svg>
    <figcaption>
      <div className="subsidy-chart-legend">{segments.map(s => <button key={s.label} type="button" onFocus={() => setActive(s.label)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(s.label)} onMouseLeave={() => setActive(null)} onClick={() => setActive(active === s.label ? null : s.label)} aria-label={`${s.label}: ${inr(s.amount)}`}><span style={{ background: s.color }}/>{s.label}</button>)}</div>
      <p className="subsidy-chart-readout" aria-live="polite">{selected ? `${selected.label}: ${inr(selected.amount)}` : 'Hover, tap or focus a segment to see its amount.'}</p>
    </figcaption>
  </figure>
}
