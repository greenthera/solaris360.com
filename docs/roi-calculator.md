# ROI calculator

Route: `/roi-calculator/` (corrected from `roi-calculater`).
With the current Vite base, preview is `http://localhost:4173/solaris360.com/roi-calculator/`.

The calculator is a single English page with fixed India/INR defaults. Settings/About views, sidebar, language selector, country presets/data, custom branding, settings storage/import/export, and the customer address field were removed. Existing stored settings/language are ignored. Shared calculations still restore their currency metadata so previously shared estimates remain accurate.

The page retains live results, advanced assumptions, cost synchronization, chart, yearly breakdown, reset/share, shared EMI contact validation and PDF reports. Name and Indian mobile number are required; email is optional. Customer address is absent from both form and report. No existing site header/footer, animations or vector assets were changed.

Implementation: `src/pages/RoiCalculator.tsx`, `src/components/roi/{RoiField,RoiChart}.tsx`, `src/lib/{roi,roiDefaults,roiPdf,pdfShared}.ts`, `src/content/roi/copy.json`, and `src/styles/roi.css`. Routes, navigation and generated sitemap use the corrected URL. Shared PDF loading, contact table and footer helpers are also used by the existing EMI PDF. The ROI report uses the original shared Solaris360 header/footer, a three-column system overview, six result cards and a CO2 summary in the site navy/orange palette. The chart and yearly schedule follow on subsequent pages.

The calculator is self-contained: formulas, text, chart rendering, styles and PDF generation are in this project. It does not fetch data, code or assets from the original example website. Changes to that website or its URL have no effect on this calculator. Lead capture continues to use the existing shared Google Form service.

## Calculation model

- First-year generation = system kWp × specific yield.
- Annual savings = self-consumed generation × retail price + exported generation × export tariff.
- Year N generation multiplies first-year generation by `(1 - degradation / 100) ** (N - 1)`.
- Both retail and export tariffs increase by `(1 + inflation / 100) ** (N - 1)`.
- Simple payback = cost / first-year savings; break-even is the first year net position is non-negative.
- Total savings sums yearly savings; net profit subtracts installation cost; ROI divides net profit by cost.
- Chart values show net position after installation cost.
- CO2 = lifetime generation × 0.5 / 1000 tonnes; equivalent trees = round(tonnes × 45).
- Delivered specific yield accounts for system losses; projections are undiscounted. No additional loss deduction or discount rate is applied.
- No savings yields no finite payback. Zero installation cost displays ROI as unavailable rather than dividing by zero.

Known test example: 10 kWp, cost 10,000, yield 1,500, retail tariff 0.14, export tariff 0.07, self-consumption 70%, degradation 0.5%, inflation 3%, 25 years. Results: 15,000 kWh, annual savings 1,785, payback 5.6 years, lifetime savings 60,853, profit 50,853, ROI 509%, CO2 176.7 tonnes, break-even year 6.

Share links contain only validated model parameters and currency. Contact details and address are never serialized or saved to local storage. The calculator no longer reads or writes settings storage.

## Verification

- `npm run build`: TypeScript and SSG build.
- `npm run lint`: ESLint.
- `npm test`: ROI calculations/sharing/defaults plus existing EMI/lead tests.
- Start `npm run dev`, then `node scripts/check-roi.mjs`. Override `ROI_TEST_BASE_URL` to test another server/base path.
- The browser suite checks known financial results, cost synchronization, contact/email validation, invalid numeric inputs, intercepted lead payload, ROI and EMI PDF downloads, sharing without contact data, reset, absence of removed controls, chart keyboard values and layouts at 390/768/1024/1440 px.
- Screenshots/PDFs are written to a temporary folder printed by the browser script. Test leads are intercepted and never sent to the production Google Form.

The existing Google Form utility uses `no-cors`, so receipt in the live Google Sheet cannot be confirmed by browser tests. No commits, pushes or deployments were performed.
