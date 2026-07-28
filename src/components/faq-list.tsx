import { faqs } from "@/data/faq";
import { Reveal } from "@/components/motion";

/**
 * FAQ list.
 *
 * Built on native <details>/<summary>: keyboard accessible and screen-reader
 * correct with no JS, and the answer text stays in the DOM so it is fully
 * crawlable. The same content is emitted as FAQPage structured data on the
 * Contact page.
 */
export function FaqList() {
  return (
    <ul className="mt-14 divide-y divide-rule border-y border-rule">
      {faqs.map((faq, i) => (
        <Reveal as="li" key={faq.question} delay={Math.min(i, 5) * 50}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 transition-colors duration-300 hover:text-amber [&::-webkit-details-marker]:hidden">
              <h3 className="font-display text-lg leading-snug sm:text-xl">
                {faq.question}
              </h3>
              <span
                aria-hidden="true"
                className="relative mt-2 block h-3 w-3 shrink-0"
              >
                <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-amber" />
                <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-amber transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
              </span>
            </summary>
            <p className="max-w-3xl pb-8 leading-relaxed text-bone-dim">
              {faq.answer}
            </p>
          </details>
        </Reveal>
      ))}
    </ul>
  );
}
