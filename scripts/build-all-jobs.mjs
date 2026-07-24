import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jobsDir = resolve(__dirname, "../src/data/jobs");

const allJobs = {};

for (const f of readdirSync(jobsDir)) {
  if (!f.endsWith(".json")) continue;
  const code = f.replace(".json", "");
  const data = JSON.parse(readFileSync(resolve(jobsDir, f), "utf-8"));
  allJobs[code] = data;
}

writeFileSync(
  resolve(__dirname, "../src/data/all-jobs.json"),
  JSON.stringify(allJobs)
);

console.log(`✓ all-jobs.json built with ${Object.keys(allJobs).length} countries`);
