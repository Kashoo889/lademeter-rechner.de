import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isLegalReviewed } from "@/lib/legal/operator";
import { LEGAL_TEXTS_UPDATED, legalNoindex } from "@/lib/legal/pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Haftungsausschluss",
  description:
    "Haftungsausschluss von Lademeter Rechner: Hinweise zu Berechnungsergebnissen, Inhalten, externen Links und Werbung.",
  path: "/haftungsausschluss/",
  noindex: legalNoindex("general"),
});

export default function HaftungsausschlussPage() {
  return (
    <LegalPage
      title="Haftungsausschluss"
      path="/haftungsausschluss/"
      updatedAt={LEGAL_TEXTS_UPDATED}
      reviewed={isLegalReviewed()}
    >
      <LegalSection title="Berechnungsergebnisse">
        <p>
          Die Rechner liefern rechnerische Näherungswerte auf Grundlage Ihrer Eingaben und typischer
          Standardmaße (z. B. Ladebreite 2,40 m, Europalette 1200 × 800 mm). Reale Fahrzeuge,
          Ladungsträger und Packstücke weichen davon häufig ab. Nicht berücksichtigt werden unter
          anderem Ladungssicherung, Achslastverteilung, Schwerpunktlage, Stabilität und
          Druckbelastbarkeit der Ware, Ladereihenfolge, Toleranzen sowie Tarif- und
          Rundungsregeln einzelner Spediteure. Die Ergebnisse ersetzen daher keine fachkundige,
          verbindliche Ladeplanung. Welche Annahmen im Einzelnen gelten, erläutern wir auf der Seite{" "}
          <Link href="/methodik/" className="text-brand-700 underline">
            Berechnungsgrundlagen
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Inhalte">
        <p>
          Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität können wir dennoch keine Gewähr übernehmen.
          Insbesondere ersetzen Hinweise zu Rechtsvorschriften (z. B. Ladungssicherung, Gewichte,
          Achslasten) keine Rechtsberatung; maßgeblich ist stets die jeweils geltende Fassung der
          Vorschriften. Die Verantwortlichkeit für eigene und fremde Inhalte richtet sich nach dem
          jeweils anwendbaren Recht, einschließlich der Verordnung (EU) 2022/2065 (Digital Services
          Act), soweit deren Voraussetzungen erfüllt sind.
        </p>
      </LegalSection>

      <LegalSection title="Externe Links">
        <p>
          Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Für diese Inhalte ist der jeweilige Anbieter oder Betreiber verantwortlich.
          Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Werden uns
          Rechtsverletzungen bekannt, entfernen wir derartige Links umgehend.
        </p>
      </LegalSection>

      <LegalSection title="Werbung">
        <p>
          Als „Anzeige“ gekennzeichnete Inhalte stammen von Dritten. Wir machen uns deren Inhalte nicht
          zu eigen und übernehmen keine Gewähr für beworbene Produkte oder Dienstleistungen.
        </p>
      </LegalSection>

      <LegalSection title="Hinweise auf Fehler">
        <p>
          Wenn Ihnen ein Fehler in einem Rechner oder Artikel auffällt, freuen wir uns über eine
          Nachricht über die{" "}
          <Link href="/kontakt/" className="text-brand-700 underline">
            Kontaktseite
          </Link>
          . Wir prüfen Hinweise und korrigieren bestätigte Fehler.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
