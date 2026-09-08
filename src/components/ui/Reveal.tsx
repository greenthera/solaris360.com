import { type ElementType, type ReactNode } from 'react'

interface RevealProps {
  as?: ElementType
  /** stagger the wrapper's direct children instead of the wrapper itself */
  stagger?: boolean
  className?: string
  children: ReactNode
  id?: string
}

/**
 * Scroll-reveal wrapper. Renders visible; `lib/reveal.ts` hides + reveals it on
 * scroll only when motion is allowed. `contents` on the className makes the
 * wrapper lay its children out in the parent grid while still staggering them.
 */
export function Reveal({ as, stagger = false, className, children, id }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      id={id}
      className={['reveal', className].filter(Boolean).join(' ')}
      {...(stagger ? { 'data-stagger': '' } : {})}
    >
      {children}
    </Tag>
  )
}
