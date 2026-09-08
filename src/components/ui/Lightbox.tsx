import { useCallback, useEffect } from 'react'

export interface LightboxItem {
  src: string
  alt: string
  title?: string
  meta?: string
}

interface LightboxProps {
  items: LightboxItem[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}

/** Full-screen image viewer with prev/next, a counter and a caption. */
export function Lightbox({ items, index, onClose, onIndex }: LightboxProps) {
  const open = index !== null
  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return
      onIndex((index + dir + items.length) % items.length)
    },
    [index, items.length, onIndex],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, go, onClose])

  if (index === null) return null
  const item = items[index]

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item.title ?? item.alt}
      onClick={onClose}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-orange tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-9 w-9 place-items-center border border-white/20 text-paper transition-colors hover:border-orange hover:text-orange"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2 14 14M14 2 2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* stage */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 text-paper transition-colors hover:border-orange hover:text-orange sm:left-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <figure className="max-h-full">
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className="mx-auto max-h-[74vh] w-auto max-w-full border border-white/10 object-contain"
          />
          <figcaption className="mt-3 text-center">
            {item.title && <span className="font-display text-base text-paper">{item.title}</span>}
            {item.meta && (
              <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                {item.meta}
              </span>
            )}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 text-paper transition-colors hover:border-orange hover:text-orange sm:right-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5 16 12l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
