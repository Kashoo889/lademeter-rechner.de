"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ToolNotice } from "@/components/calculator/ToolNotice";
import { CONTACT_LIMITS, validateContact, type ContactErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error" | "unavailable" | "rate-limited";

const inputClass =
  "rounded-md border border-slate-300 px-3 py-2.5 text-base shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 sm:text-sm";

/**
 * Contact form that posts to /api/kontakt. Shows an honest error with the
 * e-mail fallback if delivery is not configured or fails.
 */
export function ContactForm({ fallbackEmail }: { fallbackEmail: string | null }) {
  const formId = useId();
  const startedAt = useRef(0);
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload = { ...values, privacyAcknowledged, elapsedMs: Date.now() - startedAt.current };
    const nextErrors = validateContact(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/kontakt/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus("sent");
        setValues({ name: "", email: "", subject: "", message: "", website: "" });
        setPrivacyAcknowledged(false);
      } else if (response.status === 503) {
        setStatus("unavailable");
      } else if (response.status === 429) {
        setStatus("rate-limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const fallback = fallbackEmail ? (
    <>
      Bitte schreiben Sie uns direkt an{" "}
      <a href={`mailto:${fallbackEmail}`} className="font-medium underline">
        {fallbackEmail}
      </a>
      .
    </>
  ) : (
    "Bitte versuchen Sie es später erneut."
  );

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl space-y-4" noValidate aria-describedby={`${formId}-status`}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-name`} className="text-sm font-medium text-slate-800">
          Name <span aria-hidden="true" className="text-brand-700">*</span>
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.name}
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={inputClass}
        />
        {errors.name ? <p id={`${formId}-name-error`} className="text-xs font-medium text-red-700">{errors.name}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-email`} className="text-sm font-medium text-slate-800">
          E-Mail <span aria-hidden="true" className="text-brand-700">*</span>
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={CONTACT_LIMITS.email}
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={inputClass}
        />
        {errors.email ? <p id={`${formId}-email-error`} className="text-xs font-medium text-red-700">{errors.email}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-subject`} className="text-sm font-medium text-slate-800">
          Betreff
        </label>
        <input
          id={`${formId}-subject`}
          name="subject"
          type="text"
          maxLength={CONTACT_LIMITS.subject}
          value={values.subject}
          onChange={(event) => update("subject", event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-message`} className="text-sm font-medium text-slate-800">
          Nachricht <span aria-hidden="true" className="text-brand-700">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={6}
          required
          maxLength={CONTACT_LIMITS.message}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={inputClass}
        />
        {errors.message ? <p id={`${formId}-message-error`} className="text-xs font-medium text-red-700">{errors.message}</p> : null}
      </div>

      {/* Honeypot: hidden from people and assistive technology, bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={privacyAcknowledged}
            onChange={(event) => setPrivacyAcknowledged(event.target.checked)}
            aria-invalid={Boolean(errors.privacyAcknowledged)}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-brand-600"
          />
          <span>
            Ich habe den{" "}
            <Link href="/datenschutz/#kontakt" className="text-brand-700 underline">
              Datenschutzhinweis
            </Link>{" "}
            zur Verarbeitung meiner Angaben zur Beantwortung der Anfrage gelesen.
          </span>
        </label>
        {errors.privacyAcknowledged ? (
          <p className="mt-1 text-xs font-medium text-red-700">{errors.privacyAcknowledged}</p>
        ) : null}
      </div>

      <div id={`${formId}-status`} aria-live="polite">
        {status === "sent" ? (
          <ToolNotice>Vielen Dank! Ihre Nachricht wurde versendet. Wir melden uns so bald wie möglich.</ToolNotice>
        ) : null}
        {status === "unavailable" ? (
          <ToolNotice variant="warning">Das Kontaktformular ist derzeit nicht verfügbar. {fallback}</ToolNotice>
        ) : null}
        {status === "rate-limited" ? (
          <ToolNotice variant="warning">Zu viele Anfragen in kurzer Zeit. {fallback}</ToolNotice>
        ) : null}
        {status === "error" ? (
          <ToolNotice variant="warning">Die Nachricht konnte nicht gesendet werden. {fallback}</ToolNotice>
        ) : null}
      </div>

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
      </Button>
    </form>
  );
}
