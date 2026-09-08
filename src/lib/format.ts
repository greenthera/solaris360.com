const inrFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** ₹ 1,23,456 (Indian grouping, no decimals). */
export function inr(n: number): string {
  return `₹ ${inrFmt.format(Math.round(n))}`
}

/** 1,23,456 without the symbol. */
export function inrPlain(n: number): string {
  return inrFmt.format(Math.round(n))
}
