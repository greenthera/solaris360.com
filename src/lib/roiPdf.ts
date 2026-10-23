import type { RoiInput, RoiResult } from './roi'
import type { LeadContact } from './leads'
import { loadJsPdf, drawHeader, drawFooter, drawPreparedFor, M, NAVY, ORANGE, SECTION_GAP, pdfHeading, pdfCard, fitPdfText } from './pdfShared'

type Color = [number, number, number]
const MUTED: Color = [119, 116, 118]
const ORANGE_TINT: Color = [253, 244, 229]

/** Card-based overview and financial results, followed by the chart and schedule. */
export async function downloadRoiPdf(input: RoiInput, res: RoiResult, contact: LeadContact, currency: string) {
  const { jsPDF, autoTable } = await loadJsPdf()
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight()
  const contentW = pageW - M * 2
  const money = (n: number) => `${currency === 'INR' ? 'Rs' : currency} ${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  const num = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 })

  drawHeader(doc, 'Solar return on investment estimate')
  let y = drawPreparedFor(doc, contact) + SECTION_GAP

  if (y + 470 > pageH - 60) { doc.addPage(); y = 52 }
  y = pdfHeading(doc, 'System Overview', y)
  const gap = 8, colW = (contentW - gap * 2) / 3
  const overview = [
    ['System Size', `${input.systemSize.toFixed(1)} kWp`],
    ['Installation Cost', money(input.systemCost)],
    ['Electricity Price', `${moneyDecimal(input.electricityPrice)} / kWh`],
    ['Export Tariff', `${moneyDecimal(input.exportTariff)} / kWh`],
    ['Specific Yield', `${num(input.specificYield)} kWh/kWp/yr`],
    ['Panel Degradation', `${input.degradationRate.toFixed(2)}% / yr`],
    ['Inflation', `${input.electricityInflation.toFixed(1)}% / yr`],
    ['Self-Consumption', `${input.selfConsumption}%`],
    ['System Lifetime', `${input.systemLifetime} years`],
  ]
  overview.forEach(([label, value], i) => pdfCard(doc, M + i % 3 * (colW + gap), y + Math.floor(i / 3) * 50, colW, 44, label, value))
  y += 3 * 50 + 20
  y = pdfHeading(doc, 'Financial Results', y)
  const results: [string, string, string, Color][] = [
    ['Annual Generation', `${num(res.annualGeneration)} kWh`, 'Year 1 output', ORANGE],
    ['Annual Savings', money(res.annualSavings), 'Year 1 savings', ORANGE],
    ['Payback Period', Number.isFinite(res.paybackPeriod) ? `${res.paybackPeriod.toFixed(1)} Yr` : 'Not reached', 'Simple payback', ORANGE],
    ['Total Savings', money(res.totalSavings), `Over ${input.systemLifetime} years`, ORANGE],
    ['Net Profit', money(res.netProfit), 'After system cost', ORANGE],
    ['ROI', input.systemCost > 0 ? `${num(res.roi)}%` : 'Not applicable', 'Return on investment', ORANGE],
  ]
  results.forEach(([label, value, sub, accent], i) => pdfCard(doc, M + i % 3 * (colW + gap), y + Math.floor(i / 3) * 78, colW, 72, label, value, sub, accent))
  y += 2 * 78 + 16
  doc.setFillColor(...ORANGE_TINT); doc.roundedRect(M, y, contentW, 40, 8, 8, 'F')
  doc.setFillColor(...ORANGE); doc.rect(M, y, 7, 40, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...NAVY)
  fitPdfText(doc, `CO2 Reduction: ${res.co2Reduction.toFixed(1)} tonnes over ${input.systemLifetime} years (~${num(Math.round(res.co2Reduction * 45))} trees equivalent)`, M + 20, y + 24, contentW - 34, 9)

  doc.setFont('helvetica', 'normal'); doc.setTextColor(...MUTED)
  fitPdfText(doc, `Cost per kW: ${money(input.systemCost / input.systemSize)}  |  Break-even: ${res.breakEvenYear ? 'Year ' + res.breakEvenYear : 'not reached within system lifetime'}`, M, y + 58, contentW, 8)

  doc.addPage()
  y = pdfHeading(doc, 'Net position over the system lifetime', 52) + 14
  const chartH = 160, plotL = M + 70, chartW = pageW - M - plotL
  const low = Math.min(-input.systemCost, 0), high = Math.max(1, res.netProfit), span = high - low
  const px = (i: number) => plotL + i / (res.rows.length - 1) * chartW
  const py = (v: number) => y + (high - v) / span * chartH
  doc.setFontSize(7)
  for (let k = 0; k <= 4; k++) {
    const v = low + span * k / 4
    doc.setDrawColor(220); doc.setLineWidth(0.5); doc.line(plotL, py(v), pageW - M, py(v))
    doc.setTextColor(120, 116, 118); doc.text(money(v), plotL - 5, py(v) + 2, { align: 'right' })
  }
  doc.setDrawColor(...NAVY); doc.setLineDashPattern([4, 3], 0); doc.line(plotL, py(0), pageW - M, py(0)); doc.setLineDashPattern([], 0)
  doc.setDrawColor(...ORANGE); doc.setLineWidth(1.5)
  const tickCount = Math.min(6, res.rows.length)
  const ticks = new Set(Array.from({ length: tickCount }, (_, i) =>
    Math.round(i / (tickCount - 1) * (res.rows.length - 1)),
  ))
  res.rows.forEach((row, i) => {
    if (i) doc.line(px(i - 1), py(res.rows[i - 1].netPosition), px(i), py(row.netPosition))
    if (ticks.has(i)) {
      doc.setTextColor(120, 116, 118)
      doc.text(`Y${row.year}`, px(i), y + chartH + 14, { align: 'center' })
    }
  })
  // Draw markers after the line so every year remains clearly visible.
  doc.setDrawColor(...ORANGE)
  doc.setFillColor(...NAVY)
  doc.setLineWidth(1)
  res.rows.forEach((row, i) => {
    const radius = row.year === res.breakEvenYear ? 3.5 : 2
    doc.circle(px(i), py(row.netPosition), radius, 'FD')
  })
  y += chartH + 40
  doc.setFontSize(8.5); doc.setTextColor(90, 90, 100)
  const note = doc.splitTextToSize('Generation = size x specific yield, reduced by annual degradation. Savings = self-consumed energy x retail tariff + exported energy x export tariff, with annual tariff inflation. Net position subtracts installation cost. Yield includes system losses; no extra loss deduction or discount rate is applied. CO2 assumes 0.5 kg/kWh.', pageW - M * 2)
  doc.text(note, M, y)
  y += note.length * doc.getLineHeight() + SECTION_GAP
  if (y + 80 > pageH - 60) { doc.addPage(); y = 60 }
  y = pdfHeading(doc, 'Year-by-year breakdown', y)
  autoTable(doc, {
    startY: y, margin: { left: M, right: M, top: 30, bottom: 50 }, theme: 'striped',
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontSize: 8.5 }, styles: { fontSize: 8, cellPadding: 3, halign: 'right' },
    columnStyles: { 0: { halign: 'left' } },
    head: [['Year', 'Generation (kWh)', `Savings (${currency})`, `Cumulative (${currency})`, `Net position (${currency})`]],
    body: res.rows.map(row => [String(row.year), num(row.generation), num(row.savings), num(row.cumulativeSavings), num(row.netPosition)]),
  })
  drawFooter(doc, 'Indicative estimate. Actual generation and savings depend on site conditions, tariffs and system performance.')
  doc.save('solaris360-roi-estimate.pdf')

  function moneyDecimal(n: number) { return `${currency === 'INR' ? 'Rs' : currency} ${n.toLocaleString('en-IN', { maximumFractionDigits: 4 })}` }
}
