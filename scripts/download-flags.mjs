import https from "https";
import fs from "fs";
import path from "path";

const countries = JSON.parse(fs.readFileSync("src/data/countries.json", "utf-8"));

const outDir = "public/images/country";
let success = 0;
let failed = 0;

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, (res) => {
      const ct = res.headers["content-type"] || "";
      if (res.statusCode === 200 && ct.startsWith("image/")) {
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(true); });
      } else {
        file.close(); fs.unlinkSync(dest); resolve(false);
      }
    });
    req.on("error", () => { file.close(); try { fs.unlinkSync(dest); } catch {} resolve(false); });
  });
}

(async () => {
  for (const c of countries) {
    const dest = path.join(outDir, `${c.slug}.png`);
    if (fs.existsSync(dest)) { success++; continue; }

    let ok = await download(`https://img.singhs.com.np/country/${c.slug}.png`, dest);
    if (!ok) {
      ok = await download(`https://flagcdn.com/w640/${c.code}.png`, dest);
    }
    if (ok) { success++; process.stdout.write("."); }
    else { failed++; console.log(`\nFAILED: ${c.slug} (${c.name})`); }
  }
  console.log(`\nDone. ${success} ok, ${failed} failed`);
})();
