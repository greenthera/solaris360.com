// Postbuild:
//  1. clean every built HTML head — charset first, drop the template's stale
//     SEO tags (react-helmet-async owns the per-route ones), drop auto image
//     preloads that compete with the real LCP hint
//  2. generate sitemap.xml + robots.txt
//  3. write meta-refresh stubs for the old WordPress URLs
import { readdirSync, statSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIST = 'dist'
const ORIGIN = 'https://www.solaris360.com'

/* ---------------------------------------------------------------- *
 * 1. Clean HTML heads
 * ---------------------------------------------------------------- */
function cleanHtml(file) {
  let h = readFileSync(file, 'utf8')
  const headStart = h.indexOf('<head>') + 6
  const headEnd = h.indexOf('</head>')
  if (headStart < 6 || headEnd < 0) return
  let head = h.slice(headStart, headEnd)

  // drop the template's (non data-rh) SEO tags — helmet emits the route ones
  head = head
    .replace(/<title>[^<]*<\/title>/i, '')
    .replace(/<meta(?![^>]*data-rh)[^>]*name="description"[^>]*>/gi, '')
    .replace(/<link(?![^>]*data-rh)[^>]*rel="canonical"[^>]*>/gi, '')
    .replace(/<meta(?![^>]*data-rh)[^>]*property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta(?![^>]*data-rh)[^>]*name="twitter:[^"]*"[^>]*>/gi, '')
    // auto image preloads for statically-imported below-fold images
    .replace(/<link[^>]*rel="preload"[^>]*as="image"(?![^>]*data-rh)[^>]*>/gi, '')
    // any stray charset — we re-add it first
    .replace(/<meta[^>]*charset[^>]*>/gi, '')
    // make the app stylesheet non-render-blocking so the inline boot splash
    // paints immediately on slow connections (the splash masks any FOUC)
    .replace(
      /<link rel="stylesheet"([^>]*href="[^"]*\/assets\/[^"]*\.css"[^>]*)>/i,
      (m, attrs) =>
        `<link rel="stylesheet"${attrs} media="print" onload="this.media='all';this.onload=null">` +
        `<noscript>${m}</noscript>`,
    )

  head = `<meta charset="utf-8">${head.trim()}`
  writeFileSync(file, h.slice(0, headStart) + head + h.slice(headEnd))
}

// old solaris360.com path -> new path
const REDIRECTS = {
  'about-us': '/about/',
  'why-us': '/why-us/',
  'contact-us2': '/contact/',
  'privacy-policy-2': '/privacy/',
  'terms-and-conditions': '/terms/',
  'return-cancellation-policy': '/returns/',
  'shipping-transportation-policy': '/shipping/',
}
for (const [oldPath, dest] of Object.entries(REDIRECTS)) {
  const dir = join(DIST, oldPath)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, 'index.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
      `<link rel="canonical" href="${ORIGIN}${dest}">` +
      `<meta http-equiv="refresh" content="0; url=${dest}">` +
      `<title>Moved</title></head><body>` +
      `<p>This page has moved to <a href="${dest}">${dest}</a>.</p>` +
      `<script>location.replace(${JSON.stringify(dest)})</script></body></html>\n`,
  )
}

const urls = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (name === 'assets' || Object.hasOwn(REDIRECTS, relative(DIST, full).replace(/\\/g, '/'))) continue
      walk(full)
    } else if (name === 'index.html') {
      cleanHtml(full)
      const rel = relative(DIST, dir).replace(/\\/g, '/')
      urls.push(rel ? `/${rel}/` : '/')
    } else if (name.endsWith('.html')) {
      cleanHtml(full)
      if (name !== '404.html') {
        const rel = relative(DIST, full).replace(/\\/g, '/').replace(/\.html$/, '/')
        urls.push(`/${rel}`)
      }
    }
  }
}
walk(DIST)

const uniq = [...new Set(urls)].sort()
const body = uniq
  .map((u) => `  <url><loc>${ORIGIN}${u}</loc><changefreq>monthly</changefreq></url>`)
  .join('\n')

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
)

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
)

console.log(`[sitemap] ${uniq.length} URLs written`)
