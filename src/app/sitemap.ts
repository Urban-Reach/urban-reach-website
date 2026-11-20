import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { DRAFT_PAGES, PAGE_SEO } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const priorities: Record<string, number> = {
    "/": 1.0,
    "/contact": 0.8,
    "/privacy-policy": 0.2,
  };

  return (Object.keys(PAGE_SEO) as (keyof typeof PAGE_SEO)[])
    .filter((key) => !DRAFT_PAGES.includes(key))
    .map((key) => PAGE_SEO[key])
    .map((page) => ({
      url: new URL(page.path, site.url).toString(),
      lastModified,
      changeFrequency: page.path === "/" ? "monthly" : "yearly",
      priority: priorities[page.path] ?? 0.5,
    }));
}
