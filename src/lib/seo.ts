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
      "Urban Reach is a commercial appliance supplier in Austin, TX — sourcing, delivering, and installing appliance packages for general contractors.",
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
    primary: "Samsung commercial appliance dealer Austin",
    title: "Samsung Commercial Appliance Dealer in Austin | Urban Reach",
    description:
      "An authorized Samsung commercial appliance dealer in Austin. Refrigeration, dishwashers, and beverage equipment for multifamily and office buildouts.",
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
    title: "Contact Urban Reach | Appliance Supplier in Austin, TX",
    description:
      "Contact Urban Reach for commercial appliance sourcing and installation in Austin, Pflugerville, Round Rock, Cedar Park, and Bee Cave. (737) 381-6621.",
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
    areaServed: site.serviceArea.map((city) => ({
      "@type": "City",
      name: `${city}, ${site.state}`,
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
