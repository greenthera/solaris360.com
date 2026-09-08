import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Every navigation lands at the top of the page. Back/forward keeps the
 * browser's restored position; in-page hash links are left alone.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()

  useLayoutEffect(() => {
    if (hash) return
    if (navType === 'POP') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash, navType])

  return null
}
