# SEO-Paket lademeter-rechner.de (Stand 20.10.2026)

Alle Unterlagen sind **Entwürfe/Planung**. Es wurde **nichts veröffentlicht, deployed oder versendet**.

## Dateien

| Datei | Inhalt |
|---|---|
| `01-serp-und-wettbewerber-analyse.md` | beobachtete SERP-Landschaft, Wettbewerber-Profile, Lücken, Grenzen der Analyse |
| `02-technisches-und-onpage-audit.md` | Live-/Build-Audit, **P0-Befunde**, umgesetzte Änderungen, Messplan |
| `03-keyword-research.pdf` | **Keyword-PDF:** 231 Keywords in 12 Clustern (Autosuggest-Signale, Intention, Zielseite/Artikel, Status) |
| `03-keywords-top.csv` | dieselben 231 Keywords als Tabelle |
| `03-keywords-all-autosuggest.csv` | 1.480 relevante Autosuggest-Varianten (Roh-Pool) |
| `04-themencluster-und-interne-verlinkung.md` | Cluster-Architektur, Keyword-Eigentümer-Tabelle, Verlinkungsregeln, Backlog |
| `05-content-richtlinien.md` | Qualitätsstandards, Pflichtstruktur, Faktencheck, **Veröffentlichungs-Gate** |
| `06-90-tage-roadmap.md` | Phasen, Entscheidungen des Betreibers, Drosselregeln, KPIs, Risiken |
| `07-editorial-calendar.csv` / `.md` | **180 Artikel (2/Tag, 26.10.2026–23.01.2027)** mit Keyword, Quellen, Mehrwert, Link-Zielen |
| `08-backlink-plan.md` / `08-backlink-prospects.csv` / `08-outreach-welle-1.md` | ethischer Linkaufbau, Assets, Entwurfstexte, Kandidaten, Outreach-Paket (nicht versendet) |
| `drafts/` | 2 Artikel-Entwürfe (G01 LKW-Höchstmaße, R01 § 22 StVO) mit Review-Liste; `drafts/landing/` Landingpage-Gerüste für Excel-Vorlage und Aufgabenblatt |
| `assets/` | **fertige Download-Assets:** Excel-Vorlage Lademeter (.xlsx), Aufgabenblatt mit Lösungen und Schülerfassung (PDF). Landingpages sind umgesetzt, aber **versteckt** (`DOWNLOADS_LIVE=false` in `lib/downloads.ts`); Details `assets/README.md` |
| `tools/` | Skript zur monatlichen Autosuggest-Erhebung |

## Was echt ist – und was nicht (Transparenz)

| Thema | Status |
|---|---|
| Keyword-Daten | **echte** Google-Autosuggest-Vorschläge (hl=de, gl=de, 20.10.2026); **keine Suchvolumina** (kein Keyword Planner/GSC/Sistrix angebunden) |
| „Wettbewerb“ in der Keyword-Liste | qualitative Einschätzung aus Stichproben, **nicht gemessen** |
| SERP-Beobachtungen | die Such-API lieferte laut Tool-Beschreibung vermutlich US-basierte Ergebnisse → Positionen auf google.de bitte manuell prüfen |
| Wettbewerber-Backlinks | **nicht analysiert** (keine Backlink-Tools) |
| Outreach/Backlinks | **keine** Anfragen versendet, **keine** Links erzeugt; Kaltakquise nur nach rechtlicher Klärung (§ 7 UWG) |
| Core Web Vitals | **nicht gemessen** (kein Lighthouse/DevTools laut Vorgabe) |
| 80 von 180 Kalender-Keywords | nicht in Autosuggest gefunden → Nachfrage unbestätigt (Validierungs-Gate in `06-…` §4) |

## Wichtigste Befunde

1. **Canonical-Konflikt www vs. Apex (P0):** Apex leitet auf www weiter, aber Canonical/Sitemap/robots/Schema zeigen auf Apex. → `02-…` P0-1 (Vercel-Primärdomain auf Apex stellen *oder* `NEXT_PUBLIC_SITE_URL` auf www).
2. **Rechtsseiten live noindex/unvollständig (P0)** – bearbeiten laut Git bereits der Betreiber.
3. **Kannibalisierung vermieden:** Startseite besitzt „Lademeter berechnen/Rechner“; Ratgeber „Was ist ein Lademeter?“ neu betitelt.
4. **Titel zu lang:** Marken-Suffix entfällt jetzt automatisch bei >60 Zeichen; alle Titel ≤ 60.
5. **Interne Verlinkung:** 3 Fahrzeugseiten hatten nur 1 eingehenden internen Link → Querverlinkung ergänzt; neues Prüfskript `npm run check:seo`.
6. **Marktlücke:** Wettbewerber-Stichprobe zeigt widersprüchliche Zahlen und Datumsfehler; keine deutschsprachige Spezialseite mit Methodik + Ladeplan + Mehrfachpositionen.
7. **Unterschätzter Cluster:** Schüttgewicht/Umrechnung m³ ↔ t (viele Autosuggest-Muster) – passt zum Beladungsrechner.

## Umgesetzte Änderungen am Projekt (nicht deployt)

- `lib/seo/metadata.ts`: Titel-Regel (kein Suffix >60 Zeichen).
- Kürzere Titel für Startseite, 4 Rechner, Methodik, Über uns; neue Titel für 3 Ratgeber (Details `02-…` §3).
- `app/fahrzeuge/[slug]/page.tsx`: Block „Weitere Fahrzeuge und Maße“ (Querverlinkung).
- `scripts/check-seo.mjs` + `npm run check:seo`.
- `eslint.config.mjs`: `.vercel/**` ignoriert.
- `app/haftungsausschluss/page.tsx`: längere Meta-Description.

## Stand nach den Entscheidungen vom 20.10.2026

| Entscheidung | Umsetzung |
|---|---|
| Hauptdomain Apex (ohne www) | Code/Sitemap/Schema bereits Apex. **Vercel-Weiterleitung www → Apex noch zu setzen** (Domain gehört zu einem anderen Vercel-Konto als dem hier angemeldeten). Schritte in `02-…` P0-1; Prüfung per `npm run check:seo` gegen die Live-URL. |
| 2 Artikel/Tag, nur verifizierte Themen | Kalender gilt; 2 Entwürfe für Tag 1 fertig (G01 Höchstmaße, R01 § 22 StVO). **V01 (DHL-Volumengewicht) zurückgestellt** (keine Primärquelle), weitere Carrier-Artikel mit Vorab-Prüfung markiert; 10 Überschneidungsrisiken im Kalender vermerkt (Spalte „Pruefhinweis“). |
| Fakten verifizieren (§ 32 StVZO) | § 32 StVZO, § 22/23 StVO, § 31 StVZO, § 412 HGB gegen gesetze-im-internet.de abgeglichen; Review-Liste in `drafts/README.md`. |
| On-Site-SEO | Titel-Regel, kürzere Titel, 3 Descriptions, Retitle Kartons-Ratgeber, Fahrzeug-Querlinks, `check:seo` inkl. Host-/Redirect-Prüfung. |
| Backlink-Recherche | 3 weitere reale Kandidaten; Outreach-Paket Welle 1 in `08-outreach-welle-1.md` – **nichts versendet**. |

## Nächste Schritte (Reihenfolge)

1. P0-1 (Host), Search Console + Bing einrichten, Rechtsseiten fertigstellen.
2. Änderungen freigeben/deployen, danach `npm run check:seo` gegen die Live-URL (`SITE_CHECK_URL=https://… npm run check:seo`).
3. Produktionskapazität klären (2 Artikel/Tag vs. 1/Tag), Freigabeprozess festlegen.
4. Keyword Planner für die 30 wichtigsten Keywords, Spalte „Suchvolumen“ ergänzen.
5. Entwurf G01 prüfen/ergänzen; die ersten Tier-A-Artikel (Kalender Woche 1) nach Quellenprüfung schreiben.
6. Assets für Backlinks bauen (Aufgabenblatt, Excel-Vorlage, Divisor-Tabelle).
