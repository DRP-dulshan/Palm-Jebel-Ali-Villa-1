/**
 * Generates responsive WebP + JPEG fallbacks and blur placeholders from the
 * original listing renders, plus the Nakheel logo, favicon and floor plans.
 * Run with: npm run images
 */
import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const LISTING_DIR = "/Users/dulshansdrp/Desktop/Properties Photos/Tara's New listing";
const PLANS_DIR = path.join(LISTING_DIR, "Floor Plan", "New Floor Plan");
const NAKHEEL_SRC = "/Users/dulshansdrp/Downloads/Nakheel.png";

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
  ["Ground", "ground-floor"],
  ["First", "first-floor"],
  ["Second", "second-floor"],
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
 * The supplied sheets are 1600x1600 drawings on white, already free of the
 * area table the earlier screenshots carried.
 *
 * Each is trimmed to a SHARED bounding box so the three levels keep their
 * true relative scale — trimming each one individually would blow a small
 * upper floor up to the width of the ground floor and misrepresent how they
 * compare. Then upscaled 2.5x so they stay crisp under the fullscreen zoom.
 * -------------------------------------------------------------------- */

const PLAN_SCALE = 2.5;
const PLAN_PAD = 24;

// Pass 1 — flatten each sheet and measure its drawing.
const planSheets = [];
for (const [fragment, slug] of PLANS) {
  const src = path.join(PLANS_DIR, findPlan(fragment));
  const buffer = await sharp(src).flatten({ background: "#ffffff" }).toBuffer();
  planSheets.push({ slug, buffer, box: await contentBox(buffer) });
}

// Pass 2 — one box for all three, so the levels stay comparable.
const planBox = planSheets.reduce((acc, p) => ({
  top: Math.min(acc.top, p.box.top),
  left: Math.min(acc.left, p.box.left),
  right: Math.max(acc.right, p.box.right),
  bottom: Math.max(acc.bottom, p.box.bottom),
}), planSheets[0].box);

for (const { slug, buffer } of planSheets) {
  const { width: bw, height: bh } = await sharp(buffer).metadata();
  const left = Math.max(0, planBox.left - PLAN_PAD);
  const top = Math.max(0, planBox.top - PLAN_PAD);
  const width = Math.min(bw - left, planBox.right - planBox.left + PLAN_PAD * 2);
  const height = Math.min(bh - top, planBox.bottom - planBox.top + PLAN_PAD * 2);

  const drawing = await sharp(buffer)
    .extract({ left, top, width, height })
    .resize({ width: Math.round(width * PLAN_SCALE), kernel: "lanczos3" })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.6 })
    .toBuffer();

  const { width: w0, height: h0 } = await sharp(drawing).metadata();

  await sharp(drawing).webp({ quality: 95, effort: 6 })
    .toFile(path.join(PLANS_OUT, `${slug}.webp`));

  meta[`floor-plans/${slug}`] = {
    width: w0,
    height: h0,
    blur: await lqip(drawing),
    format: "webp",
  };
  console.log(`✓ floor plan  ${slug}  ${w0}x${h0}`);
}

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
 * Built from the Nakheel mark on a cream plate, so it reads in both light
 * and dark browser chrome. Cropped to the wordmark and centred — the raw
 * file has padding that would leave it a smudge at 16px.
 * -------------------------------------------------------------------- */

{
  const flat = await sharp(NAKHEEL_SRC)
    .flatten({ background: "#f5f1e7" })
    .toBuffer();
  const box = await contentBox(flat);
  const mark = await sharp(flat)
    .extract({
      left: box.left,
      top: box.top,
      width: box.right - box.left + 1,
      height: box.bottom - box.top + 1,
    })
    .toBuffer();

  const ICON = 256;
  const scaled = await sharp(mark)
    .resize({ width: Math.round(ICON * 0.88), height: Math.round(ICON * 0.88), fit: "inside" })
    .toBuffer();
  const sm = await sharp(scaled).metadata();

  await sharp({
    create: {
      width: ICON, height: ICON, channels: 4,
      background: { r: 245, g: 241, b: 231, alpha: 1 },
    },
  })
    .composite([{
      input: scaled,
      left: Math.round((ICON - sm.width) / 2),
      top: Math.round((ICON - sm.height) / 2),
    }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(process.cwd(), "app", "icon.png"));

  console.log(`✓ favicon     app/icon.png  ${ICON}x${ICON} (Nakheel mark on cream)`);
}

await writeFile(
  path.join(process.cwd(), "content", "image-manifest.json"),
  JSON.stringify(meta, null, 2) + "\n"
);
console.log(`\nWrote ${Object.keys(meta).length} entries to public/images`);
