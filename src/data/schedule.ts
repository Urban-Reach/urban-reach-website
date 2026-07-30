/**
 * The equipment schedule shown in the homepage signature animation.
 *
 * SOURCE: a real Urban Reach bid sheet, supplied by the client as a screenshot.
 * The item tags, descriptions and model numbers are theirs, verbatim.
 *
 * DELIBERATELY OMITTED, and not to be added:
 *
 *  - The project name. The source sheet was headed with a named client project.
 *    Naming a client's job on a public marketing page is not ours to do.
 *  - Every price. The sheet carried unit costs, a subtotal, delivery and a
 *    total. Publishing real unit pricing hands competitors a margin reference
 *    and exposes what one client paid. The animation does not need it — the
 *    point being made is "you describe it, we return the exact model", and
 *    money is not part of that sentence.
 *
 * Both model numbers below belong to confirmed authorized brands: GDT225SSLSS is
 * GE Appliances, AL54SS is Summit. That is not a coincidence to preserve
 * casually — if these rows are ever changed, the models must still come from the
 * six brands in src/data/brands.ts, or the page implies a relationship that
 * does not exist.
 *
 * To extend this, ask the client for further real lines. Do NOT invent model
 * numbers, quantities or project scale to pad it out.
 */

export type ScheduleRow = {
  /** Item tag as it appears on the schedule, e.g. "EQ1". */
  tag: string;
  description: string;
  /** Manufacturer model number the tag was sourced to. */
  model: string;
};

export const scheduleRows: ScheduleRow[] = [
  { tag: "EQ1", description: "Dishwasher", model: "GDT225SSLSS" },
  { tag: "EQ3", description: "Under-counter refrigerator", model: "AL54SS" },
];
