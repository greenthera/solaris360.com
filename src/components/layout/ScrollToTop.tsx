import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Every navigation lands at the top of the page - including browser back/forward,
 * so the browser's own scroll restoration is switched off. In-page hash links are
 * left alone.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  useLayoutEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
