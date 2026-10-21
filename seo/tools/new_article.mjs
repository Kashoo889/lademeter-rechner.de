// Legt aus dem Redaktionskalender ein Entwurfsgerüst an: seo/drafts/<slug>.md (nicht veröffentlicht).
//   node seo/tools/new_article.mjs --id L03
//   node seo/tools/new_article.mjs --date 2026-10-27        (beide Slots des Tages)
// Das Gerüst enthält absichtlich TODO-Platzhalter: check_draft.mjs lässt es erst durch, wenn sie ersetzt sind.
import fs from "node:fs";
import path from "node:path";
import {
  CATEGORY_BY_CLUSTER, CLUSTER_BY_CALENDAR, DRAFTS_DIR, SOURCE_URLS, TOOL_BY_CLUSTER, loadCalendar, readClusterLinks,
} from "./lib.mjs";

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const id = arg("--id");
const date = arg("--date");
if (!id && !date) {
  console.error("Aufruf: node seo/tools/new_article.mjs --id <KalenderID> | --date <JJJJ-MM-TT>");
  process.exit(2);
}

const calendar = loadCalendar();
const rows = calendar.filter((r) => (id ? r.ID === id : r.Datum === date));
if (rows.length === 0) {
  console.error("Kein Kalendereintrag gefunden.");
  process.exit(1);
}

const OUTLINES = {
  Referenzartikel: ["Das Wichtigste auf einen Blick (Tabelle mit Fundstellen)", "Rechtsgrundlage und Geltungsbereich", "Die Regeln im Einzelnen", "Rechenbeispiel", "Häufige Fehler", "Hinweis"],
  "Referenz-Tabelle": ["Die Tabelle", "So wurden die Werte berechnet", "Rechenbeispiel", "Häufige Fehler", "Hinweis"],
  Rechenleitfaden: ["Kurzantwort mit Formel", "Rechenweg Schritt für Schritt", "Rechenbeispiel mit Tabelle", "Sonderfälle", "Häufige Fehler", "Hinweis"],
  Ratgeber: ["Kurzantwort", "Hintergrund", "So gehen Sie vor", "Beispiel", "Häufige Fehler", "Hinweis"],
  Praxisleitfaden: ["Kurzantwort", "Vorbereitung", "Schritt für Schritt", "Beispiel", "Häufige Fehler", "Hinweis"],
  Erklärartikel: ["Kurzantwort", "Grundprinzip", "Anwendung in der Praxis", "Beispiel", "Häufige Fehler", "Hinweis"],
  Checkliste: ["Kurzantwort", "Checkliste", "Erläuterungen zu den Punkten", "Beispiel", "Häufige Fehler", "Hinweis"],
  Vergleich: ["Kurzantwort", "Vergleichstabelle", "Wann welche Variante", "Beispiel", "Häufige Fehler", "Hinweis"],
  Glossar: ["Kurzüberblick", "Begriffe von A bis Z", "Weiterführende Seiten", "Hinweis"],
};
const outlineFor = (format) => OUTLINES[Object.keys(OUTLINES).find((k) => format.startsWith(k))] ?? OUTLINES.Ratgeber;

fs.mkdirSync(DRAFTS_DIR, { recursive: true });
const clusterLinks = readClusterLinks();
for (const row of rows) {
  const slug = row["Vorgeschlagener Slug"];
  const target = path.join(DRAFTS_DIR, `${slug}.md`);
  if (fs.existsSync(target)) {
    console.log(`${row.ID}: ${path.relative(process.cwd(), target)} existiert bereits – übersprungen.`);
    continue;
  }
  const cluster = CLUSTER_BY_CALENDAR[row.Cluster] ?? "lademeter";
  const tags = [...new Set(row["Haupt-Keyword"].toLowerCase().split(/\s+/).filter((t) => t.length > 3))].slice(0, 5);
  const sourceCodes = row["Quellen/Evidenz"].split(/[,;]\s*/).filter(Boolean);
  const sources = sourceCodes.map((code) =>
    SOURCE_URLS[code]
      ? `  - title: "${code} – TODO genauen Paragrafen eintragen"\n    url: "${SOURCE_URLS[code]}"`
      : `  - title: "TODO Primärquelle zu ${code} ermitteln"\n    url: "https://TODO.example"`,
  ).join("\n");
  const links = (clusterLinks[cluster] ?? []).map((l) => `<!-- Link-Ziel Cluster: ${l} -->`).join("\n");
  const body = [
    `<!-- Entwurf ${row.ID} · geplant ${row.Datum} (Slot ${row.Slot}) · Tier ${row.Tier} · ≥ ${row["Mindestumfang (Wörter)"]} Wörter -->`,
    `<!-- Brief: seo/briefs/${row.Datum}-${row.ID}.md (falls erzeugt) -->`,
    links,
    "",
    "TODO Einstieg: 2–3 Sätze mit direkter Antwort, Haupt-Keyword früh nennen.",
    "",
    ...outlineFor(row.Format).flatMap((h) => [`## ${h}`, "", "TODO", ""]),
  ].join("\n");
  const content = `---
title: "TODO Titel ≤ 60 Zeichen (Arbeitstitel: ${row.Arbeitstitel.replace(/"/g, "'")})"
description: "TODO 130–160 Zeichen mit Nutzenversprechen und Keyword"
slug: "${slug}"
publishedAt: "${row.Datum}"
updatedAt: "${row.Datum}"
category: "${CATEGORY_BY_CLUSTER[cluster]}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
cluster: "${cluster}"
relatedTool: "${TOOL_BY_CLUSTER[cluster]}"
faq:
  - question: "TODO echte Frage 1"
    answer: "TODO Antwort 1 (2–4 Sätze)"
  - question: "TODO echte Frage 2"
    answer: "TODO Antwort 2 (2–4 Sätze)"
  - question: "TODO echte Frage 3"
    answer: "TODO Antwort 3 (2–4 Sätze)"
sources:
${sources}
---

${body}`;
  fs.writeFileSync(target, content, "utf8");
  console.log(`${row.ID}: ${path.relative(process.cwd(), target)} angelegt (Haupt-Keyword: ${row["Haupt-Keyword"]}).`);
}
console.log("Nächster Schritt: Quellen recherchieren, Entwurf schreiben, dann: node seo/tools/check_draft.mjs <datei>");
