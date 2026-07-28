"use client";

import { useId } from "react";
import { useB2RFallback } from "@/components/motion";
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
 * The animation itself lives entirely in CSS (see the blueprint-to-reality
 * block in globals.css) driven by a `view()` scroll timeline, so it runs off
 * the main thread with no JS and no React re-render. This component only lays
 * the layers out; `useB2RFallback` is a no-op except on browsers that lack
 * scroll-driven animations.
 *
 * SCOPE (build prompt §5): one appliance, isolated on a plain ground. Never a
 * room, a kitchen layout, or an interior. Urban Reach sources and installs
 * appliances; it does not design or build spaces, and the artwork must not
 * imply otherwise.
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
  /** Lets a page shift the balance of the two columns for its own composition. */
  layout = "even",
}: {
  kind: ApplianceKind;
  eyebrow: string;
  title: string;
  body: string;
  reverse?: boolean;
  layout?: "even" | "media-wide" | "copy-wide";
}) {
  const scopeRef = useB2RFallback<HTMLDivElement>();
  const uid = useId().replace(/:/g, "");
  const { Line, Real, label, alt } = APPLIANCES[kind];

  const columns = {
    even: "lg:grid-cols-2",
    "media-wide": "lg:grid-cols-[1.15fr_1fr]",
    "copy-wide": "lg:grid-cols-[1fr_1.25fr]",
  }[layout];

  return (
    <div
      className={`grid items-center gap-10 ${columns} lg:gap-20 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Media. data-b2r-scope defines the view() timeline the layers below
          attach to, so the animation is scoped per instance. */}
      <div
        ref={scopeRef}
        data-b2r-scope=""
        className="relative mx-auto w-full max-w-[340px]"
      >
        {/* Plain dark ground with a faint blueprint field — deliberately not a
            rendered room. */}
        <div className="blueprint-grid-fine absolute inset-0 rounded-lg opacity-60" />
        <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_38%,rgba(201,146,47,0.09),transparent_68%)]" />

        <div className="relative aspect-[400/540] w-full" role="img" aria-label={alt}>
          {/* Resolved layer, revealed by a vertical wipe. */}
          <div data-b2r-real="" className="absolute inset-0">
            <Real uid={`${uid}-real`} className="h-full w-full" />
          </div>

          {/* Linework layer, clearing just ahead of the wipe. */}
          <div data-b2r-line="" className="absolute inset-0">
            <Line uid={`${uid}-line`} className="h-full w-full" />
          </div>

          {/* The resolving edge. Shares the wipe's clip animation, so its
              bottom border lands exactly on the clip line without any
              separate position calculation. */}
          <div
            data-b2r-edge=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border-b border-amber"
            style={{ boxShadow: "0 1px 16px -1px var(--color-amber)" }}
          />
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
