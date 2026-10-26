// Generates the per-page social share (Open Graph) images: public/og/<slug>.jpg,
// 1200x630, each page's own photo with the Solaris360 logo, page title and one line.
// Rendered with Playwright so they use the site's own fonts. Run after adding a page
// or changing a title:  npm run og   (Seo.tsx picks /og/<slug>.jpg from the page path)
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'

const ASSETS = 'src/assets'
const OUT = 'public/og'

/** slug = page path without slashes ('' -> home). Keep in step with the routes. */
const pages = [
  { slug: 'home', title: 'Let your roof catch the sun', line: 'Rooftop solar EPC for homes and businesses in Surat', image: 'solaris-india-industrial.webp' },
  { slug: 'about', title: 'About Solaris 360', line: 'Rooftop solar power EPC for Surat', image: 'solaris-square-about.webp' },
  { slug: 'why-solar', title: 'Why go solar', line: 'Save up to 60% against grid power and diesel', image: 'solaris-square-why-solar.webp' },
  { slug: 'why-us', title: 'Why Solaris 360', line: 'One accountable team, from design to commissioning', image: 'solaris-square-why-us.webp' },
  // review figures from src/content/company.ts (reviews.count / reviews.average)
  { slug: 'reviews', title: 'Customer reviews', line: 'Rated 5.0 across 104 Google reviews', image: 'solaris-panorama-about.webp' },
  { slug: 'epc-services', title: 'Solar EPC services', line: 'Design, approvals, supply, installation and commissioning', image: 'solaris-square-epc.webp' },
  { slug: 'solar-pv-system', title: 'Solar PV systems', line: 'Off-grid, grid-connected and hybrid, explained', image: 'solaris-square-pv-system.webp' },
  { slug: 'system-features', title: 'System features', line: '25-year module and 10-year inverter warranty', image: 'solaris-square-features.webp' },
  { slug: 'project-gallery', title: 'Project gallery', line: 'Residential, commercial and industrial rooftop solar', image: 'solaris-india-structure.webp' },
  { slug: 'execution-process', title: 'Execution process', line: 'Proposal, GEDA approval and installation', image: 'solaris-india-consultation.webp' },
  { slug: 'how-solar-power-works', title: 'How solar power works', line: 'System components, current flow and net metering', image: 'solaris-india-residential.webp' },
  { slug: 'faq', title: 'Solar questions, answered', line: 'Plant size, power cuts, roof area and more', image: 'solaris-india-service.webp' },
  { slug: 'useful-links', title: 'Useful solar links', line: 'Surya Gujarat, GEDA, Torrent Power and DGVCL', image: 'solaris-india-residential.webp' },
  { slug: 'emi-calculator', title: 'Solar loan EMI calculator', line: 'Monthly EMI, total interest and full schedule', image: 'solaris-india-consultation.webp' },
  { slug: 'gujarat-solar-subsidy-calculator', title: 'Gujarat solar subsidy calculator', line: 'Central subsidy, Gujarat top-up and your solar cost', image: 'solaris-india-residential.webp' },
  { slug: 'roi-calculator', title: 'Solar ROI calculator', line: 'Savings, payback and lifetime returns', image: 'solaris-india-residential.webp' },
  { slug: 'contact', title: 'Contact Solaris360', line: 'Palladium, VIP Road, Vesu, Surat', image: 'solaris-india-consultation.webp' },
  { slug: 'warranty', title: 'Warranty', line: 'Solar modules, inverter and plant service cover', image: 'solaris-india-service.webp' },
  { slug: 'terms', title: 'Terms and conditions', line: 'Using the Solaris360 website and services', image: 'solaris-india-industrial.webp' },
  { slug: 'privacy', title: 'Privacy policy', line: 'How we collect, use and protect your information', image: 'solaris-india-industrial.webp' },
  { slug: 'returns', title: 'Return and cancellation policy', line: 'Cancelling an order, returns and replacements', image: 'solaris-india-industrial.webp' },
  { slug: 'shipping', title: 'Shipping and transportation', line: 'Delivery, tracking and transport charges', image: 'solaris-india-industrial.webp' },
]

const dataUrl = (file, type) => `data:${type};base64,${readFileSync(file).toString('base64')}`
const sora = dataUrl(join(ASSETS, 'fonts/sora-latin-400.woff2'), 'font/woff2') // variable: 100-800
const inter = dataUrl(join(ASSETS, 'fonts/inter-latin-400.woff2'), 'font/woff2') // variable
const logo = dataUrl(join(ASSETS, 'logo-light.png'), 'image/png')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const html = (p) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Sora; src: url(${sora}) format('woff2'); font-weight: 100 800; }
@font-face { font-family: Inter; src: url(${inter}) format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #0f0e24; color: #fdfdfc; }
.photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
/* text side stays dark for contrast; the photo shows through on the right */
.shade { position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(15,14,36,.97) 0%, rgba(15,14,36,.9) 42%, rgba(15,14,36,.45) 75%, rgba(15,14,36,.2) 100%); }
.card { position: relative; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; }
.logo { height: 46px; width: auto; align-self: flex-start; }
.text { margin-top: auto; max-width: 760px; }
h1 { font: 700 68px/1.06 Sora, sans-serif; letter-spacing: -0.025em; text-wrap: balance; }
p { margin-top: 22px; font: 400 29px/1.35 Inter, sans-serif; color: #d4d2e6; }
.site { margin-top: 40px; padding-top: 22px; border-top: 3px solid #f3a02e; width: 120px;
  font: 600 22px/1 Inter, sans-serif; color: #f3a02e; white-space: nowrap; }
</style></head><body>
<img class="photo" src="${dataUrl(join(ASSETS, p.image), 'image/webp')}" alt="">
<div class="shade"></div>
<div class="card">
  <img class="logo" src="${logo}" alt="Solaris360">
  <div class="text"><h1>${esc(p.title)}</h1><p>${esc(p.line)}</p><div class="site">solaris360.com</div></div>
</div></body></html>`

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
const selectedPages = process.env.OG_SLUG ? pages.filter(p => p.slug === process.env.OG_SLUG) : pages
if (!selectedPages.length) throw new Error('Unknown OG_SLUG')
for (const p of selectedPages) {
  await page.setContent(html(p), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(OUT, `${p.slug}.jpg`), type: 'jpeg', quality: 82 })
}
await browser.close()
console.log(`[og] ${selectedPages.length} images written to ${OUT}/`)
