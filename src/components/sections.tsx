import Image from "next/image";
import { brands } from "@/data/brands";
import { generalContractors, site } from "@/data/site";
import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";

/* -------------------------------------------------------------------------- */
/* Authorized brand grid                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Every supplied manufacturer mark is dark ink on transparent, so each sits on
 * a light chip. Recoloring a manufacturer's mark to survive a dark background
 * would breach most dealer brand-usage guidelines; presenting the unmodified
 * mark on a light field does not.
 *
 * PLACEHOLDER (§11): confirm each brand's dealer brand-usage guidelines and
 * source final art from their official media/dealer portal before publishing.
 */
export function BrandGrid({ heading = true }: { heading?: boolean }) {
  return (
    <>
      {heading && (
        <SectionHeading
          eyebrow="Authorized dealer"
          lead={`Urban Reach is an authorized dealer for the manufacturers below, and sources additional brands as a project's specifications require.`}
        >
          An authorized Samsung commercial appliance dealer serving Austin
        </SectionHeading>
      )}

      <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {brands.map((brand, i) => (
          <Reveal as="li" key={brand.slug} delay={i * 60}>
            <div className="glow-hover flex h-28 items-center justify-center rounded-lg border border-rule bg-bone px-6 py-5 sm:h-32 sm:px-8">
              {brand.logo ? (
                <Image
                  src={`${brand.logo}.webp`}
                  alt={`${brand.name} — authorized dealer`}
                  width={brand.width}
                  height={brand.height}
                  loading="lazy"
                  sizes="(max-width: 640px) 40vw, 240px"
                  className="max-h-full w-auto object-contain"
                />
              ) : (
                /* MISSING ASSET: no Champion logo file supplied. Listed by name
                   rather than substituted with an unofficial mark. */
                <span className="text-center font-display text-2xl text-charcoal">
                  {brand.name}
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </ul>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* General contractor trust row                                               */
/* -------------------------------------------------------------------------- */

/**
 * Simple typographic name row — NOT case studies, and no project details
 * (build prompt §1). This list is final: Structura, Trimbuilt, Novo.
 *
 * PLACEHOLDER (§11): the spec directs a typographic list until real logo files
 * are supplied by each GC. Files that were provided turned out to be
 * AI-regenerated approximations carrying a generation watermark, which are not
 * the companies' actual marks, so the typographic treatment stands.
 */
export function ContractorRow() {
  return (
    <div className="text-center">
      <Reveal>
        <p className="label-caps text-bone-dim">
          Working with general contractors across the Austin metro
        </p>
      </Reveal>

      <Reveal delay={120}>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-8 sm:gap-x-24">
          {generalContractors.map((name) => (
            <li
              key={name}
              className="font-display text-3xl tracking-wide text-bone/85 transition-colors duration-300 hover:text-amber sm:text-4xl"
            >
              {name}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Service area                                                               */
/* -------------------------------------------------------------------------- */

/** Dedicated geo section — the geo-modifier signal in crawlable body copy. */
export function ServiceArea({ tone = "walnut" }: { tone?: "walnut" | "raised" }) {
  return (
    <Section tone={tone} aria-labelledby="service-area">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Service area" as="h2">
              <span id="service-area">Austin and the surrounding suburbs</span>
            </SectionHeading>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-lg leading-relaxed text-bone-dim">
                Urban Reach works across {site.city} and the communities around
                it. Staying inside one metro is deliberate — it is what lets us
                hold delivery windows and put installers on site when the
                schedule says so, rather than when a regional route allows.
              </p>
            </Reveal>

            <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
              {site.serviceArea.map((city, i) => (
                <Reveal
                  as="li"
                  key={city}
                  delay={i * 60}
                  className="bg-charcoal px-6 py-7"
                >
                  <span className="font-display text-xl text-bone">{city}</span>
                  <span className="mt-1 block text-xs text-bone-dim">
                    {site.state}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Closing CTA                                                                */
/* -------------------------------------------------------------------------- */

/**
 * No "request a bid" flow anywhere (build prompt §1) — bids happen through
 * private industry channels. This is a general inquiry CTA only.
 */
export function CtaBand({
  title = "Have an appliance schedule to price?",
  body = "Send it over. We will review the specifications, source against them, and come back with pricing you can put in front of a client.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section tone="charcoal" className="relative overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading align="center" eyebrow="Get in touch" lead={body}>
            {title}
          </SectionHeading>

          <Reveal delay={140}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/contact">Contact Urban Reach</ButtonLink>
              <a
                href={site.emailHref}
                className="label-caps-lg link-underline px-2 py-4 text-bone transition-colors hover:text-amber"
              >
                {site.email}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
