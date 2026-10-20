# 02 – Technisches SEO- und On-Page-Audit (Stand 20.10.2026)

Geprüft wurden (a) die **Live-Seite** per HTTP-Abruf (https://www.lademeter-rechner.de) und (b) der **lokale Produktions-Build** aller 32 Sitemap-URLs. Es wurde **kein** Lighthouse/Chrome-DevTools-Test ausgeführt (laut Vorgabe nicht genutzt); Core Web Vitals sind daher **nicht gemessen** → siehe Abschnitt 5.

## 1. Kritisch (P0) – bitte zuerst erledigen

### P0-1 · Widerspruch zwischen www- und Apex-Domain (Canonical-Konflikt)
**Befund (live gemessen):**
- `https://lademeter-rechner.de/` → **308-Weiterleitung auf `https://www.lademeter-rechner.de/`** (Vercel-Domain-Einstellung).
- Auf der www-Seite zeigen aber `<link rel="canonical">`, `og:url`, die JSON-LD-`@id`s, **sitemap.xml** und der `Sitemap:`-Eintrag in **robots.txt** alle auf die **Apex-Domain** (`https://lademeter-rechner.de/…`).
- Folge: Die kanonische URL leitet auf die Seite weiter, die auf sie als kanonisch verweist. Google bekommt widersprüchliche Signale (Weiterleitung www → kanonisch Apex, aber Apex → www). Das kann Indexierung verzögern, Canonical-Wahl durch Google erzwingen und Sitemap-URLs als „weitergeleitet“ melden.

**Empfohlene Lösung (eine von beiden, nicht beide):**
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
