/* ------------------------------------------------------------------
 * SITE CONFIG
 *
 * No personal contact details live here, and none are rendered on the
 * page. Enquiries go through the form to the address in the LEAD_EMAIL
 * environment variable — see .env.example.
 * ------------------------------------------------------------------ */

export const site = {
  /** Used in metadata and the footer */
  brand: "Wave Crest · Palm Jebel Ali",
  location: "Dubai, United Arab Emirates",

  /** Canonical URL, used for the Open Graph tags and JSON-LD */
  url: "https://palm.nakheel.villas",

  /** Every call to action points here */
  enquiryAnchor: "#enquire",
} as const;
