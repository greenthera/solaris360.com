# Solaris360 website

Responsive rooftop solar EPC website for Solaris360 in Surat, Gujarat. Built with React 19, TypeScript, Vite 8, `vite-react-ssg`, and Tailwind CSS v4. Pages are statically generated for SEO and hosted on GitHub Pages with the custom domain `solaris360.com`.

The site uses navy and orange branding, self-hosted fonts, responsive images, vector backgrounds, scroll reveals, and animated solar illustrations. Motion respects `prefers-reduced-motion`.

## Production status

The Solaris360 production website is live at `https://solaris360.com`, served over HTTPS with an SSL certificate.

## Development

```bash
npm ci
npm run dev
```

The current Vite base is `/`. Open the local URL printed by Vite; calculator routes are `/emi-calculator/`, `/roi-calculator/`, and `/gujarat-solar-subsidy-calculator/`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check, generate static pages, and run sitemap/HTML post-processing |
| `npm run preview` | Serve the production build from `dist/` |
| `npm test` | Run EMI, ROI, subsidy, and lead-validation unit tests |
| `npm run lint` | Run ESLint |
| `npm run check:seo` | Validate the built pages, metadata, images, internal links, sitemap, and 404 |
| `npm run og` | Generate per-page social images in `public/og/` using Playwright |
| `npm run deploy` | Build and publish `dist/` to the `gh-pages` branch |

## Calculators and PDF reports

- **EMI Calculator:** estimates monthly payments, total interest, and total repayment using a reducing-balance loan model. Includes a balance chart and full amortisation schedule.
- **ROI Calculator:** estimates annual generation and savings, simple payback, lifetime returns, break-even year, and CO2 reduction. Includes advanced assumptions, an interactive chart, a yearly breakdown, reset, and share links.
- **Gujarat Solar Subsidy Calculator:** estimates central assistance, Gujarat top-up, customer contribution, generation, and payback, with General/SC-ST categories, existing capacity, quotations, eligibility controls, and editable assumptions. See [implementation and policy notes](docs/gujarat-solar-subsidy-calculator.md).
- **Lead capture:** all calculators reuse contact fields and validation. Name and Indian mobile number are required; email is optional for EMI/ROI and required for the subsidy report. Report requests submit a lead to the shared Google Form. Its cross-origin `no-cors` response cannot confirm receipt, and network failure does not prevent downloading a report.
- **PDF export:** jsPDF reports share the Solaris360 logo header, linked footer, recipient card, navy/orange styling, and overview/result cards. EMI/ROI reports include charts and schedules; subsidy reports include the financial breakdown, rates, eligibility assumptions, and sources. PDFs use `Rs` for INR with the existing PDF fonts.
- **Sharing:** ROI links contain calculation inputs and currency metadata, without contact details. Calculations and report generation run locally and do not depend on an external calculator website.

The Contact page separately opens WhatsApp with a message the visitor can review and send.

## Browser verification

With the development server running, use:

```bash
ROI_TEST_BASE_URL=http://localhost:5173/ node scripts/check-roi.mjs
SUBSIDY_TEST_BASE_URL=http://localhost:5173/ node scripts/check-subsidy.mjs
```

Change the URL if Vite selects a different port. To test a production preview, run `npm run build` and `npm run preview`, then use its URL, typically `http://localhost:4173/`.

Run `npm run check:seo` after building to validate the deployable HTML and metadata.

The browser script checks calculations, contact validation, chart tooltips, sharing, PDF downloads for both calculators, and responsive layouts at four screen widths. Test lead requests are intercepted so they do not reach the live Google Form. Screenshots and PDFs are saved outside the repository in the temporary directory printed by the script. Install the Playwright browser if needed with `npx playwright install chromium`.

## Project structure

```text
src/
  routes.tsx                 Route definitions and lazy page imports
  pages/                     Home, service, company, calculator, contact, and legal pages
  content/
    company.ts               Shared company details and WhatsApp helpers
    nav.ts                   Header and footer navigation
    roi/copy.json            ROI calculator text
    legal/                   Legal page content
  components/
    layout/                  Header, navigation, footer, SEO, loader, and WhatsApp button
    ui/                      Shared hero, sections, contact fields, and visual primitives
    home/                    Homepage sections and solar animations
    emi/                     EMI input controls and balance chart
    roi/                     ROI fields and interactive chart
  lib/
    emi.ts, roi.ts            Pure calculation models
    roiDefaults.ts           Default ROI inputs and currency
    leads.ts                 Shared lead validation and submission
    emiPdf.ts, roiPdf.ts      Calculator PDF reports
    pdfShared.ts             Shared PDF layout and branding utilities
    schema.ts                Structured data helpers
    analytics.ts             Page-view and conversion tracking
    cookieConsent*.ts        Consent management
    responsiveImages.ts      Responsive image helpers
  assets/                    Images, logos, and self-hosted fonts
  styles/                    Site styles and scoped ROI styles
scripts/
  gen-sitemap.mjs             Build post-processing, sitemap, robots, and legacy redirects
  gen-og.mjs                  Social image generation
  check-roi.mjs               Browser verification for calculator flows
public/                      Static files, social images, domain configuration, and media
docs/                        Implementation notes and project specifications
```

## Content and deployment

Company contact details, addresses, and social links are maintained in `src/content/company.ts`. Navigation is maintained in `src/content/nav.ts`. Legal copy lives in `src/content/legal/`, and the calculator implementation is documented in [docs/roi-calculator.md](docs/roi-calculator.md).

The build writes static HTML to `dist/`, generates `sitemap.xml` and `robots.txt`, creates meta-refresh redirects for supported legacy URLs, and includes font licences. GitHub Pages uses `public/CNAME` for the custom domain. Keep `vite.config.ts`, company/SEO URLs, and the sitemap origin consistent when changing the hosting domain or base path.

Social images are generated separately with `npm run og`; regenerate them after updating the page list, titles, or imagery in `scripts/gen-og.mjs`, then rebuild to include them in `dist/`.
