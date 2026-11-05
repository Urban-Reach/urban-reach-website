"use client";

import { useEffect, useRef } from "react";

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

function SceneStaged() {
  return (
    <>
      <Box {...PLINTH} />
      <LightPool x={1.1} y={3.9} w={2.6} d={2.6} />
      <Box x={0.9} y={0.9} z={0} w={1.8} d={1.8} h={1.5} tone="crate" />
      <Box x={3.2} y={1.1} z={0} w={1.6} d={1.6} h={1.1} tone="crate" />
      <Box x={3.35} y={1.25} z={1.1} w={1.3} d={1.3} h={0.8} tone="crate" />
      <Box x={5.3} y={2.2} z={0} w={1.4} d={1.4} h={1.0} tone="crate" />
      <Box x={1.3} y={4.1} z={0} w={2.2} d={2.2} h={0.18} tone="crate" />
      <Box x={1.4} y={4.2} z={0.18} w={2} d={2} h={1.8} tone="amber" />
    </>
  );
}

const SKY_BASE = 168;

const SKY_FILL: [number, number, number][] = [
  [34, 24, 46], [58, 18, 68], [76, 28, 40], [172, 20, 58],
  [232, 22, 72], [254, 28, 100], [282, 18, 54], [300, 32, 80],
  [332, 18, 44], [350, 26, 62],
];

function AustinSkyline() {
  return (
    <g
      fill="#3C2F21"
      transform={`translate(0,${SKY_BASE}) scale(1,1.5) translate(0,${-SKY_BASE})`}
    >
      {SKY_FILL.map(([x, w, h]) => (
        <rect key={x} x={x} y={SKY_BASE - h} width={w} height={h} />
      ))}

      <path d="M104 168 v-44 h36 v-30 h-8 v-26 h26 v-24 h-18 v24 h-8 v26 h-8 v30 h-20z" />

      <path d="M158 168 v-126 q7 -13 14 0 v126z" />

      <path d="M192 168 v-96 h34 v-14 h-10 v-12 h6 l5 -18 l5 18 h6 v12 h-10 v14 h4 v96z" />

      <path d="M386 168 v-26 h12 v-10 q9 -22 18 0 v10 h12 v26z" />
      <rect x={424} y={SKY_BASE - 34} width={18} height={34} />
    </g>
  );
}

function BoxTruck() {
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
      <LightPool x={0} y={3.85} w={8} d={0.12} />
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

function Mannequin({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Box x={x} y={y} z={0} w={0.34} d={0.34} h={0.9} tone="figure" />
      <Box x={x + 0.46} y={y} z={0} w={0.34} d={0.34} h={0.9} tone="figure" />
      <Box x={x - 0.05} y={y - 0.05} z={0.9} w={0.9} d={0.5} h={1.0} tone="figure" />
      <Box x={x + 0.2} y={y + 0.05} z={1.9} w={0.45} d={0.4} h={0.45} tone="figure" />
      <Box x={x + 0.85} y={y + 0.05} z={1.45} w={1.0} d={0.24} h={0.24} tone="figure" />
    </g>
  );
}

function CabinetRun() {
  return (
    <>
      <Box x={4.6} y={0.6} z={0} w={2.6} d={1.5} h={1.6} tone="crate" />
      <Box x={1.2} y={0.6} z={0} w={1.4} d={1.5} h={1.6} tone="crate" />
      <Box x={2.6} y={0.6} z={0} w={2} d={1.5} h={0.1} tone="plinth" />
    </>
  );
}

function SceneSet() {
  return (
    <>
      <Box {...PLINTH} />
      <CabinetRun />
      <g style={{ transform: `translateY(calc((1 - var(--s)) * -46px))` }}>
        <Box x={2.75} y={0.75} z={0.1} w={1.7} d={1.2} h={1.5} tone="amber" />
      </g>
      <Mannequin x={3.1} y={3.4} />
    </>
  );
}

function SceneInstalled() {
  return (
    <>
      <Box {...PLINTH} />
      <LightPool x={2.3} y={2.2} w={2.6} d={2.4} />
      <CabinetRun />
      <Box x={2.75} y={0.75} z={0.1} w={1.7} d={1.2} h={1.5} tone="amber" />
      <Box x={1.1} y={0.5} z={1.6} w={6.2} d={1.7} h={0.14} tone="metal" />
    </>
  );
}

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
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let queued = false;
    const update = () => {
      queued = false;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      strip.style.setProperty("--p", clamped.toFixed(4));

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
    <div ref={sectionRef} data-journey="" className="relative lg:h-[500vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div
          ref={stripRef}
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
