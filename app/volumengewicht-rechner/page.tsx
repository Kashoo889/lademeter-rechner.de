import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/content/ToolPage";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { ContentSection } from "@/components/content/ContentSection";
import { VolumengewichtForm } from "@/components/calculator/forms/VolumengewichtForm";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { VOLUME_WEIGHT_MODES } from "@/lib/calculators/volumeWeight";
import { formatDecimal } from "@/lib/parseDecimal";

export const metadata: Metadata = buildPageMetadata({
  title: "Volumengewicht berechnen – Rechner für Paket, Luft & See",
  description:
    "Volumengewicht und frachtpflichtiges Gewicht berechnen: Divisor 6.000 (Luftfracht), 5.000 (Express), 1 m³ = 1 t (Seefracht) oder eigener Tarif.",
  path: "/volumengewicht-rechner/",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Wie berechnet man das Volumengewicht?",
    answer:
      "Volumengewicht (kg) = Länge × Breite × Höhe (cm) ÷ Divisor. Bei Luftfracht beträgt der Divisor üblicherweise 6.000, bei vielen Paketdiensten 5.000. Abgerechnet wird das höhere von Volumengewicht und tatsächlichem Gewicht.",
  },
  {
    question: "Was ist das frachtpflichtige Gewicht?",
    answer:
      "Das Gewicht, nach dem Ihre Sendung abgerechnet wird: der höhere Wert aus tatsächlichem Gewicht und Volumengewicht. Es wird auch taxierendes Gewicht genannt.",
  },
  {
    question: "Welcher Divisor gilt bei meinem Frachtführer?",
    answer:
      "Das legt der Frachtführer in seinen Tarifbedingungen fest. Die Voreinstellungen im Rechner sind Orientierungswerte. Für abweichende Tarife nutzen Sie den eigenen Divisor oder Faktor.",
  },
  {
    question: "Worin unterscheidet sich das Volumengewicht vom Lademetergewicht?",
    answer:
      "Das Volumengewicht rechnet aus dem Rauminhalt, das Lademetergewicht aus der belegten Länge der Ladefläche. Beides sind Tarifkonventionen im Straßengüterverkehr bzw. der Luft- und Paketfracht.",
  },
];

export default function VolumengewichtPage() {
  return (
    <ToolPage
      path="/volumengewicht-rechner/"
      slug="volumengewicht-rechner"
      breadcrumbs={[{ label: "Volumengewicht Rechner", href: "/volumengewicht-rechner/" }]}
      h1="Volumengewicht berechnen"
      intro="Geben Sie die Maße Ihrer Packstücke ein und wählen Sie den Tarif. Der Rechner ermittelt Volumengewicht, tatsächliches Gewicht und das frachtpflichtige Gewicht, nach dem abgerechnet wird."
      schemaName="Volumengewicht Rechner"
      schemaDescription="Kostenloser Rechner für Volumengewicht und frachtpflichtiges Gewicht bei Luftfracht, Paket, Seefracht oder eigenem Tarif."
      calculator={<VolumengewichtForm />}
      howItWorks={
        <p>
          Für jedes Packstück wird das Volumen berechnet und mit der Menge multipliziert. Das
          Volumengewicht ergibt sich aus Volumen × Faktor (kg je m³) – gleichbedeutend mit
          L × B × H (cm) ÷ Divisor. Das frachtpflichtige Gewicht ist das Maximum aus Volumengewicht und
          tatsächlichem Gewicht.
        </p>
      }
      steps={[
        "Berechnungsart wählen oder eigenen Divisor bzw. Faktor eingeben.",
        "Länge, Breite, Höhe (cm), Anzahl und optional das Gewicht je Packstück eintragen.",
        "Frachtpflichtiges Gewicht ablesen und mit dem Angebot des Frachtführers vergleichen.",
      ]}
      example={
        <>
          <p>
            Ein Karton 60 × 40 × 40 cm wiegt 10 kg. Volumen: 96.000 cm³. Bei Divisor 6.000 (Luftfracht)
            ergibt das <strong>16 kg Volumengewicht</strong>, bei Divisor 5.000 <strong>19,2 kg</strong>.
            Abgerechnet wird jeweils das Volumengewicht, weil es höher ist als die tatsächlichen 10 kg.
          </p>
          <p>
            Bei Lademetern funktioniert das ähnlich, siehe{" "}
            <Link href="/ratgeber/lademeter-in-kg-umrechnen/" className="text-brand-700 underline">
              Lademeter in kg umrechnen
            </Link>
            .
          </p>
        </>
      }
      reference={
        <ContentSection title="Gängige Umrechnungsfaktoren" id="faktoren">
          <ReferenceTable
            caption="Orientierungswerte (der Tarif Ihres Frachtführers ist maßgeblich)"
            columns={["Verkehrsart", "Divisor (cm³/kg)", "Faktor (kg/m³)"]}
            rows={[
              ...Object.values(VOLUME_WEIGHT_MODES).map((mode) => [
                mode.label,
                formatDecimal(1_000_000 / mode.kgPerCbm, 0),
                formatDecimal(mode.kgPerCbm, 1),
              ]),
              ["Lademeter Straße (kg je ldm)", "tarifabhängig", "meist 1.500–2.000 kg je Lademeter"],
            ]}
          />
        </ContentSection>
      }
      definitions={[
        { term: "Volumengewicht", detail: "Fiktives Gewicht, das aus dem Raumbedarf einer Sendung berechnet wird." },
        { term: "Frachtpflichtiges Gewicht", detail: "Abrechnungsgewicht: das höhere von tatsächlichem Gewicht und Volumengewicht." },
        { term: "Divisor", detail: "Zahl, durch die das Volumen in cm³ geteilt wird, z. B. 6.000 in der Luftfracht." },
        { term: "Faktor", detail: "Kilogramm je Kubikmeter, mit dem das Volumen multipliziert wird." },
        { term: "W/M", detail: "Weight or Measurement: in der Seefracht gilt der höhere Wert aus Tonnen und Kubikmetern." },
        { term: "Taxierendes Gewicht", detail: "Anderer Ausdruck für das frachtpflichtige Gewicht." },
      ]}
      mistakes={[
        "Innenmaße statt Außenmaße messen: Es zählen die größten Außenmaße inklusive Verpackung.",
        "Mit einem falschen Divisor zu kalkulieren: Luftfracht (6.000) und Express (5.000) sind nicht austauschbar.",
        "Packstücke nicht einzeln zu messen: Mehrere unterschiedliche Kartons gehören in getrennte Positionen.",
        "Rundungsregeln des Frachtführers zu übersehen, etwa Aufrunden auf 0,5 kg.",
      ]}
      faqs={faqs}
      articleSlugs={["volumengewicht-luftfracht", "volumengewicht-seefracht", "lademeter-in-kg-umrechnen"]}
    />
  );
}
