import type { MetadataRoute } from "next";
import { getPublishablePages } from "@/lib/pages";
import { absoluteUrl } from "@/lib/site";

/** Sitemap lists only publishable pages, plus each hub that has at least one. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPublishablePages();
  const hubs = [...new Set(pages.map((p) => p.service.slug))];

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...hubs.map((slug) => ({
      url: absoluteUrl(`/${slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...pages.map((p) => ({
      url: absoluteUrl(p.path),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
