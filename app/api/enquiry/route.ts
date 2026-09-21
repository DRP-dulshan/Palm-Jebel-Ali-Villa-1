import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type Lead = {
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
  utm: { source: string; medium: string; campaign: string };
  pageUrl: string;
  receivedAt: string;
};

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
    title: clean(body.title, 10),
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    interest: clean(body.interest, 120),
    area: clean(body.area, 120),
    bedrooms: clean(body.bedrooms, 10),
    budget: clean(body.budget, 40),
    message: clean(body.message, 2000),
    consent: Boolean(body.consent),
    utm: {
      source: clean((body.utm as Record<string, unknown>)?.source, 120),
      medium: clean((body.utm as Record<string, unknown>)?.medium, 120),
      campaign: clean((body.utm as Record<string, unknown>)?.campaign, 120),
    },
    pageUrl: clean(body.pageUrl, 500),
    receivedAt: dubaiTime(),
  };

  const errors: Record<string, string> = {};
  if (lead.name.length < 2) errors.name = "A full name is required.";
  if (!emailPattern.test(lead.email)) errors.email = "A valid email is required.";
  if (lead.phone.replace(/\D/g, "").length < 6)
    errors.phone = "A valid contact number is required.";
  if (!lead.interest) errors.interest = "An interest selection is required.";
  if (!lead.consent) errors.consent = "Consent to be contacted is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const delivered = await deliverLead(lead);
  if (!delivered) {
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

  const utm =
    lead.utm.source || lead.utm.medium || lead.utm.campaign
      ? [lead.utm.source, lead.utm.medium, lead.utm.campaign]
          .filter(Boolean)
          .join(" · ")
      : "";

  const html = `
    <div style="background:#f5f1e7;padding:32px">
      <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px">
        <p style="margin:0 0 4px;color:#6e6555;font:12px/1.5 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.18em">New lead</p>
        <h1 style="margin:0 0 24px;color:#0d2638;font:300 26px/1.2 Georgia,serif">Wave Crest · Palm Jebel Ali, Frond A</h1>
        <table style="border-collapse:collapse;width:100%">
          ${row("Name", [lead.title, lead.name].filter(Boolean).join(" "))}
          ${row("Email", lead.email)}
          ${row("Phone", lead.phone)}
          ${row("Interested in", lead.interest)}
          ${row("Area", lead.area)}
          ${row("Bedrooms", lead.bedrooms)}
          ${row("Budget", lead.budget)}
          ${row("Message", lead.message)}
          ${row("Consent", lead.consent ? "Yes" : "No")}
          ${row("Received", lead.receivedAt)}
          ${row("Campaign", utm)}
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
      subject: `New Lead – Wave Crest PJA Frond A – ${lead.name}`,
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
