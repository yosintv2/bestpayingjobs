import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function applyRange(job, seed) {
  if (job.salaryMin !== job.salaryMax) return job;
  const value = job.salaryMin;
  const rand = seededRandom(seed);

  const spread = 0.08 + rand() * 0.12;
  const mid = value / (1 + (rand() - 0.5) * spread * 0.2);

  const min = Math.round(mid * (1 - spread * 0.6));
  const max = Math.round(mid * (1 + spread * 0.4));

  return { ...job, salaryMin: Math.max(min, 1), salaryMax: Math.max(max, min + 1) };
}

const npPath = resolve(__dirname, "../src/data/jobs/np.json");
const np = JSON.parse(readFileSync(npPath, "utf-8"));

let seed = 42;

for (const [category, jobs] of Object.entries(np.jobs)) {
  np.jobs[category] = jobs.map((job) => {
    seed++;
    return applyRange(job, seed);
  });
}

writeFileSync(npPath, JSON.stringify(np, null, 2));
console.log("✓ np.json salary ranges fixed");

// Now regenerate all countries from fixed np.json
const multipliers = JSON.parse(
  readFileSync(resolve(__dirname, "country-multipliers.json"), "utf-8")
);

const jobsDir = resolve(__dirname, "../src/data/jobs");

for (const [code, config] of Object.entries(multipliers)) {
  if (code === "np") continue;
  const { multiplier, currency } = config;

  const jobs = {};
  for (const [category, entries] of Object.entries(np.jobs)) {
    jobs[category] = entries.map((job) => ({
      ...job,
      salaryMin: Math.round(job.salaryMin * multiplier),
      salaryMax: Math.round(job.salaryMax * multiplier),
    }));
  }

  writeFileSync(
    resolve(jobsDir, `${code}.json`),
    JSON.stringify({ country: code, currency, jobs }, null, 2)
  );
}

console.log("✓ All country files regenerated with salary ranges");
