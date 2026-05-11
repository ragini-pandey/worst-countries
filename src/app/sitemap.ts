import type { MetadataRoute } from "next";
import { METRICS } from "@/lib/metrics";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://worst-countries.local";
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/about`, lastModified: now },
  ];
  for (const m of METRICS) {
    routes.push({ url: `${base}/rankings/${m.id}`, lastModified: now });
    routes.push({ url: `${base}/map/${m.id}`, lastModified: now });
  }
  return routes;
}
