import type { Metadata } from "next";
import Link from "next/link";
import { DownloadLanding } from "@/components/content/DownloadLanding";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DOWNLOADS_LIVE, excelAsset } from "@/lib/downloads";

const metaDescription =
  "Kostenlose Excel-Vorlage zum Lademeter berechnen: bis zu 25 Positionen, Stapellagen, Gewicht und frachtpflichtiges Gewicht – ohne Makros, mit Beispiel.";

// Hidden (noindex, not in sitemap, not linked) until DOWNLOADS_LIVE is switched on in lib/downloads.ts.
export const metadata: Metadata = buildPageMetadata({
  title: "Lademeter berechnen mit Excel: kostenlose Vorlage",
  description: metaDescription,
  path: excelAsset.path,
  absoluteTitle: true,
  noindex: !DOWNLOADS_LIVE,
});

const faqs = [
  {
    question: "Brauche ich Makros oder eine bestimmte Excel-Version?",
    answer:
      "Nein. Die Vorlage kommt ohne Makros aus und nutzt nur Standardfunktionen. Sie lässt sich in Microsoft Excel und in kompatiblen Programmen öffnen.",
  },
  {
    question: "Wie viele Positionen kann ich eingeben?",
    answer:
      "Das Blatt „Rechner“ bietet 25 Zeilen. Für größere Sendungen kopieren Sie das Blatt (der Blattschutz ist ohne Kennwort aufhebbar) und addieren die Ergebnisse.",
  },
  {
    question: "Warum steht bei mir ein Punkt statt eines Kommas?",
    answer:
      "Das Dezimalzeichen richtet sich nach der Spracheinstellung Ihres Programms. Geben Sie Zahlen so ein, wie es Ihre Excel-Version erwartet.",
  },
  {
    question: "Stimmt das Ergebnis mit dem Preis meiner Spedition überein?",
    answer:
      "Nur, wenn Ihre Spedition dieselbe Rechenkonvention nutzt. Faktor, Rundung und Mindestgewicht sind Tarifregeln der jeweiligen Spedition; maßgeblich sind immer Ihr Angebot und Ihre Vertragsbedingungen.",
  },
];

export default function LademeterExcelVorlagePage() {
  return (
    <DownloadLanding
      asset={excelAsset}
      crumb="Excel-Vorlage Lademeter"
      metaDescription={metaDescription}
      h1="Lademeter berechnen mit Excel: kostenlose Vorlage zum Download"
      description="Berechnen Sie Lademeter, Bodenstellplätze und frachtpflichtiges Gewicht direkt in Excel – ohne Makros, mit Beispiel, Prüfhinweisen und offen dokumentierter Formel."
      intro="Mit dieser Excel-Vorlage berechnen Sie die Lademeter Ihrer Sendung, die Bodenstellplätze nach Stapellagen und – mit dem Faktor Ihrer Spedition – das frachtpflichtige Gewicht. Sie liefert dieselben Ergebnisse wie der Online-Rechner und eignet sich für Disposition, Versand und Lager, wenn Sie Sendungen ohnehin in Excel erfassen oder Berechnungen weitergeben möchten."
      featuresTitle="Das steckt in der Vorlage"
      features={[
        { title: "Bis zu 25 Positionen", text: "Länge, Breite, Höhe, Anzahl, Stapellagen und Gewicht je Stück; Maßeinheit mm, cm oder m wählbar." },
        { title: "Ergebnis auf einen Blick", text: "Lademeter, Bodenstellplätze, Grundfläche, Volumen, Gewicht, Lademetergewicht und frachtpflichtiges Gewicht." },
        { title: "Vergleichsfahrzeug", text: "Anteil und Rest-Lademeter eines Vergleichsfahrzeugs (Standard 13,6 m) mit Warnung bei Überschreitung." },
        { title: "Prüfhinweise je Zeile", text: "Hinweise bei fehlenden Angaben, Breite über der Referenzbreite, gestapelter Ware und Überlänge." },
        { title: "Beispielblatt", text: "Ausgefüllte Beispielsendung: 10,10 Lademeter, 33 Bodenstellplätze und 18.692,71 kg frachtpflichtiges Gewicht bei 1.850 kg je Lademeter." },
        { title: "Referenzblatt", text: "Lademeter von Europalette (0,40), Industriepalette (0,50) und Halbpalette (0,20) sowie eine Mengentabelle bis 34 Paletten." },
      ]}
      howTitle="So rechnet die Vorlage"
      how={
        <>
          <ol className="list-decimal space-y-2 pl-5 marker:font-bold marker:text-brand-600">
            <li>Blatt „Rechner“ öffnen und die Maßeinheit wählen (mm, cm oder m).</li>
            <li>Optional den Umrechnungsfaktor Ihrer Spedition in kg je Lademeter eintragen.</li>
            <li>Je Ladungsposition eine Zeile ausfüllen: Länge, Breite, Anzahl sowie Stapellagen, Höhe und Gewicht (1 Lage = nicht stapelbar).</li>
            <li>Ergebnis oben ablesen; Prüfhinweise rechts in der Zeile beachten.</li>
          </ol>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800">
            <p><strong>Bodenstellplätze</strong> = Anzahl ÷ Stapellagen, aufgerundet</p>
            <p><strong>Lademeter</strong> = Länge [m] × Breite [m] ÷ 2,4 m × Bodenstellplätze</p>
            <p><strong>Frachtpflichtiges Gewicht</strong> = höherer Wert aus tatsächlichem Gewicht und Lademeter × Faktor</p>
          </div>
          <p>
            Beispiel: Eine Europalette (1,20 × 0,80 m) belegt 0,40 Lademeter. Zehn Europaletten ohne Stapeln sind 4,0 Lademeter;
            zweilagig gestapelt (5 Bodenstellplätze) sind es 2,0 Lademeter. Hintergründe im Ratgeber{" "}
            <Link href="/ratgeber/was-sind-lademeter/" className="font-semibold text-brand-700 underline">Was ist ein Lademeter?</Link>{" "}
            und unter <Link href="/methodik/" className="font-semibold text-brand-700 underline">Berechnungsgrundlagen</Link>.
          </p>
        </>
      }
      checkedTitle="Geprüfte Rechnung"
      checked={
        <p>
          Die Formeln der Vorlage wurden automatisiert gegen die Rechenkerne dieser Website abgeglichen: feste Testfälle (unter anderem
          Aufrunden bei ungerader Anzahl, Stapellagen, mm/cm/m, Faktor mit und ohne Gewicht, ungültige Zeilen) und Zufallsfälle.
          Ergebnis der Endfassung: 36 Testfälle, keine Abweichung. Das ist eine technische Prüfung der Rechnung, keine Haftungszusage für
          den Einzelfall.
        </p>
      }
      limits={
        <>
          Die Referenzbreite von 2,4 m ist eine Planungsgröße der Branche, keine Norm. Der Umrechnungsfaktor ist eine Tarifregel Ihrer
          Spedition (im Beispiel: 1.850 kg als Beispielwert, kein Standard). Speditionen runden Lademeter teilweise für die Abrechnung auf;
          die Vorlage zeigt den genauen Wert. Stapeln setzt geprüfte Innenhöhe, Belastbarkeit und Ladungssicherung voraus. Die Vorlage
          ersetzt keinen Ladeplan und keine Achslastprüfung.
        </>
      }
      faqs={faqs}
      articleSlugs={["was-sind-lademeter", "lademeter-in-kg-umrechnen", "stapelfaktor-lademeter"]}
    />
  );
}
