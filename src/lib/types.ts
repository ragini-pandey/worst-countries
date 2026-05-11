// Core domain types for the Worst Countries app.

/** ISO 3166-1 alpha-3 country code, e.g. "USA", "BRA". */
export type Iso3 = string;

/** Higher = worse, or Lower = worse. Determines ranking direction. */
export type Direction = "higher-worse" | "lower-worse";

/** How a metric's data is sourced. */
export type SourceKind = "world-bank" | "static";

export interface MetricSource {
  /** Human-readable source name, e.g. "Transparency International (CPI 2024)". */
  name: string;
  /** Public URL where the original data lives. */
  url: string;
  /** ISO date (YYYY-MM-DD) of the data snapshot used. */
  lastUpdated: string;
  /** How often the source publishes updates. */
  cadence: "annual" | "biennial" | "quarterly" | "ad-hoc";
}

export interface MetricDefinition {
  /** URL slug, e.g. "corruption". */
  id: string;
  /** Display title, e.g. "Corruption (CPI)". */
  title: string;
  /** One-sentence description shown on cards and detail pages. */
  description: string;
  /** Unit suffix shown next to values, e.g. "%", "per 100k". */
  unit: string;
  /** Ranking direction. */
  direction: Direction;
  /** Where the data comes from. */
  source: MetricSource;
  /** Adapter to load values. */
  kind: SourceKind;
  /** World Bank indicator code (only when kind === "world-bank"). */
  worldBankIndicator?: string;
  /** Static JSON filename in src/data (only when kind === "static"). */
  staticFile?: string;
  /** Category for grouping on the landing page. */
  category:
    | "Governance"
    | "Safety"
    | "Economy"
    | "Wellbeing"
    | "Environment"
    | "Society"
    | "Health";
  /** When true, raw values are inverted for ranking (e.g. happiness — lower is worse). */
  invertForRanking?: boolean;
}

export interface CountryMeta {
  iso3: Iso3;
  name: string;
  flag: string; // emoji
  region: string;
  subregion: string;
}

export interface MetricValue {
  iso3: Iso3;
  value: number;
  /** Year of the underlying observation, when available. */
  year?: number;
}

export interface RankedRow extends MetricValue {
  rank: number;
  country: CountryMeta;
}
