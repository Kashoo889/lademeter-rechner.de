import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { ContentSection } from "@/components/content/ContentSection";
import { FaqAccordion } from "@/components/content/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ldmByQuantityRows, palletLdmRows, vehicleCapacityRows } from "@/lib/content/referenceData";
import { PageHero } from "@/components/layout/PageHero";
import { DownloadsCallout } from "@/components/content/DownloadsCallout";

const breadcrumbItems = [{ label: "Lademeter-Tabelle", href: "/lademeter-tabelle/" }];

export const metadata: Metadata = buildPageMetadata({
  title: "Lademeter-Tabelle: Richtwerte für Paletten und Fahrzeuge",
  description:
    "Lademeter-Tabelle zum Nachschlagen: ldm für Europalette, Industriepalette und Halbpalette, Mengenstaffel 1 bis 33 Paletten und Palettenzahl je Fahrzeug.",
  path: "/lademeter-tabelle/",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Wie viele Lademeter sind 10 Europaletten?",
    answer: "10 Europaletten (nicht gestapelt) belegen 4,0 Lademeter, denn jede Europalette entspricht 0,4 ldm.",
  },
  {
    question: "Wie viele Lademeter hat ein 7,5-Tonner?",
    answer:
      "Bei rund 6 m Ladefläche und 2,40 m Breite bietet ein typischer 7,5-Tonner etwa 6 Lademeter. Maßgeblich sind die tatsächlichen Innenmaße.",
  },
  {
    question: "Sind die Werte der Tabelle verbindlich?",
    answer:
      "Nein. Es sind rechnerische Richtwerte auf Basis von Standardmaßen. Reale Fahrzeuge, Palettenüberstand, Sicherung und Tarifregeln können abweichen.",
  },
];

export default function LademeterTabellePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title="Lademeter-Tabelle: Richtwerte zum Nachschlagen"
        breadcrumbs={breadcrumbItems}
        description={
          <>
            Die Werte beruhen auf der Formel <strong>Lademeter = Länge × Breite ÷ 2,4 m</strong> und den
        Standardmaßen gängiger Paletten und Fahrzeuge. Für eigene Maße, Stapellagen und das
        frachtpflichtige Gewicht nutzen Sie den{" "}
        <Link href="/" className="text-brand-700 underline">
          Lademeter Rechner
        </Link>
        .
          </>
        }
      />
      <Container className="py-10">

      <ContentSection title="Lademeter je Palettentyp">
        <ReferenceTable
          caption="Grundfläche und Lademeter pro Palette"
          columns={["Palettentyp", "Grundfläche", "Lademeter je Palette", "Paletten je Lademeter"]}
          rows={palletLdmRows()}
        />
      </ContentSection>

      <ContentSection title="Lademeter nach Palettenanzahl">
        <ReferenceTable
          caption="Lademeter für 1 bis 33 Paletten (nicht gestapelt)"
          columns={["Anzahl Paletten", "Europaletten", "Industriepaletten"]}
          rows={ldmByQuantityRows([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20, 24, 26, 30, 33])}
        />
        <p>
          Gestapelte Ware zählt nach Bodenstellplätzen: Zwei Lagen halbieren die Lademeter (Anzahl ÷
          Lagen, aufgerundet). Details im Ratgeber{" "}
          <Link href="/ratgeber/stapelfaktor-lademeter/" className="text-brand-700 underline">
            Stapelfaktor bei Lademetern
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection title="Ladefläche und Palettenzahl je Fahrzeug">
        <ReferenceTable
          caption="Lademeter und Palettenkapazität je Fahrzeug"
          columns={["Fahrzeug", "Innenmaße (L × B)", "Lademeter", "Europaletten", "Industriepaletten", "Halbpaletten"]}
          rows={vehicleCapacityRows()}
        />
        <p>
          Mehr zu den einzelnen Fahrzeugen unter{" "}
          <Link href="/fahrzeuge/" className="text-brand-700 underline">
            Fahrzeuge &amp; Maße
          </Link>
          .
        </p>
      </ContentSection>

      <DownloadsCallout />

      <ContentSection title="Häufig gestellte Fragen">
        <FaqAccordion items={faqs} />
      </ContentSection>
    </Container>
    </>
  );
}
