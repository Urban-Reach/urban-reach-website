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

/* -------------------------------------------------------------------------- */
/* Shared logo row                                                            */
/* -------------------------------------------------------------------------- */

type Mark = {
  readonly name: string;
  readonly logo: string | null;
  readonly width: number;
  readonly height: number;
  readonly opticalScale: number;
};

/**
 * The ONE place logo sizing is decided.
 *
 * Both the homepage trust strip and the Appliances dealer grid render through
 * this, so the two cannot drift apart — they previously carried separate size
 * caps and the same six marks came out at different proportions in each.
 *
 * Two things make a row of mismatched marks read as even:
 *
 *  1. Per-mark optical scaling. Each height is `--mark-h * opticalScale`, a
 *     tempered equal-area factor stored alongside the asset (see brands.ts).
 *     Equal height alone made Samsung dominate at 2.8x the area of Summit.
 *  2. `max-w-none`. Tailwind preflight applies `img { max-width: 100% }`, and
 *     inside a flex row that percentage resolves against each item's share of
 *     the line — which silently width-bound the wide marks and undid the
 *     scaling. Releasing it lets height drive width, as it must.
 *
 * Layout is a fixed grid below xl and a nowrap flex row at xl. Free-flowing
 * `flex-wrap` is deliberately not used: at intermediate widths it put five
 * marks on one line and orphaned BUNN alone on a second. Fixed tracks break
 * 3 + 3, then 2 + 2 + 2.
 *
 * The --mark-h ladders below are measured, not guessed: at every breakpoint the
 * widest mark in each row fits its track (or, at xl, the whole row fits the
 * 1216px content box alongside its gaps) with margin to spare. Raising them
 * means re-measuring.
 */
const MARK_HEIGHTS = {
  /* Three marks and a full row to themselves, so these run appreciably larger
     than the manufacturer row — up to 62px against 46px. */
  gc: "[--mark-h:34px] sm:[--mark-h:44px] md:[--mark-h:50px] lg:[--mark-h:56px] xl:[--mark-h:62px]",
  vendor: "[--mark-h:30px] sm:[--mark-h:34px] md:[--mark-h:40px] xl:[--mark-h:46px]",
} as const;

function LogoRow({
  marks,
  variant,
  altSuffix = "",
}: {
  marks: readonly Mark[];
  variant: "gc" | "vendor";
  /** Appended to each alt, e.g. ", authorized dealer". */
  altSuffix?: string;
}) {
  return (
    <ul
      className={`mt-10 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 md:grid-cols-3 md:gap-x-10 xl:flex xl:flex-nowrap xl:justify-center xl:gap-x-6 ${MARK_HEIGHTS[variant]}`}
    >
      {marks.map((mark, i) => (
        <Reveal
          as="li"
          key={mark.name}
          delay={i * 60}
          className="flex h-16 shrink-0 items-center"
        >
          {mark.logo ? (
            <Image
              src={`${mark.logo}.webp`}
              alt={`${mark.name}${altSuffix}`}
              width={mark.width}
              height={mark.height}
              loading="lazy"
              sizes="(max-width: 640px) 45vw, 250px"
              style={{ height: `calc(var(--mark-h) * ${mark.opticalScale})` }}
              className="w-auto max-w-none object-contain opacity-75 transition-opacity duration-300 hover:opacity-100"
            />
          ) : (
            /* MISSING ASSET: no logo file supplied for this brand. Set in the
               display face at a comparable optical weight rather than left as a
               blank gap or filled with a redrawn substitute. */
            <span className="font-display text-xl text-bone/70">{mark.name}</span>
          )}
        </Reveal>
      ))}
    </ul>
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
          The count is derived from `brands` so it cannot go stale.

          Centred, because the logo row beneath it is centred. Left-aligned copy
          above a centred row read as two unrelated blocks. */}
      {heading && (
        <SectionHeading
          align="center"
          eyebrow="Authorized dealer"
          lead={`Urban Reach is an authorized dealer for the ${countWord(brands.length)} manufacturers below, and sources beyond them whenever a specification requires it.`}
        >
          Manufacturer partnerships, and the range to look beyond them
        </SectionHeading>
      )}

      {/* No chips or boxes behind the marks. Each logo is a reversed one-colour
          asset sitting directly on the dark ground. Sizing comes from the shared
          LogoRow above, so this row and the homepage trust strip are guaranteed
          to match. */}
      <LogoRow marks={brands} variant="vendor" altSuffix=", authorized dealer" />
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
          General contractors we work with, and our authorized manufacturer
          partners
        </h2>

        {/* Both rows share one treatment so they read as a pair: a centred label
            above a centred row, same hover, same sizing rules. The GC row comes
            first — those are the clients, which is the stronger opening signal.
            The GC marks run larger because there are only three of them. */}
        <Reveal>
          <p className="label-caps text-center text-bone-dim">Working with</p>
        </Reveal>
        <LogoRow marks={generalContractors} variant="gc" />

        <div className="mt-16 border-t border-rule pt-16">
          <Reveal>
            <p className="label-caps text-center text-bone-dim">
              Authorized dealer for
            </p>
          </Reveal>
          <LogoRow marks={brands} variant="vendor" />
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
