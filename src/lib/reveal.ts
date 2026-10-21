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

  const pending = new Set<HTMLElement>()

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in')
          io.unobserve(e.target)
          pending.delete(e.target as HTMLElement)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  )

  const collect = (root: ParentNode) => {
    const elements = root.querySelectorAll<HTMLElement>('.reveal:not(.reveal-in)')
    for (const el of elements) {
      if (pending.has(el)) continue
      pending.add(el)
      io.observe(el)
    }
    if (root instanceof HTMLElement && root.matches('.reveal:not(.reveal-in)') && !pending.has(root)) {
      pending.add(root)
      io.observe(root)
    }
  }

  const revealNear = () => {
    const limit = window.innerHeight * 1.2
    const ready: HTMLElement[] = []
    const sectionTops = new Map<Element, number>()
    // Read geometry together, then write classes. Measuring children of a distant
    // content-visibility section would otherwise force its skipped layout.
    for (const el of pending) {
      if (!el.isConnected || el.classList.contains('reveal-in')) {
        pending.delete(el)
        io.unobserve(el)
        continue
      }
      const section = el.closest('.cv-auto')
      if (section) {
        if (!sectionTops.has(section)) sectionTops.set(section, section.getBoundingClientRect().top)
        if (sectionTops.get(section)! >= limit) continue
      }
      if (el.getBoundingClientRect().top < limit) ready.push(el)
    }
    for (const el of ready) {
      el.classList.add('reveal-in')
      pending.delete(el)
      io.unobserve(el)
    }
  }

  const revealAll = () => {
    for (const el of pending) {
      el.classList.add('reveal-in')
      io.unobserve(el)
    }
    pending.clear()
  }

  collect(document)
  revealNear()

  // Register only newly inserted reveal nodes; live counters and review text
  // updates don't need a full-document query or repeated observer registration.
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLElement) collect(node)
      }
    }
    revealNear()
  }).observe(document.body, { childList: true, subtree: true })

  window.addEventListener('scroll', revealNear, { passive: true })
  window.addEventListener('resize', revealNear, { passive: true })
  window.addEventListener('pageshow', revealAll)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') revealNear()
  })
}
