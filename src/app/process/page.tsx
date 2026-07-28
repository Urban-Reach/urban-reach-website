import type { Metadata } from "next";

import { DrawRule, Reveal } from "@/components/motion";
import { CtaBand, ServiceArea } from "@/components/sections";
import { BlueprintToReality } from "@/components/blueprint-to-reality";
import { PageHero } from "@/components/page-hero";
import {
  Card,
  Container,
  JsonLd,
  Section,
  SectionHeading,
} from "@/components/ui";
import { processSteps, site } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("process");

/**
 * Process.
 *
 * Primary phrase: "commercial appliance installation Austin".
 * Secondary: "tenant improvement appliance fulfillment".
 *
 * PUBLIC-SAFE ONLY (§1): the three steps describe what a client experiences.
 * No internal software, platforms, vendors, or workflow tooling is named here
 * or anywhere else on the site.
 */
export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Process", path: "/process" },
        ])}
      />

      <PageHero
        eyebrow="Process"
        title="From specification to commercial appliance installation in Austin"
        lead="Three steps, one point of contact, and no handoff between the people who priced the appliances and the people who install them."
      />

      {/* Steps */}
      <Section tone="charcoal" aria-labelledby="steps">
        <Container>
          <SectionHeading
            eyebrow="The work"
            lead="Short enough to hold in your head, which is the point."
          >
            <span id="steps">How a project runs with Urban Reach</span>
          </SectionHeading>

          <ol className="mt-16 space-y-5">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 90}>
                <Card className="sm:p-10">
                  <div className="grid gap-6 sm:grid-cols-12 sm:gap-10">
                    <div className="sm:col-span-3">
                      <span
                        className="font-display text-5xl text-amber sm:text-6xl"
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                      <DrawRule width={56} className="mt-5" />
                    </div>
                    <div className="sm:col-span-9">
                      <h3 className="font-display text-2xl leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-lg leading-relaxed text-bone-dim">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Blueprint to reality — the showcase instance */}
      <Section tone="raised" aria-labelledby="resolve">
        <Container>
          <SectionHeading
            eyebrow="Spec to installed"
            align="center"
            lead="The whole process, compressed into one object. Scroll to resolve it."
          >
            <span id="resolve">What step three actually looks like</span>
          </SectionHeading>

          <div className="mt-20 space-y-24 lg:space-y-32">
            <BlueprintToReality
              kind="refrigeration"
              eyebrow="Step 01 → 03"
              title="A refrigeration line item, delivered and set"
              body="It begins as a callout with a model class, a cutout, and a utility requirement. It ends as a unit standing in a finished opening. Everything Urban Reach does happens between those two states."
            />

            <BlueprintToReality
              kind="dishwasher"
              eyebrow="Coordination"
              title="Sequenced to the trades working around us"
              body="Installation is scheduled against the build, not against our calendar. On tenant improvement work in particular, that usually means fitting a narrow window after the millwork lands and before the final walkthrough."
              reverse
            />
          </div>
        </Container>
      </Section>

      {/* Tenant improvement — secondary phrase */}
      <Section tone="walnut" aria-labelledby="ti">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Tenant improvements">
                <span id="ti">
                  Tenant improvement appliance fulfillment, on a tight window
                </span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <div className="space-y-6 text-lg leading-relaxed text-bone-dim">
                  <p>
                    Tenant improvement work rarely gives you a clean slate.
                    Existing conditions decide what will physically fit, the
                    schedule is compressed, and the appliance scope tends to
                    arrive late and fully formed.
                  </p>
                  <p>
                    We treat that as the normal case rather than the exception.
                    Verifying against as-built conditions before ordering, and
                    keeping delivery and installation under one scope, is what
                    keeps a compressed TI schedule from losing days to an
                    appliance that was never going to fit.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* What to send */}
      <Section tone="charcoal" aria-labelledby="what-to-send">
        <Container>
          <SectionHeading
            eyebrow="Getting started"
            lead="None of it has to be final. Partial information early beats complete information late."
          >
            <span id="what-to-send">What is useful to send us first</span>
          </SectionHeading>

          <ul className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "The appliance or equipment schedule",
                body: "Whatever form it exists in — a finished schedule, a spec section, or a marked-up sheet.",
              },
              {
                title: "Relevant plan sheets",
                body: "Enough to see cutouts, clearances, and utility rough-ins for the spaces involved.",
              },
              {
                title: "The build sequence",
                body: "When the spaces are expected to be ready, and any turnover dates we should be working back from.",
              },
            ].map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 80}>
                <Card>
                  <h3 className="font-display text-lg leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-dim">
                    {item.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={140}>
            <p className="mt-10 max-w-2xl leading-relaxed text-bone-dim">
              You can attach these directly to the contact form, or email them to{" "}
              <a
                href={site.emailHref}
                className="link-underline text-amber transition-colors"
              >
                {site.email}
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      <ServiceArea tone="raised" />

      <CtaBand
        title="Ready when your schedule is"
        body="Send the appliance scope and we will tell you what it will cost, how long it will take, and what will not work — before it is a change order."
      />
    </>
  );
}
