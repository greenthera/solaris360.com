import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Loader } from './Loader'
import { WhatsAppFab } from './WhatsAppFab'
import { ScrollToTop } from './ScrollToTop'
import { waMsg } from '../../content/company'
import { initReveal } from '../../lib/reveal'
import { initConversionTracking, trackPageView } from '../../lib/analytics'

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
  const navigation = useNavigation()

  useEffect(() => {
    initReveal()
    initConversionTracking()
    dismissBootSplash()
  }, [])

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      <ScrollToTop />
      <Header />
      {/* No <Suspense> here: routes use router `lazy`, so the next page's chunk loads
          during navigation (shown by the loader) and SSG HTML keeps page content inside
          <main> - React 19 moves large Suspense content to a hidden div after the footer. */}
      {navigation.state === 'loading' && <DelayedLoader />}
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab message={waMsg.quote} />
    </>
  )
}
