import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, Missing } from "@/components/legal/LegalPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { contactFormConfigured, isLegalReviewed, operator, publicAddressLines } from "@/lib/legal/operator";
import { LEGAL_TEXTS_UPDATED, legalNoindex, missingFor } from "@/lib/legal/pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Impressum",
  description: "Impressum von Lademeter Rechner: Anbieterkennzeichnung nach § 5 DDG und Verantwortlicher nach § 18 Abs. 2 MStV.",
  path: "/impressum/",
  noindex: legalNoindex("impressum"),
});

export default function ImpressumPage() {
  const address = publicAddressLines();
  const editorial = operator.editorialResponsible;

  return (
    <LegalPage
      title="Impressum"
      path="/impressum/"
      updatedAt={LEGAL_TEXTS_UPDATED}
      missing={missingFor("impressum")}
      reviewed={isLegalReviewed()}
    >
      <LegalSection title="Anbieter (Angaben gemäß § 5 DDG)">
        <p>
          {operator.name ?? <Missing label="Vollständiger Name bzw. Firma inkl. Rechtsform" />}
          <br />
          {address ? (
            address.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))
          ) : operator.publishAddress ? (
            <>
              <Missing label="Anschrift (Straße und Hausnummer bzw. Gebäude und Ortsteil, Postleitzahl, Ort; kein Postfach)" />
              <br />
              {operator.country}
            </>
          ) : null}
        </p>
        {operator.kind === "company" ? (
          <p>
            Vertreten durch:{" "}
            {operator.representatives ?? <Missing label="Vertretungsberechtigte Person(en)" />}
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail:{" "}
          {operator.email ? (
            <a href={`mailto:${operator.email}`} className="text-brand-700 underline">
              {operator.email}
            </a>
          ) : (
            <Missing label="E-Mail-Adresse" />
          )}
          {operator.phone ? (
            <>
              <br />
              Telefon: {operator.phone}
            </>
          ) : null}
          {contactFormConfigured() ? (
            <>
              <br />
              Kontaktformular: <Link href="/kontakt/" className="text-brand-700 underline">lademeter-rechner.de/kontakt</Link>
            </>
          ) : null}
          {!operator.phone && !contactFormConfigured() ? (
            <>
              <br />
              <Missing label="Zweiter schneller Kontaktweg (Telefon oder funktionierendes Kontaktformular)" />
            </>
          ) : null}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Zentrale Kontaktstelle für Nutzer und Behörden nach Art. 11 und 12 der Verordnung (EU) 2022/2065 (Digital Services Act, DSA):{" "}
          {operator.email ? (
            <a href={`mailto:${operator.email}`} className="text-brand-700 underline">
              {operator.email}
            </a>
          ) : (
            <Missing label="E-Mail-Adresse" />
          )}. Kommunikationssprachen: Deutsch, Englisch.
        </p>
      </LegalSection>

      {operator.register ? (
        <LegalSection title="Registereintrag">
          <p>{operator.register}</p>
        </LegalSection>
      ) : null}

      {operator.vatId ? (
        <LegalSection title="Umsatzsteuer-Identifikationsnummer / Wirtschafts-Identifikationsnummer">
          <p>{operator.vatId}</p>
        </LegalSection>
      ) : null}

      <LegalSection title="Redaktionelle Verantwortlichkeit (§ 18 Abs. 2 MStV, soweit anwendbar)">
        {operator.editorialResponsibilityReview?.applies && editorial ? (
          <p>
            {editorial.name}
            <br />
            {editorial.address}
          </p>
        ) : operator.editorialResponsibilityReview?.applies === false ? (
          <p>
            Einschätzung des Betreibers vom {operator.editorialResponsibilityReview.reviewedAt}: Dieses Angebot besteht
            aus Online-Rechnern und sachlichen Ratgebern. Es ist nach Einschätzung des Betreibers nicht
            journalistisch-redaktionell gestaltet im Sinne von § 18 Abs. 2 MStV; ein Verantwortlicher nach dieser
            Vorschrift wird deshalb nicht benannt. Die Einschätzung ist keine Rechtsberatung und nicht anwaltlich
            geprüft.
          </p>
        ) : (
          <p>
            <Missing label="Fachliche Prüfung der Anwendbarkeit; falls anwendbar: verantwortliche Person mit ständigem Aufenthalt in Deutschland" />
          </p>
        )}
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung (§ 36 VSBG)">
        <p>{operator.consumerDisputeStatement ?? <Missing label="Geprüfte Erklärung zur Verbraucherstreitbeilegung nach § 36 VSBG" />}</p>
      </LegalSection>

      <LegalSection title="Weitere Hinweise">
        <p>
          Hinweise zur Haftung für Inhalte, Berechnungsergebnisse und externe Links finden Sie im{" "}
          <Link href="/haftungsausschluss/" className="text-brand-700 underline">
            Haftungsausschluss
          </Link>
          , Informationen zur Verarbeitung personenbezogener Daten in der{" "}
          <Link href="/datenschutz/" className="text-brand-700 underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
