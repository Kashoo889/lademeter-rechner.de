/**
 * On-page SEO check against a running instance (default http://localhost:3000, see SITE_CHECK_URL).
 *   npm run build && npm run start   (in one terminal)
 *   npm run check:seo                (in another)
 *
 * Checks every URL from /sitemap.xml: title and description length, exactly one H1, canonical present,
 * word count, number of internal links and ORPHAN pages (no internal link from any other sitemap page).
 * Exits with code 1 on errors; warnings do not fail the run.
 */
const base = new URL(process.env.SITE_CHECK_URL || "http://localhost:3000/");
const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 165;
const MAX_INTERNAL_LINKS = 100;

const get = async (path) => (await fetch(new URL(path, base), { redirect: "follow" })).text();
const sitemap = await get("/sitemap.xml");
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const errors = [];
const warnings = [];
const inbound = new Map(paths.map((p) => [p, new Set()]));
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

for (const path of paths) {
  const html = await get(path);
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  const links = [...html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (const href of links) if (inbound.has(href) && href !== path) inbound.get(href).add(path);

  if (!title) errors.push(`${path}: <title> fehlt`);
  else if (title.length > TITLE_MAX) errors.push(`${path}: Titel ${title.length} Zeichen (max. ${TITLE_MAX})`);
  if (!desc) errors.push(`${path}: Meta-Description fehlt`);
  else if (desc.length < DESC_MIN || desc.length > DESC_MAX) warnings.push(`${path}: Description ${desc.length} Zeichen (Soll ${DESC_MIN}–${DESC_MAX})`);
  if (h1Count !== 1) errors.push(`${path}: ${h1Count} H1 (Soll 1)`);
  if (!canonical) errors.push(`${path}: Canonical fehlt`);
  else if (!new URL(canonical).pathname.endsWith(path)) errors.push(`${path}: Canonical zeigt auf ${canonical}`);
  if (noindex) errors.push(`${path}: steht in der Sitemap, ist aber noindex`);
  if (links.length > MAX_INTERNAL_LINKS) warnings.push(`${path}: ${links.length} interne Links (> ${MAX_INTERNAL_LINKS})`);
  if (words < 250 && !["/kontakt/", "/cookies/", "/ueber-uns/"].includes(path)) warnings.push(`${path}: nur ${words} Wörter (dünn?)`);
}

for (const [path, from] of inbound) {
  if (path !== "/" && from.size < 2) warnings.push(`${path}: nur ${from.size} eingehende interne Links aus Sitemap-Seiten (Soll ≥ 2)`);
}

console.log(`${paths.length} URLs geprüft.`);
for (const w of warnings) console.log("WARN ", w);
for (const e of errors) console.log("FEHLER", e);
if (errors.length) process.exit(1);
console.log(warnings.length ? "Fertig mit Warnungen." : "Alles in Ordnung.");
