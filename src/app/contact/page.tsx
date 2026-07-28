import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { ContactForm } from "@/components/contact-form";
import { FaqList } from "@/components/faq-list";
import { PageHero } from "@/components/page-hero";
import {
  Container,
  JsonLd,
  Section,
  SectionHeading,
} from "@/components/ui";
import { serviceAreaSentence, site } from "@/data/site";
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
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          faqJsonLd(),
        ]}
      />

      <PageHero
        eyebrow="Contact"
        title="Talk to a commercial appliance supplier in Austin, TX"
        lead="Send an appliance schedule, ask a specification question, or start a conversation about an upcoming project. Inquiries reach us directly."
      />

      {/* Form + details */}
      <Section tone="charcoal" aria-labelledby="get-in-touch">
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
                    Fields marked with an asterisk are required. You can attach
                    an appliance schedule or plan sheets directly.
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
      <Section tone="walnut" aria-labelledby="areas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Where we work">
                {/* Generated from site.serviceArea so it can never drift out
                    of sync with the city list shown below it. */}
                <span id="areas">Serving {serviceAreaSentence()}</span>
              </SectionHeading>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-bone-dim">
                  Urban Reach serves {site.city}, {site.stateName} and the
                  surrounding communities. If your project sits just outside
                  this list, get in touch anyway — we would rather tell you
                  honestly than have you guess.
                </p>
              </Reveal>

              <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
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
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="charcoal" aria-labelledby="faq">
        <Container>
          <SectionHeading
            eyebrow="Questions"
            lead="The things general contractors and architects ask us most often."
          >
            <span id="faq">Frequently asked questions</span>
          </SectionHeading>

          <FaqList />
        </Container>
      </Section>
    </>
  );
}
