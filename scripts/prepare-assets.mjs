/**
 * Asset preparation pipeline — Urban Reach
 *
 * Run: node scripts/prepare-assets.mjs
 *
 * Reads the raw supplied brand files and emits web-optimized assets into public/.
 * This script is committed so the transform is reproducible and auditable rather
 * than being a one-off manual edit.
 *
 * PLACEHOLDER (see build prompt §11): the Urban Reach reversed mark was supplied
 * only as a raster PNG with a *painted* checkerboard (no real alpha channel) plus
 * an AI-generation sparkle watermark. This script recovers true transparency by
 * luminance-keying the pure-white mark and masking the watermark region. Replace
 * SOURCES.urbanReach with a true vector (SVG/AI/EPS) when one is available and
 * delete the keying step.
 */

import sharp from 'sharp';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOWNLOADS = '/Users/ms/Downloads';
// fileURLToPath, not URL.pathname — the project path contains spaces, which
// .pathname would leave percent-encoded.
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const SOURCES = {
  // Urban Reach reversed mark: white artwork on a painted dark checkerboard.
  urbanReach: join(DOWNLOADS, 'Gemini_Generated_Image_gmrraigmrraigmrr.png'),
  // Client-supplied hero photograph: a dark commercial kitchen lit warm.
  hero: join(DOWNLOADS, 'moody kitchen.png'),

  // Per-page hero photographs. OPTIONAL — each page falls back to a crop of the
  // panorama above if its file is absent. That fallback is why five pages
  // currently read as the same room repositioned: it IS the same photograph.
  // Drop a file at any of these paths and that page uses it instead,
  // cover-cropped to the hero frame. Nothing else needs changing.
  //
  // Wanted: landscape, 2000px wide or more, dark and warm-lit to match.
  heroPages: {
    about: join(DOWNLOADS, 'hero-about.png'),
    appliances: join(DOWNLOADS, 'hero-appliances.png'),
    process: join(DOWNLOADS, 'hero-process.png'),
    contact: join(DOWNLOADS, 'hero-contact.png'),
  },
  // Vendor marks. [slug, source, keyWhiteBackground] — same shape as
  // GC_SOURCES below. Samsung/Summit/GE-Haier/Fisher & Paykel/BUNN arrived with
  // genuine alpha. Champion arrived only on solid white (a 2560x940 source,
  // chosen over a supplied 320x320 transparent alternative because the mark is
  // flat, simple artwork — keying out white loses nothing here and the extra
  // resolution matters more), so it is keyed the same way Novo/Trimbuilt are.
  vendors: [
    ['samsung', join(DOWNLOADS, 'samsung logo.png'), false],
    ['summit', join(DOWNLOADS, 'summit logo.png'), false],
    ['ge-haier', join(DOWNLOADS, 'ge haier logo.png'), false],
    ['fisher-paykel', join(DOWNLOADS, 'fisher paykal logo.webp'), false],
    ['bunn', join(DOWNLOADS, 'bunn logo.webp'), false],
    ['champion', join(DOWNLOADS, '709814-Champion_Logo-scaled.jpg'), true],
  ],
};

// Luminance key tuned to the measured histogram of the supplied file:
// background checkerboard sits at L 0.13-0.44, artwork at L 0.94-1.0.
const KEY_LOW = 0.45;
const KEY_HIGH = 0.95;
// The AI sparkle watermark sits below the wordmark (which ends at y=1581).
// Everything at or below this row is forced fully transparent.
const WATERMARK_CUTOFF_Y = 1600;

const CHARCOAL = { r: 14, g: 14, b: 14, alpha: 1 }; // #0E0E0E
/** Brand off-white, #F2EDE6. Reversed marks are knocked out to this. */
const BONE = { r: 242, g: 237, b: 230 };

/**
 * General contractor marks. [slug, source, keyWhiteBackground]
 *
 * Only Structura arrived with a real alpha channel. Novo and Trimbuilt were
 * supplied on solid white, so the white is keyed out to recover the shape. The
 * files named "transparent" are NOT usable — they have a checkerboard painted
 * into the pixels and carry an AI-generation watermark.
 */
const GC_SOURCES = [
  ['structura', join(DOWNLOADS, 'structura logo.webp'), false],
  ['novo', join(DOWNLOADS, 'novo white bg.png'), true],
  // Replaced with a higher-resolution supplied file (800x200 vs. the earlier
  // 200x200 crop) — same white-bg treatment.
  ['trimbuilt', join(DOWNLOADS, '1611603050077.jpeg'), true],
];

async function out(...parts) {
  const p = join(PUBLIC, ...parts);
  await mkdir(dirname(p), { recursive: true });
  return p;
}

/**
 * Recover a real alpha channel from a white-on-dark raster.
 * Alpha is derived from luminance; RGB is forced to pure white so antialiased
 * edges carry no residue of the dark background they were composited against.
 */
async function keyWhiteMark(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const o = (y * width + x) * 4;
      const L =
        (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;

      let a = (L - KEY_LOW) / (KEY_HIGH - KEY_LOW);
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      if (y >= WATERMARK_CUTOFF_Y) a = 0;

      rgba[o] = 255;
      rgba[o + 1] = 255;
      rgba[o + 2] = 255;
      rgba[o + 3] = Math.round(a * 255);
    }
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } });
}

/**
 * Crop to the alpha bounding box, with optional uniform padding in px.
 * Returns a fresh sharp instance over a materialized PNG so that callers can
 * chain resize/format freely without hitting sharp's extract-vs-resize ordering.
 */
async function trimToAlpha(pipeline, pad = 0) {
  const { data, info } = await pipeline
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error('trimToAlpha: image is fully transparent');

  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const cropped = await pipeline
    .clone()
    .extract({
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    })
    .png()
    .toBuffer();

  return sharp(cropped);
}

/**
 * Recover an alpha channel from artwork supplied on a solid white background.
 * Alpha is derived from how far each pixel is from white, so antialiased edges
 * stay smooth instead of going jagged from a hard threshold.
 */
async function keyOutWhite(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    // Distance from white, normalised. 24 is roughly where JPEG-ish noise on a
    // white field stops and real ink begins.
    const lightest = Math.max(r, g, b);
    let a = (255 - lightest) / 255;
    a = a < 0.04 ? 0 : Math.min(1, a * 3.2);
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = Math.round(a * 255);
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/**
 * Emit a ONE-COLOUR REVERSED mark: the artwork's silhouette filled with the
 * brand off-white, preserving the original alpha.
 *
 * Why reversed rather than the original colours on a light chip: the brief
 * requires no visible box behind any logo, and every supplied mark is dark ink
 * intended for light backgrounds — placed as-is on #0E0E0E they are invisible.
 * A single-colour reversed version is the standard treatment for a partner row
 * on a dark ground, and most manufacturers publish one for exactly this case.
 *
 * Emitted under a "-reversed" filename rather than overwriting the original.
 * Overwriting kept the URL identical, so Next's image optimizer and the browser
 * HTTP cache both went on serving the old dark bytes. A distinct name makes the
 * change unmissable and cannot go stale on redeploy.
 *
 * PLACEHOLDER (§11): request each brand's official reversed/one-colour art from
 * their dealer portal and confirm the treatment against their usage guidelines
 * before publishing. This derives the reversed mark from the supplied art.
 */
async function emitReversed(pipeline, name) {
  const png = await pipeline.clone().png().toBuffer();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = BONE.r;
    rgba[i * 4 + 1] = BONE.g;
    rgba[i * 4 + 2] = BONE.b;
    rgba[i * 4 + 3] = data[i * 4 + 3];
  }

  const out640 = sharp(rgba, { raw: { width, height, channels: 4 } }).resize({
    width: 640,
    fit: 'inside',
    withoutEnlargement: false,
  });
  await out640.clone().png({ compressionLevel: 9 }).toFile(await out(name + '.png'));
  await out640.clone().webp({ quality: 92 }).toFile(await out(name + '.webp'));
}

async function emit(pipeline, name, { width } = {}) {
  const base = width ? pipeline.clone().resize({ width, fit: 'inside' }) : pipeline.clone();
  await base.clone().png({ compressionLevel: 9 }).toFile(await out(name + '.png'));
  await base.clone().webp({ quality: 92 }).toFile(await out(name + '.webp'));
}

async function main() {
  // ---- Urban Reach reversed mark -----------------------------------------
  const keyed = await keyWhiteMark(SOURCES.urbanReach);

  // Full stacked lockup: UR monogram + swoosh + "URBAN REACH" wordmark.
  const lockup = await trimToAlpha(keyed, 8);
  await emit(lockup, 'brand/urban-reach-lockup', { width: 1200 });

  // Small fixed-size variant for the header, footer and 404 mark.
  //
  // Those are rendered at 72-120 CSS px and never change size, so routing them
  // through next/image's responsive pipeline is counterproductive: it emits a
  // 15-entry srcset plus a preload hint whose chosen entry does not reliably
  // match the one the browser then uses, costing an extra request for no gain.
  // 360px covers the largest use (120px) at 3x DPR.
  await emit(lockup, 'brand/urban-reach-lockup-sm', { width: 360 });

  // Monogram only (artwork above the wordmark) for icons and compact marks.
  // Measured content bands: monogram y=425..1287, wordmark y=1436..1581.
  const monogramCrop = sharp(
    await keyed.clone().extract({ left: 0, top: 400, width: 2048, height: 940 }).png().toBuffer()
  );
  const monogram = await trimToAlpha(monogramCrop, 8);
  await emit(monogram, 'brand/urban-reach-monogram', { width: 800 });

  // ---- Icons --------------------------------------------------------------
  // Browser tabs and home screens need an opaque background: a white-on-
  // transparent mark is invisible against light-themed browser chrome.
  const monoBuf = await (await trimToAlpha(monogramCrop)).png().toBuffer();

  for (const size of [180, 192, 512]) {
    const inner = Math.round(size * 0.72);
    const badge = sharp({
      create: { width: size, height: size, channels: 4, background: CHARCOAL },
    }).composite([
      { input: await sharp(monoBuf).resize({ width: inner, height: inner, fit: 'inside' }).png().toBuffer(), gravity: 'center' },
    ]);
    const nameBySize = { 180: 'apple-touch-icon', 192: 'icon-192', 512: 'icon-512' };
    await badge.png({ compressionLevel: 9 }).toFile(await out(`${nameBySize[size]}.png`));
  }

  // Multi-resolution favicon.ico (16/32/48) built from the same badge.
  const icoSizes = [16, 32, 48];
  const pngs = [];
  for (const s of icoSizes) {
    const inner = Math.round(s * 0.78);
    pngs.push(
      await sharp({ create: { width: s, height: s, channels: 4, background: CHARCOAL } })
        .composite([
          { input: await sharp(monoBuf).resize({ width: inner, height: inner, fit: 'inside' }).png().toBuffer(), gravity: 'center' },
        ])
        .png({ compressionLevel: 9 })
        .toBuffer()
    );
  }
  await writeFile(join(PUBLIC, 'favicon.ico'), buildIco(icoSizes, pngs));

  // ---- Hero photography ---------------------------------------------------
  //
  // One supplied photograph, cropped five ways so each page gets its own
  // photographic moment rather than the same frame repeated. The source is a
  // 1774x887 panorama of a dark commercial kitchen, so different horizontal
  // regions genuinely read as different rooms: the range and hood line at the
  // left, the stainless reach-ins through the centre, the prep counters and
  // window wall at the right.
  //
  // Emitted at 2x the largest rendered width and slightly darkened at source,
  // so the CSS scrim on top has less lifting to do and the text contrast does
  // not depend on gradient stacking alone.
  const heroCrops = {
    // Home: the full room, centred.
    home: { left: 0, width: 1774 },
    // About: the range and hood line.
    about: { left: 0, width: 1050 },
    // Appliances: the stainless reach-ins.
    appliances: { left: 520, width: 1050 },
    // Process: prep counters and the window wall.
    process: { left: 724, width: 1050 },
    // Contact: a tighter read on the pass.
    contact: { left: 900, width: 874 },
  };

  // Filenames carry a content hash, and a manifest maps page -> filename.
  //
  // This is not premature optimisation, it is a bug fix. These files were
  // previously emitted at a fixed path, so replacing the photography changed the
  // bytes without changing the URL — and every browser and CDN that had already
  // cached `/_next/image?url=/hero/about.webp` went on serving the OLD picture
  // indefinitely. It cost real time to diagnose, twice. A hash in the name makes
  // a byte change a URL change, so a stale hero is now impossible.
  const manifest = {};

  for (const [name, crop] of Object.entries(heroCrops)) {
    // A dedicated photograph wins over the shared panorama crop. `cover` at the
    // hero's own 3:2 frame rather than `extract`, because a supplied image will
    // not be 1774x887 and cropping by absolute pixels would clip it arbitrarily.
    const dedicated = SOURCES.heroPages[name];
    const framed = () =>
      dedicated && existsSync(dedicated)
        ? sharp(dedicated).resize({ width: 2000, height: 1333, fit: 'cover', position: 'centre' })
        : sharp(SOURCES.hero)
            .extract({ left: crop.left, top: 0, width: crop.width, height: 887 })
            .resize({ width: 2000, withoutEnlargement: false });

    const full = await framed()
      // Only a light touch. The frame is brighter on the chrome and the window
      // wall than through the centre floor, but heavy source darkening made the
      // photograph read as a faint backdrop. Legibility is handled by the
      // focused scrim in hero.tsx instead, which is measured.
      .modulate({ brightness: 0.96, saturation: 0.97 })
      .webp({ quality: 74 })
      .toBuffer();

    const hash = createHash('sha1').update(full).digest('hex').slice(0, 8);
    const file = `${name}.${hash}.webp`;
    manifest[name] = file;
    await writeFile(await out(`hero/${file}`), full);

    // A tiny blurred version, inlined as the CSS placeholder so the hero never
    // flashes flat charcoal before the photo decodes.
    const tiny = await framed()
      .resize({ width: 20 })
      .modulate({ brightness: 0.96 })
      .blur(1.2)
      .webp({ quality: 40 })
      .toBuffer();
    await writeFile(
      join(PUBLIC, 'hero', `${name}.blur.txt`),
      `data:image/webp;base64,${tiny.toString('base64')}`,
    );
  }

  // Sweep out superseded hashes, so the folder holds exactly one file per page
  // rather than accumulating every crop ever generated.
  const keep = new Set(Object.values(manifest));
  for (const f of await readdir(join(PUBLIC, 'hero'))) {
    if (f.endsWith('.webp') && !keep.has(f)) await rm(join(PUBLIC, 'hero', f));
  }

  await writeFile(
    join(PUBLIC, 'hero', 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );

  // ---- General contractor marks -------------------------------------------
  //
  // Structura ships with a real alpha channel. Novo and Trimbuilt were supplied
  // only on solid white, so white is keyed out to recover the shape.
  for (const [slug, src, keyWhite] of GC_SOURCES) {
    let pipeline = sharp(src).ensureAlpha();
    if (keyWhite) pipeline = sharp(await keyOutWhite(src));
    const trimmed = await trimToAlpha(pipeline, 4);
    await emitReversed(trimmed, `brand/gc/${slug}-reversed`);
  }

  // ---- Vendor marks -------------------------------------------------------
  // Each is dark ink on either a genuine transparent background or solid
  // white, so each is emitted as a one-colour reversed mark for the dark UI.
  // See emitReversed.
  for (const [slug, src, keyWhite] of SOURCES.vendors) {
    let pipeline = sharp(src).ensureAlpha();
    if (keyWhite) pipeline = sharp(await keyOutWhite(src));
    const trimmed = await trimToAlpha(pipeline, 4);
    await emitReversed(trimmed, `brand/vendors/${slug}-reversed`);
  }

  console.log('Assets written to public/.');
}

/** Minimal ICO container around pre-encoded PNG frames. */
function buildIco(sizes, pngBuffers) {
  const count = sizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;
  for (let i = 0; i < count; i++) {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(pngBuffers[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += pngBuffers[i].length;
    entries.push(e);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
