import type {
  CountryMeta,
  MetricDefinition,
  MetricValue,
  RankedRow,
} from "./types";
import { getMetric, METRICS } from "./metrics";
import { fetchCountries, countryMap } from "./sources/restCountries";
import { fetchWorldBankIndicator } from "./sources/worldBank";
import { loadStaticDataset } from "./sources/static";

async function loadValues(metric: MetricDefinition): Promise<MetricValue[]> {
  if (metric.kind === "world-bank" && metric.worldBankIndicator) {
    try {
      return await fetchWorldBankIndicator(metric.worldBankIndicator);
    } catch {
      // Fall back to bundled snapshot if present.
      try {
        return await loadStaticDataset(`${metric.id}.json`);
      } catch {
        return [];
      }
    }
  }
  if (metric.kind === "static" && metric.staticFile) {
    try {
      return await loadStaticDataset(metric.staticFile);
    } catch {
      return [];
    }
  }
  return [];
}

/** Sorts values by "worst-first" using the metric's direction. Dedupes by iso3. */
export function sortWorstFirst(
  values: MetricValue[],
  metric: MetricDefinition
): MetricValue[] {
  const seen = new Map<string, MetricValue>();
  for (const v of values) if (!seen.has(v.iso3)) seen.set(v.iso3, v);
  const dir = metric.direction === "higher-worse" ? 1 : -1;
  return Array.from(seen.values()).sort((a, b) => dir * (b.value - a.value));
}

export async function getRanking(metricId: string): Promise<{
  metric: MetricDefinition;
  rows: RankedRow[];
} | null> {
  const metric = getMetric(metricId);
  if (!metric) return null;
  const [values, countries] = await Promise.all([
    loadValues(metric),
    fetchCountries(),
  ]);
  const cmap = countryMap(countries);
  const sorted = sortWorstFirst(values, metric).filter((v) => cmap.has(v.iso3));
  const rows: RankedRow[] = sorted.map((v, i) => ({
    ...v,
    rank: i + 1,
    country: cmap.get(v.iso3)!,
  }));
  return { metric, rows };
}

export async function getAllRankings(): Promise<
  Map<string, { metric: MetricDefinition; rows: RankedRow[] }>
> {
  const out = new Map<string, { metric: MetricDefinition; rows: RankedRow[] }>();
  await Promise.all(
    METRICS.map(async (m) => {
      const r = await getRanking(m.id);
      if (r) out.set(m.id, r);
    })
  );
  return out;
}

export async function getCountryProfile(iso3: string): Promise<{
  country: CountryMeta;
  entries: Array<{
    metric: MetricDefinition;
    value: number | null;
    rank: number | null;
    total: number;
    year?: number;
  }>;
} | null> {
  const upper = iso3.toUpperCase();
  const [countries, all] = await Promise.all([
    fetchCountries(),
    getAllRankings(),
  ]);
  const country = countries.find((c) => c.iso3 === upper);
  if (!country) return null;
  const entries = METRICS.map((m) => {
    const r = all.get(m.id);
    if (!r) return { metric: m, value: null, rank: null, total: 0 };
    const row = r.rows.find((x) => x.iso3 === upper);
    return {
      metric: m,
      value: row?.value ?? null,
      rank: row?.rank ?? null,
      total: r.rows.length,
      year: row?.year,
    };
  });
  return { country, entries };
}
