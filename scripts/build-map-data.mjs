import { readFileSync, writeFileSync } from 'node:fs';

// Geographic window: the service area with enough surrounding metro to read as
// a place. Aspect chosen so the cos(lat) correction comes out to plain
// normalisation, i.e. shapes are not horizontally stretched.
const LON0 = -98.25, LON1 = -97.35, LAT0 = 30.14, LAT1 = 30.76;
const W = 660, H = 528;

const px = ([lon, lat]) => [
  ((lon - LON0) / (LON1 - LON0)) * W,
  ((LAT1 - lat) / (LAT1 - LAT0)) * H,
];

/** Ramer-Douglas-Peucker in screen space. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const d2 = (p, a, b) => {
    const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
    const dx = x2 - x1, dy = y2 - y1;
    const L = dx * dx + dy * dy;
    let t = L ? ((x - x1) * dx + (y - y1) * dy) / L : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ex = x1 + t * dx - x, ey = y1 + t * dy - y;
    return ex * ex + ey * ey;
  };
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    let best = -1, bi = -1;
    for (let k = i + 1; k < j; k++) {
      const dd = d2(pts[k], pts[i], pts[j]);
      if (dd > best) { best = dd; bi = k; }
    }
    if (best > tol * tol) { keep[bi] = 1; stack.push([i, bi], [bi, j]); }
  }
  return pts.filter((_, i) => keep[i]);
}

const inWindow = ([lon, lat]) => lon >= LON0 - 0.3 && lon <= LON1 + 0.3 && lat >= LAT0 - 0.3 && lat <= LAT1 + 0.3;
const fmt = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const len = (pts) => pts.reduce((a, p, i) => i ? a + Math.hypot(p[0] - pts[i-1][0], p[1] - pts[i-1][1]) : 0, 0);

/* ---- counties ---- */
const COUNTY = { '48453': 'Travis', '48491': 'Williamson', '48209': 'Hays', '48021': 'Bastrop',
  '48055': 'Caldwell', '48053': 'Burnet', '48031': 'Blanco', '48287': 'Lee', '48299': 'Llano' };
const counties = [];
for (const f of JSON.parse(readFileSync('counties.json', 'utf8')).features) {
  if (!COUNTY[f.id]) continue;
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      const pts = simplify(ring.filter(inWindow).map(px), 1.1);
      if (pts.length > 3) counties.push({ name: COUNTY[f.id], core: f.id === '48453', d: fmt(pts) });
    }
  }
}

/* ---- water: the Colorado River, which widens into Lady Bird Lake, Lake
       Austin and Lake Travis. OSM carries these as one named waterway. ---- */
const water = [];
for (const e of JSON.parse(readFileSync('water.json', 'utf8')).elements) {
  if (!e.geometry) continue;
  const pts = simplify(e.geometry.map((g) => [g.lon, g.lat]).filter(inWindow).map(px), 0.8);
  if (pts.length > 2 && len(pts) > 6) water.push(fmt(pts));
}

/* ---- roads ----
   Two tiers. `spine` is I-35, drawn strongest because every address in Austin is
   described relative to it. `major` is everything else worth having: the other
   US and state highways plus the toll loops, which are what turn a sparse
   diagram into something that reads as a road network. Anything smaller becomes
   noise at this scale. */
const SPINE = ['I 35'];
const MAJOR = ['US 183', 'TX 71', 'US 290', 'TX 45', 'TX 130', 'Loop 1'];
const roads = { spine: [], major: [] };
const ROAD_FILES = ['roads.json', 'r290.json', 'r45.json', 'rmopac.json'];
const seen = new Set();
for (const file of ROAD_FILES) {
  let els;
  try { els = JSON.parse(readFileSync(file, 'utf8')).elements; } catch { continue; }
  for (const e of els) {
    if (!e.geometry || !e.tags?.ref || seen.has(e.id)) continue;
    seen.add(e.id);
    // Loop 111 must not be caught by a bare "Loop 1" substring test.
    const refs = e.tags.ref.split(';').map((r) => r.trim());
    const isSpine = refs.some((r) => SPINE.includes(r));
    const isMajor = refs.some((r) => MAJOR.some((m) => r === m || r === `${m} Toll`));
    if (!isSpine && !isMajor) continue;
    const pts = simplify(e.geometry.map((g) => [g.lon, g.lat]).filter(inWindow).map(px), 1.8);
    if (pts.length > 1 && len(pts) > 6) roads[isSpine ? 'spine' : 'major'].push(fmt(pts));
  }
}

/* ---- surrounding towns ----
   Context, and a correction. The section used to name six cities and read as if
   those were the only ones served. Showing the towns around them, unmarked and
   in a quieter tone, makes the region legible and makes the six read as anchors
   rather than as a boundary. */
const SERVICE = new Set(['Austin', 'Round Rock', 'Georgetown', 'Pflugerville', 'Cedar Park', 'Bee Cave']);
const towns = [];
for (const e of JSON.parse(readFileSync('places.json', 'utf8')).elements) {
  const name = e.tags?.name;
  if (!name || SERVICE.has(name)) continue;
  const [x, y] = px([e.lon, e.lat]);
  if (x < 8 || x > W - 8 || y < 8 || y > H - 8) continue;
  towns.push({ name, x: +x.toFixed(1), y: +y.toFixed(1) });
}

const out = { W, H, LON0, LON1, LAT0, LAT1, counties, water, roads, towns };
const json = JSON.stringify(out);
writeFileSync('map-data.json', json);
console.log('counties rings:', counties.length, '| water:', water.length,
  '| roads:', Object.entries(roads).map(([k, v]) => `${k}=${v.length}`).join(' '),
  '| towns:', towns.length,
  '| size:', (json.length / 1024).toFixed(1), 'KB');
