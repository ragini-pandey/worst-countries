import Link from "next/link";
import { METRICS } from "@/lib/metrics";

export const metadata = {
  title: "About & methodology",
};

export default function AboutPage() {
  return (
    <article className="prose-themed mx-auto max-w-3xl px-5 py-10 text-neutral-800 dark:text-neutral-200">
      <Link
        href="/"
        className="not-prose mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to map
      </Link>
      <h1>About this site</h1>
      <p>
        <strong>Worst Countries</strong> ranks nations on negative indicators —
        corruption, violent crime, debt, press repression, gender inequality,
        pollution, and more. Each metric tracks one widely-published index or
        statistic, with a clear link back to the original source.
      </p>

      <h2>Data strategy</h2>
      <p>We use a hybrid approach:</p>
      <ul>
        <li>
          <strong>Live APIs</strong> for indicators that publish them — currently
          the World Bank (debt as % of GDP, CO₂ per capita, unemployment) and
          REST Countries (country names, flags, regions). These refresh every 24
          hours via Next.js incremental static regeneration.
        </li>
        <li>
          <strong>Committed snapshots</strong> for indices without an open API —
          Transparency International (CPI), UNODC (homicide & sexual violence),
          the World Happiness Report, Reporters Without Borders, and UNDP
          (Gender Inequality Index). These are refreshed manually each year;
          the date of the snapshot is shown alongside each metric.
        </li>
      </ul>
      <p>
        The metric registry in <code>src/lib/metrics.ts</code> is the single
        source of truth — adding a new metric is a one-file change plus an
        optional JSON snapshot.
      </p>

      <h2>Caveats</h2>
      <ul>
        <li>
          Reported crime statistics depend on whether victims report to police
          and how police record incidents. Cross-country comparisons,
          especially for sexual violence, must be read with this in mind.
        </li>
        <li>
          Composite indices (CPI, RSF, GII, Happiness) reflect the methodology
          of their publisher and carry uncertainty. We cite the source so you
          can read their methodology directly.
        </li>
        <li>
          Some countries are missing from some datasets — they appear as &ldquo;no
          data&rdquo; rather than being silently excluded.
        </li>
        <li>
          We do not currently publish a composite &ldquo;worst overall&rdquo; score.
          Combining apples and oranges requires defensible weighting we&apos;re
          not ready to claim.
        </li>
      </ul>

      <h2>Sources</h2>
      <ul>
        {METRICS.map((m) => (
          <li key={m.id}>
            <strong>{m.title}</strong> —{" "}
            <a href={m.source.url} target="_blank" rel="noreferrer">
              {m.source.name}
            </a>{" "}
            <span className="text-neutral-500">
              (updated {m.source.lastUpdated}, {m.source.cadence})
            </span>
          </li>
        ))}
      </ul>

      <h2>Stack</h2>
      <p>
        Next.js 14 (App Router) · TypeScript · Tailwind CSS · react-simple-maps ·
        d3-scale-chromatic.
      </p>
    </article>
  );
}
