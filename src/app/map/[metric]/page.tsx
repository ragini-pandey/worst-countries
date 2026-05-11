import { redirect } from "next/navigation";
import { METRICS } from "@/lib/metrics";

export function generateStaticParams() {
  return METRICS.map((m) => ({ metric: m.id }));
}

export default function MapRedirect({
  params,
}: {
  params: { metric: string };
}) {
  // The ranking page now embeds the map; keep this URL stable as a redirect.
  redirect(`/rankings/${params.metric}`);
}
