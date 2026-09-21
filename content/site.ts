/* ------------------------------------------------------------------
 * SITE CONFIG — edit this file to go live.
 *
 * Set `url` to the live domain before sharing the link; everything else
 * here is already filled in.
 * ------------------------------------------------------------------ */

export const site = {
  /** Brand */
  brand: "Dubai Rapid Properties",
  brandShort: "D|R|P",
  brandLocation: "Palm Jumeirah · Dubai",

  /** Listing agent */
  agent: {
    name: "Tara Topic",
    title: "Nakheel Specialize",
    location: "Palm Jumeirah · Dubai",

    // Phone, in international format
    phone: "+971 50 772 0378",
    // WhatsApp number, digits only, no + or spaces
    whatsapp: "971507720378",
    // Email address
    email: "tara@dubairapidproperties.com",
  },

  /** Subject line used by the email links */
  emailSubject: "Enquiry: Wave Crest Beach Villa, Palm Jebel Ali Frond A",

  /** Prefilled WhatsApp message */
  whatsappMessage:
    "Hi Tara, I'm interested in the Wave Crest beach villa on Palm Jebel Ali Frond A.",

  /** Canonical URL — set once deployed, used for OG tags */
  url: "https://wavecrest.dubairapidproperties.com",
} as const;

/** true once a placeholder has been swapped for a real value */
export const isConfigured = (value: string) =>
  Boolean(value) && !value.trim().startsWith("[");

/** WhatsApp deep link with the prefilled message */
export const whatsappHref = () => {
  const number = site.agent.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(site.whatsappMessage);
  return isConfigured(site.agent.whatsapp)
    ? `https://wa.me/${number}?text=${text}`
    : `https://wa.me/?text=${text}`;
};

export const telHref = () =>
  isConfigured(site.agent.phone)
    ? `tel:${site.agent.phone.replace(/[^\d+]/g, "")}`
    : undefined;

export const mailHref = () =>
  isConfigured(site.agent.email)
    ? `mailto:${site.agent.email}?subject=${encodeURIComponent(site.emailSubject)}`
    : undefined;
