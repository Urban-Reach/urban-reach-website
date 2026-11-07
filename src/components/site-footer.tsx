import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { nav, otherServiceAreaSentence, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-walnut">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-x-12">
          <div className="col-span-2 md:col-span-5 md:row-span-2">
            <BrandMark className="h-14 w-auto" />
            <p className="mt-6 max-w-sm font-display text-lg leading-snug text-bone">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-dim">
              Commercial appliance sourcing, delivery, and installation for
              general contractors, architects, and designers building across the
              Austin metro.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:row-span-2">
            <h2 className="label-caps text-amber">Navigate</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm text-bone transition-colors hover:text-amber"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy-policy"
                  className="link-underline text-sm text-bone-dim transition-colors hover:text-amber"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>

          <div className="order-last col-span-2 md:order-none md:col-span-4">
            <h2 className="label-caps text-amber">Contact</h2>
            <address className="mt-6 flex flex-col gap-3 not-italic">
              <a
                href={site.phoneHref}
                className="link-underline w-fit text-sm text-bone transition-colors hover:text-amber"
              >
                {site.phone}
              </a>
              <a
                href={site.emailHref}
                className="link-underline w-fit text-sm text-bone transition-colors hover:text-amber"
              >
                {site.email}
              </a>
              <span className="text-sm text-bone-dim">
                {site.city}, {site.state}
              </span>
            </address>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <h2 className="label-caps text-amber">Follow</h2>
            <ul className="mt-6 flex flex-col gap-3 md:flex-row md:gap-6">
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-bone transition-colors hover:text-amber"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
                  <span className="link-underline">LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-bone transition-colors hover:text-amber"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.25"/><circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none"/></svg>
                  <span className="link-underline">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-rule pt-8">
          <p className="text-xs leading-relaxed text-bone-dim">
            <span className="label-caps text-bone">Service area:</span>{" "}
            {site.city}, {site.stateName} and the surrounding Central Texas
            region, including {otherServiceAreaSentence()}, among others.
          </p>
          <p className="mt-4 text-xs text-bone-dim">
            © {new Date().getFullYear()} {site.brand}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
