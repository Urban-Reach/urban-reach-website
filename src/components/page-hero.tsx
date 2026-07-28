import type { ReactNode } from "react";
import { Parallax, Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";

/**
 * Interior page hero.
 *
 * PLACEHOLDER (§11): the blueprint field stands in for real photography. The
 * container is sized so a real image can drop in behind the copy without any
 * layout change.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <Parallax speed={0.08} className="absolute inset-0 -top-16 h-[125%]">
        <div className="blueprint-grid h-full w-full" />
      </Parallax>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_45%,rgba(201,146,47,0.13),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-charcoal"
        aria-hidden="true"
      />

      <Container className="relative py-24 sm:py-28 lg:py-32">
        <div className="max-w-4xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={110}>
            <h1 className="mt-7 text-[2.25rem] leading-[1.1] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>

          {lead && (
            <Reveal delay={200}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone-dim">
                {lead}
              </p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
