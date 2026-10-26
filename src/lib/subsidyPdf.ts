import type { LeadContact } from './leads'
import { subsidyApplicationSteps, subsidyGuideCopy, subsidyPage, subsidySources } from '../content/subsidy'
import { subsidyBreakdown, subsidyRateFields, type SubsidyInput, type SubsidyRates, type SubsidyResult } from './subsidy'
import { loadJsPdf, drawHeader, drawFooter, drawPreparedFor, pdfHeading, pdfCard, M, NAVY, ORANGE, rs } from './pdfShared'

export async function downloadSubsidyPdf(input: SubsidyInput, rates: SubsidyRates, result: SubsidyResult, contact: LeadContact) {
  const { jsPDF, autoTable } = await loadJsPdf()
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const width = doc.internal.pageSize.getWidth() - M * 2
  drawHeader(doc, 'Gujarat solar subsidy estimate')
  let y = drawPreparedFor(doc, contact) + 26
  if (y + 160 > doc.internal.pageSize.getHeight() - 60) { doc.addPage(); y = 52 }
  y = pdfHeading(doc, result.customized ? 'Subsidy summary - custom scenario' : 'Estimated subsidy summary', y)
  const colW = (width - 16) / 3
  ;[
    ['Central subsidy', rs(result.central), 'PM Surya Ghar'],
    ['Gujarat subsidy', rs(result.state), result.stateEligible ? 'Estimated state top-up' : 'Not included'],
    ['You pay', rs(result.youPay), 'After estimated subsidy'],
  ].forEach(([label, value, sub], i) => pdfCard(doc, M + i * (colW + 8), y, colW, 72, label, value, sub, ORANGE))
  y += 100
  y = pdfHeading(doc, 'Full breakdown', y)
  autoTable(doc, {
    startY: y, margin: { left: M, right: M, top: 36, bottom: 58 }, theme: 'striped',
    headStyles: { fillColor: NAVY, fontSize: 9 }, styles: { fontSize: 8.5, cellPadding: 4 },
    columnStyles: { 1: { halign: 'right' } }, head: [['Item', 'Amount']], body: subsidyBreakdown(input, result),
  })
  doc.addPage()
  y = pdfHeading(doc, 'Rates and eligibility assumptions', 52)
  const rateRows = subsidyRateFields.map(({ key, label, suffix }) => [label, `${rates[key].toLocaleString('en-IN')} ${suffix.replace('₹', 'Rs')}`])
  autoTable(doc, {
    startY: y, margin: { left: M, right: M, top: 36, bottom: 58 }, theme: 'striped',
    headStyles: { fillColor: NAVY }, styles: { fontSize: 8.5, cellPadding: 3.5 }, columnStyles: { 1: { halign: 'right' } },
    head: [['Assumption', 'Value']], body: [...rateRows,
      ['Gujarat residential consumer', input.residential ? 'Yes' : 'No'],
      ['Commissioned on/after 22 October 2026 (or planned)', input.commissionedAfterPolicy ? 'Yes' : 'No'],
      ['Existing system received central assistance', input.existingCapacity > 0 ? input.existingCentralAid ? 'Yes' : 'No' : 'No existing system'],
      ['State top-up included in this estimate', result.stateEligible ? 'Yes (subject to approval)' : 'No'],
      ['Rate basis', result.customized ? 'Custom scenario' : 'Published default assumptions'],
    ],
  })
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  const bottom = doc.internal.pageSize.getHeight() - 68
  // Core PDF fonts do not contain the rupee symbol or typographic punctuation.
  const pdfText = (text: string) => text.replaceAll('₹', 'Rs ').replace(/[–—]/g, '-').replace(/[‘’]/g, "'")
  const paragraph = (text: string) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...NAVY)
    const lines: string[] = doc.splitTextToSize(pdfText(text), width)
    // Keep short paragraphs and list items together, avoiding a single stranded line.
    if (lines.length <= 4 && y + lines.length * 11 > bottom) { doc.addPage(); y = 46 }
    for (const line of lines) {
      if (y + 11 > bottom) { doc.addPage(); y = 46 }
      doc.text(line, M, y); y += 11
    }
    y += 7
  }
  const heading = (text: string) => {
    // Consistent separation above each title, with room for its opening text.
    const top = y + 16
    if (top + 66 > bottom) { doc.addPage(); y = 46 }
    else y = top
    y = pdfHeading(doc, text, y)
  }
  if (result.notices.length) {
    heading('Notes for your estimate')
    result.notices.forEach(note => paragraph(`- ${note}`))
  }
  heading('How your subsidy is calculated')
  paragraph(`Benchmark cost: first 2 kWp at Rs ${rates.benchmarkFirstTwo.toLocaleString('en-IN')}/kWp, then Rs ${rates.benchmarkAboveTwo.toLocaleString('en-IN')}/kWp above 2 kWp. Central rates: Rs ${rates.centralFirstTwo.toLocaleString('en-IN')}/kWp for the first 2 kWp and Rs ${rates.centralThird.toLocaleString('en-IN')} for the third kWp, accounting for prior aided capacity where applicable.`)
  paragraph(`Your selected category is ${input.category === 'scst' ? 'SC / ST' : 'General'}, with a benchmark contribution of ${result.contributionPct}%. For an eligible system, Gujarat top-up = benchmark cost - eligible central subsidy - benchmark contribution (minimum zero). The selected combined-capacity limit is ${rates.stateCapacityLimit} kWp.`)
  paragraph('You pay = vendor quotation (or benchmark if none entered) - central subsidy - Gujarat top-up, with a minimum of zero. Any quotation above the benchmark is paid by you.')
  heading('Eligibility for the Gujarat top-up')
  paragraph('The following conditions describe the reported default framework. Custom rates change your scenario, not the notified eligibility rules.')
  subsidyGuideCopy.eligibility.forEach(condition => paragraph(`- ${condition}`))
  heading('How to apply')
  subsidyApplicationSteps.forEach((step, index) => paragraph(`${index + 1}. ${step}`))
  heading('What this estimate does not cover')
  paragraph(subsidyGuideCopy.exclusions)
  paragraph('Generation assumes 1,400 units/kWp/year, all valued at your entered electricity rate. Simple payback divides your estimated payment by yearly savings. Exports credited at a different tariff, maintenance, degradation, financing and future tariff changes can change your actual return.')
  paragraph(`Gujarat announcement: ${subsidyPage.policyDate}. Assumptions reviewed: ${subsidyPage.reviewedDate}. State estimates follow the reported framework; confirm the final figure with the National Portal and your DISCOM before signing with a vendor.`)
  heading('Sources and application')
  for (const source of subsidySources) {
    if (y + 16 > bottom) { doc.addPage(); y = 46 }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...NAVY)
    doc.textWithLink(source.label, M, y, { url: source.url }); y += 16
  }
  drawFooter(doc, 'Indicative subsidy estimate. Eligibility and payment are subject to National Portal and DISCOM approval.')
  doc.save('solaris360-gujarat-solar-subsidy-estimate.pdf')
}
