import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/content/ToolPage";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { ContentSection } from "@/components/content/ContentSection";
import { PalettenForm } from "@/components/calculator/forms/PalettenForm";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { vehicleExcerptRows } from "@/lib/content/referenceData";
import { VehicleLinks } from "@/components/content/VehicleLinks";

export const metadata: Metadata = buildPageMetadata({
  title: "Wie viele Paletten passen in einen LKW? Rechner mit Ladeplan",
  description:
    "Palettenrechner: Wie viele Europaletten passen in Sattelzug, Wechselbrücke, 7,5-Tonner oder Container? Mit Ladeplan, Stapeloption und Vergleichstabelle.",
  path: "/lkw-palettenrechner/",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Wie viele Europaletten passen in einen LKW?",
    answer:
      "In einen Standard-Sattelauflieger (13,6 × 2,4 m) passen 33 Europaletten längs verladen. Quer angeordnet ergibt die Rechnung theoretisch 34 Stellplätze. Kleinere Fahrzeuge fassen entsprechend weniger, siehe Tabelle.",
  },
  {
    question: "Wie viele Industriepaletten passen in einen Sattelzug?",
    answer: "Es passen 26 Industriepaletten (1,20 × 1,00 m) in einen 13,6 m langen Sattelauflieger.",
  },
  {
    question: "Warum 33 und nicht 34 Paletten?",
    answer:
      "34 Europaletten füllen die Ladefläche rechnerisch lückenlos, lassen aber kein Rangierspiel. In der Praxis gilt die Längsverladung mit 33 Stellplätzen als gängiger Planungswert.",
  },
  {
    question: "Kann ich Paletten stapeln?",
    answer:
      "Ja, wenn Ware und Ladungssicherung es zulassen. Aktivieren Sie „Stapeln erlauben“ und geben Sie die Höhe der beladenen Palette an. Der Rechner begrenzt die Lagen anhand der Innenhöhe des Fahrzeugs.",
  },
  {
    question: "Kann ich eigene Fahrzeug- und Palettenmaße eingeben?",
    answer: "Ja. Wählen Sie „Benutzerdefiniert“ und geben Sie die Maße in Zentimetern an.",
  },
];

export default function LkwPalettenrechnerPage() {
  return (
    <ToolPage
      path="/lkw-palettenrechner/"
      slug="lkw-palettenrechner"
      breadcrumbs={[{ label: "LKW Palettenrechner", href: "/lkw-palettenrechner/" }]}
      h1="Wie viele Paletten passen in einen LKW?"
      intro="Wählen Sie Fahrzeug und Palettenformat. Der Rechner zeigt die mögliche Anzahl an Stellplätzen, die Lademeter und einen maßstäblichen Ladeplan – auch bei gemischter Verladung und optional gestapelt."
      schemaName="LKW Palettenrechner"
      schemaDescription="Kostenloser Rechner: wie viele Paletten in Sattelzug, Wechselbrücke, 7,5-Tonner oder Container passen, mit Ladeplan."
      calculator={<PalettenForm />}
      howItWorks={
        <p>
          Der Rechner prüft die Ladefläche mit vier Verladeschemata: alle Paletten längs, alle quer,
          vorn längs und hinten quer (gemischte Reihen) sowie nebeneinander längs und quer (gemischte
          Spuren). Ohne „Drehen erlauben“ wird nur die Ausrichtung geprüft, die Sie eingegeben haben. Es
          gewinnt das Schema mit den meisten Stellplätzen; bei Gleichstand das einfachere. Die Anordnung
          wird als Draufsicht gezeichnet.
        </p>
      }
      steps={[
        "Fahrzeugtyp wählen oder eigene Innenmaße eingeben.",
        "Palettentyp wählen (Euro, Industrie, Halbpalette) oder eigenes Format angeben.",
        "Anzahl der Paletten eintragen. Optional Drehen und Stapeln erlauben.",
        "Ergebnis und Ladeplan prüfen, Link teilen oder als PDF drucken.",
      ]}
      example={
        <>
          <p>
            Ein Standard-Sattelauflieger hat 13,60 × 2,40 m. Europaletten (1,20 × 0,80 m) längs
            verladen: 13,6 ÷ 1,2 = 11 Reihen mit je 3 Paletten, also <strong>33 Stellplätze</strong>. Quer
            verladen: 13,6 ÷ 0,8 = 17 Reihen mit je 2 Paletten, rechnerisch <strong>34 Stellplätze</strong>
            . Bei Industriepaletten (1,20 × 1,00 m) sind es längs 11 Reihen mit je 2 Paletten, also{" "}
            <strong>22 Stellplätze</strong>; quer verladen passen 13 Reihen mit je 2 Paletten, also{" "}
            <strong>26 Stellplätze</strong>.
          </p>
          <p>
            Mehr zu Fahrzeugen und Maßen finden Sie unter{" "}
            <Link href="/fahrzeuge/sattelzug/" className="text-brand-700 underline">
              Sattelzug
            </Link>{" "}
            und{" "}
            <Link href="/ratgeber/europaletten-und-palettenarten/" className="text-brand-700 underline">
              Europaletten und Palettenarten
            </Link>
            .
          </p>
        </>
      }
      reference={
        <>
        <ContentSection title="Paletten pro Fahrzeug im Überblick" id="tabelle">
          <ReferenceTable
            caption="Beispiele: Europaletten je Fahrzeug (nicht gestapelt)"
            columns={["Fahrzeug", "Lademeter", "Europaletten"]}
            rows={vehicleExcerptRows(["standard-semi-trailer", "truck-12t", "solo-truck", "van-3-5t", "container-40"])}
          />
          <p className="text-sm text-slate-600">
            Berechnet mit denselben Annahmen wie der Rechner (Standardmaße, siehe{" "}
            <Link href="/methodik/" className="text-brand-700 underline">
              Berechnungsgrundlagen
            </Link>
            ). Alle Fahrzeuge mit Maßen, Industrie- und Halbpaletten stehen unter{" "}
            <Link href="/fahrzeuge/" className="text-brand-700 underline">
              Fahrzeuge &amp; Maße
            </Link>
            .
          </p>
        </ContentSection>
        <ContentSection title="Fahrzeuge im Detail" id="fahrzeuge">
          <p>Maße, Lademeter und Palettenzahl je Fahrzeug mit Ladeplan:</p>
          <VehicleLinks />
        </ContentSection>
        </>
      }
      definitions={[
        { term: "Europalette", detail: "Genormte Palette 1200 × 800 mm (EPAL 1, EN 13698-1); belegt 0,4 Lademeter." },
        { term: "Industriepalette", detail: "Palette 1200 × 1000 mm (EPAL 2); belegt 0,5 Lademeter." },
        { term: "Halbpalette", detail: "Palette 800 × 600 mm; belegt 0,2 Lademeter." },
        { term: "Stellplatz", detail: "Position auf dem Fahrzeugboden. Bei Stapelung stehen mehrere Paletten auf einem Stellplatz." },
        { term: "Gemischte Verladung", detail: "Ein Teil der Paletten längs, ein anderer quer. Nutzt Restflächen, ist aber aufwendiger zu laden und zu sichern." },
        { term: "Bodenauslastung", detail: "Anteil der belegten Palettenfläche an der Ladefläche – keine Aussage über Gewicht oder Höhe." },
      ]}
      mistakes={[
        "Davon ausgehen, dass jedes Fahrzeug 13,6 m lang ist. Wechselbrücken und Verteiler-LKW sind deutlich kürzer.",
        "Quer verladene 34 Paletten ohne Spielraum planen, obwohl der Fahrer rangieren und sichern muss.",
        "Das Gewicht übersehen: 33 Paletten à 800 kg überschreiten die Nutzlast eines Sattelzugs.",
        "Palettenüberstand nicht einrechnen: Ware, die über die Palette hinausragt, braucht mehr Platz.",
        "Radkästen und Rungen von Transportern vergessen, die die nutzbare Breite verringern.",
      ]}
      faqs={faqs}
      articleSlugs={["europaletten-und-palettenarten", "lkw-beladung-richtig-planen", "achslast-und-gesamtgewicht-lkw"]}
    />
  );
}
