"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

/**
 * "Where we work" — the service area, drawn.
 *
 * A single hairline traverses the metro. As it reaches each city a node lights
 * and the name sets beside it, with Austin arriving last and marked larger.
 *
 * WHY A SCHEMATIC AND NOT A MAP
 * There is no state outline, no road network and no map embed. The cities are
 * placed at their true relative positions, but the drawing is a survey traverse
 * rather than cartography. Three reasons, in order of importance:
 *
 *  - A drawn boundary is a claim. A shaded coverage area invites the question
 *    "so you won't come to X?", and the page copy deliberately says the
 *    opposite — contact us anyway. A line between points implies proximity
 *    without asserting an edge.
 *  - Accuracy becomes a liability. Any recognisable map has to be right, and a
 *    hand-placed one never quite is.
 *  - Every contractor site has a map. None has this.
 *
 * CONTENT
 * The only content is the six confirmed cities in site.serviceArea. Nothing
 * here is invented, and nothing is added that is not already published in the
 * footer and the FAQ. If a city is added or removed there, TypeScript will fail
 * this file until CITY_GEO is updated — see the type on that constant, which is
 * the whole reason it is keyed to the union rather than to `string`.
 */

/**
 * True coordinates, so the arrangement is geographically honest even though the
 * drawing is not a map. Keyed to the service-area union: adding a city to
 * site.serviceArea without adding it here is a compile error, which is the
 * point — a silently omitted city would be worse than a broken build.
 */
const CITY_GEO: Record<
  (typeof site.serviceArea)[number],
  { lat: number; lon: number }
> = {
  Austin: { lat: 30.2672, lon: -97.7431 },
  "Round Rock": { lat: 30.5083, lon: -97.6789 },
  Georgetown: { lat: 30.6333, lon: -97.6772 },
  Pflugerville: { lat: 30.4394, lon: -97.62 },
  "Cedar Park": { lat: 30.5052, lon: -97.8203 },
  "Bee Cave": { lat: 30.3077, lon: -97.9464 },
};

/**
 * Draw order. Not the same as the data order: this is the route the line takes,
 * chosen so no segment crosses another — a self-intersecting traverse reads as a
 * scribble. Austin is last because it is the anchor the other five orbit, so it
 * is the note the sequence should end on.
 */
const ROUTE: (typeof site.serviceArea)[number][] = [
  "Pflugerville",
  "Georgetown",
  "Round Rock",
  "Cedar Park",
  "Bee Cave",
  "Austin",
];

/* Viewport. PAD.right is the widest by a distance because every label sets to
   the right of its node and the rightmost city needs room for a long name — it
   is label clearance, not composition. The values are measured: at this frame
   the longest label ("Pflugerville", on the rightmost node) ends at x≈590 of
   640. Widening the drawing further pushes it off the edge. */
const W = 640;
const H = 340;
const PAD = { top: 30, right: 170, bottom: 34, left: 40 };

/** Total path length the line travels, used to time the node arrivals. */
const DRAW_SECONDS = 2.2;

type Placed = {
  city: (typeof site.serviceArea)[number];
  x: number;
  y: number;
  /** Seconds into the draw at which the line reaches this node. */
  at: number;
};

function project(): Placed[] {
  const pts = ROUTE.map((city) => CITY_GEO[city]);
  const lons = pts.map((p) => p.lon);
  const lats = pts.map((p) => p.lat);
  const lonMin = Math.min(...lons);
  const lonMax = Math.max(...lons);
  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);

  const usableW = W - PAD.left - PAD.right;
  const usableH = H - PAD.top - PAD.bottom;

  const xy = pts.map((p) => ({
    // North is up, so latitude inverts.
    x: PAD.left + ((p.lon - lonMin) / (lonMax - lonMin)) * usableW,
    y: PAD.top + ((latMax - p.lat) / (latMax - latMin)) * usableH,
  }));

  // Cumulative distance along the route, normalised, so each node lights at the
  // moment the line actually arrives rather than on a flat stagger.
  const seg = xy.map((p, i) =>
    i === 0 ? 0 : Math.hypot(p.x - xy[i - 1].x, p.y - xy[i - 1].y),
  );
  const total = seg.reduce((a, b) => a + b, 0);
  let run = 0;

  return ROUTE.map((city, i) => {
    run += seg[i];
    return { city, x: xy[i].x, y: xy[i].y, at: (run / total) * DRAW_SECONDS };
  });
}

const PLACED = project();
const POLYLINE = PLACED.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

export function ServiceAreaTraverse() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Observer plus an immediate position check. A threshold observer alone can
    // be skipped entirely if the section passes through the viewport between two
    // intersection computations — flick scrolling, an anchor jump, restored
    // scroll position on back-navigation — which would strand the line
    // permanently half-drawn.
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
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-traverse="" data-running={started ? "true" : "false"}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Urban Reach service area: ${site.serviceArea.join(", ")}, all in ${site.stateName}.`}
      >
        {/* pathLength normalises the dash maths to 0–1, so the draw does not
            have to be re-tuned whenever a city moves the geometry. */}
        <polyline
          data-traverse-line=""
          points={POLYLINE}
          pathLength={1}
          fill="none"
          /* Amber at low alpha rather than the neutral rule colour. On the
             walnut ground a hairline in --color-rule was very nearly invisible,
             which left the nodes reading as scattered dots with no route
             between them — the connection is the whole point. */
          stroke="var(--color-amber)"
          strokeOpacity={0.5}
          strokeWidth={1.25}
          strokeLinejoin="round"
          style={{ "--draw": `${DRAW_SECONDS}s` } as object}
        />

        {PLACED.map(({ city, x, y, at }) => {
          const isAnchor = city === site.city;
          return (
            <g
              key={city}
              data-traverse-node=""
              style={{ "--at": `${at.toFixed(2)}s` } as object}
            >
              {/* The anchor city carries a ring as well as a dot — the one place
                  the drawing is allowed to emphasise anything. */}
              {isAnchor && (
                <circle
                  cx={x}
                  cy={y}
                  r={7}
                  fill="none"
                  stroke="var(--color-amber)"
                  strokeWidth={1}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={isAnchor ? 3.5 : 2.5}
                fill="var(--color-amber)"
              />
              {/* Halo, not repositioning. The route passes directly through
                  where several labels want to sit, and nudging each one to a
                  clear side is a losing game — every future city change
                  reshuffles the geometry and re-breaks it. A background-coloured
                  stroke painted under the fill (paintOrder) is the standard
                  cartographic answer and is position-independent.

                  The stroke colour must match the surface EXACTLY, which is why
                  the panel on /contact carries no background of its own: this
                  sits on the section's walnut. If that panel is ever given a
                  fill, this value has to change with it. */}
              <text
                x={x + (isAnchor ? 20 : 15)}
                y={y + (isAnchor ? 6 : 5)}
                stroke="var(--color-walnut)"
                strokeWidth={5}
                strokeLinejoin="round"
                paintOrder="stroke"
                className={
                  isAnchor
                    ? "fill-bone font-display text-[19px]"
                    : "fill-bone font-display text-[16px]"
                }
              >
                {city}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
