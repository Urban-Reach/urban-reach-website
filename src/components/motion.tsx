"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Motion primitives — deliberately hand-rolled.
 *
 * No Framer Motion / GSAP / AOS. The whole set below is a few hundred bytes of
 * IntersectionObserver and one shared rAF scroll loop, which keeps the bundle
 * small enough to hold the Core Web Vitals targets (LCP < 2.5s, CLS < 0.1,
 * PSI mobile 85+) that a general-purpose animation library would put at risk.
 *
 * Every effect checks prefers-reduced-motion and bails out to a static resolved
 * state. globals.css enforces the same fallback in CSS as a second line of
 * defence, so a user with the setting on gets the finished composition even if
 * JS runs.
 */

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* -------------------------------------------------------------------------- */
/* Shared scroll loop                                                          */
/* -------------------------------------------------------------------------- */

type ScrollSubscriber = () => void;
const subscribers = new Set<ScrollSubscriber>();
let ticking = false;
let listening = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    // try/finally matters: without it, one throwing subscriber would leave
    // `ticking` stuck true and silently kill every scroll-driven effect on the
    // page for the rest of the session.
    try {
      subscribers.forEach((fn) => fn());
    } finally {
      ticking = false;
    }
  });
}

/**
 * One passive scroll listener and one rAF for the whole page, rather than one
 * per animated element.
 */
function subscribeToScroll(fn: ScrollSubscriber) {
  subscribers.add(fn);
  if (!listening) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    listening = true;
  }
  fn();

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && listening) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      listening = false;
    }
  };
}

/* -------------------------------------------------------------------------- */
/* Reveal manager                                                              */
/* -------------------------------------------------------------------------- */

/**
 * One shared IntersectionObserver for every reveal on the page, plus a scroll
 * sweep as a safety net.
 *
 * The sweep is not belt-and-braces paranoia — it fixes a real failure. An
 * IntersectionObserver only notifies when the intersection ratio *crosses* a
 * threshold. If an element enters and leaves the viewport between two
 * intersection computations — fast flick scrolling on mobile, an anchor jump,
 * browser scroll restoration on back-navigation — the ratio never registers as
 * crossing, no callback fires, and the element is stranded at opacity 0
 * forever. That was reproducible: scrolling a page in 500px steps left 12 of 23
 * sections permanently blank.
 *
 * So on each scroll frame we also reveal anything already past the trigger
 * line. `pending` drains to empty as elements reveal, and the sweep
 * unsubscribes itself at that point, so the steady-state cost is zero.
 */

const pending = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;
let sweepUnsubscribe: (() => void) | null = null;

/** Matches the observer's -12% bottom rootMargin. */
function triggerLine() {
  return window.innerHeight * 0.88;
}

function resolve(el: Element) {
  const cb = pending.get(el);
  if (!cb) return;
  pending.delete(el);
  sharedObserver?.unobserve(el);
  cb();

  if (pending.size === 0 && sweepUnsubscribe) {
    sweepUnsubscribe();
    sweepUnsubscribe = null;
  }
}

function sweep() {
  for (const el of Array.from(pending.keys())) {
    if (el.getBoundingClientRect().top < triggerLine()) resolve(el);
  }
}

function observeForReveal(el: Element, onReveal: () => void) {
  pending.set(el, onReveal);

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // The second clause catches elements already scrolled past, which is
          // the case a plain isIntersecting check misses.
          if (
            entry.isIntersecting ||
            entry.boundingClientRect.top < triggerLine()
          ) {
            resolve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
  }

  sharedObserver.observe(el);
  if (!sweepUnsubscribe) sweepUnsubscribe = subscribeToScroll(sweep);

  return () => {
    if (pending.has(el)) {
      pending.delete(el);
      sharedObserver?.unobserve(el);
    }
  };
}

/** Reveals once, then stops tracking. Returns [ref, revealed]. */
function useRevealOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // Under reduced motion, globals.css already pins this element to its
    // resolved state, so there is nothing to observe and no state to set.
    if (!el || prefersReducedMotion()) return;
    return observeForReveal(el, () => setRevealed(true));
  }, []);

  return [ref, revealed] as const;
}

/* -------------------------------------------------------------------------- */
/* Reveal — fade + slide-up on section entry                                   */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  from,
  className,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger in ms. Keep small; long chains read as a template effect. */
  delay?: number;
  /**
   * Direction the element arrives from. Pages use different values so the
   * motion signature is not identical everywhere — see the [data-reveal]
   * variants in globals.css.
   */
  from?: "up" | "left" | "right" | "rise";
  className?: string;
} & Record<string, unknown>) {
  const [ref, revealed] = useRevealOnce<HTMLElement>();

  return (
    <Tag
      ref={ref}
      data-reveal={from && from !== "up" ? from : ""}
      data-revealed={revealed ? "true" : "false"}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as object) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* DrawRule — amber divider that draws itself in                               */
/* -------------------------------------------------------------------------- */

export function DrawRule({
  className = "",
  width = 120,
}: {
  className?: string;
  width?: number;
}) {
  // Shares the reveal manager with <Reveal>, so it inherits the same
  // scrolled-past safety net rather than needing its own observer.
  const [ref, revealed] = useRevealOnce<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      data-draw=""
      data-revealed={revealed ? "true" : "false"}
      width={width}
      height="2"
      viewBox={`0 0 ${width} 2`}
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ "--draw-length": width } as object}
    >
      <line
        x1="0"
        y1="1"
        x2={width}
        y2="1"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* useB2RFallback — legacy path for the blueprint-to-reality effect            */
/* -------------------------------------------------------------------------- */

/**
 * The blueprint-to-reality effect is a CSS scroll-driven animation on a `view()`
 * timeline (see globals.css). Where that is supported it runs off the main
 * thread with no JavaScript at all, and this hook attaches nothing.
 *
 * This is only the fallback for browsers without scroll-driven animations. Two
 * rules it deliberately follows, both of which the previous React-state version
 * broke:
 *
 *   - It writes a CSS custom property straight to the element instead of
 *     calling setState. Per-frame setState re-rendered both appliance SVGs
 *     (~120 elements) on every scroll frame.
 *   - Nothing it touches carries a CSS transition. The old version had
 *     `transition: clip-path 120ms`, which meant the artwork permanently
 *     trailed the scroll by 120ms and every frame restarted the interpolation.
 *     That latency was the "lag" — not dropped frames.
 */
export function useB2RFallback<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion is resolved in CSS, and where view() timelines exist the
    // browser drives the whole thing. Either way, attach nothing.
    if (prefersReducedMotion()) return;
    if (
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline: view()")
    ) {
      return;
    }

    const write = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Same mapping as the CSS `cover 21% .. 55%` range: track the element's
      // CENTRE rather than its top edge, so roughly 60% of the object is
      // visible before anything moves and it finishes resolved near the middle
      // of the viewport.
      const centre = rect.top + rect.height / 2;
      const start = vh * 0.95;
      const end = vh * 0.42;
      const p = Math.min(1, Math.max(0, (start - centre) / (start - end)));

      el.style.setProperty("--b2r-p", p.toFixed(4));
      // Matches the b2r-edge-fade keyframes: present through the middle of the
      // wipe, absent at both ends.
      const edge = p <= 0 || p >= 1 ? 0 : Math.min(1, Math.min(p, 1 - p) / 0.12);
      el.style.setProperty("--b2r-edge-opacity", edge.toFixed(3));
    };

    // Not gated on an IntersectionObserver "is visible" flag: skipping the
    // computation while off-screen freezes the value at whatever it was when
    // the element was last visible, leaving something scrolled far past still
    // reporting itself unresolved. The clamp above already yields the correct
    // end value from position alone.
    const ro = new ResizeObserver(write);
    ro.observe(el);
    const unsubscribe = subscribeToScroll(write);

    return () => {
      ro.disconnect();
      unsubscribe();
    };
  }, []);

  return ref;
}
