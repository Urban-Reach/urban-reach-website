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
/* Trust strip — directly beneath the hero                                    */
/* -------------------------------------------------------------------------- */

/**
 * The credibility signal, placed as the first thing after the hero.
 *
 * Deliberately NOT the same section as BrandGrid on the Appliances page. This is
 * logos only — two quiet labelled rows, no heading, no lead, no cards. The
 * Appliances page carries the same marks inside a section whose actual content
 * is the explanatory copy about what each manufacturer covers. Same assets, two
 * genuinely different jobs: recognition here, explanation there.
 *
 * Used on the homepage only.
 */
export function TrustStrip() {
  return (
    // id="after-hero" is the scroll cue's target: it must sit on whichever
    // section comes first below the hero.
    <Section id="after-hero" tone="raised" space="tight" aria-labelledby="trust">
      <Container>
        <h2 id="trust" className="sr-only">
          Authorized manufacturer partners and general contractors we work with
        </h2>

        <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-20">
          <Reveal>
            <p className="label-caps max-w-[13rem] text-bone-dim">
              Authorized dealer for
            </p>
          </Reveal>

          <Reveal delay={90}>
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-8 sm:gap-x-16">
              {brands.map((brand) => (
                <li key={brand.slug} className="flex h-9 items-center sm:h-10">
                  {brand.logo ? (
                    <Image
                      src={`${brand.logo}.webp`}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      loading="lazy"
                      sizes="160px"
                      className="max-h-8 w-auto max-w-[126px] object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 sm:max-h-9 sm:max-w-[148px]"
                    />
                  ) : (
                    /* MISSING ASSET: no Champion logo file supplied. */
                    <span className="font-display text-xl text-bone/70">{brand.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-rule pt-14">
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-20">
            <Reveal>
              <p className="label-caps max-w-[13rem] text-bone-dim">
                Working with
              </p>
            </Reveal>

            <Reveal delay={90}>
              <ul className="flex flex-wrap items-center gap-x-14 gap-y-8 sm:gap-x-20">
                {generalContractors.map((gc) => (
                  <li key={gc.name} className="flex h-9 items-center sm:h-10">
                    <Image
                      src={`${gc.logo}.webp`}
                      alt={gc.name}
                      width={gc.width}
                      height={gc.height}
                      loading="lazy"
                      sizes="160px"
                      className="max-h-8 w-auto max-w-[132px] object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 sm:max-h-9 sm:max-w-[154px]"
                    />
                  </li>
                ))}
              </ul>
            </Reveal>
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
