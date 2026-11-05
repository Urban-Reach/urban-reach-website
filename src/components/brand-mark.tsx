import { site } from "@/data/site";

export function BrandMark({
  className = "",
  decorative = false,
  eager = false,
}: {
  className?: string;
  decorative?: boolean;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/urban-reach-lockup-sm.webp"
      alt={decorative ? "" : `${site.name} logo`}
      width={360}
      height={240}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
