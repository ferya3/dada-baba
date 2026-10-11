import type { MetadataRoute } from "next";
import { getNews, getSubsidiaries } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [subsidiaries, news] = await Promise.all([getSubsidiaries(), getNews()]);
  const staticRoutes = ["/", "/about", "/subsidiaries", "/services", "/projects", "/news", "/careers", "/contact"];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...subsidiaries.map((s) => ({
      url: absoluteUrl(`/subsidiaries/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...news.map((n) => ({ url: absoluteUrl(`/news/${n.slug}`), lastModified: n.date, priority: 0.6 })),
  ];
}
