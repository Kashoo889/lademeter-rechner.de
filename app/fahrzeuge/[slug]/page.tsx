import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { ContentSection } from "@/components/content/ContentSection";
import { FaqAccordion } from "@/components/content/FaqAccordion";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { LoadPlan } from "@/components/calculator/LoadPlan";
import { ToolNotice } from "@/components/calculator/ToolNotice";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getVehiclePage, VEHICLE_PAGES } from "@/lib/content/fahrzeuge";
import { vehicleCapacity, vehicleFloorLdm } from "@/lib/content/referenceData";
import { calculateTruckPallets } from "@/lib/calculators/truckPallets";
import { VEHICLES, vehicleBasisNote } from "@/lib/calculators/vehicles";
import { palettenToShare, PALETTEN_INITIAL } from "@/lib/shareFormats";
import { buildPrefilledHref } from "@/lib/shareState";
import { formatDecimal } from "@/lib/parseDecimal";

export function generateStaticParams() {
  return VEHICLE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(props: PageProps<"/fahrzeuge/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getVehiclePage(slug);
  if (!page) return { title: "Fahrzeug nicht gefunden", robots: { index: false } };
  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/fahrzeuge/${page.slug}/`,
    absoluteTitle: true,
  });
}

export default async function FahrzeugPage(props: PageProps<"/fahrzeuge/[slug]">) {
  const { slug } = await props.params;
  const page = getVehiclePage(slug);
  if (!page) notFound();

  const breadcrumbItems = [
    { label: "Fahrzeuge & Maße", href: "/fahrzeuge/" },
    { label: page.name, href: `/fahrzeuge/${page.slug}/` },
  ];

  const primaryId = page.vehicleIds[0];
  const primary = VEHICLES[primaryId];

  const specRows = page.vehicleIds.map((id) => {
    const spec = VEHICLES[id];
    return [
      spec.label,
      `${formatDecimal(spec.lengthCm / 100)} × ${formatDecimal(spec.widthCm / 100)} × ${formatDecimal(spec.heightCm / 100)} m`,
      `${formatDecimal(vehicleFloorLdm(id), 1)} ldm`,
      `ca. ${spec.payloadKg.toLocaleString("de-DE")} kg`,
    ];
  });

  const capacityRows = page.vehicleIds.flatMap((id) => {
    const euro = vehicleCapacity(id, "euro");
    const industrial = vehicleCapacity(id, "industrial");
    const half = vehicleCapacity(id, "half");
    const format = (value: { lengthwise: number; best: number }) =>
      value.lengthwise === value.best ? String(value.best) : `${value.lengthwise} längs · ${value.best} max.`;
    return [[VEHICLES[id].label, format(euro), format(industrial), format(half)]];
  });

  const euroResult = calculateTruckPallets({
    vehiclePreset: primaryId,
    palletType: "euro",
    palletCount: 999,
    allowRotation: true,
    allowStacking: false,
  });

  const calculatorHref = buildPrefilledHref(
    "/lkw-palettenrechner/",
    palettenToShare({
      ...PALETTEN_INITIAL,
      vehiclePreset: primaryId,
      palletCount: String(euroResult?.maxCapacity ?? 1),
    }),
  );

  const notes = page.vehicleIds
    .map((id) => vehicleBasisNote(VEHICLES[id]))
    .filter((note): note is string => Boolean(note));

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title={page.h1}
        breadcrumbs={breadcrumbItems}
        eyebrow="Fahrzeuge & Maße"
        description={
          <div className="space-y-3">
            {page.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        }
      />
      <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <ReferenceTable
            caption="Innenmaße und Nutzlast (Richtwerte)"
            columns={["Fahrzeug", "Innenmaße (L × B × H)", "Lademeter", "Typ. Nutzlast"]}
            rows={specRows}
          />
          <ReferenceTable
            caption="Rechnerische Palettenkapazität (nicht gestapelt)"
            columns={["Fahrzeug", "Europaletten", "Industriepaletten", "Halbpaletten"]}
            rows={capacityRows}
          />
          {notes.map((note) => (
            <ToolNotice key={note}>{note}</ToolNotice>
          ))}
        </div>
        <div className="min-w-0 space-y-4">
          {euroResult && euroResult.floorPositions > 0 ? (
            <LoadPlan
              lengthCm={euroResult.layout.vehicleLengthCm}
              widthCm={euroResult.layout.vehicleWidthCm}
              placements={euroResult.layout.placements}
              title={`Ladeplan: ${euroResult.maxCapacity} Europaletten – ${primary.label}`}
              frontLabel="Stirnwand"
            />
          ) : null}
          <Button href={calculatorHref} className="w-full">
            Im Palettenrechner öffnen und anpassen
          </Button>
        </div>
      </div>

      {page.sections.map((section) => (
        <ContentSection key={section.heading} title={section.heading}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets ? (
            <ul className="list-disc space-y-2 pl-5">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </ContentSection>
      ))}

      <ContentSection title="Häufig gestellte Fragen">
        <FaqAccordion items={page.faqs} />
      </ContentSection>

      <ContentSection title="Weiterführende Ratgeber">
        <RelatedArticles currentSlug="" slugs={page.relatedArticles} />
      </ContentSection>

      <p className="mt-6 text-sm text-slate-600">
        Weitere Fahrzeuge:{" "}
        <Link href="/fahrzeuge/" className="text-brand-700 underline">
          Übersicht aller Fahrzeuge &amp; Maße
        </Link>
        . Annahmen und Quellen der Berechnung: <Link href="/methodik/" className="text-brand-700 underline">Berechnungsgrundlagen</Link>.
      </p>
      </Container>
    </>
  );
}
