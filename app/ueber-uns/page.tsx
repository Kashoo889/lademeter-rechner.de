import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { operator } from "@/lib/legal/operator";
import { adsActive } from "@/lib/ads/config";

const breadcrumbItems = [{ label: "Über uns", href: "/ueber-uns/" }];

export const metadata: Metadata = buildPageMetadata({
  title: "Über uns",
  description:
    "Wer hinter Lademeter Rechner steht, wie die Rechner entstehen, wie Inhalte geprüft werden und wie die Seite finanziert wird.",
  path: "/ueber-uns/",
});

export default function UeberUnsPage() {
  const { authorName, bio } = operator.about;

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title="Über uns"
        breadcrumbs={breadcrumbItems}
        description="Wer hinter Lademeter Rechner steht und wie wir arbeiten."
      />
      <Container className="max-w-3xl py-10">
      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 text-base leading-7 text-slate-700 shadow-card sm:p-8">
        <p>
          Lademeter Rechner bietet kostenlose Online-Rechner und Ratgeber rund um Lademeter, Paletten,
          LKW-Beladung und Volumengewicht – für alle, die Ladung planen: Disponenten, Versandleiter,
          Lageristen, kleine Händler und Privatpersonen mit einem Umzug oder einer Palettensendung.
        </p>

        <h2 className="pt-4 text-xl font-extrabold tracking-tight text-slate-950">Unser Anspruch</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Nachvollziehbar:</strong> Jede Formel und jedes Standardmaß ist auf der Seite{" "}
            <Link href="/methodik/" className="text-brand-700 underline">
              Berechnungsgrundlagen
            </Link>{" "}
            dokumentiert.
          </li>
          <li>
            <strong>Getestet:</strong> Die Rechenkerne sind mit automatisierten Tests abgesichert,
            darunter bekannte Referenzwerte wie 33/34 Europaletten im Sattelzug.
          </li>
          <li>
            <strong>Ehrlich:</strong> Ergebnisse sind Orientierung, keine Ladeplanung. Annahmen und
            Grenzen stehen direkt am Ergebnis.
          </li>
          <li>
            <strong>Datensparsam:</strong> Berechnungen laufen im Browser; Ihre Eingaben werden nicht
            gespeichert (siehe{" "}
            <Link href="/datenschutz/" className="text-brand-700 underline">
              Datenschutz
            </Link>
            ).
          </li>
        </ul>

        <h2 className="pt-4 text-xl font-extrabold tracking-tight text-slate-950">Wer steht dahinter?</h2>
        {authorName || bio ? (
          <p>
            {authorName ? <strong>{authorName}</strong> : null}
            {authorName && bio ? ": " : null}
            {bio}
          </p>
        ) : (
          <p>
            Anbieter und Ansprechpartner finden Sie im{" "}
            <Link href="/impressum/" className="text-brand-700 underline">
              Impressum
            </Link>
            .
          </p>
        )}

        <h2 className="pt-4 text-xl font-extrabold tracking-tight text-slate-950">Redaktion und Korrekturen</h2>
        <p>
          Ratgeber nennen ihre Quellen (u. a. Gesetzestexte auf gesetze-im-internet.de) und zeigen
          Veröffentlichungs- und Aktualisierungsdatum. Fehler korrigieren wir und aktualisieren das
          Datum. Hinweise nehmen wir über die{" "}
          <Link href="/kontakt/" className="text-brand-700 underline">
            Kontaktseite
          </Link>{" "}
          entgegen.
        </p>

        <h2 className="pt-4 text-xl font-extrabold tracking-tight text-slate-950">Finanzierung</h2>
        <p>
          {adsActive
            ? "Das Angebot ist kostenlos und wird durch Werbung finanziert. Anzeigen sind als „Anzeige“ gekennzeichnet und beeinflussen weder Berechnungen noch Inhalte. Eigene Analyse- oder Tracking-Dienste setzen wir nicht ein."
            : "Das Angebot ist kostenlos und werbefrei. Wir setzen keine Anzeigen und keine Analyse- oder Tracking-Dienste ein."}
        </p>
      </div>
      </Container>
    </>
  );
}
