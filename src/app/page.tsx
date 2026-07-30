import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { Hero } from "@/components/hero";
import { CtaBand, TrustStrip } from "@/components/sections";
import { BlueprintToReality } from "@/components/blueprint-to-reality";
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

              <div className="mt-12 grid gap-5 sm:grid-cols-3">
                {[
                  {
                    title: "Built for commercial scale",
                    body: "Unit-count packages for multifamily developments and full-floor office work. Built for volume, not retail quantities.",
                  },
                  {
                    title: "Sourcing and install together",
                    body: "A single partner from purchase order through installation. No handoff between vendors, and no gap for a detail to fall through.",
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
          Blueprint to reality — signature motion
          ================================================================== */}
      <Section tone="raised" space="base" aria-labelledby="spec-to-installed">
        <Container>
          <SectionHeading
            eyebrow="From spec to installed"
            align="center"
            lead="Every unit we supply begins as a line on an equipment schedule. Scroll to see one resolve."
          >
            <span id="spec-to-installed">
              From specification to installed equipment
            </span>
          </SectionHeading>

          {/* Three instances, not one. The treatment previously appeared only on
              refrigeration here, which read as a one-off flourish tied to a
              single product rather than as how we handle every line on a
              schedule. Each uses a different layout and side so the series does
              not feel like the same block repeated. */}
          <div className="mt-20 space-y-24 lg:space-y-32">
            <BlueprintToReality
              kind="refrigeration"
              eyebrow="Refrigeration"
              title="From a spec line to a unit on site"
              body="A refrigeration callout carries three constraints: a cutout, a utility rough-in, and a finish standard. We reconcile all three before anything is ordered, so the unit that arrives fits the opening that was built."
            />

            <BlueprintToReality
              kind="dishwasher"
              layout="media-wide"
              eyebrow="Dishwashers"
              title="Built around the rough-in that already exists"
              body="Under-counter dishwashing equipment is decided by the utility rough-in and the cabinet opening, not the model line. We check both against the drawings before sourcing."
              reverse
            />

            <BlueprintToReality
              kind="beverage"
              layout="copy-wide"
              eyebrow="Beverage equipment"
              title="Amenity equipment that matches the finish level"
              body="Brewers and beverage coolers sit in the most visible part of an office floor. We source to the finish standard of the space around them."
            />
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
