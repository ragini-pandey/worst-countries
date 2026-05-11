import type { MetricDefinition } from "./types";

/**
 * Central metric registry. To add a new metric:
 *   1. Append an entry here.
 *   2. If kind === "static", drop a JSON file in src/data/<staticFile>.
 *   3. Pages and maps appear automatically via the registry.
 */
export const METRICS: MetricDefinition[] = [
  {
    id: "corruption",
    title: "Corruption (CPI)",
    description:
      "Transparency International's Corruption Perceptions Index. Lower CPI = more corrupt; we invert for ranking so the most corrupt come first.",
    unit: "CPI score",
    direction: "lower-worse",
    invertForRanking: true,
    category: "Governance",
    kind: "static",
    staticFile: "corruption.json",
    source: {
      name: "Transparency International — CPI 2024",
      url: "https://www.transparency.org/en/cpi/2024",
      lastUpdated: "2025-02-11",
      cadence: "annual",
    },
  },
  {
    id: "homicide",
    title: "Intentional Homicide Rate",
    description:
      "Intentional homicides per 100,000 people (UNODC).",
    unit: "per 100k",
    direction: "higher-worse",
    category: "Safety",
    kind: "static",
    staticFile: "homicide.json",
    source: {
      name: "UNODC — Intentional Homicide Victims",
      url: "https://dataunodc.un.org/dp-intentional-homicide-victims",
      lastUpdated: "2024-12-01",
      cadence: "annual",
    },
  },
  {
    id: "sexual-violence",
    title: "Sexual Violence Rate",
    description:
      "Police-recorded rape / sexual violence per 100,000 people. Reporting rates vary widely between countries — read with caution.",
    unit: "per 100k",
    direction: "higher-worse",
    category: "Safety",
    kind: "static",
    staticFile: "sexual-violence.json",
    source: {
      name: "UNODC — Sexual Violence",
      url: "https://dataunodc.un.org/data/crime/Sexual%20violence",
      lastUpdated: "2024-09-01",
      cadence: "annual",
    },
  },
  {
    id: "debt-gdp",
    title: "Government Debt (% of GDP)",
    description:
      "Central government debt as a percentage of GDP. Live from the World Bank when available.",
    unit: "% of GDP",
    direction: "higher-worse",
    category: "Economy",
    kind: "world-bank",
    worldBankIndicator: "GC.DOD.TOTL.GD.ZS",
    source: {
      name: "World Bank — Central government debt, total (% of GDP)",
      url: "https://data.worldbank.org/indicator/GC.DOD.TOTL.GD.ZS",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  {
    id: "happiness",
    title: "Unhappiness (inverse Happiness Index)",
    description:
      "World Happiness Report ladder score. Lower score = less happy; we invert for ranking so the least happy come first.",
    unit: "ladder score",
    direction: "lower-worse",
    invertForRanking: true,
    category: "Wellbeing",
    kind: "static",
    staticFile: "happiness.json",
    source: {
      name: "World Happiness Report 2024",
      url: "https://worldhappiness.report/ed/2024/",
      lastUpdated: "2024-03-20",
      cadence: "annual",
    },
  },
  {
    id: "co2",
    title: "CO₂ Emissions per capita",
    description:
      "Metric tons of CO₂ per person per year. Live from the World Bank when available.",
    unit: "t CO₂ / person",
    direction: "higher-worse",
    category: "Environment",
    kind: "world-bank",
    worldBankIndicator: "EN.ATM.CO2E.PC",
    source: {
      name: "World Bank — CO₂ emissions (metric tons per capita)",
      url: "https://data.worldbank.org/indicator/EN.ATM.CO2E.PC",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  {
    id: "unemployment",
    title: "Unemployment Rate",
    description:
      "Share of the labour force without work but seeking employment (modeled ILO estimate).",
    unit: "%",
    direction: "higher-worse",
    category: "Economy",
    kind: "world-bank",
    worldBankIndicator: "SL.UEM.TOTL.ZS",
    source: {
      name: "World Bank — Unemployment, total (% of labor force)",
      url: "https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  {
    id: "press-freedom",
    title: "Press Freedom (worst)",
    description:
      "Reporters Without Borders Press Freedom Index. Higher score = less free press.",
    unit: "RSF score",
    direction: "higher-worse",
    category: "Governance",
    kind: "static",
    staticFile: "press-freedom.json",
    source: {
      name: "Reporters Without Borders — World Press Freedom Index 2024",
      url: "https://rsf.org/en/index",
      lastUpdated: "2024-05-03",
      cadence: "annual",
    },
  },
  {
    id: "gender-inequality",
    title: "Gender Inequality Index",
    description:
      "UNDP Gender Inequality Index (GII). 0 = full equality, 1 = full inequality.",
    unit: "GII",
    direction: "higher-worse",
    category: "Society",
    kind: "static",
    staticFile: "gender-inequality.json",
    source: {
      name: "UNDP Human Development Report — Gender Inequality Index 2022",
      url: "https://hdr.undp.org/data-center/thematic-composite-indices/gender-inequality-index",
      lastUpdated: "2024-03-13",
      cadence: "annual",
    },
  },
];

export function getMetric(id: string): MetricDefinition | undefined {
  return METRICS.find((m) => m.id === id);
}

export function metricsByCategory(): Record<string, MetricDefinition[]> {
  return METRICS.reduce<Record<string, MetricDefinition[]>>((acc, m) => {
    (acc[m.category] ||= []).push(m);
    return acc;
  }, {});
}
