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
/* Category glyphs — small line-art marks for the /appliances grid            */
/* ========================================================================== */

const GLYPH = {
  stroke: "currentColor",
  strokeWidth: 1.4,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CategoryGlyph({
  kind,
  className,
}: {
  kind: string;
  className?: string;
}) {
  const common = { viewBox: "0 0 48 48", className, "aria-hidden": true as const };

  switch (kind) {
    case "refrigeration":
      return (
        <svg {...common}>
          <rect x="13" y="5" width="22" height="38" rx="2.5" {...GLYPH} />
          <line x1="13" y1="19" x2="35" y2="19" {...GLYPH} />
          <line x1="18" y1="11" x2="18" y2="15" {...GLYPH} />
          <line x1="18" y1="24" x2="18" y2="30" {...GLYPH} />
        </svg>
      );
    case "dishwasher":
      return (
        <svg {...common}>
          <rect x="9" y="7" width="30" height="34" rx="2.5" {...GLYPH} />
          <line x1="9" y1="15" x2="39" y2="15" {...GLYPH} />
          <circle cx="31" cy="11" r="1.6" {...GLYPH} />
          <circle cx="14" cy="28" r="7" {...GLYPH} />
        </svg>
      );
    case "beverage":
      return (
        <svg {...common}>
          <rect x="13" y="5" width="22" height="38" rx="2.5" {...GLYPH} />
          <line x1="17" y1="17" x2="31" y2="17" {...GLYPH} />
          <line x1="17" y1="26" x2="31" y2="26" {...GLYPH} />
          <line x1="17" y1="35" x2="31" y2="35" {...GLYPH} />
        </svg>
      );
    case "cooking":
      return (
        <svg {...common}>
          <rect x="8" y="10" width="32" height="28" rx="2.5" {...GLYPH} />
          <line x1="8" y1="19" x2="40" y2="19" {...GLYPH} />
          <circle cx="15" cy="14.5" r="1.4" {...GLYPH} />
          <circle cx="22" cy="14.5" r="1.4" {...GLYPH} />
          <rect x="14" y="24" width="20" height="9" rx="1.5" {...GLYPH} />
        </svg>
      );
    case "laundry":
      return (
        <svg {...common}>
          <rect x="10" y="6" width="28" height="36" rx="2.5" {...GLYPH} />
          <circle cx="24" cy="27" r="9" {...GLYPH} />
          <circle cx="24" cy="27" r="4" {...GLYPH} />
          <line x1="15" y1="13" x2="21" y2="13" {...GLYPH} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M24 5 L40 14 v20 L24 43 L8 34 V14 Z" {...GLYPH} />
          <path d="M24 24 L40 14 M24 24 L8 14 M24 24 v19" {...GLYPH} />
        </svg>
      );
  }
}
