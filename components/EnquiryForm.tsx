"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { listing } from "@/content/listing";
import { countries, defaultCountry } from "@/content/countries";
import { readAttribution } from "@/content/attribution";

type FieldKey = "name" | "email" | "phone" | "interest" | "consent";
type Errors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "sending" | "error";

const copy = listing.enquiry.form;

const fieldClass =
  "w-full border-b border-ink/20 bg-transparent px-0 py-3.5 text-[1rem] text-ink placeholder:text-ink-mute/70 transition-colors focus:border-accent-text focus:outline-none";

/** Options that open the "what else are you looking for" fields. */
const WIDER_INTERESTS: string[] = ["another-pja", "other-waterfront"];

export default function EnquiryForm() {
  const router = useRouter();
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [country, setCountry] = useState<string>(defaultCountry);
  const [title, setTitle] = useState<string>("");
  const [interest, setInterest] = useState<string>("");
  const [consent, setConsent] = useState(false);

  const dial = countries.find((c) => c.code === country)?.dial ?? countries[0].dial;
  const wantsMore = WIDER_INTERESTS.includes(interest);

  /*
   * The "different villa" CTA links to #enquire and sets ?looking=another-pja,
   * so arriving from there pre-selects the matching option.
   */
  useEffect(() => {
    const apply = () => {
      const preset =
        new URLSearchParams(window.location.search).get("looking") ??
        (window.location.hash.includes("looking=another-pja")
          ? "another-pja"
          : null);
      if (preset && WIDER_INTERESTS.includes(preset)) setInterest(preset);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (name.length < 2) next.name = copy.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = copy.errors.email;
    if (phone.replace(/\D/g, "").length < 6) next.phone = copy.errors.phone;
    if (!interest) next.interest = copy.errors.interest;
    if (!consent) next.consent = copy.errors.consent;

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
          title,
          name: data.get("name"),
          email: data.get("email"),
          phone: `${dial} ${data.get("phone")}`,
          interest: copy.interests.find((i) => i.id === interest)?.label ?? interest,
          area: wantsMore ? data.get("area") || "" : "",
          bedrooms: wantsMore ? data.get("bedrooms") || "" : "",
          budget: wantsMore ? data.get("budget") || "" : "",
          message: data.get("message") || "",
          consent,
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
    <form onSubmit={onSubmit} noValidate className="relative space-y-9">
      {/* Honeypot — off-screen and hidden from assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Title */}
      <fieldset>
        <legend className="eyebrow text-ink-mute">
          {copy.title}{" "}
          <span className="normal-case tracking-normal opacity-60">
            ({copy.optional})
          </span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {copy.titles.map((option) => (
            <label
              key={option}
              className={`eyebrow cursor-pointer border px-5 py-3 transition-colors ${
                title === option
                  ? "border-ink bg-ink text-sand-50"
                  : "border-ink/20 text-ink hover:border-ink/50"
              }`}
            >
              <input
                type="radio"
                name="title"
                value={option}
                checked={title === option}
                onChange={() => setTitle(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        id={`${id}-name`}
        name="name"
        label={copy.name}
        autoComplete="name"
        error={errors.name}
        required
      />

      <div className="grid gap-9 sm:grid-cols-2">
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

      {/* Interest */}
      <fieldset>
        <legend className="eyebrow text-ink-mute">
          {copy.interest} <span className="text-accent-text">*</span>
        </legend>
        <div className="mt-4 space-y-3">
          {copy.interests.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3.5 border px-5 py-4 transition-colors ${
                interest === option.id
                  ? "border-ink bg-ink/[0.04]"
                  : "border-ink/20 hover:border-ink/40"
              }`}
            >
              <input
                type="radio"
                name="interest"
                value={option.id}
                checked={interest === option.id}
                onChange={() => setInterest(option.id)}
                aria-invalid={Boolean(errors.interest)}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  interest === option.id ? "border-ink" : "border-ink/35"
                }`}
                aria-hidden="true"
              >
                {interest === option.id && (
                  <span className="h-2 w-2 rounded-full bg-accent" />
                )}
              </span>
              <span className="text-[0.9375rem] text-ink">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.interest && (
          <p className="mt-2 text-[0.8125rem] text-accent-text">{errors.interest}</p>
        )}
      </fieldset>

      {/* Revealed only when they are open to other properties */}
      {wantsMore && (
        <div className="grid animate-[fadeUp_.45s_cubic-bezier(.22,1,.36,1)_both] gap-9 border-l border-accent/60 pl-6 sm:grid-cols-3 sm:gap-6">
          <Field
            id={`${id}-area`}
            name="area"
            label={copy.area}
            placeholder="Frond A, Frond B…"
          />
          <Select id={`${id}-bedrooms`} name="bedrooms" label={copy.bedrooms}>
            {copy.bedroomOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Select id={`${id}-budget`} name="budget" label={copy.budget}>
            {copy.budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
      )}

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

      {/* Consent */}
      <div>
        <label className="flex cursor-pointer items-start gap-3.5">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            className="sr-only"
          />
          <span
            className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center border transition-colors ${
              consent ? "border-ink bg-ink" : "border-ink/35"
            }`}
            aria-hidden="true"
          >
            {consent && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f5f1e7"
                strokeWidth={2.5}
                className="h-3 w-3"
              >
                <path d="M4 12.5 9 17.5 20 6.5" />
              </svg>
            )}
          </span>
          <span className="text-[0.875rem] leading-relaxed text-ink-soft">
            {copy.consent}
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-[0.8125rem] text-accent-text">{errors.consent}</p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-[0.875rem] text-accent-text">
          {copy.errors.generic}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="eyebrow w-full bg-ink px-8 py-4.5 text-sand-50 transition-colors duration-300 hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? copy.submitting : copy.submit}
      </button>
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

function Select({
  id,
  name,
  label,
  children,
}: {
  id: string;
  name: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-ink-mute">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          defaultValue=""
          className={`${fieldClass} mt-1 appearance-none pr-6`}
        >
          <option value="">—</option>
          {children}
        </select>
        <span
          className="pointer-events-none absolute bottom-3.5 right-0 text-ink-mute"
          aria-hidden="true"
        >
          ▾
        </span>
      </div>
    </div>
  );
}
