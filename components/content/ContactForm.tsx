"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToolNotice } from "@/components/calculator/ToolNotice";
import { CONTACT_LIMITS, validateContact, type ContactErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error" | "unavailable" | "rate-limited";

const inputClass =
  "rounded-md border border-slate-300 px-3.5 py-2.5 text-base shadow-sm transition-colors focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm";

/**
 * Fully functional, responsive contact form that posts to /api/kontakt/.
 * Delivers submissions via Resend to the operator email.
 * Includes client and server validation, spam traps, rate-limit handling,
 * loading indicator, and verified fallback messaging.
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
    if (errors[field as keyof ContactErrors]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field as keyof ContactErrors];
        return next;
      });
    }
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
        setErrors({});
      } else if (response.status === 422) {
        const data = await response.json().catch(() => null);
        if (data?.fields) {
          setErrors(data.fields);
        }
        setStatus("error");
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

  function handleReset() {
    setStatus("idle");
    startedAt.current = Date.now();
  }

  const fallback = fallbackEmail ? (
    <>
      Bitte schreiben Sie uns direkt per E-Mail an{" "}
      <a href={`mailto:${fallbackEmail}`} className="font-medium underline hover:text-brand-900">
        {fallbackEmail}
      </a>
      .
    </>
  ) : (
    "Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut."
  );

  if (status === "sent") {
    return (
      <div
        role="region"
        aria-live="polite"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
          <div className="space-y-2">
            <h3 className="font-semibold text-emerald-900 text-base">Nachricht erfolgreich versendet!</h3>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Vielen Dank für Ihre Kontaktaufnahme. Ihre Nachricht wurde sicher übertragen und wird zeitnah
              bearbeitet{fallbackEmail ? ` (Zustellung an ${fallbackEmail})` : ""}.
            </p>
            <div className="pt-2">
              <Button type="button" variant="secondary" onClick={handleReset} className="text-sm">
                Weitere Nachricht senden
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSubmitting = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative max-w-xl space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8"
      noValidate
      aria-describedby={`${formId}-status`}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-name`} className="text-sm font-semibold text-slate-800">
          Name <span aria-hidden="true" className="text-brand-700">*</span>
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={isSubmitting}
          maxLength={CONTACT_LIMITS.name}
          placeholder="Ihr Vor- und Nachname"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={inputClass}
        />
        {errors.name ? (
          <p id={`${formId}-name-error`} className="text-xs font-medium text-red-600" role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-email`} className="text-sm font-semibold text-slate-800">
          E-Mail-Adresse <span aria-hidden="true" className="text-brand-700">*</span>
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isSubmitting}
          maxLength={CONTACT_LIMITS.email}
          placeholder="name@beispiel.de"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={inputClass}
        />
        {errors.email ? (
          <p id={`${formId}-email-error`} className="text-xs font-medium text-red-600" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-subject`} className="text-sm font-semibold text-slate-800">
          Betreff <span className="text-xs font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id={`${formId}-subject`}
          name="subject"
          type="text"
          disabled={isSubmitting}
          maxLength={CONTACT_LIMITS.subject}
          placeholder="z. B. Frage zum Lademeter-Rechner oder Fehlerhinweis"
          value={values.subject}
          onChange={(event) => update("subject", event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-message`} className="text-sm font-semibold text-slate-800">
          Ihre Nachricht <span aria-hidden="true" className="text-brand-700">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={6}
          required
          disabled={isSubmitting}
          maxLength={CONTACT_LIMITS.message}
          placeholder="Beschreiben Sie Ihr Anliegen, Ihre Frage oder Ihren Verbesserungsvorschlag …"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={inputClass}
        />
        <div className="flex justify-between items-center text-xs text-slate-400">
          {errors.message ? (
            <p id={`${formId}-message-error`} className="font-medium text-red-600" role="alert">
              {errors.message}
            </p>
          ) : (
            <span>Mindestens 10 Zeichen</span>
          )}
          <span>
            {values.message.length} / {CONTACT_LIMITS.message}
          </span>
        </div>
      </div>

      {/* Honeypot field – hidden from humans, catches automated bots */}
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
        <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyAcknowledged}
            disabled={isSubmitting}
            onChange={(event) => {
              setPrivacyAcknowledged(event.target.checked);
              if (event.target.checked && errors.privacyAcknowledged) {
                setErrors((current) => {
                  const next = { ...current };
                  delete next.privacyAcknowledged;
                  return next;
                });
              }
            }}
            aria-invalid={Boolean(errors.privacyAcknowledged)}
            aria-describedby={errors.privacyAcknowledged ? `${formId}-privacy-error` : undefined}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-brand-600 focus:ring-brand-600"
          />
          <span className="leading-relaxed">
            Ich habe die{" "}
            <Link href="/datenschutz/#kontakt" className="text-brand-700 underline underline-offset-2 hover:text-brand-900">
              Datenschutzerklärung
            </Link>{" "}
            zur Kenntnis genommen. Ich willige ausdrücklich ein, dass meine Angaben an den Betreiber in Pakistan
            übermittelt werden, obwohl für Pakistan kein Angemessenheitsbeschluss der EU-Kommission besteht und mir
            dort möglicherweise weniger Rechte zustehen (Art. 49 Abs. 1 lit. a DSGVO). Ich kann diese Einwilligung
            jederzeit widerrufen.
          </span>
        </label>
        {errors.privacyAcknowledged ? (
          <p id={`${formId}-privacy-error`} className="mt-1 text-xs font-medium text-red-600" role="alert">
            {errors.privacyAcknowledged}
          </p>
        ) : null}
      </div>

      <div id={`${formId}-status`} aria-live="polite" className="space-y-2">
        {status === "unavailable" ? (
          <ToolNotice variant="warning">
            Das Kontaktformular wird derzeit technisch vorbereitet. {fallback}
          </ToolNotice>
        ) : null}
        {status === "rate-limited" ? (
          <ToolNotice variant="warning">
            Zu viele Anfragen in kurzer Zeit. Bitte warten Sie einige Minuten oder nutzen Sie den direkten
            E-Mail-Kontakt: {fallback}
          </ToolNotice>
        ) : null}
        {status === "error" ? (
          <ToolNotice variant="warning">
            Die Nachricht konnte nicht übermittelt werden. {fallback}
          </ToolNotice>
        ) : null}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Wird gesendet …
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              Nachricht senden
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
