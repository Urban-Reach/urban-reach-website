import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui";

/**
 * Site-wide hero.
 *
 * One component drives the hero on every page so the typography scale, media
 * treatment, CTA pattern and scroll indicator cannot drift apart — but each
 * page passes a different `composition`, so Home / About / Appliances / Process
 * / Contact are visibly different arrangements of the same language rather than
 * the same block with the text swapped.
 *
 * PLACEHOLDER — HERO PHOTOGRAPHY (build prompt §11)
 * The brief asks for full-bleed moody, cinematic kitchen/appliance photography
 * here. No such photography exists yet, and the only imagery supplied so far
 * was either Pinterest-sourced (licence unclear, ruled out by §11) or a screen
 * recording of another studio's website. Rather than ship generic bright stock,
 * the media layer below is a built composition — layered radial key light,
 * blueprint field, depth haze, vignette and film grain — designed to read as a
 * dark cinematic photograph and sized so a real image drops in behind it
 * unchanged. To swap in a photo: render an <Image fill> as the first child of
 * the media layer and drop `blueprint-grid`. Everything above it (scrim,
 * vignette, grain) is tuned to sit over a photograph.
 */

type Composition =
  /** Home: headline centred and stamped large over the media. */
  | "stamp"
  /** About: headline offset low-left, media weighted right. */
  | "offset"
  /** Appliances: editorial two-column, eyebrow rail on the left. */
  | "editorial"
  /** Process: headline low, wide measure, strong vertical drop. */
  | "anchored"
  /** Contact: compact, details-forward. */
  | "compact";

export function Hero({
  eyebrow,
  headline,
  lead,
  primary,
  secondary,
  composition = "stamp",
  showScrollCue = true,
}: {
  eyebrow: string;
  headline: ReactNode;
  lead?: ReactNode;
  /** `plain` renders an <a>, for tel: and mailto: targets. */
  primary?: { href: string; label: string; plain?: boolean };
  /** Rendered as a plain-text arrow link, never a second filled button. */
  secondary?: { href: string; label: string; plain?: boolean };
  composition?: Composition;
  showScrollCue?: boolean;
}) {
  const frame = {
    stamp: "min-h-[92svh] items-center",
    offset: "min-h-[76svh] items-end",
    editorial: "min-h-[70svh] items-end",
    anchored: "min-h-[78svh] items-end",
    compact: "min-h-[58svh] items-end",
  }[composition];

  const inner = {
    stamp: "max-w-5xl text-center mx-auto",
    offset: "max-w-3xl mr-auto",
    editorial: "max-w-4xl mr-auto",
    anchored: "max-w-4xl mr-auto",
    compact: "max-w-3xl mr-auto",
  }[composition];

  // One shared type scale, stepped by role rather than re-invented per page.
  // `stamp` is sized to hold a full keyword-bearing H1 across three lines, not
  // a short slogan — the headline still has to carry the page's target phrase.
  const size = {
    stamp: "text-[clamp(2.25rem,6.4vw,5rem)] leading-[1.0] tracking-[-0.028em]",
    offset: "text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.025em]",
    editorial: "text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.04] tracking-[-0.025em]",
    anchored: "text-[clamp(2.25rem,6.5vw,4.75rem)] leading-[1.0] tracking-[-0.025em]",
    compact: "text-[clamp(2rem,5vw,3.5rem)] leading-[1.06] tracking-[-0.02em]",
  }[composition];

  const pad = {
    stamp: "py-28 sm:py-32",
    offset: "pb-20 pt-36 sm:pb-24 sm:pt-40",
    editorial: "pb-16 pt-32 sm:pb-20 sm:pt-36",
    anchored: "pb-20 pt-36 sm:pb-24 sm:pt-40",
    compact: "pb-14 pt-32 sm:pb-16 sm:pt-36",
  }[composition];

  return (
    <section className={`relative isolate flex overflow-hidden ${frame}`}>
      <HeroMedia composition={composition} />

      <Container className={`relative z-10 w-full ${pad}`}>
        <div className={inner}>
          <Reveal>
            <p
              className={`label-caps-lg text-amber ${
                composition === "stamp" ? "" : "flex items-center gap-4"
              }`}
            >
              {composition !== "stamp" && (
                <span aria-hidden="true" className="h-px w-10 bg-amber" />
              )}
              {eyebrow}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className={`mt-6 font-display ${size}`}>{headline}</h1>
          </Reveal>

          {lead && (
            <Reveal delay={170}>
              <p
                className={`mt-7 text-lg leading-relaxed text-bone-dim sm:text-xl ${
                  composition === "stamp" ? "mx-auto max-w-2xl" : "max-w-xl"
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
                  composition === "stamp" ? "sm:justify-center" : ""
                }`}
              >
                {primary &&
                  (() => {
                    const cls =
                      "label-caps-lg inline-flex items-center gap-3 rounded-full bg-amber px-8 py-4 text-charcoal transition-colors duration-300 hover:bg-bone";
                    const inner = (
                      <>
                        {primary.label}
                        <span aria-hidden="true" className="text-base leading-none">
                          →
                        </span>
                      </>
                    );
                    return primary.plain ? (
                      <a href={primary.href} className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={primary.href} className={cls}>
                        {inner}
                      </Link>
                    );
                  })()}

                {secondary &&
                  (() => {
                    /* Plain-text arrow link, deliberately not a second filled
                       button — the hero carries one clear primary action. */
                    const cls =
                      "label-caps-lg link-underline inline-flex items-center gap-2 text-bone transition-colors duration-300 hover:text-amber";
                    const inner = (
                      <>
                        {secondary.label}
                        <span aria-hidden="true" className="text-sm leading-none">
                          ↗
                        </span>
                      </>
                    );
                    return secondary.plain ? (
                      <a href={secondary.href} className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={secondary.href} className={cls}>
                        {inner}
                      </Link>
                    );
                  })()}
              </div>
            </Reveal>
          )}
        </div>
      </Container>

      {showScrollCue && <ScrollCue />}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Media layer                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The cinematic ground. Composed rather than photographed — see the
 * PLACEHOLDER note at the top of this file.
 *
 * Built from stacked layers so it reads with depth instead of as a flat wash:
 * a warm amber key light off-centre, a cooler counter-light, the blueprint
 * field, a soft depth haze, a vignette to pull the edges down, and fine grain
 * so large gradients don't band on wide displays. The key light sits upper-left
 * on every page, matching the light direction baked into the appliance renders.
 *
 * `composition` only moves the key light, so each page's hero catches the light
 * differently without introducing a new colour anywhere.
 */
function HeroMedia({ composition }: { composition: Composition }) {
  const key = {
    stamp: "28% 34%",
    offset: "72% 30%",
    editorial: "18% 26%",
    anchored: "50% 22%",
    compact: "80% 38%",
  }[composition];

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {/* Base ground */}
      <div className="absolute inset-0 bg-charcoal" />

      {/* Walnut floor tone rising from the bottom, for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-walnut)_0%,transparent_62%)]" />

      {/* Blueprint field, receding in perspective so it reads as a surface
          rather than wallpaper. Replace with <Image fill> when photography
          exists — everything below this line is tuned to sit over a photo. */}
      <div
        className="blueprint-grid absolute inset-x-[-25%] bottom-[-10%] top-[38%] opacity-[0.5]"
        style={{
          transform: "perspective(680px) rotateX(64deg)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black 0%, transparent 78%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 78%)",
        }}
      />

      {/* Warm key light — the dominant source, matching the upper-left light
          direction baked into the appliance renders. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(46% 52% at ${key}, rgba(201,146,47,0.42) 0%, rgba(201,146,47,0.15) 38%, rgba(201,146,47,0.03) 62%, transparent 78%)`,
        }}
      />

      {/* A tighter hot core inside the key light, so it has a source rather than
          being an even wash. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(16% 20% at ${key}, rgba(224,176,90,0.34) 0%, transparent 70%)`,
        }}
      />

      {/* Cool counter-light, opposite side — keeps the amber from reading flat */}
      <div className="absolute inset-0 bg-[radial-gradient(64%_58%_at_86%_82%,rgba(126,148,176,0.16),transparent_70%)]" />

      {/* Depth haze across the middle distance */}
      <div className="absolute inset-x-0 top-1/4 h-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(24,22,19,0.5),transparent)]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(118%_88%_at_50%_44%,transparent_30%,rgba(6,6,6,0.78)_100%)]" />

      {/* Scrim under the copy. Kept lighter through the middle band than the old
          version so the key light survives instead of being flattened out. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,14,14,0.82)_0%,rgba(14,14,14,0.18)_42%,rgba(14,14,14,0.46)_100%)]" />

      {/* Film grain — stops the large gradients banding on wide screens */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />

      {/* Hard edge into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,var(--color-charcoal))]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scroll cue                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Small circular scroll indicator, per the reference layout. It is a real link
 * to #main-content so it is keyboard reachable and does something useful, rather
 * than a decorative flourish.
 */
function ScrollCue() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center sm:bottom-10">
      <a
        href="#after-hero"
        className="pointer-events-auto group flex flex-col items-center gap-3"
      >
        <span className="label-caps text-bone-dim transition-colors duration-300 group-hover:text-amber">
          Scroll
        </span>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-rule transition-colors duration-300 group-hover:border-amber">
          <span
            aria-hidden="true"
            className="scroll-cue-arrow text-base leading-none text-amber"
          >
            ↓
          </span>
        </span>
        <span className="sr-only">Skip to page content</span>
      </a>
    </div>
  );
}
