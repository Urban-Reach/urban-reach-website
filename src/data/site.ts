export const site = {
  name: "Urban Reach",
  legalName: "Urban Reach",
  brand: "Urban Reach®",
  tagline: "Austin's Partner in Commercial Appliance Fulfillment",

  phone: "(737) 381-6621",
  phoneHref: "tel:+17373816621",
  phoneE164: "+1-737-381-6621",

  email: "info@urbanreachtx.com",
  emailHref: "mailto:info@urbanreachtx.com",

  city: "Austin",
  state: "TX",
  stateName: "Texas",
  country: "US",

  serviceArea: [
    "Austin",
    "Round Rock",
    "Pflugerville",
    "Cedar Park",
    "Bee Cave",
    "West Lake Hills",
    "Manchaca",
    "East Austin",
  ] as const,

  social: {
    linkedin: "https://www.linkedin.com/in/urban-reach/",
    instagram: "https://www.instagram.com/urbanreach_tx/",
  },

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://urbanreachtx.com",
} as const;

export function serviceAreaSentence() {
  const cities = [...site.serviceArea];
  const last = cities.pop();
  return `${cities.join(", ")}, and ${last}`;
}

export function otherServiceAreaSentence(
  exclude: (typeof site.serviceArea)[number] = site.city,
) {
  const cities = site.serviceArea.filter((c) => c !== exclude);
  const last = cities.pop();
  return `${cities.join(", ")}, and ${last}`;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact & FAQs" },
] as const;

export const processSteps = [
  {
    number: "01",
    title: "Review project specifications",
    body: "We begin with your appliance and equipment schedule. Each unit is verified against the specification, the opening it must occupy, and the date it must arrive. Only then is anything priced.",
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

export const generalContractors = [
  { name: "Structura", logo: "/brand/gc/structura-reversed", width: 640, height: 136, opticalScale: 0.86 },
  { name: "Trimbuilt", logo: "/brand/gc/trimbuilt-reversed", width: 640, height: 146, opticalScale: 0.89 },
  { name: "Novo", logo: "/brand/gc/novo-reversed", width: 640, height: 198, opticalScale: 1 },
  { name: "Sabre", logo: "/brand/gc/sabre-reversed", width: 640, height: 156, opticalScale: 0.91 },
] as const;
