import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { ConsentSettingsButton } from "@/components/ads/ConsentSettingsButton";
import { adsActive } from "@/lib/ads/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isLegalReviewed } from "@/lib/legal/operator";
import { LEGAL_TEXTS_UPDATED, legalNoindex } from "@/lib/legal/pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie-Richtlinie",
  description:
    "Welche Cookies und ähnlichen Technologien Lademeter Rechner einsetzt, wofür sie dienen und wie Sie Ihre Einwilligung verwalten oder Cookies löschen.",
  path: "/cookies/",
  noindex: legalNoindex("cookies"),
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie-Richtlinie"
      path="/cookies/"
      updatedAt={LEGAL_TEXTS_UPDATED}
      reviewed={isLegalReviewed()}
      intro={
        <p>
          Diese Richtlinie erklärt, ob auf lademeter-rechner.de Cookies oder vergleichbare Technologien
          (z. B. Local Storage) eingesetzt werden. Ergänzende Informationen enthält unsere{" "}
          <Link href="/datenschutz/" className="text-brand-700 underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      }
    >
      {adsActive ? (
        <>
          <LegalSection title="Aktueller Einsatz">
            <p>
              Diese Website zeigt Werbung über Google AdSense. Dabei setzen Google und seine Partner
              Cookies und vergleichbare Technologien ein, um Anzeigen auszuliefern, ihre Wirkung zu
              messen, Betrug zu verhindern und – nur mit Ihrer Einwilligung – Anzeigen zu
              personalisieren. Die Rechner selbst speichern nichts auf Ihrem Gerät; Eingaben für geteilte
              Links stehen ausschließlich in der Seitenadresse. Wir verwenden keine eigenen Analyse- oder
              Tracking-Dienste.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Einwilligungsentscheidung</strong> (Cookies wie „FCCDCF“, „FCNEC“; Anbieter: Google
                „Datenschutz &amp; Mitteilungen“): speichert Ihre Auswahl; notwendig, Laufzeit laut Anbieter
                bis zu 13 Monate.
              </li>
              <li>
                <strong>Werbung</strong> (u. a. „__gads“, „__gpi“, „IDE“; Anbieter: Google): Auslieferung,
                Frequenzbegrenzung, Messung und – bei Einwilligung – personalisierte Werbung; Laufzeit laut
                Anbieter bis zu 13 Monate.
              </li>
            </ul>
            <p className="text-sm text-slate-600">
              Namen und Laufzeiten der Cookies von Drittanbietern können sich ändern. Die vollständige,
              aktuelle Liste aller Anbieter und Zwecke finden Sie in der Einwilligungsverwaltung.
            </p>
          </LegalSection>

          <LegalSection title="Einwilligung verwalten und widerrufen">
            <p>
              Alle Cookies außer der Speicherung Ihrer Entscheidung werden erst nach Ihrer Einwilligung
              gesetzt (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Auswahl jederzeit
              ändern oder mit Wirkung für die Zukunft widerrufen:{" "}
              <ConsentSettingsButton className="font-medium text-brand-700 underline" />. Der Link
              „Datenschutzeinstellungen“ befindet sich zusätzlich im Fußbereich jeder Seite.
            </p>
          </LegalSection>
        </>
      ) : (
        <>
          <LegalSection title="Aktueller Einsatz">
            <p>
              <strong>Diese Website setzt keine Cookies und keine vergleichbaren Technologien ein.</strong>{" "}
              Die Rechner speichern nichts auf Ihrem Gerät; Eingaben für geteilte Links stehen
              ausschließlich in der Seitenadresse. Wir verwenden keine Analyse-, Tracking- oder
              Werbedienste. Schriftarten werden von unserem eigenen Server geladen. Deshalb ist auch kein
              Cookie-Banner erforderlich.
            </p>
          </LegalSection>

          <LegalSection title="Änderungen">
            <p>
              Sollten wir künftig Technologien einsetzen, die Informationen auf Ihrem Endgerät speichern
              oder darauf zugreifen und einer Einwilligung bedürfen (§ 25 Abs. 1 TDDDG), aktualisieren wir
              diese Richtlinie und holen vorab Ihre Einwilligung ein.
            </p>
          </LegalSection>
        </>
      )}

      <LegalSection title="Cookies im Browser verwalten">
        <p>
          Unabhängig davon können Sie Cookies in Ihrem Browser jederzeit einsehen, löschen oder
          blockieren. Anleitungen bieten die Hersteller, z. B. für{" "}
          <ExternalLink href="https://support.google.com/chrome/answer/95647?hl=de">Google Chrome</ExternalLink>,{" "}
          <ExternalLink href="https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen">Mozilla Firefox</ExternalLink>,{" "}
          <ExternalLink href="https://support.apple.com/de-de/guide/safari/sfri11471/mac">Safari</ExternalLink> und{" "}
          <ExternalLink href="https://support.microsoft.com/de-de/microsoft-edge">Microsoft Edge</ExternalLink>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
