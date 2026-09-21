"use client";

import { useId, useState } from "react";
import { listing } from "@/content/listing";
import { countries, defaultCountry } from "@/content/countries";

type Errors = Partial<Record<"name" | "email" | "phone", string>>;
type Status = "idle" | "sending" | "sent" | "error";

const copy = listing.enquiry.form;

const fieldClass =
  "w-full border-b border-ink/20 bg-transparent px-0 py-3.5 text-[1rem] text-ink placeholder:text-ink-mute/70 transition-colors focus:border-accent focus:outline-none";

export default function EnquiryForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [country, setCountry] = useState<string>(defaultCountry);
  const dial =
    countries.find((c) => c.code === country)?.dial ?? countries[0].dial;
  const [method, setMethod] = useState<string>(copy.methods[0]);

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (name.length < 2) next.name = listing.enquiry.form.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = listing.enquiry.form.errors.email;
    if (phone.replace(/\D/g, "").length < 6)
      next.phone = listing.enquiry.form.errors.phone;

    return next;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: `${dial} ${data.get("phone")}`,
          preferredContact: method,
          message: data.get("message") || "",
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        className="border border-accent/30 bg-sand-50 px-8 py-14 text-center sm:px-12"
        role="status"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          className="mx-auto h-12 w-12 text-accent-text"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" opacity={0.3} />
          <path d="m7.5 12.5 3 3 6-6.5" />
        </svg>
        <h3 className="mt-6 font-serif text-3xl font-light">{copy.successHeading}</h3>
        <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
          {copy.successBody}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="eyebrow mt-8 border-b border-accent pb-1 text-accent-text transition-opacity hover:opacity-70"
        >
          {copy.successAgain}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-9">
      <Field
        id={`${id}-name`}
        name="name"
        label={copy.name}
        autoComplete="name"
        error={errors.name}
        required
      />

      <div className="grid gap-9 sm:grid-cols-2">
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

        <div>
          <label htmlFor={`${id}-phone`} className="eyebrow text-ink-mute">
            {copy.phone} <span className="text-accent-text">*</span>
          </label>
          <div className="mt-1 flex items-stretch gap-2.5">
            {/*
              The native select is laid over a compact display of just the dial
              code, so the dropdown can still list full country names without
              the closed control overflowing a half-width column.
            */}
            <div className="relative w-[4.75rem] shrink-0 border-b border-ink/20 focus-within:border-accent">
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
              className={`${fieldClass} min-w-0 flex-1 ${errors.phone ? "border-accent" : ""}`}
            />
          </div>
          {errors.phone && (
            <p id={`${id}-phone-error`} className="mt-2 text-[0.8125rem] text-accent-text">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Preferred contact method */}
      <fieldset>
        <legend className="eyebrow text-ink-mute">{copy.preferred}</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {copy.methods.map((option) => (
            <label
              key={option}
              className={`eyebrow cursor-pointer border px-5 py-3 transition-colors ${
                method === option
                  ? "border-accent bg-accent text-ink"
                  : "border-ink/20 text-ink hover:border-accent/60"
              }`}
            >
              <input
                type="radio"
                name="preferredContact"
                value={option}
                checked={method === option}
                onChange={() => setMethod(option)}
                // Distinguishes these from the "Email" text field above
                aria-label={`Contact me by ${option}`}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

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

      {status === "error" && (
        <p role="alert" className="text-[0.875rem] text-accent-text">
          {copy.errors.generic}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="eyebrow w-full bg-accent px-8 py-4.5 text-ink transition-colors duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
        className={`${fieldClass} mt-1 ${error ? "border-accent" : ""}`}
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
