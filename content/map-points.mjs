/* ------------------------------------------------------------------
 * Map pins for the Location section.
 *
 * `lat` / `lon` are real coordinates — the build projects them onto the
 * map, so moving a pin means editing the numbers here and re-running
 * `npm run map`. Drive times are indicative.
 *
 * `align` is which side of the dot the label sits on, used only on wide
 * screens where labels are drawn inline on the map.
 * ------------------------------------------------------------------ */

/**
 * Where the villa marker sits on Palm Jebel Ali, and the label drawn beside
 * it. This text is baked into the generated SVG, so it lives here rather
 * than in listing.ts.
 */
export const villaPin = {
  label: "Wave Crest",
  sub: "Palm Jebel Ali · Frond A",
  lat: 24.9875,
  lon: 54.9760,
};

export const mapPoints = [
  { n: 1,  label: "Jebel Ali Port",          lat: 25.0100, lon: 55.0600, minutes: 10 , align: "right" },
  { n: 2,  label: "Dubai Parks & Resorts",   lat: 24.9180, lon: 55.0090, minutes: 15 , align: "right" },
  { n: 3,  label: "Expo City Dubai",         lat: 24.9600, lon: 55.1500, minutes: 20 , align: "right" },
  { n: 4,  label: "Al Maktoum Airport",      lat: 24.8968, lon: 55.1614, minutes: 20 , align: "right" },
  { n: 5,  label: "Ibn Battuta Mall",        lat: 25.0447, lon: 55.1178, minutes: 20 , align: "right" },
  { n: 6,  label: "Dubai Marina",            lat: 25.0805, lon: 55.1403, minutes: 25 , align: "right" },
  { n: 7,  label: "Ain Dubai · Bluewaters",  lat: 25.0800, lon: 55.1210, minutes: 25 , align: "left" },
  { n: 8,  label: "Palm Jumeirah",           lat: 25.1124, lon: 55.1390, minutes: 30 , align: "left" },
  { n: 9,  label: "Mall of the Emirates",    lat: 25.1181, lon: 55.2003, minutes: 30 , align: "right" },
  { n: 10, label: "Burj Al Arab",            lat: 25.1412, lon: 55.1853, minutes: 35 , align: "right" },
  { n: 11, label: "Downtown · Burj Khalifa", lat: 25.1972, lon: 55.2744, minutes: 40 , align: "right" },
  { n: 12, label: "Dubai Intl. Airport",     lat: 25.2532, lon: 55.3657, minutes: 45 , align: "right" },
];
