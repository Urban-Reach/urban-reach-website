import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Generated robots.txt (build prompt §7).
 *
 * /api/ is disallowed: the contact endpoint accepts POST only and has no
 * crawlable content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
