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
 * this site has no light surfaces anywhere else — so it is presented as an
 * object sitting IN the dark page: a bordered, padded card in the same
 * vocabulary as `Card` in ui.tsx (rounded-lg, border-rule, generous padding).
 *
 * A gradient scrim over the top of the map was tried and removed at the
 * client's direction — it visibly darkened map content, which read as a
 * defect rather than a transition. The border, radius and padding alone are
 * the separation now; do not reintroduce an overlay on top of the iframe.
 *
 * INTERACTIVITY
 * Nothing overlays the iframe, so it is pannable/zoomable edge to edge.
 * Verified after implementation: keyboard-panned between pins (opened a
 * marker's info card) and zoomed with +/-.
 *
 * RESPONSIVENESS
 * The frame is a CSS aspect-ratio box (4:3 on narrow screens, wider on sm+),
 * not a fixed pixel size — the iframe's own width="640" height="480"
 * attributes are overridden by className and exist only as a pre-CSS
 * fallback. Verified with no horizontal overflow at 390px wide.
 *
 * PRIVACY
 * This embed loads Google's iframe and therefore sets Google's own cookies —
 * unlike the rest of this site, which sets none. src/app/privacy-policy's
 * "Analytics and cookies" section discloses this; if this component is ever
 * removed, that section should be reverted too.
 */
export function ServiceAreaMap() {
  return (
    <div className="mt-10 overflow-hidden rounded-lg border border-rule bg-charcoal p-5 sm:p-7">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md sm:aspect-[16/10]">
        <iframe
          src="https://www.google.com/maps/d/u/5/embed?mid=1icOAdpZp4cFDA0rGeSqayg36y5meK78&ehbc=2E312F&noprof=1"
          title="Map of the Urban Reach service area across the Austin metro"
          className="h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
