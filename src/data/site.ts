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
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Public-safe process. Deliberately omits internal software and platforms.
 */
export const processSteps = [
  {
    number: "01",
    title: "Review project specifications",
    body: "We start with your appliance and equipment schedule. Every unit is checked against the spec, the space it has to fit, and the timeline it has to land in — before anything is priced.",
  },
  {
    number: "02",
    title: "Source and price from manufacturer partners",
    body: "We source commercial-grade appliances through trusted manufacturer partnerships and return clear, itemized pricing you can hold against your budget.",
  },
  {
    number: "03",
    title: "Deliver and install on site",
    body: "Delivery and installation are handled as one coordinated service, sequenced to your construction schedule so appliances arrive when the space is ready for them.",
  },
] as const;

/**
 * Approved "worked with" general contractors. FINAL LIST — do not add names.
 *
 * PLACEHOLDER (build prompt §11): only text/wordmark confirmation exists. The
 * spec directs a clean typographic name list until real logo files are supplied
 * by each GC. Logo images that were supplied were AI-regenerated approximations
 * carrying a generation watermark, which is not the same as the companies'
 * actual marks, so the typographic treatment stands.
 */
export const generalContractors = ["Structura", "Trimbuilt", "Novo"] as const;
