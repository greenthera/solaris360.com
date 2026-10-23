import type { AmortRow, EmiInput, EmiResult } from './emi'
import type { LeadContact } from './leads'
import { loadJsPdf, drawHeader, drawFooter, drawPreparedFor, pdfHeading, pdfCard, rs, ORANGE, M, NAVY, SECTION_GAP, CHART_TOP, CHART_H, CHART_BOTTOM } from './pdfShared'

export async function downloadEmiPdf(input: EmiInput, res: EmiResult, contact: LeadContact) {
  const { jsPDF, autoTable } = await loadJsPdf()
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  drawHeader(doc)
  let y = drawPreparedFor(doc, contact) + SECTION_GAP

  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const gap = 8, cardW = (pageW - M * 2 - gap * 2) / 3
  if (y + 250 > pageH - 60) { doc.addPage(); y = 60 }
  y = pdfHeading(doc, 'Loan Overview', y)
  const inputs = [
    ['Solar system price (incl. GST)', rs(input.price)],
    ['Loan Tenure', `${input.months} months`],
    ['Interest Rate', `${input.ratePct}% p.a.`],
  ]
  inputs.forEach(([label, value], i) => pdfCard(doc, M + i * (cardW + gap), y, cardW, 44, label, value))
  y += 44 + SECTION_GAP
  y = pdfHeading(doc, 'Financial Results', y)
  const summary = [
    ['Monthly EMI', rs(res.monthlyEmi), 'Monthly loan payment'],
    ['Total Interest', rs(res.totalInterest), 'Over the loan tenure'],
    ['Total Payment', rs(res.totalPayment), 'Principal plus interest'],
  ]
  summary.forEach(([label, value, sub], i) => pdfCard(doc, M + i * (cardW + gap), y, cardW, 72, label, value, sub, ORANGE))
  y += 72 + SECTION_GAP

  // Keep the calculation method beside the financial results.
  doc.setFontSize(8.5)
  doc.setTextColor(90, 90, 100)
  const note = doc.splitTextToSize(
    'Standard reducing-balance EMI on the full system price: EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where r is the monthly interest rate and n the number of months.',
    pageW - M * 2,
  )
  doc.text(note, M + 3, y)
  y += note.length * doc.getLineHeight() + SECTION_GAP

  // ---- balance chart ----------------------------------------------------
  if (y + 22 + CHART_TOP + CHART_H + CHART_BOTTOM > pageH - 60) {
    doc.addPage()
    y = 60
  }
  y = pdfHeading(doc, 'Outstanding balance over the term', y)
  drawBalanceChart(doc, res.rows, M, y + CHART_TOP, pageW - M * 2, CHART_H, ORANGE)
  y += CHART_TOP + CHART_H + CHART_BOTTOM + SECTION_GAP

  // ---- schedule -------------------------------------------------------
  if (y + 80 > pageH - 60) {
    doc.addPage()
    y = 60
  }
  y = pdfHeading(doc, 'Amortisation schedule', y)
  autoTable(doc, {
    startY: y,
    // top only applies to continuation pages; bottom stays ~10pt clear of the footer
    margin: { left: M, right: M, top: 30, bottom: 50 },
    theme: 'striped',
    headStyles: { fillColor: NAVY, fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5, halign: 'right' },
    columnStyles: { 0: { halign: 'left' } },
    head: [[{ content: 'Month', styles: { halign: 'left' } }, 'Opening', 'EMI', 'Interest', 'Principal', 'Closing']],
    body: res.rows.map((r) => [
      String(r.month),
      rs(r.opening),
      rs(r.emi),
      rs(r.interest),
      rs(r.principal),
      rs(r.closing),
    ]),
  })

  drawFooter(doc, 'Indicative estimate. The final EMI depends on your lender policies, processing fees and charges.')
  doc.save('solaris360-emi-estimate.pdf')
}

/* ------------------------------------------------------------------ */

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
