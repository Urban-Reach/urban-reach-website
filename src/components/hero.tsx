import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Reveal, ScrollCue } from "@/components/motion";
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
 * Each page has its OWN photograph, prepared by scripts/prepare-assets.mjs: the
 * commercial kitchen on the homepage, an unfinished building on About, a
 * warehouse aisle of stainless fronts on Appliances, a night loading dock on
 * Process, a finished apartment kitchen at blue hour on Contact. All five were
 * previously crops of one panorama, which read as the same room repositioned.
 *
 * Every frame is darkened slightly at source AND carries a scrim beneath the
 * text block. Text is never placed directly on the raw image.
 */

type Page = "home" | "about" | "appliances" | "process" | "contact";

/**
 * Hero photography, resolved at build time from public/hero/manifest.json.
 *
 * Filenames carry a content hash (`about.d8d658db.webp`), so replacing a
 * photograph changes the URL. Without that, swapping the images left every
 * browser and CDN that had already cached `/_next/image?url=/hero/about.webp`
 * serving the previous picture indefinitely — which is exactly what happened.
 * Never hard-code `/hero/<page>.webp` here again.
 */
function heroFile(page: Page) {
  const manifest = JSON.parse(
    readFileSync(join(process.cwd(), "public", "hero", "manifest.json"), "utf8"),
  ) as Record<Page, string>;
  return `/hero/${manifest[page]}`;
}

/**
 * Inline blur placeholder, read at build time. Keeps the hero from flashing flat
 * charcoal before a ~145KB photo decodes, without shipping a separate request
 * for a 20px image.
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

  // HEIGHT — this regressed repeatedly, so the reasoning is recorded here.
  //
  // The site header is `sticky top-0` with h-20, and a sticky element occupies
  // normal flow space. The hero therefore STARTS 5rem down the page. Sizing it
  // at 94svh/72svh meant header + hero exceeded the viewport, and because the
  // content is centred inside that overflowing box, the lower half of the copy
  // (description and both buttons) fell below the fold.
  //
  // Fixed by subtracting the header from the height rather than by nudging
  // per-page padding. Padding is now modest — the previous 304px of combined
  // pt/pb was itself pushing content out of view. Bottom padding only needs to
  // clear the absolutely-positioned scroll cue (~110px from the section
  // bottom), which pb-32 covers.
  //
  // Do not reintroduce svh values that ignore --header-h.
  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden"
    >
      <HeroMedia page={page} align={align} />

      <Container className="relative z-10 w-full pb-28 pt-8 sm:pb-32 sm:pt-10">
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
                <span className="font-display text-[clamp(2.5rem,min(10vw,14vh),7.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-bone">
                  {wordmark.name}
                </span>
                <span className="mt-5 max-w-2xl font-display text-[clamp(1rem,min(2.4vw,3.4vh),1.7rem)] leading-snug text-amber">
                  {wordmark.tagline}
                </span>
              </h1>
            </Reveal>
          )}

          {/* Interior pages: a conventional headline. */}
          {headline && (
            <Reveal delay={90}>
              <h1 className="mt-6 font-display text-[clamp(1.9rem,min(5.2vw,7.5vh),3.9rem)] leading-[1.04] tracking-[-0.025em]">
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

      {/*
        LIGHT BRIDGE — the visual link between photograph and type.

        Sits ABOVE the copy and uses `plus-lighter`, which can only ADD light.
        That matters: it means the effect physically cannot reduce text contrast,
        so the wordmark keeps its measured legibility while the kitchen's warm
        lighting appears to spill across the top edge of the letterforms instead
        of the type floating flatly on the image.

        Two parts: a broad warm bloom grazing the wordmark, and a narrow
        horizontal sheen that reads as a steel reflection catching the type.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 mix-blend-plus-lighter"
      >
        <div
          className="absolute inset-0"
          style={{
            background: isHome
              ? "radial-gradient(38% 26% at 34% 34%, rgba(201,146,47,0.30) 0%, rgba(201,146,47,0.10) 45%, transparent 74%)"
              : "radial-gradient(34% 30% at 16% 46%, rgba(201,146,47,0.24) 0%, rgba(201,146,47,0.08) 48%, transparent 76%)",
          }}
        />
        <div
          className="absolute inset-x-0"
          style={{
            top: isHome ? "31%" : "44%",
            height: isHome ? "9%" : "7%",
            background:
              "linear-gradient(to right, transparent 4%, rgba(238,214,166,0.14) 26%, rgba(255,247,232,0.20) 44%, rgba(238,214,166,0.10) 64%, transparent 92%)",
            filter: "blur(6px)",
          }}
        />
      </div>

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
        src={heroFile(page)}
        alt=""
        fill
        // Every page has exactly one Hero, and it is always that page's
        // largest above-the-fold element — so it is always that page's LCP
        // candidate, not just on Home. This was previously priority={page ===
        // "home"}, which meant About, Appliances, Process, and Contact all
        // loaded their hero photograph at normal fetch priority with no
        // preload, competing with fonts and JS instead of being prioritized.
        // Since only one Hero is ever mounted at a time, there is no
        // downside to always preloading it.
        priority
        sizes="100vw"
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        className="object-cover object-center"
      />

      {/*
        The scrim is split deliberately: the layers that cover the WHOLE frame
        are kept light so the photograph reads strongly, and the legibility work
        is concentrated in layer 3, which only covers the text block. Lifting the
        global tint alone would have washed the copy out; lifting it while
        tightening layer 3 makes the image more present AND the text no less
        readable. Contrast is measured after any change to these numbers.
      */}

      {/* 1. Global tint — seats the photo in the brand charcoal. Reduced from
             0.55 so the kitchen is a present part of the hero, not a backdrop. */}
      <div className="absolute inset-0 bg-charcoal/28" />

      {/* 2. Directional gradient. Eased off through the middle of the frame,
             where there is no copy, so the equipment stays visible. */}
      <div
        className={
          align === "center"
            ? "absolute inset-0 bg-[linear-gradient(to_top,rgba(14,14,14,0.9)_0%,rgba(14,14,14,0.4)_34%,rgba(14,14,14,0.14)_60%,rgba(14,14,14,0.6)_100%)]"
            : "absolute inset-0 bg-[linear-gradient(to_right,rgba(14,14,14,0.9)_0%,rgba(14,14,14,0.58)_40%,rgba(14,14,14,0.12)_76%,rgba(14,14,14,0.34)_100%)]"
        }
      />

      {/* 3. Focused scrim directly behind the text block — tightened and
             strengthened to carry the legibility now that layers 1, 2 and 4 are
             lighter. This is the layer that guarantees contrast regardless of
             what the photograph is doing underneath. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            align === "center"
              ? "radial-gradient(52% 40% at 50% 44%, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.62) 52%, rgba(8,8,8,0.22) 78%, transparent 94%)"
              : "radial-gradient(56% 48% at 24% 60%, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.62) 50%, rgba(8,8,8,0.2) 76%, transparent 92%)",
        }}
      />

      {/* 4. Vignette, eased so it frames rather than smothers. */}
      <div className="absolute inset-0 bg-[radial-gradient(126%_96%_at_50%_46%,transparent_42%,rgba(6,6,6,0.62)_100%)]" />

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
