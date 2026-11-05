import type { Metadata } from "next";

import { ProcessJourney } from "@/components/process-journey";
import { Container, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sandbox — Process journey | Urban Reach",
  robots: { index: false, follow: false },
};

export default function SandboxProcessJourneyPage() {
  return (
    <main id="main">
      <Section tone="charcoal" space="tight">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              align="center"
              eyebrow="Sandbox"
              lead="Four isometric tiles, panned by scroll while the section is pinned. Scroll slowly — the truck drives and the unit lowers at the pace you set, so stopping halfway holds it halfway. On a narrow window the tiles stack instead of panning, which is what a phone gets."
            >
              Process journey — for review
            </SectionHeading>
          </div>
        </Container>
      </Section>

      <ProcessJourney />

      <Section tone="charcoal" space="tight">
        <Container>
          <p className="mx-auto max-w-2xl text-center leading-relaxed text-bone-dim">
            Nothing on this page is live on the site. The Austin skyline is drawn
            by eye from reference photography and still needs correcting against
            a real profile before it would be published.
          </p>
        </Container>
      </Section>
    </main>
  );
}
