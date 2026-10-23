/**
 * EMI maths for the Solaris360 solar-loan calculator.
 *
 * One model: the standard reducing-balance EMI (as bank calculators use) on the
 * full system price - price, months and annual interest rate in; monthly EMI,
 * total interest, total payment and the month-by-month schedule out.
 *
 * All functions are pure. Currency is plain numbers (₹); round at the edges.
 */

/** Standard PMT: level payment that amortises `pv` over `n` periods at periodic `rate`. */
export function pmt(rate: number, n: number, pv: number): number {
  if (n <= 0) return 0
  if (rate === 0) return pv / n
  const f = Math.pow(1 + rate, n)
  return (rate * pv * f) / (f - 1)
}

export interface EmiInput {
  price: number
  months: number
  /** reducing-balance interest rate, % per year */
  ratePct: number
}

export interface AmortRow {
  month: number
  opening: number
  emi: number
  interest: number
  principal: number
  closing: number
}

export interface EmiResult {
  monthlyEmi: number
  totalInterest: number
  totalPayment: number
  rows: AmortRow[]
}

export function calcEmi({ price, months, ratePct }: EmiInput): EmiResult {
  const r = ratePct / 1200
  const monthlyEmi = pmt(r, months, price)

  const rows: AmortRow[] = []
  let balance = price
  for (let m = 1; m <= months; m++) {
    const interest = balance * r
    // last month clears any rounding remainder
    const principal = m === months ? balance : monthlyEmi - interest
    const closing = Math.max(balance - principal, 0)
    rows.push({ month: m, opening: balance, emi: interest + principal, interest, principal, closing })
    balance = closing
  }

  const totalPayment = monthlyEmi * months
  return { monthlyEmi, totalInterest: totalPayment - price, totalPayment, rows }
}
