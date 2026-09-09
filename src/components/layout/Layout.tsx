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

/** Dismiss the static boot splash from index.html once the app is ready. */
function dismissBootSplash() {
  const boot = document.getElementById('boot')
  if (!boot) return

  let seen: boolean
  try {
    seen = sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    seen = true
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hold = seen ? 0 : reduced ? 400 : 1500

  window.setTimeout(() => {
    boot.classList.add('done')
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {
      /* ignore */
    }
    window.setTimeout(() => boot.remove(), 500)
  }, hold)
}

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    initReveal()
    dismissBootSplash()
  }, [])

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      <ScrollToTop />
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
