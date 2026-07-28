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
 * luminance 0.00–0.20), which is invisible against the #0E0E0E page. They are
 * therefore rendered on light chips in the UI. Recoloring a manufacturer's mark
 * to sit on dark would breach most dealer brand-usage guidelines; placing the
 * unmodified mark on a light field does not.
 */

export type Brand = {
  slug: string;
  name: string;
  /** Path under /public, without extension. Null when no file is supplied. */
  logo: string | null;
  /** Intrinsic dimensions of the prepared asset, for layout stability (CLS). */
  width: number;
  height: number;
};

export const brands: Brand[] = [
  {
    slug: "samsung",
    name: "Samsung",
    logo: "/brand/vendors/samsung",
    width: 600,
    height: 98,
  },
  {
    slug: "summit",
    name: "Summit",
    logo: "/brand/vendors/summit",
    width: 600,
    height: 265,
  },
  {
    slug: "ge-haier",
    name: "GE Appliances, a Haier company",
    logo: "/brand/vendors/ge-haier",
    width: 600,
    height: 163,
  },
  {
    slug: "fisher-paykel",
    name: "Fisher & Paykel",
    logo: "/brand/vendors/fisher-paykel",
    width: 600,
    height: 98,
  },
  {
    slug: "champion",
    name: "Champion",
    // MISSING ASSET: no Champion logo file has been supplied. The brand is a
    // confirmed authorized relationship, so it is listed by name rather than
    // omitted or filled with a substitute mark. Drop the prepared file at
    // public/brand/vendors/champion.{png,webp} and set this to
    // "/brand/vendors/champion" to complete the grid.
    logo: null,
    width: 600,
    height: 160,
  },
  {
    slug: "bunn",
    name: "BUNN",
    logo: "/brand/vendors/bunn",
    width: 600,
    height: 115,
  },
];
