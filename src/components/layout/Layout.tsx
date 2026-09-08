import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Loader } from './Loader'
import { WhatsAppFab } from './WhatsAppFab'
import { ScrollToTop } from './ScrollToTop'
import { waMsg } from '../../content/company'
import { initReveal } from '../../lib/reveal'
import { trackPageView } from '../../lib/analytics'

const BOOT_KEY = 'sol_boot'

/** Shows the loader only if a route chunk takes longer than ~140ms to arrive. */
function DelayedLoader() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 140)
    return () => window.clearTimeout(t)
  }, [])
  return show ? <Loader /> : null
}

export function Layout() {
  const { pathname } = useLocation()
  const [booted, setBooted] = useState(true)

  useEffect(() => {
    initReveal()

    let seen: boolean
    try {
      seen = sessionStorage.getItem(BOOT_KEY) === '1'
    } catch {
      seen = true
    }
    if (seen) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooted(false)
    const done = () => {
      try {
        sessionStorage.setItem(BOOT_KEY, '1')
      } catch {
        /* ignore */
      }
      setBooted(true)
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = window.setTimeout(done, reduced ? 300 : 1900)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      <ScrollToTop />
      <Loader done={booted} />
      <Header />
      <main id="main">
        <Suspense fallback={<DelayedLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFab message={waMsg.quote} />
    </>
  )
}
