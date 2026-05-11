import { METRICS } from "@/lib/metrics";
import { getRanking } from "@/lib/dataset";
import { HomeExplorer } from "@/components/HomeExplorer";

export const revalidate = 86400;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { metric?: string };
}) {
  const requested = searchParams?.metric;
  const defaultId =
    requested && METRICS.some((m) => m.id === requested)
      ? requested
      : "corruption";

  const results = await Promise.all(
    METRICS.map(async (m) => {
      const r = await getRanking(m.id);
      return r;
    })
  );
  const rankings = results.filter(
    (r): r is NonNullable<typeof r> => r !== null && r.rows.length > 0
  );

  return <HomeExplorer rankings={rankings} defaultMetricId={defaultId} />;
}
