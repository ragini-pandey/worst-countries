import path from "node:path";
import { promises as fs } from "node:fs";
import type { MetricValue } from "../types";

/** Loads a static JSON dataset bundled in src/data/. */
export async function loadStaticDataset(
  filename: string
): Promise<MetricValue[]> {
  const file = path.join(process.cwd(), "src", "data", filename);
  const raw = await fs.readFile(file, "utf8");
  const parsed = JSON.parse(raw) as MetricValue[];
  return parsed.filter(
    (r) =>
      typeof r.iso3 === "string" &&
      r.iso3.length === 3 &&
      typeof r.value === "number" &&
      Number.isFinite(r.value)
  );
}
