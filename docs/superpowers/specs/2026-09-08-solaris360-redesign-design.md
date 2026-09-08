# Solaris360 website redesign — design spec

**Date:** 2026-09-08
**Status:** Draft for review
**Owner:** Shivantra (dev@shivantra.com)
**Repo:** `solaris/` (currently untracked inside the `frontend` monorepo — will get its own repo)

---

## 1. Goal

Rebuild `solaris360.com` as a fast, mobile-first, statically-generated marketing + catalogue site.
Keep **all** existing content and navigation from the current WordPress/WooCommerce site — nothing dropped, nothing invented.
Visual direction: **"Kilowatt"** (preview D) — bold, dark, data-forward, navy-dominant, mono numerals, live generation meter.
Motion language: modelled on **erp-axenr.fr** — GSAP + ScrollTrigger, orchestrated hero load-in, scroll reveals with stagger, an ambient energy schematic, an infinite marquee, subtle scrub parallax.

### Success criteria

- Every current page exists at a sensible URL with its real content (see §7 inventory).
- Lighthouse (mobile, throttled): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- Contact happens through WhatsApp redirection — no form backend.
- EMI calculator works offline in the browser, produces a full amortisation schedule, and matches the maths of the reference calculators (§8).
- Ships as static files to a `gh-pages` branch; site works served from the domain root.
- No stock photography — all imagery/video is AI-generated (§10).

---

## 2. Non-goals

- No e-commerce checkout. The current shop has a cart/checkout/my-account flow; the redesign keeps **product catalogue pages** (browse + specs + price) but the "Add to cart"/"Select options" buttons become a **WhatsApp enquiry** ("I'm interested in <product>"). Confirm in §13.
- No blog CMS. The single existing blog post is ported as a static article; "Blog" lists it.
- No user accounts, no search backend (client-side filter on the shop is enough).
- No i18n — English only, matching the current site.

---

## 3. Tech stack & architecture

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 19 + TypeScript (already in repo) | keep |
| Build / SSG | **`vite-react-ssg`** on Vite 8 | pre-renders every route to static HTML at build; hydrates on load |
| Routing | `vite-react-ssg` route config (one `routes.tsx`) | file-per-page components under `src/pages/` |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` | design tokens in `@theme`; no CSS-in-JS |
| Animation | **GSAP + ScrollTrigger** (npm `gsap`) | one `useGsap` hook + `<Reveal>` wrapper; all gated by `prefers-reduced-motion` |
| Head / SEO | `vite-react-ssg`'s `<Head>` + a `<Seo>` component | per-route title, description, canonical, OG, JSON-LD |
| Icons | local SVG sprite (`public/icons.svg`, already exists) + inline SVG | no icon library |
| Content | typed TS modules in `src/content/` (see §9) | no runtime fetch; content compiled in |
| Analytics | GA4 `G-QPCP96RNWK` via `gtag.js` | loaded after first interaction / idle, respects DNT |
| Deploy | `npm run build` → `dist/`, `npm run deploy` → `gh-pages -d dist` | already wired; SSG just changes what `build` emits |
| Node | package manager: npm (lockfile present) | |

### Directory shape

```
src/
  main.tsx                 # hydration entry (vite-react-ssg)
  routes.tsx               # route table -> page components + SSG paths
  pages/
    Home.tsx
    About.tsx  WhySolar.tsx  WhyUs.tsx
    EpcServices.tsx  SolarPvSystem.tsx  SystemFeatures.tsx
    ProjectGallery.tsx  ExecutionProcess.tsx
    ShadowAnalysis.tsx  StabilityCertificate.tsx
    HowSolarPowerWorks.tsx  Faq.tsx  UsefulLinks.tsx
    Blog.tsx  BlogPost.tsx
    Contact.tsx
    Shop.tsx  ProductCategory.tsx  Product.tsx
    EmiCalculator.tsx
    Warranty.tsx
    Terms.tsx  Privacy.tsx  ReturnCancellation.tsx  ShippingTransportation.tsx
    NotFound.tsx
  components/
    layout/    Header.tsx  MegaMenu.tsx  Footer.tsx  Layout.tsx
    ui/        Reveal.tsx  Marquee.tsx  Counter.tsx  Accordion.tsx
               WhatsAppFab.tsx  Loader.tsx  VectorGround.tsx  Seo.tsx
    home/      Hero.tsx  LiveMeter.tsx  EnergySchematic.tsx  ...
    emi/       EmiForm.tsx  EmiSummary.tsx  AmortisationTable.tsx  BalanceChart.tsx
  content/     nav.ts  company.ts  products.ts  faq.ts  services.ts
               systemFeatures.ts  howSolarWorks.ts  usefulLinks.ts
               legal/terms.ts privacy.ts returns.ts shipping.ts warranty.ts
               blog/exploring-solar-panel-types.ts
  hooks/       useGsap.ts  useReducedMotion.ts  useCountUp.ts
  lib/         emi.ts  seo.ts  format.ts (₹ / en-IN)
  styles/      globals.css (Tailwind + @theme tokens + keyframes)
```

---

## 4. Design system — "Kilowatt"

Carried from preview D, tightened.

### 4.1 Colour tokens

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0f0e24` | deepest ground (hero, footer) |
| `--navy` | `#17163f` | primary dark surface (brand) |
| `--panel` | `#1e1c4a` | raised dark surface / cards |
| `--line` | `rgba(255,255,255,.10)` | hairlines on dark |
| `--paper` | `#fdfdfc` | brand WHITE — light sections, text on dark |
| `--muted` | `#9b98b8` | secondary text on dark |
| `--ash` | `#777476` | brand GRAY — secondary text on light |
| `--orange` | `#f3a02e` | brand ORANGE — single accent, actions + energy |
| `--orange-weak` | `rgba(243,160,46,.14)` | accent wash |
| semantic | `--ok #35c07a` `--warn #f3a02e` `--bad #e5564d` | status only (EMI validation, stock) |

> **`BLACK: #ffff` in the brief is a typo.** This spec treats **navy `#17163f`** as the brand dark and true black only for shadows. **Open question §13.1.**

Dark-first design. Light sections (shop, legal, calculator body) use `--paper` ground with `--navy` text. Both themes painted explicitly; `prefers-color-scheme` respected for the light-ground pages, but the brand identity is dark — the toggle is not exposed to users (single committed visual world, like the preview).

### 4.2 Typography

| Role | Face | Usage |
|---|---|---|
| Display | **Sora** (600/700/800) | H1–H3, hero, section heads |
| Body | **Inter** (400/500) | paragraphs, UI |
| Numerals | **IBM Plex Mono** (400/500/600) | every figure: prices, kW, ₹, EMI table, meter, stats — `font-variant-numeric: tabular-nums` |

Google Fonts, `display=swap`, self-preconnect. Type scale (rem, 1.200 minor-third): 0.75 / 0.875 / 1 / 1.25 / 1.5 / 1.875 / 2.25 / 3 / 3.75. Body line length ≤ 68ch. Headings `text-wrap: balance`.

### 4.3 Layout

- Max content width `72rem` (1152px); wide dark bands are full-bleed with inner `max-w` container.
- 4 / 8 / 16 / 24 / 40 / 64 px spacing rhythm.
- Mobile-first: single column < 768px; 2-col at `md`; 3–4-col grids at `lg`.
- Border-radius: `2px` on inputs/buttons (technical feel), `0` on cards — cards are separated by `--line` + `--panel` fill, not radius. One exception: WhatsApp FAB is a pill.
- Wide content (EMI table, product spec tables, code) scrolls inside its own `overflow-x:auto` container.

### 4.4 Vector grounds (brief: "Background Vector Grounds")

Three reusable decorative layers in `<VectorGround variant>`, all CSS/SVG, `aria-hidden`, `pointer-events:none`:

1. **`wire`** — faint 40px grid (already in preview D). Dark sections.
2. **`mesh`** — two radial gradients (orange + indigo) over `--ink`. Hero + CTA.
3. **`contour`** — sparse SVG sun-ray / isoline paths, very low opacity. Light sections.

`mesh` and `contour` get a subtle `scrub` parallax (translateY ±16px over section scroll) — disabled under reduced motion.

---

## 5. Motion system (modelled on erp-axenr.fr)

One GSAP context per page (`useGsap`), killed on unmount. **All motion starts from a visible resting state** (no `opacity:0` parked content) — reveals animate _from_ a small offset that is also the CSS fallback if JS/GSAP fails.

| Moment | Spec (from axenr) |
|---|---|
| **Hero load-in** | timeline on load: H1 `y:56→0, opacity:0→1` 1.05s `expo.out` delay .1s; sub `y:24→0` .75s delay .35s; meter tiles stagger .08 `power3.out` delay .5s; schematic draws in .9s |
| **Section reveal** | ScrollTrigger `start:"top 82%"`, `y:24→0, opacity:.001→1`, .55s `power3.out`, children `stagger:.06` |
| **Counters** | `<Counter to>` counts up over .9s when its section triggers (System Features stats, "why solar" figures, shop result count) |
| **Marquee** | `<Marquee>` — duplicated track, `translateX 0→-50%`, 34s linear infinite, `reverse` variant, `paused` on hover/focus, static under reduced motion. Content: DISCOM/agency names (GEDA, Torrent Power, DGVCL, MGVCL, Surya Gujarat) and certifications (IEC 61215, IEC 61730, IEC 62804, IEC 61701, MNRE) |
| **Ambient — energy schematic** | hero/CTA: inline SVG of panels → cable → inverter → meter → grid. `cable-flow` (dashed `background-position` shift) shows current direction; nodes `pulse-dot` (scale 1→1.3, opacity 1→.4, 2s); a `gleam` sweep crosses the panel array every ~6s |
| **Live meter** | hero tiles tick pseudo-live (kWh today, ₹ saved this month, t CO₂ this year) — **clearly labelled "illustrative"**, seeded from plausible values, small random increments. Not presented as real telemetry. |
| **Scrub parallax** | vector grounds only, ±16px, 3 instances max |
| **Reduced motion** | `useReducedMotion()` short-circuits `useGsap`; marquee + meter freeze; counters render final value; ambient loops `animation: none` |

GSAP loaded as a normal npm import (tree-shaken; ScrollTrigger registered once).

---

## 6. Global components

### 6.1 Header + mega menu

Sticky, `--ink/85` + backdrop-blur, hairline bottom. Wordmark `SOLARIS360` (360 in orange). Desktop: hover/focus mega-menu; mobile: full-screen drawer, accordion groups, `Esc`/overlay to close, focus-trapped, `aria-expanded`.

Menu tree (exactly the current site — §7.1). Right-aligned **"Get Quote"** → WhatsApp.

### 6.2 Footer

Dark. Columns: **Company** (About / Why Solar / Why Solaris 360 / Project Gallery / Execution Process) · **Services** (EPC Services / Solar PV System / System Features / Shadow Analysis / Stability Certificate) · **Shop** (category links) · **Support** (FAQ / How Solar Power Works / Useful Links / Warranty / EMI Calculator) · **Policies** (Terms / Privacy / Return & Cancellation / Shipping & Transportation).
Contact block: address, phone (tel:), email (mailto:), hours.
Bottom bar: `© <year> Solaris360` · **"Developed by Shivantra"** (link to shivantra.com) · GST/registration line if provided.

### 6.3 WhatsApp FAB (brief: floating live-chat button, bottom-right)

Fixed `bottom-5 right-5`, z-50, `#25D366` pill, WhatsApp glyph + "Chat with us" (label hidden < `sm`). Gentle idle pulse ring (reduced-motion: none). Opens `https://wa.me/919998117531?text=…` with a context-aware prefilled message (product name on product pages, "solar quote" elsewhere). Appears after scroll > 400px with a fade+scale in.

### 6.4 Loader (brief: "Loader Ready")

Full-screen `--ink`. Mono `0.00` counting to a target with `kWh · SOLARIS360` label (preview D behaviour), hard-dismiss fallback ≤ 1.6s, `.done` fades opacity+visibility. Only on first load (sessionStorage flag so internal navigation is instant). Reduced motion: no count, just a 250ms fade.

### 6.5 `<Seo>`

Per route: `<title>` (`<Page> — Solaris360`), meta description, canonical, `og:title/description/type/image/url`, `twitter:card=summary_large_image`, `og:image` = a generated 1200×630 card per section (§10). Site-wide JSON-LD `Organization` + `LocalBusiness` (address, phone, geo, openingHours, sameAs); `Product` JSON-LD on product pages; `FAQPage` on FAQ; `BreadcrumbList` on shop/product.

---

## 7. Page inventory — every current page, mapped

### 7.1 Navigation (verbatim from current site)

- **About** ▸ Solaris 360 (`/about-us/`) · Why Solar (`/why-solar/`) · Why Solaris 360 (`/why-us/`)
- **EPC Services** ▸ Solar PV System (`/solar-pv-system/`) · System Features (`/system-features/`) · Project Gallery (`/project-gallery/`) · Execution Process (`/execution-process/`)
- **Other Services** ▸ Shadow Analysis (`/shadow-analysis/`) · Stability Certificate (`/stability-certificate/`)
- **Knowledge Center** ▸ Blog (`/blog/`) · How Solar Power Works (`/how-solar-power-works/`) · FAQ (`/faq/`) · Useful Links (`/useful-links/`)
- **Shop Now** ▸ Solar Pv Module · Inverter · Plant Insurance · Cleaning system products (Brush only, Cleaning liquid, Nano coating, Sprinkler set, Submersible pump, Timer) · Solar lights (Street lights, Lantern, Torch) · E-Cycle · Batteries & accessories
- **Contact Us** (`/contact-us2/` → redesign uses `/contact/`)

> Some "Shop Now" submenu labels (Cleaning liquid, Submersible pump, Lantern, Batteries & accessories) point to categories that currently have **0 products**. Keep the menu entries; category pages render an empty-state ("No products yet — enquire on WhatsApp"). **Open question §13.4.**

New menu additions: **Knowledge Center ▸ EMI Calculator**; **Other Services ▸ Warranty**.

### 7.2 URL map (redesign)

| Redesign URL | Source page | Content notes |
|---|---|---|
| `/` | `/` (thin) + composed | hero slogan is the only real homepage copy; compose the rest from real sections of other pages (see 7.3) |
| `/about/` | `/about-us/` | 1 paragraph — the "ROOFTOP SOLAR POWER EPC…" intro + scope sentence. Verbatim. |
| `/why-solar/` | `/why-solar/` | "Why go solar" + 3 cards: Up to 60% More saving / Low Operating Cost / Solar is Limitless (verbatim copy) |
| `/why-us/` | `/why-us/` | 3 cards: 100% Success Ratio / All-in Reliability / Zero Defect Delivery (verbatim) |
| `/epc-services/` | `/epc-services/` | Scope & Services list (6 bullets) + BOS + Solar panel / Mounting Structure / Solar Inverters / Miscellaneous blocks with all spec text verbatim |
| `/solar-pv-system/` | `/solar-pv-system/` | Off-Grid / Grid-Connected / Hybrid descriptions (verbatim; identical text also on How-Solar-Power-Works) |
| `/system-features/` | `/system-features/` | stat grid: Module Warranty 25 yrs · Inverter Warranty 10 yrs · Plant Service Warranty 05 yrs · Payback Period 04 yrs · Web Monitoring · Gov. Subsidy Upto 25% · Toll Free Inverter Support 24×7 |
| `/project-gallery/` | `/project-gallery/` | "Photo gallery" — currently image-only. Needs project photos (§10 / §13.5). Filterable grid (Residential / Commercial / Industrial). |
| `/execution-process/` | `/execution-process/` | 3 steps: System Proposal → GEDA Approval → Execution. "~3 months after GEDA approval." As a stepped timeline (numbering justified — it's a real sequence). |
| `/shadow-analysis/` | `/shadow-analysis/` | "Shadow Analysis on PvSyst" + "on Helioscope" blocks. Contact: 9998117531 / info@ and 9904277712 / shadow_structure@ (verbatim). |
| `/stability-certificate/` | `/stability-certificate/` | "Structural Stability Certificate" para + WhatsApp link `wa.me/919904277712?text=I am interested` (verbatim) |
| `/how-solar-power-works/` | `/how-solar-power-works/` | full: 3 system types · 6 components · line diagram · current flow in 3 conditions (Daytime-1, Daytime-2, Night) · Net Metering · YouTube channel link (`youtube.com/channel/UCInkRQ7l75_8u5xVVPeFnAw`). Diagrams re-drawn as inline SVG (§10). |
| `/faq/` | `/faq/` | 5 Q&A accordion (questions + answers captured verbatim) |
| `/useful-links/` | `/useful-links/` | 4 links: suryagujarat.guvnl.in · geda.gujarat.gov.in · connect.torrentpower.com · dgvcl.com |
| `/blog/` | `/blog/` | lists 1 post |
| `/blog/exploring-the-different-types-of-solar-panels/` | blog post | full article verbatim (Poly / Mono / Mono-PERC / Half-Cut / Bifacial / Thin-Film / BIPV / Final Words) |
| `/contact/` | `/contact-us2/` | "How can we help?" para, **address FF/215 Palladium…** (as on contact page), info@, +91 (999) 811-7531, hours Mon–Fri 08:00–17:00 / Sat–Sun closed, map embed. **Form → WhatsApp** (§13.2). |
| `/shop/` | `/shop/` | all 14 products, category chips, client-side filter, price shown, "Enquire on WhatsApp" CTA |
| `/shop/<category>/` | product_cat pages | one per category incl. empty ones |
| `/product/<slug>/` | 14 product pages | title, price range, all description text verbatim, variant attribute table (kW / Wp / capacity / watt / qty / ft options), "Enquire on WhatsApp" with product-name prefill |
| `/emi-calculator/` | **new** | §8 |
| `/warranty/` | **new** | §7.4 |
| `/terms/` | `/terms-and-conditions/` | full legal text preserved (see §7.5) |
| `/privacy/` | `/privacy-policy-2/` | full legal text preserved |
| `/returns/` | `/return-cancellation-policy/` | full legal text preserved |
| `/shipping/` | `/shipping-transportation-policy/` | full legal text preserved |
| `/404` | — | branded not-found |
| redirects | `/about-us/`→`/about/`, `/contact-us2/`→`/contact/`, `/why-us/`→`/why-us/`, `/privacy-policy-2/`→`/privacy/`, etc. | `public/_redirects` + client fallback; keeps inbound links + SEO |

Dropped (stale WordPress cruft, not in nav, no real content): `/sample-page/`, `/coming-soon/`, `/news/`, `/gallery/` (contains leftover "Grant Flooring" demo text), `/uncategorized/test-10-1-21/`, `/cart/`, `/checkout/`, `/my-account/`. **Confirm §13.6.**

### 7.3 Homepage composition (all blocks sourced from real site content)

1. **Hero** — slogan verbatim: "Gone Solar? Look around! Your neighbors have! Let your roof catch the sun. Go solar and make your roof sustainable. Go Green, Go Solar!" + "Call +91 (999) 811-7531 to Go Solar now!" · live meter tiles · energy schematic · CTAs (WhatsApp quote / EMI calculator).
2. **Marquee** — DISCOMs + certifications.
3. **Why go solar** — 3 cards from `/why-solar/`.
4. **What we do (EPC)** — 4 items from `/epc-services/` scope, link to full page.
5. **System features** — the 7-stat grid with count-up.
6. **How solar power works** — condensed 6-component schematic, link to full page.
7. **Why Solaris 360** — 3 cards from `/why-us/`.
8. **Shop teaser** — 6 category tiles + "14 products" counter.
9. **EMI calculator teaser** — mini form (system price + tenure → monthly figure), "Open full calculator".
10. **Execution process** — 3-step timeline.
11. **FAQ** — the 5 Q&A accordion.
12. **CTA band** — "Go Green, Go Solar." + "Send your electricity bill on WhatsApp" + schematic.
13. Footer.

### 7.4 Warranty page (new — AI-drafted from facts already on the site)

Only uses figures already published on solaris360.com; no new promises.

| Item | Term | Source on current site |
|---|---|---|
| Solar module — performance | 25 years | EPC Services, System Features |
| Solar module — product | 10 years | EPC Services |
| Inverter | 10 years (System Features) / "5 years standard manufacturer's warranty" (EPC page) — **§13.3 discrepancy** | both pages |
| Plant service warranty | 5 years | About, EPC Services, System Features |
| Toll-free inverter support | 24×7 | System Features |
| Web monitoring | included | System Features |
| Module certifications | IEC 61215, 61730, 62804, 61701 | EPC Services |
| Inverter certifications | IEC 60068, 61683, 60529; MNRE | EPC Services |

Plus: what's covered / not covered (from the plant-insurance product copy, clearly attributed to the insurance products, not the workmanship warranty), and how to claim (WhatsApp / email). Cross-links to Plant Insurance products and Return & Cancellation policy.

### 7.5 "AI generated" legal pages

The brief says "Add AI generated terms page". The site **already has** Terms, Privacy, Return & Cancellation, Shipping. Interpretation (confirm §13.7):
- **Keep all four**, port every clause verbatim (they're generator-produced but they're the client's current legal text — we don't rewrite legal meaning).
- "AI-generated" = clean structure, on-page nav, readable typography, "last updated" preserved (Terms: March 13, 2022).
- Warranty is the genuinely new page (§7.4).
- If the client wants the legal copy actually regenerated/modernised, that's a separate content task with their sign-off — **not** something we invent.

---

## 8. EMI calculator (brief: "much important")

Reference A — **zodiacenergy.com/emi-calculator.php**: dead-simple. Price + tenure. Down payment = 20%, loan = 80%, flat 9% p.a., `totalInterest = loan × 9% × years`, `EMI = (loan + totalInterest) / months`.

Reference B — **ecofysolaremicalculator.com**: full lender-grade tool. Inputs: Asset Price, Loan Amount, Flat Interest Rate %, Tenor (months), Processing Fee %, Advance EMI (months), Subsidy repayment amount, Subsidy-paid month. Converts flat→reducing via Newton-Raphson, standard `PMT`, GST 18% on interest/fees, processing fee, stamp fee & margin money (`round(0.22% × amount / 100) × 100`), and a **full month-by-month amortisation schedule** (Month | EMI | Interest | Principal | Closing POS), plus "EMI before / after subsidy payment".

### 8.1 What we build

A **two-mode** calculator on `/emi-calculator/`, plus the mini teaser on the homepage.

**Simple mode** (default, = Zodiac):
- Inputs: *Solar system price (incl. GST)* slider+number, *Tenure (months)* slider (12–84, step 6).
- Fixed assumptions shown as read-only rows: Down payment 20%, Loan amount 80%, Flat interest 9% p.a.
- Outputs: Down payment ₹, Loan amount ₹, Monthly EMI ₹, Total interest ₹, Total payment ₹.
- The maths reproduces Zodiac exactly.

**Advanced mode** (toggle, = Ecofy):
- Inputs (all editable, sensible defaults): Asset price `400000`, Loan amount `320000`, Flat interest rate `9`, Tenor `60`, Processing fee `2`, Advance EMI months `3`, Subsidy amount `78000` (PM Surya Ghar — default on, removable), Subsidy paid in month `3`.
- Derived: reducing rate p.a. (Newton-Raphson on the flat schedule), EMI (`PMT`), total interest, total payment, processing fee + 18% GST, stamp fee, margin money, EMI before vs after subsidy prepayment.
- **Amortisation schedule** table: Month · Opening balance · EMI · Interest · Principal · Closing balance — full tenor, scrollable, with a "download CSV" (client-side blob — works locally; note: blocked inside the Artifact preview sandbox, fine on the real site).
- **Balance chart**: small inline SVG area chart of closing balance over time, orange endpoint marker.

Shared: ₹ formatting `en-IN`, all figures in IBM Plex Mono, a persistent disclaimer ("Indicative only. Actual EMI depends on the lender's policies, processing fees and charges." — paraphrase of both references' notes), and a "Discuss financing on WhatsApp" CTA that prefills the chosen numbers.

### 8.2 `src/lib/emi.ts` — pure, unit-tested

```ts
simpleEmi({ price, months, downPct=0.2, flatRatePct=9 })
  -> { downPayment, loanAmount, monthlyEmi, totalInterest, totalPayment }

flatToReducingRate({ principal, months, flatRatePct }) -> number   // Newton-Raphson, annual %
pmt(monthlyRate, months, pv) -> number
amortise({ principal, months, annualRatePct, advanceEmiMonths, subsidy?, subsidyMonth? })
  -> { rows: AmortRow[], emi, totalInterest, totalPayment, emiBeforeSubsidy, emiAfterSubsidy }
processingFee(loanAmount, pct) & gst(x, 18) & stampFee(x) & marginMoney(price, loan)
```

TDD: write `emi.test.ts` first with cases pinned to the reference calculators' outputs (Zodiac: price 400000 / 60mo → known EMI; Ecofy: defaults → known schedule row 1).

---

## 9. Content data (`src/content/`)

All site text lives in typed modules, imported at build — no CMS, no fetch.

- `company.ts` — name, all addresses (labelled: `displayAddress`, `officeAddress`, `registeredAddress`), phones (`main`, `shadowStructure`, `support`), emails (`general`, `service`, `support`, `shadowStructure`), hours, socials (YouTube), GST/registration (if provided), `whatsapp` helper `wa(text)`.
- `nav.ts` — the menu tree (§7.1), single source for header + footer + sitemap.
- `services.ts`, `systemFeatures.ts`, `howSolarWorks.ts`, `faq.ts`, `usefulLinks.ts` — structured copy, verbatim strings.
- `products.ts` — 14 products: `slug, title, categoryPath, priceMin, priceMax, priceDisplay, description[] , attributes{name, options[]}, badges[]`. Prices verbatim from the shop.
- `legal/*.ts` — terms / privacy / returns / shipping / warranty as ordered `{ heading, body[] }[]`, verbatim (warranty per §7.4).
- `blog/exploring-solar-panel-types.ts` — the article.

Verbatim strings are stored exactly as on the source site, including its typos (e.g. "mportant", "effeciency", "casulaity") — **do not silently correct**; a `// [sic]` comment flags each. **Open question §13.8: fix obvious typos?**

---

## 10. Media — all AI-generated (brief: no stock)

| Slot | Asset | Spec |
|---|---|---|
| Hero background | AI image or 6–10s loop video | dark rooftop PV array at dusk, Surat low-rise skyline, warm sun glow; muted, `poster` + `<video autoplay muted loop playsinline>`; ≤ 1.8 MB VP9/H.264; reduced-motion → poster only |
| CTA band | AI video loop | install crew / drone over rooftop array, dark-graded |
| Section imagery | AI stills | EPC scope, mounting structure, inverter, cleaning, e-cycle, street light — consistent dark editorial treatment, `webp`/`avif`, responsive `srcset`, lazy, explicit `width`/`height` |
| Product images | AI stills per product | on `--paper`, consistent 4:3, from the spec text (e.g. "144-cell monofacial module") |
| Diagrams (How Solar Works) | inline SVG, hand-built | line diagram, 3 current-flow states, net metering — themed, both-safe, animated `cable-flow` |
| Project gallery | AI stills **or client photos** | §13.5 — if no real project photos, AI renderings **labelled "illustrative"** |
| OG cards | generated 1200×630 per section | Sora title on `--ink` + schematic motif |
| favicon / logo | keep `public/favicon.svg`; redraw wordmark | |

Generation happens outside this repo; assets land in `src/assets/` (imported, hashed, optimised by Vite) or `public/` (video). A `MEDIA.md` checklist tracks prompt + status per slot.

---

## 11. SEO / performance / accessibility

**SEO:** per-route `<title>`/description/canonical; sitemap.xml + robots.txt generated at build from `nav.ts` + routes; JSON-LD (`Organization`, `LocalBusiness`, `Product`, `FAQPage`, `BreadcrumbList`); OpenGraph + Twitter card on every route; semantic headings (one `h1`/page); descriptive `alt` on every content image; 301-style redirects for old WP URLs.

**Performance (Lighthouse-ready):** static HTML per route (SSG) → fast FCP; fonts `preconnect` + `display=swap` + subset; hero image `fetchpriority=high`, everything else lazy + `content-visibility:auto` on below-fold sections; GSAP is the only runtime dep (~40 KB gz) and is imported once; GA loaded on idle; no layout shift (reserved media boxes, `size-adjust` font fallbacks); `dist/` assets hashed + long-cache; target JS < 150 KB gz on the homepage.

**Accessibility (target ≥ 95):** visible focus rings (orange, 2px offset); mega-menu + drawer keyboard-operable, `aria-expanded`, focus-trap, `Esc`; accordion = `<button aria-expanded>` + region; `prefers-reduced-motion` fully honoured (§5); colour contrast AA (orange `#f3a02e` on `#0f0e24` = 8.9:1; on `#fdfdfc` used only for large text / borders, never small body); marquee pausable; skip-to-content link; forms (EMI) have labels + `aria-describedby` for the disclaimer.

---

## 12. Deployment

- `vite-react-ssg build` emits static `dist/` (one `index.html` per route + hydration bundle).
- `base: './'` already set — works from domain root and project sub-path.
- `npm run deploy` (`gh-pages -d dist`) publishes to the `gh-pages` branch (auto-created first run).
- Add `public/CNAME` = `www.solaris360.com` once DNS is pointed (§13.9).
- `public/.nojekyll` so Vite's `_assets` are served.
- GitHub Actions workflow (optional, §13.10): build + deploy on push to `main`.

---

## 13. Open questions (need answers before / during build)

1. **BLACK `#ffff`** — typo for `#000000`, or should it be `#ffffff` (a second near-white)? Spec assumes navy is the dark; black only for shadow.
2. **Contact "form"** — brief says "for contact form use WhatsApp redirection". Build: a lightweight form UI (name / phone / message / interest) that on submit **opens WhatsApp** with the fields formatted into the prefilled message (no data sent anywhere else)? Or just a big "Message us on WhatsApp" button with no fields?
3. **Inverter warranty** — current site says both "10 years" (System Features) and "5 years standard manufacturer's warranty" (EPC Services). Which is correct for the Warranty page? (Will show both, attributed, until told.)
4. **Empty shop categories** (Cleaning liquid, Submersible pump, Lantern, Batteries & accessories, Street lights sub, Brush only, etc. — several have 0 products) — keep menu entries with empty-state pages, or hide until stocked?
5. **Project Gallery** — are there real project photos to use? If not, OK to show AI renderings labelled "illustrative"?
6. **Stale pages** (`/news/`, `/gallery/`, `/coming-soon/`, `/sample-page/`, test post) — confirm drop.
7. **Legal pages** — port verbatim (recommended), or do you want the Terms/Privacy/Returns/Shipping copy actually rewritten? If rewritten, client must sign off — we won't invent legal terms.
8. **Typos in source copy** ("mportant", "effeciency", "SqFt", "casulaity", "Strom", "guajrat", …) — fix silently, or preserve verbatim?
9. **Domain** — will `solaris360.com` DNS point at GitHub Pages (needs `CNAME` + A/AAAA records)? Or does the current host stay and we deploy elsewhere?
10. **CI** — want the GitHub Actions auto-deploy workflow, or manual `npm run deploy` only?
11. **WhatsApp number** — confirm `+91 99981 17531` → `wa.me/919998117531` is the number for the FAB and all CTAs (shadow/structure enquiries use `9904277712` per the current site).
12. **Addresses** — three exist (display `GF/21 Palladium…`, contact `FF/215 Palladium…`, registered `38 Shree Darshan Society, Ghod Dod Road`). Which is current for header/footer? Contact page keeps its own; registered address goes only in Terms.
13. **Hours** — Contact page (Mon–Fri 08:00–17:00, Sat–Sun closed) vs Return policy (Mon–Fri 8AM–8PM). Which for the footer?

---

## 14. Build phasing (feeds the implementation plan)

1. **Foundation** — vite-react-ssg + Tailwind v4 + routing skeleton + tokens + fonts; Layout / Header / MegaMenu / Footer / WhatsAppFab / Loader / VectorGround; `company.ts` + `nav.ts`.
2. **Motion core** — `useGsap`, `useReducedMotion`, `<Reveal>`, `<Marquee>`, `<Counter>`; hero load-in on a stub Home.
3. **EMI engine** — `lib/emi.ts` + tests (TDD) → `<EmiForm/Summary/AmortisationTable/BalanceChart>` → `/emi-calculator/` + homepage teaser.
4. **Content pages** — all §7.2 routes with real content modules; accordion FAQ; How-Solar-Works SVG diagrams; blog article.
5. **Shop** — `products.ts`, shop list + client filter, category pages, product template, WhatsApp enquiry.
6. **Homepage assembly** — all 13 blocks + energy schematic + live meter.
7. **SEO + a11y pass** — `<Seo>`, JSON-LD, sitemap/robots, redirects, focus/keyboard/reduced-motion audit.
8. **Media integration** — drop in AI assets, responsive images, video, OG cards.
9. **Perf + Lighthouse** — budget check, lazy/`content-visibility`, GA-on-idle, final Lighthouse run.
10. **Deploy** — `gh-pages` branch, CNAME/`.nojekyll`, (optional) Actions.
