import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountryProfile } from "@/lib/dataset";
import { formatValue } from "@/lib/format";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: { iso3: string };
}): Promise<Metadata> {
  const profile = await getCountryProfile(params.iso3);
  if (!profile) return {};
  return {
    title: `${profile.country.name} — country profile`,
    description: `All worst-country rankings for ${profile.country.name}.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: { iso3: string };
}) {
  const profile = await getCountryProfile(params.iso3);
  if (!profile) notFound();
  const { country, entries } = profile;

  const ranked = [...entries].sort((a, b) => {
    const aPct = a.rank && a.total ? a.rank / a.total : Number.POSITIVE_INFINITY;
    const bPct = b.rank && b.total ? b.rank / b.total : Number.POSITIVE_INFINITY;
    return aPct - bPct;
  });

  return (
    <article className="mx-auto max-w-7xl space-y-6 px-5 py-10">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          {country.region}
          {country.subregion ? ` · ${country.subregion}` : ""}
        </p>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          <span aria-hidden className="text-4xl">
            {country.flag}
          </span>
          {country.name}
          <span className="font-mono text-base text-neutral-400 dark:text-neutral-500">
            {country.iso3}
          </span>
        </h1>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {ranked.map((e) => {
          const pct =
            e.rank && e.total ? Math.round((e.rank / e.total) * 100) : null;
          const tone =
            pct == null
              ? "border-neutral-200 dark:border-neutral-800"
              : pct <= 10
                ? "border-red-500 dark:border-red-600"
                : pct <= 25
                  ? "border-orange-500 dark:border-orange-600"
                  : pct <= 50
                    ? "border-yellow-500 dark:border-yellow-600"
                    : "border-neutral-300 dark:border-neutral-700";
          return (
            <li
              key={e.metric.id}
              className={`rounded-lg border ${tone} bg-white/70 p-4 backdrop-blur dark:bg-neutral-900/40`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <Link
                  href={`/?metric=${e.metric.id}`}
                  className="font-semibold text-neutral-900 hover:underline dark:text-neutral-100"
                >
                  {e.metric.title}
                </Link>
                {e.rank ? (
                  <span className="tabular-nums text-sm text-neutral-700 dark:text-neutral-300">
                    #{e.rank}
                    <span className="text-neutral-400 dark:text-neutral-500"> / {e.total}</span>
                  </span>
                ) : (
                  <span className="text-xs text-neutral-500">no data</span>
                )}
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
                {e.value != null ? formatValue(e.value, e.metric.unit) : "—"}
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {e.metric.source.name}
                {e.year ? ` · ${e.year}` : ""}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="pt-4">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          ← Back to explorer
        </Link>
      </div>
    </article>
  );
}
