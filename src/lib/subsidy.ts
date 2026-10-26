/** Self-contained Gujarat residential solar subsidy model. Amounts are INR.
 * Central bands: MNRE residential CFA guidelines, including pre-existing aided capacity.
 * State top-up: published 22 October 2026 framework; final eligibility is determined by DISCOM.
 */
export interface SubsidyRates {
  centralFirstTwo: number
  centralThird: number
  benchmarkFirstTwo: number
  benchmarkAboveTwo: number
  generalContributionPct: number
  scstContributionPct: number
  stateCapacityLimit: number
}
export const defaultSubsidyRates: Readonly<SubsidyRates> = Object.freeze({
  centralFirstTwo: 30000, centralThird: 18000,
  benchmarkFirstTwo: 50000, benchmarkAboveTwo: 45000,
  generalContributionPct: 10, scstContributionPct: 5, stateCapacityLimit: 2.18,
})
export interface SubsidyInput {
  capacity: number
  existingCapacity: number
  category: 'general' | 'scst'
  quotation: number | null
  tariff: number
  residential: boolean
  commissionedAfterPolicy: boolean
  existingCentralAid: boolean
}
export const defaultSubsidyInput: Readonly<SubsidyInput> = Object.freeze({
  capacity: 2, existingCapacity: 0, category: 'general', quotation: null, tariff: 7,
  residential: true, commissionedAfterPolicy: true, existingCentralAid: true,
})
export const subsidyRateFields: { key: keyof SubsidyRates; label: string; max: number; step: number; suffix: string }[] = [
  { key: 'centralFirstTwo', label: 'Central subsidy per kW (first 2 kW)', max: 1000000, step: 100, suffix: '₹/kW' },
  { key: 'centralThird', label: 'Central subsidy per kW (third kW)', max: 1000000, step: 100, suffix: '₹/kW' },
  { key: 'benchmarkFirstTwo', label: 'Benchmark cost per kW (first 2 kW)', max: 1000000, step: 100, suffix: '₹/kW' },
  { key: 'benchmarkAboveTwo', label: 'Benchmark cost per kW (above 2 kW)', max: 1000000, step: 100, suffix: '₹/kW' },
  { key: 'generalContributionPct', label: 'General contribution', max: 100, step: 0.5, suffix: '%' },
  { key: 'scstContributionPct', label: 'SC/ST contribution', max: 100, step: 0.5, suffix: '%' },
  { key: 'stateCapacityLimit', label: 'State subsidy capacity limit', max: 10, step: 0.01, suffix: 'kWp' },
]
const within = (n: number, min: number, max: number) => Number.isFinite(n) && n >= min && n <= max
const rupees = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
export const subsidyRatesCustomized = (rates: SubsidyRates) => subsidyRateFields.some(({ key }) => rates[key] !== defaultSubsidyRates[key])
export function validSubsidyInput(input: SubsidyInput, rates: SubsidyRates) {
  return within(input.capacity, 0.5, 10) && within(input.existingCapacity, 0, 5) && within(input.tariff, 0, 100) &&
    (input.quotation === null || within(input.quotation, 1, 100000000)) && ['general', 'scst'].includes(input.category) &&
    [input.residential, input.commissionedAfterPolicy, input.existingCentralAid].every(v => typeof v === 'boolean') &&
    subsidyRateFields.every(({ key, max }) => within(rates[key], 0, max))
}
function centralAt(capacity: number, rates: SubsidyRates) {
  return Math.min(capacity, 2) * rates.centralFirstTwo + Math.min(Math.max(capacity - 2, 0), 1) * rates.centralThird
}
export function calcSubsidy(input: SubsidyInput, rates: SubsidyRates = defaultSubsidyRates) {
  if (!validSubsidyInput(input, rates)) throw new Error('Invalid subsidy inputs or rates')
  const totalCapacity = Number((input.capacity + input.existingCapacity).toFixed(8))
  const benchmark = rupees(Math.min(input.capacity, 2) * rates.benchmarkFirstTwo + Math.max(input.capacity - 2, 0) * rates.benchmarkAboveTwo)
  const contributionPct = input.category === 'scst' ? rates.scstContributionPct : rates.generalContributionPct
  const consumerContribution = rupees(benchmark * contributionPct / 100)
  const central = !input.residential ? 0 : rupees(input.existingCapacity > 0 && input.existingCentralAid
    ? Math.max(0, centralAt(totalCapacity, rates) - centralAt(input.existingCapacity, rates))
    : centralAt(input.capacity, rates))
  const stateEligible = input.residential && input.commissionedAfterPolicy && totalCapacity <= rates.stateCapacityLimit + 1e-9
  const state = stateEligible ? rupees(Math.max(0, benchmark - central - consumerContribution)) : 0
  const totalSubsidy = rupees(central + state)
  const costBasis = input.quotation ?? benchmark
  const youPay = rupees(Math.max(0, costBasis - totalSubsidy))
  const extraOverBenchmark = rupees(Math.max(0, costBasis - benchmark))
  const annualGeneration = rupees(input.capacity * 1400)
  const annualSavings = rupees(annualGeneration * input.tariff)
  const notices: string[] = []
  if (!input.residential) notices.push('These residential subsidy schemes do not cover commercial or industrial consumers. No subsidy is included.')
  else {
    if (!input.commissionedAfterPolicy) notices.push('The Gujarat top-up is not included for systems commissioned before 22 October 2026.')
    if (totalCapacity > rates.stateCapacityLimit + 1e-9) notices.push(`Combined capacity of ${totalCapacity} kWp exceeds the ${rates.stateCapacityLimit} kWp state limit. No Gujarat top-up is included.`)
    if (input.existingCapacity > 0) notices.push(input.existingCentralAid
      ? 'Central subsidy is estimated only for the remaining eligible capacity up to 3 kWp, accounting for your existing aided system. Confirm previous subsidy records and expansion eligibility with your DISCOM.'
      : 'Central subsidy is estimated on the new capacity only. Your DISCOM must verify the previous installation and subsidy history.')
  }
  if (costBasis < totalSubsidy) notices.push('The quotation is below the estimated subsidy. Final payable assistance needs DISCOM confirmation; no cash surplus is assumed.')
  if (subsidyRatesCustomized(rates)) notices.push('Custom rates are active. This is a scenario calculation, not an estimate at the published default rates.')
  return { totalCapacity, benchmark, consumerContribution, contributionPct, central, state, stateEligible, totalSubsidy,
    costBasis, youPay, extraOverBenchmark, annualGeneration, annualSavings,
    paybackYears: annualSavings > 0 ? youPay / annualSavings : null, customized: subsidyRatesCustomized(rates), notices }
}
export type SubsidyResult = ReturnType<typeof calcSubsidy>
export function subsidyBreakdown(input: SubsidyInput, result: SubsidyResult) {
  const inr = (n: number) => `Rs ${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  return [
    ['New system capacity', `${input.capacity} kWp`], ['Existing solar capacity', `${input.existingCapacity} kWp`],
    ['Combined capacity', `${result.totalCapacity} kWp`], ['Consumer category', input.category === 'scst' ? 'SC / ST' : 'General'],
    ['Benchmark cost (new system)', inr(result.benchmark)],
    [input.quotation === null ? 'Cost basis (benchmark)' : 'Vendor quotation', inr(result.costBasis)],
    ['Central subsidy', inr(result.central)], ['Gujarat subsidy', inr(result.state)], ['Total subsidy', inr(result.totalSubsidy)],
    ['Benchmark contribution (if state-eligible)', result.stateEligible ? inr(result.consumerContribution) : 'Not applicable'],
    ['Quotation above benchmark', inr(result.extraOverBenchmark)], ['You pay after estimated subsidy', inr(result.youPay)],
    ['Yearly generation (1,400 units/kWp)', `${result.annualGeneration.toLocaleString('en-IN')} units`],
    ['Electricity rate', `${inr(input.tariff)}/unit`], ['Yearly bill saving (estimate)', inr(result.annualSavings)],
    ['Simple payback', result.paybackYears === null ? 'Not available at zero electricity rate' : `${result.paybackYears.toFixed(1)} years`],
  ] as [string, string][]
}
