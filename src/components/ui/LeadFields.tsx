import { useId } from 'react'
import type { LeadContact, LeadErrors } from '../../lib/leads'

interface LeadFieldsProps {
  value: LeadContact
  onChange: (v: LeadContact) => void
  errors?: LeadErrors
  /** light = on a white card (EMI calculator), dark = on navy/ink (Contact page) */
  tone?: 'light' | 'dark'
  emailRequired?: boolean
  /** wrapper layout - stacked by default; pass a grid for side-by-side fields */
  className?: string
}

/** Shared name / phone / email fields for every lead form (see lib/leads.ts). */
export function LeadFields({
  value,
  onChange,
  errors = {},
  tone = 'light',
  emailRequired = false,
  className = 'space-y-4',
}: LeadFieldsProps) {
  const id = useId()
  const label = tone === 'light' ? 'text-navy' : 'text-muted'
  // error red: the theme's --color-bad is too light for small text on white
  const errText = tone === 'light' ? 'text-[#b42318]' : 'text-bad'
  const input =
    tone === 'light'
      ? 'border-navy/20 bg-white text-navy aria-[invalid=true]:border-[#b42318]'
      : 'border-white/15 bg-ink text-paper aria-[invalid=true]:border-bad'

  const fields: {
    key: keyof LeadContact
    label: string
    required: boolean
    type: string
    autoComplete: string
    inputMode?: 'tel' | 'email'
  }[] = [
    { key: 'name', label: 'Name', required: true, type: 'text', autoComplete: 'name' },
    { key: 'phone', label: 'Phone', required: true, type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
    { key: 'email', label: 'Email', required: emailRequired, type: 'email', autoComplete: 'email', inputMode: 'email' },
  ]

  return (
    <div className={className}>
      {fields.map((f) => {
        const err = errors[f.key]
        const inputId = `${id}-${f.key}`
        return (
          <div key={f.key}>
            <label htmlFor={inputId} className={`mb-1 block text-sm font-500 ${label}`}>
              {f.label}
              {f.required ? (
                <span className="text-orange" aria-hidden="true">
                  {' '}
                  *
                </span>
              ) : (
                <span className="font-400 text-ash"> (optional)</span>
              )}
            </label>
            <input
              id={inputId}
              type={f.type}
              inputMode={f.inputMode}
              autoComplete={f.autoComplete}
              required={f.required}
              aria-invalid={err ? true : undefined}
              aria-describedby={err ? `${inputId}-err` : undefined}
              value={value[f.key]}
              onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
              className={`w-full border px-3 py-2 text-sm ${input}`}
            />
            {err && (
              <p id={`${inputId}-err`} className={`mt-1 text-xs ${errText}`}>
                {err}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
