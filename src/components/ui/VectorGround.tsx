type Variant = 'wire' | 'mesh' | 'contour'

/**
 * Decorative background layer. Always aria-hidden and non-interactive.
 * Pure CSS/SVG - no scroll listeners.
 */
export function VectorGround({
  variant,
  className,
}: {
  variant: Variant
  parallax?: boolean
  className?: string
}) {
  if (variant === 'contour') {
    return (
      <div
        aria-hidden="true"
        className={['pointer-events-none absolute inset-0 overflow-hidden', className].filter(Boolean).join(' ')}
      >
        <svg className="h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M -50 ${140 + i * 90} Q 400 ${20 + i * 90} 700 ${180 + i * 70} T 1250 ${120 + i * 80}`}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none absolute inset-0',
        variant === 'wire' ? 'vg-wire opacity-60' : 'vg-mesh',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
