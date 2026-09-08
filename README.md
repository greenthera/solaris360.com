# Solaris360 - website

Redesign of solaris360.com. Mobile-first, statically generated, SEO-ready.

- **Stack:** React 19 + TypeScript · Vite 8 · `vite-react-ssg` (static generation) · Tailwind CSS v4
- **Design:** "Kilowatt" direction - dark navy, single orange accent, mono numerals, live generation meter
- **Motion:** modelled on erp-axenr.fr - CSS hero load-in, IntersectionObserver scroll reveals (with a hard failsafe so content can never stick hidden), infinite marquee, animated energy schematic. All gated by `prefers-reduced-motion`.
- **Deploy:** `npm run deploy` → static `dist/` pushed to the `gh-pages` branch. Served from `www.solaris360.com` (see `public/CNAME`).

## Commands

```bash
npm run dev       # dev server (SSR, matches prod)
npm run build     # tsc + SSG build -> dist/ + sitemap.xml + robots.txt
npm run preview   # serve the built dist/
npm run test      # EMI maths unit tests (vitest)
npm run lint
npm run deploy    # build + gh-pages -d dist
```

## Structure

```
src/
  routes.tsx            route table (SSG paths for products/categories)
  content/              ALL site copy, verbatim from the current site
    company.ts          phones/emails/addresses/hours + wa() helper
    nav.ts              mega-menu + footer nav
    products.ts         14 products, prices, variant attributes
    services.ts site.ts howSolarWorks.ts
    legal/*.ts          terms / privacy / returns / shipping / warranty
    blog/*.ts
  components/
    layout/  Header, MegaMenu, MobileNav, Footer, Loader, WhatsAppFab, Seo, Logo
    ui/      Reveal, Marquee, Counter, Accordion, VectorGround, primitives
    home/    Hero, LiveMeter, SolarSchematic, EmiTeaser, CtaBand
    emi/     Field, BalanceChart
  lib/
    emi.ts               EMI engine (simple = zodiac model, advanced = ecofy model) + emi.test.ts
    reveal.ts            scroll-reveal init + failsafe
    analytics.ts         GA4 (G-QPCP96RNWK), lazy, DNT-aware
    format.ts            ₹ en-IN
  pages/                 one component per route
```

## Content decisions (from the redesign spec - `docs/superpowers/specs/`)

| Topic | Decision |
|---|---|
| Contact | Form UI that opens WhatsApp pre-filled - nothing sent to a server |
| Header/footer address | `GF/21, Palladium, VIP Road, Vesu, Surat – 395007` |
| Contact-page address | `FF/215, Palladium, Nr. Shyam Mandir…` (its own, as on the live site) |
| Registered address | Terms page only |
| WhatsApp | `wa.me/919998117531`; shadow/structure enquiries use `919904277712` |
| Inverter warranty | Warranty page shows both "10 years" and "5 years standard", attributed |
| Empty shop categories | Menu entry kept → empty-state page with WhatsApp CTA |
| Project Gallery | AI renderings, labelled "illustrative" |
| Legal pages | Ported verbatim (spelling lightly corrected); Warranty is newly drafted from figures already on the site |
| Dropped pages | `/news/`, `/gallery/`, `/coming-soon/`, `/sample-page/`, test post, cart/checkout |

## Still to do

- **Media:** hero/section/product images and hero + CTA video are placeholders. Drop AI-generated assets into `src/assets/` (5 Gemini renders already wired into the hero + gallery). Add `public/og/default.jpg` (1200×630) - `Seo.tsx` references it.
- **Old-URL redirects:** add `_redirects` / meta-refresh for `/about-us/ → /about/`, `/contact-us2/ → /contact/`, `/privacy-policy-2/ → /privacy/`, etc.
- **Google Maps embed** on the Contact page (currently a "Get directions" link).
- Confirm the open questions still pending in the spec (§13): `BLACK #ffff`, footer hours source, DNS cutover to GitHub Pages.
- Deeper ambient motion polish on the hero schematic / marquee if desired.
