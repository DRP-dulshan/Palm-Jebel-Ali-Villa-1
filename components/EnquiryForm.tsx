"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { listing } from "@/content/listing";
import { countries, defaultCountry } from "@/content/countries";
import { readAttribution } from "@/content/attribution";

type FieldKey = "name" | "email" | "phone";
type Errors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "sending" | "error";

/**
 * "enquiry" is the main Register Your Interest form; "brochure" is the
 * shorter floor plans & payment plan request, without the message box.
 */
export type EnquiryKind = "enquiry" | "brochure";

const copy = listing.enquiry.form;

const fieldClass =
  "w-full border-b border-ink/20 bg-transparent px-0 py-3.5 text-[1rem] text-ink placeholder:text-ink-mute/70 transition-colors focus:border-accent-text focus:outline-none";

const [THIS_VILLA, ANOTHER_PJA] = copy.interests;

export default function EnquiryForm({ kind = "enquiry" }: { kind?: EnquiryKind }) {
  const router = useRouter();
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [country, setCountry] = useState<string>(defaultCountry);
  const [interest, setInterest] = useState<string>(THIS_VILLA.label);

  const dial = countries.find((c) => c.code === country)?.dial ?? countries[0].dial;
  const brochure = kind === "brochure";

  /*
   * The "different villa" CTA links to #enquire and sets ?looking=another-pja,
   * so a lead from there reaches the team marked as a wider search.
   */
  useEffect(() => {
    if (brochure) return;
    const apply = () => {
      const preset =
        new URLSearchParams(window.location.search).get("looking") ??
        (window.location.hash.includes("looking=another-pja")
          ? "another-pja"
          : null);
      if (preset === ANOTHER_PJA.id) setInterest(ANOTHER_PJA.label);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [brochure]);

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (name.length < 2) next.name = copy.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = copy.errors.email;
    if (phone.replace(/\D/g, "").length < 6) next.phone = copy.errors.phone;

    return next;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus("sending");
    try {
      const params = new URLSearchParams(window.location.search);
      /*
       * Trailing slash on purpose: next.config sets trailingSlash, which
       * applies to API routes too, so "/api/enquiry" answers 308. Posting to
       * the canonical URL avoids the extra hop — and avoids relying on the
       * client preserving the method and body across a redirect.
       */
      const response = await fetch("/api/enquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request: kind,
          name: data.get("name"),
          email: data.get("email"),
          phone: `${dial} ${data.get("phone")}`,
          interest,
          message: brochure ? "" : data.get("message") || "",
          // Submitting under the notice beside the button is the agreement
          consent: true,
          // Honeypot: real people never fill this in
          company: data.get("company") || "",
          // Captured on the landing page, not read from the current URL
          attribution: readAttribution(),
          pageUrl: window.location.href,
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      /*
       * Stay in the "sending" state through the navigation: flipping back to
       * idle first would flash the empty form before the page changes.
       */
      router.push("/thank-you/");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`relative ${brochure ? "space-y-7" : "space-y-9"}`}
    >
      {/* Honeypot — off-screen and hidden from assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        id={`${id}-name`}
        name="name"
        label={copy.name}
        autoComplete="name"
        error={errors.name}
        required
      />

      {/* Side by side on the full form; stacked in the narrow dialog */}
      <div className={`grid ${brochure ? "gap-7" : "gap-9 sm:grid-cols-2"}`}>
        <div>
          <label htmlFor={`${id}-phone`} className="eyebrow text-ink-mute">
            {copy.phone} <span className="text-accent-text">*</span>
          </label>
          <div className="mt-1 flex items-stretch gap-2.5">
            {/*
              The native select sits invisibly over a compact display of just
              the dial code, so the dropdown can still list full country names
              without the closed control overflowing a half-width column.
            */}
            <div className="relative w-[4.75rem] shrink-0 border-b border-ink/20 focus-within:border-accent-text">
              <label htmlFor={`${id}-dial`} className="sr-only">
                Country dialling code
              </label>
              <span
                className="pointer-events-none flex items-center justify-between py-3.5 text-[1rem] text-ink"
                aria-hidden="true"
              >
                <span className="lining-nums tabular-nums">{dial}</span>
                <span className="text-ink-mute">▾</span>
              </span>
              <select
                id={`${id}-dial`}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent text-[16px] opacity-0"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.dial})
                  </option>
                ))}
              </select>
            </div>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="50 123 4567"
              required
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
              className={`${fieldClass} min-w-0 flex-1 ${
                errors.phone ? "border-accent-text" : ""
              }`}
            />
          </div>
          {errors.phone && (
            <p id={`${id}-phone-error`} className="mt-2 text-[0.8125rem] text-accent-text">
              {errors.phone}
            </p>
          )}
        </div>

        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          label={copy.email}
          autoComplete="email"
          error={errors.email}
          required
        />
      </div>

      {!brochure && (
        <div>
          <label htmlFor={`${id}-message`} className="eyebrow text-ink-mute">
            {copy.message}{" "}
            <span className="normal-case tracking-normal opacity-60">
              ({copy.messageOptional})
            </span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={3}
            placeholder="Payment plan, viewing availability, handover…"
            className={`${fieldClass} resize-none`}
          />
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="text-[0.875rem] text-accent-text">
          {copy.errors.generic}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="eyebrow w-full bg-ink px-8 py-4.5 text-sand-50 transition-colors duration-300 hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "sending"
            ? copy.submitting
            : brochure
              ? listing.brochure.submit
              : copy.submit}
        </button>

        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">
          {copy.notice}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  error,
  required,
  type = "text",
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-ink-mute">
        {label} {required && <span className="text-accent-text">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldClass} mt-1 ${error ? "border-accent-text" : ""}`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.8125rem] text-accent-text">
          {error}
        </p>
      )}
    </div>
  );
}
