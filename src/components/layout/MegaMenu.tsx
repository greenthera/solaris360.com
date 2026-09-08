import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { nav, type NavGroup } from '../../content/nav'

function Panel({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
  if (!group.columns.length) return null
  return (
    <div className="absolute left-0 top-full z-40 flex gap-2 border border-white/10 bg-navy p-2 shadow-2xl">
      {group.columns.map((col, ci) => (
        <div key={ci} className="min-w-[11rem]">
          {col.heading && (
            <p className="px-3 pb-1 pt-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              {col.heading}
            </p>
          )}
          {col.links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onNavigate}
              className="block rounded-xs px-3 py-2 text-sm text-paper/90 transition-colors hover:bg-panel hover:text-paper"
            >
              {l.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

export function DesktopNav() {
  const [open, setOpen] = useState<string | null>(null)
  const ref = useRef<HTMLUListElement>(null)
  const { pathname } = useLocation()

  // Close on navigation, Escape, and outside interaction.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(null), [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <ul ref={ref} className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpen(null)}>
      {nav.map((group) => {
        const hasPanel = group.columns.length > 0
        const isOpen = open === group.label
        return (
          <li
            key={group.label}
            className="relative"
            onMouseEnter={() => hasPanel && setOpen(group.label)}
          >
            {group.to ? (
              <Link
                to={group.to}
                onClick={() => setOpen(null)}
                onFocus={() => hasPanel && setOpen(group.label)}
                className="inline-flex items-center gap-1 px-3 py-5 text-sm font-500 text-paper/85 transition-colors hover:text-paper"
              >
                {group.label}
                {hasPanel && <Caret open={isOpen} />}
              </Link>
            ) : (
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : group.label)}
                onFocus={() => hasPanel && setOpen(group.label)}
                className="inline-flex items-center gap-1 px-3 py-5 text-sm font-500 text-paper/85 transition-colors hover:text-paper"
              >
                {group.label}
                {hasPanel && <Caret open={isOpen} />}
              </button>
            )}
            {hasPanel && isOpen && <Panel group={group} onNavigate={() => setOpen(null)} />}
          </li>
        )
      })}
    </ul>
  )
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={`opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
