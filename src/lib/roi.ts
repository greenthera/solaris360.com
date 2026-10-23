/** Local solar generation and return-on-investment calculations.
 * Specific yield is treated as the delivered yield (no additional system-loss factor).
 */
export interface RoiInput {
  systemSize: number
  systemCost: number
  electricityPrice: number
  specificYield: number
  degradationRate: number
  electricityInflation: number
  systemLifetime: number
  selfConsumption: number
  exportTariff: number
}

export const roiLimits: Record<keyof RoiInput, [number, number]> = {
  systemSize: [0.5, 1000000], systemCost: [0, 1e12], electricityPrice: [0, 1e6],
  specificYield: [100, 10000], degradationRate: [0, 5], electricityInflation: [0, 100],
  systemLifetime: [5, 50], selfConsumption: [0, 100], exportTariff: [0, 1e6],
}

export interface RoiYear {
  year: number
  generation: number
  savings: number
  cumulativeSavings: number
  netPosition: number
}

export function validRoiInput(value: unknown): value is RoiInput {
  if (!value || typeof value !== 'object') return false
  return Object.entries(roiLimits).every(([key, [min, max]]) => {
    const n = (value as Record<string, unknown>)[key]
    return typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max &&
      (key !== 'systemLifetime' || Number.isInteger(n))
  })
}

export function calcRoi(input: RoiInput) {
  if (!validRoiInput(input)) throw new Error('Invalid ROI inputs')
  const { systemSize, systemCost, specificYield, electricityPrice, exportTariff,
    selfConsumption, degradationRate, electricityInflation, systemLifetime } = input
  const annualGeneration = systemSize * specificYield
  const annualSavings = annualGeneration * (selfConsumption / 100 * electricityPrice + (1 - selfConsumption / 100) * exportTariff)
  let cumulativeSavings = 0
  const rows: RoiYear[] = Array.from({ length: systemLifetime }, (_, i) => {
    const generation = annualGeneration * (1 - degradationRate / 100) ** i
    const savings = generation * (selfConsumption / 100 * electricityPrice + (1 - selfConsumption / 100) * exportTariff) * (1 + electricityInflation / 100) ** i
    cumulativeSavings += savings
    return { year: i + 1, generation, savings, cumulativeSavings, netPosition: cumulativeSavings - systemCost }
  })
  return {
    annualGeneration, annualSavings, paybackPeriod: annualSavings > 0 ? systemCost / annualSavings : Infinity,
    totalSavings: cumulativeSavings, netProfit: cumulativeSavings - systemCost,
    roi: systemCost > 0 ? (cumulativeSavings - systemCost) / systemCost * 100 : 0,
    co2Reduction: rows.reduce((sum, row) => sum + row.generation, 0) * 0.5 / 1000,
    breakEvenYear: rows.find(row => row.netPosition >= 0)?.year ?? null, rows,
  }
}
export type RoiResult = ReturnType<typeof calcRoi>

/** Only calculation parameters are shared: never contact details or address. */
export function encodeRoiShare(input: RoiInput, currency: string, symbol: string) {
  return btoa(encodeURIComponent(JSON.stringify({ input, currency, symbol })))
}
export function decodeRoiShare(hash: string): { input: RoiInput; currency: string; symbol: string } | null {
  try {
    if (!hash.startsWith('#share=' ) || hash.length > 10000) return null
    const data = JSON.parse(decodeURIComponent(atob(hash.slice(7))))
    if (!validRoiInput(data.input) || typeof data.currency !== 'string' || !/^[A-Z]{3}$/.test(data.currency) || typeof data.symbol !== 'string' || data.symbol.length > 8) return null
    return { input: data.input, currency: data.currency, symbol: data.symbol }
  } catch { return null }
}
