/* ------------------------------------------------------------------
 * ALL PAGE COPY — every word on the page lives here.
 * Edit text in this file; the components read from it.
 * ------------------------------------------------------------------ */

export const listing = {
  meta: {
    title: "Wave Crest · 5 Bedroom Beach Villa — Palm Jebel Ali, Frond A",
    description:
      "A signature beachfront residence on Frond A of Palm Jebel Ali. 5 bedrooms, 8,368 sq.ft. across a 7,640 sq.ft. plot, direct beachfront. AED 24,500,000.",
    ogImage: "/images/og-wave-crest.jpg",
  },

  hero: {
    eyebrow: "Palm Jebel Ali · Frond A",
    headline: "Own the Waterfront.",
    sub: "Wave Crest · 5 Bedroom Beach Villa",
    line: "A rare opportunity to own a signature beachfront residence on one of Palm Jebel Ali's most prestigious residential fronds.",
    price: "AED 24,500,000",
    stats: [
      { value: "8,368", unit: "sq.ft.", label: "Property Area" },
      { value: "7,640", unit: "sq.ft.", label: "Plot" },
      { value: "5", unit: "", label: "Bedrooms" },
      { value: "Direct", unit: "", label: "Beachfront" },
    ],
    cta: "Request Private Details",
    brochureCta: "Get Floor Plans & Payment Plan",
  },

  intro: {
    eyebrow: "The Opportunity",
    heading: "A New Generation of Beachfront Living",
    body: [
      "Set directly on Frond A of Palm Jebel Ali, this Wave Crest villa forms part of Nakheel's exclusive Beach Collection, a limited collection of architecturally distinctive residences created for private waterfront living.",
      "Designed by LW Design Group, Wave Crest combines contemporary architecture, expansive glazing, natural materials and generous indoor-outdoor spaces, with the sea forming the backdrop to the residence.",
    ],
    quote:
      "This is not simply a villa near the water. The beach is an extension of the home.",
  },

  residence: {
    eyebrow: "The Residence",
    heading: "Designed Around the Horizon.",
    body: [
      "With approximately 8,368 sq.ft. of property area across a 7,640 sq.ft. plot, the residence delivers exceptional scale while maintaining the privacy and openness expected from a true beachfront home.",
      "Floor-to-ceiling glazing brings natural light deep into the interiors and creates a continuous visual connection between the living spaces, landscaped exterior and Arabian Gulf.",
    ],
    features: [
      { icon: "bed", label: "5 Bedrooms" },
      { icon: "sofa", label: "Family Room" },
      { icon: "living", label: "Formal & Family Living Areas" },
      { icon: "terrace", label: "Expansive Sea-Facing Terraces" },
      { icon: "roof", label: "Roof Lounge & Terrace" },
      { icon: "garden", label: "Landscaped Outdoor Areas" },
      { icon: "wave", label: "Direct Beach Access" },
    ],
  },

  floorPlans: {
    eyebrow: "Floor Plans",
    heading: "Every Level, Considered.",
    note: "Tap a plan to open it full screen and zoom.",
    /** Areas are taken from the schedule printed on each drawing */
    levels: [
      {
        id: "ground",
        slug: "floor-plans/ground-floor",
        tab: "Ground",
        title: "Ground Floor",
        area: "2,774.94 sq.ft.",
        outdoor: "Balcony / Terrace / Porch — 24.11 sq.ft.",
        alt: "Ground floor plan of the Wave Crest villa, showing the pool and beach terrace, living and dining areas, kitchen, guest suite and double garage.",
      },
      {
        id: "first",
        slug: "floor-plans/first-floor",
        tab: "First",
        title: "First Floor",
        area: "2,667.40 sq.ft.",
        outdoor: "Balcony / Terrace — 286.00 sq.ft.",
        alt: "First floor plan of the Wave Crest villa, showing bedroom suites with en-suite bathrooms, dressing rooms and a sea-facing terrace.",
      },
      {
        id: "second",
        slug: "floor-plans/second-floor",
        tab: "Second",
        title: "Second Floor",
        area: "1,656.35 sq.ft.",
        outdoor: "Balcony / Terrace — 392.78 sq.ft.",
        alt: "Second floor plan of the Wave Crest villa, showing the master suite, lounge and roof terrace.",
      },
    ],
  },

  gallery: {
    eyebrow: "Gallery",
    heading: "Inside Wave Crest",
    note: "Tap any image to view full screen.",
    brochureLine: "See every level laid out, and exactly what remains to be paid.",
    brochureCta: "Get Floor Plans & Payment Plan",
  },

  architecture: {
    eyebrow: "Wave Crest",
    heading: "Architecture Inspired by the Coast.",
    body: [
      "Wave Crest is defined by sophisticated architectural layering, natural textures and warm material tones. Designed by LW Design Group, the residence has been conceived to create a seamless relationship between architecture and its beachfront environment.",
      "Large openings and expansive terraces maximise the relationship with the sea, while the villa's multiple living and entertaining spaces provide distinct areas for family life, hosting and private retreat.",
    ],
    closing: [
      "Contemporary architecture.",
      "Private beachfront.",
      "Uninterrupted coastal living.",
    ],
  },

  frond: {
    eyebrow: "Frond A",
    heading: "A Prime Position on Palm Jebel Ali.",
    body: "Location within Palm Jebel Ali matters. Positioned on Frond A, the residence sits within the first group of private residential fronds forming this new waterfront destination.",
    callout: {
      heading: "A High-Numbered Position on the Frond.",
      body: "The residence sits further along Frond A, away from the frond entrance. This means greater privacy, less passing traffic, and a quieter, more secluded stretch of beach. It is one of the most sought-after positions on any residential frond.",
    },
    closing:
      "The setting combines the privacy of a residential frond with direct access to the coastline, creating a fundamentally limited type of Dubai real estate: a private villa, on a private residential frond, directly on the beach.",
  },

  location: {
    eyebrow: "Perfectly Positioned",
    heading: "Between the Gulf and the City.",
    body: [
      "Palm Jebel Ali reaches out from Dubai's southern coastline, west of Dubai Marina and Palm Jumeirah. The frond system carries the residence into open water while keeping the city within an easy drive.",
      "Sheikh Zayed Road connects the island to the rest of Dubai. Al Maktoum International Airport is roughly twenty minutes away, Dubai Marina around twenty-five, and Downtown Dubai about forty.",
    ],
    /* The map pin's own label lives in content/map-points.mjs */
    legendHeading: "Drive times",
    note: "Indicative drive times in typical traffic. Map data © OpenStreetMap contributors.",
  },

  masterplan: {
    eyebrow: "Palm Jebel Ali",
    heading: "Dubai's Next Waterfront Landmark.",
    body: [
      "Palm Jebel Ali represents the next chapter of Dubai's waterfront development. Created by Nakheel, the destination has been master-planned around an extensive coastline, residential fronds, beaches, landscaped communities and future lifestyle destinations.",
      "With 16 fronds and more than 90 kilometres of beachfront, it significantly expands Dubai's luxury waterfront landscape.",
    ],
    counters: [
      { value: 16, suffix: "", label: "Fronds" },
      { value: 90, suffix: "+", label: "km Beachfront" },
    ],
    closing: ["Space.", "Privacy.", "Beachfront.", "Scarcity."],
  },

  investment: {
    eyebrow: "The Investment Perspective",
    heading: "More Than a Luxury Home.",
    body: [
      "Prime beachfront land in Dubai is inherently limited. Palm Jebel Ali introduces a new supply of private beachfront residences, but the number of villas occupying direct positions along individual residential fronds remains naturally finite.",
    ],
    checklist: [
      "Direct beachfront position",
      "Frond A location",
      "High villa number on the frond",
      "Large 7,640 sq.ft. plot",
      "8,368 sq.ft. residence",
      "Architect-designed Beach Collection villa",
      "5-bedroom configuration",
      "Nakheel master development",
      "50% of payment plan already completed",
    ],
    closing:
      "A residence designed not only around how it is lived in today, but around the long-term value of owning irreplaceable waterfront land.",
  },

  paymentPlan: {
    eyebrow: "Payment Plan",
    heading: "50% Already Paid. 50% Remaining.",
    sub: "The original owner has already completed 50% of the developer payment plan. The remaining balance continues on the original Nakheel schedule through to November 2028.",
    cards: [
      { label: "Paid to Date", value: "50%" },
      { label: "Remaining", value: "50%" },
      { label: "Next Instalment", value: "10%", detail: "15 December 2026" },
    ],
    progressLabel: "50% of purchase price paid",
    dividerLabel: "50% paid to date",
    scheduleHeading: "The Schedule",
    columns: { number: "No.", date: "Date", percent: "Share", status: "Status" },
    paidLabel: "Paid",
    remainingLabel: "Remaining",
    /*
     * Percentages are of the ORIGINAL developer purchase price, not the
     * asking price. Never render an AED figure against an instalment.
     */
    schedule: [
      { number: 1, date: "13 Nov 2024", percent: "20%", paid: true },
      { number: 2, date: "15 Apr 2025", percent: "5%", paid: true },
      { number: 3, date: "15 Aug 2025", percent: "5%", paid: true },
      { number: 4, date: "15 Dec 2025", percent: "10%", paid: true },
      { number: 5, date: "15 Apr 2026", percent: "5%", paid: true },
      { number: 6, date: "15 Aug 2026", percent: "5%", paid: true },
      { number: 7, date: "15 Dec 2026", percent: "10%", paid: false },
      { number: 8, date: "15 Apr 2027", percent: "5%", paid: false },
      { number: 9, date: "15 Aug 2027", percent: "10%", paid: false },
      { number: 10, date: "15 Nov 2027", percent: "5%", paid: false },
      { number: 11, date: "15 Nov 2028", percent: "20%", paid: false },
    ],
    disclaimer:
      "Percentages refer to the original developer purchase price. Dates are estimated as per the developer's payment schedule. Full payment details available upon request.",
    cta: "Discuss the Payment Plan",
  },

  glance: {
    eyebrow: "At a Glance",
    heading: "The Specification.",
    rows: [
      { label: "Palm Jebel Ali", value: "Frond A" },
      { label: "Collection", value: "Beach Collection" },
      { label: "Design", value: "Wave Crest" },
      { label: "Position on Frond", value: "High Villa Number" },
      { label: "Bedrooms", value: "5" },
      { label: "Property Area", value: "8,368 sq.ft." },
      { label: "Plot Area", value: "7,640 sq.ft." },
      { label: "Position", value: "Direct Beachfront" },
      { label: "Payment Plan", value: "50% Paid · 50% Remaining" },
      { label: "Asking Price", value: "AED 24,500,000", emphasis: true },
    ] as ReadonlyArray<{ label: string; value: string; emphasis?: boolean }>,
  },

  alternatives: {
    eyebrow: "Not Quite the One?",
    heading: "Looking for a Different Villa?",
    body: "Beyond this residence, our team has access to beachfront and coral villas across every frond of Palm Jebel Ali, as well as Dubai's most exclusive waterfront addresses. Tell us what you're looking for and we'll find it for you.",
    cta: "Tell Us What You're Looking For",
  },

  enquiry: {
    eyebrow: "Private Enquiries",
    heading: "Register Your Interest",
    sub: "Leave your details and our team will contact you with full property details, the payment plan and a private consultation.",
    note: "Private consultation available upon request.",
    form: {
      name: "Full Name",
      phone: "WhatsApp Number",
      email: "Email",
      message: "Message",
      messageOptional: "optional",
      /**
       * What the team sees as "Interested in". Not asked on the form: it is
       * set from the page — the "different villa" CTA arrives with
       * ?looking=another-pja, everything else is about this villa.
       */
      interests: [
        { id: "this-villa", label: "This villa: Wave Crest, Frond A" },
        { id: "another-pja", label: "Another villa on Palm Jebel Ali" },
      ],
      notice: "By submitting, you agree to be contacted about this and similar properties.",
      submit: "Register Your Interest",
      submitting: "Sending…",
      errors: {
        name: "Please enter your full name.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid WhatsApp number.",
        generic: "Something went wrong. Please try again in a moment.",
      },
    },
  },

  /*
   * The two forms that open in a dialog, keyed by the request they send.
   * "brochure": Get Floor Plans & Payment Plan (hero, after the gallery).
   * "private": Request Private Details (header and hero).
   */
  dialogs: {
    brochure: {
      eyebrow: "Floor Plans & Payment Plan",
      heading: "Receive the Full Details",
      sub: "We'll send the floor plans and the payment plan to your WhatsApp and email.",
      submit: "Send Me the Details",
    },
    private: {
      eyebrow: "Private Enquiries",
      heading: "Request Private Details",
      sub: "Leave your details and our team will contact you with full property details, the payment plan and a private consultation.",
      submit: "Request Private Details",
    },
    close: "Close",
  },

  whatsapp: {
    label: "Chat with us on WhatsApp",
    message:
      "Hi, I'm interested in the Wave Crest villa on Palm Jebel Ali. Please send me details.",
  },

  consent: {
    message:
      "We use cookies to measure the performance of our advertising. You can accept or decline.",
    accept: "Accept",
    decline: "Decline",
    label: "Cookie consent",
  },

  thankYou: {
    eyebrow: "Enquiry Received",
    heading: "Thank You",
    body: "Our team will contact you shortly.",
    cta: "Back to the Residence",
  },

  footer: {
    tagline: "Wave Crest · Palm Jebel Ali, Dubai",
    disclaimer:
      "Imagery is developer-supplied architectural rendering and is indicative. All details subject to availability and confirmation.",
  },
} as const;

/** Photo assignments — slug, alt text and which section each render belongs to. */
export const photos = [
  {
    slug: "hero-beachfront",
    alt: "Wave Crest villa seen from the beach, with the pool terrace, palm-shaded garden and the Arabian Gulf in the foreground.",
    caption: "Beach elevation",
    group: "Exterior",
  },
  {
    slug: "exterior-arrival",
    alt: "The street-side arrival elevation of the Wave Crest villa, in pale stone with a timber-clad upper storey.",
    caption: "Arrival elevation",
    group: "Exterior",
  },
  {
    slug: "living-room",
    alt: "Open-plan living room with a full-height joinery wall, floor-to-ceiling glazing and views through to the garden.",
    caption: "Living room",
    group: "Interiors",
  },
  {
    slug: "dining-kitchen",
    alt: "Dining table and kitchen island in pale oak, opening onto the sea-facing terrace.",
    caption: "Dining & kitchen",
    group: "Interiors",
  },
  {
    slug: "master-bedroom",
    alt: "Master bedroom at dusk, opening onto a private terrace above the water.",
    caption: "Master bedroom",
    group: "Interiors",
  },
  {
    slug: "master-bathroom",
    alt: "Master bathroom with a freestanding bath, stone vanity and a walk-through dressing room.",
    caption: "Master bathroom",
    group: "Interiors",
  },
  {
    slug: "family-room",
    alt: "Multi-purpose family room arranged as a lounge and private gym, facing the water.",
    caption: "Family room",
    group: "Interiors",
  },
  {
    slug: "guest-bathroom",
    alt: "Guest bathroom in travertine, with a walk-in rain shower and recessed lit niches.",
    caption: "Guest bathroom",
    group: "Interiors",
  },
] as const;

export type PhotoSlug = (typeof photos)[number]["slug"];

export const photo = (slug: PhotoSlug) => {
  const found = photos.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown photo: ${slug}`);
  return found;
};
