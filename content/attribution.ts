/* ------------------------------------------------------------------
 * Campaign attribution.
 *
 * Captured from the landing URL on the first page of the session and kept
 * in sessionStorage, so a visitor who lands on an ad URL, browses, and only
 * then fills in the form still arrives in the CRM with the campaign that
 * brought them.
 * ------------------------------------------------------------------ */

export const ATTRIBUTION_KEY = "wc-attribution";

export const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
export type Attribution = Partial<Record<AttributionField, string>>;

/**
 * Store the landing URL's campaign parameters, once per session.
 *
 * First touch wins: a later internal navigation without the parameters must
 * not wipe what brought the visitor here, and a second campaign link in the
 * same session should not overwrite the first.
 */
export function captureAttribution(search: string): void {
  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;

    const params = new URLSearchParams(search);
    const found: Attribution = {};
    for (const field of ATTRIBUTION_FIELDS) {
      const value = params.get(field);
      if (value) found[field] = value.slice(0, 250);
    }

    if (Object.keys(found).length > 0) {
      window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
    }
  } catch {
    /* private mode or blocked storage — the lead just arrives unattributed */
  }
}

export function readAttribution(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
