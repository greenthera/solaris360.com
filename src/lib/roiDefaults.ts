import type { RoiInput } from './roi'

/** Fixed defaults for the single-page calculator. */
export const defaultRoiSettings = {
  currency: 'INR', currencySymbol: '₹', defaultElectricityPrice: 7.5,
  systemLifetime: 25, panelDegradation: 0.5, specificYield: 1450,
  electricityInflation: 4, defaultCostPerKW: 40000,
}
type RoiDefaults = typeof defaultRoiSettings
export function defaultRoiInput(s: RoiDefaults): RoiInput {
  return { systemSize: 10, systemCost: s.defaultCostPerKW * 10, electricityPrice: s.defaultElectricityPrice,
    specificYield: s.specificYield, degradationRate: s.panelDegradation, electricityInflation: s.electricityInflation,
    systemLifetime: s.systemLifetime, selfConsumption: 70, exportTariff: s.defaultElectricityPrice * 0.5 }
}

