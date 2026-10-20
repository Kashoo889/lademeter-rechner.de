import { CONTACT_LIMITS, looksLikeSpam, validateContact, type ContactPayload } from "@/lib/contact";
import { contactFormConfigured } from "@/lib/legal/operator";

/**
 * Contact form endpoint. Delivers messages via the Resend HTTP API when
 * RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are configured;
 * otherwise it answers 503 and the form shows the e-mail fallback - it never
 * pretends a message was sent.
 *
 * Abuse protection: honeypot + time trap, payload size limit and a simple
 * in-memory rate limit per IP (best effort on serverless; the IP is not
 * persisted).
 */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT_MAX;
}

function json(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!contactFormConfigured()) {
    return json({ ok: false, error: "not-configured" }, 503);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "unsupported-media-type" }, 415);
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ ok: false, error: "cross-site" }, 403);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return json({ ok: false, error: "rate-limited" }, 429);
  }

  const raw = await request.text();
  if (raw.length > 20_000) return json({ ok: false, error: "too-large" }, 413);

  let payload: Partial<ContactPayload>;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  // Pretend success for bots so they do not retry, but send nothing.
  if (looksLikeSpam(payload)) return json({ ok: true });

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) return json({ ok: false, error: "validation", fields: errors }, 422);

  const name = String(payload.name).trim().slice(0, CONTACT_LIMITS.name);
  const email = String(payload.email).trim().slice(0, CONTACT_LIMITS.email);
  const subject = String(payload.subject ?? "").trim().slice(0, CONTACT_LIMITS.subject) || "Ohne Betreff";
  const message = String(payload.message).trim().slice(0, CONTACT_LIMITS.message);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `[Kontakt lademeter-rechner.de] ${subject}`.replace(/[\r\n]+/g, " "),
      text: `Name: ${name}\nE-Mail: ${email}\nBetreff: ${subject}\n\n${message}`,
    }),
  }).catch(() => null);

  if (!response || !response.ok) {
    return json({ ok: false, error: "delivery-failed" }, 502);
  }

  return json({ ok: true });
}
