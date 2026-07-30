import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { ApplianceGradientSprite } from "@/components/appliance-art";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/ui";
import { localBusinessJsonLd } from "@/lib/seo";
import { site } from "@/data/site";

/**
 * Fonts are self-hosted and preloaded by next/font — no render-blocking request
 * to Google's CDN, and no layout shift, which protects the CLS < 0.1 target.
 */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    // Each page supplies a complete, hand-written title; no boilerplate suffix.
    template: "%s",
  },
  description: site.tagline,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: true, address: false, email: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0E0E",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      /*
        REQUIRED — do not remove. globals.css sets `scroll-behavior: smooth` on
        <html> so the hero's scroll cue glides to the first section. Without this
        attribute, Next.js also routes its post-navigation scroll RESET through
        that smooth behaviour: clicking a nav link from partway down a long page
        animated the viewport across thousands of pixels of the NEW page over
        ~1.5s. Because sections reveal on scroll, everything in that band was
        still at opacity 0, so the new page looked blank and broken — it read as
        "the other pages don't work".

        This attribute tells Next to reset scroll instantly on route changes
        while leaving in-page anchor scrolling smooth.
        https://nextjs.org/docs/messages/missing-data-scroll-behavior
      */
      data-scroll-behavior="smooth"
    >
      <head>
        {/*
          Scroll-reveal start states live behind
          `@media (prefers-reduced-motion: no-preference)` in globals.css, and
          the IntersectionObserver that clears them needs JS. Without JS the
          elements would stay at opacity 0, so pin them to their resolved state
          here. Keep in sync with the animated start states in globals.css.
        */}
        <noscript>
          <style>{`
            [data-reveal]{opacity:1 !important;transform:none !important}
            [data-draw] path,[data-draw] line{stroke-dasharray:none !important;stroke-dashoffset:0 !important}
            [data-b2r-line]{opacity:0 !important}
            [data-b2r-real]{opacity:1 !important;clip-path:none !important}
            [data-schedule-cell],[data-schedule-model]{opacity:1 !important;letter-spacing:normal !important}
            [data-schedule-row]::after{transform:none !important}
          `}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-charcoal text-bone">

        {/* LocalBusiness structured data on every page (build prompt §7). */}
        <JsonLd data={localBusinessJsonLd()} />

        <a
          href="#main"
          className="label-caps-lg sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-amber focus:px-6 focus:py-3 focus:text-charcoal"
        >
          Skip to content
        </a>

        {/* Appliance glyph gradients, defined once for the whole document so
            the glyphs stay server components. See appliance-art.tsx. */}
        <ApplianceGradientSprite />

        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
