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

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally with the contact form working |
| `npm run build` | Production build |
| `npm run preview` | Builds a standalone review copy (see below) |
| `npm run assets` | Regenerates logos and icons from the raw brand files |

## Review copy for the client

`npm run preview` writes a self-contained folder beside the project —
`../Urban Reach Website Preview/` — containing every page plus a
double-click launcher for macOS. It's meant to be zipped and handed to someone
non-technical.

It deliberately does **not** open via `file://`. Browsers treat a `file://` page
as an opaque origin, so web fonts and ES modules are blocked by CORS, React
never hydrates, and every scroll-revealed section stays invisible. The folder
therefore ships a tiny zero-dependency Node static server and a `.command`
launcher that serves it over `localhost` instead. The contact form is inert in
the preview — there's no mail server behind it.

## Before this can go live

### Contact form — configured for local dev, not committed

The form posts to `/api/contact`, which sends through Resend. `RESEND_API_KEY`
and `CONTACT_FROM` live in `.env.local` (gitignored — never commit that file).
Anyone cloning fresh needs their own copy; see
[SETTING-UP-THE-CONTACT-FORM.md](SETTING-UP-THE-CONTACT-FORM.md) for a
non-technical walkthrough, or `.env.example` for the short version.

Currently sending from `onboarding@resend.dev` (Resend's shared sender), which
only delivers to the address that owns the Resend account and is more likely to
be filtered as spam. Once `urbanreachtx.com` is verified as a sending domain in
Resend, switch `CONTACT_FROM` to an address on that domain — see the setup doc,
Part 2.

Resend was chosen over Formspree because the form accepts **file attachments**
(appliance schedules, spec sections, plan sheets) — Formspree puts uploads
behind a paid plan. Keeping it server-side also means the API key never reaches
the browser and the honeypot is validated where a bot cannot skip it.

### Remaining before launch

Confirm how each manufacturer permits authorized dealers to display their
marks, and re-source the art from their official dealer portals. The six
current vendor files (Samsung, Summit, GE/Haier, Fisher & Paykel, Champion,
BUNN) and all three GC files (Structura, Trimbuilt, Novo) came from general
sources, not dealer/media portals.

### Logo treatment — read before changing it

Every supplied vendor and GC mark is dark ink intended for light backgrounds, so
on `#0E0E0E` they are invisible. They are emitted as **one-colour reversed
marks** — the silhouette knocked out to the brand off-white — and sit directly
on the dark ground with no chip or box behind them. That is the standard
treatment for a partner row on a dark field, and most manufacturers publish
reversed art for exactly this case.

Two things that will bite you:

- The reversed files are named `*-reversed.webp`. An earlier pass overwrote the
  original filenames, and because the URL was unchanged both Next's image
  optimizer and the browser HTTP cache went on serving the old dark bytes. If
  you regenerate logo art, **change the filename**.
- Marks are constrained on **both** axes inside a fixed-height cell. Capping
  height alone left Samsung roughly 2.7x wider than Summit at the same height,
  and the row read unevenly.

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

- Service area is Austin, Round Rock, Georgetown, Pflugerville, Cedar Park and
  Bee Cave. Never broaden to statewide or national. Georgetown was added at the
  client's direction after the original brief. Everything that names the cities
  in prose derives from `serviceAreaSentence()`, so add or remove cities in
  `site.serviceArea` only — but note `src/data/faq.ts` and `src/lib/seo.ts` also
  spell them out for search snippets and need a manual edit.
- The Samsung authorized-dealer claim stays Austin-scoped, and Samsung must not
  headline the Appliances page. Urban Reach holds six dealer relationships;
  leading with one manufacturer misrepresented the business as single-brand.
  The Samsung long-tail phrase is still targeted, via body copy rather than the
  title and H1.
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
| `/appliances` | commercial appliance dealer Austin (Samsung as a supporting phrase) |
| `/process` | commercial appliance installation Austin |
| `/contact` | Austin + suburb geo cluster, FAQ long-tail |

`LocalBusiness` JSON-LD renders on every page; `FAQPage` on `/contact`;
`BreadcrumbList` per page. `sitemap.xml`, `robots.txt`, and the Open Graph image
are all generated at build time.

The phone number `(737) 381-6621` must stay identical to the Google Business
Profile for NAP consistency.

---

## Section allocation — read before adding a section

The pages were audited for reuse. Each section now belongs to exactly one page,
and nothing is a reordered copy of another page's block. Current allocation:

| | Home | About | Appliances | Process | Contact |
| --- | --- | --- | --- | --- | --- |
| `TrustStrip` (logos only) | ✓ | | | | |
| `BrandGrid` (+ explanatory copy) | | | ✓ | | |
| `BlueprintToReality` | refrigeration | | dishwasher, beverage | | |
| Service area | | | | | ✓ (as contact info) |
| `CtaBand` | ✓ | | ✓ | ✓ | |

What was removed and why:

- **`ServiceArea` appeared on all five pages.** Deleted. The city list is
  contact information, so it lives on `/contact` only; the footer already
  carries a service-area line site-wide.
- **`ContractorRow` was on Home and About.** Deleted, folded into `TrustStrip`.
- **The appliance category card grid was identical on Home and Appliances.**
  Removed from Home. Home links through instead. This also stops the two pages
  competing for the same search phrase.
- **Process carried two `BlueprintToReality` instances that reused the
  refrigeration unit from Home and the dishwasher from Appliances** — the whole
  section was a reshuffle. Removed. Process stands on its three steps, tenant
  improvements, and what-to-send, all of which are unique to it.
- **About's Mission section was a lone centred heading with no body.** Its
  statement folded into the story copy and the section went away.
- **About's closing `CtaBand`** was replaced with a single inline link. The page
  already ends on an invitation; wrapping it in another
  eyebrow-heading-lead-button block was the padding this audit removed.

`TrustStrip` and `BrandGrid` share the same logo assets but are not the same
section: the strip is a bare recognition signal under the hero, while the
Appliances section's actual substance is the copy explaining what each
manufacturer covers.

**If a page lacks enough real content to justify a section, leave it out.** Do
not reintroduce a section from another page to make a page feel complete. About
is deliberately the leanest page on the site.

## Page composition — read before adding a page

`Hero` and `PageShell` exist so the site reads as one design language while each
page stays a distinct chapter. Colour and type are shared; **pace and
composition are not**.

- `PageShell rhythm="…"` selects the page's spacing and motion scale from the
  `[data-rhythm]` block in `globals.css` — section padding, reveal distance,
  duration and easing. Four different easing curves are defined; reusing one
  everywhere is a large part of what made the pages feel templated.
- `Hero composition="…"` picks the hero arrangement (`stamp`, `offset`,
  `editorial`, `anchored`, `compact`), which also moves the key light so each
  hero catches it from a different angle.
- `Section space="tight | base | airy"` steps off the page's base rhythm for
  local contrast. Pages use different sequences of these.
- `Reveal from="left | right | rise"` varies the arrival direction per page.
- Column splits differ per page (4/8, 5/7, 6/6) and Process flips the order.

If you add a page, give it a rhythm and a composition rather than copying
another page's section stack.

## Routing — do not remove `data-scroll-behavior`

`<html>` in `src/app/layout.tsx` carries `data-scroll-behavior="smooth"`. It is
load-bearing. `globals.css` sets `scroll-behavior: smooth` so the hero scroll cue
glides to the first section, but without this attribute Next also routes its
post-navigation scroll RESET through that smooth behaviour. Clicking a nav link
from partway down a long page then animated the viewport across thousands of
pixels of the new page over ~1.5s, and because sections reveal on scroll,
everything in that band was still at opacity 0 — the new page looked blank. It
presented as "the other pages don't work".

## Motion

`src/components/motion.tsx` holds hand-rolled primitives — no animation
library, which is what keeps the bundle small enough to hold the Core Web Vitals
targets.

The signature interaction is `BlueprintToReality`: a single appliance resolves
from amber technical linework into the finished unit, driven by scroll position
rather than a timer. It is scoped to **one isolated appliance, never a room or
interior** — Urban Reach installs appliances, it does not build spaces, and the
artwork must not imply otherwise.

**It is a CSS scroll-driven animation on a `view()` timeline, not JavaScript.**
Do not reintroduce a scroll handler for it. The original version called
`setState` on every scroll frame — re-rendering ~120 SVG elements per frame —
and put `transition: clip-path 120ms` on the layers, which meant the artwork
permanently trailed the scroll by 120ms and every frame restarted the
interpolation. That latency *was* the reported lag; it was not dropped frames.
Now the browser runs it off the main thread: measured at 6× CPU throttle,
median frame 8.3ms, p95 10.4ms, **zero frames over 32ms and zero long tasks**.
`useB2RFallback` covers browsers without scroll-driven animations by writing a
CSS custom property straight to the element — still no React re-render, still
no transition.

The `cover 21% .. 55%` animation range in `globals.css` is derived, not guessed;
the comment there shows the working.

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

The category glyphs in the same file are **not flat icons** and should not be
replaced with any. They read as brushed stainless: a cool silver/grey metallic
ramp (never flat black, never a single solid fill), a vertical brushed-grain
pattern overlay, a warm amber specular catch down the lit edge, and real
commercial hardware — bar-style pull handles with stand-off mounts, hinges,
control fascias with amber displays, louvred vent grilles, and model/brand
plates. Shared `BarHandle`, `BrandPlate` and `VentGrille` helpers keep those
details consistent. Highlights are deliberately warm, matching the site's amber
key light rather than a neutral studio white. Their gradients are defined once per document by
`ApplianceGradientSprite` in the root layout — per-instance defs would need
`useId`, which would make the whole module a client component and ship every
appliance SVG as JavaScript.

**Hero photography.** The client supplied one dark commercial kitchen
photograph. `scripts/prepare-assets.mjs` crops it five ways — the range and hood
line, the stainless reach-ins, the prep counters and window wall — so each page
gets its own photographic moment from a single source frame, and darkens it at
source.

`HeroMedia` in `hero.tsx` then layers a five-part scrim over it. The split is
deliberate: the layers covering the WHOLE frame are kept light so the
photograph reads as a present part of the hero, and the legibility work is
concentrated in layer 3, which only covers the text block. Lifting the global
tint alone washed the copy out; lifting it while tightening layer 3 makes the
image stronger AND the text no less readable.

Measured against the brightest pixel that ends up behind each block: wordmark
9.0:1, tagline 5.1:1, lead 5.0:1 — all clear WCAG AA. **Re-measure after
changing any of those numbers, and never place hero text on the raw image.**

Above the copy sits a **light bridge** — a warm bloom and a narrow sheen that
graze the wordmark so the type looks lit by the scene rather than pasted onto
it. It uses `mix-blend-plus-lighter`, which can only ADD light, so it
physically cannot reduce text contrast. It is also `pointer-events: none`, so
it cannot intercept clicks despite sitting at `z-20` above the CTAs.

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
