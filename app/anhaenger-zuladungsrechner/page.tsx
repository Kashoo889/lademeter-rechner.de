import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/content/ToolPage";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { AnhaengerForm } from "@/components/calculator/forms/AnhaengerForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Anhänger Zuladung berechnen: Stützlast, Anhängelast",
  description:
    "Anhänger-Zuladung berechnen: Zuladung, Anhängelast, Stützlast und Führerscheinklasse aus den Werten des Fahrzeugscheins prüfen – mit Rechenweg und Quellen.",
  path: "/anhaenger-zuladungsrechner/",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Wie berechne ich die Zuladung eines Anhängers?",
    answer:
      "Die maximale Zuladung ist die zulässige Gesamtmasse minus die Leermasse des Anhängers, beides aus dem Fahrzeugschein des Anhängers. Bei 1.300 kg zulässiger Gesamtmasse und 400 kg Leermasse dürfen höchstens 900 kg auf den Anhänger.",
  },
  {
    question: "Wo steht im Fahrzeugschein die Zuladung?",
    answer:
      "Die Zuladung steht nicht als eigener Wert im Fahrzeugschein, sie ergibt sich aus der zulässigen Gesamtmasse (Feld F.2, ersatzweise F.1) minus der Leermasse (Feld G). Die Anhängelast steht in Feld O.1 (gebremst) und O.2 (ungebremst), die Stützlast in Feld 13.",
  },
  {
    question: "Wie hoch darf die Stützlast sein?",
    answer:
      "Es gilt der kleinste Wert aus der Stützlast des Zugfahrzeugs, der Anhängekupplung und des Anhängers (§ 44 Abs. 3 StVZO). Nach unten soll die Stützlast bei Anhängern bis 3,5 t mindestens 4 % des tatsächlichen Anhängergewichts betragen, verlangt wird jedoch nicht mehr als 25 kg.",
  },
  {
    question: "Zählt die Stützlast zur Zuladung des Autos?",
    answer:
      "Ja. Die Stützlast drückt auf die Anhängekupplung und belastet das Zugfahrzeug. Sie vermindert dessen Zuladung genauso wie Mitfahrer und Gepäck.",
  },
  {
    question: "Wie viel darf ein ungebremster Anhänger wiegen?",
    answer:
      "Hinter Pkw sind ungebremste Anhänger nur einachsig und bei Allradbremse am Zugfahrzeug erlaubt. Die Anhängelast darf höchstens die Hälfte des um 75 kg erhöhten Leergewichts des Zugfahrzeugs betragen, aber nicht mehr als 750 kg (§ 42 Abs. 2 StVZO). Zusätzlich gilt der Herstellerwert in Feld O.2.",
  },
  {
    question: "Reicht der Führerschein Klasse B für meinen Anhänger?",
    answer:
      "Mit Klasse B dürfen Sie Anhänger bis 750 kg zulässiger Gesamtmasse ziehen, schwerere nur, wenn die zulässige Gesamtmasse der Kombination 3.500 kg nicht übersteigt. Darüber hinaus bis 4.250 kg hilft die Schlüsselzahl 96 (B96), für Anhänger bis 3.500 kg die Klasse BE.",
  },
  {
    question: "Gibt es eine Toleranz bei der Zuladung?",
    answer:
      "Dieser Rechner rechnet mit den Werten aus den Papieren, ohne Toleranz. Waagen und Papiere können abweichen, planen Sie deshalb eine Reserve ein. Wie die Behörden bei Kontrollen mit Abweichungen umgehen, ist hier nicht ausgewertet worden.",
  },
];

const fields: (string | number)[][] = [
  ["F.2 (ersatzweise F.1)", "im Zulassungsmitgliedstaat zulässige (F.1: technisch zulässige) Gesamtmasse in kg", "Zulässige Gesamtmasse"],
  ["G", "Masse des in Betrieb befindlichen Fahrzeugs in kg (Leermasse)", "Leermasse"],
  ["O.1", "technisch zulässige Anhängelast gebremst in kg", "Anhängelast gebremst"],
  ["O.2", "technisch zulässige Anhängelast ungebremst in kg", "Anhängelast ungebremst"],
  ["13", "Stützlast in kg (zulässige bzw. nutzbare Stützlast)", "Stützlast"],
];

const rules: (string | number)[][] = [
  ["Gesamtgewicht und Achslast einhalten", "§ 34 Abs. 3 StVZO", "Anhänger-/Zuladung"],
  ["Anhängelast ≤ zulässige Gesamtmasse des Zugfahrzeugs und ≤ Herstellerwert", "§ 42 Abs. 1 Nr. 1 StVZO", "Anhängelast"],
  ["Anhänger (Pkw): Achslast plus Stützlast höchstens 3.500 kg", "§ 42 Abs. 1 StVZO", "Anhängelast"],
  ["Ungebremst: einachsig, Allradbremse; höchstens ½ × (Leergewicht + 75 kg), max. 750 kg", "§ 42 Abs. 2 StVZO", "Ungebremster Anhänger"],
  ["Stützlast mind. 4 % des Anhängergewichts, verlangt höchstens 25 kg (bis 3,5 t)", "§ 44 Abs. 3 StVZO", "Stützlast"],
  ["Stützlast ≤ Herstellerangaben (Zugfahrzeug, Kupplung/Zugeinrichtung)", "§ 44 Abs. 3 StVZO", "Stützlast"],
  ["Klasse B: Anhänger bis 750 kg oder Kombination bis 3.500 kg", "§ 6 Abs. 1 FeV", "Führerschein"],
  ["B96: Kombination über 3.500 bis 4.250 kg (Schulung)", "§ 6a FeV", "Führerschein"],
  ["BE: Anhänger bis 3.500 kg", "§ 6 Abs. 1 FeV", "Führerschein"],
];

export default function AnhaengerZuladungsrechnerPage() {
  return (
    <ToolPage
      path="/anhaenger-zuladungsrechner/"
      slug="anhaenger-zuladungsrechner"
      breadcrumbs={[{ label: "Anhänger Zuladungsrechner", href: "/anhaenger-zuladungsrechner/" }]}
      h1="Anhänger-Zuladung berechnen"
      intro="Tragen Sie die Werte aus den Fahrzeugscheinen von Zugfahrzeug und Anhänger ein: Der Rechner prüft Zuladung, Anhängelast, Stützlast und Führerscheinklasse und zeigt jeweils den Rechenweg."
      schemaName="Anhänger Zuladungsrechner"
      schemaDescription="Kostenloser Rechner für Pkw und Transporter mit Anhänger: Zuladung, Anhängelast, Stützlast und Führerscheinklasse aus den Werten des Fahrzeugscheins."
      calculator={<AnhaengerForm />}
      disclaimer="Alle Angaben dienen der ersten Orientierung und ersetzen weder Wiegen noch Rechtsberatung. Maßgeblich sind die Eintragungen in Ihren Fahrzeugpapieren und die jeweils geltenden Vorschriften."
      howItWorks={
        <>
          <p>
            Der Rechner arbeitet nur mit Zahlen aus Ihren Papieren und wendet fünf Regeln aus der
            Straßenverkehrs-Zulassungs-Ordnung (StVZO) und der Fahrerlaubnis-Verordnung (FeV) an. Jede
            Prüfung zeigt ihren Rechenweg an; ohne ausreichende Angaben bleibt sie weg, statt mit geratenen
            Werten zu rechnen.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Zuladung des Anhängers:</strong> zulässige Gesamtmasse − Leermasse. Das beladene
              Gewicht darf die zulässige Gesamtmasse nicht überschreiten (§ 34 Abs. 3 StVZO).
            </li>
            <li>
              <strong>Anhängelast:</strong> Das Zugfahrzeug darf höchstens den niedrigsten dieser Werte
              ziehen: Herstellerwert (Feld O.1 bzw. O.2), eigene zulässige Gesamtmasse und 3.500 kg für
              Achslast plus Stützlast des Anhängers (§ 42 Abs. 1 StVZO).
            </li>
            <li>
              <strong>Ungebremster Anhänger:</strong> einachsig und höchstens die Hälfte von (Leergewicht des
              Zugfahrzeugs + 75 kg), nie mehr als 750 kg (§ 42 Abs. 2 StVZO).
            </li>
            <li>
              <strong>Stützlast:</strong> mindestens 4 % des tatsächlichen Anhängergewichts, wobei nicht mehr
              als 25 kg verlangt werden; nach oben gilt der kleinste Herstellerwert (§ 44 Abs. 3 StVZO).
            </li>
            <li>
              <strong>Zuladung des Zugfahrzeugs:</strong> (allein berechnen Sie sie im <Link href="/zuladungsrechner/" className="text-brand-700 underline">Zuladungsrechner</Link>) zulässige Gesamtmasse − Leermasse − Mitfahrer −
              Gepäck − Stützlast. Der Fahrer ist üblicherweise mit 75 kg schon in der Leermasse enthalten.
            </li>
            <li>
              <strong>Führerschein:</strong> Maßgeblich sind die zulässigen Gesamtmassen von Zugfahrzeug und
              Anhänger, nicht das tatsächliche Gewicht (§ 6, § 6a FeV).
            </li>
          </ul>
        </>
      }
      steps={[
        "Fahrzeugschein (Zulassungsbescheinigung Teil I) von Zugfahrzeug und Anhänger bereitlegen.",
        "Zulässige Gesamtmasse, Leermasse, Anhängelast und Stützlast des Zugfahrzeugs eintragen.",
        "Zulässige Gesamtmasse und Leermasse des Anhängers eintragen und die Bremse wählen.",
        "Ladung, gemessene Stützlast, Mitfahrer und Gepäck eintragen; im Zweifel wiegen.",
        "Prüfungen lesen: Rot bedeutet überschritten, Gelb knapp oder Hinweis, Grün in Ordnung.",
      ]}
      example={
        <>
          <p>
            Ein Pkw hat 2.050 kg zulässige Gesamtmasse, 1.450 kg Leermasse, 1.500 kg Anhängelast gebremst und
            75 kg Stützlast. Der gebremste Anhänger hat 1.300 kg zulässige Gesamtmasse und 400 kg Leermasse. Auf
            ihm liegen 800 kg Ladung, im Auto sitzen ein Mitfahrer (75 kg) und 50 kg Gepäck, die gemessene
            Stützlast beträgt 60 kg.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Anhänger:</strong> 1.300 − 400 = 900 kg Zuladung; beladen 400 + 800 = 1.200 kg, es bleiben{" "}
              <strong>100 kg</strong>.
            </li>
            <li>
              <strong>Anhängelast:</strong> niedrigster Wert aus 1.500 kg, 2.050 kg und 3.500 kg ist 1.500 kg;
              mit 1.200 kg bleiben <strong>300 kg Reserve</strong>.
            </li>
            <li>
              <strong>Stützlast:</strong> Mindestwert min(4 % × 1.200 kg = 48 kg; 25 kg) = 25 kg, Höchstwert
              75 kg: 60 kg liegen <strong>im Bereich</strong>.
            </li>
            <li>
              <strong>Zugfahrzeug:</strong> 2.050 − 1.450 = 600 kg Zuladung, abzüglich 75 + 50 + 60 = 185 kg,
              es bleiben <strong>415 kg</strong>.
            </li>
            <li>
              <strong>Führerschein:</strong> 2.050 + 1.300 = 3.350 kg ≤ 3.500 kg: <strong>Klasse B reicht</strong>.
            </li>
          </ul>
          <p>
            Ohne Beispielwerte probieren Sie es mit der Schaltfläche „Beispielwerte einsetzen“ im Rechner aus.
            Die Zahlen sind frei gewählt und stehen für kein bestimmtes Fahrzeugmodell.
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
          <ReferenceTable
            caption="Regeln, die der Rechner anwendet"
            columns={["Regel", "Fundstelle", "Prüfung"]}
            rows={rules}
          />
          <p>
            Eine ausführliche Erklärung der Felder mit Beispielen finden Sie im Ratgeber{" "}
            <Link href="/ratgeber/fahrzeugschein-anhaengelast-stuetzlast/" className="text-brand-700 underline">
              Fahrzeugschein lesen: Anhängelast, Stützlast, Zuladung
            </Link>
            .
          </p>
          <p className="text-sm text-slate-600">
            Quellen: Gesetzestexte auf gesetze-im-internet.de (StVZO, FeV) und Leitfaden zur Ausfüllung der
            Zulassungsbescheinigung Teil I und Teil II des Kraftfahrt-Bundesamts, Stand Juli 2026; abgerufen am
            27.10.2026. Die Leermasse im Fahrzeugschein kann je nach Ausstattung vom tatsächlichen Wert abweichen.
          </p>
        </div>
      }
      definitions={[
        { term: "Zulässige Gesamtmasse (zGG)", detail: "Höchstgewicht des beladenen Fahrzeugs laut Papieren. Maßgeblich ist der niedrigere der Werte F.1 und F.2." },
        { term: "Leermasse", detail: "Masse des fahrbereiten Fahrzeugs (Feld G). Die Zuladung ist zulässige Gesamtmasse minus Leermasse." },
        { term: "Anhängelast", detail: "Gewicht, das das Zugfahrzeug höchstens ziehen darf, getrennt für gebremste und ungebremste Anhänger (Felder O.1 und O.2)." },
        { term: "Stützlast", detail: "Last, die die Deichsel senkrecht auf die Anhängekupplung bringt. Sie belastet das Zugfahrzeug." },
        { term: "Zuladung", detail: "Gewicht, das zusätzlich zum Leergewicht geladen werden darf: Ladung, Mitfahrer, Gepäck und Stützlast zählen mit." },
        { term: "Gespann", detail: "Zugfahrzeug mit Anhänger. Für Führerschein und Geschwindigkeit zählt die Kombination." },
      ]}
      mistakes={[
        "Die Stützlast beim Zugfahrzeug vergessen: Sie zählt zu dessen Zuladung.",
        "Das Leergewicht des Anhängers mit der Zuladung verwechseln: Die Ladung kommt zum Leergewicht hinzu.",
        "Die Anhängelast mit dem Gewicht der Ladung gleichsetzen: Gezogen wird der beladene Anhänger.",
        "Für den Führerschein das tatsächliche Gewicht statt der zulässigen Gesamtmassen ansetzen.",
        "Schwere Ladung nach hinten legen: Die Stützlast sinkt, der Anhänger wird instabil.",
        "Papierwerte ungeprüft glauben: Bei knappen Ergebnissen wiegen.",
      ]}
      faqs={faqs}
      articleSlugs={["fahrzeugschein-anhaengelast-stuetzlast", "paragraf-22-stvo-ladung", "ladungssicherung-lkw-grundlagen"]}
    />
  );
}
