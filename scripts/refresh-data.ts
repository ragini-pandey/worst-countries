/**
 * Annual data refresh script.
 *
 * Run: `npm run refresh-data`
 *
 * - Fetches every World Bank indicator declared in the metric registry and
 *   writes a snapshot to src/data/<metric-id>.json (used as offline fallback).
 * - Static-source metrics (CPI, UNODC, Happiness, RSF, GII) must currently be
 *   refreshed manually — see src/app/about/page.tsx for source links.
 *
 * This script intentionally avoids any third-party deps so it stays runnable
 * in CI without `npm install`.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { METRICS } from "../src/lib/metrics";
import { fetchWorldBankIndicator } from "../src/lib/sources/worldBank";

async function main() {
  const out = path.join(process.cwd(), "src", "data");
  await fs.mkdir(out, { recursive: true });

  for (const m of METRICS) {
    if (m.kind !== "world-bank" || !m.worldBankIndicator) continue;
    process.stdout.write(`Fetching ${m.id} (${m.worldBankIndicator})… `);
    try {
      const rows = await fetchWorldBankIndicator(m.worldBankIndicator);
      const file = path.join(out, `${m.id}.json`);
      await fs.writeFile(file, JSON.stringify(rows, null, 2));
      console.log(`${rows.length} rows → ${path.relative(process.cwd(), file)}`);
    } catch (err) {
      console.warn(`failed: ${(err as Error).message}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
