import Link from "next/link";
import type { Metadata } from "next";

import { Parallax, Reveal } from "@/components/motion";
import {
  BrandGrid,
  ContractorRow,
  CtaBand,
  ServiceArea,
} from "@/components/sections";
import { BlueprintToReality } from "@/components/blueprint-to-reality";
import { CategoryGlyph } from "@/components/appliance-art";
import {
  ButtonLink,
  Card,
  Container,
  JsonLd,
  Section,
  SectionHeading,
} from "@/components/ui";
import { applianceCategories } from "@/data/appliances";
import { processSteps, site } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("home");

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />

      {/* ==================================================================
          Hero
          PLACEHOLDER (§11): the blueprint field below stands in for real
          jobsite photography, which does not exist yet. It is sized and
          positioned so a real image can drop straight into this container.
          ================================================================== */}
      <section className="relative overflow-hidden border-b border-rule">
        <Parallax speed={0.1} className="absolute inset-0 -top-24 h-[130%]">
          <div className="blueprint-grid h-full w-full" />
        </Parallax>

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_38%,rgba(201,146,47,0.16),transparent_62%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-charcoal"
          aria-hidden="true"
        />

        <Container className="relative py-28 sm:py-36 lg:py-44">
          <div className="max-w-4xl">
            <Reveal>
              <p className="label-caps-lg text-amber">{site.tagline}</p>
            </Reveal>

            <Reveal delay={110}>
              <h1 className="mt-8 text-[2.5rem] leading-[1.08] sm:text-6xl lg:text-7xl">
                A commercial appliance supplier in Austin, TX built around the
                construction schedule
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-dim sm:text-xl">
                Urban Reach sources, prices, delivers, and installs
                commercial-grade appliances for general contractors, architects,
                and designers building across the Austin metro. One partner from
                the appliance schedule to the finished install.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <ButtonLink href="/contact">Start a conversation</ButtonLink>
                <ButtonLink href="/appliances" variant="ghost">
                  See what we supply
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ==================================================================
          Value proposition
          ================================================================== */}
      <Section tone="charcoal" aria-labelledby="value-prop">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Why Urban Reach">
                <span id="value-prop">
                  Appliance fulfillment that behaves like part of your project
                  team
                </span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-bone-dim">
                  Appliances are usually the last thing specified and the first
                  thing to hold up a turnover. Urban Reach exists to take that
                  risk off the critical path — reading the schedule properly,
                  sourcing against it, and showing up when the space is ready.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-5 sm:grid-cols-3">
                {[
                  {
                    title: "Built for commercial scale",
                    body: "Unit-count packages for multifamily and full-floor office work, not one-off retail orders.",
                  },
                  {
                    title: "Sourcing and install together",
                    body: "One partner from purchase order through on-site installation, so nothing falls between vendors.",
                  },
                  {
                    title: "One metro, properly covered",
                    body: "Austin and its immediate suburbs — close enough to hold a delivery window.",
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
      <Section tone="raised" aria-labelledby="spec-to-installed">
        <Container>
          <SectionHeading
            eyebrow="From spec to installed"
            align="center"
            lead="Every unit we supply starts as a line on an equipment schedule. Scroll to watch one resolve."
          >
            <span id="spec-to-installed">
              We read the drawing, then we install the appliance
            </span>
          </SectionHeading>

          <div className="mt-20">
            <BlueprintToReality
              kind="refrigeration"
              eyebrow="Refrigeration"
              title="From a spec line to a unit on site"
              body="A refrigeration callout on an equipment schedule carries a cutout, a utility rough-in, and a finish expectation. We match all three before anything is ordered, so the unit that arrives fits the opening that was actually framed."
            />
          </div>
        </Container>
      </Section>

      {/* ==================================================================
          Service categories
          ================================================================== */}
      <Section tone="charcoal" aria-labelledby="what-we-supply">
        <Container>
          <SectionHeading
            eyebrow="What we supply"
            lead="Categories stay broad on purpose — project schedules rarely stop at the obvious appliances."
          >
            <span id="what-we-supply">
              Commercial appliance categories for Austin construction projects
            </span>
          </SectionHeading>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {applianceCategories.map((category, i) => (
              <Reveal as="li" key={category.slug} delay={i * 70}>
                <Card>
                  <CategoryGlyph
                    kind={category.glyph}
                    className="h-10 w-10 text-amber"
                  />
                  <h3 className="mt-6 font-display text-xl">{category.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-dim">
                    {category.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120}>
            <div className="mt-12">
              <Link
                href="/appliances"
                className="label-caps-lg link-underline text-amber"
              >
                View all appliance categories
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ==================================================================
          Process teaser
          ================================================================== */}
      <Section tone="walnut" aria-labelledby="how-it-works">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="How it works"
                lead="Three steps, start to finish, with one point of contact throughout."
              >
                <span id="how-it-works">
                  A process short enough to hold in your head
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

      {/* ==================================================================
          Authorized brands
          ================================================================== */}
      <Section tone="charcoal" aria-labelledby="brands">
        <Container>
          <div id="brands">
            <BrandGrid />
          </div>
        </Container>
      </Section>

      {/* ==================================================================
          GC trust row
          ================================================================== */}
      <Section tone="raised">
        <Container>
          <ContractorRow />
        </Container>
      </Section>

      <ServiceArea tone="walnut" />

      <CtaBand />
    </>
  );
}
