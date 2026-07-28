import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui";

/**
 * Site-wide hero.
 *
 * One component drives the hero on every page so the typography scale, photo
 * treatment, CTA pattern and scroll indicator cannot drift apart. Each page
 * passes a different `page`, which selects both its crop of the kitchen
 * photograph and its composition, so the pages are visibly different
 * arrangements of one language rather than the same block with the text
 * swapped.
 *
 * PHOTOGRAPHY
 * The supplied photograph is a dark commercial kitchen lit warm, cropped five
 * ways in scripts/prepare-assets.mjs — the range and hood line, the stainless
 * reach-ins, the prep counters and window wall. The source frame is much
 * brighter on the chrome and the window wall than in the centre floor, so the
 * crops are darkened at source AND every hero carries a scrim beneath the text
 * block. Text is never placed directly on the raw image.
 */

type Page = "home" | "about" | "appliances" | "process" | "contact";

/**
 * Inline blur placeholders, read at build time. Keeps the hero from flashing
 * flat charcoal before a ~145KB photo decodes, without shipping a separate
 * request for a 20px image.
 */
function blurFor(page: Page) {
  try {
    return readFileSync(join(process.cwd(), "public", "hero", `${page}.blur.txt`), "utf8");
  } catch {
    return undefined;
  }
}

export function Hero({
  page,
  eyebrow,
  wordmark,
  headline,
  lead,
  primary,
  secondary,
  align = "center",
}: {
  page: Page;
  /** Small amber label above the headline. Omitted on the homepage. */
  eyebrow?: string;
  /**
   * Homepage only: renders "URBAN REACH" as the dominant white wordmark with
   * the tagline directly beneath it in amber. Both live inside the single H1 so
   * the page keeps one heading that still carries its keywords.
   */
  wordmark?: { name: string; tagline: string };
  headline?: ReactNode;
  lead?: ReactNode;
  primary?: { href: string; label: string; plain?: boolean };
  /** Rendered as a plain-text arrow link, never a second filled button. */
  secondary?: { href: string; label: string; plain?: boolean };
  align?: "center" | "left";
}) {
  const isHome = page === "home";

  return (
    <section
      className={`relative isolate flex overflow-hidden ${
        isHome ? "min-h-[94svh] items-center" : "min-h-[72svh] items-end"
      }`}
    >
      <HeroMedia page={page} align={align} />

      <Container
        className={`relative z-10 w-full ${
          isHome ? "py-28 sm:py-32" : "pb-20 pt-36 sm:pb-24 sm:pt-40"
        }`}
      >
        <div
          className={
            align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl mr-auto"
          }
        >
          {eyebrow && (
            <Reveal>
              <p
                className={`label-caps-lg text-amber ${
                  align === "center" ? "" : "flex items-center gap-4"
                }`}
              >
                {align !== "center" && (
                  <span aria-hidden="true" className="h-px w-10 bg-amber" />
                )}
                {eyebrow}
              </p>
            </Reveal>
          )}

          {/* Homepage: wordmark + tagline, as one H1. */}
          {wordmark && (
            <Reveal>
              <h1 className="flex flex-col items-center">
                <span className="font-display text-[clamp(2.75rem,11vw,8.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-bone">
                  {wordmark.name}
                </span>
                <span className="mt-5 max-w-2xl font-display text-[clamp(1.05rem,2.6vw,1.85rem)] leading-snug text-amber">
                  {wordmark.tagline}
                </span>
              </h1>
            </Reveal>
          )}

          {/* Interior pages: a conventional headline. */}
          {headline && (
            <Reveal delay={90}>
              <h1 className="mt-6 font-display text-[clamp(2.1rem,5.6vw,4.25rem)] leading-[1.04] tracking-[-0.025em]">
                {headline}
              </h1>
            </Reveal>
          )}

          {lead && (
            <Reveal delay={170}>
              <p
                className={`mt-7 text-lg leading-relaxed text-bone-dim sm:text-xl ${
                  align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"
                }`}
              >
                {lead}
              </p>
            </Reveal>
          )}

          {(primary || secondary) && (
            <Reveal delay={240}>
              <div
                className={`mt-11 flex flex-col items-start gap-x-9 gap-y-5 sm:flex-row sm:items-center ${
                  align === "center" ? "sm:justify-center" : ""
                }`}
              >
                {primary && <PrimaryCta {...primary} />}
                {secondary && <SecondaryCta {...secondary} />}
              </div>
            </Reveal>
          )}
        </div>
      </Container>

      <ScrollCue />
    </section>
  );
}

function PrimaryCta({ href, label, plain }: { href: string; label: string; plain?: boolean }) {
  const cls =
    "label-caps-lg inline-flex items-center gap-3 rounded-full bg-amber px-8 py-4 text-charcoal transition-colors duration-300 hover:bg-bone";
  const inner = (
    <>
      {label}
      <span aria-hidden="true" className="text-base leading-none">
        →
      </span>
    </>
  );
  return plain ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function SecondaryCta({ href, label, plain }: { href: string; label: string; plain?: boolean }) {
  // Plain-text arrow link, deliberately not a second filled button — the hero
  // carries one clear primary action.
  const cls =
    "label-caps-lg link-underline inline-flex items-center gap-2 text-bone transition-colors duration-300 hover:text-amber";
  const inner = (
    <>
      {label}
      <span aria-hidden="true" className="text-sm leading-none">
        ↗
      </span>
    </>
  );
  return plain ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Media layer                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The photograph plus the scrim stack that keeps text legible over it.
 *
 * The scrim is not one flat wash. The source frame's brightness is uneven —
 * hot on the chrome hood and the window wall, dark through the centre floor —
 * so a single overlay either crushes the photo or leaves the copy sitting on a
 * bright highlight. Instead:
 *
 *   1. a global tint, to seat the whole image in the brand's charcoal
 *   2. a directional gradient weighted toward wherever the copy sits
 *   3. a focused ellipse directly behind the text block
 *   4. a vignette, pulling the frame edges down
 *   5. film grain, so the gradients do not band on wide displays
 *
 * Measured result: the darkest text on the page still clears WCAG AA against
 * the brightest pixel that ends up behind it.
 */
function HeroMedia({ page, align }: { page: Page; align: "center" | "left" }) {
  const blur = blurFor(page);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image
        src={`/hero/${page}.webp`}
        alt=""
        fill
        priority={page === "home"}
        sizes="100vw"
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        className="object-cover object-center"
      />

      {/* 1. Global tint — seats the photo in the brand charcoal. */}
      <div className="absolute inset-0 bg-charcoal/55" />

      {/* 2. Directional gradient, weighted to where the copy sits. */}
      <div
        className={
          align === "center"
            ? "absolute inset-0 bg-[linear-gradient(to_top,rgba(14,14,14,0.94)_0%,rgba(14,14,14,0.55)_38%,rgba(14,14,14,0.34)_62%,rgba(14,14,14,0.72)_100%)]"
            : "absolute inset-0 bg-[linear-gradient(to_right,rgba(14,14,14,0.94)_0%,rgba(14,14,14,0.7)_42%,rgba(14,14,14,0.32)_78%,rgba(14,14,14,0.5)_100%)]"
        }
      />

      {/* 3. Focused scrim directly behind the text block. This is the layer that
             guarantees legibility regardless of what the photo is doing there. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            align === "center"
              ? "radial-gradient(58% 46% at 50% 52%, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.4) 58%, transparent 82%)"
              : "radial-gradient(62% 55% at 26% 68%, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.42) 56%, transparent 84%)",
        }}
      />

      {/* 4. Vignette. */}
      <div className="absolute inset-0 bg-[radial-gradient(122%_92%_at_50%_46%,transparent_34%,rgba(6,6,6,0.7)_100%)]" />

      {/* 5. Film grain, so the gradient stack does not band on wide screens. */}
      <div
        className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />

      {/* Hard edge into the next section. */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_bottom,transparent,var(--color-charcoal))]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scroll cue                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Small circular scroll indicator. A real link to the first section, so it is
 * keyboard reachable and does something useful rather than being decorative.
 */
function ScrollCue() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center sm:bottom-10">
      <a href="#after-hero" className="pointer-events-auto group flex flex-col items-center gap-3">
        <span className="label-caps text-bone-dim transition-colors duration-300 group-hover:text-amber">
          Scroll
        </span>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 bg-charcoal/35 backdrop-blur-sm transition-colors duration-300 group-hover:border-amber">
          <span aria-hidden="true" className="scroll-cue-arrow text-base leading-none text-amber">
            ↓
          </span>
        </span>
        <span className="sr-only">Skip to page content</span>
      </a>
    </div>
  );
}
