import { redirect } from "next/navigation";

export default function RankingRedirect({
  params,
}: {
  params: { metric: string };
}) {
  redirect(`/?metric=${encodeURIComponent(params.metric)}`);
}
