// Crawl-Audit gegen eine laufende Instanz (lokal oder live).
//   SITE_CHECK_URL=http://localhost:3100/ node seo/tools/crawl_audit.mjs [ausgabe.md]
// Prüft alle URLs aus der Sitemap plus alle intern verlinkten URLs:
//  - Status und Weiterleitungsketten interner Links (z. B. fehlender Schrägstrich)
//  - Überschriften-Gliederung (H1-Anzahl, übersprungene Ebenen), doppelte Titel/Descriptions
//  - Bilder ohne alt, externe Links ohne rel="noopener", Anker (#id) ohne Ziel
//  - Klicktiefe ab Startseite und eingehende interne Links je Seite (mit Ankertexten)
import fs from "node:fs";

const base = new URL(process.env.SITE_CHECK_URL || "http://localhost:3000/");
const outFile = process.argv[2];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ");
const strip = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

async function get(url, manual = false) {
  return fetch(url, { redirect: manual ? "manual" : "follow" });
}

const sitemap = await (await get(new URL("/sitemap.xml", base))).text();
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const pages = new Map(); // path -> data
const linkEdges = []; // {from,to,anchor}
const issues = { redirects: [], broken: [], headings: [], images: [], external: [], anchors: [] };
const queue = [...new Set(["/", ...sitemapPaths])];
const seen = new Set(queue);
const depth = new Map([["/", 0]]);

while (queue.length) {
  const path = queue.shift();
  const res = await get(new URL(path, base));
  if (!res.ok) {
    issues.broken.push(`${path}: HTTP ${res.status}`);
    continue;
  }
  const html = await res.text();
  const get1 = (re) => (html.match(re) || [])[1] || "";
  const title = decode(get1(/<title>([^<]*)<\/title>/));
  const description = decode(get1(/<meta name="description" content="([^"]*)"/));
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ level: +m[1], text: strip(m[2]) }));
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  pages.set(path, { title, description, noindex, headings, links: [] });

  // Überschriften
  const h1 = headings.filter((h) => h.level === 1).length;
  if (h1 !== 1) issues.headings.push(`${path}: ${h1} H1`);
  let prev = 0;
  for (const h of headings) {
    if (prev && h.level > prev + 1) issues.headings.push(`${path}: Ebene springt von H${prev} auf H${h.level} („${h.text.slice(0, 40)}“)`);
    if (!h.text) issues.headings.push(`${path}: leere H${h.level}`);
    prev = h.level;
  }
  // Bilder
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) issues.images.push(`${path}: <img> ohne alt`);

  // Links
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = m[1];
    const href = (attrs.match(/href="([^"]*)"/) || [])[1];
    if (!href) continue;
    const anchor = strip(m[2]) || (attrs.match(/aria-label="([^"]*)"/) || [])[1] || "";
    if (href.startsWith("#")) {
      if (href.length > 1 && !ids.has(href.slice(1))) issues.anchors.push(`${path}: Anker ${href} ohne Ziel`);
      continue;
    }
    if (/^(mailto:|tel:)/.test(href)) continue;
    if (/^https?:\/\//.test(href) && new URL(href).host !== base.host) {
      if (/target="_blank"/.test(attrs) && !/noopener/.test(attrs)) issues.external.push(`${path}: externer Link ohne noopener: ${href}`);
      continue;
    }
    const url = new URL(href, new URL(path, base));
    if (url.host !== base.host) continue;
    const target = url.pathname;
    linkEdges.push({ from: path, to: target, anchor, href });
    if (!seen.has(target) && !target.startsWith("/_next") && !/\.[a-z0-9]{2,5}$/i.test(target)) {
      seen.add(target);
      depth.set(target, (depth.get(path) ?? 0) + 1);
      queue.push(target);
    }
  }
}

// Weiterleitungen interner Links (nur eindeutige Ziele prüfen)
const uniqueHrefs = [...new Set(linkEdges.map((e) => e.href))];
for (const href of uniqueHrefs) {
  const url = new URL(href, base);
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) || url.pathname.startsWith("/_next")) continue;
  const res = await get(url, true);
  if ([301, 302, 307, 308].includes(res.status)) issues.redirects.push(`${href} → ${res.headers.get("location")} (${res.status}); verlinkt von ${linkEdges.filter((e) => e.href === href).map((e) => e.from).slice(0, 3).join(", ")}`);
  else if (res.status >= 400) issues.broken.push(`${href}: HTTP ${res.status}`);
}

// Klicktiefe per Breitensuche ab Startseite (über die gesammelten Links)
const bfs = new Map([["/", 0]]);
const order = ["/"];
while (order.length) {
  const cur = order.shift();
  for (const e of linkEdges) if (e.from === cur && !bfs.has(e.to) && pages.has(e.to)) { bfs.set(e.to, bfs.get(cur) + 1); order.push(e.to); }
}
depth.clear();
for (const [k, v] of bfs) depth.set(k, v);

// Titel/Descriptions doppelt
const dup = (key) => {
  const map = new Map();
  for (const [p, d] of pages) if (d[key]) map.set(d[key], [...(map.get(d[key]) || []), p]);
  return [...map].filter(([, ps]) => ps.length > 1).map(([v, ps]) => `${key} doppelt: „${v.slice(0, 60)}“ → ${ps.join(", ")}`);
};
const duplicates = [...dup("title"), ...dup("description")];

// Eingehende Links
const inbound = new Map([...pages.keys()].map((p) => [p, new Map()]));
for (const e of linkEdges) {
  if (!inbound.has(e.to) || e.to === e.from) continue;
  const m = inbound.get(e.to);
  const a = e.anchor || "(ohne Text)";
  m.set(e.from, [...(m.get(e.from) || []), a]);
}
const rows = [...pages.keys()]
  .filter((p) => !pages.get(p).noindex)
  .map((p) => ({ p, from: inbound.get(p).size, depth: depth.get(p) ?? "–", anchors: [...new Set([...inbound.get(p).values()].flat())].slice(0, 4).join(" | ") }))
  .sort((a, b) => a.from - b.from);

const lines = [];
lines.push(`# Crawl-Audit (${base.origin}, ${new Date().toISOString().slice(0, 10)})`, "");
lines.push(`${pages.size} Seiten gecrawlt (Sitemap: ${sitemapPaths.length}), ${linkEdges.length} interne Links.`, "");
const section = (title, list) => lines.push(`## ${title}: ${list.length}`, "", ...(list.length ? list.map((x) => `- ${x}`) : ["- keine"]), "");
section("Defekte interne Links", issues.broken);
section("Interne Links mit Weiterleitung", issues.redirects);
section("Überschriften-Probleme", issues.headings);
section("Doppelte Titel/Descriptions", duplicates);
section("Bilder ohne alt", issues.images);
section("Externe Links ohne noopener", issues.external);
section("Anker ohne Ziel", issues.anchors);
lines.push("## Eingehende interne Links (indexierbare Seiten, aufsteigend)", "", "| Seite | Linkende Seiten | Klicktiefe | Beispiel-Ankertexte |", "|---|---|---|---|");
for (const r of rows) lines.push(`| ${r.p} | ${r.from} | ${r.depth} | ${r.anchors.replace(/\|/g, "/")} |`);
const report = lines.join("\n");
if (outFile) fs.writeFileSync(outFile, report, "utf8");
console.log(report);
