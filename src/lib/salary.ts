import fxRatesData from "@/data/fx-rates.json";
import colData from "@/data/col-index.json";

const fxRates = fxRatesData as Record<string, number>;
const colIndex = colData as Record<string, number>;

export function toUSD(amount: number, currency: string): number {
  const rate = fxRates[currency];
  if (!rate) return amount;
  return amount / rate;
}

export function adjustedSalary(usd: number, countryCode: string): number {
  const index = colIndex[countryCode.toLowerCase()];
  if (!index || index <= 0) return usd;
  return Math.round(usd / (index / 100));
}

export function formatAnnual(monthly: number): string {
  return `$${Math.round((monthly * 12) / 1000)}k/yr`;
}

export function formatMonthly(monthly: number): string {
  return `$${Math.round(monthly / 1000)}k/mo`;
}
