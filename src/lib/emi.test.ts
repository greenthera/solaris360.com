import { describe, it, expect } from 'vitest'
import { pmt, calcEmi } from './emi'

describe('pmt', () => {
  it('matches a known amortisation payment', () => {
    // ₹100000 over 12 months at 12% p.a. (1%/month) -> ~8884.88
    expect(pmt(0.01, 12, 100000)).toBeCloseTo(8884.88, 2)
  })
  it('handles zero rate', () => {
    expect(pmt(0, 10, 5000)).toBe(500)
  })
  it('handles zero periods', () => {
    expect(pmt(0.01, 0, 5000)).toBe(0)
  })
})

describe('calcEmi (reducing balance)', () => {
  it('matches the standard bank EMI', () => {
    // ₹4,00,000 over 60 months at 9% p.a. -> ₹8,303.34 / month
    const r = calcEmi({ price: 400000, months: 60, ratePct: 9 })
    expect(r.monthlyEmi).toBeCloseTo(8303.34, 2)
    expect(r.totalPayment).toBeCloseTo(8303.34 * 60, 0)
    expect(r.totalInterest).toBeCloseTo(r.totalPayment - 400000, 6)
  })

  it('has no interest at 0%', () => {
    const r = calcEmi({ price: 120000, months: 12, ratePct: 0 })
    expect(r.monthlyEmi).toBe(10000)
    expect(r.totalInterest).toBe(0)
    expect(r.totalPayment).toBe(120000)
  })

  it('builds a schedule that pays the loan off exactly', () => {
    const r = calcEmi({ price: 400000, months: 60, ratePct: 9 })
    expect(r.rows).toHaveLength(60)
    expect(r.rows[0].opening).toBe(400000)
    expect(r.rows[0].interest).toBeCloseTo(3000, 6) // 400000 x 9% / 12
    expect(r.rows.at(-1)!.closing).toBe(0)
    const paid = r.rows.reduce((s, row) => s + row.principal, 0)
    const interest = r.rows.reduce((s, row) => s + row.interest, 0)
    expect(paid).toBeCloseTo(400000, 4)
    expect(interest).toBeCloseTo(r.totalInterest, 4)
  })

  it('costs more interest over a longer tenure', () => {
    const short = calcEmi({ price: 400000, months: 36, ratePct: 9 })
    const long = calcEmi({ price: 400000, months: 84, ratePct: 9 })
    expect(long.monthlyEmi).toBeLessThan(short.monthlyEmi)
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest)
  })
})
