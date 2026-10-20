import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ContentSection } from "@/components/content/ContentSection";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PALLET_LIST } from "@/lib/calculators/pallets";
import { VEHICLE_LIST } from "@/lib/calculators/vehicles";
import { formatDecimal } from "@/lib/parseDecimal";
import { siteConfig } from "@/lib/site-config";
import { PageHero } from "@/components/layout/PageHero";

const breadcrumbItems = [{ label: "Berechnungsgrundlagen", href: "/methodik/" }];

export const metadata: Metadata = buildPageMetadata({
  title: "Berechnungsgrundlagen: Formeln, Annahmen, Grenzen",
  description:
    "So rechnen die Rechner: Formeln für Lademeter, Palettenstellplätze, Kartons pro Palette, Beladung und Volumengewicht – mit Standardmaßen, Annahmen und Grenzen.",
  path: "/methodik/",
  absoluteTitle: true,
});

export default function MethodikPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title="Berechnungsgrundlagen"
        breadcrumbs={breadcrumbItems}
        description={
          <>
            Hier steht, wie die Rechner arbeiten: welche Formeln gelten, welche Standardmaße hinterlegt sind
        und wo die Grenzen liegen. Stand der Dokumentation: {new Date(siteConfig.lastUpdated).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}.
        Alle Berechnungen laufen im Browser; es werden keine Eingaben übertragen.
          </>
        }
      />
      <Container className="py-10">

      <ContentSection title="Lademeter (Lademeter Rechner)">
        <p>
          <strong>Lademeter = Länge (m) × Breite (m) ÷ 2,4 m</strong>, multipliziert mit den belegten
          Bodenstellplätzen. Die Bezugsbreite von 2,4 m entspricht der üblichen Planungsbreite
          europäischer Sattelauflieger. Bei Stapellagen gilt: <em>Bodenstellplätze = aufgerundet(Anzahl ÷ Lagen)</em>.
          Die Lagenzahl gibt der Nutzer an; der Rechner prüft sie nicht gegen die Fahrzeughöhe.
        </p>
        <p>
          <strong>Frachtpflichtiges Gewicht</strong> = höherer Wert aus tatsächlichem Gewicht und
          Lademeter × Umrechnungsfaktor. Der Faktor (in der Praxis meist 1.500 bis 2.000 kg je Lademeter)
          ist eine Tarifregel der Spedition und wird vom Nutzer eingegeben. Rundungsregeln einzelner
          Spediteure (z. B. Aufrunden auf 0,1 ldm) werden nicht angewendet.
        </p>
      </ContentSection>

      <ContentSection title="Palettenstellplätze (LKW Palettenrechner)">
        <p>
          Die Ladefläche wird als Rechteck betrachtet. Bei „Drehen erlauben“ prüft der Rechner vier
          Verladeschemata und wählt das mit den meisten Stellplätzen (bei Gleichstand das einfachere):
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>alle Paletten längs (wie eingegeben),</li>
          <li>alle Paletten quer (um 90° gedreht),</li>
          <li>gemischte Reihen: vorn Reihen längs, hinten Reihen quer,</li>
          <li>gemischte Spuren: nebeneinander eine Spur längs und eine quer.</li>
        </ul>
        <p>
          Unregelmäßige Verbundmuster („Windmühle“) werden nicht berechnet. Die Ergebnisse sind
          Geometrie, keine Garantie für die praktische Verladbarkeit. Bei der Standard-Sattelzug-Fläche
          ergeben sich die bekannten Werte 33 (längs) bzw. 34 (quer, theoretisch) Europaletten und 26
          Industriepaletten, ohne dass sie fest hinterlegt sind. Stapeln wird nur berücksichtigt, wenn
          der Nutzer die Ladungshöhe angibt; die Lagen sind durch Innenhöhe und die gewählte Maximalzahl
          begrenzt.
        </p>
      </ContentSection>

      <ContentSection title="Kartons pro Palette">
        <p>
          Kartons je Lage nach demselben Verfahren (Palette als Fläche, Karton als Rechteck). Lagen =
          abgerundet((maximale Gesamthöhe − Palettenhöhe) ÷ Kartonhöhe). Ohne Eingabe gilt der
          Logistik-Richtwert von 180 cm inklusive Palette (kein gesetzlicher Grenzwert). Ein
          Gewichtslimit begrenzt die Kartonzahl, wenn Kartongewicht und Maximalgewicht angegeben sind.
          Überstand, Stabilität (Stauchdruck) und Verzahnung der Lagen werden nicht modelliert.
        </p>
      </ContentSection>

      <ContentSection title="LKW Beladung">
        <p>
          Je Position: Bodenstellplätze, Lademeter, Grundfläche, Volumen und Gewicht. Zusätzlich muss
          jedes Packstück einzeln in Länge, Breite und – falls bekannt – Höhe ins Fahrzeug passen.
          Einschätzung: bis 85 % Fläche und 90 % Nutzlast „passt“; darüber „passt knapp“; über 100 %
          Fläche oder Nutzlast bzw. ein zu großes Packstück „passt nicht“. Eine Flächensumme belegt
          nicht, dass sich die Ladung auch anordnen lässt. Achslasten werden nicht berechnet.
        </p>
      </ContentSection>

      <ContentSection title="Volumengewicht">
        <p>
          Volumengewicht (kg) = Volumen (cm³) ÷ Divisor, äquivalent Volumen (m³) × Faktor (kg/m³).
          Voreinstellungen: Luftfracht 6.000, Paket/Express 5.000, Seefracht 1.000 kg/m³. Das
          frachtpflichtige Gewicht ist das Maximum aus Volumen- und tatsächlichem Gewicht.
        </p>
      </ContentSection>

      <ContentSection title="Hinterlegte Standardmaße">
        <ReferenceTable
          caption="Paletten (Länge × Breite × Höhe)"
          columns={["Palette", "Maße (cm)", "Höhe (cm)"]}
          rows={PALLET_LIST.map((pallet) => [
            pallet.label,
            `${pallet.lengthCm} × ${pallet.widthCm}`,
            formatDecimal(pallet.heightCm, 1),
          ])}
        />
        <ReferenceTable
          caption="Fahrzeuge (Planungsmaße, typische Nutzlast)"
          columns={["Fahrzeug", "L × B × H (cm)", "Typ. Nutzlast (kg)", "Herkunft der Maße"]}
          rows={VEHICLE_LIST.map((vehicle) => [
            vehicle.label,
            `${vehicle.lengthCm} × ${vehicle.widthCm} × ${vehicle.heightCm}`,
            vehicle.payloadKg.toLocaleString("de-DE"),
            vehicle.basis === "standard" ? "Planungsstandard" : vehicle.basis === "iso" ? "ISO-Container, konservative nutzbare Maße" : "Klassentypischer Richtwert",
          ])}
        />
        <p>
          Nutzlasten sind grobe Richtwerte der Fahrzeugklasse; maßgeblich sind immer die
          Fahrzeugpapiere. Containerangaben sind herstellerabhängig und nur Orientierung.
        </p>
      </ContentSection>

      <ContentSection title="Primärquellen und Prüfbasis">
        <p>
          Die Rechenwege wurden nicht aus Hersteller-Werbung übernommen, sondern gegen öffentlich
          zugängliche Norm- und Fachquellen geprüft. Tarifwerte und Fahrzeugausführungen können trotzdem
          abweichen; deshalb bleiben alle kritischen Werte als Annahmen erkennbar.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li><a className="text-brand-700 underline" href="https://www.epal-pallets.org/eu-en/load-carriers/overview/" rel="noopener noreferrer" target="_blank">EPAL: offizielle Maße und Tragfähigkeiten der Ladungsträger</a></li>
          <li><a className="text-brand-700 underline" href="https://www.iata.org/en/publications/newsletters/iata-knowledge-hub/air-cargo-tariffs-and-rules-what-you-need-to-know/" rel="noopener noreferrer" target="_blank">IATA: Luftfracht-Volumengewicht und frachtpflichtiges Gewicht</a></li>
          <li><a className="text-brand-700 underline" href="https://www.dhl.com/de-de/home/global-forwarding/freight-forwarding-education-center/calculating-chargeable-weights.html" rel="noopener noreferrer" target="_blank">DHL Global Forwarding: Verkehrsträger-spezifische Umrechnungsregeln</a></li>
          <li><a className="text-brand-700 underline" href="https://www.hapag-lloyd.com/content/dam/website/downloads/press_and_media/publications/15211_Container_Specification_engl_Gesamt_web.pdf" rel="noopener noreferrer" target="_blank">Hapag-Lloyd: Container Specification</a></li>
          <li><a className="text-brand-700 underline" href="https://www.gesetze-im-internet.de/stvo_2013/__22.html" rel="noopener noreferrer" target="_blank">§ 22 StVO: Ladung</a> und <a className="text-brand-700 underline" href="https://www.gesetze-im-internet.de/hgb/__412.html" rel="noopener noreferrer" target="_blank">§ 412 HGB: Verladen und Entladen</a></li>
        </ul>
      </ContentSection>

      <ContentSection title="Grenzen und Qualitätssicherung">
        <ul className="list-disc space-y-2 pl-5">
          <li>Die Rechner ersetzen keine Ladeplanung, Ladungssicherung oder Achslastprüfung.</li>
          <li>Alle Rechenkerne sind mit automatisierten Tests abgesichert (u. a. 33/34 Europaletten, 26 Industriepaletten, 11/25 Paletten in 20’/40’-Containern).</li>
          <li>Wenn Sie einen Fehler vermuten, melden Sie ihn über die <Link href="/kontakt/" className="text-brand-700 underline">Kontaktseite</Link>.</li>
        </ul>
      </ContentSection>
    </Container>
    </>
  );
}
