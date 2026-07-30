/**
 * Single source of truth for every factual claim on the site.
 *
 * CONTENT INTEGRITY RULE (build prompt §7): every value here is traceable to
 * information explicitly confirmed by the client. Do not add years-in-business,
 * project counts, satisfaction percentages, testimonials, certifications, or
 * any other statistic to this file unless the client has confirmed it in
 * writing. If a stat is not confirmed, the site uses qualitative language.
 */

export const site = {
  name: "Urban Reach",
  legalName: "Urban Reach",
  tagline: "Austin's Partner in Commercial Appliance Fulfillment",

  phone: "(737) 381-6621",
  phoneHref: "tel:+17373816621",
  phoneE164: "+1-737-381-6621",

  email: "info@urbanreachtx.com",
  emailHref: "mailto:info@urbanreachtx.com",

  // No street address: there is no public showroom to pin.
  city: "Austin",
  state: "TX",
  stateName: "Texas",
  country: "US",

  /**
   * Confirmed service area. Do NOT broaden to statewide or national.
   *
   * Georgetown was added at the client's direction after the original brief.
   * It is the largest nearby city not already listed (~100k), sits directly
   * north of Round Rock, and the metro is officially designated the
   * "Austin–Round Rock–Georgetown, TX" MSA — so it reads as a natural part of
   * the same service radius rather than a reach.
   *
   * Anything referencing this list is generated from it. If a city is added or
   * removed, check src/data/faq.ts and src/lib/seo.ts, which also name the
   * cities in prose for search snippets.
   */
  serviceArea: [
    "Austin",
    "Round Rock",
    "Georgetown",
    "Pflugerville",
    "Cedar Park",
    "Bee Cave",
  ] as const,

  // Only these two are confirmed. No Facebook, X, or other platforms.
  social: {
    linkedin: "https://www.linkedin.com/in/urban-reach/",
    instagram: "https://www.instagram.com/urbanreach_tx/",
  },

  /**
   * DEPLOYMENT (build prompt §11): this build targets a staging URL first.
   * DNS cutover to urbanreachtx.com is a separate, deliberate step after
   * client review. Set NEXT_PUBLIC_SITE_URL per environment.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://urbanreachtx.com",
} as const;

/**
 * "Austin, Round Rock, Georgetown, Pflugerville, Cedar Park, and Bee Cave"
 *
 * Use this anywhere the service area is written as prose, so headings and body
 * copy stay in sync with `site.serviceArea` automatically.
 */
export function serviceAreaSentence() {
  const cities = [...site.serviceArea];
  const last = cities.pop();
  return `${cities.join(", ")}, and ${last}`;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/appliances", label: "Appliances" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact & FAQs" },
] as const;

/**
 * Public-safe process. Deliberately omits internal software and platforms.
 */
export const processSteps = [
  {
    number: "01",
    title: "Review project specifications",
    body: "We begin with your appliance and equipment schedule. Each unit is verified against the specification, the opening it must occupy, and the date it must arrive — before anything is priced.",
  },
  {
    number: "02",
    title: "Source and price from manufacturer partners",
    body: "We source commercial-grade appliances through established manufacturer partnerships and return itemized pricing you can set directly against your budget.",
  },
  {
    number: "03",
    title: "Deliver and install on site",
    body: "Delivery and installation are a single coordinated scope, sequenced to your construction schedule so equipment arrives when the space is ready to receive it.",
  },
] as const;

/**
 * Approved "worked with" general contractors. FINAL LIST — do not add names.
 *
 * Each is rendered as a one-colour reversed mark (see emitReversed in
 * scripts/prepare-assets.mjs), knocked out to the brand off-white so it sits on
 * the dark ground with no box behind it.
 *
 * PLACEHOLDER (build prompt §11): these are derived from the supplied artwork,
 * not from official reversed art. Structura arrived with a real alpha channel;
 * Novo and Trimbuilt were supplied on solid white and had it keyed out. The
 * files named "transparent" are unusable — a checkerboard is painted into the
 * pixels and they carry an AI-generation watermark. Request official
 * reversed/one-colour art from each GC before publishing.
 */
/**
 * `opticalScale` works exactly as it does on `brands` in src/data/brands.ts —
 * a tempered equal-area normalisation, `(width / height) ** -0.4` divided by the
 * largest result, so no mark in the row dominates. See that file for the full
 * reasoning. These three are much closer in proportion than the manufacturer
 * marks, so the factors barely differ.
 */
export const generalContractors = [
  { name: "Structura", logo: "/brand/gc/structura-reversed", width: 640, height: 136, opticalScale: 0.86 },
  { name: "Trimbuilt", logo: "/brand/gc/trimbuilt-reversed", width: 640, height: 146, opticalScale: 0.89 },
  { name: "Novo", logo: "/brand/gc/novo-reversed", width: 640, height: 198, opticalScale: 1 },
] as const;
