# Wave Crest — Palm Jebel Ali, Frond A

Single-page listing site for the 5-bedroom Wave Crest beach villa, for
Dubai Rapid Properties (D|R|P). Next.js App Router + Tailwind, ready for Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Before going live

Leads are emailed to **office@dubairapidproperties.com**. That is the default
in the API route, and `.env.local` sets it explicitly via `LEAD_EMAIL`.

One thing is still required: **`RESEND_API_KEY`**. Put it in `.env.local`
locally and in the Vercel project's environment variables for production.

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | **Yes** | From https://resend.com/api-keys |
| `LEAD_EMAIL` | No | Defaults to office@dubairapidproperties.com |
| `LEAD_FROM` | Recommended | Sender address — see the warning below |
| `BITRIX_WEBHOOK_URL` | No | Bitrix24 inbound webhook base URL, **trailing slash required**. Carries an auth token, so server-only. Without it the CRM copy is skipped and leads are still emailed. |

### The sender domain is not verified yet

Tested live: sending to `office@dubairapidproperties.com` currently fails with

> The dubairapidproperties.com domain is not verified.

Until that is fixed, Resend will only deliver **to the account owner**
(`dulshan@dubairapidproperties.com`) and only **from** its shared sender. That
is what `.env.local` is set to, and a live test lead was delivered that way.

**To get leads into the office inbox**, add `dubairapidproperties.com` at
https://resend.com/domains, add the DNS records it gives you, wait for
"Verified", then swap the two commented lines in `.env.local`:

```
LEAD_EMAIL=office@dubairapidproperties.com
LEAD_FROM="Wave Crest <leads@dubairapidproperties.com>"
```

Set the same three variables in the Vercel project for production.

Without a key the behaviour differs by environment, deliberately:

- **Development** — the lead is logged to the console and the form reports
  success, so you can work on the form with no setup.
- **Production** — the route returns 502 and the visitor sees the error.
  Quietly logging a lead the visitor was told we received is how leads get
  lost, so it fails loudly instead.

Also set `url` in `content/site.ts` to the live domain — Open Graph image URLs
must be absolute, so the social preview only renders once it is in.

**No personal contact details appear anywhere on the site or in the config.**
Every CTA scrolls to the enquiry form.

## Where leads go

Every submission goes to two places, in parallel:

1. **Email**, via Resend.
2. **Bitrix24**, as a CRM lead (`crm.lead.add.json`).

Only the email decides the HTTP response. A CRM outage is logged and otherwise
ignored — the visitor still reaches `/thank-you/`, and a Bitrix problem never
costs us the lead. Verified against a mock for all four cases: lead created,
Bitrix returning an error body, Bitrix unreachable, and the variable unset.

Note that **Bitrix answers HTTP 200 even for errors**, putting `{"error": ...}`
in the body, so the status code alone is not trusted.

### Campaign attribution

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` and
`gclid` are captured from the **landing** URL into `sessionStorage`
(`content/attribution.ts`) and sent with the form.

First touch wins: browsing on to pages without the parameters, or arriving a
second time on a different campaign link, will not overwrite what originally
brought the visitor in.

The five UTMs map to Bitrix's own `UTM_*` fields. `gclid` has no native field
there, so it is written into `COMMENTS`.

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

The sources are the 1600x1600 sheets in `Floor Plan/New Floor Plan/`. The
build trims all three to a **shared** bounding box so the levels keep their
true relative scale, upscales 2.5x and sharpens lightly. Output is
~2300x3650 WebP at quality 95, around 400-500KB each — sharp well past the
displayed size and through the fullscreen zoom.

An earlier pass worked from low-resolution screenshots; Real-ESRGAN was tried
on those and **rejected**, because it invented detail (stippled tree canopies
became angular shards, floor hatching was smoothed away). Fabricated geometry
on a floor plan is a worse failure than a soft one. The current sheets are
high enough resolution that none of that is needed.

Level areas live in `content/listing.ts` under `floorPlans.levels`.

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

**Frond A** was located by registering the supplied Google Maps screenshot
against the OSM coastline: a scale/offset search found the best fit at
117 px/km (IoU 0.39, a clear peak), which put Google's Frond A marker at
25.00221 / 55.00024. The villa marker is snapped onto the nearest frond land
from there. At the rendered size the palm is ~150px wide, so a frond is about
2px — the marker reads as "eastern fan of Palm Jebel Ali", which is what the
screenshot shows.

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

## Palette

Lifted from the official Palm Jebel Ali site's own CSS custom properties and
declared as tokens in `app/globals.css`:

| Token | Value | From | Used for |
| --- | --- | --- | --- |
| `ink` | `#0d2638` | `--midnight-blue` / `--cta` | Body text, dark sections, button fill |
| `ink-soft` | `#33495a` | derived | Body copy |
| `ink-mute` | `#6e6555` | `--dark-tk`, darkened | Labels and eyebrows |
| `stone-900` | `#0f1c26` | `--midnight-blue-3` | Deepest sections |
| `teal` | `#005575` | `--midnight-blue-4` | Sea tones |
| `teal-deep` | `#00617f` | `--hover` | Button hover |
| `sky` | `#72c8dc` | `--sky-blue` | Light accent on navy |
| `sand-50` | `#f5f1e7` | `--floral-white` | Page background |
| `sand-100/200/300` | `#ece7db` / `#e6e1d6` / `#e0d4c1` | — | Alternating sections |
| `accent` | `#bd9e70` | `--sky-blue-2` | Gold details, dots, rules |
| `accent-text` | `#7a6236` | derived | Accent-coloured type on light |

Gold is a **fill** colour: at 2.3:1 on cream it cannot carry small text, so
`accent-text` is the darkened variant (5.1:1) for accent type and icons.
Buttons are navy with cream text (13.8:1).

Their headings use Nakheel's own brand font plus the Adobe Fonts faces
`meno-banner` and `petala-pro`, none of which are licensable here. Cormorant
Garamond and Inter are kept as the closest equivalents, matching the *style*:
light serif headings, uppercase tracked labels, airy spacing.

## Lighthouse

Production build, measured locally:

| | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 99 | 100 | 100 | 100 |
| Mobile | 92 | 100 | 100 | 100 |
