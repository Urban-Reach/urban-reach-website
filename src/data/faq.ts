import { otherServiceAreaSentence, site } from "@/data/site";

export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "What areas does Urban Reach® serve?",
    answer:
      `Urban Reach® serves ${site.city}, ${site.stateName} and the surrounding Central Texas region. Confirmed communities include ${otherServiceAreaSentence()}, among others. If a project sits elsewhere in the region, contact Urban Reach® directly to confirm coverage.`,
  },
  {
    question: "What types of commercial projects do you work with?",
    answer:
      "Urban Reach® provides appliance sourcing, procurement, and installation for the full range of commercial construction projects that general contractors take on, including multifamily developments, office buildouts, tenant improvements, and other interior finish work across the Austin area.",
  },
  {
    question: "What appliance brands does Urban Reach® source?",
    answer:
      "Urban Reach® is an authorized dealer for Samsung, Summit, GE/Haier, Fisher & Paykel, Champion, and BUNN. Beyond these core partner brands, Urban Reach® can source additional manufacturers as needed to meet a project's specific requirements.",
  },
  {
    question:
      "How early should a general contractor or architect involve Urban Reach® in a project?",
    answer:
      "The earlier, the better. Ideally, Urban Reach® is brought in as soon as the appliance or equipment schedule is available, so appliance selections can be aligned with project timelines and budgets from the start.",
  },
  {
    question: "Does Urban Reach® handle delivery and installation, or just one?",
    answer:
      "Both. Urban Reach® manages the full process from delivery through on-site installation as a single, coordinated service.",
  },
  {
    question: "Is there a minimum project size or order quantity?",
    answer:
      "No. Urban Reach® works with commercial projects of all scales within its service area.",
  },
  {
    question:
      "How can a general contractor or architect start working with Urban Reach®?",
    answer:
      "The best way to start is by reaching out directly through the contact form or via email at info@urbanreachtx.com.",
  },
  {
    question:
      "Does Urban Reach® work directly with property owners and developers, or only through general contractors?",
    answer:
      "Urban Reach® primarily partners with general contractors managing commercial projects, but also welcomes inquiries from architects, designers, developers, and commercial property owners.",
  },
];
