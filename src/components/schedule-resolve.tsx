"use client";

import { useEffect, useRef, useState } from "react";
import { scheduleRows } from "@/data/schedule";

/**
 * Homepage signature animation — "the schedule resolves".
 *
 * WHAT IT DOES
 * On entering view, an equipment schedule builds itself a row at a time. Each
 * row's hairline draws left to right, the tag and description fade up behind it,
 * and then the model number resolves last: it arrives wide-tracked and dim and
 * tightens into place in amber.
 *
 * WHY THIS, AND NOT THE APPLIANCE ANIMATION
 * The spec-to-unit treatment now belongs to /appliances, where it illustrates
 * the products. The homepage needs to say something different, and the thing
 * worth saying is about the document rather than the equipment: a contractor
 * sends a description, and Urban Reach returns the exact model that satisfies
 * it. That is literally what the source bid sheet does, so the animation is a
 * demonstration rather than a decoration.
 *
 * The last beat is the model number for that reason — it is the answer, so it
 * lands last. An earlier version counted the quantity column up instead, which
 * was dropped once the real sheet arrived: its quantities are 1, and animating
 * a count from 0 to 1 is a flourish with nothing behind it.
 *
 * IMPLEMENTATION NOTES
 *  - One IntersectionObserver, fired once. The sequence is CSS keyframes with a
 *    per-row delay in a custom property, so nothing animates on the main thread
 *    and there is no per-frame React work.
 *  - `observerless` reduced-motion path: globals.css pins every part to its
 *    resolved state under `prefers-reduced-motion: reduce`, and the <noscript>
 *    override in the layout covers JS-off. In both cases the reader gets a
 *    complete, legible schedule — the content is never dependent on the motion.
 *  - Rendered as a real <table> with proper headers. It is tabular data, and a
 *    screen reader should get it as a table, not as a decorative animation.
 */
export function ScheduleResolve() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A plain threshold observer is not enough on its own: if the section is
    // scrolled past between two intersection computations — a flick scroll, an
    // anchor jump, restored scroll position on back-navigation — the ratio never
    // registers as crossing and the schedule stays half-drawn forever. So the
    // observer is paired with an immediate position check.
    const fire = () => setStarted(true);
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      fire();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          fire();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-schedule=""
      data-running={started ? "true" : "false"}
      className="rounded-lg border border-rule bg-charcoal/40 p-6 sm:p-8"
    >
      <p className="label-caps text-bone-dim">Equipment schedule</p>

      <table className="mt-7 w-full border-collapse text-left">
        <caption className="sr-only">
          Two lines from an equipment schedule, each shown with the manufacturer
          model number Urban Reach sourced against it.
        </caption>
        <thead>
          <tr className="label-caps text-bone-dim">
            <th scope="col" className="w-14 pb-3 font-normal">
              Item
            </th>
            <th scope="col" className="pb-3 font-normal">
              Description
            </th>
            <th scope="col" className="pb-3 text-right font-normal">
              Model
            </th>
          </tr>
        </thead>
        <tbody>
          {scheduleRows.map((row, i) => (
            <tr
              key={row.tag}
              data-schedule-row=""
              /* Row index drives every delay in the sequence, so the cascade is
                 one number rather than five hand-written offsets. */
              style={{ "--row": i } as object}
            >
              <th
                scope="row"
                data-schedule-cell=""
                className="py-5 font-mono text-sm font-normal text-amber"
              >
                {row.tag}
              </th>
              <td data-schedule-cell="" className="py-5 pr-4 text-bone">
                {row.description}
              </td>
              <td className="py-5 text-right">
                <span
                  data-schedule-model=""
                  className="font-mono text-sm text-amber"
                >
                  {row.model}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
