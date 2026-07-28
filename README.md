# Urban Reach — website

Marketing site for Urban Reach, a commercial appliance wholesale supplier and
fulfillment/installation company serving the Austin, TX metro.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

## Before this can go live

Three things are outstanding. The first two are blocking.

### 1. Wire up the contact form (blocking)

The form posts to `/api/contact`, which sends through Resend. Until
`RESEND_API_KEY` and `CONTACT_FROM` are set, valid submissions return a 500 and
the visitor is told to email `info@urbanreachtx.com` directly. See
`.env.example` for the exact steps.

Resend was chosen over Formspree because the form accepts **file attachments**
(appliance schedules, spec sections, plan sheets) — Formspree puts uploads
behind a paid plan. Keeping it server-side also means the API key never reaches
the browser and the honeypot is validated where a bot cannot skip it.

### 2. Supply the missing Champion logo (blocking for the brand grid)

Champion is a confirmed authorized brand but no logo file was ever supplied, so
the grid renders it as a typographic name cell while the other five show real
marks. To complete it:

1. Get the official mark from Champion's dealer/media portal.
2. Add the source path to `SOURCES.vendors` in `scripts/prepare-assets.mjs`.
3. Run `node scripts/prepare-assets.mjs`.
4. Set `logo: "/brand/vendors/champion"` in `src/data/brands.ts`.

### 3. Confirm vendor brand-usage guidelines

Before publishing, confirm how each manufacturer permits authorized dealers to
display their marks, and re-source the art from their official dealer portals.
The five current files came from general sources, not dealer portals.

Every vendor mark is dark ink on transparent, so all of them sit on light chips.
That is deliberate: recoloring a manufacturer's mark to survive the dark page
would breach most dealer guidelines, whereas the unmodified mark on a light
field does not.

---

## Assets

`scripts/prepare-assets.mjs` turns the raw supplied brand files into
web-optimized assets in `public/`. It is committed so the transform is
reproducible rather than a one-off manual edit.

The Urban Reach reversed logo needed real work. The supplied file had a
checkerboard *painted into the pixels* (no alpha channel at all) plus an
AI-generation sparkle watermark. The script recovers true transparency by
luminance-keying the pure-white artwork, forcing RGB to white so antialiased
edges carry no residue of the dark background, and masking the watermark region
below the wordmark.

**A true vector (SVG/AI/EPS) of the reversed mark should be sourced when
possible.** Everything derives from a 2048px raster today, so favicon and
touch-icon sizes show slightly softer edges than a vector would.

---

## Content rules

`src/data/site.ts` is the single source of truth for factual claims. Before
adding anything to it, read the comment at the top.

The site must not claim years in business, project counts, satisfaction
percentages, testimonials, or certifications. Urban Reach is roughly one year
old and holds no WBE/MBE status or bonding. Where confidence-building copy is
needed, it uses qualitative language rather than invented numbers.

Other standing constraints:

- Service area is Austin, Pflugerville, Round Rock, Cedar Park, Bee Cave. Never
  broaden to statewide or national.
- The Samsung authorized-dealer claim stays Austin-scoped.
- GC "worked with" list is exactly Structura, Trimbuilt, Novo — as a name row,
  never as case studies with project details.
- Authorized brands are exactly Samsung, Summit, GE/Haier, Fisher & Paykel,
  Champion, BUNN. Not Frigidaire/Electrolux, Whirlpool, LG, or Follett.
- No internal software or platforms named publicly.
- No business hours anywhere — there is no showroom to attach them to.
- LinkedIn and Instagram only. No other social accounts are confirmed.

---

## SEO

One primary long-tail phrase per page, mapped in `src/lib/seo.ts`. Retail head
terms are deliberately not targeted — those SERPs belong to Home Depot, Lowe's,
and Amazon.

| Page | Primary phrase |
| --- | --- |
| `/` | commercial appliance supplier Austin TX |
| `/about` | appliance package supplier for general contractors |
| `/appliances` | Samsung commercial appliance dealer Austin |
| `/process` | commercial appliance installation Austin |
| `/contact` | Austin + suburb geo cluster, FAQ long-tail |

`LocalBusiness` JSON-LD renders on every page; `FAQPage` on `/contact`;
`BreadcrumbList` per page. `sitemap.xml`, `robots.txt`, and the Open Graph image
are all generated at build time.

The phone number `(737) 381-6621` must stay identical to the Google Business
Profile for NAP consistency.

---

## Motion

`src/components/motion.tsx` holds hand-rolled primitives — no animation
library, which is what keeps the bundle small enough to hold the Core Web Vitals
targets.

The signature interaction is `BlueprintToReality`: a single appliance resolves
from amber technical linework into the finished unit, driven by scroll position
rather than a timer. It is scoped to **one isolated appliance, never a room or
interior** — Urban Reach installs appliances, it does not build spaces, and the
artwork must not imply otherwise.

Accessibility and robustness:

- Animated start states live behind `@media (prefers-reduced-motion: no-preference)`,
  so the reduced-motion fallback is pure CSS and correct from the first paint.
- A `<noscript>` block in the root layout pins the same elements to their
  resolved state, so the page is never a blank screen of `opacity: 0` sections
  if JS fails or is disabled. **If you add a new animated start state, add its
  `<noscript>` override too.**

---

## Imagery

There is no real jobsite or product photography yet. Rather than use generic
stock, the visual language is blueprint line-art and dark textured placeholders,
sized and positioned so real photos drop in without layout changes. Every such
spot is marked with a `PLACEHOLDER` comment.

The appliance "reality" states are in-house vector renders in
`src/components/appliance-art.tsx`. To swap in a real photo, replace the `Real`
component body with an `<Image>` at the same aspect ratio; the motion keeps
working unchanged.

---

## Deployment

Deploy to a **staging URL** for client review first. DNS cutover to
urbanreachtx.com is a separate, deliberate step — this build does not
automatically replace the live site.

```bash
npm run build
npx vercel deploy          # preview
npx vercel deploy --prod   # only after review and sign-off
```

Set `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`, and `NEXT_PUBLIC_SITE_URL`
in the Vercel project for every environment you deploy to.

Note: the privacy policy states that the site runs no analytics and sets no
tracking cookies. If that ever changes, update
`src/app/privacy-policy/page.tsx` in the same change.
