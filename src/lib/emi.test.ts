import { describe, it, expect } from 'vitest'
import {
  simpleEmi,
  pmt,
  periodicRate,
  flatToReducingRatePct,
  processingFee,
  stampFee,
  advancedEmi,
} from './emi'

describe('simpleEmi (zodiacenergy model)', () => {
  it('splits 20% down / 80% loan and uses flat interest', () => {
    const r = simpleEmi({ price: 400000, months: 60 })
    expect(r.downPayment).toBe(80000)
    expect(r.loanAmount).toBe(320000)
    // 320000 * 9% * 5yr = 144000
    expect(r.totalInterest).toBe(144000)
    expect(r.totalPayment).toBe(464000)
    expect(r.monthlyEmi).toBeCloseTo(7733.33, 2)
  })

  it('honours custom down payment and rate', () => {
    const r = simpleEmi({ price: 100000, months: 12, downPct: 0, flatRatePct: 0 })
    expect(r.loanAmount).toBe(100000)
    expect(r.totalInterest).toBe(0)
    expect(r.monthlyEmi).toBeCloseTo(8333.33, 2)
  })
})

describe('pmt', () => {
  it('matches a known amortisation payment', () => {
    // ₹100000 over 12 months at 12% p.a. (1%/month) -> ~8884.88
    expect(pmt(0.01, 12, 100000)).toBeCloseTo(8884.88, 2)
  })
  it('handles zero rate', () => {
    expect(pmt(0, 10, 5000)).toBe(500)
  })
})

describe('periodicRate', () => {
  it('inverts pmt', () => {
    const payment = pmt(0.0075, 36, 250000)
    expect(periodicRate(36, payment, 250000)).toBeCloseTo(0.0075, 6)
  })
})

describe('flatToReducingRatePct', () => {
  it('a 9% flat rate is a higher reducing rate', () => {
    const reducing = flatToReducingRatePct(320000, 60, 9)
    expect(reducing).toBeGreaterThan(9)
    expect(reducing).toBeLessThan(18)
  })
})

describe('fees', () => {
  it('processing fee adds 18% GST', () => {
    const pf = processingFee(320000, 2)
    expect(pf.fee).toBe(6400)
    expect(pf.gst).toBeCloseTo(1152, 2)
    expect(pf.total).toBeCloseTo(7552, 2)
  })
  it('stamp fee is 0.22% rounded to nearest 100', () => {
    expect(stampFee(320000)).toBe(700) // 0.0022*320000 = 704 -> 700
    expect(stampFee(500000)).toBe(1100) // 1100 exactly
  })
})

describe('advancedEmi', () => {
  const base = advancedEmi({
    assetPrice: 400000,
    loanAmount: 320000,
    months: 60,
    flatRatePct: 9,
    processingFeePct: 2,
    advanceEmiMonths: 3,
  })

  it('produces a full schedule that pays the loan off', () => {
    expect(base.rows).toHaveLength(60)
    expect(base.rows[59].closing).toBeLessThan(1)
  })

  it('first row interest + principal equals the EMI', () => {
    const row = base.rows[0]
    expect(row.interest + row.principal).toBeCloseTo(base.emi, 6)
    expect(row.opening).toBe(320000)
  })

  it('total payment = principal + total interest', () => {
    expect(base.totalPayment).toBeCloseTo(320000 + base.totalInterest, 2)
  })

  it('margin money is asset price minus loan', () => {
    expect(base.marginMoney).toBe(80000)
  })

  it('advance payable is N EMIs', () => {
    expect(base.advancePayable).toBeCloseTo(3 * base.emi, 6)
  })

  it('a subsidy prepayment lowers the post-subsidy EMI and total interest', () => {
    const withSub = advancedEmi({
      assetPrice: 400000,
      loanAmount: 320000,
      months: 60,
      flatRatePct: 9,
      subsidy: 78000,
      subsidyMonth: 3,
    })
    expect(withSub.emiAfterSubsidy).not.toBeNull()
    expect(withSub.emiAfterSubsidy!).toBeLessThan(withSub.emi)
    expect(withSub.totalInterest).toBeLessThan(base.totalInterest)
    expect(withSub.rows.some((r) => r.note?.includes('Subsidy'))).toBe(true)
  })
})
