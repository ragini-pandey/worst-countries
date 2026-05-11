import type { CountryMeta } from "../types";

/**
 * Loads country metadata (name, ISO3, flag emoji, region) from REST Countries.
 * Cached for 24h via Next.js fetch revalidation.
 */
const ENDPOINT =
  "https://restcountries.com/v3.1/all?fields=cca3,name,flag,region,subregion";

interface RestCountry {
  cca3: string;
  name: { common: string };
  flag: string;
  region: string;
  subregion: string;
}

let cache: CountryMeta[] | null = null;

export async function fetchCountries(): Promise<CountryMeta[]> {
  if (cache) return cache;
  try {
    const res = await fetch(ENDPOINT, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) throw new Error(`REST Countries ${res.status}`);
    const raw = (await res.json()) as RestCountry[];
    cache = raw
      .filter((c) => c.cca3 && c.name?.common)
      .map((c) => ({
        iso3: c.cca3,
        name: c.name.common,
        flag: c.flag ?? "",
        region: c.region ?? "",
        subregion: c.subregion ?? "",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return cache;
  } catch {
    // Fall back to a minimal embedded list if the network is unavailable.
    const { FALLBACK_COUNTRIES } = await import("../../data/fallbackCountries");
    cache = FALLBACK_COUNTRIES;
    return cache;
  }
}

export function countryMap(list: CountryMeta[]): Map<string, CountryMeta> {
  return new Map(list.map((c) => [c.iso3, c]));
}
