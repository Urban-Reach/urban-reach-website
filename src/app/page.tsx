import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { Hero } from "@/components/hero";
import { CtaBand, TrustStrip } from "@/components/sections";
import { Seam } from "@/components/seam";
import {
  ButtonLink,
  Card,
  Container,
  JsonLd,
  PageShell,
  Section,
  SectionHeading,
} from "@/components/ui";
import { processSteps, site } from "@/data/site";
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
        lead="We supply and install commercial-grade appliances for construction projects across the Austin metro. One partner, from the equipment schedule to the finished install."
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/appliances", label: "See our work" }}
      />

      {/* ==================================================================
          Trust — moved directly beneath the hero. This is the credibility
          signal, so it should be among the first things a visitor sees rather
          than something they scroll several sections past.
          ================================================================== */}
      <TrustStrip />

      {/* ==================================================================
          Value proposition
          ================================================================== */}
      <Section tone="charcoal" space="airy" aria-labelledby="value-prop">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Why Urban Reach">
                <span id="value-prop">
                  Appliance fulfillment that operates as part of your project
                  team
                </span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-bone-dim">
                  Appliances are specified last and delay turnover first.
                  Urban Reach removes that risk from the critical path. We read
                  the schedule closely, source against it, and arrive when the
                  space is ready.
                </p>
              </Reveal>

              {/* Two cards, not three. "Sourcing and install together" used to
                  sit here; it is now the signature section below, which states it
                  far better than a card can. Saying it in both places was the
                  repetition this site has been repeatedly pulled up on. */}
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {[
                  {
                    title: "Built for commercial scale",
                    body: "Unit-count packages for multifamily developments and full-floor office work. Built for volume, not retail quantities.",
                  },
                  {
                    title: "One metro, covered properly",
                    body: "Austin and its immediate suburbs. Close enough to commit to a delivery window and keep it.",
                  },
                ].map((item, i) => (
                  <Reveal key={item.title} delay={i * 90}>
                    <Card>
                      <h3 className="font-display text-xl leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-bone-dim">
                        {item.body}
                      </p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ==================================================================
          Signature animation — the seam

          The homepage's own treatment. /appliances resolves a product and
          /contact draws a place; this resolves a relationship, so the three
          share no visual language.

          Centred rather than set beside the heading, because the composition is
          horizontal and symmetrical — the gap has to close in the middle of the
          reader's attention, not off to one side.
          ================================================================== */}
      <Section tone="raised" space="base" aria-labelledby="no-handoff">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              align="center"
              eyebrow="One partner"
              lead="Appliance work is usually split between a vendor who sells and a contractor who installs. Urban Reach is both, so nothing is passed across a boundary and nothing waits at one."
            >
              <span id="no-handoff">No handoff, and no gap to fall through</span>
            </SectionHeading>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <Seam />
          </div>
        </Container>
      </Section>

      {/* ==================================================================
          Process teaser
          ================================================================== */}
      <Section tone="walnut" space="base" aria-labelledby="how-it-works">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="How it works"
                lead="A short, predictable sequence from specification through installation."
              >
                <span id="how-it-works">
                  Three steps, one point of contact
                </span>
              </SectionHeading>

              <Reveal delay={140}>
                <div className="mt-10">
                  <ButtonLink href="/process" variant="ghost">
                    See the full process
                  </ButtonLink>
                </div>
              </Reveal>
            </div>

            <ol className="lg:col-span-7">
              {processSteps.map((step, i) => (
                <Reveal
                  as="li"
                  key={step.number}
                  delay={i * 90}
                  className="flex gap-6 border-b border-rule py-8 first:pt-0 last:border-0 last:pb-0"
                >
                  <span
                    className="font-display text-2xl text-amber"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-bone-dim">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </PageShell>
  );
}
