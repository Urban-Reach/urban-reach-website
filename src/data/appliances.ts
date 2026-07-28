/**
 * Appliance categories.
 *
 * PLACEHOLDER (build prompt §11): kept general and expandable because a final
 * category list is not locked. Deliberately no SKUs, model numbers, capacities,
 * or exhaustive sub-lists — those would become wrong the moment the catalog
 * shifts. Add categories here and the /appliances grid picks them up.
 */

export type ApplianceCategory = {
  slug: string;
  title: string;
  body: string;
  /** Which of the hand-drawn blueprint glyphs to render for this category. */
  glyph: "refrigeration" | "dishwasher" | "beverage" | "cooking" | "laundry" | "specialty";
};

export const applianceCategories: ApplianceCategory[] = [
  {
    slug: "refrigeration",
    title: "Refrigeration",
    body: "Commercial and residential-grade refrigeration for unit kitchens, break rooms, and shared amenity spaces. Sized to the specification and the opening.",
    glyph: "refrigeration",
  },
  {
    slug: "dishwashers",
    title: "Dishwashers",
    body: "Under-counter and commercial dishwashing equipment for multifamily units, office pantries, and tenant kitchens. Matched to available utility rough-ins.",
    glyph: "dishwasher",
  },
  {
    slug: "beverage-equipment",
    title: "Beverage equipment",
    body: "Coffee brewers, beverage coolers, and related equipment for office amenity floors, lobbies, and shared common areas.",
    glyph: "beverage",
  },
  {
    slug: "cooking",
    title: "Cooking appliances",
    body: "Ranges, cooktops, wall ovens, microwaves, and ventilation for residential units and commercial break-room build-outs.",
    glyph: "cooking",
  },
  {
    slug: "laundry",
    title: "Laundry",
    body: "In-unit and common-area laundry equipment for multifamily developments, coordinated to stacked, side-by-side, or closet configurations.",
    glyph: "laundry",
  },
  {
    slug: "specialty",
    title: "Specialty and made-to-spec",
    body: "When a schedule calls for something outside these categories, we source it. Our authorized partnerships are the starting point, not the limit.",
    glyph: "specialty",
  },
];

/**
 * Project types Urban Reach serves. Used for the SEO-supporting sections and
 * kept aligned with the client-supplied FAQ answer on project types.
 */
export const projectTypes = [
  {
    title: "Multifamily developments",
    body: "Unit-count appliance packages for ground-up multifamily and mixed-use residential, delivered on a schedule that tracks your turnover sequence.",
  },
  {
    title: "Office buildouts",
    body: "Break rooms, pantries, and amenity floors for corporate office construction, specified to match the finish level of the surrounding space.",
  },
  {
    title: "Tenant improvements",
    body: "Appliance fulfillment for tenant improvement work, where the schedule is compressed and existing conditions determine what will fit.",
  },
  {
    title: "Interior finish work",
    body: "Appliance sourcing and installation within broader interior finish scopes, coordinated with the trades working alongside us.",
  },
] as const;
