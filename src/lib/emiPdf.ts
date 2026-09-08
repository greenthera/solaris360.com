import type { AdvancedResult, AmortRow, SimpleEmiResult } from './emi'
import { company } from '../content/company'
import logoDataUrl from '../assets/logo-pdf.png?inline'

/** Intrinsic size (px) of logo-pdf.png -> keeps the PDF placement in proportion. */
const LOGO_W = 360
const LOGO_H = 106

const WA_URL = `https://wa.me/${company.phone.mainDigits}`
const dashless = (s: string) => s.replace(/[–—]/g, '-')

/** ₹ isn't in jsPDF's core fonts, so PDFs use "Rs". */
const rsFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
const rs = (n: number) => `Rs ${rsFmt.format(Math.round(n))}`

const ORANGE: [number, number, number] = [243, 160, 46]
const NAVY: [number, number, number] = [23, 22, 63]
const M = 40

async function loadJsPdf() {
  const [{ jsPDF }, autoTableMod] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  return { jsPDF, autoTable: autoTableMod.default }
}

function drawHeader(doc: import('jspdf').jsPDF) {
  const pageW = doc.internal.pageSize.getWidth()
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageW, 74, 'F')

  // logo (light artwork, sits on the navy bar) -> links to the site
  const logoH = 22
  const logoW = (LOGO_W / LOGO_H) * logoH
  doc.addImage(logoDataUrl, 'PNG', M, 16, logoW, logoH, 'sol-logo', 'SLOW')
  doc.link(M, 16, logoW, logoH, { url: company.domain })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text('Solar loan EMI estimate', M, 58)
  doc.setFontSize(9)
  doc.setTextColor(210, 210, 220)
  doc.text(
    `Generated ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    pageW - M,
    32,
    { align: 'right' },
  )
  doc.text('Indicative only', pageW - M, 50, { align: 'right' })
}

function drawFooter(doc: import('jspdf').jsPDF, note: string) {
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const pages = doc.getNumberOfPages()
  const GREY: [number, number, number] = [120, 116, 118]
  const waLabel = `wa.me/${company.phone.mainDigits}`

  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    doc.setFontSize(7.5)

    // line 1: brand (-> website) + address (-> map) + WhatsApp (-> wa.me)
    let x = M
    const y1 = pageH - 34
    doc.setTextColor(...ORANGE)
    doc.textWithLink('Solaris360', x, y1, { url: company.domain })
    x += doc.getTextWidth('Solaris360')
    doc.setTextColor(...GREY)
    const mid = `, ${dashless(company.displayAddress)}   `
    doc.text(mid, x, y1)
    doc.link(x, y1 - 6, doc.getTextWidth(mid), 8, { url: company.mapUrl })
    x += doc.getTextWidth(mid)
    doc.setTextColor(...ORANGE)
    doc.textWithLink(waLabel, x, y1, { url: WA_URL })

    // line 2: the model / disclaimer note
    doc.setTextColor(...GREY)
    doc.text(note, M, pageH - 24)

    // line 3: developed by Shivantra (-> shivantra.com)
    doc.text('Developed by ', M, pageH - 14)
    const w = doc.getTextWidth('Developed by ')
    doc.setTextColor(...ORANGE)
    doc.textWithLink(company.developer.name, M + w, pageH - 14, { url: company.developer.url })

    // page number
    doc.setTextColor(...GREY)
    doc.text(`Page ${p} / ${pages}`, pageW - M, y1, { align: 'right' })
  }
}

type Row = [string, string]

function keyValueTable(
  doc: import('jspdf').jsPDF,
  autoTable: Awaited<ReturnType<typeof loadJsPdf>>['autoTable'],
  label: string,
  rows: Row[],
  y: number,
): number {
  const yy = section(doc, label, y, M)
  autoTable(doc, {
    startY: yy,
    margin: { left: M, right: M },
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: { 0: { textColor: [90, 90, 100] }, 1: { halign: 'right', fontStyle: 'bold' } },
    body: rows,
  })
  return afterTable(doc)
}

export interface SimpleEmiPdfInput {
  price: number
  months: number
}

export async function downloadSimpleEmiPdf(input: SimpleEmiPdfInput, res: SimpleEmiResult) {
  const { jsPDF, autoTable } = await loadJsPdf()
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  drawHeader(doc)
  let y = 98

  y =
    keyValueTable(doc, autoTable, 'Your inputs', [
      ['Solar system price (incl. GST)', rs(input.price)],
      ['Tenure', `${input.months} months`],
      ['Down payment', '20%'],
      ['Flat interest rate', '9% p.a.'],
    ], y) + 20

  y =
    keyValueTable(doc, autoTable, 'Summary', [
      ['Monthly EMI', rs(res.monthlyEmi)],
      ['Down payment (20%)', rs(res.downPayment)],
      ['Loan amount (80%)', rs(res.loanAmount)],
      ['Total interest', rs(res.totalInterest)],
      ['Total payment', rs(res.totalPayment)],
    ], y) + 24

  doc.setFontSize(9)
  doc.setTextColor(90, 90, 100)
  doc.text(
    doc.splitTextToSize(
      'Simple model: 20% down payment, 80% financed at a flat 9% p.a. Total interest = loan x 9% x years; EMI = (loan + total interest) / months. For a lender-grade reducing-balance schedule with fees, GST and subsidy, use the Advanced mode.',
      doc.internal.pageSize.getWidth() - M * 2,
    ),
    M,
    y,
  )

  drawFooter(doc, 'Indicative estimate. The final EMI depends on your lender policies, processing fees and charges.')
  doc.save('solaris360-emi-estimate.pdf')
}

export interface EmiPdfInput {
  assetPrice: number
  loanAmount: number
  flatRatePct: number
  months: number
  processingFeePct: number
  advanceEmiMonths: number
  useSubsidy: boolean
  subsidy: number
  subsidyMonth: number
}

export async function downloadEmiPdf(input: EmiPdfInput, res: AdvancedResult) {
  const { jsPDF, autoTable } = await loadJsPdf()

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()

  drawHeader(doc)
  let y = 98

  // ---- inputs ----------------------------------------------------------
  y =
    keyValueTable(doc, autoTable, 'Your inputs', [
      ['Asset price', rs(input.assetPrice)],
      ['Loan amount', rs(input.loanAmount)],
      ['Flat interest rate', `${input.flatRatePct}% p.a.`],
      ['Tenor', `${input.months} months`],
      ['Processing fee', `${input.processingFeePct}%`],
      ['Advance EMI', `${input.advanceEmiMonths} months`],
      [
        'Subsidy prepayment (PM Surya Ghar)',
        input.useSubsidy ? `${rs(input.subsidy)} in month ${input.subsidyMonth}` : 'Not applied',
      ],
    ], y) + 18

  // ---- summary -------------------------------------------------------
  const summaryRows: Row[] = [
    ['Reducing rate p.a. (equivalent)', `${res.reducingRatePct.toFixed(2)}%`],
    ['Monthly EMI', rs(res.emi)],
    ...(res.emiAfterSubsidy ? ([['EMI after subsidy', rs(res.emiAfterSubsidy)]] as Row[]) : []),
    ['Total interest', rs(res.totalInterest)],
    ['Total payment', rs(res.totalPayment)],
    ['Processing fee + 18% GST', `${rs(res.processingFee)} + ${rs(res.processingFeeGst)}`],
    ['Stamp fee', rs(res.stampFee)],
    ['Margin money (down payment)', rs(res.marginMoney)],
    ['Advance EMI payable', rs(res.advancePayable)],
    ['Outlay at disbursal', rs(res.disbursalOutlay)],
  ]
  y = keyValueTable(doc, autoTable, 'Summary', summaryRows, y) + 22

  // ---- balance chart ----------------------------------------------------
  if (y + 210 > pageH - 60) {
    doc.addPage()
    y = 60
  }
  y = section(doc, 'Outstanding balance over the term', y, M)
  drawBalanceChart(doc, res.rows, M, y, pageW - M * 2, 180, ORANGE)
  y += 180 + 28

  // ---- schedule -------------------------------------------------------
  if (y + 80 > pageH - 60) {
    doc.addPage()
    y = 60
  }
  y = section(doc, 'Amortisation schedule', y, M)
  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    theme: 'striped',
    headStyles: { fillColor: NAVY, fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5, halign: 'right' },
    columnStyles: { 0: { halign: 'left' }, 6: { halign: 'left', textColor: ORANGE } },
    head: [['Month', 'Opening', 'EMI', 'Interest', 'Principal', 'Closing', 'Note']],
    body: res.rows.map((r) => [
      String(r.month),
      rs(r.opening),
      rs(r.emi),
      rs(r.interest),
      rs(r.principal),
      rs(r.closing),
      (r.note ?? '').replace(/₹\s?/g, 'Rs '),
    ]),
  })

  drawFooter(
    doc,
    'Flat rate is converted to an equivalent reducing-balance rate. Figures depend on the lender and the disbursement date.',
  )
  doc.save('solaris360-emi-estimate.pdf')
}

/* ------------------------------------------------------------------ */

function section(doc: import('jspdf').jsPDF, label: string, y: number, x: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(23, 22, 63)
  doc.text(label, x, y)
  doc.setDrawColor(243, 160, 46)
  doc.setLineWidth(1.5)
  doc.line(x, y + 5, x + 26, y + 5)
  doc.setFont('helvetica', 'normal')
  return y + 16
}

function afterTable(doc: import('jspdf').jsPDF): number {
  // jspdf-autotable stashes the finished table on the doc
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
}

function drawBalanceChart(
  doc: import('jspdf').jsPDF,
  rows: AmortRow[],
  x: number,
  y: number,
  w: number,
  h: number,
  orange: [number, number, number],
) {
  const n = rows.length
  const maxBal = Math.max(...rows.map((r) => r.opening))
  const step = niceStep(maxBal / 4)
  const top = step * Math.ceil(maxBal / step)
  const plotL = x + 60

  const px = (i: number) => plotL + (i / (n - 1)) * (w - 60)
  const py = (v: number) => y + (1 - v / top) * h

  // gridlines + y labels
  doc.setFontSize(7)
  doc.setLineWidth(0.5)
  for (let k = 0; k <= 4; k++) {
    const v = (top / 4) * k
    doc.setDrawColor(k === 0 ? 150 : 220)
    doc.line(plotL, py(v), x + w, py(v))
    doc.setTextColor(120, 116, 118)
    doc.text(rs(v), plotL - 4, py(v) + 2.5, { align: 'right' })
  }

  // x labels (~6) + value callouts
  const count = Math.min(6, n)
  const ticks = Array.from({ length: count }, (_, k) => Math.round((k / (count - 1)) * (n - 1))).filter(
    (v, i, a) => a.indexOf(v) === i,
  )
  for (const i of ticks) {
    doc.setTextColor(120, 116, 118)
    doc.text(`M${rows[i].month}`, px(i), y + h + 12, { align: 'center' })
    doc.setFillColor(23, 22, 63)
    doc.circle(px(i), py(rows[i].opening), 1.6, 'F')
    doc.setTextColor(23, 22, 63)
    doc.text(
      rs(rows[i].opening),
      px(i),
      py(rows[i].opening) - 5,
      { align: i === 0 ? 'left' : i === n - 1 ? 'right' : 'center' },
    )
  }

  // series
  doc.setDrawColor(...orange)
  doc.setLineWidth(1.2)
  for (let i = 1; i < n; i++) {
    doc.line(px(i - 1), py(rows[i - 1].opening), px(i), py(rows[i].opening))
  }
}

function niceStep(v: number): number {
  if (v <= 0) return 1
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / mag
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nice * mag
}
