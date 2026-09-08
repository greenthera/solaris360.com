import { useEffect, useRef, useId, useState, type ReactNode } from 'react'

export interface AccordionItem {
  q: ReactNode
  a: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  /** index open by default; null = all closed */
  defaultOpen?: number | null
  className?: string
  /** stagger each row in on scroll-reveal (home page only) */
  reveal?: boolean
}

export function Accordion({ items, defaultOpen = 0, className, reveal = false }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!reveal || open === null) return
    let disposed = false
    let cleanup: (() => void) | undefined
    import('gsap').then(({ gsap }) => {
      if (disposed || !root.current) return
      const panel = root.current.querySelector<HTMLElement>('[role="region"]:not([hidden])')
      if (!panel) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(panel, { height: 0, opacity: 0, y: 8, overflow: 'hidden' },
          { height: 'auto', opacity: 1, y: 0, duration: .6, ease: 'power3.out', clearProps: 'height,opacity,transform,overflow' })
      }, root.current)
      cleanup = () => mm.revert()
    })
    return () => { disposed = true; cleanup?.() }
  }, [open, reveal])

  return (
    <div
      ref={root}
      className={[
        'divide-y divide-white/10 border-y border-white/10',
        reveal ? 'reveal' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...(reveal ? { 'data-stagger': '' } : {})}
    >
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${baseId}-b-${i}`
        const panelId = `${baseId}-p-${i}`
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-base font-600 text-paper"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`grid h-6 w-6 flex-shrink-0 place-items-center border border-orange/50 text-orange transition-transform ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="max-w-3xl pb-5 pr-10 text-sm leading-relaxed text-muted"
            >
              {item.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
