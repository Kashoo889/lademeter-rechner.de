import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/content/ToolPage";
import { KartonsForm } from "@/components/calculator/forms/KartonsForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Kartons pro Palette berechnen – Rechner mit Lagenbild, Höhe & Gewicht",
  description:
    "Wie viele Kartons passen auf eine Palette? Rechner für Europalette, Industriepalette und Halbpalette mit Lagenbild, Verbund, maximaler Höhe und Gewichtsgrenze.",
  path: "/kartons-pro-palette-rechner/",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Wie viele Kartons passen auf eine Palette?",
    answer:
      "Das hängt von Kartonmaßen, Palettenformat, zulässiger Höhe und Gewicht ab. Der Rechner prüft die Ausrichtungen längs, quer und im Verbund und wählt die mit den meisten Kartons pro Lage.",
  },
  {
    question: "Was bedeutet Verbund beim Lagenbild?",
    answer:
      "Im Verbund liegt ein Teil der Kartons längs, ein anderer quer in derselben Lage. So wird die Palettenfläche besser genutzt – zum Beispiel 10 statt 9 Kartons mit 35 × 25 cm auf einer Europalette. Verbund ist nur sinnvoll, wenn die Lage stabil bleibt.",
  },
  {
    question: "Welche maximale Höhe verwendet der Rechner?",
    answer:
      "Ohne eigene Angabe rechnet er mit dem gängigen Logistik-Richtwert von 180 cm inklusive Palette – kein gesetzlicher Grenzwert. Tragen Sie Ihre eigene Grenze ein, wenn sie abweicht.",
  },
  {
    question: "Wird das Gewicht berücksichtigt?",
    answer:
      "Ja, wenn Sie Kartongewicht und maximales Ladungsgewicht angeben. Ist das Gewicht die engere Grenze, ist die oberste Lage nur teilweise gefüllt.",
  },
  {
    question: "Wird ein Überstand über den Palettenrand berücksichtigt?",
    answer:
      "Nein. Der Rechner geht von einem bündigen Sitz aus. Überstand ist bei vielen Spediteuren unerwünscht und verringert die Stabilität.",
  },
];

export default function KartonsProPaletteRechnerPage() {
  return (
    <ToolPage
      path="/kartons-pro-palette-rechner/"
      slug="kartons-pro-palette-rechner"
      breadcrumbs={[{ label: "Kartons pro Palette", href: "/kartons-pro-palette-rechner/" }]}
      h1="Wie viele Kartons passen auf eine Palette?"
      intro="Geben Sie die Kartonmaße und das Palettenformat ein. Der Rechner ermittelt Kartons pro Lage und Palette, die Lagenzahl bei maximaler Höhe, die benötigten Paletten und zeigt das Lagenbild."
      schemaName="Kartons-pro-Palette Rechner"
      schemaDescription="Kostenloser Rechner für Kartons pro Palette mit Lagenbild, Höhen- und Gewichtsgrenze."
      calculator={<KartonsForm />}
      howItWorks={
        <>
          <p>
            Zuerst wird die Zahl der Kartons je Lage bestimmt: Palettenlänge ÷ Kartonlänge und
            Palettenbreite ÷ Kartonbreite, jeweils abgerundet. Mit „Drehen erlauben“ werden zusätzlich die
            gedrehte Ausrichtung sowie gemischte Lagen (Verbund) geprüft.
          </p>
          <p>
            Danach folgen die Lagen: (maximale Gesamthöhe − Palettenhöhe) ÷ Kartonhöhe, abgerundet. Kartons
            pro Palette = Kartons pro Lage × Lagen, begrenzt durch das optionale Gewichtslimit.
          </p>
        </>
      }
      steps={[
        "Länge, Breite und Höhe des Kartons in Zentimetern eingeben.",
        "Palettentyp wählen oder eigenes Format angeben.",
        "Optional maximale Gesamthöhe, Gewichtsgrenze und Kartongewicht ergänzen.",
        "Gesamtzahl der Kartons eintragen, um die benötigten Paletten zu erhalten.",
      ]}
      example={
        <>
          <p>
            Ein Karton 40 × 30 × 30 cm auf einer Europalette (120 × 80 cm, Höhe 14,4 cm) bei 180 cm
            Gesamthöhe: Gedreht passen 4 × 2 = <strong>8 Kartons pro Lage</strong>. Verfügbare Höhe für
            Kartons: 180 − 14,4 = 165,6 cm, also <strong>5 Lagen</strong> (165,6 ÷ 30, abgerundet). Das ergibt{" "}
            <strong>40 Kartons pro Palette</strong>.
          </p>
          <p>
            Ein Karton 35 × 25 cm zeigt den Verbund: Einheitlich längs passen 9, quer 8 Kartons; im Verbund
            (zwei Reihen längs, zwei Reihen quer) <strong>10 Kartons pro Lage</strong>. Mehr dazu im Ratgeber{" "}
            <Link href="/ratgeber/kartons-pro-palette-berechnen/" className="text-brand-700 underline">
              Kartons pro Palette berechnen
            </Link>
            .
          </p>
        </>
      }
      definitions={[
        { term: "Lage", detail: "Eine horizontale Schicht aus Kartons auf der Palette." },
        { term: "Verbund", detail: "Gemischte Lage aus längs und quer liegenden Kartons, um die Fläche besser zu nutzen." },
        { term: "Maximale Gesamthöhe", detail: "Höchste Höhe von Palette plus Ladung. Richtwert 180 cm im Straßentransport, kein gesetzlicher Grenzwert." },
        { term: "Volumenauslastung", detail: "Anteil des verfügbaren Raums (Grundfläche × Ladehöhe), den die Kartons ausfüllen." },
        { term: "Überstand", detail: "Ware, die über den Palettenrand hinausragt. Wird nicht berücksichtigt (bündiger Sitz)." },
        { term: "Halbpalette", detail: "Palette 800 × 600 mm, z. B. für Display- und Handelsware." },
      ]}
      mistakes={[
        "Außenmaße des Kartons falsch messen: Wellpappe trägt auf, eine Abweichung von 1 cm je Seite ändert die Lagen.",
        "Die Palettenhöhe bei der Gesamthöhe zu vergessen: Sie gehört zur Ladehöhe.",
        "Das Gewicht erst nach der Geometrie prüfen: Bei schweren Kartons ist es oft die engere Grenze.",
        "Verbund ohne Stabilitätsprüfung planen: Gemischte Lagen verzahnen schlechter.",
        "Kartons mit Einheiten mischen (mm statt cm).",
      ]}
      faqs={faqs}
      articleSlugs={["kartons-pro-palette-berechnen", "europaletten-und-palettenarten", "ladungssicherung-lkw-grundlagen"]}
    />
  );
}
