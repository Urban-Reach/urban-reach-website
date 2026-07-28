import Image from "next/image";
import { brands } from "@/data/brands";
import { generalContractors, site } from "@/data/site";
import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";

/* -------------------------------------------------------------------------- */
/* Authorized brand grid                                                      */
/* -------------------------------------------------------------------------- */

/** Small counts read better spelled out in body copy than as numerals. */
function countWord(n: number) {
  return (
    ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ??
    String(n)
  );
}

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
      {/* Deliberately brand-neutral. Urban Reach holds six authorized dealer
          relationships and sources beyond them, so no single manufacturer
          should headline this section or stand in for the whole roster.
          The count is derived from `brands` so it cannot go stale. */}
      {heading && (
        <SectionHeading
          eyebrow="Authorized dealer"
          lead={`Urban Reach is an authorized dealer for the ${countWord(brands.length)} manufacturers below, and sources beyond them whenever a specification requires it.`}
        >
          Manufacturer partnerships, and the range to look beyond them
        </SectionHeading>
      )}

      {/* No chips or boxes behind the marks. Each logo is a reversed one-colour
          asset sitting directly on the dark ground. Rows are separated by
          hairlines instead of cards, and every mark is capped to the same
          optical height so the grid reads evenly despite very different source
          aspect ratios. */}
      <ul className="mt-14 grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 sm:gap-x-14 sm:gap-y-14">
        {brands.map((brand, i) => (
          <Reveal
            as="li"
            key={brand.slug}
            delay={i * 60}
            className="flex h-16 items-center justify-center sm:h-20"
          >
            {brand.logo ? (
              <Image
                src={`${brand.logo}.webp`}
                alt={`${brand.name} — authorized dealer`}
                width={brand.width}
                height={brand.height}
                loading="lazy"
                sizes="(max-width: 640px) 38vw, 200px"
                /* Constrained on BOTH axes inside a fixed cell. Capping height
                   alone left Samsung ~2.7x wider than Summit at the same
                   height, so the row read unevenly. */
                className="max-h-9 w-auto max-w-[150px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 sm:max-h-11 sm:max-w-[180px]"
              />
            ) : (
              /* MISSING ASSET: no Champion logo file has been supplied. Set in
                 the display face at the same optical weight rather than left as
                 a blank gap or filled with a redrawn substitute. */
              <span className="font-display text-2xl text-bone/80 sm:text-[1.75rem]">
                {brand.name}
              </span>
            )}
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
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-16 gap-y-10 sm:gap-x-24">
          {generalContractors.map((gc) => (
            <li key={gc.name} className="flex h-12 items-center justify-center sm:h-14">
              <Image
                src={`${gc.logo}.webp`}
                alt={gc.name}
                width={gc.width}
                height={gc.height}
                loading="lazy"
                sizes="200px"
                className="max-h-8 w-auto max-w-[150px] object-contain opacity-75 transition-opacity duration-300 hover:opacity-100 sm:max-h-10 sm:max-w-[180px]"
              />
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
                Urban Reach works across {site.city} and the surrounding
                communities. Remaining within one metro is deliberate. It is what
                allows us to hold delivery windows and place installers on site
                when the schedule requires, rather than when a regional route
                permits.
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
  title = "Have an equipment schedule to price?",
  body = "Send it to us. We will review the specifications, source against them, and return pricing you can present to a client.",
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
