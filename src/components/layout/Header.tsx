import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { DesktopNav } from './MegaMenu'
import { MobileNav } from './MobileNav'
import { company, wa, waMsg } from '../../content/company'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer whenever the route changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xs focus:bg-orange focus:px-4 focus:py-2 focus:font-600 focus:text-ink"
      >
        Skip to content
      </a>

      <div className="hidden border-b border-white/5 bg-ink text-[0.8rem] text-muted md:block">
        <div className="container-x flex justify-between py-2">
          <a
            href={company.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange"
          >
            {company.displayAddress}
          </a>
          <span className="flex gap-5">
            <a href={`tel:${company.phone.mainDigits}`} className="hover:text-orange">
              {company.phone.main}
            </a>
            <a href={`mailto:${company.email.general}`} className="hover:text-orange">
              {company.email.general}
            </a>
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          scrolled ? 'border-white/10 bg-ink/95' : 'border-transparent bg-ink'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="inline-flex" aria-label="Solaris360 home">
            <Logo className="h-7 sm:h-8" />
          </Link>

          <nav aria-label="Primary" className="flex items-center">
            <DesktopNav />
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={wa(waMsg.quote)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary hidden sm:inline-flex"
            >
              Get a quote
            </a>
            <button
              type="button"
              className="p-1 text-paper lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
