# Wave Crest — Palm Jebel Ali, Frond A

Single-page listing site for the 5-bedroom Wave Crest beach villa, for
Dubai Rapid Properties (D|R|P). Next.js App Router + Tailwind, ready for Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Before going live — still to fill in

Everything editable lives in **`content/site.ts`**. Tara's contact details are
wired up; one thing remains:

| Field | What it is |
| --- | --- |
| `url` | The live domain — this drives the Open Graph / WhatsApp preview |

**Set `url` before sharing the link.** Open Graph image URLs have to be
absolute, so the WhatsApp preview only renders once the real domain is in.

The DLD permit QR replaces the old RERA/BRN text line — it appears in the
At a Glance section and in the footer.

## Editing the copy

All page text lives in **`content/listing.ts`** — headings, body copy, the
feature list, the spec table, form labels and validation messages. No copy is
hard-coded in components.

Photo assignments and alt text are in the `photos` array at the bottom of the
same file.

## Where enquiries go

`POST /api/enquiry` validates the lead and hands it to `deliverLead()` in
[`app/api/enquiry/route.ts`](app/api/enquiry/route.ts), which currently just
logs it (visible in `npm run dev`, or under Runtime Logs on Vercel).

That function is the single place to connect email or a CRM later — worked
examples for Resend and for a webhook are in the comment above it. The `Lead`
shape stays the same, so nothing else needs to change.

## Floor plans

Three levels — Ground, First and Second — in `public/images/floor-plans/`,
shown as tabs in the Floor Plans section with a pinch-zoom fullscreen viewer.
They are deliberately kept out of the photo gallery.

The originals are **screenshots**, so each sheet is only ~620px wide and the
drawing itself ~323px after cropping. The build crops off the blue area table
(those figures are re-rendered in the page's own typography) and frames all
three levels to one shared bounding box so the levels stay at a consistent
relative scale. Display width is capped so the upscale stays modest.

**If higher-resolution floor plans exist — a PDF or the original CAD export —
drop them in and re-run `npm run images`.** They will render noticeably
sharper, especially when zoomed. Level areas live in `content/listing.ts`
under `floorPlans.levels`.

## Images

Source renders are optimised into `public/images` by:

```bash
npm run images
```

That script reads from the source paths at the top of
[`scripts/process-images.mjs`](scripts/process-images.mjs) and produces:

- **Photos** — WebP + JPEG at 480/768/1200/1920, a blurred inline placeholder,
  and the 1200×630 Open Graph crop.
- **Floor plans** — lossless palette PNG, table cropped, shared frame. PNG beats
  lossless WebP on flat-colour line art, so no WebP is emitted for these.
- **Logo** — trimmed of its transparent padding, lossless PNG + WebP.
- **DLD permit QR** — copied byte-for-byte. Re-encoding softens the module
  edges and it has to stay reliably scannable.

Dimensions and placeholders land in `content/image-manifest.json`, which
`components/Picture.tsx` reads.

Because everything is pre-generated, the site serves plain static `<picture>`
elements — no runtime image optimisation, and no Vercel image transformations
to pay for. Re-run the script if the photos are ever replaced.

## Location map

`components/LocationMap.tsx` shows where the villa sits on Dubai's coastline.

It is **real geometry, not an illustration**: OpenStreetMap coastline and
motorway data, Web-Mercator projected at build time by
[`scripts/build-map.mjs`](scripts/build-map.mjs), with every pin placed from
its actual coordinates. The raw Overpass dumps live in `scripts/map-data/` so
the build is reproducible offline.

```bash
npm run map
```

Pins, drive times and the villa's own position are in
[`content/map-points.mjs`](content/map-points.mjs) as real lat/lon — move a pin
by editing the numbers and re-running the script.

The map ships as a **static SVG file**, not inline markup: ~90KB of paths in
the page HTML cost 0.3s of mobile LCP (92 → 89). It is lazy-loaded below the
fold instead. Two cuts are generated — the full map with place labels for wide
screens, and a compact one without them for phones, where they would be
illegible; `<picture media>` fetches only the matching one.

Because it renders inside an `<img>`, the villa label cannot use the page's
Cormorant webfont and falls back to Georgia. If that matters, the fix is to
embed a subsetted font in the SVG.

## Logo & favicon

`components/Logo.tsx` renders the **Nakheel** wordmark.

The supplied `Nakheel.png` is dark navy for light backgrounds, which would be
invisible here. The image build reverses it: the navy becomes white and the
*opaque white counters inside the letters* become transparent, so the dark
background shows through them — flooding the whole mark white would have
filled those counters in and wrecked the letterforms.

It is therefore white artwork and must always sit on a dark background: the
header keeps a gradient scrim behind it over the hero and switches to solid
`#2e2e2e` on scroll, and the footer is `#2e2e2e`. **The header never goes
light.**

The browser-tab icon is built from `Favicon.png` into `app/icon.png` by
`npm run images` — cropped to the mark and re-centred, since the source has
heavy padding that would leave it a smudge at 16px.

## Hero legibility

The hero copy sits over a very bright render. A single vertical gradient left
the headline at **2.1:1** against white — Lighthouse does not catch this,
because it only compares CSS colours and never samples the image behind text.

The scrim is therefore two layers: a vertical one, plus a horizontal one that
darkens the left column the copy occupies and clears by 78% across, so the
villa keeps its brightness. Measured worst case is now **4.7:1** across every
hero element, verified per-pixel rather than by sampling.

## Accessibility notes

The brand accent `#f47b49` only reaches 2.7:1 against white, so it is used as a
**fill** colour with dark `#2e2e2e` text on top (5.0:1). Where the accent has to
be the text or icon colour on a light background, the darkened
`--color-accent-text` (`#b3501d`, 5.0:1) is used instead. Both are defined in
`app/globals.css`.

## Lighthouse

Production build, measured locally:

| | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 99 | 100 | 100 | 100 |
| Mobile | 92 | 100 | 100 | 100 |
