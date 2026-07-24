import { readFileSync, writeFileSync, unlinkSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const np = JSON.parse(
  readFileSync(resolve(__dirname, "../src/data/jobs/np.json"), "utf-8")
);

const multipliers = JSON.parse(
  readFileSync(resolve(__dirname, "country-multipliers.json"), "utf-8")
);

const jobsDir = resolve(__dirname, "../src/data/jobs");

// Clean existing auto-generated files (keep np.json as reference)
for (const f of readdirSync(jobsDir)) {
  if (f !== "np.json") {
    unlinkSync(resolve(jobsDir, f));
  }
}

const entries = Object.entries(multipliers);
let count = 0;

for (const [code, config] of entries) {
  const { multiplier, currency } = config;

  const jobs = {};

  for (const [category, entries] of Object.entries(np.jobs)) {
    jobs[category] = entries.map((job) => ({
      ...job,
      salaryMin: Math.round(job.salaryMin * multiplier),
      salaryMax: Math.round(job.salaryMax * multiplier),
    }));
  }

  const output = {
    country: code,
    currency,
    jobs,
  };

  writeFileSync(
    resolve(jobsDir, `${code}.json`),
    JSON.stringify(output, null, 2)
  );
  count++;
}

console.log(`✓ Generated ${count} country files`);
