import { useId, useState } from 'react'
import type { RoiResult } from '../../lib/roi'

/** SVG stays crisp on mobile and exposes the same values to mouse, touch and keyboard. */
export function RoiChart({ result, cost, money, yearLabel, breakEvenLabel }: {
  result: RoiResult; cost: number; money: (n: number) => string; yearLabel: string; breakEvenLabel: string
}) {
  const gradient = useId().replace(/:/g, '')
  const [active, setActive] = useState<number | null>(null)
  const W = 760, H = 370, left = 88, right = 20, top = 25, bottom = 48
  const low = Math.min(0, ...result.rows.map(r => r.netPosition), -cost)
  const high = Math.max(1, ...result.rows.map(r => r.netPosition))
  const span = high - low
  const x = (i: number) => left + i / (result.rows.length - 1) * (W - left - right)
  const y = (v: number) => top + (high - v) / span * (H - top - bottom)
  const points = result.rows.map((r, i) => `${x(i)},${y(r.netPosition)}`).join(' ')
  // Keep axis labels evenly spaced; amounts appear only in the hover tooltip.
  const tickCount = Math.min(6, result.rows.length)
  const ticks = new Set(Array.from({ length: tickCount }, (_, i) =>
    Math.round(i / (tickCount - 1) * (result.rows.length - 1)),
  ))
  const activeRow = active === null ? null : result.rows[active]
  const tooltipText = activeRow ? `${money(Math.abs(activeRow.netPosition))} (${activeRow.netPosition >= 0 ? 'profit' : 'recovering'})` : ''
  const tooltipW = Math.max(150, tooltipText.length * 7 + 38)
  const tooltipX = active === null ? 0 : Math.max(left, Math.min(W - right - tooltipW, x(active) + 12))
  const tooltipY = activeRow ? Math.max(4, y(activeRow.netPosition) - 70) : 0
  return <div className="roi-chart">
    {result.breakEvenYear && <p className="roi-break-even">{breakEvenLabel.replace('{year}', String(result.breakEvenYear))}</p>}
    <div className="roi-chart-scroll" tabIndex={0} role="region" aria-label="Savings chart; scroll to explore all years"><svg viewBox={`0 0 ${W} ${H}`}
      onPointerMove={event => {
        if (event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        const px = (event.clientX - bounds.left) / bounds.width * W
        const py = (event.clientY - bounds.top) / bounds.height * H
        setActive(px >= left - 1 && px <= W - right + 1 && py >= top - 1 && py <= H - bottom + 1
          ? Math.round((px - left) / (W - left - right) * (result.rows.length - 1)) : null)
      }} onPointerLeave={() => setActive(null)} role="group" aria-label="Net position over the system lifetime">
      <defs><linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1"><stop stopColor="var(--roi-primary)" stopOpacity=".35"/><stop offset="1" stopColor="var(--roi-primary)" stopOpacity=".02"/></linearGradient></defs>
      {Array.from({ length: 6 }, (_, i) => {
        const v = low + span * i / 5
        return <g key={i}><line x1={left} x2={W - right} y1={y(v)} y2={y(v)} stroke="#e8edf5"/><text x={left - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#64748b">{money(v)}</text></g>
      })}
      <polygon points={`${x(0)},${y(0)} ${points} ${x(result.rows.length - 1)},${y(0)}`} fill={`url(#${gradient})`} />
      <line x1={left} x2={W - right} y1={y(0)} y2={y(0)} stroke="#94a3b8" strokeDasharray="6 4"/>
      <polyline points={points} stroke="var(--roi-primary)" strokeWidth="2.5" fill="none"/>
      {result.rows.map((r, i) => <g key={r.year}>
        {ticks.has(i) && <text x={x(i)} y={H - 23} textAnchor="middle" fontSize="11" fill="#64748b">{yearLabel} {r.year}</text>}
        <circle cx={x(i)} cy={y(r.netPosition)} r={r.year === result.breakEvenYear || active === i ? 6 : 3.5} fill={r.netPosition >= 0 ? 'var(--roi-secondary)' : '#ef4444'} stroke="var(--roi-primary)" strokeWidth="2"/>
        <circle cx={x(i)} cy={y(r.netPosition)} r="12" fill="transparent" tabIndex={0} role="img" aria-label={`${yearLabel} ${r.year}: ${money(r.netPosition)}`}
          onPointerEnter={event => { if (event.pointerType !== 'touch') setActive(i) }} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(active === i ? null : i)} />
      </g>)}
      {activeRow && <g className="roi-chart-tooltip" role="tooltip">
        <rect x={tooltipX} y={tooltipY} width={tooltipW} height="60" rx="8" fill="#1e293b" />
        <text x={tooltipX + 12} y={tooltipY + 21} fontSize="12" fontWeight="600" fill="#f8fafc">{yearLabel} {activeRow.year}</text>
        <rect x={tooltipX + 12} y={tooltipY + 34} width="9" height="9" fill="var(--roi-primary)" />
        <text x={tooltipX + 28} y={tooltipY + 43} fontSize="12" fill="#cbd5e1">{tooltipText}</text>
      </g>}
    </svg></div>
    <p className="sr-only" aria-live="polite">{activeRow ? `${yearLabel} ${activeRow.year}: ${money(activeRow.netPosition)}` : '\u00a0'}</p>
  </div>
}
