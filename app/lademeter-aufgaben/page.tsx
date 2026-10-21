import type { Metadata } from "next";
import Link from "next/link";
import { DownloadLanding } from "@/components/content/DownloadLanding";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DOWNLOADS_LIVE, worksheetAsset } from "@/lib/downloads";

const metaDescription =
  "Kostenloses Aufgabenblatt zum Lademeter berechnen: 12 Aufgaben mit Lösungsweg für Ausbildung und Unterricht – Stapellagen, Gewicht, Auslastung.";

// Hidden (noindex, not in sitemap, not linked) until DOWNLOADS_LIVE is switched on in lib/downloads.ts.
export const metadata: Metadata = buildPageMetadata({
  title: "Lademeter berechnen: Aufgaben mit Lösungen (PDF)",
  description: metaDescription,
  path: worksheetAsset.path,
  absoluteTitle: true,
  noindex: !DOWNLOADS_LIVE,
});

const faqs = [
  {
    question: "Darf ich das Aufgabenblatt im Unterricht kopieren und verändern?",
    answer:
      "Ja. Das Blatt steht unter der Lizenz CC BY 4.0: Nutzung, Vervielfältigung und Anpassung sind mit Quellenangabe „lademeter-rechner.de“ erlaubt.",
  },
  {
    question: "Gibt es eine Fassung ohne Lösungen?",
    answer:
      "Ja. Neben dem Blatt mit Lösungen steht eine Schülerfassung zum Download bereit, die nur die 12 Aufgaben enthält – ohne Lösungen, Bewertungsvorschlag und Hinweise für Lehrkräfte.",
  },
  {
    question: "Stammen die Aufgaben aus IHK-Prüfungen?",
    answer:
      "Nein. Alle Aufgaben und Zahlen wurden eigens für dieses Blatt erstellt. Prüfungsaufgaben der Kammern und Verlagsaufgaben dürfen nicht kopiert werden und sind hier nicht enthalten.",
  },
  {
    question: "Rechnen Speditionen genauso ab wie im Aufgabenblatt?",
    answer:
      "Das Blatt vermittelt die Grundrechnung. Rundung, Faktor je Lademeter und Mindestgewicht sind Tarifregeln der jeweiligen Spedition und können abweichen.",
  },
];

export default function LademeterAufgabenPage() {
  return (
    <DownloadLanding
      asset={worksheetAsset}
      crumb="Aufgabenblatt Lademeter"
      metaDescription={metaDescription}
      h1="Lademeter berechnen: Aufgabenblatt mit Lösungen für Ausbildung und Unterricht"
      description="12 Aufgaben mit vollständigem Rechenweg – von der einzelnen Europalette über Stapellagen und Mischladung bis zum frachtpflichtigen Gewicht. Als PDF, kostenlos und frei nutzbar."
      intro="Dieses Aufgabenblatt trainiert die Lademeter-Rechnung Schritt für Schritt. Es richtet sich an Lehrkräfte, Ausbilder und Auszubildende in Spedition und Logistik sowie an alle, die Lademeter üben möchten. Zu jeder der 12 Aufgaben gibt es Lösung und Rechenweg; für den Unterricht steht zusätzlich eine Schülerfassung ohne Lösungen bereit."
      featuresTitle="Das steckt im Aufgabenblatt"
      features={[
        { title: "12 Aufgaben in drei Stufen", text: "Grundlagen (Formel, Stapellagen), Anwendung (Mischladung, Maße in mm/cm/m, Auslastung) und Praxis (Lademetergewicht, frachtpflichtiges Gewicht, Stapelhöhe)." },
        { title: "Lösungen mit Rechenweg", text: "Zu jeder Aufgabe Schritt-für-Schritt-Lösung und Ergebnis, auf eigenen Seiten abgesetzt." },
        { title: "Schülerfassung", text: "Eigene PDF mit den Aufgaben ohne Lösungen (3 Seiten) für den Unterricht." },
        { title: "Bewertungsvorschlag", text: "35 Punkte insgesamt, anpassbar. Teilpunkte für den richtigen Rechenweg bei Folgefehlern." },
        { title: "Merkkasten", text: "Formeln und Rechenkonvention (Referenzbreite 2,4 m, Rundung auf zwei Dezimalstellen) auf einen Blick." },
        { title: "Hinweise für Lehrkräfte", text: "Konvention statt Norm, Rundung der Speditionen, Prüfung der Stapelhöhe und Lizenzhinweis." },
      ]}
      howTitle="So setzen Sie das Blatt ein"
      how={
        <>
          <ol className="list-decimal space-y-2 pl-5 marker:font-bold marker:text-brand-600">
            <li>Schülerfassung ausgeben oder digital bereitstellen; die Lösungsfassung bleibt der Lehrkraft vorbehalten.</li>
            <li>Mit den Aufgaben 1 bis 4 die Formel sichern, mit 5 bis 9 Stapellagen, Mischladungen und Einheiten üben.</li>
            <li>Mit den Aufgaben 10 bis 12 das frachtpflichtige Gewicht und die Plausibilitätsprüfung der Stapelhöhe besprechen.</li>
            <li>Zur Selbstkontrolle Ergebnisse im <Link href="/" className="font-semibold text-brand-700 underline">Lademeter-Rechner</Link> nachrechnen.</li>
          </ol>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800">
            <p><strong>Lademeter</strong> = Länge [m] × Breite [m] ÷ 2,4 m × Bodenstellplätze</p>
            <p><strong>Bodenstellplätze</strong> = Anzahl ÷ Stapellagen, aufgerundet</p>
            <p><strong>Frachtpflichtiges Gewicht</strong> = höherer Wert aus tatsächlichem Gewicht und Lademeter × Faktor</p>
          </div>
          <p>
            Passend dazu: die <Link href="/lademeter-excel-vorlage/" className="font-semibold text-brand-700 underline">Excel-Vorlage zum Lademeter berechnen</Link>,
            der Ratgeber <Link href="/ratgeber/stapelfaktor-lademeter/" className="font-semibold text-brand-700 underline">Stapelfaktor bei Lademetern</Link> und
            die <Link href="/lademeter-tabelle/" className="font-semibold text-brand-700 underline">Lademeter-Tabelle</Link>.
          </p>
        </>
      }
      checkedTitle="Wie wurde geprüft?"
      checked={
        <p>
          Alle Lösungswerte wurden mit den Rechenkernen dieser Website berechnet und nicht von Hand eingetragen; die Rechenwege wurden
          zusätzlich von Hand nachgerechnet. Die Aufgaben und Zahlen sind eigens für dieses Blatt erstellt. Es wurden keine IHK-Prüfungs-
          oder Verlagsaufgaben verwendet. Der Rechenweg ist unter{" "}
          <Link href="/methodik/" className="font-semibold text-brand-700 underline">Berechnungsgrundlagen</Link> dokumentiert.
        </p>
      }
      limits={
        <>
          Die Lademeter-Formel ist eine Branchenkonvention, keine Norm. Speditionen können abweichend runden oder andere Faktoren je Lademeter
          ansetzen; das Blatt rechnet mit den exakten Werten. Die Aufgaben zum Stapeln setzen voraus, dass die Ware tatsächlich stapelbar ist
          und gesichert werden kann. Der Wert 2,70 m für die Innenhöhe ist ein Planungswert, keine Herstellerangabe.
        </>
      }
      faqs={faqs}
      articleSlugs={["was-sind-lademeter", "stapelfaktor-lademeter", "lademeter-in-kg-umrechnen"]}
    />
  );
}
