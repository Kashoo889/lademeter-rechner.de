import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isLegalReviewed } from "@/lib/legal/operator";
import { LEGAL_TEXTS_UPDATED, legalNoindex } from "@/lib/legal/pages";
import { consentConfig } from "@/lib/consent/config";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie-Richtlinie",
  description:
    "Welche Cookies und vergleichbaren Technologien Lademeter Rechner einsetzt, wofür sie dienen und wie Sie Ihre Einwilligung verwalten oder widerrufen.",
  path: "/cookies/",
  noindex: legalNoindex("general"),
});

type Row = { name: string; provider: string; purpose: string; duration: string; category: string };

export default function CookiesPage() {
  const { cmpProvider, gaId, adsEnabled } = consentConfig;

  const rows: Row[] = [];
  if (cmpProvider === "cookiebot") {
    rows.push({
      name: "CookieConsent",
      provider: "Cookiebot (Usercentrics A/S)",
      purpose: "Speichert Ihre Einwilligungsentscheidung",
      duration: "bis zu 12 Monate (laut Anbieter)",
      category: "Notwendig",
    });
  }
  if (cmpProvider === "usercentrics") {
    rows.push({
      name: "uc_settings, uc_user_interaction u. a. (Local Storage)",
      provider: "Usercentrics GmbH",
      purpose: "Speichert Ihre Einwilligungsentscheidung",
      duration: "laut Anbieterkonfiguration",
      category: "Notwendig",
    });
  }
  if (cmpProvider === "google") {
    rows.push({
      name: "FCCDCF, FCNEC",
      provider: "Google (Datenschutz & Mitteilungen)",
      purpose: "Speichert Ihre Einwilligungsentscheidung",
      duration: "bis zu 13 Monate (laut Anbieter)",
      category: "Notwendig",
    });
  }
  if (cmpProvider) {
    rows.push({
      name: "euconsent-v2",
      provider: "IAB TCF (über die Consent-Plattform)",
      purpose: "TCF-Zustimmungsstring für Werbepartner",
      duration: "bis zu 13 Monate (laut Anbieter)",
      category: "Notwendig",
    });
  }
  if (gaId) {
    rows.push({
      name: "_ga, _ga_<ID>",
      provider: "Google Analytics 4",
      purpose: "Unterscheidung von Besuchern für die Nutzungsstatistik",
      duration: "bis zu 2 Jahre",
      category: "Statistik (Einwilligung)",
    });
  }
  if (adsEnabled) {
    rows.push(
      {
        name: "__gads, __gpi, __eoi",
        provider: "Google AdSense",
        purpose: "Anzeigenauslieferung, Frequenzbegrenzung, Betrugsprävention",
        duration: "bis zu 13 Monate",
        category: "Marketing (Einwilligung)",
      },
      {
        name: "IDE, DSID u. a. (Domain doubleclick.net)",
        provider: "Google",
        purpose: "Personalisierte Werbung und Messung",
        duration: "bis zu 13 Monate",
        category: "Marketing (Einwilligung)",
      },
    );
  }

  return (
    <LegalPage
      title="Cookie-Richtlinie"
      path="/cookies/"
      updatedAt={LEGAL_TEXTS_UPDATED}
      reviewed={isLegalReviewed()}
      intro={
        <p>
          Diese Richtlinie erklärt, welche Cookies und vergleichbaren Technologien (z. B. Local
          Storage) auf lademeter-rechner.de eingesetzt werden. Ergänzende Informationen enthält
          unsere{" "}
          <Link href="/datenschutz/" className="text-brand-700 underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      }
    >
      <LegalSection title="Aktueller Einsatz">
        {rows.length === 0 ? (
          <p>
            <strong>Diese Website setzt derzeit keine Cookies und keine vergleichbaren Technologien ein.</strong>{" "}
            Die Rechner speichern nichts auf Ihrem Gerät; Eingaben für geteilte Links stehen
            ausschließlich in der Seitenadresse. Deshalb ist auch kein Cookie-Banner erforderlich.
          </p>
        ) : (
          <>
            <p>
              Notwendige Einträge speichern ausschließlich Ihre Einwilligungsentscheidung (§ 25 Abs. 2
              Nr. 2 TDDDG). Alle übrigen werden erst gesetzt, nachdem Sie über die
              Einwilligungsverwaltung zugestimmt haben (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a
              DSGVO).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <caption className="sr-only">Eingesetzte Cookies und Speichertechnologien</caption>
                <thead>
                  <tr className="border-b border-slate-300">
                    <th scope="col" className="py-2 pr-3 font-semibold text-slate-900">Name</th>
                    <th scope="col" className="py-2 pr-3 font-semibold text-slate-900">Anbieter</th>
                    <th scope="col" className="py-2 pr-3 font-semibold text-slate-900">Zweck</th>
                    <th scope="col" className="py-2 pr-3 font-semibold text-slate-900">Speicherdauer</th>
                    <th scope="col" className="py-2 font-semibold text-slate-900">Kategorie</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.name} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 font-mono text-xs">{row.name}</td>
                      <td className="py-2 pr-3">{row.provider}</td>
                      <td className="py-2 pr-3">{row.purpose}</td>
                      <td className="py-2 pr-3">{row.duration}</td>
                      <td className="py-2">{row.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-600">
              Namen und Laufzeiten der Cookies von Drittanbietern können sich ändern. Die vollständige,
              aktuelle Liste aller Anbieter und Zwecke finden Sie in der Einwilligungsverwaltung.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title="Einwilligung verwalten und widerrufen">
        {cmpProvider ? (
          <p>
            Sie können Ihre Auswahl jederzeit ändern oder Ihre Einwilligung mit Wirkung für die Zukunft
            widerrufen:{" "}
            <ConsentSettingsButton provider={cmpProvider} className="font-medium text-brand-700 underline" />.
            Der Link „Cookie-Einstellungen“ befindet sich zusätzlich im Fußbereich jeder Seite.
          </p>
        ) : (
          <p>
            Da derzeit keine einwilligungspflichtigen Technologien eingesetzt werden, ist keine
            Einwilligungsverwaltung aktiv. Sobald sich dies ändert, wird diese Richtlinie aktualisiert
            und vor dem Setzen solcher Cookies Ihre Einwilligung eingeholt.
          </p>
        )}
      </LegalSection>

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
