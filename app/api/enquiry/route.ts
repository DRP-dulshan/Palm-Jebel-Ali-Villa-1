import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type Lead = {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  message: string;
  /** Set server-side */
  receivedAt: string;
  source: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const preferredContact = String(body.preferredContact ?? "WhatsApp").trim();
  const message = String(body.message ?? "").trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "A full name is required.";
  if (!emailPattern.test(email)) errors.email = "A valid email is required.";
  if (phone.replace(/\D/g, "").length < 6)
    errors.phone = "A valid phone number is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const lead: Lead = {
    name,
    email,
    phone,
    preferredContact,
    message: message.slice(0, 2000),
    receivedAt: new Date().toISOString(),
    source: "wave-crest-landing",
  };

  await deliverLead(lead);

  return NextResponse.json({ ok: true }, { status: 201 });
}

/* ------------------------------------------------------------------
 * LEAD DELIVERY
 *
 * Right now this just logs the lead to the server console (visible in
 * `npm run dev`, and under Runtime Logs on Vercel).
 *
 * To connect email or a CRM later, add it below — the shape of `lead`
 * stays the same, so nothing else on the site needs to change.
 *
 * Example — email via Resend:
 *
 *   const res = await fetch("https://api.resend.com/emails", {
 *     method: "POST",
 *     headers: {
 *       Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify({
 *       from: "Wave Crest <leads@yourdomain.com>",
 *       to: [process.env.LEAD_INBOX!],
 *       subject: `New enquiry — ${lead.name}`,
 *       text: JSON.stringify(lead, null, 2),
 *     }),
 *   });
 *
 * Example — forward to a CRM / Zapier / Make webhook:
 *
 *   await fetch(process.env.CRM_WEBHOOK_URL!, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(lead),
 *   });
 *
 * Wrap whatever you add in try/catch so a downstream outage never
 * returns an error to the person filling in the form.
 * ------------------------------------------------------------------ */
async function deliverLead(lead: Lead) {
  console.log("[enquiry] new lead", JSON.stringify(lead, null, 2));
}
