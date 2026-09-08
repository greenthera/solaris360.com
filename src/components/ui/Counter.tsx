import { useCountUp } from '../../hooks/useCountUp'

interface CounterProps {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** pad integer part, e.g. pad={2} renders 05 */
  pad?: number
  className?: string
}

export function Counter({ to, decimals = 0, prefix, suffix, pad, className }: CounterProps) {
  const [value, ref] = useCountUp(to, { decimals })
  let text = decimals ? value.toFixed(decimals) : String(Math.round(value))
  if (pad) {
    const [int, frac] = text.split('.')
    text = int.padStart(pad, '0') + (frac ? `.${frac}` : '')
  }
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={['tnum', className].filter(Boolean).join(' ')}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}
