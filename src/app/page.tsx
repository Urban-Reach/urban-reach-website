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
        lead="We provide end-to-end procurement and installation of commercial-grade appliances for general contractors, architects, and developers throughout Central Texas. We oversee every phase of the process, from design through final installation."
        primary={{ href: "/contact", label: "Start a project" }}
      />

      <TrustStrip />

      <CtaBand />
    </PageShell>
  );
}
