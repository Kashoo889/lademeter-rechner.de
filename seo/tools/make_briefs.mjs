// Erzeugt Redaktions-Briefings aus dem Kalender: seo/briefs/<Datum>-<ID>.md
//   node seo/tools/make_briefs.mjs --from 2026-10-26 --days 14
//   node seo/tools/make_briefs.mjs --id L03
// Ein Briefing bündelt alles, was vor dem Schreiben recherchiert und entschieden werden muss
// (Quellen, echte Suchanfragen aus Autosuggest, Abgrenzung, Pflichtlinks, Gliederungsvorschlag).
// Es enthält keine erfundenen Fakten; Quellenfelder sind Aufgaben, keine Behauptungen.
import fs from "node:fs";
import path from "node:path";
import { CLUSTER_BY_CALENDAR, ROOT, SOURCE_URLS, TOOL_BY_CLUSTER, loadCalendar, readCalculators, readClusterLinks } from "./lib.mjs";

const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const from = arg("--from", null);
const days = Number(arg("--days", "14"));
const id = arg("--id", null);

const calendar = loadCalendar();
const autosuggest = JSON.parse(fs.readFileSync(path.join(ROOT, "seo", "data", "autosuggest-2026-10-20.json"), "utf8"));
const clusterLinks = readClusterLinks();
const calculators = readCalculators();

let rows;
if (id) rows = calendar.filter((r) => r.ID === id);
else {
  const start = new Date(from ?? "2026-10-26");
  const end = new Date(start.getTime() + days * 86400000);
  rows = calendar.filter((r) => new Date(r.Datum) >= start && new Date(r.Datum) < end);
}
if (rows.length === 0) {
  console.error("Keine passenden Kalendereinträge.");
  process.exit(1);
}

const SOURCE_NOTES = {
  OWN: "Eigene Rechenkerne (`lib/calculators`): Beispiele im Rechner nachrechnen und Ergebnis exakt übernehmen.",
  ADSP: "ADSp 2017 – Volltext der aktuellen Fassung (Herausgeber/Verband) abrufen, Fundstellen (Ziffer) notieren; nur belegte Regeln wiedergeben.",
  CMR: "CMR-Übereinkommen – amtliche/maßgebliche Textfassung ermitteln, Artikel zitieren.",
  EN13698: "EN 13698-1 (Beuth/DIN) und EPAL-Spezifikation – Normtext oder Herstellerunterlagen als Quelle, nicht Händlerseiten.",
  EPAL: "EPAL-Unterlagen (Hersteller/Pool) für Kennzeichnung, Qualitätsklassen, Tausch.",
  DIN12195: "DIN EN 12195-1/-2 – Normtext (Beuth) oder anerkannte Prüfstelle; Kennzeichnung nur mit Quelle.",
  VDI2700: "VDI 2700 ff. – Blattübersicht beim VDI; konkrete Zahlen nur mit Fundstelle (Blatt/Abschnitt).",
  CTU: "CTU-Code (IMO/ILO/UNECE) – Originaltext, Abschnitt nennen.",
  CARR: "Offizielle Carrier-Dokumentation (Geschäftskunden-Bedingungen/Preislisten). **Ohne Primärquelle nicht schreiben/Thema zurückstellen** (siehe V01).",
  IATA: "IATA-Regelwerk/Herstellerseite; Zahlen mit Quelle und Stand.",
  GS1: "GS1 Germany/GS1 – Spezifikation (SSCC) als Primärquelle.",
  DGUV: "DGUV-Vorschriften/-Regeln (Originaltext).",
  BALM: "BALM/Toll Collect – aktuelle Mautsätze nur von der amtlichen Seite, Stand-Datum.",
  BAG: "Bundesamt für Logistik und Mobilität (BALM)/BAG – amtliche Veröffentlichung.",
  ISO: "ISO-Norm/amtliche Zusammenfassung; keine Händlerangaben.",
  ICC: "ICC Incoterms 2020 – offizielle Beschreibung.",
  Hersteller: "Herstellerdatenblätter (Fahrzeug/Aufbau) mit Modell und Stand.",
  Zoll: "Zoll.de / amtliche Merkblätter.",
  BKatV: "Bußgeldkatalog-Verordnung (Originaltext) mit Stand-Datum; Rechtsfolgen ändern sich.",
  ADR: "ADR (UNECE/BMDV) – nur Grundregeln, Verweis auf Fachberater.",
  SOLAS: "SOLAS Kapitel VI / VGM-Leitlinien der zuständigen Stelle.",
  DIN: "Einschlägige DIN-/EN-Norm (Beuth).",
  FEFCO: "FEFCO-Code (Herstellerverband) – offizielle Beschreibung.",
  ATP: "ATP-Übereinkommen (UNECE) – Originaltext.",
  DLG: "DLG-/Fachverbandsangaben für Schüttgewichte.",
  ENplus: "ENplus/DIN EN ISO 17225 – Normkennwerte.",
  "VO 561/2006": "Verordnung (EG) Nr. 561/2006 – EUR-Lex.",
};

const OUTLINES = {
  Referenzartikel: ["Das Wichtigste auf einen Blick (Tabelle mit Fundstellen)", "Rechtsgrundlage und Geltungsbereich", "Die Regeln im Einzelnen", "Rechenbeispiel", "Häufige Fehler", "Hinweis"],
  "Referenz-Tabelle": ["Die Tabelle", "So wurden die Werte berechnet", "Rechenbeispiel", "Häufige Fehler", "Hinweis"],
  Rechenleitfaden: ["Kurzantwort mit Formel", "Rechenweg Schritt für Schritt", "Rechenbeispiel mit Tabelle", "Sonderfälle", "Häufige Fehler", "Hinweis"],
  Checkliste: ["Kurzantwort", "Checkliste", "Erläuterungen zu den Punkten", "Beispiel", "Häufige Fehler", "Hinweis"],
  Vergleich: ["Kurzantwort", "Vergleichstabelle", "Wann welche Variante", "Beispiel", "Häufige Fehler", "Hinweis"],
  Glossar: ["Kurzüberblick", "Begriffe von A bis Z", "Weiterführende Seiten", "Hinweis"],
};
const outlineFor = (format) => OUTLINES[Object.keys(OUTLINES).find((k) => format.startsWith(k))] ?? ["Kurzantwort", "Hintergrund", "So gehen Sie vor", "Beispiel", "Häufige Fehler", "Hinweis"];

const stop = new Set(["lkw", "und", "der", "die", "das", "mit", "von", "für", "in", "ein", "eine"]);
const tokens = (s) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter((t) => t.length > 2 && !stop.has(t));

fs.mkdirSync(path.join(ROOT, "seo", "briefs"), { recursive: true });
let made = 0;
for (const row of rows) {
  const kw = row["Haupt-Keyword"];
  const kwTokens = tokens(kw);
  const related = Object.entries(autosuggest)
    .map(([phrase, v]) => {
      const t = new Set(tokens(phrase));
      const overlap = kwTokens.filter((x) => [...t].some((y) => y.startsWith(x.slice(0, Math.max(4, x.length - 2))))).length / Math.max(1, kwTokens.length);
      return { phrase, overlap, calls: v.calls, rank: v.best_rank };
    })
    .filter((x) => x.overlap >= 0.6 && x.phrase !== kw)
    .sort((a, b) => b.calls - a.calls || a.rank - b.rank)
    .slice(0, 10);

  const cluster = CLUSTER_BY_CALENDAR[row.Cluster];
  const tool = calculators.find((c) => c.slug === TOOL_BY_CLUSTER[cluster]);
  const siblings = calendar.filter((r) => r.Cluster === row.Cluster && r.ID !== row.ID).slice(0, 8);
  const codes = row["Quellen/Evidenz"].split(/[,;]\s*/).filter(Boolean);
  const sourceLines = codes.map((c) => `- **${c}:** ${SOURCE_NOTES[c] ?? "Primärquelle ermitteln und eintragen."}${SOURCE_URLS[c] ? ` Gesetzestext: ${SOURCE_URLS[c]}` : ""}`);

  const md = `# Briefing ${row.ID}: ${row.Arbeitstitel}

| Feld | Wert |
|---|---|
| Veröffentlichung geplant | ${row.Datum}, Slot ${row.Slot} (nicht früher!) |
| Cluster | ${row.Cluster} (\`${cluster}\`) |
| Haupt-Keyword | \`${kw}\` – in Google-Autosuggest gefunden: ${row["In Google-Autosuggest gefunden"]} |
| Suchintention (Einschätzung) | ${row["Suchintention (Einschätzung)"]} |
| Tier / Mindestumfang | ${row.Tier} / ${row["Mindestumfang (Wörter)"]} Wörter (Untergrenze, kein Ziel) |
| Format | ${row.Format} |
| Slug | \`${row["Vorgeschlagener Slug"]}\` |
| Juristische Quellenprüfung | ${row["Juristische Quellenprüfung"]} · Review-Zyklus ${row["Review-Zyklus"]} |
| Status | ${row.Status} |

## Entscheidung vor dem Schreiben (Validierungs-Gate)
- [ ] Nachfrage plausibel? (Autosuggest-Status oben; sonst Keyword Planner/Search Console prüfen) – bei negativem Ergebnis zurückstellen oder mit verwandtem Artikel zusammenlegen.
- [ ] Haupt-Keyword gehört keiner anderen URL (\`seo/04-themencluster-und-interne-verlinkung.md\` §2).
${row["Pruefhinweis (Duplikat-/Ueberschneidungsrisiko)"] ? `- [ ] **Abgrenzung:** ${row["Pruefhinweis (Duplikat-/Ueberschneidungsrisiko)"]}` : "- [ ] Keine bekannte Überschneidung eingetragen – trotzdem Titel und Kernaussagen mit bestehenden Artikeln vergleichen."}

## Eigener Mehrwert (Pflicht)
${row["Eigener Mehrwert"]}

## Echte Suchanfragen aus Google-Autosuggest (Stand 20.10.2026)
${related.length ? related.map((r) => `- ${r.phrase}`).join("\n") : "- keine ähnlichen Vorschläge erhoben (Long-Tail) – Fragen aus „Ähnliche Fragen“ auf google.de und Support-Anfragen sammeln."}
→ Für die FAQ (3–6 **echte** Fragen) und die H2-Struktur nutzen; keine Füllfragen.

## Quellen (vor dem Schreiben beschaffen, Fundstellen notieren)
${sourceLines.join("\n")}

## Pflicht-Links
- Rechner: [${tool?.slug}](${tool?.href})
- Cluster-Links: ${(clusterLinks[cluster] ?? []).join(", ") || "–"}
- Weitere Artikel im Cluster (Kalender, noch nicht veröffentlicht – erst verlinken, wenn live): ${siblings.map((s) => `${s.ID} (${s["Vorgeschlagener Slug"]})`).join(", ") || "–"}
- Bestehende Artikel/Fahrzeugseiten: mindestens 2 passende verlinken (siehe \`lib/content/clusters.ts\`).

## Gliederungsvorschlag (anpassen, nicht auffüllen)
${outlineFor(row.Format).map((h, i) => `${i + 1}. ${h}`).join("\n")}

## Faktencheck-Tabelle (alle Zahlen/Regeln eintragen)
| Aussage/Zahl im Text | Quelle (URL/Norm) | Fundstelle | Stand | geprüft von |
|---|---|---|---|---|
| | | | | |

## Ablauf
1. \`node seo/tools/new_article.mjs --id ${row.ID}\` → Gerüst in \`seo/drafts/\`.
2. Recherchieren, schreiben, Beispiele im Rechner nachrechnen.
3. \`node seo/tools/check_draft.mjs seo/drafts/${row["Vorgeschlagener Slug"]}.md\` bis „BESTANDEN“.
4. Gegenlesen (bei Rechts-/Sicherheitsthemen zweite Person) und Freigabe durch den Betreiber.
5. Erst ab ${row.Datum}: \`node seo/tools/promote_draft.mjs seo/drafts/${row["Vorgeschlagener Slug"]}.md --approved-by "Name"\`; danach \`npm test\` und \`npm run check:seo\`. Deployment nur nach Freigabe.
`;
  fs.writeFileSync(path.join(ROOT, "seo", "briefs", `${row.Datum}-${row.ID}.md`), md, "utf8");
  made++;
}
console.log(`${made} Briefings in seo/briefs/ geschrieben.`);
