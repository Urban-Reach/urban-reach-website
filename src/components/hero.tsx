import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Reveal, ScrollCue } from "@/components/motion";
import { Container } from "@/components/ui";

type Page = "home" | "about" | "appliances" | "process" | "contact";

function heroFile(page: Page) {
  const manifest = JSON.parse(
    readFileSync(join(process.cwd(), "public", "hero", "manifest.json"), "utf8"),
  ) as Record<Page, string>;
  return `/hero/${manifest[page]}`;
}

function blurFor(page: Page) {
  try {
    return readFileSync(join(process.cwd(), "public", "hero", `${page}.blur.txt`), "utf8");
  } catch {
    return undefined;
  }
}

export function Hero({
  page,
  eyebrow,
  wordmark,
  headline,
  lead,
  primary,
  secondary,
  align = "center",
}: {
  page: Page;
  eyebrow?: string;
  wordmark?: { name: string; tagline: string };
  headline?: ReactNode;
  lead?: ReactNode;
  primary?: { href: string; label: string; plain?: boolean };
  secondary?: { href: string; label: string; plain?: boolean };
  align?: "center" | "left";
}) {
  const isHome = page === "home";

  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden"
    >
      <HeroMedia page={page} align={align} />

      <Container className="relative z-10 w-full pb-28 pt-8 sm:pb-32 sm:pt-10">
        <div
          className={
            align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl mr-auto"
          }
        >
          {eyebrow && (
            <Reveal>
              <p
                className={`label-caps-lg text-amber ${
                  align === "center" ? "" : "flex items-center gap-4"
                }`}
              >
                {align !== "center" && (
                  <span aria-hidden="true" className="h-px w-10 bg-amber" />
                )}
                {eyebrow}
              </p>
            </Reveal>
          )}

          {wordmark && (
            <Reveal>
              <h1 className="flex flex-col items-center">
                <span className="font-display text-[clamp(2.5rem,min(10vw,14vh),7.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-bone">
                  {wordmark.name}
                  <sup className="ml-[0.06em] align-super text-[0.3em] font-normal tracking-normal">®</sup>
                </span>
                <span className="mt-5 max-w-2xl font-display text-[clamp(1rem,min(2.4vw,3.4vh),1.7rem)] leading-snug text-amber">
                  {wordmark.tagline}
                </span>
              </h1>
            </Reveal>
          )}

          {headline && (
            <Reveal delay={90}>
              <h1 className="mt-6 font-display text-[clamp(1.9rem,min(5.2vw,7.5vh),3.9rem)] leading-[1.04] tracking-[-0.025em]">
                {headline}
              </h1>
            </Reveal>
          )}

          {lead && (
            <Reveal delay={170}>
              <p
                className={`mt-7 text-lg leading-relaxed text-bone-dim sm:text-xl ${
                  align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"
                }`}
              >
                {lead}
              </p>
            </Reveal>
          )}

          {(primary || secondary) && (
            <Reveal delay={240}>
              <div
                className={`mt-11 flex flex-col gap-x-9 gap-y-5 sm:flex-row sm:items-center ${
                  align === "center" ? "items-center sm:justify-center" : "items-start"
                }`}
              >
                {primary && <PrimaryCta {...primary} />}
                {secondary && <SecondaryCta {...secondary} />}
              </div>
            </Reveal>
          )}
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 mix-blend-plus-lighter"
      >
        <div
          className="absolute inset-0"
          style={{
            background: isHome
              ? "radial-gradient(38% 26% at 34% 34%, rgba(201,146,47,0.30) 0%, rgba(201,146,47,0.10) 45%, transparent 74%)"
              : "radial-gradient(34% 30% at 16% 46%, rgba(201,146,47,0.24) 0%, rgba(201,146,47,0.08) 48%, transparent 76%)",
          }}
        />
        <div
          className="absolute inset-x-0"
          style={{
            top: isHome ? "31%" : "44%",
            height: isHome ? "9%" : "7%",
            background:
              "linear-gradient(to right, transparent 4%, rgba(238,214,166,0.14) 26%, rgba(255,247,232,0.20) 44%, rgba(238,214,166,0.10) 64%, transparent 92%)",
            filter: "blur(6px)",
          }}
        />
      </div>

      <ScrollCue />
    </section>
  );
}

function PrimaryCta({ href, label, plain }: { href: string; label: string; plain?: boolean }) {
  const cls =
    "label-caps-lg inline-flex items-center gap-3 rounded-full bg-amber px-8 py-4 text-charcoal transition-colors duration-300 hover:bg-bone";
  const inner = (
    <>
      {label}
      <span aria-hidden="true" className="text-base leading-none">
        →
      </span>
    </>
  );
  return plain ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function SecondaryCta({ href, label, plain }: { href: string; label: string; plain?: boolean }) {
  const cls =
    "label-caps-lg link-underline inline-flex items-center gap-2 text-bone transition-colors duration-300 hover:text-amber";
  const inner = (
    <>
      {label}
      <span aria-hidden="true" className="text-sm leading-none">
        ↗
      </span>
    </>
  );
  return plain ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function HeroMedia({ page, align }: { page: Page; align: "center" | "left" }) {
  const blur = blurFor(page);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image
        src={heroFile(page)}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-charcoal/28" />

      <div
        className={
          align === "center"
            ? "absolute inset-0 bg-[linear-gradient(to_top,rgba(14,14,14,0.9)_0%,rgba(14,14,14,0.4)_34%,rgba(14,14,14,0.14)_60%,rgba(14,14,14,0.6)_100%)]"
            : "absolute inset-0 bg-[linear-gradient(to_right,rgba(14,14,14,0.9)_0%,rgba(14,14,14,0.58)_40%,rgba(14,14,14,0.12)_76%,rgba(14,14,14,0.34)_100%)]"
        }
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            align === "center"
              ? "radial-gradient(52% 40% at 50% 44%, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.62) 52%, rgba(8,8,8,0.22) 78%, transparent 94%)"
              : "radial-gradient(56% 48% at 24% 60%, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.62) 50%, rgba(8,8,8,0.2) 76%, transparent 92%)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(126%_96%_at_50%_46%,transparent_42%,rgba(6,6,6,0.62)_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_bottom,transparent,var(--color-charcoal))]" />
    </div>
  );
}
