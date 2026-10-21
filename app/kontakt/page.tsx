import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/content/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { formatAddressLines, operator } from "@/lib/legal/operator";

const breadcrumbItems = [{ label: "Kontakt", href: "/kontakt/" }];

export const metadata: Metadata = buildPageMetadata({
  title: "Kontakt",
  description:
    "Kontakt zu Lademeter Rechner: Senden Sie uns Ihre Fragen, Fehlerhinweise oder Feedback zu den Rechnern und Ratgebern.",
  path: "/kontakt/",
  noindex: !operator.email,
});

export default function KontaktPage() {
  const address = formatAddressLines();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title="Kontakt"
        breadcrumbs={breadcrumbItems}
        description={
          <>
            Sie haben einen Fehler in einem Rechner entdeckt, eine Frage zur Berechnung oder einen
            Verbesserungsvorschlag? Nutzen Sie unser Kontaktformular oder schreiben Sie uns direkt per
            E-Mail an{" "}
            {operator.email ? (
              <a href={`mailto:${operator.email}`} className="font-medium text-brand-700 underline underline-offset-2">
                {operator.email}
              </a>
            ) : null}
            .
          </>
        }
      />
      <Container className="max-w-3xl py-10">
        <div className="mt-4">
          <ContactForm fallbackEmail={operator.email} />
        </div>

        {address ? (
          <div className="mt-10 rounded-xl border border-slate-200/80 bg-white p-5 text-sm leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-900">Postanschrift</p>
            <p className="mt-1">
              {operator.name}
              {address.map((line) => (
                <span key={line}>
                  <br />
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Schneller erreichen Sie uns per E-Mail oder über das Kontaktformular. Alle Anbieterangaben
              finden Sie im{" "}
              <Link href="/impressum/" className="font-medium text-brand-700 underline underline-offset-2">
                Impressum
              </Link>
              .
            </p>
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50 p-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p className="font-semibold text-slate-800">Hinweis zur Bearbeitung:</p>
          <p className="mt-1">
            Wir prüfen Hinweise und Rückmeldungen gewissenhaft und antworten so schnell wie möglich.
            Bitte beachten Sie, dass über dieses Formular keine Rechts-, Ladeplanungs- oder
            Ladungssicherungsberatung für Einzelfälle erfolgt.
          </p>
        </div>
      </Container>
    </>
  );
}
