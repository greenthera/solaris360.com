/**
 * Bulletproof scroll reveal - CSS classes + IntersectionObserver, with a
 * scroll-based failsafe so content can never get stuck hidden.
 *
 *  - Content is visible by default (SSR / no-JS / crawler / reduced-motion safe).
 *  - initReveal() adds `html.anim` ONLY when motion is allowed, then reveals
 *    each `.reveal` as it enters the viewport.
 *  - A scroll/timer failsafe reveals anything already within ~1.2 viewports, and
 *    `pageshow` reveals everything (bfcache restores), so a throttled tab or a
 *    missed observer callback can't leave the page blank.
 */

let started = false

export function initReveal() {
  if (started || typeof window === 'undefined') return
  started = true

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.documentElement.classList.add('anim')

  const pending = () => document.querySelectorAll<HTMLElement>('.reveal:not(.reveal-in)')

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  )

  const observe = () => pending().forEach((el) => io.observe(el))

  const revealNear = () => {
    const limit = window.innerHeight * 1.2
    pending().forEach((el) => {
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add('reveal-in')
        io.unobserve(el)
      }
    })
  }

  const revealAll = () => pending().forEach((el) => el.classList.add('reveal-in'))

  observe()
  revealNear()

  // SPA route changes add new .reveal nodes - re-scan.
  new MutationObserver(() => {
    observe()
    revealNear()
  }).observe(document.body, { childList: true, subtree: true })

  window.addEventListener('scroll', revealNear, { passive: true })
  window.addEventListener('resize', revealNear, { passive: true })
  window.addEventListener('pageshow', revealAll)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') revealNear()
  })
}
