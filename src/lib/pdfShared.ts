import type { LeadContact } from './leads'
import { company } from '../content/company'
import logoDataUrl from '../assets/logo-mark.png?inline'

/** Intrinsic size (px) of logo-mark.png -> keeps the PDF placement in proportion. */
const LOGO_W = 380
const LOGO_H = 78

const WA_URL = `https://wa.me/${company.phone.mainDigits}`
const dashless = (s: string) => s.replace(/[–—]/g, '-')

/** ₹ isn't in jsPDF's core fonts, so PDFs use "Rs". */
const rsFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
export const rs = (n: number) => `Rs ${rsFmt.format(Math.round(n))}`

export const ORANGE: [number, number, number] = [243, 160, 46]
export const NAVY: [number, number, number] = [23, 22, 63]
/** Shivantra brand colour (#01014f) for the "Developed by" credit. */
const SHIVANTRA: [number, number, number] = [1, 1, 79]
export const M = 40
export const SECTION_GAP = 24
/** room above the chart for its value labels (drawn just above each point) */
export const CHART_TOP = 14
export const CHART_H = 180
/** room below the chart for the month labels */
export const CHART_BOTTOM = 16

export async function loadJsPdf() {
  const [{ jsPDF }, autoTableMod] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  return { jsPDF, autoTable: autoTableMod.default }
}

export function drawHeader(doc: import('jspdf').jsPDF, title = 'Solar loan EMI estimate') {
  const pageW = doc.internal.pageSize.getWidth()
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageW, 74, 'F')

  // logo (light artwork, sits on the navy bar) -> links to the site
  const logoH = 19
  const logoW = (LOGO_W / LOGO_H) * logoH
  doc.addImage(logoDataUrl, 'PNG', M, 18, logoW, logoH, 'sol-logo', 'SLOW')
  doc.link(M, 18, logoW, logoH, { url: company.domain })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text(title, M, 58)
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

export function drawFooter(doc: import('jspdf').jsPDF, note: string) {
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const pages = doc.getNumberOfPages()
  const GREY: [number, number, number] = [120, 116, 118]
  // show the number itself (still links to WhatsApp): "+91 9998117531"
  const waLabel = `+91 ${company.phone.mainDigits.replace(/^91/, '')}`

  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    doc.setFontSize(7.5)

    // line 1: brand (-> website) + address (-> map) + phone number (-> WhatsApp)
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
    doc.setTextColor(...SHIVANTRA)
    doc.textWithLink(company.developer.name, M + w, pageH - 14, { url: company.developer.url })

    // page number
    doc.setTextColor(...GREY)
    doc.text(`Page ${p} / ${pages}`, pageW - M, y1, { align: 'right' })
  }
}

const PDF_MUTED: [number, number, number] = [119, 116, 118]
const PDF_CARD: [number, number, number] = [247, 247, 249]

export function pdfHeading(doc: import('jspdf').jsPDF, label: string, top: number) {
  doc.setFillColor(...ORANGE); doc.rect(M, top - 12, 6, 18, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(...NAVY)
  doc.text(label, M + 15, top + 1)
  doc.setFont('helvetica', 'normal')
  return top + 22
}
export function fitPdfText(doc: import('jspdf').jsPDF, text: string, x: number, baseline: number, width: number, size: number) {
  doc.setFontSize(size)
  while (doc.getTextWidth(text) > width && size > 7) { size -= 0.5; doc.setFontSize(size) }
  doc.text(text, x, baseline)
}
export function pdfCard(doc: import('jspdf').jsPDF, x: number, top: number, width: number, height: number, label: string, value: string, sub?: string, accent?: [number, number, number]) {
  doc.setFillColor(...PDF_CARD); doc.roundedRect(x, top, width, height, 7, 7, 'F')
  if (accent) { doc.setFillColor(...accent); doc.roundedRect(x, top, width, 7, 3.5, 3.5, 'F') }
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...PDF_MUTED)
  fitPdfText(doc, label, x + 12, top + (accent ? 29 : 16), width - 24, 8)
  doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY)
  fitPdfText(doc, value, x + 12, top + (accent ? 47 : 33), width - 24, accent ? 13 : 10)
  if (sub) {
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...PDF_MUTED)
    fitPdfText(doc, sub, x + 12, top + 62, width - 24, 7.5)
  }
}

/** Shared recipient card; wraps long names and omits the email column when absent. */
export function drawPreparedFor(doc: import('jspdf').jsPDF, contact: LeadContact, top = 98): number {
  const width = doc.internal.pageSize.getWidth() - M * 2
  const x = M + 20
  const innerW = width - 40
  const hasEmail = Boolean(contact.email.trim())
  const columnW = hasEmail ? (innerW - 24) / 2 : innerW
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15)
  const nameLines: string[] = doc.splitTextToSize(contact.name.trim(), innerW)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
  const phoneLines: string[] = doc.splitTextToSize(contact.phone.trim(), columnW)
  const emailLines: string[] = hasEmail ? doc.splitTextToSize(contact.email.trim(), columnW) : []
  const padding = 21
  const nameY = top + padding + 17
  const detailsY = nameY + nameLines.length * 18 + 17
  const valuesY = detailsY + 15
  const contentBottom = valuesY + (Math.max(phoneLines.length, emailLines.length) - 1) * 13 + 10
  const height = contentBottom - top + padding
  doc.setFillColor(...PDF_CARD); doc.roundedRect(M, top, width, height, 8, 8, 'F')
  doc.setFillColor(...ORANGE); doc.roundedRect(M, top + padding, 4, height - padding * 2, 2, 2, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...PDF_MUTED)
  doc.text('PREPARED FOR', x, top + padding, { baseline: 'top' })
  doc.setFontSize(15); doc.setTextColor(...NAVY)
  doc.text(nameLines, x, nameY, { baseline: 'top', lineHeightFactor: 1.2 })
  doc.setDrawColor(226, 225, 232); doc.setLineWidth(0.5)
  doc.line(x, detailsY - 11, x + innerW, detailsY - 11)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...PDF_MUTED)
  doc.text('PHONE', x, detailsY, { baseline: 'top' })
  if (hasEmail) doc.text('EMAIL', x + columnW + 24, detailsY, { baseline: 'top' })
  doc.setFontSize(10); doc.setTextColor(...NAVY)
  doc.text(phoneLines, x, valuesY, { baseline: 'top', lineHeightFactor: 1.3 })
  if (hasEmail) doc.text(emailLines, x + columnW + 24, valuesY, { baseline: 'top', lineHeightFactor: 1.3 })
  return top + height
}
