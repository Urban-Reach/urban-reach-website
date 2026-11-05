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
        /* Wordmark and tagline sit inside one H1 so the page keeps a single
           heading that still carries "commercial appliance" and "Austin". The
           exact primary phrase appears in the title tag and in the lead below. */
        wordmark={{ name: site.name, tagline: site.tagline }}
        lead="Urban Reach supplies and installs commercial-grade appliances for general contractors, architects, and developers building across the Austin metro. One partner, from the equipment schedule to the finished install."
        primary={{ href: "/contact", label: "Start a project" }}
      />

      {/* ==================================================================
          Trust — moved directly beneath the hero. This is the credibility
          signal, so it should be among the first things a visitor sees rather
          than something they scroll several sections past.
          ================================================================== */}
      <TrustStrip />

      <CtaBand />
    </PageShell>
  );
}
