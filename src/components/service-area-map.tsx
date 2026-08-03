/**
 * "Where we work" — a real Google My Maps embed of the service area.
 *
 * Replaces an illustrated map built from projected US Census and OpenStreetMap
 * geometry. The client created an accurate Google My Maps with pins for the
 * confirmed service area and asked for the real thing rather than an
 * illustration. See git history for the illustrated version if it is ever
 * needed again — it was a from-scratch dimetric/geographic renderer, not a
 * trivial rebuild.
 *
 * FRAMING
 * A Google Maps embed is a bright, light-coloured rectangle by default, and
 * this site has no light surfaces anywhere else — so it is deliberately
 * presented as an object sitting IN the dark page rather than a hole cut into
 * it:
 *
 *  - A bordered, padded card in the same vocabulary as `Card` in ui.tsx
 *    (rounded-lg, border-rule, generous padding), so it reads as one more
 *    piece of on-brand UI rather than a foreign embed.
 *  - A dark gradient scrim over the top ~15% of the map, fading from the
 *    card's own background down to fully transparent. Without it the dark
 *    card border met the bright map edge with a hard, jarring line; the scrim
 *    makes that edge a transition instead of a seam.
 *
 * INTERACTIVITY
 * The scrim is `pointer-events-none` specifically so it never intercepts a
 * drag or scroll over the top slice of the map — the embed must stay fully
 * pannable and zoomable everywhere, including under the scrim. Verified by
 * dragging and scrolling across that top band after implementation.
 *
 * RESPONSIVENESS
 * The frame is a CSS aspect-ratio box (4:3 on narrow screens, wider on sm+),
 * not a fixed pixel size — the iframe's own width="640" height="480"
 * attributes are overridden by className and exist only as a pre-CSS
 * fallback. An aspect-ratio box means the map never causes layout shift while
 * loading, at any viewport width, without the old padding-bottom-percentage
 * hack.
 *
 * PRIVACY
 * This embed loads Google's iframe and therefore sets Google's own cookies —
 * unlike the rest of this site, which sets none. src/app/privacy-policy's
 * "Analytics and cookies" section has been updated to disclose this; if this
 * component is ever removed, that section should be reverted too.
 */
export function ServiceAreaMap() {
  return (
    // bg-charcoal is solid, not /40, and that is load-bearing: the scrim below
    // is `from-charcoal` and has to match the card's actual rendered colour
    // exactly, or the map fades into a visibly different tone than the frame
    // around it right at the seam it is supposed to be hiding.
    <div className="mt-10 rounded-lg border border-rule bg-charcoal p-5 sm:p-7">
      <div className="relative overflow-hidden rounded-md">
        <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
          <iframe
            src="https://www.google.com/maps/d/u/5/embed?mid=1icOAdpZp4cFDA0rGeSqayg36y5meK78&ehbc=2E312F"
            title="Map of the Urban Reach service area across the Austin metro"
            className="h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Scrim. Matches the card's own background so the map appears to
            fade up out of the card rather than being cropped by it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-charcoal to-transparent sm:h-20"
        />
      </div>
    </div>
  );
}
