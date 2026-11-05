import type { Metadata } from "next";
import { site } from "@/data/site";
import { faqs } from "@/data/faq";

/**
 * Per-page SEO map.
 *
 * Strategy (build prompt §7): target realistic B2B long-tail phrases. Retail
 * head terms like "commercial appliances" or "wholesale appliances" are owned
 * by Home Depot / Lowe's / Amazon and are unwinnable, so they are deliberately
 * not targeted. Exactly one primary phrase per page — no stuffing every phrase
 * onto every page.
 */
export const PAGE_SEO = {
  // Titles are kept at or under 60 characters and descriptions under about 155,
  // so neither gets truncated in Google's result snippet.
  home: {
    path: "/",
    primary: "commercial appliance supplier Austin TX",
    title: "Commercial Appliance Supplier in Austin, TX | Urban Reach",
    description:
      "Urban Reach is a commercial appliance supplier in Austin, TX, sourcing, delivering, and installing appliance packages for general contractors.",
  },
  about: {
    path: "/about",
    primary: "appliance package supplier for general contractors",
    title: "Appliance Packages for General Contractors | Urban Reach",
    description:
      "Urban Reach is an appliance package supplier for general contractors in Austin, built around clear pricing and installation that tracks your schedule.",
  },
  appliances: {
    path: "/appliances",
    // The Samsung long-tail is still targeted, but through an H3 and body copy
    // rather than the title and H1. Urban Reach holds seven dealer relationships,
    // and leading with one manufacturer made the page read as Samsung-only.
    primary: "commercial appliance dealer Austin",
    title: "Commercial Appliance Dealer in Austin, TX | Urban Reach",
    description:
      "Authorized dealer for Samsung, Summit, GE/Haier, Fisher & Paykel, Champion, BUNN, and Sabre. Refrigeration, dishwashers, and beverage equipment across Austin.",
  },
  process: {
    path: "/process",
    primary: "commercial appliance installation Austin",
    title: "Commercial Appliance Installation in Austin | Urban Reach",
    description:
      "From spec review to on-site commercial appliance installation in Austin. Tenant improvement appliance fulfillment as one coordinated service.",
  },
  contact: {
    path: "/contact",
    primary: "commercial appliance supplier Austin service area",
    title: "Contact & FAQs | Urban Reach Appliance Supplier, Austin TX",
    // Naming all 8 confirmed cities pushes this past the ~155-char guideline
    // above (it runs ~170). That is a deliberate tradeoff, not an oversight:
    // the client wants every confirmed city named here for local search, and
    // Google frequently rewrites meta descriptions in the snippet anyway, so a
    // few characters of truncation risk costs less than dropping a confirmed
    // city would.
    description:
      "Urban Reach serves Austin, Round Rock, Pflugerville, Cedar Park, Bee Cave, West Lake Hills, Manchaca, and East Austin with commercial appliance sourcing and installation.",
  },
  privacy: {
    path: "/privacy-policy",
    primary: "privacy policy",
    title: "Privacy Policy | Urban Reach",
    description:
      "How Urban Reach handles information submitted through the contact form on this website.",
  },
} as const;

type PageKey = keyof typeof PAGE_SEO;

export function pageMetadata(key: PageKey): Metadata {
  const page = PAGE_SEO[key];
  const url = new URL(page.path, site.url).toString();

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: page.title,
      description: page.description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

/**
 * LocalBusiness structured data, rendered on every page.
 *
 * No streetAddress: Urban Reach has no public showroom address to pin, and
 * asserting one would break NAP consistency against the Google Business
 * Profile. No aggregateRating, no foundingDate, no numberOfEmployees — none of
 * those are confirmed, and inventing them would violate the content integrity
 * rule as well as Google's structured data policies.
 */
/**
 * schema.org @type override for service-area entries that are not themselves
 * incorporated municipalities. Everything not listed here defaults to "City".
 *
 * Manchaca is an unincorporated community (a Census-designated place), and
 * East Austin is a district within the City of Austin itself, not a separate
 * municipality — labelling either "City" would be a factual inaccuracy, and
 * this site treats an inaccurate label the same as an unconfirmed claim (see
 * the content-integrity rule in site.ts). "Place" is the correct generic
 * schema.org type for a named location that is not itself a municipality.
 * West Lake Hills IS an incorporated city, so it is not listed here.
 */
const AREA_TYPE: Partial<Record<(typeof site.serviceArea)[number], "City" | "Place">> = {
  Manchaca: "Place",
  "East Austin": "Place",
};

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    description: site.tagline,
    url: site.url,
    telephone: site.phoneE164,
    email: site.email,
    logo: `${site.url}/brand/urban-reach-lockup.png`,
    image: `${site.url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.state,
      addressCountry: site.country,
    },
    areaServed: site.serviceArea.map((area) => ({
      "@type": AREA_TYPE[area] ?? "City",
      name: `${area}, ${site.state}`,
    })),
    sameAs: [site.social.linkedin, site.social.instagram],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
}
