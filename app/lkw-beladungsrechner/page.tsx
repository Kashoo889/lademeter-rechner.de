import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/content/ToolPage";
import { BeladungForm } from "@/components/calculator/forms/BeladungForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "LKW Beladung berechnen: Rechner für Fläche und Nutzlast",
  description:
    "LKW-Beladungsrechner: Mehrere Ladungspositionen gegen Ladefläche, Nutzlast und Volumen prüfen. Mit Stapellagen, Fahrzeugvorgaben und Eignungsampel.",
  path: "/lkw-beladungsrechner/",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Wie prüft der Rechner, ob eine Ladung ins Fahrzeug passt?",
    answer:
      "Er vergleicht Bodenfläche, Gewicht und Volumen aller Positionen mit dem Fahrzeug und prüft, ob jedes Packstück für sich in Länge, Breite und Höhe hineinpasst. Daraus entsteht die Einschätzung „passt“, „passt knapp“ oder „passt nicht“.",
  },
  {
    question: "Ab wann zeigt der Rechner „passt knapp“?",
    answer:
      "Ab mehr als 85 % Bodenauslastung oder mehr als 90 % der Nutzlast. Über 100 % der Fläche oder der Nutzlast ist die Einschätzung „passt nicht“.",
  },
  {
    question: "Welche Nutzlast wird verwendet?",
    answer:
      "Ohne Eingabe ein typischer Wert der Fahrzeugklasse (z. B. 24.000 kg beim Sattelzug). Maßgeblich ist die Nutzlast in den Fahrzeugpapieren – tragen Sie sie bei Bedarf selbst ein.",
  },
  {
    question: "Kann der Rechner die genaue Anordnung der Ladung planen?",
    answer:
      "Nein, er prüft Summen und Einzelmaße. Für die konkrete Anordnung nutzen Sie den Palettenrechner mit Ladeplan; die Achslastverteilung bleibt eine gesonderte Prüfung.",
  },
  {
    question: "Wie funktionieren die Stapellagen?",
    answer:
      "Bei mehreren Lagen belegen gestapelte Packstücke nur ihre Bodenstellplätze (Anzahl ÷ Lagen, aufgerundet). Die Lagenzahl wird durch die Innenhöhe des Fahrzeugs begrenzt.",
  },
];

export default function LkwBeladungsrechnerPage() {
  return (
    <ToolPage
      path="/lkw-beladungsrechner/"
      slug="lkw-beladungsrechner"
      breadcrumbs={[{ label: "LKW Beladungsrechner", href: "/lkw-beladungsrechner/" }]}
      h1="LKW Beladung berechnen"
      intro="Planen Sie mehrere Ladungspositionen gemeinsam: Der Rechner vergleicht Bodenfläche, Gewicht und Volumen mit dem gewählten Fahrzeug und zeigt, ob die Ladung passt, knapp passt oder nicht passt."
      schemaName="LKW Beladungsrechner"
      schemaDescription="Kostenloser Rechner, der mehrere Ladungspositionen gegen Ladefläche, Nutzlast und Volumen eines Fahrzeugs prüft."
      calculator={<BeladungForm />}
      howItWorks={
        <p>
          Je Position werden Bodenstellplätze (Anzahl ÷ Stapellagen, aufgerundet), Lademeter, Grundfläche,
          Volumen und Gewicht ermittelt und addiert. Zusätzlich muss jedes Packstück einzeln in Länge,
          Breite und Höhe ins Fahrzeug passen. Die Einschätzung folgt klaren Schwellen: bis 85 % Fläche und
          90 % Nutzlast „passt“, darüber „passt knapp“, über 100 % „passt nicht“.
        </p>
      }
      steps={[
        "Fahrzeug wählen oder eigene Innenmaße eingeben; Nutzlast bei Bedarf überschreiben.",
        "Je Ladungsart eine Position mit Maßen, Anzahl, Gewicht und Stapellagen anlegen.",
        "Weitere Positionen hinzufügen, duplizieren oder entfernen.",
        "Eignung, Auslastungsbalken und Annahmen prüfen; Ergebnis teilen oder drucken.",
      ]}
      example={
        <>
          <p>
            24 Europaletten (120 × 80 cm, je 100 cm hoch, je 300 kg) auf einem Standard-Sattelzug:
            Grundfläche 0,96 m² × 24 = 23,04 m², das sind <strong>70,6 % Bodenauslastung</strong>. Lademeter:
            0,4 × 24 = <strong>9,6 ldm</strong>, Volumen 23,04 m³, Gesamtgewicht{" "}
            <strong>7.200 kg</strong> (30 % der typischen Nutzlast von 24.000 kg). Ergebnis:{" "}
            <strong>„passt“</strong>.
          </p>
          <p>
            Ergänzen Sie 8 Gitterboxen à 600 kg, steigt das Gewicht auf 12.000 kg – die Fläche ist dann
            weiterhin kein Problem, entscheidend wird die Achslast. Hintergründe im Ratgeber{" "}
            <Link href="/ratgeber/achslast-und-gesamtgewicht-lkw/" className="text-brand-700 underline">
              Achslast und Gesamtgewicht
            </Link>
            .
          </p>
        </>
      }
      definitions={[
        { term: "Ladungsposition", detail: "Gruppe gleichartiger Packstücke mit eigenen Maßen, Menge, Gewicht und Stapellagen." },
        { term: "Nutzlast", detail: "Maximales Gewicht der Ladung eines Fahrzeugs: zulässiges Gesamtgewicht abzüglich Leergewicht." },
        { term: "Fahrzeugeignung", detail: "Einschätzung, ob Fläche, Gewicht und Packstückmaße zum Fahrzeug passen." },
        { term: "Bodenauslastung", detail: "Anteil der von allen Positionen belegten Bodenfläche an der Ladefläche." },
        { term: "Stapellagen", detail: "Zahl der Lagen übereinander. Durch die Innenhöhe begrenzt." },
        { term: "Lademeter", detail: "Länge der Ladefläche, die die Ladung bei 2,4 m Breite belegt." },
      ]}
      mistakes={[
        "Positionen einzeln statt gemeinsam zu betrachten: Erst die Summe zeigt, ob das Fahrzeug reicht.",
        "Nur die Fläche zu prüfen: Schwere Ware erreicht die Nutzlast lange vor der Flächengrenze.",
        "Eine Flächenauslastung von 100 % als erreichbar anzusehen: Zwischenräume und Sicherung kosten Platz.",
        "Stapelbarkeit zu optimistisch angeben: Ware muss tragfähig und sicherbar sein.",
        "Die Achslastverteilung zu ignorieren: Eine passende Gesamtlast kann trotzdem eine Achse überlasten.",
      ]}
      faqs={faqs}
      articleSlugs={["lkw-beladung-richtig-planen", "achslast-und-gesamtgewicht-lkw", "ladungssicherung-lkw-grundlagen"]}
    />
  );
}
