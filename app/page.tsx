import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolPage } from "@/components/content/ToolPage";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { ContentSection } from "@/components/content/ContentSection";
import { DownloadsCallout } from "@/components/content/DownloadsCallout";
import { VehicleLinks } from "@/components/content/VehicleLinks";
import { LademeterForm } from "@/components/calculator/forms/LademeterForm";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ldmByQuantityRows, palletLdmRows } from "@/lib/content/referenceData";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Lademeter Rechner – Lademeter berechnen, kostenlos",
    description:
      "Lademeter online berechnen: Länge, Breite, Anzahl und Stapellagen eingeben – inklusive Stellplätzen und frachtpflichtigem Gewicht. Mit Formel und Beispielen.",
    path: "/",
    absoluteTitle: true,
  }),
};

const faqs = [
  {
    question: "Wie berechnet man Lademeter?",
    answer:
      "Lademeter = Länge (m) × Breite (m) ÷ 2,4 m, multipliziert mit der Zahl der belegten Bodenstellplätze. Eine Europalette (1,20 × 0,80 m) belegt 0,4 Lademeter, 10 Europaletten entsprechen 4,0 Lademetern.",
  },
  {
    question: "Wie viele Lademeter hat ein LKW?",
    answer:
      "Ein Standard-Sattelauflieger wird mit 13,6 m Ladelänge geplant und hat damit 13,6 Lademeter. Ein 7,5-Tonner mit 6 m Ladefläche bietet rund 6 Lademeter, eine Wechselbrücke C 7.45 etwa 7 bis 7,3.",
  },
  {
    question: "Wie viele Europaletten sind ein Lademeter?",
    answer:
      "2,5 Europaletten entsprechen einem Lademeter, denn eine Europalette belegt 0,4 Lademeter. Bei Industriepaletten (0,5 ldm) sind es 2 Paletten je Lademeter.",
  },
  {
    question: "Wie rechne ich Lademeter in kg um?",
    answer:
      "Dafür gibt es keine Norm. Speditionen rechnen tarifabhängig meist mit 1.500 bis 2.000 kg je Lademeter, häufig genannt wird 1.850 kg. Abgerechnet wird das höhere von tatsächlichem Gewicht und Lademetergewicht (frachtpflichtiges Gewicht). Tragen Sie dazu im Rechner den Faktor Ihrer Spedition ein.",
  },
  {
    question: "Zählen gestapelte Paletten doppelt?",
    answer:
      "Nein, in der Regel zählen nur die Bodenstellplätze. Zwei gestapelte Europaletten belegen gemeinsam 0,4 Lademeter. Ob gestapelte Ware so abgerechnet wird, richtet sich nach dem Tarif der Spedition und der Stapelbarkeit der Ware.",
  },
  {
    question: "Ersetzen die Rechner eine professionelle Ladeplanung?",
    answer:
      "Nein. Die Rechner geben eine schnelle, geometrische Orientierung. Ladungssicherung, Achslasten, Fahrzeugpapiere und Vorgaben Ihrer Spedition müssen gesondert geprüft werden.",
  },
];

export default function HomePage() {
  return (
    <ToolPage
      path="/"
      slug="lademeter-rechner"
      breadcrumbs={[]}
      h1="Lademeter Rechner: Lademeter online berechnen"
      intro="Geben Sie Länge, Breite, Anzahl und Stapellagen Ihrer Ladung ein und erhalten Sie sofort die Lademeter, die Bodenstellplätze und – mit dem Faktor Ihrer Spedition – das frachtpflichtige Gewicht. Kostenlos, ohne Anmeldung, direkt im Browser."
      schemaName="Lademeter Rechner"
      schemaDescription="Kostenloser Online-Rechner für Lademeter, Bodenstellplätze und frachtpflichtiges Gewicht."
      calculator={<LademeterForm />}
      howItWorks={
        <>
          <p>
            Der Lademeter (ldm) beschreibt, wie viel Länge der Ladefläche eine Sendung über die volle
            Ladebreite von 2,4 m belegt. Der Rechner berechnet je Position{" "}
            <strong>Länge × Breite ÷ 2,4 m</strong> und multipliziert den Wert mit den belegten
            Bodenstellplätzen. Bei Stapellagen gilt: Stellplätze = Anzahl ÷ Lagen, aufgerundet.
          </p>
          <p>
            Wenn Sie den Umrechnungsfaktor Ihrer Spedition kennen, ermittelt der Rechner zusätzlich das
            Lademetergewicht und das frachtpflichtige Gewicht – also das höhere von tatsächlichem und
            Lademetergewicht.
          </p>
        </>
      }
      steps={[
        "Maßeinheit wählen (mm, cm oder m) und je Ladungsposition Länge, Breite und Anzahl eingeben.",
        "Bei stapelbarer Ware die zulässigen Lagen wählen. Optional Höhe und Gewicht ergänzen.",
        "Für das frachtpflichtige Gewicht den Faktor Ihrer Spedition in kg je Lademeter eintragen.",
        "Ergebnis kopieren, als Link teilen oder als PDF drucken.",
      ]}
      example={
        <>
          <p>
            Eine Europalette (1,20 m × 0,80 m) hat 0,96 m² Grundfläche. Geteilt durch 2,4 m ergibt das{" "}
            <strong>0,4 Lademeter</strong>. Zehn Europaletten benötigen entsprechend{" "}
            <strong>4,0 Lademeter</strong>. Stapelt man sie zweilagig, sind es nur 5 Bodenstellplätze und{" "}
            <strong>2,0 Lademeter</strong>.
          </p>
          <p>
            Wiegt die Sendung 3.200 kg und rechnet die Spedition mit 1.850 kg je Lademeter, ergibt sich
            für 4,0 Lademeter ein Lademetergewicht von 7.400 kg. Das frachtpflichtige Gewicht beträgt
            dann 7.400 kg, weil es höher ist als das tatsächliche Gewicht. Mehr dazu im Ratgeber{" "}
            <Link href="/ratgeber/lademeter-in-kg-umrechnen/" className="text-brand-700 underline">
              Lademeter in kg umrechnen
            </Link>
            .
          </p>
        </>
      }
      reference={
        <>
        <ContentSection title="Lademeter-Richtwerte für Paletten" id="richtwerte">
          <ReferenceTable
            caption="Lademeter je Palettentyp"
            columns={["Palettentyp", "Grundfläche", "Lademeter je Palette", "Paletten je Lademeter"]}
            rows={palletLdmRows()}
          />
          <ReferenceTable
            caption="Lademeter für mehrere Paletten (nicht gestapelt)"
            columns={["Anzahl Paletten", "Europaletten", "Industriepaletten"]}
            rows={ldmByQuantityRows([1, 2, 4, 5, 10, 15, 20, 26, 33])}
          />
          <p>
            Weitere Tabellen finden Sie in der{" "}
            <Link href="/lademeter-tabelle/" className="inline-flex items-center gap-1 text-brand-700 underline">
              Lademeter-Tabelle
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            , Fahrzeugmaße unter{" "}
            <Link href="/fahrzeuge/" className="text-brand-700 underline">
              Fahrzeuge &amp; Maße
            </Link>
            .
          </p>
          <DownloadsCallout />
        </ContentSection>
        <ContentSection title="Lademeter je Fahrzeug" id="fahrzeuge">
          <p>Wie viele Lademeter und Paletten ein Fahrzeug fasst, steht auf den Fahrzeugseiten:</p>
          <VehicleLinks />
        </ContentSection>
        </>
      }
      definitions={[
        { term: "Lademeter (ldm)", detail: "Flächenmaß: Länge der Ladefläche, die eine Ladung bei einer Ladebreite von 2,4 m belegt." },
        { term: "Bodenstellplatz", detail: "Position auf dem Fahrzeugboden. Gestapelte Ware teilt sich einen Stellplatz." },
        { term: "Stapellagen", detail: "Zahl der Lagen, die übereinander stehen dürfen. 1 bedeutet: nicht stapelbar." },
        { term: "Lademetergewicht", detail: "Fiktives Gewicht aus Lademetern × Umrechnungsfaktor der Spedition." },
        { term: "Frachtpflichtiges Gewicht", detail: "Abrechnungsgewicht: das höhere von tatsächlichem Gewicht und Lademetergewicht (auch taxierendes Gewicht genannt)." },
        { term: "Grundfläche", detail: "Die vom Packstück belegte Bodenfläche in Quadratmetern, unabhängig von der Höhe." },
      ]}
      mistakes={[
        "Lademeter mit Kubikmetern verwechseln: Die Höhe der Ladung fließt nicht in die Lademeter ein.",
        "Stapelbarkeit pauschal annehmen: Nur Ware, die tragfähig ist und gesichert werden kann, darf gestapelt werden.",
        "Den Umrechnungsfaktor als Norm ansehen: Er ist eine Tarifregel und unterscheidet sich je Spedition.",
        "Mit gerundeten Maßen rechnen: Schon 2 cm Abweichung je Palette summieren sich bei 33 Paletten.",
        "Das tatsächliche Gewicht vergessen: Bei schwerer Ware ist nicht der Lademeter, sondern die Nutzlast die Grenze.",
      ]}
      faqs={faqs}
      articleSlugs={["was-sind-lademeter", "lademeter-in-kg-umrechnen", "stapelfaktor-lademeter"]}
    />
  );
}
