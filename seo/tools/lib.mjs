// Gemeinsame Hilfsfunktionen für die Redaktions-Werkzeuge (Entwurfsprüfung, Gerüst, Freigabe).
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export const ROOT = process.cwd();
export const DRAFTS_DIR = path.join(ROOT, "seo", "drafts");
export const CONTENT_DIR = path.join(ROOT, "content", "ratgeber");
export const CALENDAR_CSV = path.join(ROOT, "seo", "07-editorial-calendar.csv");

/** Einfacher CSV-Parser (Semikolon, Anführungszeichen, UTF-8 mit BOM). */
export function parseCsv(text, delimiter = ";") {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === delimiter) { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

export function loadCalendar() {
  return parseCsv(fs.readFileSync(CALENDAR_CSV, "utf8"));
}

/** Zerlegt eine Markdown-Datei mit YAML-Frontmatter. */
export function splitDraft(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { frontmatter: null, body: raw, error: "YAML-Frontmatter fehlt" };
  try {
    return { frontmatter: yaml.load(m[1], { json: true }), body: m[2] };
  } catch (error) {
    return { frontmatter: null, body: m[2], error: `YAML ungültig: ${error.message}` };
  }
}

export function listDrafts() {
  if (!fs.existsSync(DRAFTS_DIR)) return [];
  return fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md").map((f) => path.join(DRAFTS_DIR, f));
}

export function listPublished() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).map((f) => path.join(CONTENT_DIR, f));
}

/** Cluster-IDs und Rechner-Slugs direkt aus dem Quelltext lesen (ohne TypeScript-Aliasse zu importieren). */
export function readClusterIds() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "content", "clusters.ts"), "utf8").replace(/\r\n/g, "\n");
  const block = src.match(/CLUSTER_IDS = \[([\s\S]*?)\] as const/);
  return [...(block?.[1] ?? "").matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
}

export function readClusterLinks() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "content", "clusters.ts"), "utf8").replace(/\r\n/g, "\n");
  const result = {};
  for (const m of src.matchAll(/^  ([a-z]+): \{\n    id: "[a-z]+",\n    label: "[^"]*",\n    links: \[([\s\S]*?)\n    \],\n  \},/gm)) {
    result[m[1]] = [...m[2].matchAll(/href: "([^"]+)"/g)].map((x) => x[1]);
  }
  return result;
}

export function readCalculators() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "site-config.ts"), "utf8").replace(/\r\n/g, "\n");
  return [...src.matchAll(/slug: "([a-z0-9-]+)",\n\s+href: "([^"]+)"/g)].map((m) => ({ slug: m[1], href: m[2] }));
}

export function readVehicleSlugs() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "content", "fahrzeuge.ts"), "utf8").replace(/\r\n/g, "\n");
  return [...src.matchAll(/^    slug: "([a-z0-9-]+)",/gm)].map((m) => m[1]);
}

/** Prüft, ob eine interne URL existiert (Seite, Artikel, Fahrzeugseite, optional Entwurf). */
export function routeExists(url, { draftSlugs = new Set() } = {}) {
  const clean = url.split("#")[0].split("?")[0].replace(/\/$/, "");
  if (clean === "") return { ok: true };
  const segments = clean.split("/").filter(Boolean);
  if (fs.existsSync(path.join(ROOT, "app", ...segments, "page.tsx"))) return { ok: true };
  if (segments[0] === "ratgeber" && segments.length === 2) {
    if (fs.existsSync(path.join(CONTENT_DIR, `${segments[1]}.md`))) return { ok: true };
    if (draftSlugs.has(segments[1])) return { ok: true, draft: true };
  }
  if (segments[0] === "fahrzeuge" && segments.length === 2 && readVehicleSlugs().includes(segments[1])) return { ok: true };
  return { ok: false };
}

export function wordCount(text) {
  return text.replace(/[`*_>#|-]/g, " ").split(/\s+/).filter(Boolean).length;
}

export function ngrams(text, n = 8) {
  const words = text.toLowerCase().replace(/[^\p{L}\p{N}äöüß ]/gu, " ").split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + n <= words.length; i++) set.add(words.slice(i, i + n).join(" "));
  return set;
}

export const SOURCE_URLS = {
  STVO: "https://www.gesetze-im-internet.de/stvo_2013/",
  STVZO: "https://www.gesetze-im-internet.de/stvzo_2012/",
  HGB: "https://www.gesetze-im-internet.de/hgb/",
  BKatV: "https://www.gesetze-im-internet.de/bkatv_2013/",
  FeV: "https://www.gesetze-im-internet.de/fev_2010/",
  FZV: "https://www.gesetze-im-internet.de/fzv_2011/",
};

/** Leitet Cluster-Slug aus der Kalender-Spalte "Cluster" ab. */
export const CLUSTER_BY_CALENDAR = {
  Lademeter: "lademeter",
  Paletten: "paletten",
  Volumengewicht: "volumengewicht",
  Fahrzeuge: "fahrzeuge",
  Versand: "versand",
  Ladungssicherung: "ladungssicherung",
  Vorschriften: "vorschriften",
  Container: "container",
  Palettierung: "palettierung",
  "Schüttgewicht": "schuettgewicht",
};

export const CATEGORY_BY_CLUSTER = {
  lademeter: "Grundlagen",
  paletten: "Paletten",
  volumengewicht: "Frachtkosten",
  fahrzeuge: "Ladeplanung",
  versand: "Ladeplanung",
  ladungssicherung: "Recht & Sicherheit",
  vorschriften: "Recht & Sicherheit",
  container: "Ladeplanung",
  palettierung: "Verpackung",
  schuettgewicht: "Ladeplanung",
};

export const TOOL_BY_CLUSTER = {
  lademeter: "lademeter-rechner",
  paletten: "lkw-palettenrechner",
  volumengewicht: "volumengewicht-rechner",
  fahrzeuge: "lkw-palettenrechner",
  versand: "lkw-beladungsrechner",
  ladungssicherung: "lkw-beladungsrechner",
  vorschriften: "lkw-beladungsrechner",
  container: "lkw-palettenrechner",
  palettierung: "kartons-pro-palette-rechner",
  schuettgewicht: "lkw-beladungsrechner",
};
