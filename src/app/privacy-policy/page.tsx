import type { Metadata } from "next";

import { Hero } from "@/components/hero";
import { Container, JsonLd, PageShell, Section } from "@/components/ui";
import { site } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("privacy");

/**
 * Privacy Policy.
 *
 * SCOPE (build prompt §3): states plainly and ONLY what is true — what is
 * collected (contact form submissions), how it is used (responding to
 * inquiries), that it is not sold, and who to contact with questions.
 *
 * DELIBERATELY ABSENT: any claim of CCPA, GDPR, or other regulatory
 * compliance; any certification; any guarantee Urban Reach cannot verify or
 * fulfil. Do not add those without verified legal advice — an unverifiable
 * compliance claim is a worse liability than no claim.
 *
 * The service-provider paragraph is deliberately more precise than a blanket
 * "we never share your data": email delivery and website hosting are performed
 * by vendors who necessarily process the submission. Saying otherwise would be
 * inaccurate, and accuracy is the governing instruction here.
 *
 * NOTE FOR FUTURE MAINTAINERS: this site runs no analytics and carries no
 * advertising pixels. It is NOT cookie-free, though: /contact embeds a Google
 * My Maps iframe (see ServiceAreaMap), which loads Google's own resources and
 * sets Google's own cookies on that page. The "Analytics and cookies" section
 * below discloses this narrowly and specifically — it does not claim the site
 * is cookie-free, and it must not be reworded back to that blanket claim while
 * the map embed is in place. If the map is ever removed, or if analytics or
 * advertising tracking is ever added, that section MUST be updated in the same
 * change.
 */
export default function PrivacyPolicyPage() {
  const updated = "July 27, 2026";

  return (
    <PageShell rhythm="contact">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />

      <Hero
        page="contact"
        align="left"
        eyebrow="Privacy Policy"
        headline="How Urban Reach handles information from this website"
        lead={`Last updated ${updated}.`}
      />

      <Section tone="charcoal">
        <Container>
          {/* Good-faith disclosure notice — required to be visible (§3). */}
          <div className="mb-14 rounded-lg border border-amber/40 bg-walnut p-6 sm:p-8">
            <h2 className="label-caps text-amber">Please note</h2>
            <p className="mt-4 leading-relaxed text-bone">
              This policy is provided as a good-faith disclosure of how Urban
              Reach handles information submitted through this website. It has
              not been reviewed by an attorney. Urban Reach recommends that a
              licensed Texas attorney review this page before it is relied upon
              as a legal document, and it should not be treated as legal advice
              or as a binding legal instrument in its current form.
            </p>
          </div>

          <div className="max-w-3xl space-y-12">
            <section aria-labelledby="what-we-collect">
              <h2 id="what-we-collect" className="font-display text-2xl">
                What we collect
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                The only personal information this website collects is what you
                choose to enter into the contact form. That may include your
                name, email address, company name, phone number, the project
                type you select, the message you write, and any files you
                attach.
              </p>
              <p className="mt-4 leading-relaxed text-bone-dim">
                You are not required to create an account, and there is no other
                point on this site where personal information is requested.
              </p>
            </section>

            <section aria-labelledby="how-we-use-it">
              <h2 id="how-we-use-it" className="font-display text-2xl">
                How we use it
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                We use the information you submit for one purpose: to read and
                respond to your inquiry, and to continue any conversation that
                follows from it. We do not use it to send marketing or
                promotional messages you did not ask for.
              </p>
            </section>

            <section aria-labelledby="sharing">
              <h2 id="sharing" className="font-display text-2xl">
                Who sees it
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                We do not sell your information, and we do not share it with
                third parties for their own marketing, advertising, or
                commercial purposes.
              </p>
              <p className="mt-4 leading-relaxed text-bone-dim">
                To be accurate rather than absolute: delivering a contact form
                submission necessarily involves the service providers that host
                this website and transmit the resulting email. Those providers
                process your submission only in order to deliver it to us, and
                not for any purpose of their own. Your message arrives in the
                Urban Reach {site.email} inbox and is read by the people who
                handle project inquiries.
              </p>
              <p className="mt-4 leading-relaxed text-bone-dim">
                We may also disclose information where we are legally required
                to do so.
              </p>
            </section>

            <section aria-labelledby="retention">
              <h2 id="retention" className="font-display text-2xl">
                How long we keep it
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                Contact form submissions arrive as email and are retained in our
                inbox as ordinary business correspondence. If you would like
                your inquiry and any attachments deleted, contact us at{" "}
                <a href={site.emailHref} className="link-underline text-amber">
                  {site.email}
                </a>{" "}
                and we will remove them.
              </p>
            </section>

            <section aria-labelledby="analytics">
              <h2 id="analytics" className="font-display text-2xl">
                Analytics and cookies
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                This website does not run analytics software and does not carry
                advertising or social media tracking pixels.
              </p>
              <p className="mt-4 leading-relaxed text-bone-dim">
                The Contact page embeds a Google Map to show our service area.
                Loading that map lets Google set its own cookies and collect
                usage data under{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="link-underline text-amber"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google&rsquo;s privacy policy
                </a>
                , which we do not control. No other page on this site sets any
                cookie.
              </p>
            </section>

            <section aria-labelledby="links">
              <h2 id="links" className="font-display text-2xl">
                Links to other sites
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                This site links to Urban Reach profiles on LinkedIn and
                Instagram. Those platforms have their own privacy practices,
                which we do not control and are not responsible for.
              </p>
            </section>

            <section aria-labelledby="changes">
              <h2 id="changes" className="font-display text-2xl">
                Changes to this policy
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                If how we handle information changes, we will update this page
                and revise the &ldquo;last updated&rdquo; date above.
              </p>
            </section>

            <section aria-labelledby="contact-privacy">
              <h2 id="contact-privacy" className="font-display text-2xl">
                Questions
              </h2>
              <p className="mt-4 leading-relaxed text-bone-dim">
                For any question about this policy or about information you have
                sent us, contact Urban Reach:
              </p>
              <address className="mt-6 space-y-2 not-italic">
                <p>
                  <a href={site.emailHref} className="link-underline text-amber">
                    {site.email}
                  </a>
                </p>
                <p>
                  <a href={site.phoneHref} className="link-underline text-bone">
                    {site.phone}
                  </a>
                </p>
                <p className="text-bone-dim">
                  {site.city}, {site.state}
                </p>
              </address>
            </section>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
