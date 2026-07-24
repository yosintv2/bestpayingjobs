import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const np = JSON.parse(
  readFileSync(resolve(__dirname, "../src/data/jobs/np.json"), "utf-8")
);

const countryConfigs = [
  { code: "us", name: "United States", currency: "USD", multiplier: 20 },
  { code: "gb", name: "United Kingdom", currency: "GBP", multiplier: 12 },
  { code: "ca", name: "Canada", currency: "CAD", multiplier: 12 },
  { code: "au", name: "Australia", currency: "AUD", multiplier: 13 },
  { code: "in", name: "India", currency: "INR", multiplier: 2.5 },
  { code: "ae", name: "United Arab Emirates", currency: "AED", multiplier: 18 },
  { code: "sg", name: "Singapore", currency: "SGD", multiplier: 25 },
  { code: "de", name: "Germany", currency: "EUR", multiplier: 14 },
  { code: "fr", name: "France", currency: "EUR", multiplier: 12 },
  { code: "jp", name: "Japan", currency: "JPY", multiplier: 11 },
  { code: "cn", name: "China", currency: "CNY", multiplier: 5 },
  { code: "br", name: "Brazil", currency: "BRL", multiplier: 4 },
  { code: "za", name: "South Africa", currency: "ZAR", multiplier: 3.5 },
  { code: "ng", name: "Nigeria", currency: "NGN", multiplier: 1.5 },
  { code: "ke", name: "Kenya", currency: "KES", multiplier: 1.3 },
  { code: "mx", name: "Mexico", currency: "MXN", multiplier: 4.5 },
  { code: "pk", name: "Pakistan", currency: "PKR", multiplier: 1.5 },
  { code: "bd", name: "Bangladesh", currency: "BDT", multiplier: 1.0 },
  { code: "ph", name: "Philippines", currency: "PHP", multiplier: 1.5 },
];

const jobsDir = resolve(__dirname, "../src/data/jobs");

for (const config of countryConfigs) {
  const jobs = {};

  for (const [category, entries] of Object.entries(np.jobs)) {
    jobs[category] = entries.map((job) => ({
      ...job,
      salaryMin: Math.round(job.salaryMin * config.multiplier),
      salaryMax: Math.round(job.salaryMax * config.multiplier),
    }));
  }

  const output = {
    country: config.code,
    currency: config.currency,
    jobs,
  };

  writeFileSync(
    resolve(jobsDir, `${config.code}.json`),
    JSON.stringify(output, null, 2)
  );
  console.log(`✓ ${config.code.toUpperCase()} (${config.name}) — multiplier ${config.multiplier}x`);
}
