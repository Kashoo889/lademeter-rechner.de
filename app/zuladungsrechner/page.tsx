import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/content/ToolPage";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { ZuladungForm } from "@/components/calculator/forms/ZuladungForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Zuladung berechnen: Auto, Transporter, Wohnmobil",
  description:
    "Zuladung berechnen: Aus zulässiger Gesamtmasse und Leermasse im Fahrzeugschein die freie Zuladung für Pkw, Transporter und Wohnmobil ermitteln – mit Rechenweg.",
  path: "/zuladungsrechner/",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Wie berechne ich die Zuladung meines Autos?",
    answer:
      "Zuladung = zulässige Gesamtmasse minus Leermasse, beides aus dem Fahrzeugschein. Bei 2.000 kg zulässiger Gesamtmasse und 1.400 kg Leermasse sind es 600 kg. Davon gehen Mitfahrer, Gepäck, Zubehör und eine eventuelle Stützlast ab.",
  },
  {
    question: "Welche Felder im Fahrzeugschein brauche ich?",
    answer:
      "Die zulässige Gesamtmasse steht in Feld F.2 (ersatzweise F.1), die Leermasse in Feld G. Steht in Feld 22 eine tatsächliche Masse, ist diese genauer als Feld G.",
  },
  {
    question: "Ist der Fahrer in der Leermasse enthalten?",
    answer:
      "Nach § 42 Abs. 3 StVZO wird das Leergewicht bei Kraftfahrzeugen einschließlich 75 kg Fahrer angegeben, Kraftstoff zu 90 %. Üblicherweise ist der Fahrer mit 75 kg also schon enthalten. Der Rechner zieht deshalb nur den Teil über 75 kg zusätzlich ab. Im Zweifel wiegen Sie das Fahrzeug.",
  },
  {
    question: "Was zählt beim Wohnmobil zur Zuladung?",
    answer:
      "Alles, was nach der Erstzulassung hinzukommt oder nicht schon in der Leermasse steckt: Mitfahrer, Gepäck, nachgerüstetes Zubehör und je nach Herstellerangabe Frischwasser und Gas. Ob Wasser und Gas in der Leermasse enthalten sind, steht im Datenblatt des Herstellers. Der Rechner nimmt zur Sicherheit an, dass sie noch abgezogen werden müssen.",
  },
  {
    question: "Wie schwer ist ein Liter Wasser?",
    answer:
      "Ein Liter Frischwasser wiegt rund 1 kg. 100 Liter Tank belasten die Zuladung also mit etwa 100 kg.",
  },
  {
    question: "Reicht die Gesamtmasse allein für eine sichere Beladung?",
    answer:
      "Nein. Zusätzlich dürfen die zulässigen Achslasten nicht überschritten werden (§ 34 Abs. 3 StVZO). Weil die Verteilung von Ihrer Beladung abhängt, rechnet dieser Rechner sie nicht aus. Schwere Ladung gehört tief und mittig; wiegen Sie im Zweifel auf einer Fahrzeugwaage.",
  },
  {
    question: "Was passiert bei Überladung?",
    answer:
      "Das Fahrzeug darf im Betrieb die zulässige Gesamtmasse nicht überschreiten. Überladung beeinträchtigt Bremsweg und Fahrverhalten und kann Bußgelder und Probleme mit der Versicherung nach sich ziehen. Konkrete Bußgeldhöhen sind hier nicht ausgewertet worden.",
  },
];

const fields: (string | number)[][] = [
  ["F.2 (ersatzweise F.1)", "im Zulassungsmitgliedstaat zulässige (F.1: technisch zulässige) Gesamtmasse in kg", "Zulässige Gesamtmasse"],
  ["G", "Masse des in Betrieb befindlichen Fahrzeugs in kg (Leermasse)", "Leermasse"],
  ["22", "Bemerkungen, hier kann auf Antrag die tatsächliche Masse stehen", "Leermasse (genauer)"],
  ["13", "Stützlast in kg (bei Fahrzeugen mit Anhängekupplung)", "Stützlast (Anhänger)"],
];

const rules: (string | number)[][] = [
  ["Zulässiges Gesamtgewicht und Achslast müssen im Betrieb eingehalten werden", "§ 34 Abs. 3 StVZO", "Ergebnis"],
  ["Leergewicht: betriebsfertig, Kraftstoff zu 90 %, bei Kfz inkl. 75 kg Fahrer", "§ 42 Abs. 3 StVZO", "Fahrer"],
  ["1 Liter Wasser ≈ 1 kg", "Physik", "Wohnmobil: Wasser"],
];

export default function ZuladungsrechnerPage() {
  return (
    <ToolPage
      path="/zuladungsrechner/"
      slug="zuladungsrechner"
      breadcrumbs={[{ label: "Zuladungsrechner", href: "/zuladungsrechner/" }]}
      h1="Zuladung berechnen"
      intro="Tragen Sie zulässige Gesamtmasse und Leermasse aus dem Fahrzeugschein ein, dann Personen, Gepäck, Fahrräder und Zubehör: Der Rechner zeigt, wie viel Zuladung noch frei ist oder wie stark Sie überladen wären."
      schemaName="Zuladungsrechner"
      schemaDescription="Kostenloser Zuladungsrechner für Pkw, Transporter und Wohnmobil: freie Zuladung aus zulässiger Gesamtmasse und Leermasse, abzüglich Personen, Gepäck, Fahrräder, Zubehör, Wasser und Gas."
      calculator={<ZuladungForm />}
      disclaimer="Alle Angaben dienen der ersten Orientierung und ersetzen weder Wiegen noch Rechtsberatung. Maßgeblich sind die Eintragungen in Ihren Fahrzeugpapieren. Achslasten werden nicht geprüft."
      howItWorks={
        <>
          <p>
            Die Rechnung ist bewusst einfach, damit Sie sie nachvollziehen können: Maximale Zuladung = zulässige
            Gesamtmasse − Leermasse. Davon ziehen Sie alles ab, was Sie zusätzlich laden. Bleibt ein positiver
            Rest, ist das Fahrzeug nach Gesamtmasse nicht überladen (§ 34 Abs. 3 StVZO).
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Mitfahrer:</strong> Anzahl × Gewicht, Standard 75 kg. Der Fahrer ist üblicherweise mit
              75 kg schon in der Leermasse enthalten; nur ein höheres Fahrergewicht wird zusätzlich abgezogen.
            </li>
            <li>
              <strong>Gepäck, Zubehör, Fahrräder:</strong> tatsächliche Gewichte. Zubehör, das nach der
              Erstzulassung montiert wurde (Dachbox, Träger, Markise), steht nicht in der Leermasse.
            </li>
            <li>
              <strong>Wohnmobil:</strong> Frischwasser (1 l ≈ 1 kg) und Gas, sofern sie nicht laut Datenblatt
              schon in der Leermasse enthalten sind.
            </li>
            <li>
              <strong>Stützlast:</strong> Bei Anhängerbetrieb belastet sie das Zugfahrzeug und zählt zur
              Zuladung.
            </li>
          </ul>
          <p>
            Ob auch die einzelnen Achsen im Rahmen bleiben, hängt von der Lage der Ladung ab und ist hier nicht
            berechnet. Für Gespanne gibt es den{" "}
            <Link href="/anhaenger-zuladungsrechner/" className="text-brand-700 underline">
              Anhänger-Zuladungsrechner
            </Link>
            .
          </p>
        </>
      }
      steps={[
        "Fahrzeugart wählen und zulässige Gesamtmasse (F.2) sowie Leermasse (G) aus dem Fahrzeugschein eintragen.",
        "Mitfahrer und, falls abweichend, Gewichte eintragen.",
        "Gepäck, Zubehör und Fahrräder ergänzen; beim Wohnmobil Wasser und Gas.",
        "Auf „Zuladung berechnen“ tippen und die Aufstellung lesen.",
        "Bei knappem Ergebnis das beladene Fahrzeug wiegen.",
      ]}
      example={
        <>
          <p>
            Ein Kombi hat 2.000 kg zulässige Gesamtmasse und 1.400 kg Leermasse. Es fahren drei Mitfahrer
            (je 75 kg) mit, dazu 100 kg Gepäck, eine Dachbox mit 30 kg und zwei Fahrräder zu je 20 kg.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Maximale Zuladung: 2.000 − 1.400 = <strong>600 kg</strong>.</li>
            <li>Belegt: 3 × 75 + 100 + 30 + 2 × 20 = <strong>395 kg</strong>.</li>
            <li>Rest: 600 − 395 = <strong>205 kg</strong> frei.</li>
          </ul>
          <p>
            Probieren Sie es mit „Beispielwerte einsetzen“ im Rechner. Die Zahlen sind frei gewählt und stehen
            für kein bestimmtes Modell.
          </p>
        </>
      }
      reference={
        <div className="space-y-6">
          <ReferenceTable
            caption="Welche Werte stehen wo im Fahrzeugschein?"
            columns={["Feld", "Bedeutung laut Leitfaden des Kraftfahrt-Bundesamts", "Im Rechner"]}
            rows={fields}
          />
          <ReferenceTable caption="Regeln hinter der Rechnung" columns={["Regel", "Fundstelle", "Im Rechner"]} rows={rules} />
          <p>
            Mehr dazu im Ratgeber{" "}
            <Link href="/ratgeber/fahrzeugschein-anhaengelast-stuetzlast/" className="text-brand-700 underline">
              Fahrzeugschein lesen: Anhängelast, Stützlast, Zuladung
            </Link>
            .
          </p>
          <p className="text-sm text-slate-600">
            Quellen: § 34 und § 42 StVZO auf gesetze-im-internet.de; Leitfaden zur Ausfüllung der
            Zulassungsbescheinigung Teil I und II des Kraftfahrt-Bundesamts, Stand Juli 2026; abgerufen am
            28.10.2026. Die Leermasse im Fahrzeugschein kann je nach Ausstattung vom tatsächlichen Wert abweichen.
          </p>
        </div>
      }
      definitions={[
        { term: "Zulässige Gesamtmasse", detail: "Höchstgewicht des beladenen Fahrzeugs laut Papieren (Feld F.2, ersatzweise F.1)." },
        { term: "Leermasse", detail: "Masse des fahrbereiten Fahrzeugs (Feld G), bei Kfz üblicherweise einschließlich 75 kg Fahrer." },
        { term: "Zuladung", detail: "Zulässige Gesamtmasse minus Leermasse: das Gewicht, das Sie zusätzlich laden dürfen." },
        { term: "Achslast", detail: "Gewicht, das auf einer Achse lasten darf. Sie ist zusätzlich zur Gesamtmasse einzuhalten." },
        { term: "Stützlast", detail: "Last der Anhängerdeichsel auf der Kupplung. Sie zählt zur Zuladung des Zugfahrzeugs." },
      ]}
      mistakes={[
        "Zuladung mit dem Kofferraumvolumen verwechseln: Entscheidend ist das Gewicht.",
        "Zubehör vergessen, das nach der Zulassung montiert wurde (Dachbox, Träger, Markise).",
        "Mitfahrer zu leicht schätzen: Kinder, Jugendliche und Gepäck summieren sich.",
        "Beim Wohnmobil Wasser und Gas übersehen.",
        "Den Fahrer doppelt abziehen: 75 kg sind üblicherweise schon in der Leermasse.",
        "Nur die Gesamtmasse prüfen und die Achslast ignorieren.",
      ]}
      faqs={faqs}
      articleSlugs={["fahrzeugschein-anhaengelast-stuetzlast", "paragraf-22-stvo-ladung", "ladungssicherung-lkw-grundlagen"]}
    />
  );
}
