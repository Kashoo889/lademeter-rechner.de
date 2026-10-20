import { CONTACT_LIMITS, looksLikeSpam, validateContact, type ContactPayload } from "@/lib/contact";
import { contactFormConfigured, operator } from "@/lib/legal/operator";

/**
 * Contact form endpoint. Delivers messages via the Resend HTTP API when
 * RESEND_API_KEY is set; the recipient is the operator e-mail from
 * lib/legal/operator.ts (mkashifshah10@gmail.com). Otherwise it answers 503 and
 * the form displays the honest e-mail fallback.
 *
 * Sender: Resend's shared test address (onboarding@resend.dev) by default, or
 * a custom verified sender specified via RESEND_FROM_EMAIL.
 *
 * Abuse protection: honeypot + time trap, payload size limit, CSRF protection,
 * and an in-memory sliding-window rate limit per IP.
 */

const DEFAULT_FROM = "Lademeter Rechner <onboarding@resend.dev>";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

export function _resetRateLimits(): void {
  hits.clear();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT_MAX;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
  const cleanSubject = `[Kontakt lademeter-rechner.de] ${subject}`.replace(/[\r\n]+/g, " ");

  const textBody = `Neue Nachricht über das Kontaktformular von lademeter-rechner.de\n\nName: ${name}\nE-Mail: ${email}\nBetreff: ${subject}\n\nNachricht:\n${message}\n`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #0f172a; padding: 16px 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 18px; margin: 0;">Lademeter Rechner – Kontaktanfrage</h1>
  </div>
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;"><strong>Absender:</strong> ${escapeHtml(name)} &lt;<a href="mailto:${escapeHtml(email)}" style="color: #0284c7;">${escapeHtml(email)}</a>&gt;</p>
    <p><strong>Betreff:</strong> ${escapeHtml(subject)}</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <p style="margin-bottom: 8px;"><strong>Nachricht:</strong></p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; white-space: pre-wrap; font-size: 15px;">${escapeHtml(message)}</div>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
      Diese Nachricht wurde über das Kontaktformular von <a href="https://lademeter-rechner.de/kontakt/" style="color: #0284c7;">lademeter-rechner.de</a> an ${escapeHtml(operator.email ?? "")} gesendet.
    </p>
  </div>
</body>
</html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [operator.email],
      reply_to: email,
      subject: cleanSubject,
      text: textBody,
      html: htmlBody,
    }),
  }).catch(() => null);

  if (!response || !response.ok) {
    return json({ ok: false, error: "delivery-failed" }, 502);
  }

  return json({ ok: true });
}
