import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import {
  Card,
  Container,
  JsonLd,
  Section,
  SectionHeading,
  PageShell,
} from "@/components/ui";
import { Hero } from "@/components/hero";
import { site } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <PageShell rhythm="about">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <Hero
        page="about"
        align="left"
        eyebrow="About Urban Reach®"
        headline="An appliance package supplier for general contractors in Austin"
        lead="Urban Reach® exists to do one part of a construction project exceptionally well: specifying, pricing, delivering, and installing commercial-grade appliances without delaying turnover."
        primary={{ href: "/contact", label: "Start a conversation" }}
        secondary={{ href: "/process", label: "See how we work" }}
      />

      <Section id="after-hero" space="airy" tone="charcoal" aria-labelledby="story">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Our story">
                <span id="story">A deliberately narrow focus</span>
              </SectionHeading>

              <Reveal delay={80}>
                <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-md">
                  <Image
                    src="/photos/about-1-install.webp"
                    alt="An installer setting a stainless commercial refrigeration unit into place"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <div className="space-y-6 text-lg leading-relaxed text-bone-dim">
                  <p>
                    Urban Reach® chose a narrow scope on purpose: commercial
                    appliance fulfillment for construction projects, in one
                    metro. That focus is what allows a small team to answer a
                    specification question the same day it is asked.
                  </p>
                  <p>
                    We work with general contractors, architects, designers,
                    and procurement managers across multifamily developments,
                    office buildouts, tenant improvements, and interior finish
                    work. The conversations differ. The work does not: read the
                    schedule, source against it, and be on site on time.
                  </p>
                  <p className="text-bone">
                    The aim is simple. Appliances should be the least eventful
                    part of your schedule.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section space="airy" tone="walnut" aria-labelledby="approach">
        <Container>
          <SectionHeading
            eyebrow="Our approach"
            lead="Four commitments that govern how we work."
          >
            <span id="approach">
              How we approach commercial appliance fulfillment
            </span>
          </SectionHeading>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Read the specification first",
                body: "Before pricing, we reconcile the appliance schedule against the drawings: cutout dimensions, utility rough-ins, clearances, finish level. Most appliance problems on site were determined months earlier, on paper.",
              },
              {
                title: "Price so it can be defended",
                body: "Pricing returns itemized and legible, ready to set against a budget line or present to an owner without translation.",
              },
              {
                title: "Own the whole handoff",
                body: "Sourcing, delivery, and installation form one scope under one point of contact. There is no seam between supplier and installer.",
              },
              {
                title: "Cover the region properly",
                body: "Austin and the surrounding Central Texas region, covered thoroughly enough to commit to a delivery window and keep it.",
              },
            ].map((item, i) => (
              <Reveal as="li" key={item.title} from="left" delay={i * 80}>
                <Card>
                  <h3 className="font-display text-xl leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-bone-dim">
                    {item.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section space="tight" tone="raised" aria-labelledby="who">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Who we work with">
                <span id="who">
                  General contractors first, and everyone building alongside
                  them
                </span>
              </SectionHeading>

              <Reveal delay={80}>
                <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-md">
                  <Image
                    src="/photos/about-2-shipment.webp"
                    alt="Commercial appliances staged and wrapped on a delivery truck at dusk"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <p className="text-lg leading-relaxed text-bone-dim">
                  Urban Reach® partners primarily with general contractors
                  managing commercial projects across {site.city}. We also work
                  directly with architects, designers, developers, and property
                  owners, typically earlier in the process, while the equipment
                  schedule is still forming and selections can still change
                  without a change order.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-6 text-lg leading-relaxed text-bone-dim">
                  It is never too early to involve us. The most productive
                  conversations begin the moment an appliance schedule exists in
                  any form.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <Link
                  href="/contact"
                  className="label-caps-lg link-underline mt-10 inline-flex items-center gap-2 text-amber"
                >
                  Start a conversation
                  <span aria-hidden="true" className="text-sm leading-none">
                    ↗
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

    </PageShell>
  );
}
