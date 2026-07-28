import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { nav, serviceAreaSentence, site } from "@/data/site";

/**
 * Site footer.
 *
 * No business hours anywhere (build prompt §3) — there is no showroom to attach
 * hours to. Social links are LinkedIn and Instagram only; no other accounts are
 * confirmed, and these must stay in sync with the Google Business Profile
 * "Profiles" section.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-walnut">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
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

          {/* Navigate */}
          <nav aria-label="Footer" className="md:col-span-3">
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

          {/* Contact */}
          <div className="md:col-span-4">
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

            <h2 className="label-caps mt-10 text-amber">Follow</h2>
            <ul className="mt-6 flex gap-6">
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm text-bone transition-colors hover:text-amber"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm text-bone transition-colors hover:text-amber"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Service area — geo signal, repeated in crawlable text */}
        <div className="mt-14 border-t border-rule pt-8">
          <p className="text-xs leading-relaxed text-bone-dim">
            <span className="label-caps text-bone">Service area — </span>
            Serving {serviceAreaSentence()}, {site.stateName}.
          </p>
          <p className="mt-4 text-xs text-bone-dim">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
