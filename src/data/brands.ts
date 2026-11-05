export type Brand = {
  slug: string;
  name: string;
  logo: string | null;
  width: number;
  height: number;
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
