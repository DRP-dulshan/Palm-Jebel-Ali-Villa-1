/**
 * Turns raw OpenStreetMap geometry into the projected, simplified SVG paths
 * used by the Location map. Run with: npm run map
 *
 * Inputs are Overpass JSON dumps kept in scripts/map-data/ so the build is
 * reproducible offline — re-fetch them only if the coastline changes.
 *
 * Output: content/map-paths.json
 *
 * Map data © OpenStreetMap contributors, ODbL.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DATA = path.join(process.cwd(), "scripts", "map-data");
const LEGEND_OUT = path.join(process.cwd(), "content", "map-legend.json");
const SVG_DIR = path.join(process.cwd(), "public", "images");

/* ---- Projection ------------------------------------------------------
 * Web Mercator, then fitted into a fixed viewBox. At Dubai's latitude the
 * distortion across this window is negligible, but using the real
 * projection keeps every marker where it actually is.
 * -------------------------------------------------------------------- */

// Window: Palm Jebel Ali through Downtown Dubai
const BOUNDS = { west: 54.80, east: 55.46, south: 24.88, north: 25.27 };
const VIEW = { w: 1600, h: 0 }; // height derived from the projection

const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

const yTop = mercY(BOUNDS.north);
const yBottom = mercY(BOUNDS.south);
const lonSpan = BOUNDS.east - BOUNDS.west;
const ySpan = yTop - yBottom;

VIEW.h = Math.round((VIEW.w * ySpan) / ((lonSpan * Math.PI) / 180));

const project = (lat, lon) => [
  ((lon - BOUNDS.west) / lonSpan) * VIEW.w,
  ((yTop - mercY(lat)) / ySpan) * VIEW.h,
];

const inBounds = (lat, lon) =>
  lon >= BOUNDS.west - 0.05 && lon <= BOUNDS.east + 0.05 &&
  lat >= BOUNDS.south - 0.05 && lat <= BOUNDS.north + 0.05;

/* ---- Simplification (Ramer–Douglas–Peucker) -------------------------- */

const perpDist = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const cx = ax + Math.max(0, Math.min(1, t)) * dx;
  const cy = ay + Math.max(0, Math.min(1, t)) * dy;
  return Math.hypot(px - cx, py - cy);
};

const simplify = (pts, tol) => {
  if (pts.length < 3) return pts;
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= tol) return [pts[0], pts[pts.length - 1]];
  return [
    ...simplify(pts.slice(0, idx + 1), tol).slice(0, -1),
    ...simplify(pts.slice(idx), tol),
  ];
};

/* Integer coordinates: one viewBox unit is under a pixel at render size,
   so the decimals were pure payload. */
const toPath = (pts, close) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${Math.round(x)} ${Math.round(y)}`).join("") +
  (close ? "Z" : "");

/* ---- Feature windows -------------------------------------------------
 * Bounding boxes used to pull the headline islands out of the coastline so
 * they can be styled separately.
 * -------------------------------------------------------------------- */

const REGIONS = {
  palmJebelAli:  { s: 24.93, n: 25.07, w: 54.91, e: 55.10 },
  palmJumeirah:  { s: 25.07, n: 25.16, w: 55.09, e: 55.20 },
  worldIslands:  { s: 25.18, n: 25.28, w: 55.11, e: 55.24 },
};

/*
 * Classify by centroid, not by "every point inside": stitching joins the
 * palm fronds into rings that stray a little outside a tight box, and an
 * all-points test silently dropped them into the generic land layer.
 */
const centroid = (geom) => {
  let lat = 0, lon = 0;
  for (const p of geom) { lat += p.lat; lon += p.lon; }
  return { lat: lat / geom.length, lon: lon / geom.length };
};

const within = (geom, r) => {
  const c = centroid(geom);
  return c.lat >= r.s && c.lat <= r.n && c.lon >= r.w && c.lon <= r.e;
};

/*
 * Rings come out of OSM wound either way. Concatenated into one path they
 * cancel under the nonzero fill rule and punch holes in the islands, so
 * every ring is forced to the same direction before it is emitted.
 */
const signedArea = (pts) => {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return a / 2;
};

const windSame = (pts) => (signedArea(pts) < 0 ? [...pts].reverse() : pts);

/* ---- Build ----------------------------------------------------------- */

const coast = JSON.parse(await readFile(path.join(DATA, "coastline.json"), "utf8"));
const roads = JSON.parse(await readFile(path.join(DATA, "motorways.json"), "utf8"));

const out = {
  viewBox: `0 0 ${VIEW.w} ${VIEW.h}`,
  width: VIEW.w,
  height: VIEW.h,
  bounds: BOUNDS,
  land: "",
  shoreLines: [],
  coast: [],
  palmJebelAli: [],
  palmJumeirah: [],
  worldIslands: [],
  roads: [],
  attribution: "Map data © OpenStreetMap contributors",
};

/* ---- Stitch the coastline ------------------------------------------
 * OSM ships the coast as hundreds of disconnected open ways, which cannot
 * be filled directly — filling them raw produced spurious triangles across
 * the bay.
 *
 * Two passes over the same data:
 *   1. Everything stitched together, to get one honest land mass. The
 *      palms are joined to the shore by causeways here, so they end up
 *      inside the land polygon — which is fine, it is all land.
 *   2. The named islands stitched only against themselves, to get clean
 *      rings for the highlight layers drawn on top.
 * -------------------------------------------------------------------- */

const key = (p) => `${p.lat.toFixed(5)},${p.lon.toFixed(5)}`;
const isClosed = (g) => key(g[0]) === key(g[g.length - 1]);

const windowWays = coast.elements.filter(
  (w) => w.geometry?.length > 1 && w.geometry.some((p) => inBounds(p.lat, p.lon))
);
const dropped = coast.elements.length - windowWays.length;

/** Join ways head-to-tail until nothing else fits. */
const stitch = (ways) => {
  let chains = ways.map((g) => [...g]);
  for (let pass = 0; pass < 12; pass++) {
    const heads = new Map();
    chains.forEach((c, i) => {
      const k = key(c[0]);
      if (!heads.has(k)) heads.set(k, []);
      heads.get(k).push(i);
    });

    const consumed = new Set();
    let merged = false;
    for (let i = 0; i < chains.length; i++) {
      if (consumed.has(i)) continue;
      for (;;) {
        const tail = key(chains[i][chains[i].length - 1]);
        const j = (heads.get(tail) || []).find((x) => x !== i && !consumed.has(x));
        if (j === undefined) break;
        chains[i].push(...chains[j].slice(1));
        consumed.add(j);
        merged = true;
      }
    }
    chains = chains.filter((_, i) => !consumed.has(i));
    if (!merged) break;
  }
  return chains;
};

let kept = 0;

/* ---- Pass 1: the land mass ------------------------------------------ */

const allChains = stitch(windowWays.map((w) => w.geometry));
const rings = allChains.filter((c) => isClosed(c));
const open = allChains.filter((c) => !isClosed(c)).sort((a, b) => b.length - a.length);

/*
 * The coast enters the frame at the north-east and leaves at the
 * south-west, with Dubai to the south-east. Wrapping the open ends around
 * the frame's south-east corners turns that line into land.
 */
{
  const M = 200; // overshoot so the frame edge never shows
  const pts = simplify(open[0].map((p) => project(p.lat, p.lon)), 1.5);
  out.land = toPath(
    [...pts, [-M, VIEW.h + M], [VIEW.w + M, VIEW.h + M], [VIEW.w + M, -M]],
    true
  );
  kept++;
}

/*
 * Closed rings are islands and inland water edges. Anything smaller than a
 * couple of square units is invisible at render size and only costs bytes.
 */
const MIN_AREA = 6;
for (const ring of rings) {
  const pts = simplify(ring.map((p) => project(p.lat, p.lon)), 1.8);
  if (pts.length < 3 || Math.abs(signedArea(pts)) < MIN_AREA) continue;
  out.coast.push(toPath(windSame(pts), true));
  kept++;
}

/* Everything else is a creek or harbour wall — stroked, never filled. */
for (const g of open.slice(1)) {
  const pts = simplify(g.map((p) => project(p.lat, p.lon)), 1.4);
  if (pts.length > 1) out.shoreLines.push(toPath(pts, false));
}

/* ---- Pass 2: island highlights --------------------------------------
 * Stitched per region so the palms come out as complete rings rather than
 * being swallowed by the mainland chain through their causeways.
 * ------------------------------------------------------------------- */

for (const [region, tol] of [
  ["palmJebelAli", 0.28],
  ["palmJumeirah", 0.5],
  ["worldIslands", 2.2],
]) {
  const inRegion = windowWays
    .map((w) => w.geometry)
    .filter((g) => within(g, REGIONS[region]));

  for (const ring of stitch(inRegion)) {
    const pts = simplify(ring.map((p) => project(p.lat, p.lon)), tol);
    if (pts.length < 3 || Math.abs(signedArea(pts)) < 1.5) continue;
    out[region].push(toPath(windSame(pts), true));
  }
}

for (const way of roads.elements) {
  const g = way.geometry;
  if (!g || g.length < 2) continue;
  if (!g.some((p) => inBounds(p.lat, p.lon))) continue;
  const pts = simplify(g.map((p) => project(p.lat, p.lon)), 2.2);
  if (pts.length < 2) continue;
  out.roads.push(toPath(pts, false));
}

/* Merge the many short motorway segments into fewer path strings so the
   rendered DOM stays light. */
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size).join("")
  );
out.roads = chunk(out.roads, 40);
out.coast = chunk(out.coast, 25);
out.worldIslands = chunk(out.worldIslands, 60);
out.palmJumeirah = chunk(out.palmJumeirah, 25);
out.shoreLines = chunk(out.shoreLines, 30);


/* ---- Points of interest ---------------------------------------------
 * Projected here so the component never has to know about map maths.
 * Coordinates and drive times live in content/listing.ts.
 * ------------------------------------------------------------------- */

const { mapPoints, villaPin } = await import(
  pathToFileURL(path.join(process.cwd(), "content", "map-points.mjs")).href
);

out.points = mapPoints.map((pt) => {
  const [x, y] = project(pt.lat, pt.lon);
  if (x < 0 || x > VIEW.w || y < 0 || y > VIEW.h) {
    console.warn(`  ! "${pt.label}" falls outside the map frame`);
  }
  return { ...pt, x: Math.round(x), y: Math.round(y) };
});

{
  const [x, y] = project(villaPin.lat, villaPin.lon);
  out.villa = { ...villaPin, x: Math.round(x), y: Math.round(y) };
}

/* ---- Emit -----------------------------------------------------------
 * The geometry ships as a static SVG file rather than inline markup:
 * ~90KB of paths in the page HTML delayed the mobile LCP by 0.3s. The
 * file is lazy-loaded below the fold instead, and only the legend rows
 * are imported into the page.
 *
 * Two cuts: the full map with inline place labels for wide screens, and a
 * compact one without them for phones, where they would be illegible.
 * Only the matching file is fetched, via <picture media>.
 * ------------------------------------------------------------------- */

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const paths = (list, attrs) =>
  list.map((d) => `<path d="${d}" ${attrs}/>`).join("");

const svg = (withLabels) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${out.viewBox}" preserveAspectRatio="xMinYMid slice">
<rect width="${VIEW.w}" height="${VIEW.h}" fill="#15130f"/>
<defs><radialGradient id="g"><stop offset="0%" stop-color="#f47b49" stop-opacity=".3"/><stop offset="100%" stop-color="#f47b49" stop-opacity="0"/></radialGradient></defs>
<path d="${out.land}" fill="#2a2621"/>
${paths(out.coast, 'fill="#2a2621"')}
${paths(out.roads, 'fill="none" stroke="#6b645c" stroke-width="1.6" stroke-linecap="round" opacity=".7"')}
${paths([...out.worldIslands, ...out.palmJumeirah], 'fill="#39332c"')}
<circle cx="${out.villa.x}" cy="${out.villa.y}" r="230" fill="url(#g)"/>
${paths(out.palmJebelAli, 'fill="#f47b49"')}
${out.points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="11" fill="#efe9e0"/><text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="500" font-family="system-ui,sans-serif" fill="#1f1d1b">${p.n}</text>${
  withLabels
    ? `<text x="${p.align === "right" ? p.x + 19 : p.x - 19}" y="${p.y}" text-anchor="${p.align === "right" ? "start" : "end"}" dominant-baseline="central" font-size="15" font-family="system-ui,sans-serif" fill="#d9d2c7">${esc(p.label)}</text>`
    : ""
}`).join("")}
<circle cx="${out.villa.x}" cy="${out.villa.y}" r="28" fill="none" stroke="#f47b49" stroke-width="1.5" opacity=".5"/>
<circle cx="${out.villa.x}" cy="${out.villa.y}" r="8" fill="#fff"/>
<path d="M${out.villa.x - 20} ${out.villa.y - 20}L${LABEL.x + 150} ${LABEL.y + 30}L${LABEL.x} ${LABEL.y + 30}" fill="none" stroke="#f47b49" stroke-width="1.5" opacity=".85"/>
<text x="${LABEL.x}" y="${LABEL.y}" font-size="46" fill="#fff" font-family="Cormorant Garamond,Georgia,serif">${esc(villaPin.label)}</text>
<text x="${LABEL.x}" y="${LABEL.y + 22}" font-size="15" letter-spacing="2.6" font-family="system-ui,sans-serif" fill="#f47b49">${esc(villaPin.sub.toUpperCase())}</text>
</svg>`;

const LABEL = { x: out.villa.x - 175, y: out.villa.y - 215 };

await mkdir(SVG_DIR, { recursive: true });
await writeFile(path.join(SVG_DIR, "location-map.svg"), svg(true));
await writeFile(path.join(SVG_DIR, "location-map-compact.svg"), svg(false));

await mkdir(path.dirname(LEGEND_OUT), { recursive: true });
await writeFile(
  LEGEND_OUT,
  JSON.stringify({
    aspect: +(VIEW.w / VIEW.h).toFixed(3),
    points: out.points.map(({ n, label, minutes }) => ({ n, label, minutes })),
  }) + "\n"
);

const size = (
  (await readFile(path.join(SVG_DIR, "location-map.svg"), "utf8")).length / 1024
).toFixed(1);
console.log(`viewBox ${out.viewBox}`);
console.log(`land polygon     ${out.land.length} chars`);
console.log(`shore lines      ${out.shoreLines.length}`);
console.log(`islands          ${out.coast.length} chunks (${kept} features, ${dropped} outside window)`);

console.log(`palm jebel ali   ${out.palmJebelAli.length}`);
console.log(`palm jumeirah    ${out.palmJumeirah.length}`);
console.log(`world islands    ${out.worldIslands.length}`);
console.log(`road paths       ${out.roads.length}`);
console.log(`points           ${out.points.length}`);
console.log(`-> public/images/location-map.svg  (${size} KB)`);
