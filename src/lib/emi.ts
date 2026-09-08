/**
 * EMI maths for the Solaris360 solar-loan calculator.
 *
 * Two models, matching the two reference calculators the client sent:
 *  - Simple  -> zodiacenergy.com/emi-calculator.php  (20% down, 80% loan,
 *               flat 9% p.a., EMI = (loan + flat interest) / months)
 *  - Advanced -> ecofysolaremicalculator.com          (flat rate converted to a
 *               reducing rate, standard PMT amortisation, processing fee + 18%
 *               GST, stamp fee, margin money, optional subsidy prepayment,
 *               full month-by-month schedule)
 *
 * All functions are pure. Currency is plain numbers (₹); round at the edges.
 */

export interface SimpleEmiInput {
  price: number
  months: number
  downPct?: number
  flatRatePct?: number
}

export interface SimpleEmiResult {
  downPayment: number
  loanAmount: number
  monthlyEmi: number
  totalInterest: number
  totalPayment: number
}

/** zodiacenergy model. */
export function simpleEmi({
  price,
  months,
  downPct = 0.2,
  flatRatePct = 9,
}: SimpleEmiInput): SimpleEmiResult {
  const downPayment = price * downPct
  const loanAmount = price - downPayment
  const years = months / 12
  const totalInterest = loanAmount * (flatRatePct / 100) * years
  const totalPayment = loanAmount + totalInterest
  const monthlyEmi = months > 0 ? totalPayment / months : 0
  return { downPayment, loanAmount, monthlyEmi, totalInterest, totalPayment }
}

/** Standard PMT: level payment that amortises `pv` over `n` periods at periodic `rate`. */
export function pmt(rate: number, n: number, pv: number): number {
  if (n <= 0) return 0
  if (rate === 0) return pv / n
  const f = Math.pow(1 + rate, n)
  return (rate * pv * f) / (f - 1)
}

/**
 * RATE: the periodic interest rate that makes a level `payment` amortise `pv`
 * over `n` periods. pmt() is strictly increasing in rate, so bisection is
 * exact and can't diverge. Returns the periodic rate; ×12 for nominal annual.
 */
export function periodicRate(n: number, payment: number, pv: number): number {
  if (payment <= pv / n) return 0 // payment can't cover principal -> no positive rate
  let lo = 0
  let hi = 1 // 100% per period is a safe upper bound for any real loan
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (pmt(mid, n, pv) > payment) hi = mid
    else lo = mid
    if (hi - lo < 1e-12) break
  }
  return (lo + hi) / 2
}

/** Convert a flat annual rate to the equivalent reducing-balance annual rate (%). */
export function flatToReducingRatePct(loan: number, months: number, flatRatePct: number): number {
  const years = months / 12
  const flatInterest = loan * (flatRatePct / 100) * years
  const flatEmi = (loan + flatInterest) / months
  const r = periodicRate(months, flatEmi, loan)
  return r * 12 * 100
}

export function processingFee(loan: number, pct: number) {
  const fee = loan * (pct / 100)
  return { fee, gst: fee * 0.18, total: fee * 1.18 }
}

/** Ecofy's stamp-fee formula: 0.22% of the amount, rounded to the nearest ₹100. */
export function stampFee(amount: number): number {
  return Math.round((amount * 0.0022) / 100) * 100
}

export interface AmortRow {
  month: number
  opening: number
  emi: number
  interest: number
  principal: number
  closing: number
  note?: string
}

export interface AdvancedInput {
  assetPrice: number
  loanAmount: number
  months: number
  /** flat rate p.a. - converted to reducing internally */
  flatRatePct?: number
  processingFeePct?: number
  advanceEmiMonths?: number
  subsidy?: number
  subsidyMonth?: number
}

export interface AdvancedResult {
  reducingRatePct: number
  emi: number
  emiAfterSubsidy: number | null
  totalInterest: number
  totalPayment: number
  advancePayable: number
  processingFee: number
  processingFeeGst: number
  stampFee: number
  marginMoney: number
  disbursalOutlay: number
  rows: AmortRow[]
}

export function advancedEmi({
  assetPrice,
  loanAmount,
  months,
  flatRatePct = 9,
  processingFeePct = 2,
  advanceEmiMonths = 0,
  subsidy = 0,
  subsidyMonth = 0,
}: AdvancedInput): AdvancedResult {
  const reducingRatePct = flatToReducingRatePct(loanAmount, months, flatRatePct)
  const r = reducingRatePct / 1200
  const baseEmi = pmt(r, months, loanAmount)

  const rows: AmortRow[] = []
  let balance = loanAmount
  let emi = baseEmi
  let emiAfterSubsidy: number | null = null
  let totalInterest = 0

  for (let m = 1; m <= months && balance > 0.005; m++) {
    const interest = balance * r
    let principal = emi - interest
    let note: string | undefined

    if (subsidy > 0 && subsidyMonth === m) {
      // lump-sum prepayment at the end of this month, then re-amortise the rest
      const afterSubsidyBalance = Math.max(balance - principal - subsidy, 0)
      note = `Subsidy ₹${Math.round(subsidy).toLocaleString('en-IN')} applied`
      rows.push({
        month: m,
        opening: balance,
        emi,
        interest,
        principal: emi - interest,
        closing: afterSubsidyBalance,
        note,
      })
      totalInterest += interest
      balance = afterSubsidyBalance
      if (balance > 0.005) {
        emi = pmt(r, months - m, balance)
        emiAfterSubsidy = emi
      }
      continue
    }

    if (principal > balance) principal = balance
    const closing = Math.max(balance - principal, 0)
    rows.push({ month: m, opening: balance, emi: interest + principal, interest, principal, closing, note })
    totalInterest += interest
    balance = closing
  }

  const totalPayment = loanAmount + totalInterest
  const pf = processingFee(loanAmount, processingFeePct)
  const marginMoney = Math.max(assetPrice - loanAmount, 0)
  const advancePayable = advanceEmiMonths * baseEmi
  const sf = stampFee(loanAmount)

  return {
    reducingRatePct,
    emi: baseEmi,
    emiAfterSubsidy,
    totalInterest,
    totalPayment,
    advancePayable,
    processingFee: pf.fee,
    processingFeeGst: pf.gst,
    stampFee: sf,
    marginMoney,
    disbursalOutlay: marginMoney + pf.total + sf + advancePayable,
    rows,
  }
}
