import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
const artifacts = await fs.mkdtemp(path.join(os.tmpdir(), 'solaris-roi-check-'))
const browser = await chromium.launch({headless:true})
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads:true, permissions:['clipboard-read','clipboard-write'] })
const page = await context.newPage()
const errors=[];page.on('pageerror', e=>errors.push(e.message))
const leads=[]
await context.route('https://docs.google.com/forms/**', async route=> { leads.push(new URLSearchParams(route.request().postData()));await route.fulfill({status:200,body:''}) })
await context.route('https://www.googletagmanager.com/**', route=>route.abort())
const base = process.env.ROI_TEST_BASE_URL || 'http://127.0.0.1:5173/'
await page.goto(base+'roi-calculator/',{waitUntil:'networkidle'})
await page.getByRole('heading',{name:'Solar ROI Calculator',exact:true}).waitFor()
console.log('default',await page.locator('.roi-metrics').innerText())
await page.locator('#boot').waitFor({state:'detached'});await page.screenshot({path:path.join(artifacts, 'desktop.png'),fullPage:true})
await page.getByRole('button',{name:'Export PDF',exact:true}).click()
assert.equal(await page.locator('[aria-invalid=true]').count(),2)
assert.equal(await page.locator('input[autocomplete=name]').evaluate(el=>el===document.activeElement),true)
assert.equal(leads.length,0)
await page.getByLabel('Name', {exact:false}).fill('ROI Test User')
await page.getByLabel('Phone', {exact:false}).fill('9876543210')
await page.getByLabel('Email', {exact:false}).fill('invalid')
await page.getByRole('button',{name:'Export PDF',exact:true}).click()
assert.equal(await page.locator('[aria-invalid=true]').count(),1)
await page.getByLabel('Email', {exact:false}).fill('roi-test@example.com')
await page.locator('.roi-advanced summary').click()
// Known financial example for checking the rendered results.
await page.getByLabel('Installation Cost', {exact:true}).fill('10000')
await page.getByLabel('Electricity Price', {exact:true}).fill('0.14')
await page.getByLabel('Export Tariff', {exact:true}).fill('0.07')
await page.getByLabel('Specific Yield', {exact:true}).fill('1500')
await page.getByLabel('Electricity Inflation', {exact:true}).fill('3')
assert.match(await page.locator('.roi-metrics').innerText(),/60,853/)
assert.match(await page.locator('.roi-metrics').innerText(),/509%/)
assert.equal(await page.locator('.roi-chart-value').count(),0)
await page.locator('.roi-chart circle[tabindex]').first().hover()
assert.match(await page.getByRole('tooltip').textContent(), /recovering/)
await page.mouse.move(0,0)
assert.equal(await page.getByRole('tooltip').count(),0)
await page.getByLabel('System Size',{exact:true}).fill('20')
assert.equal(await page.getByLabel('Installation Cost',{exact:true}).inputValue(),'800000')
await page.getByLabel('Cost per kW',{exact:true}).fill('1000')
assert.equal(await page.getByLabel('Installation Cost',{exact:true}).inputValue(),'20000')
await page.getByLabel('System Size',{exact:true}).fill('10')
await page.getByLabel('Installation Cost',{exact:true}).fill('10000')
const downloadPromise=page.waitForEvent('download')
await page.getByRole('button',{name:'Export PDF',exact:true}).click()
const download=await downloadPromise;await download.saveAs(path.join(artifacts, 'roi-report.pdf'))
assert.equal(download.suggestedFilename(),'solaris360-roi-estimate.pdf')
assert.equal(leads.length,1)
assert.equal(leads[0].get('entry.764862047'),'ROI calculator')
assert.match(leads[0].get('entry.958728776'),/Specific|specificYield/)
assert.ok((await fs.stat(path.join(artifacts, 'roi-report.pdf'))).size>5000)
const shareButton = page.getByRole('button', { name: 'Share', exact: true })
let shared
if (await shareButton.count()) {
 await shareButton.click()
 shared = await page.evaluate(() => navigator.clipboard.readText())
} else {
 // Outgoing sharing is intentionally hidden; incoming links must still restore.
 const fields = {
  systemSize: 'System Size', systemCost: 'Installation Cost', electricityPrice: 'Electricity Price',
  specificYield: 'Specific Yield', degradationRate: 'Panel Degradation', electricityInflation: 'Electricity Inflation',
  systemLifetime: 'System Lifetime', selfConsumption: 'Self-Consumption', exportTariff: 'Export Tariff',
 }
 const input = Object.fromEntries(await Promise.all(Object.entries(fields).map(async ([key, label]) =>
  [key, Number(await page.getByLabel(label, { exact: true }).inputValue())],
 )))
 const payload = { input, currency: 'INR', symbol: '₹' }
 shared = `${base}roi-calculator/#share=${btoa(encodeURIComponent(JSON.stringify(payload)))}`
}
assert.ok(shared.includes('#share='));assert.ok(!decodeURIComponent(atob(shared.split('#share=')[1])).includes('ROI Test User'))
const sharedPage=await context.newPage();await sharedPage.goto(shared,{waitUntil:'networkidle'});assert.equal(await sharedPage.getByLabel('Installation Cost',{exact:true}).inputValue(),'10000');await sharedPage.close()
await page.getByLabel('Self-Consumption',{exact:true}).fill('101');assert.equal(await page.locator('.roi-metrics').count(),0);assert.equal(await page.getByRole('button',{name:'Export PDF',exact:true}).isDisabled(),true)
await page.getByRole('button',{name:'Reset',exact:true}).click()
assert.equal(await page.getByLabel('Installation Cost',{exact:true}).inputValue(),'400000')
for(const width of [390,768,1024,1440]) {
 await page.setViewportSize({width,height:900});await page.screenshot({path:path.join(artifacts, `responsive-${width}.png`),fullPage:true})
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)
 assert.equal(overflow,false,`overflow at ${width}`)
}
assert.equal(await page.locator('.roi-sidebar, .roi-language, select, input[autocomplete="street-address"]').count(),0)
assert.equal(await page.getByRole('button',{name:'Company Settings',exact:true}).count(),0)
await page.locator('.roi-chart circle[tabindex]').first().focus()
assert.match(await page.locator('.roi-chart-tooltip').textContent(),/Yr 1/)
// Regression: existing EMI PDF still downloads after shared helper extraction.
await page.goto(base+'emi-calculator/',{waitUntil:'networkidle'})
await page.getByLabel('Name',{exact:false}).fill('EMI Test User');await page.getByLabel('Phone',{exact:false}).fill('9876543210')
const emiDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Generate report',exact:true}).click();const emi=await emiDownload;await emi.saveAs(path.join(artifacts, 'emi-report.pdf'));assert.equal(emi.suggestedFilename(),'solaris360-emi-estimate.pdf')
assert.deepEqual(errors,[])
console.log('PASS: calculation parity, cost synchronization, contact validation, intercepted lead payload, ROI/EMI PDF downloads, share roundtrip, invalid inputs, reset, removed controls, 4 responsive widths; no page errors.')
console.log(`Artifacts: ${artifacts}`)
await browser.close()
