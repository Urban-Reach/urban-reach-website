"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ScrollSubscriber = () => void;
const subscribers = new Set<ScrollSubscriber>();
let ticking = false;
let listening = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    try {
      subscribers.forEach((fn) => fn());
    } finally {
      ticking = false;
    }
  });
}

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

const pending = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;
let sweepUnsubscribe: (() => void) | null = null;

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

function useRevealOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return observeForReveal(el, () => setRevealed(true));
  }, []);

  return [ref, revealed] as const;
}

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
  delay?: number;
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

export function DrawRule({
  className = "",
  width = 120,
}: {
  className?: string;
  width?: number;
}) {
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

export function useB2RFallback<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

      const centre = rect.top + rect.height / 2;
      const start = vh * 0.95;
      const end = vh * 0.42;
      const p = Math.min(1, Math.max(0, (start - centre) / (start - end)));

      el.style.setProperty("--b2r-p", p.toFixed(4));
      const edge = p <= 0 || p >= 1 ? 0 : Math.min(1, Math.min(p, 1 - p) / 0.12);
      el.style.setProperty("--b2r-edge-opacity", edge.toFixed(3));
    };

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

export function ScrollCue() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return subscribeToScroll(() => {
      const end = window.innerHeight * 0.18;
      const opacity = Math.max(0, 1 - window.scrollY / end);
      el.style.opacity = String(opacity);
      el.style.visibility = opacity === 0 ? "hidden" : "visible";
    });
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center transition-opacity duration-150 sm:bottom-10"
    >
      <a href="#after-hero" className="pointer-events-auto group flex flex-col items-center gap-3">
        <span className="label-caps text-bone-dim transition-colors duration-300 group-hover:text-amber">
          Scroll
        </span>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 bg-charcoal/35 backdrop-blur-sm transition-colors duration-300 group-hover:border-amber">
          <span aria-hidden="true" className="scroll-cue-arrow text-base leading-none text-amber">
            ↓
          </span>
        </span>
        <span className="sr-only">Skip to page content</span>
      </a>
    </div>
  );
}
