type ArtProps = {
  uid: string;
  className?: string;
};

const VIEW_BOX = "0 0 400 540";

function RealDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6c717a" />
        <stop offset="10%" stopColor="#9ba1aa" />
        <stop offset="28%" stopColor="#7b818a" />
        <stop offset="46%" stopColor="#8c929b" />
        <stop offset="66%" stopColor="#686d76" />
        <stop offset="86%" stopColor="#4c5057" />
        <stop offset="100%" stopColor="#3a3e44" />
      </linearGradient>

      <pattern id={`${uid}-grain`} width="7" height="20" patternUnits="userSpaceOnUse">
        <rect width="7" height="20" fill="none" />
        <line x1="1" y1="0" x2="1" y2="20" stroke="#ffffff" strokeWidth="1" opacity="0.13" />
        <line x1="3.4" y1="0" x2="3.4" y2="20" stroke="#000000" strokeWidth="1" opacity="0.14" />
        <line x1="5.6" y1="0" x2="5.6" y2="20" stroke="#ffffff" strokeWidth="0.7" opacity="0.07" />
      </pattern>

      <linearGradient id={`${uid}-catch`} x1="0" y1="0" x2="1" y2="0.5">
        <stop offset="0%" stopColor="#eab863" stopOpacity="0.66" />
        <stop offset="24%" stopColor="#c9922f" stopOpacity="0.3" />
        <stop offset="60%" stopColor="#c9922f" stopOpacity="0.07" />
        <stop offset="100%" stopColor="#c9922f" stopOpacity="0" />
      </linearGradient>

      <linearGradient id={`${uid}-recess`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#31353b" />
        <stop offset="50%" stopColor="#40454c" />
        <stop offset="100%" stopColor="#262a2f" />
      </linearGradient>

      <linearGradient id={`${uid}-handle`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#787d85" />
        <stop offset="32%" stopColor="#d8dce0" />
        <stop offset="62%" stopColor="#9aa0a8" />
        <stop offset="100%" stopColor="#5d626a" />
      </linearGradient>

      <linearGradient id={`${uid}-warm`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c9922f" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#c9922f" stopOpacity="0" />
      </linearGradient>

      <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8fa3ad" stopOpacity="0.28" />
        <stop offset="45%" stopColor="#cfd8dd" stopOpacity="0.13" />
        <stop offset="55%" stopColor="#7d8b95" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#5c6971" stopOpacity="0.3" />
      </linearGradient>

      <linearGradient id={`${uid}-cavity`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b3222" />
        <stop offset="100%" stopColor="#141414" />
      </linearGradient>

      <radialGradient id={`${uid}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function DimensionMarks() {
  const s = {
    stroke: "#c9922f",
    strokeWidth: 1,
    opacity: 0.45,
  };
  return (
    <g>
      <line x1="30" y1="46" x2="30" y2="494" {...s} strokeDasharray="3 5" />
      <line x1="24" y1="46" x2="36" y2="46" {...s} />
      <line x1="24" y1="494" x2="36" y2="494" {...s} />
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

export function RefrigerationLine({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <DimensionMarks />
      <g id={`${uid}-line`}>
        <rect x="62" y="46" width="276" height="448" rx="6" {...LINE} />
        <rect x="62" y="46" width="276" height="58" rx="6" {...LINE} />
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
        <line x1="200" y1="104" x2="200" y2="452" {...LINE} />
        <rect x="76" y="118" width="110" height="320" rx="3" {...LINE_THIN} />
        <rect x="214" y="118" width="110" height="320" rx="3" {...LINE_THIN} />
        <rect x="176" y="150" width="9" height="150" rx="4.5" {...LINE} />
        <rect x="215" y="150" width="9" height="150" rx="4.5" {...LINE} />
        <line x1="62" y1="452" x2="338" y2="452" {...LINE} />
        <line x1="88" y1="494" x2="88" y2="512" {...LINE} />
        <line x1="312" y1="494" x2="312" y2="512" {...LINE} />
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

      <rect x="62" y="46" width="276" height="448" rx="6" fill={`url(#${uid}-body)`} />
      <rect x="62" y="46" width="276" height="448" rx="6" fill={`url(#${uid}-grain)`} />
      <rect x="62" y="46" width="118" height="448" rx="6" fill={`url(#${uid}-catch)`} />
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
      <circle cx="82" cy="76" r="4" fill="#c9922f" opacity="0.9" />

      <rect x="66" y="108" width="130" height="340" rx="4" fill={`url(#${uid}-body)`} />
      <rect x="204" y="108" width="130" height="340" rx="4" fill={`url(#${uid}-body)`} />
      <rect x="66" y="108" width="130" height="340" rx="4" fill={`url(#${uid}-grain)`} />
      <rect x="204" y="108" width="130" height="340" rx="4" fill={`url(#${uid}-grain)`} />
      <rect x="66" y="108" width="56" height="340" rx="4" fill={`url(#${uid}-catch)`} />
      <rect x="78" y="120" width="106" height="316" rx="3" fill={`url(#${uid}-recess)`} opacity="0.55" />
      <rect x="216" y="120" width="106" height="316" rx="3" fill={`url(#${uid}-recess)`} opacity="0.55" />
      <rect x="94" y="120" width="10" height="316" fill="#ffffff" opacity="0.045" />
      <rect x="232" y="120" width="10" height="316" fill="#ffffff" opacity="0.045" />

      <rect x="176" y="150" width="9" height="150" rx="4.5" fill={`url(#${uid}-handle)`} />
      <rect x="215" y="150" width="9" height="150" rx="4.5" fill={`url(#${uid}-handle)`} />

      <line x1="200" y1="108" x2="200" y2="448" stroke="#121213" strokeWidth="2" />

      <rect x="62" y="452" width="276" height="42" rx="3" fill={`url(#${uid}-recess)`} />
      <rect x="62" y="440" width="276" height="54" fill={`url(#${uid}-warm)`} opacity="0.5" />

      <rect x="84" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />
      <rect x="307" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />

      <rect x="86" y="404" width="58" height="18" rx="2" fill="#5a5f66" />
      <rect x="90" y="409" width="44" height="3" fill="#c2c7cd" opacity="0.7" />
      <rect x="90" y="415" width="28" height="2.5" fill="#9aa0a8" opacity="0.55" />

      <line x1="63" y1="52" x2="63" y2="488" stroke="#e4e8ec" strokeWidth="1.4" opacity="0.42" />
      <line x1="337" y1="52" x2="337" y2="488" stroke="#141619" strokeWidth="1.4" opacity="0.55" />
      <rect x="62" y="46" width="276" height="448" rx="6" stroke="#a9aeb5" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

export function DishwasherLine({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <DimensionMarks />
      <g id={`${uid}-line`}>
        <line x1="46" y1="70" x2="354" y2="70" {...LINE_THIN} strokeDasharray="6 6" />

        <rect x="62" y="94" width="276" height="400" rx="5" {...LINE} />
        <rect x="62" y="94" width="276" height="46" rx="5" {...LINE} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={236 + i * 26} cy={117} r="5" {...LINE_THIN} />
        ))}
        <rect x="86" y="110" width="64" height="14" rx="3" {...LINE_THIN} />

        <rect x="62" y="140" width="276" height="306" rx="4" {...LINE} />
        <rect x="78" y="156" width="244" height="274" rx="3" {...LINE_THIN} />
        <rect x="120" y="164" width="160" height="12" rx="6" {...LINE} />

        <rect x="62" y="452" width="276" height="42" rx="3" {...LINE} />
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

      <rect x="62" y="94" width="276" height="400" rx="5" fill={`url(#${uid}-body)`} />
      <rect x="62" y="94" width="276" height="400" rx="5" fill={`url(#${uid}-grain)`} />
      <rect x="62" y="94" width="118" height="400" rx="5" fill={`url(#${uid}-catch)`} />

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

      <rect x="62" y="140" width="276" height="306" rx="4" fill={`url(#${uid}-body)`} />
      <rect x="62" y="140" width="276" height="306" rx="4" fill={`url(#${uid}-grain)`} />
      <rect x="62" y="140" width="112" height="306" rx="4" fill={`url(#${uid}-catch)`} />
      <rect x="78" y="156" width="244" height="274" rx="3" fill={`url(#${uid}-recess)`} opacity="0.45" />
      <rect x="106" y="156" width="14" height="274" fill="#ffffff" opacity="0.05" />
      <rect x="272" y="156" width="8" height="274" fill="#ffffff" opacity="0.035" />

      <rect x="120" y="164" width="160" height="12" rx="6" fill="#101012" />
      <rect x="122" y="165" width="156" height="5" rx="2.5" fill={`url(#${uid}-handle)`} />

      <line x1="62" y1="446" x2="338" y2="446" stroke="#121213" strokeWidth="2" />

      <rect x="62" y="452" width="276" height="42" rx="3" fill={`url(#${uid}-recess)`} />
      <rect x="62" y="438" width="276" height="56" fill={`url(#${uid}-warm)`} opacity="0.45" />

      <rect x="62" y="94" width="276" height="400" rx="5" stroke="#5e6065" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function BeverageLine({ uid, className }: ArtProps) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" aria-hidden="true">
      <DimensionMarks />
      <g id={`${uid}-line`}>
        <rect x="62" y="46" width="276" height="448" rx="6" {...LINE} />
        <rect x="62" y="46" width="276" height="44" rx="6" {...LINE} />
        <rect x="76" y="102" width="248" height="336" rx="4" {...LINE} />
        <rect x="92" y="118" width="216" height="304" rx="2" {...LINE_THIN} />
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
        <rect x="300" y="150" width="9" height="130" rx="4.5" {...LINE} />
        <rect x="62" y="452" width="276" height="42" rx="3" {...LINE} />
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

      <rect x="62" y="46" width="276" height="448" rx="6" fill={`url(#${uid}-body)`} />
      <rect x="62" y="46" width="276" height="448" rx="6" fill={`url(#${uid}-grain)`} />
      <rect x="62" y="46" width="110" height="448" rx="6" fill={`url(#${uid}-catch)`} />
      <rect x="62" y="46" width="276" height="44" rx="6" fill={`url(#${uid}-recess)`} />
      <rect x="84" y="62" width="54" height="12" rx="2" fill="#c9922f" opacity="0.8" />

      <rect x="76" y="102" width="248" height="336" rx="4" fill={`url(#${uid}-cavity)`} />
      <rect x="92" y="110" width="216" height="4" rx="2" fill="#c9922f" opacity="0.85" />
      <rect x="92" y="114" width="216" height="40" fill={`url(#${uid}-warm)`} />

      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="92" y={174 + i * 62} width="216" height="5" rx="1" fill="#4c4e52" />
          <rect x="92" y={179 + i * 62} width="216" height="2" fill="#0d0d0d" opacity="0.6" />
        </g>
      ))}

      <rect x="76" y="102" width="248" height="336" rx="4" fill={`url(#${uid}-glass)`} />
      <path d="M 108 102 L 158 102 L 96 438 L 76 438 Z" fill="#ffffff" opacity="0.05" />
      <rect x="76" y="102" width="248" height="336" rx="4" stroke="#6a6c71" strokeWidth="3" fill="none" />

      <rect x="300" y="150" width="9" height="130" rx="4.5" fill={`url(#${uid}-handle)`} />

      <rect x="62" y="452" width="276" height="42" rx="3" fill={`url(#${uid}-recess)`} />
      <rect x="62" y="440" width="276" height="54" fill={`url(#${uid}-warm)`} opacity="0.45" />

      <rect x="84" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />
      <rect x="307" y="494" width="9" height="16" rx="2" fill="#2b2c2f" />

      <rect x="62" y="46" width="276" height="448" rx="6" stroke="#5e6065" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

type GlyphProps = { className?: string };

const GID = "ur-glyph";

export function ApplianceGradientSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
      <linearGradient id={`${GID}-steel`} x1="0" y1="0" x2="1" y2="0.28">
        <stop offset="0%" stopColor="#6f747c" />
        <stop offset="12%" stopColor="#9aa0a9" />
        <stop offset="30%" stopColor="#7c828b" />
        <stop offset="48%" stopColor="#8d939c" />
        <stop offset="66%" stopColor="#6a6f78" />
        <stop offset="86%" stopColor="#4e525a" />
        <stop offset="100%" stopColor="#3c4046" />
      </linearGradient>

      <pattern
        id={`${GID}-grain`}
        width="3"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <rect width="3" height="8" fill="none" />
        <line x1="0.4" y1="0" x2="0.4" y2="8" stroke="#ffffff" strokeWidth="0.4" opacity="0.16" />
        <line x1="1.5" y1="0" x2="1.5" y2="8" stroke="#000000" strokeWidth="0.4" opacity="0.16" />
        <line x1="2.4" y1="0" x2="2.4" y2="8" stroke="#ffffff" strokeWidth="0.3" opacity="0.09" />
      </pattern>

      <linearGradient id={`${GID}-recess`} x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0%" stopColor="#33373d" />
        <stop offset="55%" stopColor="#42474e" />
        <stop offset="100%" stopColor="#282c31" />
      </linearGradient>

      <linearGradient id={`${GID}-trim`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#787d85" />
        <stop offset="30%" stopColor="#d6dade" />
        <stop offset="58%" stopColor="#9ca2aa" />
        <stop offset="100%" stopColor="#5f646b" />
      </linearGradient>

      <linearGradient id={`${GID}-catch`} x1="0" y1="0" x2="1" y2="0.6">
        <stop offset="0%" stopColor="#e8b45f" stopOpacity="0.72" />
        <stop offset="22%" stopColor="#c9922f" stopOpacity="0.34" />
        <stop offset="55%" stopColor="#c9922f" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#c9922f" stopOpacity="0" />
      </linearGradient>

      <linearGradient id={`${GID}-key`} x1="0.1" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#c9922f" stopOpacity="0.3" />
        <stop offset="45%" stopColor="#c9922f" stopOpacity="0.09" />
        <stop offset="100%" stopColor="#c9922f" stopOpacity="0" />
      </linearGradient>

      <linearGradient id={`${GID}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#9fb0b9" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#d3dade" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#5d6a72" stopOpacity="0.28" />
      </linearGradient>

      <radialGradient id={`${GID}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#000" stopOpacity="0.62" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${GID}-ground`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#c9922f" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#c9922f" stopOpacity="0" />
      </radialGradient>
      </defs>
    </svg>
  );
}

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
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${GID}-grain)`} />
      <rect x={x} y={y} width={w * 0.42} height={h} rx={r} fill={`url(#${GID}-catch)`} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${GID}-key)`} />
      <line
        x1={x + 0.4}
        y1={y + r}
        x2={x + 0.4}
        y2={y + h - r}
        stroke="#e2e6ea"
        strokeWidth="0.7"
        opacity="0.5"
      />
      <line
        x1={x + w - 0.4}
        y1={y + r}
        x2={x + w - 0.4}
        y2={y + h - r}
        stroke="#15171a"
        strokeWidth="0.7"
        opacity="0.6"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill="none"
        stroke="#a9aeb5"
        strokeWidth="0.55"
        opacity="0.5"
      />
    </>
  );
}

function BarHandle({
  x,
  y,
  h,
  w = 1.5,
}: {
  x: number;
  y: number;
  h: number;
  w?: number;
}) {
  return (
    <>
      <rect x={x - 0.35} y={y - 0.9} width={w + 0.7} height="1.5" rx="0.5" fill="#5c6169" />
      <rect x={x - 0.35} y={y + h - 0.6} width={w + 0.7} height="1.5" rx="0.5" fill="#5c6169" />
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={`url(#${GID}-trim)`} />
      <rect x={x + 0.25} y={y + 1} width={w * 0.3} height={h - 2} rx={w * 0.15} fill="#f0d9a8" opacity="0.55" />
    </>
  );
}

function BrandPlate({ x, y, w = 6, h = 2 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="0.3" fill="#5a5f66" />
      <rect x={x + 0.4} y={y + 0.5} width={w - 0.8} height="0.4" fill="#b9bec5" opacity="0.75" />
      <rect x={x + 0.4} y={y + 1.2} width={(w - 0.8) * 0.6} height="0.35" fill="#9aa0a8" opacity="0.6" />
    </>
  );
}

function VentGrille({
  x,
  y,
  w,
  rows = 4,
}: {
  x: number;
  y: number;
  w: number;
  rows?: number;
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={rows * 1.5 + 1} rx="0.4" fill="#22262b" />
      {Array.from({ length: rows }).map((_, i) => (
        <g key={i}>
          <line
            x1={x + 0.6}
            y1={y + 1.1 + i * 1.5}
            x2={x + w - 0.6}
            y2={y + 1.1 + i * 1.5}
            stroke="#8d939b"
            strokeWidth="0.5"
          />
          <line
            x1={x + 0.6}
            y1={y + 1.5 + i * 1.5}
            x2={x + w - 0.6}
            y2={y + 1.5 + i * 1.5}
            stroke="#0f1113"
            strokeWidth="0.35"
          />
        </g>
      ))}
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

  const shadow = (
    <>
      <ellipse cx="24" cy="48" rx="17" ry="3.4" fill={`url(#${GID}-ground)`} />
      <ellipse cx="24" cy="46.8" rx="14" ry="2.4" fill={`url(#${GID}-shadow)`} />
    </>
  );

  switch (kind) {
    case "refrigeration":
      return (
        <svg {...svg}>
          {shadow}
          <Body x={11} y={4} w={26} h={41} />
          <rect x="11" y="4" width="26" height="8" rx="3" fill={`url(#${GID}-recess)`} />
          <VentGrille x={25.5} y={5.4} w={10} rows={4} />
          <rect x="13.4" y="6.2" width="7.6" height="3.4" rx="0.5" fill="#121416" />
          <rect x="14.2" y="7.1" width="4.2" height="1.5" fill="#c9922f" opacity="0.9" />
          <rect x="12.6" y="13.6" width="10.2" height="29.6" rx="1.2" fill={`url(#${GID}-recess)`} opacity="0.42" />
          <rect x="25.2" y="13.6" width="10.2" height="29.6" rx="1.2" fill={`url(#${GID}-recess)`} opacity="0.42" />
          <rect x="12.6" y="13.6" width="10.2" height="29.6" rx="1.2" fill={`url(#${GID}-grain)`} />
          <rect x="25.2" y="13.6" width="10.2" height="29.6" rx="1.2" fill={`url(#${GID}-grain)`} />
          <rect x="12.6" y="13.6" width="4" height="29.6" rx="1.2" fill={`url(#${GID}-catch)`} opacity="0.65" />
          {[15.4, 41].map((cy) => (
            <g key={cy}>
              <rect x="11.2" y={cy - 1} width="1.6" height="2" rx="0.4" fill="#6b7078" />
              <rect x="35.2" y={cy - 1} width="1.6" height="2" rx="0.4" fill="#4c5158" />
            </g>
          ))}
          <BarHandle x={21.1} y={17} h={13} />
          <BarHandle x={25.4} y={17} h={13} />
          <line x1="24" y1="12.6" x2="24" y2="43.2" stroke="#14171a" strokeWidth="0.8" />
          <BrandPlate x={14} y={39.6} w={6.4} h={2} />
          <rect x="11" y="43.4" width="26" height="2.6" rx="0.6" fill={`url(#${GID}-recess)`} />
          <rect x="14.4" y="45.6" width="1.8" height="1.6" rx="0.3" fill="#41464c" />
          <rect x="31.8" y="45.6" width="1.8" height="1.6" rx="0.3" fill="#41464c" />
        </svg>
      );

    case "dishwasher":
      return (
        <svg {...svg}>
                    {shadow}
          <line x1="7" y1="6" x2="41" y2="6" stroke="#c9922f" strokeWidth="0.6" strokeDasharray="2 2.4" opacity="0.4" />
          <Body x={9} y={10} w={30} h={35} />
          <rect x="9" y="10" width="30" height="6" rx="3" fill={`url(#${GID}-recess)`} />
          <rect x="12" y="11.9" width="7.5" height="2.3" rx="0.5" fill="#0f1011" />
          <rect x="12.7" y="12.5" width="4" height="1.1" fill="#c9922f" opacity="0.9" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={28 + i * 3.4} cy="13" r="0.85" fill="#1b1c1e" stroke="#787b81" strokeWidth="0.45" />
          ))}
          <rect x="11.4" y="18.4" width="25.2" height="24.4" rx="1.2" fill={`url(#${GID}-recess)`} opacity="0.42" />
          <rect x="11.4" y="18.4" width="25.2" height="24.4" rx="1.2" fill={`url(#${GID}-grain)`} />
          <rect x="14.6" y="18.4" width="2" height="24.4" fill="#fff" opacity="0.06" />
          <BarHandle x={14.6} y={19.8} h={2.2} w={19.8} />
          <BrandPlate x={12.4} y={38} w={6.4} h={2} />
          <rect x="9" y="41.4" width="30" height="3.6" rx="1" fill={`url(#${GID}-recess)`} />
          <VentGrille x={26} y={41.9} w={10} rows={2} />
          <rect x="9" y="40" width="30" height="5" fill={`url(#${GID}-key)`} opacity="0.4" />
        </svg>
      );

    case "beverage":
      return (
        <svg {...svg}>
                    {shadow}
          <Body x={12} y={4} w={24} h={41} />
          <rect x="12" y="4" width="24" height="5.6" rx="2.8" fill={`url(#${GID}-recess)`} />
          <rect x="15" y="6" width="5.4" height="1.6" rx="0.4" fill="#c9922f" opacity="0.85" />
          <rect x="14.4" y="11.6" width="19.2" height="28.6" rx="1" fill="#141414" />
          <rect x="15.4" y="12.4" width="17.2" height="1" rx="0.5" fill="#c9922f" opacity="0.85" />
          <rect x="15.4" y="13.4" width="17.2" height="9" fill={`url(#${GID}-key)`} />
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
          <rect x="14.4" y="11.6" width="19.2" height="28.6" rx="1" fill={`url(#${GID}-glass)`} />
          <path d="M18.4 11.6 L22.4 11.6 L17.2 40.2 L14.4 40.2 Z" fill="#fff" opacity="0.07" />
          <rect x="14.4" y="11.6" width="19.2" height="28.6" rx="1" fill="none" stroke="#7c7f85" strokeWidth="0.9" />
          <BarHandle x={31.2} y={17} h={11} />
          <rect x="14.8" y="45" width="1.6" height="1.6" fill="#2a2b2e" />
          <rect x="31.6" y="45" width="1.6" height="1.6" fill="#2a2b2e" />
        </svg>
      );

    case "cooking":
      return (
        <svg {...svg}>
                    {shadow}
          <Body x={9} y={9} w={30} h={36} />
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
          <rect x="9" y="16" width="30" height="4.4" rx="1" fill={`url(#${GID}-recess)`} opacity="0.7" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={13 + i * 5.6} cy="18.2" r="1" fill="#1b1c1e" stroke="#83868c" strokeWidth="0.45" />
          ))}
          <rect x="11.2" y="23" width="25.6" height="18.4" rx="1.2" fill={`url(#${GID}-recess)`} opacity="0.5" />
          <rect x="13.6" y="26.6" width="20.8" height="11.4" rx="0.8" fill="#101112" />
          <rect x="13.6" y="26.6" width="20.8" height="11.4" rx="0.8" fill={`url(#${GID}-glass)`} />
          <path d="M17 26.6 L20 26.6 L15.6 38 L13.6 38 Z" fill="#fff" opacity="0.06" />
          <rect x="13.6" y="26.6" width="20.8" height="11.4" rx="0.8" fill="none" stroke="#71747a" strokeWidth="0.6" />
          <BarHandle x={13.2} y={23.4} h={2} w={21.6} />
          <rect x="9" y="41.4" width="30" height="3.6" rx="1" fill={`url(#${GID}-recess)`} />
        </svg>
      );

    case "laundry":
      return (
        <svg {...svg}>
                    {shadow}
          <Body x={11} y={5} w={26} h={40} />
          <rect x="11" y="5" width="26" height="7.4" rx="2.6" fill={`url(#${GID}-recess)`} />
          <circle cx="16.4" cy="8.7" r="2.2" fill="#1b1c1e" stroke="#8d9096" strokeWidth="0.55" />
          <line x1="16.4" y1="8.7" x2="16.4" y2="7" stroke="#c9922f" strokeWidth="0.7" />
          <rect x="22" y="7.4" width="11.4" height="2.6" rx="0.5" fill="#0f1011" />
          <rect x="22.7" y="8" width="4.6" height="1.3" fill="#c9922f" opacity="0.85" />
          <circle cx="24" cy="27.6" r="10.4" fill={`url(#${GID}-recess)`} />
          <circle cx="24" cy="27.6" r="10.4" fill="none" stroke="#83868c" strokeWidth="0.8" opacity="0.8" />
          <circle cx="24" cy="27.6" r="8" fill="#111213" />
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
          <BarHandle x={33.2} y={25.8} h={3.6} />
          <rect x="11" y="41.4" width="26" height="3.6" rx="1" fill={`url(#${GID}-recess)`} />
        </svg>
      );

    default:
      return (
        <svg {...svg}>
                    {shadow}
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
          <path d="M9 15 L24 22.5 L24 44.5 L9 40 Z" fill="#000" opacity="0.3" />
          <path d="M24 22.5 L39 15 L39 40 L24 44.5 Z" fill="#000" opacity="0.14" />
          <path d="M9 15 L24 22.5 L39 15" fill="none" stroke="#9a9da3" strokeWidth="0.7" opacity="0.75" />
          <line x1="24" y1="22.5" x2="24" y2="44.5" stroke="#9a9da3" strokeWidth="0.55" opacity="0.5" />
          <line x1="24" y1="7" x2="24" y2="3" stroke="#c9922f" strokeWidth="0.7" strokeDasharray="1.6 1.6" />
          <circle cx="24" cy="22.5" r="1.5" fill="#c9922f" opacity="0.85" />
        </svg>
      );
  }
}
