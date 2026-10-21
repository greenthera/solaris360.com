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

/**
 * Conversion events. Every lead on this site leaves through a wa.me, tel: or mailto:
 * link, so one delegated listener covers the header, footer, FAB, forms and EMI page.
 * Mark these events as key events in GA4 to report them as conversions.
 */
export function initConversionTracking() {
  if (typeof window === 'undefined') return
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!a) return
    const href = a.getAttribute('href') ?? ''
    const event = href.startsWith('https://wa.me/')
      ? 'whatsapp_click'
      : href.startsWith('tel:')
        ? 'phone_click'
        : href.startsWith('mailto:')
          ? 'email_click'
          : null
    if (!event) return
    const w = window as unknown as { gtag?: (...a: unknown[]) => void }
    w.gtag?.('event', event, {
      link_url: href.split('?')[0],
      link_text: a.textContent?.trim().slice(0, 100),
      page_path: window.location.pathname,
    })
  })
}
