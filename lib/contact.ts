/** Shared validation for the contact form (client and API route). */

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot - must stay empty. */
  website: string;
  /** Milliseconds since the form was rendered (simple bot time-trap). */
  elapsedMs: number;
  /** Privacy notice acknowledged. */
  privacyAcknowledged: boolean;
};

export type ContactErrors = Partial<Record<"name" | "email" | "message" | "privacyAcknowledged", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const CONTACT_LIMITS = { name: 100, email: 200, subject: 150, message: 5000 } as const;

export function validateContact(payload: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const message = (payload.message ?? "").trim();

  if (name.length < 2 || name.length > CONTACT_LIMITS.name) errors.name = "Bitte geben Sie Ihren Namen an.";
  if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_LIMITS.email)
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (message.length < 10) errors.message = "Bitte schreiben Sie mindestens 10 Zeichen.";
  if (message.length > CONTACT_LIMITS.message)
    errors.message = `Bitte kürzen Sie die Nachricht auf höchstens ${CONTACT_LIMITS.message} Zeichen.`;
  if (!payload.privacyAcknowledged) errors.privacyAcknowledged = "Bitte bestätigen Sie den Datenschutzhinweis.";
  return errors;
}

/** True if the submission looks automated (honeypot filled or submitted implausibly fast). */
export function looksLikeSpam(payload: Partial<ContactPayload>): boolean {
  return Boolean(payload.website) || typeof payload.elapsedMs !== "number" || payload.elapsedMs < 3000;
}
