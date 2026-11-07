import type { Metadata } from "next";

import { BrandMark } from "@/components/brand-mark";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found | Urban Reach®",
  description:
    "The page you were looking for could not be found. Return to the Urban Reach® homepage.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,146,47,0.12),transparent_62%)]"
        aria-hidden="true"
      />

      <Container className="relative flex min-h-[70vh] flex-col items-center justify-center py-28 text-center">
        <BrandMark eager className="h-20 w-auto" />

        <p className="label-caps-lg mt-14 text-amber">Error 404</p>

        <h1 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          This page isn&rsquo;t on the drawing
        </h1>

        <p className="mt-6 max-w-xl leading-relaxed text-bone-dim">
          The page you were looking for has moved or never existed. Everything
          else is still where it should be.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
