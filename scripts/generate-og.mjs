import sharp from "sharp";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const countries = JSON.parse(
  readFileSync(join(__dirname, "../src/data/countries.json"), "utf-8")
);
const allJobs = JSON.parse(
  readFileSync(join(__dirname, "../src/data/all-jobs.json"), "utf-8")
);
const categories = JSON.parse(
  readFileSync(join(__dirname, "../src/data/categories.json"), "utf-8")
);
const calculators = JSON.parse(
  readFileSync(join(__dirname, "../src/data/calculators.json"), "utf-8")
);

const W = 1200;
const H = 750;

function esc(s) {
  return s.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

const gradientDef = `
<defs>
  <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#064E3B"/>
    <stop offset="50%" stop-color="#065F46"/>
    <stop offset="100%" stop-color="#047857"/>
  </linearGradient>
  <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#34D399"/>
    <stop offset="100%" stop-color="#059669"/>
  </linearGradient>
</defs>
`;

function buildRows(jobs, country, startY) {
  return jobs.map((j, i) => {
    const y = startY + i * 42;
    const bg = i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)";
    return `
    <rect x="60" y="${y}" width="1080" height="36" rx="4" fill="${bg}"/>
    <text x="85" y="${y + 24}" font-family="system-ui, Arial, sans-serif" font-size="15" fill="#6EE7B7" font-weight="bold">#${j.rank}</text>
    <text x="120" y="${y + 24}" font-family="system-ui, Arial, sans-serif" font-size="16" fill="#f1f5f9">${esc(j.title)}</text>
    <text x="1080" y="${y + 24}" font-family="system-ui, Arial, sans-serif" font-size="14" fill="#A7F3D0" font-weight="bold" text-anchor="end">${esc(country.currency)} ${fmt(j.salaryMin)} – ${fmt(j.salaryMax)}</text>`;
  }).join("");
}

function buildCountrySvg(country, top10) {
  const jobs = top10.slice(0, 10);
  return `<svg width="1200" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${gradientDef}
    <rect width="1200" height="${H}" fill="url(#bg)"/>
    <rect x="0" y="0" width="1200" height="6" fill="url(#accent)"/>
    <text x="80" y="85" font-family="system-ui, Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.4)">BestPayingJobs.net</text>
    <text x="80" y="145" font-family="system-ui, Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff">Best Paying Jobs in ${esc(country.name)}</text>
    ${buildRows(jobs, country, 190)}
    <rect x="0" y="${H - 45}" width="1200" height="45" fill="rgba(0,0,0,0.3)"/>
    <text x="600" y="${H - 20}" font-family="system-ui, Arial, sans-serif" font-size="13" fill="rgba(255,255,255,0.35)" text-anchor="middle">BestPayingJobs.net — Best Paying Jobs in Every Country</text>
  </svg>`;
}

function buildCategorySvg(country, cat, jobs) {
  const top10 = jobs.slice(0, 10);
  return `<svg width="1200" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${gradientDef}
    <rect width="1200" height="${H}" fill="url(#bg)"/>
    <rect x="0" y="0" width="1200" height="6" fill="url(#accent)"/>
    <text x="80" y="85" font-family="system-ui, Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.4)">BestPayingJobs.net</text>
    <text x="80" y="145" font-family="system-ui, Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">${esc(cat.name)} Jobs in ${esc(country.name)}</text>
    ${buildRows(top10, country, 190)}
    <rect x="0" y="${H - 45}" width="1200" height="45" fill="rgba(0,0,0,0.3)"/>
    <text x="600" y="${H - 20}" font-family="system-ui, Arial, sans-serif" font-size="13" fill="rgba(255,255,255,0.35)" text-anchor="middle">BestPayingJobs.net — Best Paying Jobs in Every Country</text>
  </svg>`;
}

function buildCalculatorSvg(calc) {
  return `<svg width="1200" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${gradientDef}
    <rect width="1200" height="${H}" fill="url(#bg)"/>
    <rect x="0" y="0" width="1200" height="6" fill="url(#accent)"/>
    <text x="80" y="85" font-family="system-ui, Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.4)">BestPayingJobs.net</text>
    <rect x="80" y="120" width="1040" height="160" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="600" y="170" font-family="system-ui, Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">${esc(calc.title)}</text>
    <text x="600" y="210" font-family="system-ui, Arial, sans-serif" font-size="16" fill="#6EE7B7" text-anchor="middle">${esc(calc.subtitle)}</text>
    <text x="600" y="255" font-family="system-ui, Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.35)" text-anchor="middle">Free online salary calculator at BestPayingJobs.net</text>
    <rect x="0" y="${H - 45}" width="1200" height="45" fill="rgba(0,0,0,0.3)"/>
    <text x="600" y="${H - 20}" font-family="system-ui, Arial, sans-serif" font-size="13" fill="rgba(255,255,255,0.35)" text-anchor="middle">BestPayingJobs.net — Free Salary Calculators</text>
  </svg>`;
}

async function generateCountry(slug) {
  const c = countries.find((x) => x.slug === slug);
  if (!c) { console.error(`Country not found: ${slug}`); return; }
  const data = allJobs[c.code];
  if (!data || !data.top10 || data.top10.length === 0) { console.error(`No job data for ${c.name}`); return; }
  const svg = buildCountrySvg(c, data.top10);
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(join(outDir, `${slug}.webp`));
  console.log(`✓ ${c.name} → /public/og/${slug}.webp`);
}

async function generateCategories(slug) {
  const c = countries.find((x) => x.slug === slug);
  if (!c) { console.error(`Country not found: ${slug}`); return; }
  const data = allJobs[c.code];
  if (!data) { console.error(`No job data for ${c.name}`); return; }
  const catDir = join(outDir, slug, "categories");
  if (!existsSync(catDir)) mkdirSync(catDir, { recursive: true });
  for (const cat of categories) {
    const jobs = data.jobs[cat.slug];
    if (!jobs || jobs.length === 0) continue;
    const svg = buildCategorySvg(c, cat, jobs);
    await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(join(catDir, `${cat.slug}.webp`));
    console.log(`  ✓ ${cat.name} → /public/og/${slug}/categories/${cat.slug}.webp`);
  }
}

async function generateCalculators() {
  const calcDir = join(outDir, "calculators");
  if (!existsSync(calcDir)) mkdirSync(calcDir, { recursive: true });
  for (const calc of calculators) {
    const svg = buildCalculatorSvg(calc);
    await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(join(calcDir, `${calc.slug}.webp`));
  }
  console.log(`✓ ${calculators.length} calculators generated`);
}

const outDir = join(__dirname, "../public/og");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const target = process.argv[2];
const mode = process.argv[3] || "all";

if (target === "--calculators") {
  await generateCalculators();
} else if (target === "--categories") {
  if (process.argv[3]) {
    await generateCategories(process.argv[3]);
  } else {
    for (const c of countries) {
      if (allJobs[c.code]) await generateCategories(c.slug);
    }
  }
} else if (target) {
  await generateCountry(target);
  if (mode === "all" || mode === "categories") {
    await generateCategories(target);
  }
} else {
  for (const c of countries) {
    if (allJobs[c.code]) {
      await generateCountry(c.slug);
      await generateCategories(c.slug);
    }
  }
  await generateCalculators();
}
