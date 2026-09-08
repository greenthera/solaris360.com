import type { AmortRow } from '../../lib/emi'
import { inr } from '../../lib/format'

/** Inline SVG area chart of the outstanding balance, with labelled axes. */
export function BalanceChart({ rows }: { rows: AmortRow[] }) {
  if (rows.length < 2) return null

  const W = 680
  const H = 260
  const pad = { l: 74, r: 16, t: 14, b: 34 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b

  const n = rows.length
  const maxBal = Math.max(...rows.map((r) => r.opening))
  // round the axis top up to a clean number
  const step = niceStep(maxBal / 4)
  const top = step * Math.ceil(maxBal / step)

  const x = (i: number) => pad.l + (i / (n - 1)) * iw
  const y = (v: number) => pad.t + (1 - v / top) * ih

  const line = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(r.opening).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${x(n - 1).toFixed(1)} ${y(0).toFixed(1)} L${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`

  const yTicks = Array.from({ length: 5 }, (_, k) => (top / 4) * k)
  // ~6 evenly spaced month labels, always including first and last
  const xCount = Math.min(6, n)
  const xTicks = Array.from({ length: xCount }, (_, k) =>
    Math.round((k / (xCount - 1)) * (n - 1)),
  ).filter((v, idx, a) => a.indexOf(v) === idx)

  return (
    <figure className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[520px]"
        role="img"
        aria-label="Outstanding loan balance for each month of the term"
      >
        <defs>
          <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3a02e" stopOpacity="0.32" />
            <stop offset="1" stopColor="#f3a02e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* y gridlines + value labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={pad.l}
              y1={y(v)}
              x2={W - pad.r}
              y2={y(v)}
              stroke="#17163f"
              strokeOpacity={v === 0 ? 0.35 : 0.12}
            />
            <text
              x={pad.l - 8}
              y={y(v) + 3}
              fontSize="10"
              fill="#777476"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              {inr(v)}
            </text>
          </g>
        ))}

        {/* x ticks + month labels */}
        {xTicks.map((i) => (
          <g key={i}>
            <line
              x1={x(i)}
              y1={y(0)}
              x2={x(i)}
              y2={y(0) + 4}
              stroke="#777476"
              strokeOpacity="0.5"
            />
            <text
              x={x(i)}
              y={H - 18}
              fontSize="10"
              fill="#777476"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              M{rows[i].month}
            </text>
          </g>
        ))}
        <text
          x={pad.l + iw / 2}
          y={H - 4}
          fontSize="9"
          fill="#777476"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
        >
          MONTH OF TERM
        </text>

        {/* series */}
        <path d={area} fill="url(#bal)" />
        <path d={line} fill="none" stroke="#f3a02e" strokeWidth="2" />

        {/* value callouts at each x tick */}
        {xTicks.map((i) => (
          <g key={`p${i}`}>
            <circle cx={x(i)} cy={y(rows[i].opening)} r="3" fill="#17163f" />
            <text
              x={x(i)}
              y={y(rows[i].opening) - 8}
              fontSize="9.5"
              fill="#17163f"
              textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
              fontFamily="var(--font-mono)"
            >
              {inr(rows[i].opening)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-xs text-ash">
        Outstanding balance at the start of each month. Axis on the left is the amount still owed.
      </figcaption>
    </figure>
  )
}

/** Nearest 1 / 2 / 5 × 10ⁿ at or above `v` — for clean axis steps. */
function niceStep(v: number): number {
  if (v <= 0) return 1
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / mag
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nice * mag
}
