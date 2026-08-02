import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { ContactForm } from "@/components/contact-form";
import { FaqList } from "@/components/faq-list";
import { Hero } from "@/components/hero";
import { ServiceAreaTraverse } from "@/components/service-area-traverse";
import {
  Container,
  JsonLd,
  Section,
  SectionHeading,
  PageShell,
} from "@/components/ui";
import { site } from "@/data/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("contact");

/**
 * Contact.
 *
 * No map embed (§3) — there is no public street address to pin, so the service
 * area is given as text. No business hours anywhere on the site (§3).
 *
 * The FAQ block carries FAQPage structured data for long-tail capture, and the
 * answers are the client-supplied text verbatim.
 */
export default function ContactPage() {
  return (
    <PageShell rhythm="contact">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact & FAQs", path: "/contact" },
          ]),
          faqJsonLd(),
        ]}
      />

      <Hero
        page="contact"
        align="left"
        eyebrow="Contact & FAQs"
        headline="Talk to a commercial appliance supplier in Austin, TX"
        lead="Send an equipment schedule, ask a specification question, or open a conversation about an upcoming project. Inquiries reach us directly."
        primary={{ href: site.phoneHref, label: site.phone, plain: true }}
        secondary={{ href: site.emailHref, label: "Email us", plain: true }}
      />

      {/* Form + details */}
      <Section id="after-hero" space="base" tone="charcoal" aria-labelledby="get-in-touch">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Details */}
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Reach us">
                <span id="get-in-touch">Direct contact</span>
              </SectionHeading>

              <Reveal delay={100}>
                <address className="mt-10 space-y-8 not-italic">
                  <div>
                    <h3 className="label-caps text-bone-dim">Phone</h3>
                    <a
                      href={site.phoneHref}
                      className="link-underline mt-3 inline-block font-display text-2xl text-bone transition-colors hover:text-amber"
                    >
                      {site.phone}
                    </a>
                  </div>

                  <div>
                    <h3 className="label-caps text-bone-dim">Email</h3>
                    <a
                      href={site.emailHref}
                      className="link-underline mt-3 inline-block break-all font-display text-xl text-bone transition-colors hover:text-amber"
                    >
                      {site.email}
                    </a>
                  </div>

                  <div>
                    <h3 className="label-caps text-bone-dim">Based in</h3>
                    <p className="mt-3 font-display text-xl text-bone">
                      {site.city}, {site.state}
                    </p>
                  </div>
                </address>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-10 border-t border-rule pt-8">
                  <h3 className="label-caps text-bone-dim">Follow</h3>
                  <ul className="mt-4 flex gap-6">
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
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-8">
              <Reveal>
                <div className="rounded-lg border border-rule bg-charcoal-raised p-6 sm:p-10">
                  <h2 className="font-display text-2xl">Send an inquiry</h2>
                  <p className="mt-3 leading-relaxed text-bone-dim">
                    Fields marked with an asterisk are required. Equipment
                    schedules and plan sheets can be attached directly.
                  </p>
                  <div className="mt-8">
                    <ContactForm />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Service area — text only, no map embed */}
      <Section space="tight" tone="walnut" aria-labelledby="areas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Where we work">
                {/* Was "Serving Austin, Round Rock, Georgetown, Pflugerville,
                    Cedar Park, and Bee Cave" — the full list, verbatim. It read
                    as an exclusive one: those six towns and nowhere else, which
                    is not true.

                    The list was there for local search, but it is not carrying
                    that weight here. All six cities still appear in the page's
                    meta description, in the LocalBusiness areaServed structured
                    data on every page, in the FAQ, in the site footer sitewide,
                    and as labels on the map below. An H2 is a contributing
                    signal, not the load-bearing one, so accuracy wins. */}
                <span id="areas">Across Austin and the surrounding metro</span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                {/* Inclusive first, anchors second. Previously this led with
                    the six cities and treated everywhere else as an exception
                    at the end, which reinforced the reading the heading gave. */}
                <p className="text-lg leading-relaxed text-bone-dim">
                  Urban Reach works throughout {site.city} and the surrounding{" "}
                  {site.stateName} metro. The cities marked below are where we
                  work most often — they are not a boundary. If your project is
                  anywhere in the region, send it to us and we will give you a
                  direct answer either way.
                </p>
              </Reveal>

              {/* Two presentations of the same six cities, one shown at a
                  time.

                  The traverse needs width to work. Squeezed into a phone-width
                  column its labels render at about 10.5px — too small for what
                  is primary content on this page, and no amount of scaling fixes
                  it without the long labels clipping or colliding. So below sm
                  the plain list stays, which is legible at any width, and the
                  drawing takes over from sm up where it has room to breathe.

                  Only one is ever displayed, so the duplicated city names are
                  not announced twice; the SVG is a single labelled image to a
                  screen reader regardless. */}
              <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:hidden">
                {site.serviceArea.map((city, i) => (
                  <Reveal
                    as="li"
                    key={city}
                    delay={i * 60}
                    className="bg-walnut px-6 py-7"
                  >
                    <span className="font-display text-xl text-bone">
                      {city}
                    </span>
                    <span className="mt-1 block text-xs text-bone-dim">
                      {site.state}
                    </span>
                  </Reveal>
                ))}
              </ul>

              <div className="mt-10 hidden rounded-lg border border-rule px-5 py-6 sm:block sm:px-7 sm:py-8">
                <ServiceAreaTraverse />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section space="airy" tone="charcoal" aria-labelledby="faq">
        <Container>
          <SectionHeading
            eyebrow="Questions"
            lead="What general contractors and architects ask us most often."
          >
            <span id="faq">Frequently asked questions</span>
          </SectionHeading>

          <FaqList />
        </Container>
      </Section>
    </PageShell>
  );
}
