import { describe, expect, it } from 'vitest'
import { calcRoi, decodeRoiShare, encodeRoiShare, validRoiInput } from './roi'
import { defaultRoiInput, defaultRoiSettings } from './roiDefaults'

const sampleInput = { ...defaultRoiInput(defaultRoiSettings), systemCost: 10000, specificYield: 1500, electricityPrice: 0.14, exportTariff: 0.07, electricityInflation: 3 }

describe('ROI financial calculations', () => {
  it('matches known savings, returns and year-by-year net positions', () => {
    const r = calcRoi(sampleInput)
    expect(r.annualGeneration).toBe(15000)
    expect(r.annualSavings).toBeCloseTo(1785, 8)
    expect(r.paybackPeriod).toBeCloseTo(5.60224, 5)
    expect(Math.round(r.totalSavings)).toBe(60853)
    expect(Math.round(r.netProfit)).toBe(50853)
    expect(Math.round(r.roi)).toBe(509)
    expect(r.co2Reduction).toBeCloseTo(176.7, 1)
    expect(r.breakEvenYear).toBe(6)
    expect(r.rows[0].netPosition).toBeCloseTo(-8215)
    expect(Math.round(r.rows[5].netPosition)).toBe(1398)
  })
  it('applies degradation to output and inflation to both tariff components', () => {
    const r = calcRoi({ ...sampleInput, degradationRate: 1, electricityInflation: 10 })
    expect(r.rows[1].generation).toBe(14850)
    expect(r.rows[1].savings).toBeCloseTo(1785 * 0.99 * 1.1, 8)
    expect(r.rows.at(-1)!.cumulativeSavings).toBeCloseTo(r.totalSavings, 8)
    expect(r.rows.at(-1)!.netPosition).toBeCloseTo(r.netProfit, 8)
  })
  it('handles no savings, zero installation cost and no break-even', () => {
    const none = calcRoi({ ...sampleInput, electricityPrice: 0, exportTariff: 0 })
    expect(none.paybackPeriod).toBe(Infinity)
    expect(none.breakEvenYear).toBeNull()
    expect(none.roi).toBe(-100)
    const free = calcRoi({ ...sampleInput, systemCost: 0 })
    expect(free.paybackPeriod).toBe(0)
    expect(free.roi).toBe(0)
    expect(free.breakEvenYear).toBe(1)
  })
  it('handles full self-consumption and full export independently', () => {
    expect(calcRoi({ ...sampleInput, selfConsumption: 100 }).annualSavings).toBeCloseTo(2100)
    expect(calcRoi({ ...sampleInput, selfConsumption: 0 }).annualSavings).toBeCloseTo(1050)
  })
  it('rejects invalid data, non-finite numbers and fractional lifetimes', () => {
    for (const change of [{ systemSize: 0 }, { systemLifetime: 25.5 }, { systemLifetime: 5000 }, { systemCost: -1 }, { electricityPrice: NaN }, { selfConsumption: 101 }]) {
      expect(validRoiInput({ ...sampleInput, ...change })).toBe(false)
      expect(() => calcRoi({ ...sampleInput, ...change })).toThrow()
    }
  })
})
describe('ROI sharing and settings', () => {
  it('round trips inputs and currency without contact data', () => {
    const encoded = encodeRoiShare(sampleInput, 'INR', '₹')
    expect(decodeRoiShare(`#share=${encoded}`)).toEqual({ input: sampleInput, currency: 'INR', symbol: '₹' })
    expect(decodeRoiShare('#share=invalid')).toBeNull()
    expect(decodeRoiShare(`#share=${btoa(encodeURIComponent(JSON.stringify({ input: { ...sampleInput, systemLifetime: 1e6 }, currency: 'USD', symbol: '$' })))}`)).toBeNull()
  })
  it('uses fixed Indian defaults for the single-page calculator', () => {
    expect(defaultRoiSettings.currency).toBe('INR')
    expect(defaultRoiInput(defaultRoiSettings).systemCost).toBe(400000)
  })
})
