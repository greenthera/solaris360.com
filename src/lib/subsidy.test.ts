import { describe, expect, it } from 'vitest'
import { calcSubsidy, defaultSubsidyInput, defaultSubsidyRates, subsidyRatesCustomized, validSubsidyInput } from './subsidy'

describe('Gujarat subsidy calculator', () => {
  it.each([
    [1.74, 'general', 87000, 52200, 26100, 8700],
    [1.74, 'scst', 87000, 52200, 30450, 4350],
    [2, 'general', 100000, 60000, 30000, 10000],
    [2, 'scst', 100000, 60000, 35000, 5000],
    [2.18, 'general', 108100, 63240, 34050, 10810],
    [2.18, 'scst', 108100, 63240, 39455, 5405],
  ] as const)('matches worked example for %s kWp, %s', (capacity, category, benchmark, central, state, youPay) => {
    const result = calcSubsidy({ ...defaultSubsidyInput, capacity, category })
    expect(result).toMatchObject({ benchmark, central, state, youPay, stateEligible: true })
    expect(result.central + result.state + result.youPay).toBe(result.costBasis)
  })
  it('excludes the entire state top-up immediately beyond the capacity boundary', () => {
    expect(calcSubsidy({ ...defaultSubsidyInput, capacity: 2.18 }).stateEligible).toBe(true)
    expect(calcSubsidy({ ...defaultSubsidyInput, capacity: 2.1801 }).state).toBe(0)
    const result = calcSubsidy({ ...defaultSubsidyInput, capacity: 3 })
    expect(result).toMatchObject({ central: 78000, state: 0, stateEligible: false, benchmark: 145000, youPay: 67000 })
    expect(calcSubsidy({ ...defaultSubsidyInput, capacity: 10 }).central).toBe(78000)
  })
  it('checks total installed capacity and central aid already used by an existing system', () => {
    expect(calcSubsidy({ ...defaultSubsidyInput, capacity: 1, existingCapacity: 1.18 }).stateEligible).toBe(true)
    expect(calcSubsidy({ ...defaultSubsidyInput, capacity: 1, existingCapacity: 1.19 }).stateEligible).toBe(false)
    // MNRE guideline example: 1 kWp previously aided, expanded to 4 kWp -> Rs 48,000 more.
    expect(calcSubsidy({ ...defaultSubsidyInput, capacity: 3, existingCapacity: 1 }).central).toBe(48000)
    expect(calcSubsidy({ ...defaultSubsidyInput, existingCapacity: 3 }).central).toBe(0)
    expect(calcSubsidy({ ...defaultSubsidyInput, capacity: 3, existingCapacity: 1, existingCentralAid: false }).central).toBe(78000)
  })
  it('checks commissioning and residential eligibility', () => {
    expect(calcSubsidy({ ...defaultSubsidyInput, commissionedAfterPolicy: false })).toMatchObject({ central: 60000, state: 0 })
    expect(calcSubsidy({ ...defaultSubsidyInput, residential: false })).toMatchObject({ central: 0, state: 0, youPay: 100000 })
  })
  it('uses the quotation while keeping the subsidy based on published benchmark rates', () => {
    expect(calcSubsidy({ ...defaultSubsidyInput, quotation: 120000 })).toMatchObject({ central: 60000, state: 30000, youPay: 30000, extraOverBenchmark: 20000 })
    const low = calcSubsidy({ ...defaultSubsidyInput, quotation: 80000 })
    expect(low.youPay).toBe(0)
    expect(low.notices.join(' ')).toContain('below the estimated subsidy')
  })
  it('computes first-year generation, savings and simple payback', () => {
    const result = calcSubsidy({ ...defaultSubsidyInput })
    expect(result.annualGeneration).toBe(2800)
    expect(result.annualSavings).toBe(19600)
    expect(result.paybackYears).toBeCloseTo(10000 / 19600)
    expect(calcSubsidy({ ...defaultSubsidyInput, tariff: 0 }).paybackYears).toBeNull()
  })
  it('supports editable rates and marks scenarios explicitly', () => {
    const rates = { ...defaultSubsidyRates, generalContributionPct: 20 }
    expect(calcSubsidy({ ...defaultSubsidyInput }, rates)).toMatchObject({ state: 20000, youPay: 20000, customized: true })
    expect(subsidyRatesCustomized(defaultSubsidyRates)).toBe(false)
    expect(calcSubsidy({ ...defaultSubsidyInput }, { ...defaultSubsidyRates, benchmarkFirstTwo: 0 }).state).toBe(0)
  })
  it('rejects invalid, blank and non-finite values', () => {
    for (const patch of [{ capacity: NaN }, { capacity: 0 }, { existingCapacity: -1 }, { quotation: 0 }, { quotation: Infinity }, { tariff: -1 }]) {
      expect(validSubsidyInput({ ...defaultSubsidyInput, ...patch }, defaultSubsidyRates)).toBe(false)
      expect(() => calcSubsidy({ ...defaultSubsidyInput, ...patch })).toThrow()
    }
    expect(() => calcSubsidy({ ...defaultSubsidyInput }, { ...defaultSubsidyRates, generalContributionPct: 101 })).toThrow()
  })
})
