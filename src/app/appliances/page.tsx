import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { BrandGrid, CtaBand, ServiceArea } from "@/components/sections";
import { BlueprintToReality } from "@/components/blueprint-to-reality";
import { CategoryGlyph } from "@/components/appliance-art";
import { PageHero } from "@/components/page-hero";
import {
  Card,
  Container,
  JsonLd,
  Section,
  SectionHeading,
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
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Appliances", path: "/appliances" },
        ])}
      />

      <PageHero
        eyebrow="Appliances"
        title="Commercial appliance categories for Austin construction projects"
        lead="Urban Reach supplies commercial-grade appliances for multifamily, office, and tenant improvement work across the Austin metro — sourced through authorized manufacturer partnerships and installed by the same team that priced them."
      />

      {/* Categories */}
      <Section tone="charcoal" aria-labelledby="categories">
        <Container>
          <SectionHeading
            eyebrow="Categories"
            lead="Kept broad on purpose. A final category list is not the point — matching what a specific project schedule actually calls for is."
          >
            <span id="categories">What Urban Reach sources and installs</span>
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
        </Container>
      </Section>

      {/* Blueprint to reality — second and third instances */}
      <Section tone="raised" aria-labelledby="spec-resolve">
        <Container>
          <SectionHeading
            eyebrow="Spec to installed"
            align="center"
            lead="Two more units, resolving the same way every appliance we supply does."
          >
            <span id="spec-resolve">
              Every unit starts as a line on an equipment schedule
            </span>
          </SectionHeading>

          <div className="mt-20 space-y-24 lg:space-y-32">
            <BlueprintToReality
              kind="dishwasher"
              eyebrow="Dishwashers"
              title="Specified around the rough-in that already exists"
              body="Under-counter dishwashing equipment is decided by the utility rough-in and the cabinet opening far more than by the model line. We check both against the drawings before sourcing, which is why our units tend to go in once."
            />

            <BlueprintToReality
              kind="beverage"
              eyebrow="Beverage equipment"
              title="Amenity equipment that matches the finish level"
              body="Beverage coolers and brewers sit in the most visible parts of an office floor. We source to the finish standard of the surrounding space, not just to the equipment schedule's minimum."
              reverse
            />
          </div>
        </Container>
      </Section>

      {/* Authorized brands */}
      <Section tone="charcoal" aria-labelledby="dealer">
        <Container>
          <div id="dealer">
            <BrandGrid />
          </div>

          <Reveal delay={160}>
            <div className="mt-12 max-w-2xl space-y-4 leading-relaxed text-bone-dim">
              <p>
                Those relationships cover a wide span on purpose. Samsung, GE/Haier,
                and Fisher &amp; Paykel carry the residential-grade specifications
                that multifamily unit packages are usually written to. Summit
                handles the compact and ADA-height cases that tight floor plans
                force. Champion covers commercial dishwashing, and BUNN covers
                beverage service on office amenity floors.
              </p>
              <p>
                {/* The Samsung long-tail phrase still appears in crawlable body
                    copy, but as one relationship among several rather than as
                    the page's identity. */}
                Urban Reach is an authorized Samsung commercial appliance dealer
                in {site.city}, and an authorized dealer for each of the other
                brands above. When a specification points somewhere else
                entirely, we source it rather than talk you out of it.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Project types — secondary phrase targets */}
      <Section tone="walnut" aria-labelledby="project-types">
        <Container>
          <SectionHeading
            eyebrow="Project types"
            lead="The same scope of work, shaped differently by what is being built."
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

      <ServiceArea tone="raised" />

      <CtaBand
        title="Send us the appliance schedule"
        body="Share the equipment schedule for your project and we will source against it, price it clearly, and tell you what will not fit before it becomes a problem."
      />
    </>
  );
}
