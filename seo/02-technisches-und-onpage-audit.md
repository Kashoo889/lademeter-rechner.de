# 02 – Technisches SEO- und On-Page-Audit (Stand 20.10.2026)

Geprüft wurden (a) die **Live-Seite** per HTTP-Abruf (https://www.lademeter-rechner.de) und (b) der **lokale Produktions-Build** aller 32 Sitemap-URLs. Es wurde **kein** Lighthouse/Chrome-DevTools-Test ausgeführt (laut Vorgabe nicht genutzt); Core Web Vitals sind daher **nicht gemessen** → siehe Abschnitt 5.

## 1. Kritisch (P0) – bitte zuerst erledigen

### P0-1 · Widerspruch zwischen www- und Apex-Domain (Canonical-Konflikt) – **Entscheidung: Apex ist die Hauptdomain**
**Befund (live gemessen):**
- `https://lademeter-rechner.de/` → **308-Weiterleitung auf `https://www.lademeter-rechner.de/`** (Vercel-Domain-Einstellung).
- Auf der www-Seite zeigen aber `<link rel="canonical">`, `og:url`, die JSON-LD-`@id`s, **sitemap.xml** und der `Sitemap:`-Eintrag in **robots.txt** alle auf die **Apex-Domain** (`https://lademeter-rechner.de/…`).
- Folge: Die kanonische URL leitet auf die Seite weiter, die auf sie als kanonisch verweist. Google bekommt widersprüchliche Signale (Weiterleitung www → kanonisch Apex, aber Apex → www). Das kann Indexierung verzögern, Canonical-Wahl durch Google erzwingen und Sitemap-URLs als „weitergeleitet“ melden.

**Entscheidung des Betreibers (20.10.2026): `https://lademeter-rechner.de` (ohne www).** Der Code, die Sitemap, robots.txt und das Schema nutzen bereits die Apex-Domain; es fehlt nur die Domain-Einstellung in Vercel. **Status: offen** – das Konto der hier angemeldeten Vercel-CLI (`adab-heapbyte`) enthält nur die Domain `lademeter-rechner.vercel.app`; die Custom-Domain hängt an einem anderen Vercel-Konto/-Projekt, auf das von hier aus kein Zugriff besteht.

**Schritte (2 Minuten, im Vercel-Konto, das die Domain besitzt):** Projekt → *Settings → Domains* → bei `lademeter-rechner.de` „Edit“ → **als Production-Domain/Primary** belassen bzw. „Remove Redirect“ → bei `www.lademeter-rechner.de` „Edit“ → *Redirect to* `lademeter-rechner.de` (308). Danach prüfen: `SITE_CHECK_URL=https://lademeter-rechner.de/ npm run check:seo` meldet dann keinen Host-Fehler mehr.

**Weitere Optionen (nur zur Vollständigkeit):**
- **Option A (empfohlen, keine Code-Änderung):** In Vercel → *Settings → Domains* die **Apex-Domain `lademeter-rechner.de` als primäre Domain** setzen und `www` per 308 darauf weiterleiten. Der Code (`siteConfig.domain`, Sitemap, Schema) nutzt bereits die Apex-Domain.
- **Option B:** In Vercel Production die Umgebungsvariable `NEXT_PUBLIC_SITE_URL=https://www.lademeter-rechner.de` setzen und neu deployen. Dann zeigen Canonical, Sitemap, robots.txt und Schema auf www.
- **Nicht tun:** zusätzlich im Code eine Host-Weiterleitung einbauen – zusammen mit der Vercel-Domain-Weiterleitung entstünde eine **Endlosschleife**.
- Danach prüfen: `curl -sI https://<Wunschhost>/` = 200; Gegenhost = 308 auf Wunschhost; Canonical/Sitemap zeigen auf Wunschhost; in der Search Console (Domain-Property) die Sitemap einreichen.

### P0-2 · Rechtsseiten live `noindex` / unvollständig
- **Live gemessen (Abruf ca. 19:35):** `/impressum/`, `/datenschutz/`, `/kontakt/` liefern `noindex, follow`. Ursache laut Code: fehlende Betreiberangaben bzw. ausstehende Rechtsprüfung (`lib/legal/operator.ts`).
- SEO-/Vertrauensfolge: Impressum, Datenschutz und Kontakt sind zentrale Vertrauens- und (später) AdSense-Prüfseiten. Ein sichtbares Impressum und eine Datenschutzerklärung sind in Deutschland außerdem Pflicht (§ 5 DDG, DSGVO).
- Der Betreiber arbeitet laut Git-Historie bereits daran (Commit „update confirmed operator location…“). → Nach Fertigstellung `npm run check:launch` ausführen und prüfen, dass die Seiten `index` sind und in der Sitemap stehen.

### P0-3 · Messung fehlt (bewusst keine Analytics)
- Ohne Analytics bleibt die **Google Search Console** (Domain-Property, DNS-Verifizierung) das wichtigste Instrument. Zusätzlich **Bing Webmaster Tools**. Ohne diese beiden sind Indexierungsprobleme und echte Suchbegriffe unsichtbar. *(Ob die Einrichtung bereits erfolgt ist, ließ sich nicht prüfen.)*

## 2. Was bereits gut ist (geprüft)

| Prüfpunkt | Ergebnis |
|---|---|
| HTTPS, HSTS (`max-age=63072000; includeSubDomains`) | ja |
| HTTP → HTTPS-Weiterleitung | 308 auf https://www… |
| Trailing-Slash-Konsistenz | `/lkw-palettenrechner` → 308 auf `/lkw-palettenrechner/` |
| 404-Seite liefert Status 404 | ja |
| Genau eine H1 je Seite (alle 32 URLs lokal) | ja |
| `lang="de"`, Canonical je Seite, Titel + Description je Seite | ja (lokal alle 32) |
| robots.txt (`Allow: /`, `Disallow: /api/`), Sitemap | vorhanden (aber Host-Konflikt, siehe P0-1) |
| Preview-/Nicht-Produktions-Deployments `noindex` | ja (Code) |
| Strukturierte Daten | WebSite, Organization, BreadcrumbList, WebApplication (Rechner), Article (Ratgeber) – ohne erfundene Bewertungen |
| Schriftarten selbst gehostet, keine Drittanbieter-Skripte | ja |
| Sicherheitsheader (CSP-Basis, X-Frame-Options, Referrer-Policy, Permissions-Policy) | ja |
| TTFB (curl, ein Standort, gecachte Edge): | ca. 0,45 s (Startseite) bis ca. 1,0 s (Unterseiten) – Einzelmessung, keine Lab-Werte |
| Interne Verlinkung | ca. 40–54 interne Links je Seite, Rechner ↔ Ratgeber ↔ Fahrzeuge verlinkt |

## 3. Umgesetzte On-Page-Verbesserungen (im Arbeitsverzeichnis, **nicht deployt**)

| Änderung | Vorher | Nachher | Grund |
|---|---|---|---|
| **Titel-Regel** in `lib/seo/metadata.ts`: Marken-Suffix „\| Lademeter Rechner“ entfällt, wenn der Titel dadurch >60 Zeichen hätte | Titel bis 83 Zeichen | alle Seitentitel ≤ 60 Zeichen (lokal gemessen) | Google kürzt ab ca. 60 Zeichen |
| Startseite | „Lademeter Rechner – Lademeter berechnen, kostenlos & mit Formel“ (63) | „Lademeter Rechner – Lademeter berechnen, kostenlos“ | Länge, Fokus |
| LKW-Palettenrechner | …Palettenrechner mit Ladeplan (68) | „Wie viele Paletten passen in einen LKW? Rechner mit Ladeplan“ | Länge |
| Kartons-Rechner | …Rechner mit Lagenbild, Höhe & Gewicht (69) | „Kartons pro Palette berechnen – Rechner mit Lagenbild“ | Länge |
| Beladungsrechner | …Beladungsrechner für Fläche, Gewicht & Volumen (71) | „LKW Beladung berechnen: Rechner für Fläche und Nutzlast“ | Länge |
| Volumengewicht-Rechner | …Rechner für Luftfracht, Paket & Seefracht (68) | „Volumengewicht berechnen – Rechner für Paket, Luft & See“ | Länge |
| Methodik | „…Formeln, Annahmen und Grenzen der Rechner“ (64) | „Berechnungsgrundlagen: Formeln, Annahmen, Grenzen“ | Länge |
| Über uns | „Über uns“ (28) | „Über uns – Wer steht hinter Lademeter Rechner“ | aussagekräftiger Titel |
| Ratgeber „Was sind Lademeter“ | „Lademeter berechnen: Formel, Beispiele und Tabelle“ | „Was ist ein Lademeter? Definition, Formel und Beispiele“ | **Kannibalisierung beseitigt:** „Lademeter berechnen“ gehört der Startseite |
| Ratgeber „Lademeter in kg“ | „…Faktor und frachtpflichtiges Gewicht“ (63) | „Lademeter in kg umrechnen: Faktor und Abrechnung“ | Länge |
| Ratgeber „Palettenarten“ | „Palettenarten im Überblick: Maße, Lademeter und Stellplätze“ | „Palettenarten im Überblick: Euro-, Industrie-, Halbpalette“ | „Europalette Maße“ wird für einen geplanten Tiefenartikel (P01) frei gehalten |
| ESLint | `.vercel/`-Build-Ausgabe verursachte 2 Lint-Fehler | `.vercel/**` ignoriert | reiner Tooling-Fix |

Verifiziert: `npm test` (117 Tests), `tsc`, `eslint`, `next build` grün; alle Titel/Descriptions lokal neu gemessen.

## 4. Weitere Befunde und Empfehlungen (nicht umgesetzt)

| # | Befund | Empfehlung | Aufwand |
|---|---|---|---|
| 1 | **Meta-Descriptions** meist 140–160 Zeichen, vier leicht darüber/darunter (achslast 165, cookies 164, palettenarten 161, haftungsausschluss 106) | Auf 130–155 Zeichen trimmen; jede Description mit Nutzenversprechen + Keyword | gering |
| 2 | **Kannibalisierungsrisiko** Rechner-Seite „Kartons pro Palette“ und Ratgeber „Kartons pro Palette berechnen“ (nahezu gleiche Haupt-Keywords) | Ratgeber-Titel später auf „Kartons palettieren: Lagen, Verbund, Höhe und Gewicht“ ändern; in der Search Console auf Query-Überschneidung prüfen | gering |
| 3 | **Sitemap-lastmod** ist für alle statischen Seiten identisch (`siteConfig.lastUpdated`) | Nur bei echten Inhaltsänderungen aktualisieren; Artikel nutzen bereits echte Daten | gering |
| 4 | Ratgeber-Artikel nennen die **Redaktion** als Autor (Organization) | Mit Betreiber-Freigabe: echten Autor (Person) mit Kurzprofil und Quellenkompetenz ergänzen (E-Mail/Identität nicht erfinden). Das stärkt E-E-A-T. | gering |
| 5 | **Kategorien-/Themen-Hubs** fehlen (nur `/ratgeber/` nach Kategorien gruppiert) | Ab ≥ 8 Artikeln je Cluster eigene Hub-Seiten (`/ratgeber/thema/<cluster>/`) mit Einleitung, Linkliste, FAQ – siehe `04-…` | mittel |
| 6 | **FAQ-Schema** fehlt | Bewusst nicht ergänzt: Google zeigt FAQ-Rich-Results seit 2023 nur noch für wenige Seitentypen; Nutzen gering, Pflegeaufwand hoch. Optional später. | – |
| 7 | **Bilder/Grafiken:** kaum eigene Grafiken (Ladeplan nur im Rechner) | Pro Tiefenartikel eine eigene SVG-Grafik (Ladeplan, Maßzeichnung), mit `alt` und Bildunterschrift; Grafiken aus den Rechenkernen erzeugen | mittel |
| 8 | **Core Web Vitals / Mobile** nicht gemessen | PageSpeed Insights (Feld- und Labordaten) für Startseite + 2 Rechner + 1 Artikel durch den Betreiber; Ziel: LCP < 2,5 s, INP < 200 ms, CLS < 0,1 | gering |
| 9 | `ads.txt` live 404 | Korrekt, solange AdSense nicht aktiv ist (siehe Memory „AdSense später“) | – |
| 10 | **Open-Graph-Bild** ist ein generisches Markenbild für alle Seiten | Optional: dynamische OG-Bilder je Artikel (Titel + Rechner-Grafik) für bessere Klickraten in sozialen Netzen | mittel |
| 11 | **hreflang** nicht nötig (nur Deutsch), aber DACH-Abgrenzung (AT/CH) fehlt | Bei Bedarf Hinweise zu AT/CH-Regeln in Rechts-Artikeln (Maße/Maut) kennzeichnen | gering |

## 5. Messplan (ohne Analytics)

| Kennzahl | Quelle | Rhythmus |
|---|---|---|
| Indexierte Seiten, „Gefunden – zurzeit nicht indexiert“, Canonical-/Weiterleitungsfehler | Search Console → Seitenindexierung | wöchentlich |
| Impressionen, Klicks, CTR, Position je Query/Seite | Search Console → Leistung | wöchentlich |
| Core Web Vitals (Felddaten) | Search Console → Core Web Vitals (ab genug Traffic) | monatlich |
| Bing-Indexierung | Bing Webmaster Tools | monatlich |
| Serverseitige Fehler (404/5xx) | Vercel-Logs | monatlich |

*Optional (nur mit Freigabe und Anpassung der Datenschutzerklärung):* cookielose, EU-gehostete Statistik. Aktuell nicht geplant.

## 6. Live-Recheck vom 20.10.2026 (ca. 20:15–20:25)

| Prüfpunkt | Ergebnis |
|---|---|
| `https://lademeter-rechner.de/` | 200, kein Redirect (Apex liefert selbst aus; der frühere Redirect Apex → www ist **entfernt**) |
| `https://www.lademeter-rechner.de/` | **200, leitet NICHT auf Apex weiter** (mehrfach geprüft, mit Cache-Umgehung; `X-Vercel-Cache: HIT`) |
| DNS | Apex → `216.198.79.1`; `www` → CNAME `81dd7d6c7efeeaa7.vercel-dns-017.com` (unverändert, Vercel) |
| Canonical / sitemap.xml / robots.txt / JSON-LD-IDs | alle auf Apex (konsistent) |
| `http://` → `https://` | 308, ein Sprung |
| Ohne Trailing Slash → mit Slash | 308, ein Sprung |
| `npm run check:seo` gegen Apex | **ein Fehler:** www leitet nicht per 301/308 auf Apex weiter |
| Komprimierung / TTFB (Edge-Treffer) | Brotli; TTFB ca. 0,24 s, Einzelmessung |
| Rechtsseiten | `kontakt`, `cookies`, `nutzungsbedingungen`, `haftungsausschluss`: indexierbar und in der Sitemap. **`impressum` und `datenschutz`: weiterhin `noindex`** (und nicht in der Sitemap) |

**Verbleibendes Problem 1 – www → Apex (Diagnose, Stand 20.10.2026 ~20:40):**

*Befunde (nur lesend ermittelt):*
1. **DNS ist korrekt:** Apex `A 216.198.79.1`, `www` `CNAME 81dd7d6c7efeeaa7.vercel-dns-017.com` – beide zeigen auf Vercel.
2. **Apex und www liefern dieselbe Auslieferung:** identischer `ETag` (`5a1a58fe…`) und identischer Seiteninhalt. Beide Domains hängen also am **selben Vercel-Projekt**. Der Apex leitet nicht mehr auf www um (200), aber www leitet auch nicht auf den Apex um (200).
3. **Diese Auslieferung ist nicht die des Vercel-Kontos, das hier per CLI angemeldet ist.** `lademeter-rechner.vercel.app` hat einen anderen `ETag` (`8e714334…`), und das Projekt `adab-heapbytes-projects/lademeter-rechner` kennt laut API nur die Domain `lademeter-rechner.vercel.app` – **keine** Custom-Domain.
4. Der Redirect-Eintrag muss in dem Projekt gesetzt werden, an dem `lademeter-rechner.de` und `www.lademeter-rechner.de` hängen. Er ist dort entweder nicht gespeichert, zeigt in die falsche Richtung oder wurde in einem anderen Projekt/Konto angelegt (z. B. in dem CLI-Projekt, das die Domains gar nicht enthält). Ein Redirect in einem Projekt ohne die Domain bewirkt nichts.

*Genaue Schritte (im Vercel-Konto, das die Domains besitzt; keine Konten wechseln oder zusammenführen):*
1. vercel.com → Dashboard → das Projekt öffnen, bei dem `lademeter-rechner.de` unter *Settings → Domains* steht (ggf. in jedem Konto/Team nachsehen; die Projektnamen vergleichen).
2. Prüfen, dass **beide** Einträge im **selben** Projekt stehen: `lademeter-rechner.de` und `www.lademeter-rechner.de`, jeweils mit Status „Valid Configuration“. Steht `www` in einem anderen Projekt, dort entfernen und im Projekt des Apex hinzufügen.
3. Beim Eintrag **`www.lademeter-rechner.de`** → *Edit* → **„Redirect to Another Domain“** → Ziel `lademeter-rechner.de` → Status **308 Permanent Redirect** → *Save*.
4. Beim Eintrag **`lademeter-rechner.de`** keinen Redirect setzen; er soll direkt der Production-Umgebung zugeordnet bleiben („Connect to an environment: Production“).
5. Im selben Projekt unter *Settings → Environment Variables* prüfen, dass für Production `NEXT_PUBLIC_SITE_URL=https://lademeter-rechner.de` gesetzt ist (die Live-Seite zeigt bereits Apex-Canonicals).
6. ~1 Minute warten, dann prüfen:
   - `curl -sI https://www.lademeter-rechner.de/` → `HTTP/… 308` und `Location: https://lademeter-rechner.de/`
   - `curl -sI https://lademeter-rechner.de/` → `200`
   - `SITE_CHECK_URL=https://lademeter-rechner.de/ npm run check:seo` → kein Host-Fehler mehr.
7. **Nicht** zusätzlich im Code umleiten (Endlosschleife mit der Vercel-Domainregel). Optional später aufräumen: das zweite Projekt im CLI-Konto (`lademeter-rechner.vercel.app`) ist ein separates Deployment und ändert nichts an den Domains; ob es gelöscht oder weiter genutzt wird, entscheiden Sie.

**Verbleibendes Problem 2 – Impressum/Datenschutz noindex:** Beide Seiten sind live noch `noindex`. Für Vertrauen, Pflichtangaben und eine spätere AdSense-Prüfung sollten sie nach Fertigstellung der Betreiberangaben `index` sein (siehe `lib/legal/operator.ts`, `npm run check:launch`).

**Neuer Befund 3 – Open-Graph-Bild mit Redirect (niedrige Priorität):** Die `og:image`-URL lautet `https://lademeter-rechner.de/opengraph-image?<hash>` (ohne Slash); wegen `trailingSlash: true` folgt eine 308-Weiterleitung auf `/opengraph-image/?<hash>` (danach 200, `image/png`). Soziale Netzwerke folgen meist einer Weiterleitung, direkte URLs sind aber sicherer. Mögliche Lösung (erst in einer Preview testen): Bild-URL explizit mit Slash in `buildPageMetadata` setzen oder eine Ausnahme in den Redirects ergänzen. **Nicht umgesetzt**, weil ein Test mit echten Vorschau-Crawlern (z. B. Facebook-Debugger, LinkedIn Post Inspector) nötig ist.
