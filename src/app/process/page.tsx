import type { Metadata } from "next";
import Image from "next/image";

import { DrawRule, Reveal } from "@/components/motion";
import { CtaBand } from "@/components/sections";
import { Hero } from "@/components/hero";
import {
  Card,
  Container,
  JsonLd,
  Section,
  SectionHeading,
  PageShell,
} from "@/components/ui";
import { processSteps, site } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("process");

/** One photo per step, in processSteps order. */
const stepPhotos = [
  { src: "/photos/process-1-review.webp", alt: "An equipment schedule and floor plan for a commercial kitchen laid out on a desk" },
  { src: "/photos/process-2-source.webp", alt: "Commercial appliances staged in wholesale crates in a warehouse" },
  { src: "/photos/process-3-deliver.webp", alt: "An installer setting a commercial range into a finished kitchen opening" },
] as const;

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
    <PageShell rhythm="process">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Process", path: "/process" },
        ])}
      />

      <Hero
        page="process"
        align="left"
        eyebrow="Process"
        headline="From specification to commercial appliance installation in Austin"
        lead="Urban Reach manages commercial appliance installation for general contractors and architects in three steps. One point of contact, and no handoff between the people who price the appliances and the people who install them."
        primary={{ href: "/contact", label: "Start a conversation" }}
        secondary={{ href: "/appliances", label: "See what we supply" }}
      />

      {/* Steps */}
      <Section id="after-hero" space="base" tone="charcoal" aria-labelledby="steps">
        <Container>
          <SectionHeading
            eyebrow="The work"
            lead="A short, predictable sequence, by design."
          >
            <span id="steps">How a project runs with Urban Reach</span>
          </SectionHeading>

          {/* Cards are deliberately compact. At the previous size (sm:p-10
              padding, a text-6xl number, and a 3:2 photo that grew with the
              card's full width) three of these stacked past a laptop's
              viewport height, and the photo was doing more work than the
              content beside it. The photo is now a fixed, capped height
              instead of an aspect ratio, so it stays a supporting image
              rather than the dominant element regardless of how wide the
              card gets. */}
          <ol className="mt-16 space-y-4">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.number} from="right" delay={i * 90}>
                <Card className="overflow-hidden sm:p-7">
                  <div className="grid gap-5 sm:grid-cols-12 sm:gap-8">
                    <div className="sm:col-span-3">
                      <span
                        className="font-display text-4xl text-amber sm:text-5xl"
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                      <DrawRule width={48} className="mt-4" />
                    </div>
                    <div className="sm:col-span-9">
                      <h3 className="font-display text-xl leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-bone-dim">
                        {step.body}
                      </p>
                    </div>
                  </div>

                  {stepPhotos[i] && (
                    <div className="relative mt-6 h-44 w-full overflow-hidden rounded-md sm:h-52 md:h-56">
                      <Image
                        src={stepPhotos[i].src}
                        alt={stepPhotos[i].alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 700px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </Card>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Tenant improvement — secondary phrase */}
      <Section space="tight" tone="walnut" aria-labelledby="ti">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:[&>*:first-child]:order-2">
            <div className="lg:col-span-6">
              <SectionHeading eyebrow="Tenant improvements">
                <span id="ti">
                  Tenant improvement appliance fulfillment, on a tight window
                </span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <div className="space-y-6 text-lg leading-relaxed text-bone-dim">
                  <p>
                    Tenant improvement work rarely offers a clean slate.
                    Existing conditions determine what will physically fit, the
                    schedule is compressed, and the appliance scope typically
                    arrives late and fully formed.
                  </p>
                  <p>
                    We treat that as the standard case, not the exception.
                    Verifying against as-built conditions before ordering, and
                    keeping delivery and installation within one scope, is what
                    prevents a compressed schedule from losing days to equipment
                    that was never going to fit.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* What to send */}
      <Section space="base" tone="charcoal" aria-labelledby="what-to-send">
        <Container>
          <SectionHeading
            eyebrow="Getting started"
            lead="None of it needs to be final. Partial information early is worth more than complete information late."
          >
            <span id="what-to-send">What is useful to send us first</span>
          </SectionHeading>

          <ul className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "The appliance or equipment schedule",
                body: "In whatever form it currently exists, such as a finished schedule, a specification section, or a marked-up sheet.",
              },
              {
                title: "Relevant plan sheets",
                body: "Enough to see cutouts, clearances, and utility rough-ins for the spaces involved.",
              },
              {
                title: "The build sequence",
                body: "When the spaces are expected to be ready, and the turnover dates we should work back from.",
              },
            ].map((item, i) => (
              <Reveal as="li" key={item.title} from="right" delay={i * 80}>
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


      <CtaBand
        title="Ready when your schedule is"
        body="Send the appliance scope. We will tell you what it costs, how long it takes, and what will not work, before any of it becomes a change order."
      />
    </PageShell>
  );
}
