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
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOWNLOADS = '/Users/ms/Downloads';
// fileURLToPath, not URL.pathname — the project path contains spaces, which
// .pathname would leave percent-encoded.
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const SOURCES = {
  // Urban Reach reversed mark: white artwork on a painted dark checkerboard.
  urbanReach: join(DOWNLOADS, 'Gemini_Generated_Image_gmrraigmrraigmrr.png'),
  // Vendor marks: dark ink on genuine transparent backgrounds.
  vendors: {
    samsung: join(DOWNLOADS, 'samsung logo.png'),
    summit: join(DOWNLOADS, 'summit logo.png'),
    'ge-haier': join(DOWNLOADS, 'ge haier logo.png'),
    'fisher-paykel': join(DOWNLOADS, 'fisher paykal logo.webp'),
    bunn: join(DOWNLOADS, 'bunn logo.webp'),
    // MISSING ASSET: Champion. No logo file was supplied. Add the path here and
    // add the matching entry to src/data/brands.ts once the file arrives.
  },
};

// Luminance key tuned to the measured histogram of the supplied file:
// background checkerboard sits at L 0.13-0.44, artwork at L 0.94-1.0.
const KEY_LOW = 0.45;
const KEY_HIGH = 0.95;
// The AI sparkle watermark sits below the wordmark (which ends at y=1581).
// Everything at or below this row is forced fully transparent.
const WATERMARK_CUTOFF_Y = 1600;

const CHARCOAL = { r: 14, g: 14, b: 14, alpha: 1 }; // #0E0E0E

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

  // ---- Vendor marks -------------------------------------------------------
  // Each is dark ink on transparent (measured luminance 0.00-0.20), so they are
  // rendered on light chips in the UI rather than recolored. Recoloring a
  // manufacturer's mark would breach most dealer brand-usage guidelines.
  for (const [slug, src] of Object.entries(SOURCES.vendors)) {
    const trimmed = await trimToAlpha(sharp(src).ensureAlpha(), 4);
    await emit(trimmed, `brand/vendors/${slug}`, { width: 600 });
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
