"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage signature animation — "the seam".
 *
 * WHAT IT DOES
 * A single horizontal hairline with a visible gap in the middle. The left
 * segment is labelled SUPPLY, the right INSTALL. On entering view the two
 * segments close the gap, the two labels dissolve, the line brightens to full
 * amber, and one label resolves in their place: URBAN REACH.
 *
 * WHY THIS
 * The claim being made is the strongest one the business has, and the one every
 * competitor fails: appliance work is normally split between a vendor who sells
 * and a contractor who installs, and the gap between them is where schedules
 * slip. Urban Reach is both. So the animation does not illustrate the claim, it
 * *is* the claim — the thing that closes on screen is the thing that goes wrong
 * everywhere else.
 *
 * There is deliberately NO mark at the meeting point. An early version put a
 * small amber dot at the join, which is precisely wrong: a visible seam
 * contradicts the sentence. The payoff is the line becoming continuous and
 * brightening, not a weld.
 *
 * WHAT IT DOES NOT CONTAIN
 * No data of any kind, and nothing about how the work is actually done. Three
 * words, all of which already appear on the site. This replaced an equipment
 * schedule treatment that was removed for showing example model numbers and for
 * illustrating internal specification matching; neither failure mode is
 * reachable from here, and it should stay that way.
 *
 * IMPLEMENTATION
 * Fires once on entering view rather than being scroll-linked. Scroll-linked was
 * considered and rejected: a fast scroll snaps it to the end and the gap is never
 * seen closing, which loses the entire point. A fixed 2.4s sequence always plays
 * in full.
 */

/* Geometry. One baseline, two segments growing toward the centre from the outer
   ends. Segment lengths are equal so the gap closes symmetrically. */
const W = 720;
const H = 190;
const BASELINE = 118;
const OUTER_LEFT = 60;
const OUTER_RIGHT = W - 60;
const CENTRE = W / 2;

/**
 * How much of each segment is undrawn at rest, as a fraction. 0.2 leaves a
 * ~120px gap at this width: wide enough to read unmistakably as a gap, narrow
 * enough that the closure is a movement rather than a journey. Below about 0.12
 * the gap reads as a rendering artefact; above about 0.3 the two segments stop
 * looking like one interrupted line.
 */
const GAP = 0.2;

const SEQUENCE_SECONDS = 2.4;

export function Seam() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Observer plus an immediate position check, for the same reason as every
    // other effect on this site: a threshold observer can be skipped entirely if
    // the section crosses the viewport between two intersection computations —
    // flick scrolling, an anchor jump, restored scroll position on back
    // navigation — which would leave the gap permanently open.
    const fire = () => setStarted(true);
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      fire();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          fire();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-seam=""
      data-running={started ? "true" : "false"}
      style={{ "--seq": `${SEQUENCE_SECONDS}s`, "--gap": GAP } as object}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Supply and install, shown as two halves of one line closing into a single unbroken line: Urban Reach."
      >
        {/* Both segments run OUTER -> CENTRE, so each draws inward from its own
            outer end and they meet in the middle. pathLength normalises the dash
            maths to 0-1 so GAP is a plain fraction. */}
        <line
          data-seam-line=""
          x1={OUTER_LEFT}
          y1={BASELINE}
          x2={CENTRE}
          y2={BASELINE}
          pathLength={1}
          stroke="var(--color-amber)"
          strokeWidth={1.5}
        />
        <line
          data-seam-line=""
          x1={OUTER_RIGHT}
          y1={BASELINE}
          x2={CENTRE}
          y2={BASELINE}
          pathLength={1}
          stroke="var(--color-amber)"
          strokeWidth={1.5}
        />

        {/* The two starting labels, each centred over its own segment. These are
            visible at rest and dissolve as the gap closes. */}
        <text
          data-seam-from=""
          x={(OUTER_LEFT + CENTRE) / 2}
          y={BASELINE - 30}
          textAnchor="middle"
          className="label-caps fill-bone-dim"
        >
          Supply
        </text>
        <text
          data-seam-from=""
          x={(OUTER_RIGHT + CENTRE) / 2}
          y={BASELINE - 30}
          textAnchor="middle"
          className="label-caps fill-bone-dim"
        >
          Install
        </text>

        {/* The resolved label, in their place. */}
        <text
          data-seam-to=""
          x={CENTRE}
          y={BASELINE - 34}
          textAnchor="middle"
          className="fill-bone font-display text-[26px] uppercase tracking-[0.16em]"
        >
          Urban Reach
        </text>
      </svg>
    </div>
  );
}
