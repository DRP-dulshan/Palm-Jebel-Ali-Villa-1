/**
 * Generates responsive WebP + JPEG fallbacks and blur placeholders from the
 * original listing renders, plus the logo, floor plans and DLD permit QR.
 * Run with: npm run images
 */
import sharp from "sharp";
import { mkdir, writeFile, copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const LISTING_DIR = "/Users/dulshansdrp/Desktop/Properties Photos/Tara's New listing";
const PLANS_DIR = path.join(LISTING_DIR, "Floor Plan");
const LOGO_SRC = "/Users/dulshansdrp/Desktop/LOGO/Archive/Logo white.png";
const FAVICON_SRC = "/Users/dulshansdrp/Desktop/LOGO/Favicon.png";
const NAKHEEL_SRC = "/Users/dulshansdrp/Downloads/Nakheel.png";
const QR_SRC = path.join(LISTING_DIR, "dld-permit-qr.jpeg");

const OUT_DIR = path.join(process.cwd(), "public", "images");
const PLANS_OUT = path.join(OUT_DIR, "floor-plans");
const WIDTHS = [480, 768, 1200, 1920];

/** source file -> clean slug used across the site */
const PHOTOS = [
  ["66ffc113dce9b37098b22bcc_02-BV-P Rendering - Exterior Beach-side.webp", "hero-beachfront"],
  ["66ffc11383039c8e62b0fa31_01-BV-P Rendering - Exterior Street-side.webp", "exterior-arrival"],
  ["66ffc1136b90f23cccc6812c_03-BV-P Rendering - Interior Living.webp", "living-room"],
  ["66ffc11374565849a268fe4e_04-BV-P Rendering - Interior Dining.webp", "dining-kitchen"],
  ["66ffc113c176a91c05d7fea9_05-BV-P Rendering - Interior Master Bedroom_M_REV02.webp", "master-bedroom"],
  ["66ffc1130528641dde15d928_06-BV-P Rendering - Interior Master Bathroom.webp", "master-bathroom"],
  ["66ffc11455ed27bfae623e8a_07-BV-P Rendering - Interior Multi-Purpose Area.webp", "family-room"],
  ["66ffc1137f3f95048107b738_08-BV-P Rendering - Interior Guest Bathroom_REV02.webp", "guest-bathroom"],
];

/**
 * Floor plans, identified from the area schedule printed on each sheet.
 * These stay out of the photo gallery and get their own section.
 *
 * Matched on a distinctive fragment rather than the full filename: the
 * originals are screenshots whose names contain a narrow no-break space.
 */
const PLANS = [
  ["11.31.55", "ground-floor"],
  ["11.31.45", "first-floor"],
  ["11.31.31", "second-floor"],
];

const planFiles = await readdir(PLANS_DIR);
const findPlan = (fragment) => {
  const hit = planFiles.find((f) => f.includes(fragment) && !f.startsWith("."));
  if (!hit) throw new Error(`No floor plan file matching "${fragment}" in ${PLANS_DIR}`);
  return hit;
};

await mkdir(OUT_DIR, { recursive: true });
await mkdir(PLANS_OUT, { recursive: true });

const meta = {};

/** 20px blurred data URI, used as a background while the real file loads */
const lqip = async (src) =>
  `data:image/webp;base64,${(
    await sharp(src).resize({ width: 20 }).blur(1.2).webp({ quality: 30 }).toBuffer()
  ).toString("base64")}`;

/* ---- Listing photography ------------------------------------------- */

for (const [file, slug] of PHOTOS) {
  const src = path.join(LISTING_DIR, file);
  const { width: w0, height: h0 } = await sharp(src).metadata();

  for (const w of WIDTHS) {
    if (w > w0) continue;
    await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 6 })
      .toFile(path.join(OUT_DIR, `${slug}-${w}.webp`));
    await sharp(src).resize({ width: w }).jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(path.join(OUT_DIR, `${slug}-${w}.jpg`));
  }

  // Open Graph / social preview crop
  if (slug === "hero-beachfront") {
    await sharp(src).resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUT_DIR, "og-wave-crest.jpg"));
  }

  meta[slug] = {
    width: w0,
    height: h0,
    widths: WIDTHS.filter((w) => w <= w0),
    blur: await lqip(src),
  };
  console.log(`✓ photo       ${slug}  ${w0}x${h0}`);
}

/* ---- Floor plans ----------------------------------------------------
 * Line drawings with fine text, so these are encoded LOSSLESSLY and kept
 * at their native pixel size — upscaling would only invent detail and
 * lossy compression smears the dimension text.
 *
 * Palette PNG beats lossless WebP on this kind of flat-colour artwork
 * (~53KB vs ~70KB here), so PNG is the only format emitted.
 *
 * Each source sheet ends in a blue-headed area table. That table is full
 * width while the drawing itself is a narrow portrait block, so keeping it
 * would force the drawing down to a fraction of the available width on a
 * phone. The areas are already rendered in the page's own typography, so
 * the table is cropped off and the remaining drawing trimmed of its white
 * margins — which makes the plan several times larger on screen.
 * -------------------------------------------------------------------- */

/** y of the first row that is predominantly the table's blue header */
const findTableTop = async (src) => {
  const { data, info } = await sharp(src).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let y = 0; y < height; y++) {
    let blue = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (b > 150 && b - r > 30 && b - g > 20) blue++;
    }
    if (blue > width * 0.5) return y;
  }
  return height;
};

/** Tightest box containing non-white pixels */
const contentBox = async (buffer) => {
  const { data, info } = await sharp(buffer).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let top = height, left = width, right = -1, bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      // anything meaningfully off-white counts as content
      if (data[i] < 246 || data[i + 1] < 246 || data[i + 2] < 246) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  return { top, left, right, bottom };
};

// Pass 1 — crop the area table off each sheet and measure its drawing.
const cropped = [];
for (const [fragment, slug] of PLANS) {
  const src = path.join(PLANS_DIR, findPlan(fragment));
  const { width: sheetWidth } = await sharp(src).metadata();
  const tableTop = await findTableTop(src);

  // The originals are screenshots and carry a 1px window border on their
  // outermost pixels; inset so it is not mistaken for drawing content.
  const INSET = 2;

  // Explicit passes: sharp reorders extract/trim within one pipeline.
  const buffer = await sharp(src)
    .flatten({ background: "#ffffff" })
    .extract({
      left: INSET,
      top: INSET,
      width: sheetWidth - INSET * 2,
      height: Math.max(1, tableTop - 8 - INSET),
    })
    .toBuffer();

  cropped.push({ slug, buffer, box: await contentBox(buffer), tableTop });
}

/*
 * Pass 2 — crop every level to the SAME box (the union of all three
 * drawings' bounds). Trimming each one individually would scale a small
 * upper floor up to the width of the ground floor and misrepresent how
 * the levels compare.
 */
const union = cropped.reduce((acc, c) => ({
  top: Math.min(acc.top, c.box.top),
  left: Math.min(acc.left, c.box.left),
  right: Math.max(acc.right, c.box.right),
  bottom: Math.max(acc.bottom, c.box.bottom),
}), cropped[0].box);

const PAD = 16;
for (const { slug, buffer, tableTop } of cropped) {
  const { width: bw, height: bh } = await sharp(buffer).metadata();
  const left = Math.max(0, union.left - PAD);
  const top = Math.max(0, union.top - PAD);

  const drawing = await sharp(buffer)
    .extract({
      left,
      top,
      width: Math.min(bw - left, union.right - union.left + PAD * 2),
      height: Math.min(bh - top, union.bottom - union.top + PAD * 2),
    })
    .toBuffer();

  const { width: w0, height: h0 } = await sharp(drawing).metadata();

  await sharp(drawing).png({ compressionLevel: 9, palette: true, quality: 100 })
    .toFile(path.join(PLANS_OUT, `${slug}.png`));

  meta[`floor-plans/${slug}`] = {
    width: w0,
    height: h0,
    blur: await lqip(drawing),
    format: "png",
  };
  console.log(`✓ floor plan  ${slug}  ${w0}x${h0}  (table cropped at y=${tableTop})`);
}

/* ---- Logo -----------------------------------------------------------
 * Trimmed of its transparent padding so it can be positioned precisely,
 * then kept lossless with its alpha channel intact (it is white artwork
 * and only ever sits on dark backgrounds).
 * -------------------------------------------------------------------- */

const LOGO_WIDTH = 540;
const trimmed = await sharp(LOGO_SRC).trim({ threshold: 1 }).toBuffer();
const trimmedMeta = await sharp(trimmed).metadata();

await sharp(trimmed).resize({ width: LOGO_WIDTH })
  .png({ compressionLevel: 9, quality: 100 })
  .toFile(path.join(OUT_DIR, "logo-white.png"));
await sharp(trimmed).resize({ width: LOGO_WIDTH })
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(OUT_DIR, "logo-white.webp"));

const logoHeight = Math.round(
  (LOGO_WIDTH * trimmedMeta.height) / trimmedMeta.width
);
meta["logo-white"] = { width: LOGO_WIDTH, height: logoHeight };
console.log(`✓ logo        logo-white  ${LOGO_WIDTH}x${logoHeight}`);

/* ---- Nakheel logo ---------------------------------------------------
 * The supplied file is a dark navy wordmark for light backgrounds, and it
 * would be invisible on this site's dark header and footer. It is 97.7%
 * navy plus 2.2% opaque WHITE — the counters inside the letters — so
 * flooding it white would fill those counters in and wreck the letterforms.
 *
 * The reverse is built from "navy-ness": navy becomes white, the white
 * counters become transparent so the dark background shows through, and
 * the blend between them keeps the antialiasing intact.
 * -------------------------------------------------------------------- */

const NAKHEEL_WIDTH = 760;
{
  const { data, info } = await sharp(NAKHEEL_SRC).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  // Luminance of the two inks in the file
  const NAVY = 0.2126 * 16 + 0.7152 * 48 + 0.0722 * 64;
  const WHITE = 255;

  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const navyness = Math.min(1, Math.max(0, 1 - (lum - NAVY) / (WHITE - NAVY)));
    out[o] = out[o + 1] = out[o + 2] = 255;
    out[o + 3] = Math.round(data[i + 3] * navyness);
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .resize({ width: NAKHEEL_WIDTH })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "logo-nakheel-white.png"));
  await sharp(out, { raw: { width, height, channels: 4 } })
    .resize({ width: NAKHEEL_WIDTH })
    .webp({ lossless: true, effort: 6 })
    .toFile(path.join(OUT_DIR, "logo-nakheel-white.webp"));

  const h = Math.round((NAKHEEL_WIDTH * height) / width);
  meta["logo-nakheel-white"] = { width: NAKHEEL_WIDTH, height: h };
  console.log(`✓ nakheel     logo-nakheel-white  ${NAKHEEL_WIDTH}x${h} (reversed to white)`);
}

/* ---- Favicon --------------------------------------------------------
 * The source is a dark D|R|P wordmark on white with heavy padding and
 * semi-transparent corners. Flattened, cropped to the mark, then centred on
 * a white square so it fills the tab icon instead of floating in padding.
 * Written to app/icon.png, which Next.js serves automatically.
 *
 * Explicit passes again: sharp reorders flatten/trim/extract in one pipeline.
 * -------------------------------------------------------------------- */

const faviconFlat = await sharp(FAVICON_SRC)
  .flatten({ background: "#ffffff" })
  .toBuffer();

const faviconBox = await contentBox(faviconFlat);
const mark = await sharp(faviconFlat)
  .extract({
    left: faviconBox.left,
    top: faviconBox.top,
    width: faviconBox.right - faviconBox.left + 1,
    height: faviconBox.bottom - faviconBox.top + 1,
  })
  .toBuffer();
const markMeta = await sharp(mark).metadata();

const ICON = 256;
const INNER = Math.round(ICON * 0.86);
const scaled = await sharp(mark)
  .resize({ width: INNER, height: INNER, fit: "inside" })
  .toBuffer();
const scaledMeta = await sharp(scaled).metadata();

await sharp({
  create: {
    width: ICON, height: ICON, channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{
    input: scaled,
    left: Math.round((ICON - scaledMeta.width) / 2),
    top: Math.round((ICON - scaledMeta.height) / 2),
  }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(process.cwd(), "app", "icon.png"));

console.log(
  `✓ favicon     app/icon.png  ${ICON}x${ICON}` +
  ` (mark ${markMeta.width}x${markMeta.height} -> ${scaledMeta.width}x${scaledMeta.height})`
);

/* ---- DLD permit QR --------------------------------------------------
 * Copied byte-for-byte. Re-encoding a QR risks softening the module
 * edges, and it has to stay reliably scannable.
 * -------------------------------------------------------------------- */

await copyFile(QR_SRC, path.join(OUT_DIR, "dld-permit-qr.jpeg"));
const qr = await sharp(QR_SRC).metadata();
meta["dld-permit-qr"] = { width: qr.width, height: qr.height };
console.log(`✓ qr          dld-permit-qr  ${qr.width}x${qr.height} (copied verbatim)`);

await writeFile(
  path.join(process.cwd(), "content", "image-manifest.json"),
  JSON.stringify(meta, null, 2) + "\n"
);
console.log(`\nWrote ${Object.keys(meta).length} entries to public/images`);
