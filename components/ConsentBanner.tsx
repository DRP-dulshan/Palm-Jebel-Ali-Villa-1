"use client";

import { useEffect, useState } from "react";
import { Container } from "./ui";
import { listing } from "@/content/listing";
import { CONSENT_KEY, consentSignals, type ConsentChoice } from "@/content/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const { consent } = listing;

/**
 * Cookie consent for Google Consent Mode v2.
 *
 * The defaults are set in the root layout before the tag loads — denied in
 * the EEA, UK and Switzerland, granted elsewhere. This only handles the
 * visitor's explicit choice, and only shows until one has been made.
 *
 * A stored choice is re-applied by the bootstrap script on later visits, so
 * this component never has to run for the consent state to be correct.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored !== "granted" && stored !== "denied") setVisible(true);
    } catch {
      // Storage blocked: show the banner, but the choice will not persist.
      setVisible(true);
    }
  }, []);

  const choose = (choice: ConsentChoice) => {
    window.gtag?.("consent", "update", consentSignals(choice));
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* nothing to do — the update above still applies for this page view */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={consent.label}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-sand-100/15 bg-ink text-sand-50"
    >
      <Container className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6">
        <p className="max-w-2xl text-[0.875rem] leading-relaxed text-sand-100/80">
          {consent.message}
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="eyebrow flex-1 border border-sand-100/40 px-6 py-3 text-sand-50 transition-colors duration-300 hover:border-sand-50 sm:flex-none"
          >
            {consent.decline}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="eyebrow flex-1 bg-accent px-6 py-3 text-ink transition-colors duration-300 hover:bg-accent-hover sm:flex-none"
          >
            {consent.accept}
          </button>
        </div>
      </Container>
    </div>
  );
}
