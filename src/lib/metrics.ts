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
  // ── Health ────────────────────────────────────────────────────────────────
  {
    id: "child-mortality",
    title: "Child Mortality (Under-5)",
    description:
      "Under-5 mortality rate per 1,000 live births (World Bank / UNICEF). Higher = worse.",
    unit: "per 1k births",
    direction: "higher-worse",
    category: "Health",
    kind: "world-bank",
    worldBankIndicator: "SH.DY5.IMR",
    source: {
      name: "World Bank — Mortality rate, under-5 (per 1,000 live births)",
      url: "https://data.worldbank.org/indicator/SH.DY5.IMR",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  {
    id: "maternal-mortality",
    title: "Maternal Mortality Ratio",
    description:
      "Maternal deaths per 100,000 live births. Higher = worse.",
    unit: "per 100k births",
    direction: "higher-worse",
    category: "Health",
    kind: "world-bank",
    worldBankIndicator: "SH.STA.MMRT",
    source: {
      name: "World Bank — Maternal mortality ratio (per 100,000 live births)",
      url: "https://data.worldbank.org/indicator/SH.STA.MMRT",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  {
    id: "life-expectancy",
    title: "Low Life Expectancy",
    description:
      "Life expectancy at birth in years, inverted so the shortest-lived countries rank first.",
    unit: "years",
    direction: "lower-worse",
    invertForRanking: true,
    category: "Health",
    kind: "world-bank",
    worldBankIndicator: "SP.DYN.LE00.IN",
    source: {
      name: "World Bank — Life expectancy at birth, total (years)",
      url: "https://data.worldbank.org/indicator/SP.DYN.LE00.IN",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  // ── Economy (additional) ─────────────────────────────────────────────────
  {
    id: "poverty",
    title: "Extreme Poverty Rate",
    description:
      "Share of population living on less than $2.15 per day (2017 PPP). Higher = worse.",
    unit: "% of population",
    direction: "higher-worse",
    category: "Economy",
    kind: "world-bank",
    worldBankIndicator: "SI.POV.DDAY",
    source: {
      name: "World Bank — Poverty headcount ratio at $2.15/day (2017 PPP)",
      url: "https://data.worldbank.org/indicator/SI.POV.DDAY",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  {
    id: "inflation",
    title: "Inflation Rate",
    description:
      "Annual consumer price inflation (%). Very high inflation erodes living standards.",
    unit: "%",
    direction: "higher-worse",
    category: "Economy",
    kind: "world-bank",
    worldBankIndicator: "FP.CPI.TOTL.ZG",
    source: {
      name: "World Bank — Inflation, consumer prices (annual %)",
      url: "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  // ── Environment (additional) ─────────────────────────────────────────────
  {
    id: "air-pollution",
    title: "Air Pollution (PM2.5)",
    description:
      "Mean annual exposure to fine particulate matter (PM2.5 μg/m³). Higher = worse air quality.",
    unit: "μg/m³",
    direction: "higher-worse",
    category: "Environment",
    kind: "world-bank",
    worldBankIndicator: "EN.ATM.PM25.MC.M3",
    source: {
      name: "World Bank — PM2.5 air pollution, mean annual exposure (μg/m³)",
      url: "https://data.worldbank.org/indicator/EN.ATM.PM25.MC.M3",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  // ── Society (additional) ─────────────────────────────────────────────────
  {
    id: "inequality",
    title: "Income Inequality (Gini)",
    description:
      "Gini coefficient: 0 = perfect equality, 100 = maximum inequality.",
    unit: "Gini index",
    direction: "higher-worse",
    category: "Society",
    kind: "world-bank",
    worldBankIndicator: "SI.POV.GINI",
    source: {
      name: "World Bank — Gini index",
      url: "https://data.worldbank.org/indicator/SI.POV.GINI",
      lastUpdated: "live",
      cadence: "annual",
    },
  },
  {
    id: "child-labor",
    title: "Child Labour Rate",
    description:
      "Percentage of children ages 7–14 engaged in labour activities. Higher = worse.",
    unit: "% of children",
    direction: "higher-worse",
    category: "Society",
    kind: "world-bank",
    worldBankIndicator: "SL.TLF.0714.ZS",
    source: {
      name: "World Bank — Child employment in agriculture (% of economically active children ages 7-14)",
      url: "https://data.worldbank.org/indicator/SL.TLF.0714.ZS",
      lastUpdated: "live",
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
