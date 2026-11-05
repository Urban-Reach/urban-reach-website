/**
 * Authorized dealer brand relationships — CONFIRMED, FINAL LIST.
 *
 * Do NOT add Frigidaire/Electrolux, Whirlpool, LG, or Follett. Those are not
 * confirmed authorized relationships.
 *
 * PLACEHOLDER (build prompt §11): before publishing, confirm each brand's
 * dealer/partner brand-usage guidelines. Many manufacturers have specific rules
 * for how authorized dealers may display their marks. Logos should be sourced
 * from each brand's official media/dealer portal, not general web search.
 *
 * Every supplied mark is dark ink on a transparent background (measured
 * luminance 0.00–0.20), which is invisible against the #0E0E0E page. Each is
 * therefore emitted as a ONE-COLOUR REVERSED mark — the silhouette knocked out
 * to the brand off-white — so it sits directly on the dark ground with no box
 * behind it. This is the standard treatment for a partner row on a dark field,
 * and most manufacturers publish reversed art for exactly this case; request
 * theirs and confirm the treatment against their guidelines before publishing.
 */

export type Brand = {
  slug: string;
  name: string;
  /** Path under /public, without extension. Null when no file is supplied. */
  logo: string | null;
  /** Intrinsic dimensions of the prepared asset, for layout stability (CLS). */
  width: number;
  height: number;
  /**
   * Optical size factor, 0–1, multiplied against the row's --mark-h.
   *
   * Rendering every mark at one shared HEIGHT does not make a row look even,
   * because these six have wildly different proportions. Samsung is 6.2:1 and
   * Summit is 2.3:1, so at equal height Samsung covered 2.8x the area and
   * visibly dominated while Summit, GE and Champion read as undersized.
   *
   * These factors are a tempered equal-area normalisation:
   *
   *   scale = (width / height) ** -0.4, then divided by the largest result
   *
   * A full equal-area pass (exponent -0.5) over-corrects — it inflates the
   * stacked marks that carry a descriptor line ("APPLIANCE", "a Haier company")
   * until they tower over the plain wordmarks. -0.4 lands the area spread at
   * 1.22x across all six, against 2.76x at equal height.
   *
   * Recompute these if a logo asset is ever replaced at a different aspect
   * ratio. Do not hand-tune them individually.
   */
  opticalScale: number;
};

export const brands: Brand[] = [
  {
    slug: "samsung",
    name: "Samsung",
    logo: "/brand/vendors/samsung-reversed",
    width: 640,
    height: 104,
    opticalScale: 0.67,
  },
  {
    slug: "summit",
    name: "Summit",
    logo: "/brand/vendors/summit-reversed",
    width: 640,
    height: 283,
    opticalScale: 1,
  },
  {
    slug: "ge-haier",
    name: "GE Appliances, a Haier company",
    logo: "/brand/vendors/ge-haier-reversed",
    width: 640,
    height: 174,
    opticalScale: 0.82,
  },
  {
    slug: "fisher-paykel",
    name: "Fisher & Paykel",
    logo: "/brand/vendors/fisher-paykel-reversed",
    width: 640,
    height: 104,
    opticalScale: 0.67,
  },
  {
    slug: "champion",
    name: "Champion",
    logo: "/brand/vendors/champion-reversed",
    width: 640,
    height: 235,
    opticalScale: 0.93,
  },
  {
    slug: "bunn",
    name: "BUNN",
    logo: "/brand/vendors/bunn-reversed",
    width: 640,
    height: 122,
    opticalScale: 0.71,
  },
  {
    slug: "sabre",
    name: "Sabre",
    logo: "/brand/vendors/sabre-reversed",
    width: 640,
    height: 156,
    opticalScale: 0.79,
  },
];
