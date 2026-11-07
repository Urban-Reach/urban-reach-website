import Image from "next/image";
import { brands } from "@/data/brands";
import { generalContractors, site } from "@/data/site";
import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";

type Mark = {
  readonly name: string;
  readonly logo: string | null;
  readonly width: number;
  readonly height: number;
  readonly opticalScale: number;
};

const MARK_HEIGHTS = {
  gc: "[--mark-h:34px] sm:[--mark-h:44px] md:[--mark-h:50px] lg:[--mark-h:56px] xl:[--mark-h:62px]",
  vendor: "[--mark-h:30px] sm:[--mark-h:34px] md:[--mark-h:40px] xl:[--mark-h:46px]",
} as const;

function LogoRow({
  marks,
  variant,
  altSuffix = "",
}: {
  marks: readonly Mark[];
  variant: "gc" | "vendor";
  altSuffix?: string;
}) {
  return (
    <ul
      className={`mt-8 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-6 sm:mt-10 sm:gap-x-8 sm:gap-y-10 md:grid-cols-3 md:gap-x-10 xl:flex xl:flex-nowrap xl:justify-center xl:gap-x-6 ${MARK_HEIGHTS[variant]}`}
    >
      {marks.map((mark, i) => (
        <Reveal
          as="li"
          key={mark.name}
          delay={i * 60}
          className="flex h-12 shrink-0 items-center sm:h-16 [&:nth-child(2n+1):last-child]:col-span-2 md:[&:nth-child(2n+1):last-child]:col-span-1 md:[&:nth-child(3n+1):last-child]:col-start-2"
        >
          {mark.logo ? (
            <Image
              src={`${mark.logo}.webp`}
              alt={`${mark.name}${altSuffix}`}
              width={mark.width}
              height={mark.height}
              loading="lazy"
              sizes="(max-width: 640px) 45vw, 250px"
              style={{ height: `calc(var(--mark-h) * ${mark.opticalScale})` }}
              className="w-auto max-w-none object-contain opacity-75 transition-opacity duration-300 hover:opacity-100"
            />
          ) : (
            <span className="font-display text-xl text-bone/70">{mark.name}</span>
          )}
        </Reveal>
      ))}
    </ul>
  );
}

export function BrandGrid({ heading = true }: { heading?: boolean }) {
  return (
    <>
      {heading && (
        <SectionHeading
          align="center"
          eyebrow="Authorized dealer"
          lead="Urban Reach® holds authorized dealer relationships with the manufacturers below, and sources beyond them whenever a specification requires it."
        >
          Manufacturer partnerships, and the range to look beyond them
        </SectionHeading>
      )}

      <LogoRow marks={brands} variant="vendor" altSuffix=", authorized dealer" />
    </>
  );
}

export function TrustStrip() {
  return (
    <Section id="after-hero" tone="raised" space="tight" aria-labelledby="trust">
      <Container>
        <h2 id="trust" className="sr-only">
          General contractors we work with, and our authorized manufacturer
          partners
        </h2>

        <Reveal>
          <p className="label-caps text-center text-bone-dim">Working with</p>
        </Reveal>
        <LogoRow marks={generalContractors} variant="gc" />

        <div className="mt-10 border-t border-rule pt-10 sm:mt-16 sm:pt-16">
          <Reveal>
            <p className="label-caps text-center text-bone-dim">
              Authorized dealer for
            </p>
          </Reveal>
          <LogoRow marks={brands} variant="vendor" />
        </div>
      </Container>
    </Section>
  );
}

export function CtaBand({
  title = "Have an equipment schedule to price?",
  body = "Send it to us. We will review the specifications, source against them, and return pricing you can present to a client.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section tone="charcoal" className="relative overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading align="center" eyebrow="Get in touch" lead={body}>
            {title}
          </SectionHeading>

          <Reveal delay={140}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/contact">Contact Urban Reach®</ButtonLink>
              <a
                href={site.emailHref}
                className="label-caps-lg link-underline px-2 py-4 text-bone transition-colors hover:text-amber"
              >
                {site.email}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
