# Worst Countries — Global Rankings Explorer

An interactive **Next.js 14** web app that ranks countries across 17 metrics covering governance, safety, economy, wellbeing, environment, society, and health. Browse ranked tables, explore colour-coded choropleth world maps, and drill into per-country detail pages — all driven by a single metric registry you can extend in minutes.

Fully **mobile responsive** with a tab-based Map / Rankings layout on small screens and a hamburger navigation menu.

---

## Features

- **17 metrics across 7 categories:**

  | Metric | Category | Source |
  |--------|----------|--------|
  | Corruption Perceptions Index (CPI) | Governance | Transparency International |
  | Press Freedom Index | Governance | RSF |
  | Intentional Homicide Rate | Safety | UNODC |
  | Sexual Violence Rate | Safety | UNODC |
  | Government Debt (% of GDP) | Economy | World Bank (live) |
  | Unemployment Rate | Economy | World Bank (live) |
  | Extreme Poverty Rate | Economy | World Bank (live) |
  | Inflation Rate | Economy | World Bank (live) |
  | Unhappiness (inverse Happiness Index) | Wellbeing | World Happiness Report |
  | CO₂ Emissions per capita | Environment | World Bank (live) |
  | Air Pollution (PM2.5) | Environment | World Bank (live) |
  | Gender Inequality Index | Society | UNDP |
  | Income Inequality (Gini) | Society | World Bank (live) |
  | Child Labour Rate | Society | World Bank (live) |
  | Child Mortality (Under-5) | Health | World Bank (live) |
  | Maternal Mortality Ratio | Health | World Bank (live) |
  | Low Life Expectancy | Health | World Bank (live) |

- **Interactive world maps** — colour-coded choropleth per metric via `react-simple-maps` + D3 scales; zoom, pan, and fullscreen controls
- **Mobile responsive** — tab bar (Map / Rankings) on small screens, responsive map zoom, hamburger nav menu
- **Hall of shame podium** — top 3 worst countries highlighted on every map view
- **Country search** — live filter in the ranked country list
- **Dark / light mode** toggle with Tailwind CSS
- **SEO ready** — `sitemap.ts` and `robots.ts` generated at build time
- **Data refresh script** — `npm run refresh-data` pulls fresh World Bank values

---

## Tech Stack

| Layer | Library / Tool |
|-------|---------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Maps | react-simple-maps 3, topojson-client |
| Scales | d3-scale, d3-scale-chromatic |
| Validation | Zod 4 |
| Data script | tsx |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — metric selector + explorer
│   ├── about/page.tsx        # About & methodology page
│   ├── country/[iso3]/       # Per-country detail
│   ├── map/[metric]/         # Choropleth world map (redirects to rankings)
│   ├── rankings/[metric]/    # Full ranked table for a metric (redirects home)
│   ├── robots.ts             # Robots.txt generation
│   └── sitemap.ts            # Sitemap generation
├── components/
│   ├── HomeExplorer.tsx      # Client shell: metric dropdown + explorer
│   ├── MetricExplorer.tsx    # Map + ranked list with tab layout on mobile
│   ├── SiteChrome.tsx        # Header / nav with mobile hamburger menu
│   └── ThemeToggle.tsx       # Dark/light toggle
├── data/                     # Static JSON datasets (CPI, homicide, etc.)
├── lib/
│   ├── dataset.ts            # getRanking() — fetches & ranks data
│   ├── metrics.ts            # Central METRICS registry (17 metrics)
│   ├── format.ts             # Number / unit formatters
│   ├── types.ts              # Shared TypeScript types
│   └── sources/
│       ├── restCountries.ts  # REST Countries API helpers
│       ├── static.ts         # Loader for bundled JSON files
│       └── worldBank.ts      # World Bank API client
scripts/
└── refresh-data.ts           # Refresh World Bank data to JSON snapshots
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn / bun)

### Install & run

```bash
git clone https://github.com/ragini-pandey/worst-countries.git
cd worst-countries
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Refresh live data

World Bank metrics are fetched at runtime and cached for 24 h via `revalidate = 86400`. To regenerate the bundled static JSON snapshots:

```bash
npm run refresh-data
```

---

## Adding a New Metric

1. Append an entry to `METRICS` in `src/lib/metrics.ts`.
2. If `kind === "static"`, add the corresponding JSON file to `src/data/`.
3. If `kind === "world-bank"`, set `worldBankIndicator` to the correct indicator code.
4. Rankings, map, and country-detail pages appear automatically.

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

```bash
npx vercel
```

Or run a production build locally:

```bash
npm run build
npm start
```

---

## Data Sources

| Dataset | Publisher | License |
|---------|-----------|---------|
| [Corruption Perceptions Index](https://www.transparency.org/en/cpi/2024) | Transparency International | CC BY-ND 4.0 |
| [Press Freedom Index](https://rsf.org/en/index) | Reporters Without Borders | Publicly available |
| [Intentional Homicide Victims](https://dataunodc.un.org/dp-intentional-homicide-victims) | UNODC | Publicly available |
| [Sexual Violence](https://dataunodc.un.org/data/crime/Sexual%20violence) | UNODC | Publicly available |
| [Government Debt](https://data.worldbank.org/indicator/GC.DOD.TOTL.GD.ZS) | World Bank | CC BY 4.0 |
| [Unemployment Rate](https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS) | World Bank / ILO | CC BY 4.0 |
| [Extreme Poverty Rate](https://data.worldbank.org/indicator/SI.POV.DDAY) | World Bank | CC BY 4.0 |
| [Inflation Rate](https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG) | World Bank | CC BY 4.0 |
| [World Happiness Report 2024](https://worldhappiness.report/ed/2024/) | Gallup / WHR | Publicly available |
| [CO₂ Emissions per capita](https://data.worldbank.org/indicator/EN.ATM.CO2E.PC) | World Bank | CC BY 4.0 |
| [Air Pollution (PM2.5)](https://data.worldbank.org/indicator/EN.ATM.PM25.MC.M3) | World Bank | CC BY 4.0 |
| [Gender Inequality Index](https://hdr.undp.org/data-center/thematic-composite-indices/gender-inequality-index) | UNDP | Publicly available |
| [Gini Index](https://data.worldbank.org/indicator/SI.POV.GINI) | World Bank | CC BY 4.0 |
| [Child Labour Rate](https://data.worldbank.org/indicator/SL.TLF.0714.ZS) | World Bank | CC BY 4.0 |
| [Child Mortality (Under-5)](https://data.worldbank.org/indicator/SH.DY5.IMR) | World Bank / UNICEF | CC BY 4.0 |
| [Maternal Mortality Ratio](https://data.worldbank.org/indicator/SH.STA.MMRT) | World Bank | CC BY 4.0 |
| [Life Expectancy](https://data.worldbank.org/indicator/SP.DYN.LE00.IN) | World Bank | CC BY 4.0 |

---

## License

MIT

