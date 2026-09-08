import { useId } from 'react'

interface FieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  /** format the numeric readout (e.g. ₹) */
  format?: (v: number) => string
  suffix?: string
}

/** Slider + number input pair, on a light ground (calculator body). */
export function Field({ label, value, onChange, min, max, step, format, suffix }: FieldProps) {
  const id = useId()
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className="min-w-0 flex-1 text-sm font-500 text-navy">
          {label}
        </label>
        <div className="flex flex-shrink-0 items-center gap-1">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
            className="w-24 border border-navy/20 bg-white px-2 py-1 text-right font-mono text-sm tabular-nums text-navy focus-visible:outline-orange sm:w-28"
          />
          {suffix && <span className="font-mono text-xs text-ash">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-orange"
      />
      {format && <p className="mt-1 font-mono text-xs text-ash">{format(value)}</p>}
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min
  return Math.min(Math.max(n, min), max)
}
