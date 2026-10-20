import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ReferenceTable } from "@/components/content/ReferenceTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { VEHICLE_PAGES } from "@/lib/content/fahrzeuge";
import { vehicleCapacityRows } from "@/lib/content/referenceData";
import { PageHero } from "@/components/layout/PageHero";

const breadcrumbItems = [{ label: "Fahrzeuge & Maße", href: "/fahrzeuge/" }];

export const metadata: Metadata = buildPageMetadata({
  title: "LKW-Maße: Ladefläche, Lademeter & Paletten je Fahrzeug",
  description:
    "Innenmaße, Lademeter und Palettenanzahl von Sattelzug, Wechselbrücke, 12-Tonner, 7,5-Tonner, Transporter und Container im Vergleich.",
  path: "/fahrzeuge/",
  absoluteTitle: true,
});

export default function FahrzeugePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title="Fahrzeuge &amp; Maße für die Ladeplanung"
        breadcrumbs={breadcrumbItems}
        description={
          <>
            Wie lang ist eine Ladefläche, wie viele Lademeter hat sie und wie viele Paletten passen hinein?
        Die Übersicht zeigt typische Innenmaße und rechnerische Kapazitäten. Alle Werte stammen aus
        denselben Berechnungen wie die Rechner und sind Planungsrichtwerte, keine Herstellerangaben.
          </>
        }
      />
      <Container className="py-10">

      <section className="mt-10" aria-labelledby="vergleich">
        <h2 id="vergleich" className="text-xl font-semibold text-slate-950">
          Fahrzeuge im Vergleich
        </h2>
        <div className="mt-4">
          <ReferenceTable
            caption="Innenmaße, Lademeter und Palettenkapazität (nicht gestapelt)"
            columns={["Fahrzeug", "Innenmaße (L × B)", "Lademeter", "Europaletten", "Industriepaletten", "Halbpaletten"]}
            rows={vehicleCapacityRows()}
          />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          „Längs“ = alle Paletten in Fahrtrichtung, „max.“ = bestes Verladeschema inklusive gemischter
          Anordnung. Das Vorgehen beschreiben die{" "}
          <Link href="/methodik/" className="text-brand-700 underline">
            Berechnungsgrundlagen
          </Link>
          .
        </p>
      </section>

      <section className="mt-12" aria-labelledby="fahrzeugarten">
        <h2 id="fahrzeugarten" className="text-xl font-semibold text-slate-950">
          Fahrzeugarten im Detail
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VEHICLE_PAGES.map((page) => (
            <li key={page.slug} className="relative rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md">
              <h3 className="text-base font-semibold text-slate-950">
                <Link
                  href={`/fahrzeuge/${page.slug}/`}
                  className="after:absolute after:inset-0 after:content-[''] hover:underline"
                >
                  {page.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{page.metaDescription}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-800">
                Maße &amp; Kapazität
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-slate-600">
        Eigenes Fahrzeug? Im{" "}
        <Link href="/lkw-palettenrechner/" className="text-brand-700 underline">
          LKW Palettenrechner
        </Link>{" "}
        können Sie beliebige Innenmaße eingeben.
      </p>
    </Container>
    </>
  );
}
