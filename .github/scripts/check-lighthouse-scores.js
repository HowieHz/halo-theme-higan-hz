import { readFile } from "fs/promises";

const MANIFEST = process.env.MANIFEST || "./lighthouse-reports-current/manifest.json";

async function main() {
  const content = await readFile(MANIFEST, "utf8");
  const manifest = JSON.parse(content);

  const failures = [];

  for (const entry of manifest) {
    const url = new URL(entry.url);
    const page = url.pathname + url.search;
    const s = entry.summary || {};

    const scores = {
      performance: Math.round((s.performance || 0) * 100),
      accessibility: Math.round((s.accessibility || 0) * 100),
      "best-practices": Math.round((s["best-practices"] || 0) * 100),
      seo: Math.round((s.seo || 0) * 100),
    };

    const failed = Object.entries(scores).filter(([, score]) => score < 100);

    if (failed.length > 0) {
      failures.push({ page, failed });
    }
  }

  if (failures.length > 0) {
    console.error("❌ Lighthouse Quality Gate Failed\n");
    failures.forEach(({ page, failed }) => {
      console.error(`${page}`);
      failed.forEach(([category, score]) => {
        console.error(`  ${category}: ${score}/100`);
      });
      console.error("");
    });
    process.exit(1);
  }

  console.log(`✅ All ${manifest.length} pages passed (all scores 100)`);
}

main();
