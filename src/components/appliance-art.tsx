/**
 * Hand-drawn appliance artwork for the blueprint-to-reality transformation.
 *
 * Each appliance is drawn twice against an identical viewBox and identical
 * geometry:
 *
 *   <Appliance>Line  — amber technical linework, the "spec" state
 *   <Appliance>Real  — the same object shaded, the "installed" state
 *
 * Because the coordinates match exactly, the crossfade registers perfectly and
 * the object appears to resolve in place rather than swap.
 *
 * SCOPE CONSTRAINT (build prompt §5): each drawing is a SINGLE appliance,
 * isolated on a plain ground. Never a room, a kitchen layout, or an interior.
 * Urban Reach sources and installs appliances; it does not design or build
 * spaces, and the artwork must not imply otherwise. Do not add cabinetry,
 * counters beyond a minimal reference line, walls, floors, or props.
 *
 * The "Real" states are rendered graphics, which §5 permits alongside
 * photography. They are the swap point for real product photography when it
 * exists — replace the Real component body with an <Image> at the same aspect
 * ratio and the motion keeps working unchanged.
 */

type ArtProps = {
  /** Unique per instance: SVG gradient ids are document-global. */
  uid: string;
  className?: string;
};

const VIEW_BOX = "0 0 400 540";

/* ========================================================================== */
/* Shared defs                                                                */
/* ========================================================================== */

function RealDefs({ uid }: { uid: string }) {
  return (
    <defs>
      {/* Brushed stainless / graphite body */}
      <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2a2a2c" />
        <stop offset="18%" stopColor="#3d3e42" />
        <stop offset="42%" stopColor="#55565b" />
        <stop offset="58%" stopColor="#4a4b50" />
        <stop offset="82%" stopColor="#333438" />
        <stop offset="100%" stopColor="#232326" />
      </linearGradient>

      {/* Darker recessed surfaces */}
      <linearGradient id={`${uid}-recess`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1b1b1d" />
        <stop offset="50%" stopColor="#28292c" />
        <stop offset="100%" stopColor="#171718" />
      </linearGradient>

      {/* Polished handle */}
      <linearGradient id={`${uid}-handle`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6e7075" />
        <stop offset="35%" stopColor="#a7a9ae" />
        <stop offset="65%" stopColor="#78797e" />
        <stop offset="100%" stopColor="#4d4e52" />
      </linearGradient>

      {/* Warm amber ambient spill, ties the render to the brand palette */}
      <linearGradient id={`${uid}-warm`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c9922f" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#c9922f" stopOpacity="0" />
      </linearGradient>

      {/* Glass door */}
      <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8fa3ad" stopOpacity="0.28" />
        <stop offset="45%" stopColor="#cfd8dd" stopOpacity="0.13" />
        <stop offset="55%" stopColor="#7d8b95" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#5c6971" stopOpacity="0.3" />
      </linearGradient>

      {/* Interior cavity glow */}
      <linearGradient id={`${uid}-cavity`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b3222" />
        <stop offset="100%" stopColor="#141414" />
      </linearGradient>

      {/* Contact shadow under the unit */}
      <radialGradient id={`${uid}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** Faint amber tick marks, as on an equipment spec drawing. */
function DimensionMarks() {
  const s = {
    stroke: "#c9922f",
    strokeWidth: 1,
    opacity: 0.45,
  };
  return (
    <g>
      {/* Vertical overall height */}
      <line x1="30" y1="46" x2="30" y2="494" {...s} strokeDasharray="3 5" />
      <line x1="24" y1="46" x2="36" y2="46" {...s} />
      <line x1="24" y1="494" x2="36" y2="494" {...s} />
      {/* Horizontal overall width */}
      <line x1="62" y1="516" x2="338" y2="516" {...s} strokeDasharray="3 5" />
      <line x1="62" y1="510" x2="62" y2="522" {...s} />
      <line x1="338" y1="510" x2="338" y2="522" {...s} />
    </g>
  );
}

const LINE = {
  stroke: "#c9922f",
  strokeWidth: 1.6,
  fill: "none",
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

const LINE_THIN = { ...LINE, strokeWidth: 1, opacity: 0.68 };

/* ========================================================================== */
/* Refrigeration — commercial two-door reach-in                               */
/* ========================================================================== */

export function RefrigerationLine({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <DimensionMarks />
      <g id={`${uid}-line`}>
        {/* Cabinet */}
        <rect x="62" y="46" width="276" height="448" rx="6" {...LINE} />
        {/* Compressor housing */}
        <rect x="62" y="46" width="276" height="58" rx="6" {...LINE} />
        {/* Louvre vents */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={252}
            y1={62 + i * 8}
            x2={324}
            y2={62 + i * 8}
            {...LINE_THIN}
          />
        ))}
        {/* Door split */}
        <line x1="200" y1="104" x2="200" y2="452" {...LINE} />
        {/* Door panel insets */}
        <rect x="76" y="118" width="110" height="320" rx="3" {...LINE_THIN} />
        <rect x="214" y="118" width="110" height="320" rx="3" {...LINE_THIN} />
        {/* Handles */}
        <rect x="176" y="150" width="9" height="150" rx="4.5" {...LINE} />
        <rect x="215" y="150" width="9" height="150" rx="4.5" {...LINE} />
        {/* Kick plate */}
        <line x1="62" y1="452" x2="338" y2="452" {...LINE} />
        {/* Legs */}
        <line x1="88" y1="494" x2="88" y2="512" {...LINE} />
        <line x1="312" y1="494" x2="312" y2="512" {...LINE} />
        {/* Hinge marks */}
        <circle cx="70" cy="130" r="3" {...LINE_THIN} />
        <circle cx="70" cy="426" r="3" {...LINE_THIN} />
        <circle cx="330" cy="130" r="3" {...LINE_THIN} />
        <circle cx="330" cy="426" r="3" {...LINE_THIN} />
      </g>
    </svg>
  );
}

export function RefrigerationReal({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <RealDefs uid={uid} />
      <ellipse cx="200" cy="508" rx="150" ry="18" fill={`url(#${uid}-shadow)`} />

      {/* Cabinet */}
      <rect x="62" y="46" width="276" height="448" rx="6" fill={`url(#${uid}-body)`} />
      {/* Compressor housing */}
      <rect x="62" y="46" width="276" height="58" rx="6" fill={`url(#${uid}-recess)`} />
      <rect x="250" y="58" width="76" height="36" rx="2" fill="#141416" opacity="0.85" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={254}
          y1={64 + i * 7}
          x2={322}
          y2={64 + i * 7}
          stroke="#5b5c61"
          strokeWidth="1.5"
        />
      ))}
      {/* Status lamp */}
      <circle cx="82" cy="76" r="4" fill="#c9922f" opacity="0.9" />

      {/* Doors */}
      <rect x="66" y="108" width="130" height="340" rx="4" fill={`url(#${uid}-body)`} />
      <rect x="204" y="108" width="130" height="340" rx="4" fill={`url(#${uid}-body)`} />
      {/* Door insets */}
      <rect x="78" y="120" width="106" height="316" rx="3" fill={`url(#${uid}-recess)`} opacity="0.55" />
      <rect x="216" y="120" width="106" height="316" rx="3" fill={`url(#${uid}-recess)`} opacity="0.55" />
      {/* Specular streaks */}
      <rect x="94" y="120" width="10" height="316" fill="#ffffff" opacity="0.045" />
      <rect x="232" y="120" width="10" height="316" fill="#ffffff" opacity="0.045" />

      {/* Handles */}
      <rect x="176" y="150" width="9" height="150" rx="4.5" fill={`url(#${uid}-handle)`} />
      <rect x="215" y="150" width="9" height="150" rx="4.5" fill={`url(#${uid}-handle)`} />

      {/* Door seam */}
      <line x1="200" y1="108" x2="200" y2="448" stroke="#121213" strokeWidth="2" />

      {/* Kick plate */}
      <rect x="62" y="452" width="276" height="42" rx="3" fill={`url(#${uid}-recess)`} />
      {/* Warm ambient spill along the base */}
      <rect x="62" y="440" width="276" height="54" fill={`url(#${uid}-warm)`} opacity="0.5" />

      {/* Legs */}
      <rect x="84" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />
      <rect x="307" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />

      {/* Edge definition */}
      <rect x="62" y="46" width="276" height="448" rx="6" stroke="#5e6065" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ========================================================================== */
/* Dishwasher — under-counter                                                 */
/* ========================================================================== */

export function DishwasherLine({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <DimensionMarks />
      <g id={`${uid}-line`}>
        {/* Counter reference line only — not a room, just the install datum */}
        <line x1="46" y1="70" x2="354" y2="70" {...LINE_THIN} strokeDasharray="6 6" />

        {/* Body */}
        <rect x="62" y="94" width="276" height="400" rx="5" {...LINE} />
        {/* Control fascia */}
        <rect x="62" y="94" width="276" height="46" rx="5" {...LINE} />
        {/* Control buttons */}
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={236 + i * 26} cy={117} r="5" {...LINE_THIN} />
        ))}
        <rect x="86" y="110" width="64" height="14" rx="3" {...LINE_THIN} />

        {/* Door */}
        <rect x="62" y="140" width="276" height="306" rx="4" {...LINE} />
        <rect x="78" y="156" width="244" height="274" rx="3" {...LINE_THIN} />
        {/* Recessed bar handle */}
        <rect x="120" y="164" width="160" height="12" rx="6" {...LINE} />

        {/* Kick plate */}
        <rect x="62" y="452" width="276" height="42" rx="3" {...LINE} />
        {/* Hinge datum */}
        <line x1="62" y1="446" x2="338" y2="446" {...LINE_THIN} />
      </g>
    </svg>
  );
}

export function DishwasherReal({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <RealDefs uid={uid} />
      <ellipse cx="200" cy="506" rx="148" ry="16" fill={`url(#${uid}-shadow)`} />

      {/* Body */}
      <rect x="62" y="94" width="276" height="400" rx="5" fill={`url(#${uid}-body)`} />

      {/* Control fascia */}
      <rect x="62" y="94" width="276" height="46" rx="5" fill={`url(#${uid}-recess)`} />
      <rect x="86" y="108" width="66" height="18" rx="3" fill="#0f1011" />
      <rect x="90" y="112" width="34" height="10" rx="1" fill="#c9922f" opacity="0.85" />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={236 + i * 26}
          cy={117}
          r="5"
          fill="#1a1b1d"
          stroke="#63656a"
          strokeWidth="1"
        />
      ))}
      <circle cx="236" cy="117" r="2.2" fill="#c9922f" />

      {/* Door */}
      <rect x="62" y="140" width="276" height="306" rx="4" fill={`url(#${uid}-body)`} />
      <rect x="78" y="156" width="244" height="274" rx="3" fill={`url(#${uid}-recess)`} opacity="0.45" />
      {/* Specular sweep */}
      <rect x="106" y="156" width="14" height="274" fill="#ffffff" opacity="0.05" />
      <rect x="272" y="156" width="8" height="274" fill="#ffffff" opacity="0.035" />

      {/* Recessed bar handle */}
      <rect x="120" y="164" width="160" height="12" rx="6" fill="#101012" />
      <rect x="122" y="165" width="156" height="5" rx="2.5" fill={`url(#${uid}-handle)`} />

      {/* Door bottom seam */}
      <line x1="62" y1="446" x2="338" y2="446" stroke="#121213" strokeWidth="2" />

      {/* Kick plate */}
      <rect x="62" y="452" width="276" height="42" rx="3" fill={`url(#${uid}-recess)`} />
      <rect x="62" y="438" width="276" height="56" fill={`url(#${uid}-warm)`} opacity="0.45" />

      <rect x="62" y="94" width="276" height="400" rx="5" stroke="#5e6065" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ========================================================================== */
/* Beverage cooler — glass door                                               */
/* ========================================================================== */

export function BeverageLine({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <DimensionMarks />
      <g id={`${uid}-line`}>
        {/* Cabinet */}
        <rect x="62" y="46" width="276" height="448" rx="6" {...LINE} />
        {/* Header panel */}
        <rect x="62" y="46" width="276" height="44" rx="6" {...LINE} />
        {/* Glass door frame */}
        <rect x="76" y="102" width="248" height="336" rx="4" {...LINE} />
        <rect x="92" y="118" width="216" height="304" rx="2" {...LINE_THIN} />
        {/* Shelves seen through the glass */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={92}
            y1={178 + i * 62}
            x2={308}
            y2={178 + i * 62}
            {...LINE_THIN}
          />
        ))}
        {/* Handle */}
        <rect x="300" y="150" width="9" height="130" rx="4.5" {...LINE} />
        {/* Kick plate */}
        <rect x="62" y="452" width="276" height="42" rx="3" {...LINE} />
        {/* Legs */}
        <line x1="88" y1="494" x2="88" y2="512" {...LINE} />
        <line x1="312" y1="494" x2="312" y2="512" {...LINE} />
      </g>
    </svg>
  );
}

export function BeverageReal({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <RealDefs uid={uid} />
      <ellipse cx="200" cy="508" rx="150" ry="18" fill={`url(#${uid}-shadow)`} />

      {/* Cabinet */}
      <rect x="62" y="46" width="276" height="448" rx="6" fill={`url(#${uid}-body)`} />
      {/* Header panel */}
      <rect x="62" y="46" width="276" height="44" rx="6" fill={`url(#${uid}-recess)`} />
      <rect x="84" y="62" width="54" height="12" rx="2" fill="#c9922f" opacity="0.8" />

      {/* Lit interior cavity */}
      <rect x="76" y="102" width="248" height="336" rx="4" fill={`url(#${uid}-cavity)`} />
      {/* Top light bar */}
      <rect x="92" y="110" width="216" height="4" rx="2" fill="#c9922f" opacity="0.85" />
      <rect x="92" y="114" width="216" height="40" fill={`url(#${uid}-warm)`} />

      {/* Shelves */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="92" y={174 + i * 62} width="216" height="5" rx="1" fill="#4c4e52" />
          <rect x="92" y={179 + i * 62} width="216" height="2" fill="#0d0d0d" opacity="0.6" />
        </g>
      ))}

      {/* Glass */}
      <rect x="76" y="102" width="248" height="336" rx="4" fill={`url(#${uid}-glass)`} />
      {/* Reflection streak */}
      <path d="M 108 102 L 158 102 L 96 438 L 76 438 Z" fill="#ffffff" opacity="0.05" />
      {/* Frame */}
      <rect x="76" y="102" width="248" height="336" rx="4" stroke="#6a6c71" strokeWidth="3" fill="none" />

      {/* Handle */}
      <rect x="300" y="150" width="9" height="130" rx="4.5" fill={`url(#${uid}-handle)`} />

      {/* Kick plate */}
      <rect x="62" y="452" width="276" height="42" rx="3" fill={`url(#${uid}-recess)`} />
      <rect x="62" y="440" width="276" height="54" fill={`url(#${uid}-warm)`} opacity="0.45" />

      {/* Legs */}
      <rect x="84" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />
      <rect x="307" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />

      <rect x="62" y="46" width="276" height="448" rx="6" stroke="#5e6065" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}


/* ========================================================================== */
/* Category glyphs — small appliance marks for the category grids             */
/* ========================================================================== */

/**
 * These were flat single-colour outlines, which read as stock template icons
 * rather than as part of a premium brand. Rebuilt with actual material:
 *
 *   - a brushed-steel gradient body instead of a flat silhouette
 *   - a warm amber key light from the upper left, matching the light direction
 *     used in the hero and in the full appliance renders
 *   - real component detail — handles, louvre vents, control panels, seams —
 *     drawn at the scale it would appear on the actual unit
 *   - a soft contact shadow grounding the object against the dark background
 *
 * Restrained on purpose: legible at 40px, no outlines thicker than they need
 * to be, and no decorative flourish. The reference point is editorial
 * construction photography, not an icon set.
 *
 * Gradient ids are namespaced per instance because SVG ids are document-global.
 */

type GlyphProps = { className?: string };

/** Namespace for the shared glyph gradient ids. */
const GID = "ur-glyph";

/**
 * The glyph gradients are defined ONCE per document rather than per instance.
 *
 * Per-instance defs would need a unique id, which means useId, which would make
 * this whole module a client component and ship every appliance SVG as
 * JavaScript. Rendering the gradients once in the root layout keeps the glyphs
 * as server components and avoids repeating identical <linearGradient> blocks
 * for every card on the page.
 */
export function ApplianceGradientSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
      {/* Brushed steel, lit from the upper left. */}
      <linearGradient id={`${GID}-steel`} x1="0" y1="0" x2="1" y2="0.35">
        <stop offset="0%" stopColor="#4a4c51" />
        <stop offset="24%" stopColor="#6d6f75" />
        <stop offset="52%" stopColor="#53555a" />
        <stop offset="78%" stopColor="#3c3d42" />
        <stop offset="100%" stopColor="#2b2c30" />
      </linearGradient>

      {/* Recessed panels and cavities. */}
      <linearGradient id={`${GID}-recess`} x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0%" stopColor="#1f2023" />
        <stop offset="60%" stopColor="#2c2e32" />
        <stop offset="100%" stopColor="#191a1c" />
      </linearGradient>

      {/* Polished trim and handles. */}
      <linearGradient id={`${GID}-trim`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8d9096" />
        <stop offset="45%" stopColor="#c2c5ca" />
        <stop offset="100%" stopColor="#6a6c71" />
      </linearGradient>

      {/* Amber key light spilling down the body. */}
      <linearGradient id={`${GID}-key`} x1="0.1" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#c9922f" stopOpacity="0.5" />
        <stop offset="45%" stopColor="#c9922f" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#c9922f" stopOpacity="0" />
      </linearGradient>

      {/* Glass, for the door fronts. */}
      <linearGradient id={`${GID}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#9fb0b9" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#d3dade" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#5d6a72" stopOpacity="0.28" />
      </linearGradient>

      {/* Contact shadow. */}
      <radialGradient id={`${GID}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      </defs>
    </svg>
  );
}

/** Shared body treatment: steel fill, amber key light, hairline edge. */
function Body({
  x,
  y,
  w,
  h,
  r = 3,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${GID}-steel)`} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${GID}-key)`} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill="none"
        stroke="#83868c"
        strokeWidth="0.6"
        opacity="0.55"
      />
    </>
  );
}

export function CategoryGlyph({
  kind,
  className,
}: {
  kind: string;
} & GlyphProps) {
  const svg = {
    viewBox: "0 0 48 52",
    className,
    fill: "none",
    "aria-hidden": true as const,
  };

  const shadow = <ellipse cx="24" cy="46.5" rx="15" ry="2.6" fill={`url(#${GID}-shadow)`} />;

  switch (kind) {
    /* --- Refrigeration: two-door reach-in -------------------------------- */
    case "refrigeration":
      return (
        <svg {...svg}>
                    {shadow}
          <Body x={12} y={4} w={24} h={41} />
          {/* Compressor housing with louvre vents */}
          <rect x="12" y="4" width="24" height="7.5" rx="3" fill={`url(#${GID}-recess)`} />
          {[0, 1, 2].map((i) => (
            <line key={i} x1="27" y1={6.4 + i * 1.7} x2="33.5" y2={6.4 + i * 1.7} stroke="#71747a" strokeWidth="0.55" />
          ))}
          <circle cx="15.6" cy="7.8" r="0.85" fill="#c9922f" />
          {/* Door panels, inset */}
          <rect x="13.4" y="13" width="9.6" height="30.6" rx="1.4" fill={`url(#${GID}-recess)`} opacity="0.5" />
          <rect x="25" y="13" width="9.6" height="30.6" rx="1.4" fill={`url(#${GID}-recess)`} opacity="0.5" />
          {/* Specular streak on each door */}
          <rect x="15.4" y="13" width="1.5" height="30.6" fill="#fff" opacity="0.07" />
          <rect x="27" y="13" width="1.5" height="30.6" fill="#fff" opacity="0.07" />
          {/* Vertical bar handles either side of the seam */}
          <rect x="22" y="17" width="1.1" height="13" rx="0.55" fill={`url(#${GID}-trim)`} />
          <rect x="24.9" y="17" width="1.1" height="13" rx="0.55" fill={`url(#${GID}-trim)`} />
          {/* Door seam */}
          <line x1="24" y1="12" x2="24" y2="43.6" stroke="#141416" strokeWidth="0.7" />
          {/* Feet */}
          <rect x="14.8" y="45" width="1.6" height="1.6" fill="#2a2b2e" />
          <rect x="31.6" y="45" width="1.6" height="1.6" fill="#2a2b2e" />
        </svg>
      );

    /* --- Dishwasher: under-counter -------------------------------------- */
    case "dishwasher":
      return (
        <svg {...svg}>
                    {shadow}
          {/* Counter datum only — an install reference, not a room */}
          <line x1="7" y1="6" x2="41" y2="6" stroke="#c9922f" strokeWidth="0.6" strokeDasharray="2 2.4" opacity="0.4" />
          <Body x={9} y={10} w={30} h={35} />
          {/* Control fascia with a lit display */}
          <rect x="9" y="10" width="30" height="6" rx="3" fill={`url(#${GID}-recess)`} />
          <rect x="12" y="11.9" width="7.5" height="2.3" rx="0.5" fill="#0f1011" />
          <rect x="12.7" y="12.5" width="4" height="1.1" fill="#c9922f" opacity="0.9" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={28 + i * 3.4} cy="13" r="0.85" fill="#1b1c1e" stroke="#787b81" strokeWidth="0.45" />
          ))}
          {/* Door with recessed bar handle */}
          <rect x="11.4" y="18.4" width="25.2" height="24.4" rx="1.2" fill={`url(#${GID}-recess)`} opacity="0.42" />
          <rect x="14.6" y="18.4" width="2" height="24.4" fill="#fff" opacity="0.06" />
          <rect x="15" y="20" width="18" height="1.7" rx="0.85" fill="#101113" />
          <rect x="15.3" y="20.25" width="17.4" height="0.7" rx="0.35" fill={`url(#${GID}-trim)`} />
          {/* Kick plate */}
          <rect x="9" y="41.4" width="30" height="3.6" rx="1" fill={`url(#${GID}-recess)`} />
          <rect x="9" y="40" width="30" height="5" fill={`url(#${GID}-key)`} opacity="0.5" />
        </svg>
      );

    /* --- Beverage: glass-door cooler ------------------------------------ */
    case "beverage":
      return (
        <svg {...svg}>
                    {shadow}
          <Body x={12} y={4} w={24} h={41} />
          {/* Header panel with a lit badge */}
          <rect x="12" y="4" width="24" height="5.6" rx="2.8" fill={`url(#${GID}-recess)`} />
          <rect x="15" y="6" width="5.4" height="1.6" rx="0.4" fill="#c9922f" opacity="0.85" />
          {/* Lit cavity behind glass */}
          <rect x="14.4" y="11.6" width="19.2" height="28.6" rx="1" fill="#141414" />
          <rect x="15.4" y="12.4" width="17.2" height="1" rx="0.5" fill="#c9922f" opacity="0.85" />
          <rect x="15.4" y="13.4" width="17.2" height="9" fill={`url(#${GID}-key)`} />
          {/* Shelves with stock silhouettes */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="15.4" y={21 + i * 6.4} width="17.2" height="0.9" fill="#585a5f" />
              {[0, 1, 2, 3, 4].map((c) => (
                <rect
                  key={c}
                  x={16.3 + c * 3.3}
                  y={17.6 + i * 6.4}
                  width="2.1"
                  height="3.4"
                  rx="0.6"
                  fill="#3a3b3f"
                  opacity={0.85 - i * 0.14}
                />
              ))}
            </g>
          ))}
          {/* Glass, frame, reflection */}
          <rect x="14.4" y="11.6" width="19.2" height="28.6" rx="1" fill={`url(#${GID}-glass)`} />
          <path d="M18.4 11.6 L22.4 11.6 L17.2 40.2 L14.4 40.2 Z" fill="#fff" opacity="0.07" />
          <rect x="14.4" y="11.6" width="19.2" height="28.6" rx="1" fill="none" stroke="#7c7f85" strokeWidth="0.9" />
          {/* Handle and feet */}
          <rect x="31.4" y="17" width="1.1" height="11" rx="0.55" fill={`url(#${GID}-trim)`} />
          <rect x="14.8" y="45" width="1.6" height="1.6" fill="#2a2b2e" />
          <rect x="31.6" y="45" width="1.6" height="1.6" fill="#2a2b2e" />
        </svg>
      );

    /* --- Cooking: range with oven --------------------------------------- */
    case "cooking":
      return (
        <svg {...svg}>
                    {shadow}
          <Body x={9} y={9} w={30} h={36} />
          {/* Cooktop surface with burners */}
          <rect x="9" y="9" width="30" height="7" rx="2.5" fill={`url(#${GID}-recess)`} />
          {[
            [16, 12.5],
            [23, 12.5],
            [30, 12.5],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="2.5" fill="#17181a" stroke="#6c6f74" strokeWidth="0.5" />
              <circle cx={cx} cy={cy} r="1.2" fill="#c9922f" opacity={i === 1 ? 0.85 : 0.25} />
            </g>
          ))}
          {/* Control knobs */}
          <rect x="9" y="16" width="30" height="4.4" rx="1" fill={`url(#${GID}-recess)`} opacity="0.7" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={13 + i * 5.6} cy="18.2" r="1" fill="#1b1c1e" stroke="#83868c" strokeWidth="0.45" />
          ))}
          {/* Oven door with glass window and bar handle */}
          <rect x="11.2" y="23" width="25.6" height="18.4" rx="1.2" fill={`url(#${GID}-recess)`} opacity="0.5" />
          <rect x="13.6" y="26.6" width="20.8" height="11.4" rx="0.8" fill="#101112" />
          <rect x="13.6" y="26.6" width="20.8" height="11.4" rx="0.8" fill={`url(#${GID}-glass)`} />
          <path d="M17 26.6 L20 26.6 L15.6 38 L13.6 38 Z" fill="#fff" opacity="0.06" />
          <rect x="13.6" y="26.6" width="20.8" height="11.4" rx="0.8" fill="none" stroke="#71747a" strokeWidth="0.6" />
          <rect x="13.2" y="23.6" width="21.6" height="1.6" rx="0.8" fill={`url(#${GID}-trim)`} />
          <rect x="9" y="41.4" width="30" height="3.6" rx="1" fill={`url(#${GID}-recess)`} />
        </svg>
      );

    /* --- Laundry: front-load ------------------------------------------- */
    case "laundry":
      return (
        <svg {...svg}>
                    {shadow}
          <Body x={11} y={5} w={26} h={40} />
          {/* Fascia with dial and display */}
          <rect x="11" y="5" width="26" height="7.4" rx="2.6" fill={`url(#${GID}-recess)`} />
          <circle cx="16.4" cy="8.7" r="2.2" fill="#1b1c1e" stroke="#8d9096" strokeWidth="0.55" />
          <line x1="16.4" y1="8.7" x2="16.4" y2="7" stroke="#c9922f" strokeWidth="0.7" />
          <rect x="22" y="7.4" width="11.4" height="2.6" rx="0.5" fill="#0f1011" />
          <rect x="22.7" y="8" width="4.6" height="1.3" fill="#c9922f" opacity="0.85" />
          {/* Porthole door: outer bezel, glass, drum behind */}
          <circle cx="24" cy="27.6" r="10.4" fill={`url(#${GID}-recess)`} />
          <circle cx="24" cy="27.6" r="10.4" fill="none" stroke="#83868c" strokeWidth="0.8" opacity="0.8" />
          <circle cx="24" cy="27.6" r="8" fill="#111213" />
          {/* Drum perforations */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={24 + Math.cos(a) * 4.6}
                cy={27.6 + Math.sin(a) * 4.6}
                r="0.7"
                fill="#3c3d41"
              />
            );
          })}
          <circle cx="24" cy="27.6" r="8" fill={`url(#${GID}-glass)`} />
          <path d="M19 21 Q17 25 17.6 30 Q19 24.5 22 21.8 Z" fill="#fff" opacity="0.1" />
          {/* Latch */}
          <rect x="33.4" y="26.4" width="1.5" height="2.4" rx="0.5" fill={`url(#${GID}-trim)`} />
          <rect x="11" y="41.4" width="26" height="3.6" rx="1" fill={`url(#${GID}-recess)`} />
        </svg>
      );

    /* --- Specialty: made-to-spec --------------------------------------- */
    default:
      return (
        <svg {...svg}>
                    {shadow}
          {/* A cased opening with a unit dropping in — "sourced to the spec" */}
          <path
            d="M9 15 L24 7 L39 15 L39 40 L24 44.5 L9 40 Z"
            fill={`url(#${GID}-steel)`}
          />
          <path d="M9 15 L24 7 L39 15 L39 40 L24 44.5 L9 40 Z" fill={`url(#${GID}-key)`} />
          <path
            d="M9 15 L24 7 L39 15 L39 40 L24 44.5 L9 40 Z"
            fill="none"
            stroke="#83868c"
            strokeWidth="0.7"
            opacity="0.6"
          />
          {/* Interior faces, to give the form real volume */}
          <path d="M9 15 L24 22.5 L24 44.5 L9 40 Z" fill="#000" opacity="0.3" />
          <path d="M24 22.5 L39 15 L39 40 L24 44.5 Z" fill="#000" opacity="0.14" />
          <path d="M9 15 L24 22.5 L39 15" fill="none" stroke="#9a9da3" strokeWidth="0.7" opacity="0.75" />
          <line x1="24" y1="22.5" x2="24" y2="44.5" stroke="#9a9da3" strokeWidth="0.55" opacity="0.5" />
          {/* Amber spec tick, tying it to the blueprint language */}
          <line x1="24" y1="7" x2="24" y2="3" stroke="#c9922f" strokeWidth="0.7" strokeDasharray="1.6 1.6" />
          <circle cx="24" cy="22.5" r="1.5" fill="#c9922f" opacity="0.85" />
        </svg>
      );
  }
}
