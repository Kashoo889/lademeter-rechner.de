// Qualitäts-Gate für Artikelentwürfe (siehe seo/05-content-richtlinien.md §5).
//   node seo/tools/check_draft.mjs seo/drafts/mein-artikel.md [weitere.md]
//   node seo/tools/check_draft.mjs --all
// Beendet mit Exit-Code 1, wenn mindestens eine Prüfung FEHLschlägt. WARNungen blockieren nicht,
// müssen aber im Review bewusst entschieden werden.
import fs from "node:fs";
import path from "node:path";
import {
  CALENDAR_CSV, ROOT, listDrafts, listPublished, loadCalendar, ngrams, readCalculators, readClusterIds, readClusterLinks,
  routeExists, splitDraft, wordCount,
} from "./lib.mjs";

const args = process.argv.slice(2);
const files = args.includes("--all") ? listDrafts() : args.filter((a) => !a.startsWith("--"));
if (files.length === 0) {
  console.error("Aufruf: node seo/tools/check_draft.mjs <entwurf.md ...> | --all");
  process.exit(2);
}

const calendar = fs.existsSync(CALENDAR_CSV) ? loadCalendar() : [];
const clusterIds = readClusterIds();
const clusterLinks = readClusterLinks();
const calculators = readCalculators();
const toolHrefs = new Set(calculators.map((c) => c.href));
const draftSlugs = new Set(listDrafts().map((f) => path.basename(f, ".md")));
const published = listPublished().map((f) => ({ name: path.basename(f), text: splitDraft(fs.readFileSync(f, "utf8")).body }));
const otherDrafts = (self) => listDrafts().filter((f) => path.resolve(f) !== path.resolve(self)).map((f) => ({ name: `Entwurf ${path.basename(f)}`, text: splitDraft(fs.readFileSync(f, "utf8")).body }));

const AUTHORITATIVE = /(^|\.)(gesetze-im-internet\.de|bgbl\.de|bmdv\.bund\.de|bmj\.de|bag\.bund\.de|bast\.de|dguv\.de|din\.de|beuth\.de|vdi\.de|iata\.org|iso\.org|epal-pallets\.org|gs1\.org|gs1-germany\.de|eur-lex\.europa\.eu|europa\.eu|unece\.org|zoll\.de|bundesnetzagentur\.de|ihk\.de|creativecommons\.org|dhl\.com|dhl\.de|dpd\.com|gls-group\.com|ups\.com|fedex\.com|wikipedia\.org|bgetem\.de|baua\.de|bibb\.de)$/;
const BANNED = [
  "in der heutigen zeit", "es ist wichtig zu beachten", "zusammenfassend lässt sich sagen", "in diesem artikel erfahren sie",
  "spielt eine wichtige rolle", "tauchen wir ein", "in der welt der logistik", "ein wahres", "revolutionär", "game-changer",
];

let totalFail = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const { frontmatter: fm, body, error } = splitDraft(raw);
  const slugFromFile = path.basename(file, ".md");
  const results = [];
  const add = (level, label, detail = "") => results.push({ level, label, detail });

  if (!fm) {
    add("FAIL", "Frontmatter", error);
  } else {
    const row = calendar.find((r) => r["Vorgeschlagener Slug"] === slugFromFile || r["Vorgeschlagener Slug"] === fm.slug);
    const tier = row?.Tier ?? "B";
    const minWords = Number(row?.["Mindestumfang (Wörter)"] ?? (tier === "A" ? 1800 : 1200));
    const keyword = row?.["Haupt-Keyword"] ?? "";

    // --- Frontmatter
    for (const key of ["title", "description", "slug", "publishedAt", "updatedAt", "category", "tags", "relatedTool", "cluster", "faq", "sources"]) {
      if (fm[key] === undefined || fm[key] === null || fm[key] === "") add("FAIL", `Frontmatter: ${key}`, "fehlt");
    }
    if (fm.slug && fm.slug !== slugFromFile) add("FAIL", "Slug = Dateiname", `${fm.slug} ≠ ${slugFromFile}`);
    if (fm.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.slug)) add("FAIL", "Slug-Format", "nur a-z, 0-9 und Bindestriche");
    if (fm.title) {
      const len = fm.title.length;
      add(len <= 60 ? "PASS" : "FAIL", "Titel ≤ 60 Zeichen", `${len} Zeichen`);
      if (/\|/.test(fm.title)) add("WARN", "Titel enthält „|“", "Marken-Suffix wird automatisch ergänzt");
    }
    if (fm.description) {
      const len = fm.description.length;
      add(len >= 130 && len <= 160 ? "PASS" : len >= 120 && len <= 170 ? "WARN" : "FAIL", "Description 130–160 Zeichen", `${len} Zeichen`);
    }
    if (fm.relatedTool && !calculators.some((c) => c.slug === fm.relatedTool)) add("FAIL", "relatedTool", `unbekannter Rechner „${fm.relatedTool}“`);
    if (fm.cluster && !clusterIds.includes(fm.cluster)) add("FAIL", "cluster", `unbekannt „${fm.cluster}“ (${clusterIds.join(", ")})`);
    if (fm.publishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(String(fm.publishedAt))) add("FAIL", "publishedAt", "Format JJJJ-MM-TT");
    if (Array.isArray(fm.faq)) {
      add(fm.faq.length >= 3 && fm.faq.length <= 6 ? "PASS" : "FAIL", "FAQ: 3–6 Fragen", `${fm.faq.length}`);
      for (const q of fm.faq) if (!q?.question || !q?.answer || String(q.answer).length < 60) add("FAIL", "FAQ-Eintrag", `„${String(q?.question).slice(0, 40)}“ unvollständig/zu kurz`);
    }
    if (Array.isArray(fm.sources)) {
      add(fm.sources.length >= 1 ? "PASS" : "FAIL", "Quellen vorhanden", `${fm.sources.length}`);
      for (const s of fm.sources) {
        if (!s?.title || !/^https:\/\//.test(s?.url ?? "")) add("FAIL", "Quelle", `„${s?.title}“ ohne https-URL`);
      }
    }

    // --- Inhalt
    const words = wordCount(body);
    add(words >= minWords ? "PASS" : "FAIL", `Umfang ≥ ${minWords} Wörter (Tier ${tier})`, `${words} Wörter`);
    if (/^# /m.test(body)) add("FAIL", "Keine H1 im Text", "die H1 kommt aus dem Titel");
    const h2 = (body.match(/^## /gm) || []).length;
    add(h2 >= 3 ? "PASS" : "FAIL", "Mindestens 3 H2", `${h2}`);
    if (/^#### /m.test(body)) add("WARN", "H4 verwendet", "Gliederung prüfen");
    add(/^\|.+\|\s*$/m.test(body) || /Beispiel/i.test(body) ? "PASS" : "FAIL", "Tabelle oder Rechenbeispiel", "");
    if (tier === "A" && !/!\[[^\]]+\]\(/.test(body)) add("WARN", "Tier A: eigene Grafik mit alt-Text", "keine Bildeinbindung gefunden (Grafik später ergänzen oder bewusst verzichten)");

    const lower = body.toLowerCase();
    const banned = BANNED.filter((phrase) => lower.includes(phrase));
    add(banned.length === 0 ? "PASS" : "FAIL", "Keine Floskeln", banned.join(", "));
    const placeholders = body.match(/TODO|XXX|Lorem|\[…\]|\[\.\.\.\]|\[Platzhalter|FIXME|\{\{/g);
    add(!placeholders ? "PASS" : "FAIL", "Keine Platzhalter", placeholders ? [...new Set(placeholders)].join(", ") : "");
    if (JSON.stringify(fm).match(/TODO|XXX|FIXME/)) add("FAIL", "Keine Platzhalter im Frontmatter", "TODO/XXX gefunden");
    const dotDecimals = body.match(/\b\d+\.\d{1,2}\s?(m|cm|kg|t|ldm|%|m²|m³)\b/g);
    add(!dotDecimals ? "PASS" : "WARN", "Deutsches Zahlenformat (Dezimalkomma)", dotDecimals ? [...new Set(dotDecimals)].slice(0, 4).join(", ") : "");
    if (/\b(du|dein|deine|deinen|dir)\b/i.test(body.replace(/\|/g, " "))) add("WARN", "Ansprache „Sie“", "„du/dein“ gefunden");

    // Stand-Datum bei Rechtsquellen
    const lawSource = (fm.sources ?? []).some((s) => /gesetze-im-internet|bgbl|eur-lex/.test(s?.url ?? ""));
    if (lawSource) add(/Stand[^\n]{0,60}\d{4}/.test(body) ? "PASS" : "FAIL", "Rechtsthema: Stand-Datum im Text", "„Stand … 2026“ nennen");
    if (lawSource) add(/keine Rechtsberatung|Rechtsberatung/i.test(body) ? "PASS" : "FAIL", "Rechtsthema: Hinweis „keine Rechtsberatung“", "");

    // --- Schlüsselwort
    if (keyword) {
      const tokens = keyword.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
      const titleLower = (fm.title ?? "").toLowerCase();
      const inTitle = tokens.filter((t) => titleLower.includes(t.slice(0, Math.max(4, t.length - 2)))).length / Math.max(1, tokens.length);
      add(inTitle >= 0.6 ? "PASS" : "WARN", `Haupt-Keyword „${keyword}“ im Titel`, `${Math.round(inTitle * 100)} % der Begriffe`);
      const intro = body.split(/\s+/).slice(0, 150).join(" ").toLowerCase();
      const inIntro = tokens.filter((t) => intro.includes(t.slice(0, Math.max(4, t.length - 2)))).length / Math.max(1, tokens.length);
      add(inIntro >= 0.6 ? "PASS" : "WARN", "Haupt-Keyword in den ersten 150 Wörtern", `${Math.round(inIntro * 100)} %`);
    } else {
      add("WARN", "Kein Kalendereintrag zum Slug", "Haupt-Keyword/Tier nicht geprüft – Slug mit seo/07-editorial-calendar.csv abgleichen");
    }

    // --- Links
    const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
    const external = [...body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
    const broken = links.filter((l) => !routeExists(l, { draftSlugs }).ok);
    add(broken.length === 0 ? "PASS" : "FAIL", "Interne Links existieren", broken.join(", "));
    const noSlash = links.filter((l) => !l.split("#")[0].endsWith("/") && !/\.[a-z0-9]+$/i.test(l));
    if (noSlash.length) add("FAIL", "Interne Links mit Schrägstrich", noSlash.join(", "));
    const toTool = links.some((l) => toolHrefs.has(l.split("#")[0]));
    add(toTool ? "PASS" : "FAIL", "Mindestens 1 Link auf einen Rechner", "");
    const hubLinks = clusterLinks[fm.cluster] ?? [];
    add(links.some((l) => hubLinks.includes(l.split("#")[0])) ? "PASS" : "WARN", "Link auf Cluster-Hub/kuratierte Seite", hubLinks.join(", "));
    const articleLinks = new Set(links.filter((l) => /^\/(ratgeber|fahrzeuge)\/[^/]+\/$/.test(l)));
    add(articleLinks.size >= 2 ? "PASS" : "FAIL", "Mindestens 2 Links auf Ratgeber/Fahrzeugseiten", `${articleLinks.size}`);
    const unknownHosts = [...new Set(external.map((u) => new URL(u).hostname.replace(/^www\./, "")))].filter((h) => !AUTHORITATIVE.test(h));
    add(unknownHosts.length === 0 ? "PASS" : "WARN", "Externe Links nur auf Primär-/Behörden-/Normquellen", unknownHosts.join(", "));

    // --- Dopplung
    const mine = ngrams(body);
    const compare = [...published, ...otherDrafts(file)];
    let worst = { name: "", share: 0 };
    for (const other of compare) {
      const theirs = ngrams(other.text);
      let shared = 0;
      for (const g of mine) if (theirs.has(g)) shared++;
      const share = mine.size ? shared / mine.size : 0;
      if (share > worst.share) worst = { name: other.name, share };
    }
    add(worst.share <= 0.15 ? "PASS" : worst.share <= 0.25 ? "WARN" : "FAIL", "Textdopplung (8-Wort-Folgen) ≤ 25 %", `max. ${Math.round(worst.share * 100)} % mit ${worst.name || "–"}`);
  }

  const fails = results.filter((r) => r.level === "FAIL").length;
  const warns = results.filter((r) => r.level === "WARN").length;
  totalFail += fails;
  console.log(`\n${path.relative(ROOT, file)}: ${fails === 0 ? "BESTANDEN" : "NICHT BESTANDEN"} (${fails} Fehler, ${warns} Warnungen)`);
  for (const r of results.filter((x) => x.level !== "PASS")) console.log(`  ${r.level}  ${r.label}${r.detail ? ` – ${r.detail}` : ""}`);
  if (args.includes("--verbose")) for (const r of results.filter((x) => x.level === "PASS")) console.log(`  PASS  ${r.label}${r.detail ? ` – ${r.detail}` : ""}`);
}
process.exit(totalFail ? 1 : 0);
