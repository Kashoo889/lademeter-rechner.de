import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isLegalReviewed } from "@/lib/legal/operator";
import { adsActive } from "@/lib/ads/config";
import { LEGAL_TEXTS_UPDATED, legalNoindex, missingFor } from "@/lib/legal/pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Nutzungsbedingungen",
  description:
    "Nutzungsbedingungen für die kostenlosen Rechner und Inhalte von Lademeter Rechner: Leistungsumfang, Ergebnisse ohne Gewähr, Haftung und Urheberrecht.",
  path: "/nutzungsbedingungen/",
  noindex: legalNoindex("nutzungsbedingungen"),
});

export default function NutzungsbedingungenPage() {
  return (
    <LegalPage
      title="Nutzungsbedingungen"
      path="/nutzungsbedingungen/"
      updatedAt={LEGAL_TEXTS_UPDATED}
      missing={missingFor("nutzungsbedingungen")}
      reviewed={isLegalReviewed()}
    >
      <LegalSection title="1. Geltungsbereich">
        <p>
          Diese Bedingungen gelten für die Nutzung der Website lademeter-rechner.de, insbesondere der
          Online-Rechner, der Ratgeber-Artikel und der Referenzseiten. Anbieter ist der im{" "}
          <Link href="/impressum/" className="text-brand-700 underline">
            Impressum
          </Link>{" "}
          genannte Betreiber.
        </p>
      </LegalSection>

      <LegalSection title="2. Leistungsumfang">
        <p>
          Die Nutzung ist kostenlos und ohne Registrierung möglich. Die Rechner führen rein
          rechnerische, geometrische Abschätzungen auf Grundlage Ihrer Eingaben und der auf der Seite{" "}
          <Link href="/methodik/" className="text-brand-700 underline">
            Berechnungsgrundlagen
          </Link>{" "}
          dokumentierten Annahmen durch. Ein Anspruch auf eine bestimmte Verfügbarkeit, auf bestimmte
          Funktionen oder auf den Fortbestand des Angebots besteht nicht. Wir können Inhalte und
          Rechner jederzeit ändern, erweitern oder einstellen.
        </p>
      </LegalSection>

      <LegalSection title="3. Ergebnisse ohne Gewähr – keine verbindliche Ladeplanung">
        <p>
          Die Ergebnisse dienen der ersten Orientierung. Sie ersetzen keine verbindliche Ladeplanung,
          keine Prüfung der Ladungssicherung, der Achslasten und des zulässigen Gesamtgewichts und keine
          Prüfung durch fachkundige Personen. Maßgeblich sind stets die tatsächlichen Fahrzeug- und
          Ladungsmaße, die Fahrzeugpapiere, die Tarif- und Vertragsbedingungen Ihrer Vertragspartner
          sowie die geltenden Vorschriften (u. a. § 22 StVO, § 412 HGB). Für die Richtigkeit Ihrer
          Eingaben und die Entscheidung, wie Sie die Ergebnisse verwenden, sind Sie selbst
          verantwortlich.
        </p>
      </LegalSection>

      <LegalSection title="4. Zulässige Nutzung">
        <p>Bei der Nutzung ist insbesondere untersagt,</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>die Website durch automatisierte Massenabfragen zu überlasten oder ihre Sicherheitsmechanismen zu umgehen,</li>
          <li>Inhalte der Website systematisch auszulesen und in eigenen Angeboten zu veröffentlichen,</li>
          <li>über Formulare rechtswidrige Inhalte oder Werbung zu versenden.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Urheberrecht und Verlinkung">
        <p>
          Texte, Grafiken, Tabellen und die Software der Rechner sind urheberrechtlich geschützt. Eine
          Vervielfältigung oder Verbreitung über die gesetzlich erlaubte Nutzung (z. B. das Zitatrecht
          nach § 51 UrhG) hinaus bedarf unserer vorherigen Zustimmung. Das Setzen von Links auf
          einzelne Seiten sowie das Teilen von Ergebnis-Links ist ausdrücklich erwünscht. Eigene
          Berechnungsergebnisse dürfen Sie frei verwenden. Ausgenommen vom Vorbehalt sind die{" "}
          <Link href="/lademeter-excel-vorlage/" className="text-brand-700 underline">
            Excel-Vorlage
          </Link>{" "}
          und die{" "}
          <Link href="/lademeter-aufgaben/" className="text-brand-700 underline">
            Aufgabenblätter
          </Link>
          : Sie stehen unter der Lizenz CC BY 4.0 und dürfen bei Namensnennung frei genutzt und weitergegeben werden.
        </p>
      </LegalSection>

      <LegalSection title="6. Haftung">
        <p>
          Die Haftung des Betreibers richtet sich nach dem zwingend anwendbaren Recht. Gesetzlich nicht
          abdingbare Ansprüche und Rechte werden durch diese Nutzungsbedingungen nicht eingeschränkt.
          Die Rechnergebnisse sind unverbindliche Orientierungshilfen und müssen vor einer betrieblichen
          oder sicherheitsrelevanten Verwendung fachlich geprüft werden. Weitere Hinweise enthält der{" "}
          <Link href="/haftungsausschluss/" className="text-brand-700 underline">
            Haftungsausschluss
          </Link>
          .
        </p>
      </LegalSection>

      {adsActive ? (
        <LegalSection title="7. Werbung">
          <p>
            Das Angebot wird durch Werbung finanziert. Anzeigen sind als „Anzeige“ gekennzeichnet und
            stammen von Dritten; für deren Inhalte sind die jeweiligen Werbetreibenden verantwortlich.
            Anzeigen beeinflussen weder die Berechnungen noch die redaktionellen Inhalte.
          </p>
        </LegalSection>
      ) : null}

      <LegalSection title={`${adsActive ? 8 : 7}. Datenschutz`}>
        <p>
          Informationen zur Verarbeitung personenbezogener Daten enthält unsere{" "}
          <Link href="/datenschutz/" className="text-brand-700 underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title={`${adsActive ? 9 : 8}. Änderungen und anwendbares Recht`}>
        <p>
          Wir können diese Bedingungen für die Zukunft anpassen; es gilt die jeweils hier
          veröffentlichte Fassung. Welches Recht auf die Nutzung dieses grenzüberschreitenden Angebots
          anwendbar ist, bestimmt sich nach den einschlägigen Regeln des internationalen Privatrechts.
          Zwingende Verbraucherschutzvorschriften am gewöhnlichen Aufenthaltsort der Nutzerinnen und
          Nutzer bleiben unberührt. Eine darüber hinausgehende Rechtswahl wird nicht erklärt.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
