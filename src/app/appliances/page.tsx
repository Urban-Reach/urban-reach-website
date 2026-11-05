import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { BrandGrid, CtaBand } from "@/components/sections";
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
        lead="Urban Reach supplies commercial-grade appliances for general contractors and architects managing multifamily, office, and tenant improvement work across the Austin metro. Every unit is sourced through an authorized manufacturer partnership and installed by the same team that priced it."
        primary={{ href: "/contact", label: "Send a schedule" }}
        secondary={{ href: "/process", label: "See how we work" }}
      />

      <Section id="after-hero" space="tight" tone="charcoal" aria-labelledby="categories">
        <Container>
          <SectionHeading
            eyebrow="Categories"
            lead="Deliberately broad. What matters is not the category list but matching what a specific equipment schedule calls for."
          >
            <span id="categories">What Urban Reach sources and installs</span>
          </SectionHeading>

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

      <Section space="tight" tone="charcoal" aria-labelledby="dealer">
        <Container>
          <div id="dealer">
            <BrandGrid />
          </div>

          <Reveal delay={160}>
            <div className="mx-auto mt-12 max-w-2xl space-y-4 text-center leading-relaxed text-bone-dim">
              <p>
                Urban Reach holds close, authorized relationships with the
                manufacturers it carries, chosen to cover different
                specification tiers, compact and ADA-height options for
                constrained floor plans, and dedicated categories such as
                commercial dishwashing and beverage service. Those
                relationships are the standing core, not the ceiling. When a
                project calls for a manufacturer outside them, Urban Reach
                sources it just the same.
              </p>
              <p>
                Urban Reach is an authorized Samsung commercial appliance
                dealer in {site.city}, and an authorized dealer for each of the
                brands above.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

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
