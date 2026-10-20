const base = new URL(process.env.SITE_CHECK_URL || "http://localhost:3000/");
const expectedOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://lademeter-rechner.de").replace(/\/$/, "");

// Incomplete legal routes that must stay noindex and must not appear in the sitemap
const incompleteRoutes = ["/impressum/", "/datenschutz/"];

// Completed legal/info routes that are expected to be indexable and in the sitemap
const completedLegalRoutes = ["/kontakt/", "/cookies/", "/nutzungsbedingungen/", "/haftungsausschluss/"];

const extraRoutes = [...incompleteRoutes, ...completedLegalRoutes];

const failures = [];
const request = async (path) => fetch(new URL(path, base), { redirect: "follow" });
const sitemapResponse = await request("/sitemap.xml");
if (!sitemapResponse.ok) failures.push(`sitemap.xml: HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const paths = [...new Set([...sitemapPaths, ...extraRoutes])];
const internalPaths = new Set(paths);
let jsonLdBlocks = 0;

for (const path of paths) {
  const response = await request(path);
  if (!response.ok) {
    failures.push(`${path}: HTTP ${response.status}`);
    continue;
  }
  const html = await response.text();
  if (!/<html[^>]+lang="de"/i.test(html)) failures.push(`${path}: html[lang=de] fehlt`);
  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${path}: title fehlt`);
  if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html)) failures.push(`${path}: Meta-Description fehlt`);
  if (!/<h1(?:\s|>)/i.test(html)) failures.push(`${path}: H1 fehlt`);

  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  const expectedCanonical = new URL(path, `${expectedOrigin}/`).toString();
  if (canonical !== expectedCanonical) failures.push(`${path}: Canonical ${canonical || "fehlt"} (erwartet ${expectedCanonical})`);

  if (!sitemapPaths.includes(path) && incompleteRoutes.includes(path)) {
    const robotsMeta = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] ?? "";
    if (!robotsMeta.toLowerCase().includes("noindex")) {
      failures.push(`${path}: nicht in der Sitemap, aber ohne noindex`);
    }
  }

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
      jsonLdBlocks += 1;
    } catch {
      failures.push(`${path}: ungültiges JSON-LD`);
    }
  }

  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    if (!match[1].startsWith("/_next/")) internalPaths.add(match[1]);
  }
}

for (const path of internalPaths) {
  const response = await request(path);
  if (!response.ok) failures.push(`interner Link ${path}: HTTP ${response.status}`);
}

const home = await request("/");
for (const header of [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-dns-prefetch-control",
  "x-frame-options",
  "x-permitted-cross-domain-policies",
  "referrer-policy",
  "permissions-policy",
]) {
  if (!home.headers.get(header)) failures.push(`Security-Header fehlt: ${header}`);
}
if (home.headers.has("x-powered-by")) failures.push("x-powered-by darf nicht gesendet werden");

const contactResponse = await fetch(new URL("/api/kontakt", base), {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({}),
});
if (![422, 503].includes(contactResponse.status)) {
  failures.push(`/api/kontakt: unerwarteter Status ${contactResponse.status}`);
}
if (!contactResponse.headers.get("cache-control")?.toLowerCase().includes("no-store")) {
  failures.push("/api/kontakt: Cache-Control no-store fehlt");
}

const robots = await (await request("/robots.txt")).text();
if (!robots.includes("Sitemap:") || !robots.includes("Disallow: /api/")) failures.push("robots.txt unvollständig");

for (const route of incompleteRoutes) {
  if (sitemapPaths.includes(route)) failures.push(`${route}: unvollständige/noindex-Seite steht in der Sitemap`);
}

for (const route of completedLegalRoutes) {
  if (!sitemapPaths.includes(route)) failures.push(`${route}: vollständige Seite fehlt in der Sitemap`);
}

console.log(`Geprüft: ${paths.length} HTML-Seiten, ${internalPaths.size} interne Ziele, ${jsonLdBlocks} JSON-LD-Blöcke.`);
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Produktions-Crawl ohne Befund.");
}
