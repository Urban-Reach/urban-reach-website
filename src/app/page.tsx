import type { Metadata } from "next";

import { Hero } from "@/components/hero";
import { CtaBand, TrustStrip } from "@/components/sections";
import { JsonLd, PageShell } from "@/components/ui";
import { site } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("home");

export default function HomePage() {
  return (
    <PageShell rhythm="home">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />

      <Hero
        page="home"
        align="center"
        wordmark={{ name: site.name, tagline: site.tagline }}
        lead="Urban Reach supplies and installs commercial-grade appliances for general contractors, architects, and developers building across the Austin metro. One partner, from the equipment schedule to the finished install."
        primary={{ href: "/contact", label: "Start a project" }}
      />

      <TrustStrip />

      <CtaBand />
    </PageShell>
  );
}
