import type { Metadata } from "next";
import { site } from "@/data/site";
import { faqs } from "@/data/faq";

export const PAGE_SEO = {
  home: {
    path: "/",
    primary: "commercial appliance supplier Austin TX",
    title: "Commercial Appliance Supplier in Austin, TX | Urban Reach®",
    description:
      "Urban Reach® is a commercial appliance supplier in Austin, TX, sourcing, delivering, and installing appliance packages for general contractors.",
  },
  about: {
    path: "/about",
    primary: "appliance package supplier for general contractors",
    title: "Appliance Packages for General Contractors | Urban Reach®",
    description:
      "Urban Reach® is an appliance package supplier for general contractors in Austin, built around clear pricing and installation that tracks your schedule.",
  },
  appliances: {
    path: "/appliances",
    primary: "commercial appliance dealer Austin",
    title: "Commercial Appliance Dealer in Austin, TX | Urban Reach®",
    description:
      "Authorized dealer for Samsung, Summit, GE/Haier, Fisher & Paykel, Champion, and BUNN. Refrigeration, dishwashers, and beverage equipment across Austin.",
  },
  process: {
    path: "/process",
    primary: "commercial appliance installation Austin",
    title: "Commercial Appliance Installation in Austin | Urban Reach®",
    description:
      "From spec review to on-site commercial appliance installation in Austin. Tenant improvement appliance fulfillment as one coordinated service.",
  },
  contact: {
    path: "/contact",
    primary: "commercial appliance supplier Austin service area",
    title: "Contact & FAQs | Urban Reach® Appliance Supplier, Austin TX",
    description:
      "Urban Reach® serves Austin, Round Rock, Pflugerville, Cedar Park, Bee Cave, West Lake Hills, Manchaca, and East Austin with commercial appliance sourcing and installation.",
  },
  privacy: {
    path: "/privacy-policy",
    primary: "privacy policy",
    title: "Privacy Policy | Urban Reach®",
    description:
      "How Urban Reach® handles information submitted through the contact form on this website.",
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
      siteName: site.brand,
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
