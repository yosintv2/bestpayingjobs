import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const np = JSON.parse(
  readFileSync(resolve(__dirname, "../src/data/jobs/np.json"), "utf-8")
);

const avgSalaries = JSON.parse(
  readFileSync(resolve(__dirname, "real-average-salaries.json"), "utf-8")
);

const fxRates = {
  NPR: 134, AED: 3.67, AFN: 71, ALL: 92, AMD: 390, ANG: 1.79,
  AOA: 830, ARS: 830, AUD: 1.52, AWG: 1.79, AZN: 1.70,
  BAM: 1.80, BBD: 2.00, BDT: 110, BGN: 1.80, BHD: 0.38,
  BIF: 2860, BMD: 1.00, BND: 1.34, BOB: 6.90, BRL: 5.05,
  BSD: 1.00, BTN: 83, BWP: 13.6, BYN: 3.25, BZD: 2.00,
  CAD: 1.37, CDF: 2870, CHF: 0.88, CLP: 930, CNY: 7.24,
  COP: 4200, CRC: 520, CUP: 24.0, CVE: 102, CZK: 23.0,
  DJF: 178, DKK: 6.88, DOP: 59, DZD: 135, EGP: 48,
  ERN: 15.0, ETB: 56, EUR: 0.92, FJD: 2.25, FKP: 0.79,
  FOK: 6.88, GBP: 0.79, GEL: 2.75, GGP: 0.79, GHS: 14.5,
  GIP: 0.79, GMD: 67, GNF: 8600, GTQ: 7.80, GYD: 209,
  HKD: 7.82, HNL: 24.7, HRK: 6.94, HTG: 132, HUF: 370,
  IDR: 15700, ILS: 3.70, IMP: 0.79, INR: 83, IQD: 1310,
  IRR: 42000, ISK: 139, JEP: 0.79, JMD: 158, JOD: 0.71,
  JPY: 150, KES: 130, KGS: 89, KHR: 4100, KMF: 453,
  KPW: 900, KRW: 1350, KWD: 0.31, KYD: 0.83, KZT: 460,
  LAK: 21000, LBP: 89500, LKR: 305, LRD: 193, LSL: 18.2,
  LYD: 4.80, MAD: 10.1, MDL: 17.6, MGA: 4550, MKD: 56.8,
  MMK: 2100, MNT: 3450, MOP: 8.06, MRU: 40, MUR: 46,
  MVR: 15.4, MWK: 1740, MXN: 17.5, MYR: 4.70, MZN: 64,
  NAD: 18.2, NGN: 1500, NIO: 36.8, NOK: 10.5, NPR: 134,
  NZD: 1.63, OMR: 0.38, PAB: 1.00, PEN: 3.75, PGK: 3.85,
  PHP: 56, PKR: 278, PLN: 3.95, PYG: 7600, QAR: 3.64,
  RON: 4.60, RSD: 108, RUB: 89, RWF: 1300, SAR: 3.75,
  SBD: 8.45, SCR: 14.5, SDG: 590, SEK: 10.3, SGD: 1.34,
  SHP: 0.79, SLE: 22.5, SLL: 22500, SOS: 570, SRD: 29,
  SSP: 130, STN: 23.0, SYP: 13000, SZL: 18.2, THB: 35.5,
  TJS: 10.9, TMT: 3.50, TND: 3.10, TOP: 2.35, TRY: 30,
  TTD: 6.80, TVD: 1.52, TWD: 32, TZS: 2500, UAH: 38,
  UGX: 3850, USD: 1.00, UYU: 39, UZS: 12800, VES: 36,
  VND: 25400, VUV: 120, WST: 2.75, XAF: 603, XCD: 2.70,
  XDR: 0.75, XOF: 603, XPF: 110, YER: 250, ZAR: 18.2,
  ZMW: 26, ZWL: 321,
};

const countries = JSON.parse(
  readFileSync(resolve(__dirname, "../src/data/countries.json"), "utf-8")
);

const NEPAL_AVG = avgSalaries.np;
const NPR_TO_USD = fxRates.NPR;

// Build a map of country code -> currency from countries.json
const currencyMap = {};
for (const c of countries) {
  currencyMap[c.code] = c.currency;
}

function toLocal(amountNPR, targetCurrency, ratio) {
  const usd = amountNPR / NPR_TO_USD;
  const adjustedUSD = usd * ratio;
  const rate = fxRates[targetCurrency];
  if (!rate) {
    console.warn(`  ⚠ No FX rate for ${targetCurrency}, using 1:1`);
    return Math.round(adjustedUSD);
  }
  return Math.round(adjustedUSD * rate);
}

const jobsDir = resolve(__dirname, "../src/data/jobs");
let count = 0;

for (const country of countries) {
  const code = country.code;
  const currency = currencyMap[code];
  const avg = avgSalaries[code];

  if (!avg) {
    console.warn(`  ⚠ No average salary data for ${code} (${country.name})`);
    continue;
  }

  const ratio = avg / NEPAL_AVG;

  const top10 = np.top10.map((job) => ({
    ...job,
    salaryMin: toLocal(job.salaryMin, currency, ratio),
    salaryMax: toLocal(job.salaryMax, currency, ratio),
  }));

  const jobs = {};
  for (const [category, entries] of Object.entries(np.jobs)) {
    jobs[category] = entries.map((job) => ({
      ...job,
      salaryMin: toLocal(job.salaryMin, currency, ratio),
      salaryMax: toLocal(job.salaryMax, currency, ratio),
    }));
  }

  writeFileSync(
    resolve(jobsDir, `${code}.json`),
    JSON.stringify({ country: code, currency, top10, jobs }, null, 2)
  );
  count++;
}

console.log(`✓ Regenerated ${count} countries using real average salary ratios`);
console.log(`  Nepal avg: $${NEPAL_AVG}/mo (baseline 1.0x)`);
for (const [code, avg] of Object.entries(avgSalaries)) {
  const ratio = avg / NEPAL_AVG;
  const name = countries.find(c => c.code === code)?.name || code;
  if (['us', 'gb', 'de', 'jp', 'sg', 'ae', 'br', 'in', 'ng', 'au', 'ca'].includes(code)) {
    const currency = currencyMap[code];
    const c = np.jobs['finance-accounting'][0];
    const local = toLocal(c.salaryMin, currency, ratio);
    console.log(`  ${name}: $${avg}/mo (${ratio.toFixed(1)}x) → ${currency} ${local.toLocaleString()}/mo`);
  }
}
