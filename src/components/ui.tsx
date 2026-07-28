import Link from "next/link";
import type { ReactNode } from "react";
import { DrawRule, Reveal } from "@/components/motion";

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  tone = "charcoal",
  className = "",
  ...rest
}: {
  children: ReactNode;
  /** Alternating section grounds create the vertical rhythm. */
  tone?: "charcoal" | "raised" | "walnut";
  className?: string;
} & React.ComponentPropsWithoutRef<"section">) {
  const tones = {
    charcoal: "bg-charcoal",
    raised: "bg-charcoal-raised",
    walnut: "bg-walnut",
  };

  return (
    <section
      className={`py-20 sm:py-28 ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <DrawRule width={40} className="shrink-0" />
      <p className="label-caps text-amber">{children}</p>
    </div>
  );
}

/**
 * Section heading. `as` keeps the document outline correct — the visual size is
 * independent of the heading level, so hierarchy is never sacrificed for looks.
 */
export function SectionHeading({
  eyebrow,
  children,
  lead,
  as: Tag = "h2",
  align = "left",
}: {
  eyebrow?: string;
  children: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : undefined}>
      {eyebrow && (
        <div className={align === "center" ? "flex justify-center" : undefined}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <Tag
        className={`mt-6 text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem] ${
          align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"
        }`}
      >
        {children}
      </Tag>
      {lead && (
        <p
          className={`mt-6 text-lg leading-relaxed text-bone-dim ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const base =
    "label-caps-lg inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 transition-all duration-300";

  const styles =
    variant === "primary"
      ? // #0E0E0E on #C9922F = 7.0:1
        "bg-amber text-charcoal hover:bg-bone focus-visible:bg-bone"
      : "glow-hover border border-rule text-bone hover:text-amber";

  const content = (
    <>
      {children}
      <span aria-hidden="true" className="text-base leading-none">
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${styles}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {content}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`glow-hover relative h-full rounded-lg border border-rule bg-charcoal p-8 ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                            */
/* -------------------------------------------------------------------------- */

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is our own static data, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
