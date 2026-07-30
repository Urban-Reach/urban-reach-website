import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { BrandGrid, CtaBand } from "@/components/sections";
import { BlueprintToReality } from "@/components/blueprint-to-reality";
import { CategoryGlyph } from "@/components/appliance-art";
import { Hero } from "@/components/hero";
import {
  Card,
  Container,
  JsonLd,
  Section,
  SectionHeading,
  PageShell,
} from "@/components/ui";
import { applianceCategories, projectTypes } from "@/data/appliances";
import { site } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("appliances");

/**
 * Appliances.
 *
 * Primary phrase: "commercial appliance dealer Austin".
 * Secondary: "Samsung commercial appliance dealer Austin" (H3 + body),
 * "multifamily appliance supplier", "office buildout appliance supplier".
 *
 * Samsung is targeted as a supporting phrase, NOT as the page's headline. Urban
 * Reach holds six authorized dealer relationships and sources beyond them; a
 * Samsung-led title and H1 misrepresented the business as single-brand. Keep
 * any one manufacturer subordinate to the roster here.
 *
 * The Samsung dealer claim is confirmed but stays Austin-scoped (§7) — it must
 * never be broadened to statewide or Texas-wide.
 */
export default function AppliancesPage() {
  return (
    <PageShell rhythm="appliances">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Appliances", path: "/appliances" },
        ])}
      />

      <Hero
        page="appliances"
        align="left"
        eyebrow="Appliances"
        headline="Commercial appliance categories for Austin construction projects"
        lead="We supply commercial-grade appliances for multifamily, office, and tenant improvement work across the Austin metro — sourced through authorized manufacturer partnerships and installed by the same team that priced them."
        primary={{ href: "/contact", label: "Send a schedule" }}
        secondary={{ href: "/process", label: "See how we work" }}
      />

      {/* Categories */}
      <Section id="after-hero" space="tight" tone="charcoal" aria-labelledby="categories">
        <Container>
          <SectionHeading
            eyebrow="Categories"
            lead="Deliberately broad. What matters is not the category list but matching what a specific equipment schedule calls for."
          >
            <span id="categories">What Urban Reach sources and installs</span>
          </SectionHeading>

          {/* Five categories, so a plain 3-column grid would leave a visible
              gap in the second row. A 6-track grid with each card spanning 2,
              and the 4th card starting at track 2, centres the final row of two
              instead — no empty cell, and it reads as deliberate. */}
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:[&>li]:col-span-2 lg:[&>li:nth-child(4)]:col-start-2">
            {applianceCategories.map((category, i) => (
              <Reveal as="li" key={category.slug} from="rise" delay={i * 70}>
                <Card>
                  <CategoryGlyph
                    kind={category.glyph}
                    className="h-16 w-auto sm:h-[4.5rem]"
                  />
                  <h3 className="mt-6 font-display text-xl">{category.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-dim">
                    {category.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Blueprint to reality — second and third instances */}
      <Section space="base" tone="raised" aria-labelledby="spec-resolve">
        <Container>
          <SectionHeading
            eyebrow="Spec to installed"
            align="center"
            lead="Two further units, resolving the way every appliance we supply does."
          >
            <span id="spec-resolve">
              Every unit starts as a line on an equipment schedule
            </span>
          </SectionHeading>

          <div className="mt-20 space-y-24 lg:space-y-32">
            <BlueprintToReality
              kind="dishwasher"
              layout="media-wide"
              eyebrow="Dishwashers"
              title="Specified around the rough-in that already exists"
              body="Under-counter dishwashing equipment is determined by the utility rough-in and the cabinet opening far more than by the model line. We verify both against the drawings before sourcing. Our units go in once."
            />

            <BlueprintToReality
              kind="beverage"
              layout="copy-wide"
              eyebrow="Beverage equipment"
              title="Amenity equipment that matches the finish level"
              body="Beverage coolers and brewers occupy the most visible parts of an office floor. We source to the finish standard of the surrounding space, not to the schedule's minimum."
              reverse
            />
          </div>
        </Container>
      </Section>

      {/* Authorized brands */}
      <Section space="tight" tone="charcoal" aria-labelledby="dealer">
        <Container>
          <div id="dealer">
            <BrandGrid />
          </div>

          <Reveal delay={160}>
            {/* Centred to match the heading and the logo row above it — the
                three blocks are one section, so they share one alignment. */}
            <div className="mx-auto mt-12 max-w-2xl space-y-4 text-center leading-relaxed text-bone-dim">
              <p>
                These relationships span the range deliberately. Samsung,
                GE/Haier, and Fisher &amp; Paykel carry the residential-grade
                specifications most multifamily unit packages are written to.
                Summit covers the compact and ADA-height cases that constrained
                floor plans require. Champion handles commercial dishwashing.
                BUNN handles beverage service on office amenity floors.
              </p>
              <p>
                {/* The Samsung long-tail phrase still appears in crawlable body
                    copy, but as one relationship among several rather than as
                    the page's identity. */}
                Urban Reach is an authorized Samsung commercial appliance
                dealer in {site.city}, and an authorized dealer for each of the
                brands above. When a specification calls for a manufacturer
                outside that list, we source it.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Project types — secondary phrase targets */}
      <Section space="airy" tone="walnut" aria-labelledby="project-types">
        <Container>
          <SectionHeading
            eyebrow="Project types"
            lead="The same scope of work, shaped by what is being built."
          >
            <span id="project-types">
              A multifamily and office buildout appliance supplier
            </span>
          </SectionHeading>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
            {projectTypes.map((type, i) => (
              <Reveal
                as="li"
                key={type.title}
                delay={i * 80}
                className="bg-walnut p-8 sm:p-10"
              >
                <h3 className="font-display text-xl leading-snug">
                  {type.title}
                </h3>
                <p className="mt-4 leading-relaxed text-bone-dim">{type.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>


      <CtaBand
        title="Send us the equipment schedule"
        body="Share the equipment schedule for your project and we will source against it, price it clearly, and tell you what will not fit before it becomes a problem."
      />
    </PageShell>
  );
}
