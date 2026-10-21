# Solaris360 technical audit — 2026-10-21

Scope: the new Vite SSG site (this repo), checked against `public/checklist.md`.

- **Staging (audited live):** https://greenthera.shivantra.com/solaris360.com/ (GitHub Pages, sub-path `base: '/solaris360.com/'`)
- **Production domain in all SEO tags:** https://www.solaris360.com — this still serves the **old WordPress site**.
- **Method:** local production build (`npm run build`) checked with scripts, local `vite preview` checked with curl, live staging and production checked with curl/openssl. No browser was used, so items that need one are marked **Not Verified**.
- **Live staging is behind `main`:** it reports `last-modified: 2026-09-15`, so recent commits and the fixes below are not deployed yet (`npm run deploy`).

Status key: **Pass** · **Fail** · **Fixed** (failed, fixed in this change, retested) · **N/A** · **Not Verified**

---

## 1. Technical SEO & Indexing

| Item | Status | Notes |
|---|---|---|
| Important pages crawlable/indexable | **Fixed** | All 22 pages have `index,follow`. **Before:** React 19.2 moved each page's content (the whole `<Outlet>` Suspense boundary, larger than ~12 KB) into a `<div hidden>` **after the footer**, and only an inline script put it back into `<main>`. Crawlers and link-preview bots that don't run JS saw an empty `<main>`. **Fix:** route-level `lazy` and no `<Suspense>` around the outlet ([routes.tsx](../src/routes.tsx), [Layout.tsx](../src/components/layout/Layout.tsx)). **Retest:** on every page the `<h1>` is inside `<main>` and there is no hidden div. |
| Unique, relevant titles and descriptions | **Pass** (with Low issue) | All titles and descriptions are unique. See issue F for descriptions that are too long or too thin. |
| Canonical URLs | **Pass** for production / see issue A | Each page's canonical is itself, with a trailing slash, on `https://www.solaris360.com`. |
| Heading hierarchy | **Fixed** | Every page has exactly one `<h1>`. **Before:** the footer `<h2>` came before the `<h1>` (side effect of the hidden-div problem), and `/faq/` jumped from h1 to h3. **Fix:** the FAQ accordion now uses `<h2>` questions (new `headingLevel` prop on [Accordion.tsx](../src/components/ui/Accordion.tsx)). **Retest:** no skipped levels on any page, and the `<h1>` is the first heading. |
| Broken links, redirect chains, 404s | **Fixed** | All internal links resolve in the build. **Before:** the Torrent Power and DGVCL "Useful Links" returned 404. They now point to working portal roots ([site.ts](../src/content/site.ts)). Old WordPress paths (`/about-us/` and five others) redirected to `/about/` and the like **without** the base path, which 404s on staging. They are now base-aware ([gen-sitemap.mjs](../scripts/gen-sitemap.mjs)). |
| Internal linking & navigation | **Pass** | Header mega-menu, mobile nav and footer directory link to all sections. A "Skip to content" link targets `#main`. |
| Duplicate content / URL variations | **Pass** / see issue A | Trailing-slash paths only. Each legacy URL is a meta-refresh stub with a canonical to its new URL. The staging host duplicates production, but its canonicals point to production. |
| Open Graph & social metadata | **Pass** | og:title, description, url, image (1200×630), locale and Twitter card are set per page. |

## 2. Robots.txt & XML sitemap  *(item 12: "add sitemap.xml robots.txt")*

| Item | Status | Notes |
|---|---|---|
| `/robots.txt` exists and is accessible | **Pass** / see issue A | Generated at build into `dist/robots.txt` (`Allow: /` plus a `Sitemap:` line). It is live at `/solaris360.com/robots.txt` (200). Crawlers only read robots.txt at the **host root**, so on staging it has no effect. On the apex domain it will. |
| Important pages/resources not blocked | **Pass** | Nothing is disallowed. |
| XML sitemap exists and is accessible | **Pass** | `dist/sitemap.xml`, 22 URLs, 200 live. |
| Sitemap has only canonical, indexable URLs | **Pass** | It excludes `404.html` and the six legacy redirect stubs. Every URL matches its page's canonical. |
| Sitemap URLs return 200 | **Pass** (build) / **Fail** (production today) | All 22 return 200 on local preview. On www.solaris360.com they don't exist yet (the old WordPress site is still there): see issue A. |
| Sitemap referenced in robots.txt | **Pass** | `Sitemap: https://www.solaris360.com/sitemap.xml` |
| Submitted in Google Search Console | **Not Verified** | No GSC access. Submit after launch on the apex domain. |

## 3. Structured data

| Item | Status | Notes |
|---|---|---|
| Relevant structured data exists | **Pass** | JSON-LD on every page. |
| Organization / LocalBusiness | **Pass** | `LocalBusiness` + `GeneralContractor` with address, geo, hours, phone, areaServed and sameAs. |
| WebSite & BreadcrumbList | **Fixed** | WebSite was present. **Before:** no page had a BreadcrumbList (`Seo` supported one, but no page passed it). **Fix:** `Seo` now emits Home › Page by default on indexable inner pages ([Seo.tsx](../src/components/layout/Seo.tsx)). **Retest:** present on all 21 inner pages, absent on home and 404. |
| Page-specific schema | **Pass** / **Fixed** | `/faq/` has FAQPage matching the 5 visible Q&As. `/reviews/` has AggregateRating plus 12 Reviews, but they were on a separate `Organization` with no `@id`, so they described a second, duplicate entity. That block now carries `@id …/#business`, so it merges with the LocalBusiness. Note: Google doesn't show star rich results for a business's reviews of itself on its own site. The markup is still valid. |
| Matches visible content | **Pass** | FAQ, reviews, address and phone match the rendered text. |
| Schema Markup Validator / Rich Results Test | **Not Verified** | These are web tools. JSON-LD was checked to parse and to include the required properties. Run both after deploy. |
| Missing recommended properties | **Low** | Optional: `LocalBusiness.aggregateRating` sitewide and `sameAs` for other social profiles if they exist. |

## 4. Core Web Vitals & performance

| Item | Status | Notes |
|---|---|---|
| LCP / INP / CLS (mobile & desktop) | **Not Verified** | The PageSpeed Insights API's keyless daily quota was used up, and a local Lighthouse run would launch Chrome, which was out of scope. Run PSI for the home page and one inner page, mobile and desktop, and record **field (CrUX)** and **lab** values separately. A new staging URL will most likely have no field data. |
| Render-blocking CSS/JS | **Pass** | App CSS loads with `media=print` → `all` (plus a noscript fallback). Google Fonts are preloaded and swapped in, with `display=swap`. Scripts are `type=module` and `async` gtag. |
| Unused JS/CSS | **Pass** (code review) | The JS is split per route. jsPDF (~400 KB) and html2canvas load only on EMI PDF export. CSS is split per route (`cssCodeSplit`). |
| Image compression / modern formats | **Pass** | All content photos are WebP. |
| Lazy loading offscreen images | **Pass** | Below-the-fold images use `loading="lazy"`. The hero image uses `fetchpriority="high"`. |
| Dimensions & responsive images | **Fail** (Medium, issue E) | Almost every `<img>` has width/height or a fixed CSS box (1–2 per page without, in absolute-positioned containers, so no CLS risk). There is **no `srcset`**: 200–380 KB panoramas go to phones at full size. |
| Font loading | **Pass** | Preconnect plus async stylesheet with `display=swap`. 3 families / 10 weights is on the heavy side. Consider trimming. |
| Caching / compression / CDN | **Pass** (platform limits) | GitHub Pages behind Fastly CDN, gzip, `cache-control: max-age=600`. Hashed assets can't be given `immutable` on GitHub Pages. |
| Third-party scripts | **Pass** | Only GA4 (async) and Google Fonts. |

## 5. Mobile responsiveness & accessibility

| Item | Status | Notes |
|---|---|---|
| Responsive across devices | **Not Verified** | Needs a browser. The Tailwind breakpoints look correct in code review. |
| Viewport configuration | **Pass** | `width=device-width, initial-scale=1.0`, with no zoom lock. |
| Horizontal overflow | **Not Verified** | Needs a browser. |
| Font sizes & contrast | **Pass** | Measured token contrast: paper/ink 18.6:1, muted/ink 6.8:1 (lowest on panel-2: 5.2:1), orange/ink 8.9:1, ink-on-orange buttons 8.9:1. `text-ash` is used only on light grounds (about 4.6:1). |
| Image alt text | **Pass** | Every `<img>` has `alt`. Decorative images use `alt=""` plus `aria-hidden`. |
| Keyboard navigation & focus | **Pass** (code) / Not Verified (browser) | Global `:focus-visible` 2px orange outline, skip link, real `<button>` accordions with `aria-expanded`/`aria-controls`. |
| Form labels | **Fixed** | Labels were already correct (wrapping `<label>`s, and EMI fields use `htmlFor`). **Added:** `autocomplete="name"` / `"tel"` and `type="tel"` on the contact form (WCAG 1.3.5, Identify Input Purpose). |
| WCAG 2.2 AA review | **Partially verified** | The code-level checks above pass. Still needs a browser pass with WAVE/axe and keyboard-only testing (2.4.11 Focus Not Obscured, 2.5.8 Target Size). |

## 6. Security & technical configuration

| Item | Status | Notes |
|---|---|---|
| HTTPS enforced | **Fail** (High, issue B) | `http://greenthera.shivantra.com/solaris360.com/` returns **200 over HTTP** instead of redirecting. |
| SSL/TLS certificate | **Pass** | Let's Encrypt, CN=greenthera.shivantra.com, valid until 2026-11-22 (GitHub auto-renews it). |
| HTTP→HTTPS redirect | **Fail** | Same as above. Fix it in GitHub Pages settings, not in code. |
| Security headers | **Fail** (Medium, issue C) | GitHub Pages sends none (no CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy or frame-ancestors). They can't be configured there. |
| Mixed content | **Pass** | No `http://` resources in the build. |
| No debug info / secrets / sensitive files | **Pass** / Low (issue G) | No source maps, no `console.log`, `.env*` is gitignored. However, `public/checklist.md` (this internal audit brief) gets published at `/solaris360.com/checklist.md`. |
| Unnecessary external dependencies | **Pass** | Runtime deps: react, react-router, gsap, jspdf (lazy), vite-react-ssg. |

## 7. Functionality & UX

| Item | Status | Notes |
|---|---|---|
| Navigation, links, buttons, CTAs | **Pass** (static) | All internal hrefs resolve. WhatsApp (`wa.me`), `tel:` and Maps links return 200. |
| Contact form, validation, confirmation | **N/A** (by design) | The form doesn't submit to a server. It builds a pre-filled WhatsApp message, and the page says so. The fields are optional, so there is nothing to validate. |
| Email notifications & integrations | **N/A** | No backend or email integration exists. |
| Custom 404 / error pages | **Fixed** | **Before:** no `404.html` was built, so unknown URLs showed GitHub's generic "Page not found". **Fix:** `ssgOptions.includedRoutes` also renders `/404` → `dist/404.html`, a branded `noindex` page ([vite.config.ts](../vite.config.ts)). GitHub Pages serves it with HTTP 404. |
| Cross-browser | **Not Verified** | Needs browser testing (Chrome, Safari iOS, Firefox, Samsung Internet). |
| Contact details & business info | **Pass** | Taken from the single `company.ts`. The office and display addresses differ on purpose, as on the old site. |
| Cookie consent / privacy | **Fail** (Medium, issue D) | GA4 loads before any consent, and there is no banner or Consent Mode. Needs a legal decision (India DPDP Act 2023, plus GDPR if there is EU traffic). |

## 8. Analytics & monitoring

| Item | Status | Notes |
|---|---|---|
| Analytics implemented | **Pass** | GA4 `G-QPCP96RNWK`, `anonymize_ip`, one `page_view` per route (`send_page_view:false` + SPA hook). |
| GSC verification | **Not Verified** | There is no verification meta tag in the code. Use the DNS TXT method on solaris360.com at launch. |
| Conversion events | **Fixed** (code) | **Before:** only `page_view`. **Added:** `whatsapp_click`, `phone_click` and `email_click` from one delegated listener ([analytics.ts](../src/lib/analytics.ts)). This covers the header, footer, FAB, contact form and EMI page. **Still to do:** in GA4 Admin, mark these as **key events**. |
| JS console errors | **Not Verified** | Needs a browser. Build, typecheck, lint and 14 unit tests pass. |
| Analytics not duplicated | **Pass** | There is one gtag snippet and one config call. |
| Uptime / error monitoring | **N/A** / recommended | Nothing is configured. A free uptime check (e.g. UptimeRobot) on the home page and sitemap is recommended at launch. |

---

## Issues still open (proposed Redmine tickets)

| # | Severity | Issue | Affected | Evidence | Recommended fix |
|---|---|---|---|---|---|
| A | **High** | Staging and production domains don't match. Canonical, og:url, sitemap, robots `Sitemap:` and JSON-LD all point to `www.solaris360.com`, which still serves WordPress (`/about/` → 404). | All pages | `curl https://www.solaris360.com/about/` → 404; `/sitemap.xml` → 404 | At launch: set `base: '/'`, add `public/CNAME` (www.solaris360.com), point DNS to GitHub Pages, keep the legacy redirect stubs, and submit the sitemap in GSC. Until then, optionally add `noindex` on staging. |
| B | **High** | HTTP not redirected to HTTPS | greenthera.shivantra.com/* | `curl -I http://…/solaris360.com/` → 200 | Turn on **Enforce HTTPS** in the GitHub Pages settings of the repo/org that owns the custom domain. Do the same for www.solaris360.com at launch. |
| C | Medium | No security headers | All | Response headers only show GitHub/Fastly defaults | GitHub Pages can't set headers. Put Cloudflare (free) in front, or host on Cloudflare Pages/Netlify with a `_headers` file: HSTS, CSP (allowing googletagmanager, fonts), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors. |
| D | Medium | GA4 runs without consent | All | gtag in `index.html` loads unconditionally | Get a legal decision. If needed, add a consent banner plus Google Consent Mode v2 (default `denied`), and update the privacy policy. |
| E | Medium | No responsive images (`srcset`) | Every page hero and ImageBand | Panoramas are 200–380 KB at a single width | Generate 640/1280/2400 px WebP variants (e.g. `vite-imagetools`), add `srcset`/`sizes` plus width/height to `PageHero`, `ImageBand`, `MediaRow`. Then measure LCP. |
| F | Low | Meta description length | `/shadow-analysis/` (199 chars), `/emi-calculator/` (182), `/system-features/` (182), `/epc-services/` (177); thin template text on `/terms/`, `/privacy/`, `/returns/`, `/shipping/`, `/warranty/` (41–65) | Build output | Content change: rewrite to 120–160 characters. |
| G | Low | Internal checklist published | `/solaris360.com/checklist.md` | It's in `public/` | Move `public/checklist.md` to `docs/`. |
| H | Low | Sitemap has no `<lastmod>` (Google ignores `changefreq`) | sitemap.xml | — | Optional: emit `lastmod` from git or the build date. |
| I | Low | Google reviews link not verifiable without a browser | `/reviews/` | curl → 404 (Google blocks non-browser clients) | Click-test in a browser. |
| J | Info | Core Web Vitals, cross-browser, responsive/overflow, console errors and rich-results validation are not measured | — | No browser in this audit | Manual or Lighthouse pass after deploy. Record field and lab results separately. |

## Retest summary (local build, 2026-10-21)

- `npm run build` (tsc + SSG + postbuild), `npm run lint` and `npm test` (14/14) pass.
- 22 sitemap URLs, `robots.txt`, `sitemap.xml`, `site.webmanifest`, icons, `404.html` and the legacy redirect stubs all return **200** from `vite preview` under `/solaris360.com/`.
- On every page: one `<h1>`, inside `<main>`, no hidden SSR content, no skipped heading levels, and that page's JS chunk is still modulepreloaded.
- Legacy stubs redirect to `/solaris360.com/<page>/`, with their canonical on the production domain.
