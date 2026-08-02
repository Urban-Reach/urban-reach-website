"use client";

import { useEffect, useRef, useState } from "react";
import { MAP } from "@/data/austin-map";
import { site } from "@/data/site";

/**
 * "Where we work" — the service area plotted on a real map of the Austin metro.
 *
 * This replaced an abstract version: nodes joined by a single drawn line, no
 * geography at all. It read as a diagram of relationships rather than a place,
 * and the point of the section is the place.
 *
 * WHAT IS ACTUALLY DRAWN
 * Everything under the city markers is real, projected geometry, not decoration:
 * nine county outlines with Travis picked out, the Colorado River through the
 * metro — which is also Lady Bird Lake, Lake Austin and Lake Travis, since those
 * are widenings of the same waterway — and I-35, US-183 and TX-71. Those three
 * highways are how anyone in Austin actually describes where something is, which
 * is why they are in and why nothing smaller is.
 *
 * There is still no boundary drawn around the service area, and that remains
 * deliberate. A shaded coverage area is a claim with an edge, and the copy beside
 * this says the opposite — contact us even if you are just outside. Markers on a
 * real map show reach without asserting a limit.
 *
 * An earlier version also drew the surrounding towns (Georgetown, Leander,
 * Hutto, etc.) in a quiet unmarked tone, as region-building context. The client
 * confirmed none of those are actual service cities and had them removed
 * entirely — see the note on MAP.towns in src/data/austin-map.ts. Do not
 * reintroduce that layer without an explicit confirmed list from the client.
 *
 * ATTRIBUTION
 * The river and highways come from OpenStreetMap under ODbL, which obliges
 * attribution in any published work. The credit is rendered below the map. It is
 * not optional and it is not decoration: if those layers ship, it ships.
 *
 * CONTENT
 * The only place names are the confirmed cities in site.serviceArea, already
 * published in the footer and the FAQ. CITY_GEO is keyed to that union, so adding
 * a city there without coordinates fails the build rather than silently dropping
 * it from the map.
 */

type City = (typeof site.serviceArea)[number];

/**
 * True coordinates, plus which side the label sets on.
 *
 * `side` is not cosmetic. Round Rock and Cedar Park sit at almost the same
 * latitude, so with both labels set to the right, Cedar Park's ran straight
 * through Round Rock's marker. Bee Cave is far enough west that a right-hand
 * label crowds the river. Check this if a city is added.
 */
const CITY_GEO: Record<City, { lat: number; lon: number; side: "left" | "right" }> = {
  Austin: { lat: 30.2672, lon: -97.7431, side: "right" },
  "Round Rock": { lat: 30.5083, lon: -97.6789, side: "right" },
  Pflugerville: { lat: 30.4394, lon: -97.62, side: "right" },
  "Cedar Park": { lat: 30.5052, lon: -97.8203, side: "left" },
  "Bee Cave": { lat: 30.3077, lon: -97.9464, side: "left" },
};

/** Markers light in this order — north to south, the anchor city last. */
const ORDER: City[] = [
  "Round Rock",
  "Cedar Park",
  "Pflugerville",
  "Bee Cave",
  "Austin",
];

const STEP = 0.24;

/** Same projection the map data was generated with. Must not drift from it. */
function project(lon: number, lat: number) {
  return {
    x: ((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.W,
    y: ((MAP.lat1 - lat) / (MAP.lat1 - MAP.lat0)) * MAP.H,
  };
}

const PLACED = ORDER.map((city, i) => {
  const geo = CITY_GEO[city];
  return { city, ...project(geo.lon, geo.lat), side: geo.side, at: 0.55 + i * STEP };
});

export function ServiceAreaTraverse() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Observer plus an immediate position check. A threshold observer alone can
    // be skipped entirely if the section crosses the viewport between two
    // intersection computations — flick scrolling, an anchor jump, restored
    // scroll position on back-navigation — which would leave the map faded out
    // and the markers unlit.
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
        viewBox={`0 0 ${MAP.W} ${MAP.H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Map of the Austin metro. Urban Reach works across the region; the cities marked are those it works in most often: ${site.serviceArea.join(", ")}.`}
      >
        {/* Base geography, faintest first. Counties are the quietest layer: they
            give the frame real shape without ever becoming the subject. */}
        <g data-traverse-map="">
          <g fill="none" stroke="#F2EDE6" strokeOpacity={0.12} strokeWidth={1}>
            {MAP.counties
              .filter((c) => !c.core)
              .map((c, i) => (
                <polyline key={`c${i}`} points={c.d} />
              ))}
          </g>

          {/* Highways, two tiers. The majors — US-183, US-290, TX-71 and the
              toll loops — are what turn a sparse diagram into something that
              reads as a road network. */}
          <g fill="none" stroke="#F2EDE6" strokeOpacity={0.2} strokeWidth={1} strokeLinecap="round">
            {MAP.roads.major.map((d, i) => (
              <polyline key={`m${i}`} points={d} />
            ))}
          </g>
          {/* I-35 is the strongest line on the map after the river. It is the
              spine every address in Austin is described relative to, and at the
              weight the other roads use it disappeared entirely — which left the
              map reading as county lines and a river. */}
          <g fill="none" stroke="#F2EDE6" strokeOpacity={0.42} strokeWidth={1.5} strokeLinecap="round">
            {MAP.roads.spine.map((d, i) => (
              <polyline key={`i${i}`} points={d} />
            ))}
          </g>

          {/* Water, in the one cool tone on the whole site. Austin is legible
              from the river's shape before anything else, so this is allowed to
              read more strongly than the linework around it — and a cool hue
              against an entirely warm palette is what makes it register as water
              instead of as another road. */}
          <g fill="none" stroke="#5C7683" strokeOpacity={0.75} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
            {MAP.water.map((d, i) => (
              <polyline key={`w${i}`} points={d} />
            ))}
          </g>

          {/* Travis County last of the base layers, so it sits over the rest. */}
          <g fill="none" stroke="#F2EDE6" strokeOpacity={0.3} strokeWidth={1.1}>
            {MAP.counties
              .filter((c) => c.core)
              .map((c, i) => (
                <polyline key={`core${i}`} points={c.d} />
              ))}
          </g>
        </g>

        {/* Surrounding towns used to render here — Georgetown, Leander, Hutto
            and five others, drawn quiet and unmarked as region-building
            context. Removed at the client's direction: none were confirmed
            service cities, and the client wanted them off the map entirely
            rather than merely de-emphasised. MAP.towns is now always an empty
            array (see src/data/austin-map.ts), so there is nothing to iterate
            here. Do not re-add this block without a confirmed list. */}

        {/* Markers. */}
        {PLACED.map(({ city, x, y, side, at }) => {
          const isAnchor = city === site.city;
          const anchorEnd = side === "left";
          return (
            <g
              key={city}
              data-traverse-node=""
              style={{ "--at": `${at.toFixed(2)}s` } as object}
            >
              {isAnchor && (
                <circle cx={x} cy={y} r={8} fill="none" stroke="var(--color-amber)" strokeWidth={1} />
              )}
              <circle cx={x} cy={y} r={isAnchor ? 4 : 3} fill="var(--color-amber)" />
              {/* Halo, not repositioning. Labels sit over county lines, highways
                  and in places the river; nudging each one clear is a losing game
                  that re-breaks whenever the geography changes. A
                  background-coloured stroke under the fill is the standard
                  cartographic answer and is position-independent.

                  The stroke must match the surface EXACTLY, which is why the
                  panel around this carries no background of its own — this sits
                  on the section's walnut. If that panel is ever given a fill,
                  change this with it. */}
              <text
                x={x + (anchorEnd ? -14 : 14)}
                y={y + (isAnchor ? 6 : 5)}
                textAnchor={anchorEnd ? "end" : "start"}
                stroke="var(--color-walnut)"
                strokeWidth={5}
                strokeLinejoin="round"
                paintOrder="stroke"
                className={
                  isAnchor
                    ? "fill-bone font-display text-[21px]"
                    : "fill-bone font-display text-[17px]"
                }
              >
                {city}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Required by ODbL for the river and highway geometry. Not decoration. */}
      <p className="mt-5 text-center text-[11px] text-bone-dim/70">
        County boundaries: US Census Bureau. Waterways and highways: ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          className="link-underline transition-colors hover:text-amber"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>{" "}
        contributors.
      </p>
    </div>
  );
}
