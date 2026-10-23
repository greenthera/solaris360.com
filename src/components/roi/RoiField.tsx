import { useId } from 'react'

export function RoiField({ label, value, onChange, min = 0, max = 1e12, step = 1, prefix, suffix, hint, integer = false }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
  step?: number; prefix?: string; suffix?: string; hint?: string; integer?: boolean
}) {
  const id = useId()
  const invalid = !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))
  return <div className="roi-field">
    <div className="roi-field-label"><label htmlFor={id}>{label}</label> {hint && <span className="roi-hint" tabIndex={0} aria-label={hint}>ⓘ<span role="tooltip">{hint}</span></span>}</div>
    <div className="roi-input-wrap">
      {prefix && <span className="roi-prefix">{prefix}</span>}
      <input id={id} type="number" inputMode="decimal" min={min} max={max} step={step}
        value={Number.isFinite(value) ? value : ''} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined}
        style={{ paddingInlineStart: prefix ? `${Math.max(32, prefix.length * 9 + 16)}px` : undefined, paddingInlineEnd: suffix ? `${Math.max(48, suffix.length * 7 + 16)}px` : undefined }}
        onChange={e => onChange(e.target.value === '' ? NaN : Number(e.target.value))} />
      {suffix && <span className="roi-suffix">{suffix}</span>}
    </div>
    {invalid && <p id={`${id}-error`} className="roi-error">Enter {integer ? 'a whole number' : 'a number'} from {min} to {max}.</p>}
  </div>
}
