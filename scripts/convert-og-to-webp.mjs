import sharp from "sharp";
import { readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ogDir = join(__dirname, "../public/og");

function convertDir(dir) {
  for (const f of readdirSync(dir)) {
    const fp = join(dir, f);
    if (f.endsWith(".png")) {
      const webp = fp.replace(/\.png$/, ".webp");
      if (existsSync(webp)) continue;
      sharp(fp).webp({ quality: 80 }).toFile(webp).then(() => {
        console.log(`✓ ${fp} → ${webp}`);
      });
    } else if (f.endsWith(".webp")) {
      // already converted
    }
  }
}

// Top-level country OG images
convertDir(ogDir);

// Category OG images per country
for (const f of readdirSync(ogDir)) {
  const catDir = join(ogDir, f, "categories");
  if (existsSync(catDir)) {
    convertDir(catDir);
  }
}

// Calculator OG images
const calcDir = join(ogDir, "calculators");
if (existsSync(calcDir)) {
  convertDir(calcDir);
}

console.log("Conversion complete. Run: git add -f public/og/*.webp");
