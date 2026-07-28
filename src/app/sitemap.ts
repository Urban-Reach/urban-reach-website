import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { PAGE_SEO } from "@/lib/seo";

/**
 * Generated sitemap (build prompt §7). Served at /sitemap.xml.
 *
 * Priorities reflect commercial intent rather than depth: Contact ranks
 * alongside the service pages because it carries the FAQ and geo content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const priorities: Record<string, number> = {
    "/": 1.0,
    "/appliances": 0.9,
    "/process": 0.9,
    "/contact": 0.8,
    "/about": 0.7,
    "/privacy-policy": 0.2,
  };

  return Object.values(PAGE_SEO).map((page) => ({
    url: new URL(page.path, site.url).toString(),
    lastModified,
    changeFrequency: page.path === "/" ? "monthly" : "yearly",
    priority: priorities[page.path] ?? 0.5,
  }));
}
