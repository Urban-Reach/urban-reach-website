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
  className,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger in ms. Keep small; long chains read as a template effect. */
  delay?: number;
  className?: string;
} & Record<string, unknown>) {
  const [ref, revealed] = useRevealOnce<HTMLElement>();

  return (
    <Tag
      ref={ref}
      data-reveal=""
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
/* Parallax — slow background drift                                            */
/* -------------------------------------------------------------------------- */

export function Parallax({
  children,
  speed = 0.14,
  className,
}: {
  children: ReactNode;
  /** Fraction of scroll distance. Small values only — this should be felt, not seen. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);

    const unsubscribe = subscribeToScroll(() => {
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const viewportCentre = window.innerHeight / 2;
      const elementCentre = rect.top + rect.height / 2;
      const offset = (elementCentre - viewportCentre) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });

    return () => {
      io.disconnect();
      unsubscribe();
    };
  }, [speed]);

  return (
    <div ref={ref} data-parallax="" className={className} aria-hidden="true">
      {children}
    </div>
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
/* useScrollProgress — 0..1 progress of an element through the viewport        */
/* -------------------------------------------------------------------------- */

/**
 * Drives the blueprint-to-reality transformation. Returns scroll-linked
 * progress, never a timer — the transformation only advances when the user
 * scrolls, so it reads as controlled rather than as an autoplaying animation.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    // Under reduced motion the CSS in globals.css already forces the resolved
    // end state — line art hidden, appliance shown unclipped — so no observer
    // or scroll listener is attached at all and progress stays at 0.
    if (!el || prefersReducedMotion()) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Track the element's CENTRE, not its top edge. Tracking the top makes
      // the object start resolving while only a sliver of it is on screen —
      // the viewer misses the blueprint state entirely. Measured from the
      // centre, roughly 60% of the object is visible before anything moves,
      // and it finishes fully resolved near the middle of the viewport.
      const centre = rect.top + rect.height / 2;
      const start = vh * 0.95;
      const end = vh * 0.42;
      const raw = (start - centre) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    // Deliberately NOT gated on an IntersectionObserver "is visible" flag.
    // Skipping the computation while off-screen leaves progress frozen at
    // whatever it was when the element last happened to be visible, so an
    // element scrolled far past still reports itself as unresolved. The clamp
    // above already yields the correct end value from position alone, and with
    // only a couple of instances per page the extra rect read per scroll frame
    // is not worth the stale state.
    const ro = new ResizeObserver(compute);
    ro.observe(el);

    const unsubscribe = subscribeToScroll(compute);

    return () => {
      ro.disconnect();
      unsubscribe();
    };
  }, []);

  return { ref, progress };
}
