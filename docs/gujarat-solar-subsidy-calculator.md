# Gujarat solar subsidy calculator

Route: `/gujarat-solar-subsidy-calculator/`. The model is self-contained; no reference-site requests or calculations run at runtime.

## Policy basis and limits

The requested reference was https://akdet.com/gujarat-solar-subsidy-calculator/ (reviewed 26 October 2026). Its reported 22 October Gujarat framework is implemented with explicit eligibility assumptions. The original state government resolution could not be independently retrieved. State figures remain indicative and must be confirmed with the consumer's DISCOM.

Central assistance uses the [official MNRE residential CFA guidelines hosted by MGVCL](https://www.mgvcl.com/Upload/solarpower/2024/MNRE%20OPERATIONAL%20GUIDELINE%20CFA%2007-06-24.pdf): Rs 30,000/kW for the first 2 kW and Rs 18,000 for the third kW, capped at Rs 78,000 at default rates. For an already subsidized system, assistance is the difference between assistance at combined capacity and assistance at existing capacity. This deliberately corrects the reference's first-time subsidy treatment of expansions.

Default benchmark cost is Rs 50,000/kW for the first 2 kW plus Rs 45,000/kW above 2 kW. Reported Gujarat eligibility requires a residential consumer, commissioning on/after 22 October 2026, and combined DC capacity at most 2.18 kWp. State top-up is the non-negative difference between benchmark, central assistance and the household contribution (10% General, 5% SC/ST). Eligibility and restrictions are displayed on the page and report.

Customer payment is the non-negative difference between quotation (or benchmark if blank) and total estimated assistance. A low quotation triggers a confirmation note; no subsidy surplus is treated as cash. Generation is 1,400 units/kWp/year; savings value every unit at the supplied tariff. Payback excludes maintenance, financing and export-credit differences. Custom rates are prominently identified as scenarios.

## Implementation

- `src/lib/subsidy.ts`: pure calculation, boundaries, validation and report rows.
- `src/content/subsidy.ts`: page metadata, eligibility copy, FAQs and sources.
- `src/pages/GujaratSolarSubsidyCalculator.tsx`: responsive controls, results and report form.
- `src/components/subsidy/SubsidyChart.tsx`: keyboard, hover and tap funding chart.
- `src/lib/subsidyPdf.ts`: shared branded PDF helpers, full breakdown, assumptions and sources.
- `src/styles/subsidy.css`: scoped styles.

Name, Indian mobile and email are required before the new PDF download. Existing EMI/ROI email remains optional. Shared Google Form submission runs before PDF generation; its existing `no-cors` transport cannot independently confirm receipt and does not block downloads on a network failure. No new storage service or dependency was added. The lead includes contact details and financial estimates; it does not send a separate category/caste field. Privacy copy explains calculator lead collection.

SEO includes static HTML, unique title/description, canonical, Open Graph/Twitter image, WebApplication and FAQ structured data, breadcrumbs, navigation and sitemap. Regenerate only this social image with `OG_SLUG=gujarat-solar-subsidy-calculator npm run og`, then rebuild.

## Verification

`npm test`, `npm run lint`, `npm run build`, `npm run check:seo`.

With a production preview on port 4173, run `node scripts/check-subsidy.mjs`. Override `SUBSIDY_TEST_BASE_URL` for another port. The script checks policy examples, the 2.18 kWp boundary, quotations, prior aid, rate validation/reset, eligibility, required contacts, intercepted Google Form payloads, PDF download, chart access and four viewport widths. Test leads never reach Google. PDF/screenshots are written outside the repository.

Use `ROI_TEST_BASE_URL=http://127.0.0.1:4173/ node scripts/check-roi.mjs` for existing calculator regression checks.
