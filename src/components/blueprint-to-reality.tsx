"use client";

import { useId } from "react";
import { useScrollProgress } from "@/components/motion";
import {
  BeverageLine,
  BeverageReal,
  DishwasherLine,
  DishwasherReal,
  RefrigerationLine,
  RefrigerationReal,
} from "@/components/appliance-art";

/**
 * "Blueprint to reality" — the signature interaction.
 *
 * A single appliance begins as amber technical linework and resolves into the
 * finished unit as the user scrolls. Spec drawing to installed equipment,
 * object by object, which is literally what the business does.
 *
 * Implementation notes:
 *  - Scroll-LINKED, never autoplay. Progress comes from the element's position
 *    in the viewport, so the user drives it and can hold it mid-resolve.
 *  - The crossfade is a clip-path wipe on the resolved layer plus an opacity
 *    fade on the linework — cheap, compositor-friendly, no layout thrash.
 *  - prefers-reduced-motion resolves to the finished state immediately, with
 *    no observers attached and no scroll listener registered.
 *
 * SCOPE (build prompt §5): one appliance, isolated. Never a room or interior.
 */

const APPLIANCES = {
  refrigeration: {
    Line: RefrigerationLine,
    Real: RefrigerationReal,
    label: "Refrigeration unit",
    alt: "Commercial-grade refrigeration unit for multifamily and office construction projects",
  },
  dishwasher: {
    Line: DishwasherLine,
    Real: DishwasherReal,
    label: "Dishwasher",
    alt: "Under-counter commercial dishwasher for tenant improvement and office buildout projects",
  },
  beverage: {
    Line: BeverageLine,
    Real: BeverageReal,
    label: "Beverage cooler",
    alt: "Glass-door beverage cooler for office amenity and common-area installations",
  },
} as const;

export type ApplianceKind = keyof typeof APPLIANCES;

export function BlueprintToReality({
  kind,
  eyebrow,
  title,
  body,
  reverse = false,
}: {
  kind: ApplianceKind;
  eyebrow: string;
  title: string;
  body: string;
  /** Alternate the media/copy order down the page. */
  reverse?: boolean;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const uid = useId().replace(/:/g, "");
  const { Line, Real, label, alt } = APPLIANCES[kind];

  // Linework holds until the wipe is underway, then clears before it completes,
  // so the two layers are never both faint at the same time.
  //
  // Under prefers-reduced-motion these values stay at their progress-0 state,
  // and the reduced-motion block in globals.css overrides them with the
  // resolved end state instead. That keeps the fallback in one place.
  const lineOpacity = 1 - Math.min(1, Math.max(0, (progress - 0.15) / 0.55));
  const wipe = progress * 100;

  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Media */}
      <div ref={ref} className="relative mx-auto w-full max-w-[340px]">
        {/* Plain dark ground with a faint blueprint field — deliberately not a
            rendered room. */}
        <div className="blueprint-grid-fine absolute inset-0 rounded-lg opacity-60" />
        <div className="absolute inset-0 rounded-lg bg-radial from-amber/[0.07] to-transparent" />

        <div className="relative aspect-[400/540] w-full" role="img" aria-label={alt}>
          {/* Resolved layer, revealed by a vertical wipe */}
          <div
            data-b2r-real=""
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 0 ${100 - wipe}% 0)`,
              transition: "clip-path 120ms linear",
            }}
          >
            <Real uid={`${uid}-real`} className="h-full w-full" />
          </div>

          {/* Linework layer, fading out as the wipe passes */}
          <div
            data-b2r-line=""
            className="absolute inset-0"
            style={{ opacity: lineOpacity, transition: "opacity 120ms linear" }}
          >
            <Line uid={`${uid}-line`} className="h-full w-full" />
          </div>

          {/* The resolving edge itself — a thin amber scan line. Absent at
              progress 0, so reduced-motion users never see it. */}
          {progress > 0.02 && progress < 0.99 && (
            <div
              className="pointer-events-none absolute inset-x-0 h-px bg-amber"
              style={{
                top: `${wipe}%`,
                boxShadow: "0 0 14px 1px var(--color-amber)",
              }}
            />
          )}
        </div>

        <p className="label-caps mt-5 text-center text-bone-dim">{label}</p>
      </div>

      {/* Copy */}
      <div>
        <p className="label-caps text-amber">{eyebrow}</p>
        <h3 className="mt-4 text-2xl leading-tight sm:text-3xl">{title}</h3>
        <p className="mt-4 max-w-prose leading-relaxed text-bone-dim">{body}</p>
      </div>
    </div>
  );
}
