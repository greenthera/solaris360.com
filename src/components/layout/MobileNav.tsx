import { useEffect, useState } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { nav } from '../../content/nav'
import { company, wa, waMsg } from '../../content/company'

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <nav
        className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-navy transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Main"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Menu</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="p-1 text-paper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="flex-1 px-2 py-3">
          {nav.map((group) => {
            const hasChildren = group.columns.length > 0
            const isOpen = expanded === group.label
            return (
              <li key={group.label} className="border-b border-white/5">
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : group.label)}
                      className="flex w-full items-center justify-between px-3 py-3.5 text-left font-display text-[0.95rem] font-600 text-paper"
                    >
                      {group.label}
                      <span className={`text-orange transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {isOpen && (
                      <div className="pb-2">
                        {group.columns.map((col, ci) => (
                          <div key={ci} className="pl-3">
                            {col.heading && (
                              <p className="px-3 pb-1 pt-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                                {col.heading}
                              </p>
                            )}
                            {col.links.map((l) => (
                              <RouterNavLink
                                key={l.to}
                                to={l.to}
                                onClick={onClose}
                                className="block px-3 py-2 text-sm text-paper/80"
                              >
                                {l.label}
                              </RouterNavLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <RouterNavLink
                    to={group.to ?? '#'}
                    onClick={onClose}
                    className="block px-3 py-3.5 font-display text-[0.95rem] font-600 text-paper"
                  >
                    {group.label}
                  </RouterNavLink>
                )}
              </li>
            )
          })}
        </ul>

        <div className="border-t border-white/10 p-5">
          <a href={wa(waMsg.quote)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            Get a quote on WhatsApp
          </a>
          <a href={`tel:${company.phone.mainDigits}`} className="mt-3 block text-center font-mono text-sm text-muted">
            {company.phone.main}
          </a>
        </div>
      </nav>
    </div>
  )
}
