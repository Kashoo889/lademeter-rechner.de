import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/content/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { contactFormConfigured, operator } from "@/lib/legal/operator";
import { legalNoindex } from "@/lib/legal/pages";

const breadcrumbItems = [{ label: "Kontakt", href: "/kontakt/" }];

export const metadata: Metadata = buildPageMetadata({
  title: "Kontakt",
  description: "Kontakt zu Lademeter Rechner: Fragen, Fehlerhinweise und Feedback zu Rechnern und Ratgebern.",
  path: "/kontakt/",
  noindex: legalNoindex("general") || (!operator.email && !contactFormConfigured()),
});

export default function KontaktPage() {
  const contactForm = contactFormConfigured();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title="Kontakt"
        breadcrumbs={breadcrumbItems}
        description={
          <>
        Sie haben einen Fehler in einem Rechner entdeckt, eine Frage oder einen Verbesserungsvorschlag?
        Schreiben Sie uns.
        {operator.email ? (
          <>
            {" "}
            Sie erreichen uns auch direkt per E-Mail an{" "}
            <a href={`mailto:${operator.email}`} className="font-medium text-brand-700 underline">
              {operator.email}
            </a>
            .
          </>
        ) : null}
          </>
        }
      />
      <Container className="max-w-3xl py-10">
      {!operator.email && !contactForm ? (
        <p role="note" className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Die Kontaktdaten des Betreibers sind noch nicht hinterlegt (E-Mail-Adresse bzw. Versand für das
          Kontaktformular). Diese Seite ist deshalb noch nicht vollständig.
        </p>
      ) : null}

      {contactForm ? (
        <div className="mt-8">
          <ContactForm fallbackEmail={operator.email} />
        </div>
      ) : (
        <p role="note" className="mt-6 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          Das Kontaktformular ist noch nicht für den Nachrichtenversand eingerichtet. Bitte nutzen Sie
          bis dahin die oben angegebene E-Mail-Adresse.
        </p>
      )}

      <p className="mt-6 text-sm text-slate-600">
        Hinweis: Wir geben keine Rechts- und Ladungssicherungsberatung im Einzelfall. Bitte senden Sie
        keine vertraulichen Daten per E-Mail oder über das Formular.
      </p>
      </Container>
    </>
  );
}
