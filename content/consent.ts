/* ------------------------------------------------------------------
 * Google Ads tag + Consent Mode v2.
 *
 * One tag for the whole site, mounted once in the root layout so every
 * route — including /thank-you/ — is covered without a second tag.
 * ------------------------------------------------------------------ */

export const GOOGLE_ADS_ID = "AW-18471837273";

/** Where the visitor's choice is remembered between visits. */
export const CONSENT_KEY = "wc-consent";

export type ConsentChoice = "granted" | "denied";

/**
 * Where consent must be denied until the visitor opts in: the EEA (EU 27
 * plus Iceland, Liechtenstein and Norway), the UK and Switzerland.
 * Everywhere else defaults to granted.
 */
const RESTRICTED_REGIONS = [
  // EU
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
  // Rest of the EEA
  "IS", "LI", "NO",
  // United Kingdom and Switzerland
  "GB", "CH",
];

/** The four Consent Mode v2 signals, all set to the same value. */
export const consentSignals = (value: ConsentChoice) => ({
  ad_storage: value,
  ad_user_data: value,
  ad_personalization: value,
  analytics_storage: value,
});

/**
 * Runs before the tag library loads, so the defaults are already queued when
 * it processes the dataLayer.
 *
 * Order matters and is deliberate:
 *   1. denied for the restricted regions
 *   2. granted everywhere else
 *   3. any stored choice, which overrides both
 *   4. config
 */
export const consentBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;

gtag('consent', 'default', ${JSON.stringify({
  ...consentSignals("denied"),
  region: RESTRICTED_REGIONS,
})});

gtag('consent', 'default', ${JSON.stringify(consentSignals("granted"))});

try {
  var stored = window.localStorage.getItem('${CONSENT_KEY}');
  if (stored === 'granted' || stored === 'denied') {
    gtag('consent', 'update', {
      ad_storage: stored,
      ad_user_data: stored,
      ad_personalization: stored,
      analytics_storage: stored
    });
  }
} catch (e) {
  /* private mode or blocked storage: keep the regional defaults */
}

gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
`.trim();
