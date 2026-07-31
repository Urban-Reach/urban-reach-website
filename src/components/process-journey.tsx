"use client";

import { useEffect, useRef } from "react";

/**
 * Process journey — isometric diorama sequence.
 *
 * Four tiles, each a self-contained isometric vignette on a floating plinth,
 * panned horizontally by scroll while the section is pinned. Staged in a
 * warehouse, across Austin, set into an opening, finished.
 *
 * WHY VECTOR AND NOT WEBGL
 * A real Three.js scene was measured against this build before this was written:
 * it added 127KB gzipped to a site whose entire client bundle is 208KB, and an
 * isometric diorama is illegible at phone width regardless — the truck lands
 * around 45px across. This is roughly 3KB, scales instead of shrinking, and
 * needs no new dependency. Flat-shaded faces carry the three-dimensional read;
 * what is given up is soft shadow and ambient depth.
 *
 * PROJECTION
 * 2:1 dimetric. Screen position of a grid point:
 *
 *   sx = OX + (gx - gy) * U
 *   sy = OY + (gx + gy) * (U / 2) - gz * V
 *
 * Boxes are drawn as exactly three visible faces — top, left, right — with a
 * fixed tone each. That fixed shading is what sells the form, so tones must stay
 * consistent between tiles: a crate lit differently in two scenes reads as two
 * different objects.
 *
 * Boxes are NOT depth-sorted. They are written back-to-front in each scene by
 * hand, because a generic painter's sort on overlapping boxes of different
 * heights gets it wrong often enough that hand order is both shorter and more
 * reliable. If a box appears in front of something it should be behind, move it
 * earlier in its array.
 */

const U = 26;
const V = 22;
const OX = 220;
const OY = 70;
const TILE_W = 440;
const TILE_H = 330;

function p(gx: number, gy: number, gz: number) {
  return [OX + (gx - gy) * U, OY + (gx + gy) * (U / 2) - gz * V] as const;
}

type Tone = "plinth" | "crate" | "metal" | "amber" | "figure";

const TONES: Record<Tone, { top: string; left: string; right: string }> = {
  plinth: { top: "#241D16", left: "#181209", right: "#100C07" },
  crate: { top: "#4A4038", left: "#352E27", right: "#241F1A" },
  metal: { top: "#B4ADA2", left: "#847E76", right: "#5A554F" },
  amber: { top: "#C9922F", left: "#9A6E22", right: "#6B4C16" },
  figure: { top: "#8A8578", left: "#67625A", right: "#47433D" },
};

type Box = {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  tone: Tone;
};

function Box({ x, y, z, w, d, h, tone }: Box) {
  const t = TONES[tone];
  const top = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)];
  const left = [p(x, y + d, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x, y + d, z)];
  const right = [p(x + w, y + d, z + h), p(x + w, y, z + h), p(x + w, y, z), p(x + w, y + d, z)];
  const pts = (a: readonly (readonly [number, number])[]) => a.map((q) => q.join(",")).join(" ");

  /* Crates get a diagonal brace across each visible face. Without it a crate is
     just a cube, and four cubes on a plinth read as abstract blocks rather than
     as freight — the single cheapest thing that makes the scene legible. */
  const braced = tone === "crate" || tone === "amber";

  return (
    <g>
      <polygon points={pts(left)} fill={t.left} />
      <polygon points={pts(right)} fill={t.right} />
      <polygon points={pts(top)} fill={t.top} />

      {braced && (
        <g stroke="#0E0B07" strokeOpacity={0.28} strokeWidth={1}>
          <line x1={left[0][0]} y1={left[0][1]} x2={left[2][0]} y2={left[2][1]} />
          <line x1={right[1][0]} y1={right[1][1]} x2={right[3][0]} y2={right[3][1]} />
        </g>
      )}

      {/* A hairline along the two top edges facing the light. Flat fills alone
          leave adjacent faces of similar tone merging into one another; this is
          what separates a stacked crate from the one beneath it. */}
      <polyline
        points={pts([top[3], top[0], top[1]])}
        fill="none"
        stroke="#F2EDE6"
        strokeOpacity={0.14}
        strokeWidth={1}
      />
    </g>
  );
}

/** A flat amber wash on the plinth surface, for a pool of work light. */
function LightPool({ x, y, w, d }: { x: number; y: number; w: number; d: number }) {
  const q = [p(x, y, 0), p(x + w, y, 0), p(x + w, y + d, 0), p(x, y + d, 0)];
  return (
    <polygon
      points={q.map((c) => c.join(",")).join(" ")}
      fill="#C9922F"
      fillOpacity={0.13}
    />
  );
}

const PLINTH: Box = { x: 0, y: 0, z: -0.5, w: 8, d: 8, h: 0.5, tone: "plinth" };

/* -------------------------------------------------------------------------- */
/* 01 — Staged                                                                */
/* -------------------------------------------------------------------------- */

function SceneStaged() {
  return (
    <>
      <Box {...PLINTH} />
      <LightPool x={1.1} y={3.9} w={2.6} d={2.6} />
      {/* Back row first. */}
      <Box x={0.9} y={0.9} z={0} w={1.8} d={1.8} h={1.5} tone="crate" />
      <Box x={3.2} y={1.1} z={0} w={1.6} d={1.6} h={1.1} tone="crate" />
      <Box x={3.35} y={1.25} z={1.1} w={1.3} d={1.3} h={0.8} tone="crate" />
      <Box x={5.3} y={2.2} z={0} w={1.4} d={1.4} h={1.0} tone="crate" />
      {/* The one unit this scene is about. Pallet, then crate. */}
      <Box x={1.3} y={4.1} z={0} w={2.2} d={2.2} h={0.18} tone="crate" />
      <Box x={1.4} y={4.2} z={0.18} w={2} d={2} h={1.8} tone="amber" />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 — Across Austin                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Downtown Austin as a flat silhouette behind the isometric tile, rather than in
 * projection. A skyline is a profile — read head-on it is recognisable, drawn in
 * dimetric it becomes an unreadable cluster of boxes.
 *
 * Shapes are traced from the real profile, left to right roughly as seen from
 * the south bank: the Google/Sail tower's lean, the Independent's four offset
 * stacked blocks, the Austonian's slim shaft, Frost Bank Tower's notched crown,
 * and the Capitol dome sitting low and separate to the right.
 *
 * PLACEHOLDER: these are drawn by eye against reference photography and are
 * indicative, not surveyed. Before publishing, check the profile against a
 * photograph taken from the Congress Avenue bridge and correct the relative
 * heights — the whole point is that an Austinite recognises it.
 */
/** Baseline the skyline sits on, just behind the plinth's back corners. */
const SKY_BASE = 168;

/**
 * Filler towers, as [x, width, height]. Deliberately ADJACENT with no gaps: a
 * downtown skyline is a continuous mass, and an earlier version spaced these out
 * evenly, which read as scattered blocks on a horizon rather than as a city.
 * Heights rise toward the centre-right, where Austin's tall cluster actually is.
 */
const SKY_FILL: [number, number, number][] = [
  [34, 24, 46], [58, 18, 68], [76, 28, 40], [172, 20, 58],
  [232, 22, 72], [254, 28, 100], [282, 18, 54], [300, 32, 80],
  [332, 18, 44], [350, 26, 62],
];

function AustinSkyline() {
  /* Landmark shapes are hand-drawn; the fillers are generated. Only four
     buildings actually have to be right for an Austinite to place the profile:
     the Independent's offset stack, the Austonian's slim rounded shaft, Frost
     Bank Tower's notched crown, and the Capitol dome sitting low and apart to
     the right. Everything else is mass.

     PLACEHOLDER: drawn by eye from reference photography, not surveyed. Check
     against a photograph from the Congress Avenue bridge and correct the
     relative heights before publishing. */
  return (
    /* Scaled 1.5x vertically about the baseline. At true drawn height the road
       plinth occluded most of each tower and only stubs showed above it — the
       bases SHOULD be hidden behind the road, but enough of each profile has to
       clear it to be recognisable. Scaling about SKY_BASE keeps every building
       standing on the same ground line. */
    <g
      fill="#3C2F21"
      transform={`translate(0,${SKY_BASE}) scale(1,1.5) translate(0,${-SKY_BASE})`}
    >
      {SKY_FILL.map(([x, w, h]) => (
        <rect key={x} x={x} y={SKY_BASE - h} width={w} height={h} />
      ))}

      {/* The Independent — four offset blocks, stepping back to the right. */}
      <path d="M104 168 v-44 h36 v-30 h-8 v-26 h26 v-24 h-18 v24 h-8 v26 h-8 v30 h-20z" />

      {/* Austonian — slim shaft, rounded crown. */}
      <path d="M158 168 v-126 q7 -13 14 0 v126z" />

      {/* Frost Bank Tower — the notched crown is the whole tell. */}
      <path d="M192 168 v-96 h34 v-14 h-10 v-12 h6 l5 -18 l5 18 h6 v12 h-10 v14 h4 v96z" />

      {/* Texas Capitol — low, domed, set apart from the cluster. */}
      <path d="M386 168 v-26 h12 v-10 q9 -22 18 0 v10 h12 v26z" />
      <rect x={424} y={SKY_BASE - 34} width={18} height={34} />
    </g>
  );
}

function BoxTruck() {
  /* Deliberately small in the tile. At first pass the body spanned five of the
     eight grid units and read as a white slab filling the plinth rather than as a
     vehicle on a road — the skyline behind it is the subject of this frame, and
     the truck has to leave room for it. Wheels are wide flat boxes rather than
     cubes; at this scale a cube reads as a dark speck. */
  return (
    <g>
      <Box x={0} y={3.3} z={0.28} w={2.4} d={1.5} h={1.45} tone="metal" />
      <Box x={2.4} y={3.3} z={0.28} w={1.1} d={1.5} h={1.0} tone="metal" />
      <Box x={0.35} y={3.15} z={0} w={0.6} d={0.16} h={0.34} tone="plinth" />
      <Box x={1.75} y={3.15} z={0} w={0.6} d={0.16} h={0.34} tone="plinth" />
      <Box x={2.75} y={3.15} z={0} w={0.55} d={0.16} h={0.34} tone="plinth" />
    </g>
  );
}

function SceneAustin() {
  return (
    <>
      <AustinSkyline />
      <Box {...PLINTH} />
      {/* Lane marking, so the plinth reads as roadway. */}
      <LightPool x={0} y={3.85} w={8} d={0.12} />
      {/* The truck travels with scroll: --s is this tile's own 0-1 progress, and
          the offset follows the +gx axis, so it drives along the road rather
          than sliding across the screen. */}
      <g
        style={{
          transform: `translate(calc(var(--s) * ${3.6 * U}px), calc(var(--s) * ${3.6 * (U / 2)}px))`,
        }}
      >
        <BoxTruck />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 — Set                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The figure is a mannequin: boxes only, a plain block head, no features of any
 * kind and no attempt at one. That is deliberate and matches the rest of the
 * site, which shows no faces anywhere. Do not add them.
 */
function Mannequin({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Box x={x} y={y} z={0} w={0.34} d={0.34} h={0.9} tone="figure" />
      <Box x={x + 0.46} y={y} z={0} w={0.34} d={0.34} h={0.9} tone="figure" />
      <Box x={x - 0.05} y={y - 0.05} z={0.9} w={0.9} d={0.5} h={1.0} tone="figure" />
      <Box x={x + 0.2} y={y + 0.05} z={1.9} w={0.45} d={0.4} h={0.45} tone="figure" />
      {/* Extended arm, reaching toward the opening. */}
      <Box x={x + 0.85} y={y + 0.05} z={1.45} w={1.0} d={0.24} h={0.24} tone="figure" />
    </g>
  );
}

function CabinetRun() {
  return (
    <>
      <Box x={4.6} y={0.6} z={0} w={2.6} d={1.5} h={1.6} tone="crate" />
      <Box x={1.2} y={0.6} z={0} w={1.4} d={1.5} h={1.6} tone="crate" />
      {/* The opening: the gap between the two runs, floor and back wall only. */}
      <Box x={2.6} y={0.6} z={0} w={2} d={1.5} h={0.1} tone="plinth" />
    </>
  );
}

function SceneSet() {
  return (
    <>
      <Box {...PLINTH} />
      <CabinetRun />
      {/* Descends into the opening as the tile advances. */}
      <g style={{ transform: `translateY(calc((1 - var(--s)) * -46px))` }}>
        <Box x={2.75} y={0.75} z={0.1} w={1.7} d={1.2} h={1.5} tone="amber" />
      </g>
      <Mannequin x={3.1} y={3.4} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 — Installed                                                             */
/* -------------------------------------------------------------------------- */

function SceneInstalled() {
  return (
    <>
      <Box {...PLINTH} />
      <LightPool x={2.3} y={2.2} w={2.6} d={2.4} />
      <CabinetRun />
      <Box x={2.75} y={0.75} z={0.1} w={1.7} d={1.2} h={1.5} tone="amber" />
      {/* Counter, laid over both runs and the seated unit — the finished line. */}
      <Box x={1.1} y={0.5} z={1.6} w={6.2} d={1.7} h={0.14} tone="metal" />
    </>
  );
}

/* -------------------------------------------------------------------------- */

const SCENES = [
  { key: "staged", label: "01 — Staged", Scene: SceneStaged },
  { key: "austin", label: "02 — Across Austin", Scene: SceneAustin },
  { key: "set", label: "03 — Set", Scene: SceneSet },
  { key: "installed", label: "04 — Installed", Scene: SceneInstalled },
] as const;

export function ProcessJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Below lg the tiles are stacked, so there is nothing to pan.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let queued = false;
    const update = () => {
      queued = false;
      const rect = section.getBoundingClientRect();
      // Progress through the pinned run: 0 when the top reaches the viewport
      // top, 1 when the bottom reaches the viewport bottom.
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      strip.style.setProperty("--p", clamped.toFixed(4));

      // Each tile also gets its OWN 0-1, so its internal motion (the truck
      // driving, the unit descending) is driven by scroll rather than by a
      // fixed-duration animation that would finish while the tile is still on
      // screen. Written straight to the node: this runs every scroll frame and
      // a setState per frame would re-render every polygon.
      const n = SCENES.length;
      for (let i = 0; i < n; i++) {
        const start = i / n;
        const local = Math.min(1, Math.max(0, (clamped - start) * n));
        strip.style.setProperty(`--s${i}`, local.toFixed(4));
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // Tall enough to give each tile a screen of scrolling, plus a final screen
    // for the last frame to hold on. The stage inside is sticky, which is what
    // makes it a held sequence rather than something that scrolls past.
    <div ref={sectionRef} data-journey="" className="relative lg:h-[500vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div
          ref={stripRef}
          /* shrink-0 is load-bearing. As a flex item the strip defaults to
             flex-shrink: 1, so w-[400%] was being shrunk straight back to the
             container width — all four tiles rendered side by side at a quarter
             size and the pan travelled a quarter of the distance it should. */
          className="flex flex-col gap-16 lg:w-[400%] lg:shrink-0 lg:flex-row lg:gap-0"
          style={{ transform: "translateX(calc(var(--p, 0) * -75%))" }}
          data-journey-strip=""
        >
          {SCENES.map(({ key, label, Scene }, i) => (
            <div key={key} className="lg:w-1/4 lg:shrink-0 lg:px-10">
              <p className="label-caps mb-5 text-center text-bone-dim">{label}</p>
              <svg
                viewBox={`0 0 ${TILE_W} ${TILE_H}`}
                className="mx-auto h-auto w-full max-w-4xl"
                style={{ "--s": `var(--s${i}, 1)` } as object}
                role="img"
                aria-label={label}
              >
                <Scene />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
