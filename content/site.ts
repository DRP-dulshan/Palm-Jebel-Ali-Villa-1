/* ------------------------------------------------------------------
 * SITE CONFIG
 *
 * The only contact detail on the page is the office WhatsApp line behind
 * the floating button. Form enquiries go to the address in the LEAD_EMAIL
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

  /** Office WhatsApp, international format without "+" — as wa.me expects */
  whatsapp: "971507720378",
} as const;
