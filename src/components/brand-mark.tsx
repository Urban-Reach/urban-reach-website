import { site } from "@/data/site";

/**
 * Urban Reach reversed lockup.
 *
 * Uses a plain <img> against a pre-sized 360px asset rather than next/image.
 * The mark renders at a fixed 72-120 CSS px in every location it appears, so it
 * needs no responsive variants — and next/image's pipeline actively hurt here:
 * it emitted a 15-entry srcset plus a preload hint whose selected entry did not
 * reliably match the one the browser used, costing an extra request per page
 * load for no benefit.
 *
 * width/height are set so the aspect ratio is known before load, which keeps
 * CLS at zero. `alt` is empty when the mark sits inside a link that already has
 * an accessible name, so screen readers don't announce it twice.
 *
 * PLACEHOLDER (build prompt §11): raster only. The supplied file had no real
 * alpha channel; scripts/prepare-assets.mjs recovers transparency by luminance-
 * keying the white artwork. Source a true vector (SVG/AI/EPS) when possible.
 */
export function BrandMark({
  className = "",
  decorative = false,
  eager = false,
}: {
  className?: string;
  /** Set when an ancestor link/element already supplies the accessible name. */
  decorative?: boolean;
  /** Above-the-fold placements should not lazy-load. */
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size mark; see above
    <img
      src="/brand/urban-reach-lockup-sm.webp"
      alt={decorative ? "" : `${site.name} logo`}
      width={360}
      height={240}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
