import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type Lead = {
  /** Which form it came from — see REQUEST_LABELS */
  request: LeadRequest;
  title: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  area: string;
  bedrooms: string;
  budget: string;
  message: string;
  consent: boolean;
  attribution: Attribution;
  pageUrl: string;
  receivedAt: string;
};

export type LeadRequest = "enquiry" | "private" | "brochure";

/** How each kind of request is labelled in the email and the CRM. */
const REQUEST_LABELS: Record<LeadRequest, string> = {
  enquiry: "Enquiry",
  private: "Private Details Request",
  brochure: "Brochure request: floor plans & payment plan",
};

/** Short form for the email subject and the Bitrix lead title. */
const REQUEST_TITLES: Record<LeadRequest, string> = {
  enquiry: "New Lead",
  private: "Private Details Request",
  brochure: "Brochure Request",
};

const isLeadRequest = (v: unknown): v is LeadRequest =>
  typeof v === "string" && Object.hasOwn(REQUEST_LABELS, v);

/** The form no longer asks, so a lead without one is about this villa. */
const DEFAULT_INTEREST = "This villa: Wave Crest, Frond A";

/** Campaign parameters captured on the visitor's landing page. */
type Attribution = Partial<Record<
  "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "gclid",
  string
>>;

const ATTRIBUTION_FIELDS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid",
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

/** Submission time in Dubai, which is what the team works to. */
const dubaiTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date()) + " (GST)";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  /*
   * Honeypot. Bots fill every field they find; people never see this one.
   * Answer 201 so the bot has no signal that it was rejected.
   */
  if (clean(body.company)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const lead: Lead = {
    request: isLeadRequest(body.request) ? body.request : "enquiry",
    title: clean(body.title, 10),
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    interest: clean(body.interest, 120) || DEFAULT_INTEREST,
    area: clean(body.area, 120),
    bedrooms: clean(body.bedrooms, 10),
    budget: clean(body.budget, 40),
    message: clean(body.message, 2000),
    consent: Boolean(body.consent),
    attribution: (() => {
      const raw = (body.attribution ?? {}) as Record<string, unknown>;
      const out: Attribution = {};
      for (const f of ATTRIBUTION_FIELDS) {
        const v = clean(raw[f], 250);
        if (v) out[f] = v;
      }
      return out;
    })(),
    pageUrl: clean(body.pageUrl, 500),
    receivedAt: dubaiTime(),
  };

  const errors: Record<string, string> = {};
  if (lead.name.length < 2) errors.name = "A full name is required.";
  if (!emailPattern.test(lead.email)) errors.email = "A valid email is required.";
  if (lead.phone.replace(/\D/g, "").length < 6)
    errors.phone = "A valid contact number is required.";
  if (!lead.consent) errors.consent = "Consent to be contacted is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  /*
   * Both destinations are attempted together. Only the email decides the
   * response: a CRM outage must never cost us the lead or show the visitor
   * an error, so a Bitrix failure is logged and otherwise ignored.
   */
  const [emailed] = await Promise.all([deliverLead(lead), sendToBitrix(lead)]);

  if (!emailed) {
    return NextResponse.json({ error: "Could not send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

/* ------------------------------------------------------------------
 * LEAD DELIVERY
 *
 * Emails the lead via Resend.
 *   RESEND_API_KEY  — Resend key (required to actually send)
 *   LEAD_EMAIL      — recipient; defaults to the office address below
 *   LEAD_FROM       — verified sender on a domain added to Resend
 *
 * In development a missing key just logs the lead so the form still works.
 * In PRODUCTION a missing key is a hard failure: quietly logging a lead the
 * visitor was told we received is how leads get lost.
 * ------------------------------------------------------------------ */

/** Where leads go unless LEAD_EMAIL overrides it. */
const DEFAULT_LEAD_EMAIL = "office@dubairapidproperties.com";

const row = (label: string, value: string) =>
  value
    ? `<tr>
         <td style="padding:6px 16px 6px 0;color:#6e6555;font:12px/1.5 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;vertical-align:top">${label}</td>
         <td style="padding:6px 0;color:#0d2638;font:15px/1.6 system-ui,sans-serif">${escapeHtml(value)}</td>
       </tr>`
    : "";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );

async function deliverLead(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL || DEFAULT_LEAD_EMAIL;
  const from = process.env.LEAD_FROM ?? "Wave Crest <onboarding@resend.dev>";

  if (!apiKey) {
    // Always record it, so a misconfigured deploy still leaves a trail.
    console.log("[enquiry] new lead", JSON.stringify(lead, null, 2));

    if (process.env.NODE_ENV === "production") {
      console.error(
        "[enquiry] RESEND_API_KEY is not set — refusing to report success for a lead that was never emailed."
      );
      return false;
    }

    console.warn("[enquiry] RESEND_API_KEY not set — logged the lead instead of emailing it.");
    return true;
  }

  const utm = ATTRIBUTION_FIELDS
    .filter((f) => f !== "gclid")
    .map((f) => lead.attribution[f])
    .filter(Boolean)
    .join(" · ");

  const html = `
    <div style="background:#f5f1e7;padding:32px">
      <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px">
        <p style="margin:0 0 4px;color:#6e6555;font:12px/1.5 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.18em">New lead</p>
        <h1 style="margin:0 0 24px;color:#0d2638;font:300 26px/1.2 Georgia,serif">Wave Crest · Palm Jebel Ali, Frond A</h1>
        <table style="border-collapse:collapse;width:100%">
          ${row("Request", REQUEST_LABELS[lead.request])}
          ${row("Name", [lead.title, lead.name].filter(Boolean).join(" "))}
          ${row("Email", lead.email)}
          ${row("WhatsApp", lead.phone)}
          ${row("Interested in", lead.interest)}
          ${row("Area", lead.area)}
          ${row("Bedrooms", lead.bedrooms)}
          ${row("Budget", lead.budget)}
          ${row("Message", lead.message)}
          ${row("Consent", lead.consent ? "Yes" : "No")}
          ${row("Received", lead.receivedAt)}
          ${row("Campaign", utm)}
          ${row("gclid", lead.attribution.gclid ?? "")}
          ${row("Page", lead.pageUrl)}
        </table>
      </div>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: lead.email,
      subject: `${REQUEST_TITLES[lead.request]} – Wave Crest PJA Frond A – ${lead.name}`,
      html,
    });
    if (error) {
      console.error("[enquiry] Resend rejected the message:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[enquiry] could not reach Resend:", err);
    return false;
  }
}


/* ------------------------------------------------------------------
 * BITRIX24
 *
 * Creates a CRM lead through an inbound webhook. The URL carries its own
 * auth token, so it is a secret: it is read from BITRIX_WEBHOOK_URL on the
 * server only and never reaches the browser.
 *
 * Failures here are deliberately swallowed — see the call site.
 * ------------------------------------------------------------------ */

const bitrixComments = (lead: Lead): string => {
  const lines: string[] = [];

  if (lead.message) lines.push(lead.message, "");

  const field = (label: string, value: string) => {
    if (value) lines.push(`${label}: ${value}`);
  };

  field("Request", REQUEST_LABELS[lead.request]);
  field("Interested in", lead.interest);
  field("Preferred area", lead.area);
  field("Bedrooms", lead.bedrooms);
  field("Budget", lead.budget);
  field("Consent to contact", lead.consent ? "Yes" : "No");
  field("Received", lead.receivedAt);
  field("Landing page", lead.pageUrl);
  // Requested explicitly: the click id belongs in the notes, not a UTM field
  field("gclid", lead.attribution.gclid ?? "");

  return lines.join("\n");
};

async function sendToBitrix(lead: Lead): Promise<boolean> {
  const base = process.env.BITRIX_WEBHOOK_URL;

  if (!base) {
    console.warn("[enquiry] BITRIX_WEBHOOK_URL not set — skipping the CRM lead.");
    return false;
  }

  // The method is appended to the webhook base, which must end in a slash.
  const endpoint = `${base.endsWith("/") ? base : base + "/"}crm.lead.add.json`;

  const fields: Record<string, unknown> = {
    // Plain enquiries keep the title they always had
    TITLE: [
      "Palm Jebel Ali Villa",
      lead.request === "enquiry" ? "" : REQUEST_TITLES[lead.request],
      lead.name,
    ]
      .filter(Boolean)
      .join(" - "),
    NAME: lead.name,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
    EMAIL: [{ VALUE: lead.email, VALUE_TYPE: "WORK" }],
    SOURCE_ID: "WEB",
    SOURCE_DESCRIPTION: "Google Ads - palm.nakheel.villas",
    COMMENTS: bitrixComments(lead),
    UTM_SOURCE: lead.attribution.utm_source ?? "",
    UTM_MEDIUM: lead.attribution.utm_medium ?? "",
    UTM_CAMPAIGN: lead.attribution.utm_campaign ?? "",
    UTM_CONTENT: lead.attribution.utm_content ?? "",
    UTM_TERM: lead.attribution.utm_term ?? "",
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { result?: number; error?: string; error_description?: string }
      | null;

    // Bitrix answers 200 with an error body, so the status alone proves nothing
    if (!response.ok || !payload || payload.error || !payload.result) {
      console.error(
        "[enquiry] Bitrix did not create the lead:",
        response.status,
        payload?.error ?? "",
        payload?.error_description ?? ""
      );
      return false;
    }

    console.log(`[enquiry] Bitrix lead created: #${payload.result}`);
    return true;
  } catch (err) {
    console.error("[enquiry] could not reach Bitrix:", err);
    return false;
  }
}
