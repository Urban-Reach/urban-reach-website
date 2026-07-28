import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { ContractorRow, CtaBand, ServiceArea } from "@/components/sections";
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

/**
 * About.
 *
 * CONTENT INTEGRITY (§1, §7): Urban Reach is roughly one year old. That is
 * stated plainly rather than obscured. There are deliberately NO years-in-
 * business claims, project counts, satisfaction percentages, testimonials, or
 * certifications on this page — the company holds no WBE/MBE status or bonding,
 * and none of those numbers have been confirmed. Confidence is carried by
 * qualitative language instead.
 */
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
        composition="offset"
        eyebrow="About Urban Reach"
        headline="An appliance package supplier for general contractors in Austin"
        lead="Urban Reach was built to do one part of a construction project properly: getting the right commercial-grade appliances specified, priced, delivered, and installed without becoming the thing that holds up a turnover."
        primary={{ href: "/contact", label: "Start a conversation" }}
        secondary={{ href: "/process", label: "See how we work" }}
      />

      {/* Story */}
      <Section id="after-hero" space="airy" tone="charcoal" aria-labelledby="story">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Our story">
                <span id="story">A young company, deliberately focused</span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <div className="space-y-6 text-lg leading-relaxed text-bone-dim">
                  <p>
                    Urban Reach is about a year old. We would rather say that
                    plainly than dress it up, because the people we work with
                    are going to find out anyway — and because being new is not
                    the same as being unprepared.
                  </p>
                  <p>
                    What we chose instead of a long history is a narrow scope. We
                    do commercial appliance fulfillment for construction
                    projects, in one metro, and we do not pretend to be a
                    general supplier of everything else. That focus is what lets
                    a small team answer a specification question the same day it
                    is asked.
                  </p>
                  <p>
                    We work with general contractors, architects, designers, and
                    procurement managers on multifamily developments, office
                    buildouts, tenant improvements, and interior finish work. The
                    conversations differ, but the job is the same one: read the
                    schedule, source against it, and be on site when the space
                    is ready.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission */}
      <Section space="base" tone="walnut" aria-labelledby="mission">
        <Container>
          <SectionHeading
            eyebrow="Mission"
            align="center"
            lead="Take the appliance scope off a project's critical path — completely, and without drama."
          >
            <span id="mission">
              Appliances should be the least interesting part of your schedule
            </span>
          </SectionHeading>
        </Container>
      </Section>

      {/* Approach */}
      <Section space="airy" tone="charcoal" aria-labelledby="approach">
        <Container>
          <SectionHeading
            eyebrow="Our approach"
            lead="Four commitments that shape how Urban Reach handles commercial appliance fulfillment."
          >
            <span id="approach">
              How we approach commercial appliance fulfillment
            </span>
          </SectionHeading>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Read the specification first",
                body: "Before pricing anything, we work through the appliance schedule against the drawings — cutout dimensions, utility rough-ins, clearances, finish level. Most appliance problems on a jobsite were decided months earlier on paper.",
              },
              {
                title: "Price so it can be defended",
                body: "Pricing comes back itemized and legible, in a form you can hold against a budget line or put in front of an owner without translating it first.",
              },
              {
                title: "Own the whole handoff",
                body: "Sourcing, delivery, and installation are one scope with one point of contact. There is no seam between a supplier and an installer for something to fall through.",
              },
              {
                title: "Stay inside the metro",
                body: "Austin and its immediate suburbs. Turning down work outside that radius is what keeps us able to commit to a delivery window inside it.",
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

      {/* Who we work with */}
      <Section space="tight" tone="raised" aria-labelledby="who">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Who we work with">
                <span id="who">
                  General contractors first, and everyone building alongside them
                </span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <p className="text-lg leading-relaxed text-bone-dim">
                  Urban Reach primarily partners with general contractors
                  managing commercial projects across {site.city}. We also work
                  directly with architects, designers, developers, and property
                  owners — usually earlier in the process, while the equipment
                  schedule is still taking shape and selections can still move
                  without a change order.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-6 text-lg leading-relaxed text-bone-dim">
                  If you are weighing whether it is too early to bring us in: it
                  is not. The most useful conversations we have start the moment
                  an appliance schedule exists in any form.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section space="tight" tone="charcoal">
        <Container>
          <ContractorRow />
        </Container>
      </Section>

      <ServiceArea tone="walnut" />

      <CtaBand
        title="Bring us in early"
        body="Send the appliance schedule as soon as you have one. The earlier we see it, the more room there is to align selections with the budget and the build sequence."
      />
    </PageShell>
  );
}
