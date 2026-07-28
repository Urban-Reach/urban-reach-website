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
};

export const brands: Brand[] = [
  {
    slug: "samsung",
    name: "Samsung",
    logo: "/brand/vendors/samsung-reversed",
    width: 640,
    height: 104,
  },
  {
    slug: "summit",
    name: "Summit",
    logo: "/brand/vendors/summit-reversed",
    width: 640,
    height: 283,
  },
  {
    slug: "ge-haier",
    name: "GE Appliances, a Haier company",
    logo: "/brand/vendors/ge-haier-reversed",
    width: 640,
    height: 174,
  },
  {
    slug: "fisher-paykel",
    name: "Fisher & Paykel",
    logo: "/brand/vendors/fisher-paykel-reversed",
    width: 640,
    height: 104,
  },
  {
    slug: "champion",
    name: "Champion",
    // MISSING ASSET: the Champion mark was shown in conversation but never
    // supplied as a file, so there is nothing on disk to process. The brand is
    // a confirmed authorized relationship, so it is listed by name rather than
    // omitted or filled with a redrawn substitute.
    //
    // TO COMPLETE: save the official Champion logo to disk, add its path to
    // SOURCES.vendors in scripts/prepare-assets.mjs, run
    // `node scripts/prepare-assets.mjs`, then set logo to
    // "/brand/vendors/champion" and correct width/height to the emitted size.
    logo: null,
    width: 600,
    height: 160,
  },
  {
    slug: "bunn",
    name: "BUNN",
    logo: "/brand/vendors/bunn-reversed",
    width: 640,
    height: 122,
  },
];
