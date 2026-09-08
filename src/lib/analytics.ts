/**
 * GA4 (gtag.js) is loaded by the snippet in index.html with send_page_view
 * disabled. This fires one page_view per SPA navigation (including first load).
 */
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: (...a: unknown[]) => void }
  w.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
