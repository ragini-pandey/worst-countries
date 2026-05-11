import type { MetricValue } from "../types";

/**
 * Generic World Bank indicator fetcher. Returns the most recent non-null
 * observation for every country.
 *
 * Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 */
interface WBRow {
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
}

export async function fetchWorldBankIndicator(
  indicator: string
): Promise<MetricValue[]> {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${encodeURIComponent(
    indicator
  )}?format=json&per_page=20000&date=2010:2025`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) throw new Error(`World Bank ${indicator}: ${res.status}`);
  const json = (await res.json()) as [unknown, WBRow[]] | [unknown];
  const rows = (json[1] ?? []) as WBRow[];

  // Pick the latest non-null value per ISO3.
  const latest = new Map<string, MetricValue>();
  for (const r of rows) {
    if (r.value == null) continue;
    const iso3 = r.countryiso3code;
    if (!iso3 || iso3.length !== 3) continue; // skip aggregates like "WLD"
    const year = Number(r.date);
    const prev = latest.get(iso3);
    if (!prev || (prev.year ?? 0) < year) {
      latest.set(iso3, { iso3, value: r.value, year });
    }
  }
  return Array.from(latest.values());
}
