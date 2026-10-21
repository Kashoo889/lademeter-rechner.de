# 06 – 90-Tage-SEO-Roadmap (26.10.2026 – 23.01.2027)

> **Ehrlicher Rahmen:** Die Ziele unten sind **Planungsziele, keine Prognosen**. Rankings hängen von Wettbewerb, Domain-Alter und Qualität ab; für eine neue Domain sind in 90 Tagen erste Impressionen und Long-Tail-Rankings realistisch, Top-3-Platzierungen für Hauptbegriffe sind **nicht** zu versprechen. Grundlage: `01-…` bis `08-…`.

## 0. Entscheidungen, die nur der Betreiber treffen kann

| # | Entscheidung / Aufgabe | Frist |
|---|---|---|
| 1 | **Canonical-Host:** Entscheidung Apex gefallen; **www → Apex-Weiterleitung live noch nicht aktiv** (Stand 20.10.2026 ~20:20, siehe `02-…` §6) | Tag 1–2 |
| 2 | **Search Console** (Domain-Property) + **Bing Webmaster Tools** einrichten; Sitemap einreichen | Tag 1–3 |
| 3 | **Betreiberangaben/Rechtstexte** fertigstellen, Rechtsprüfung, Seiten auf `index` | Tag 1–14 |
| 4 | **Produktionskapazität** festlegen: 2 Artikel/Tag erfordern realistisch ≥ 2 Autoren/Redakteure (Tier A ≈ 4–6 h inkl. Quellenprüfung und Grafik). Bei einer Person ist **1 Artikel/Tag** (90 Artikel) die vertretbare Obergrenze. | Tag 1 |
| 5 | **Freigabeprozess** (wer gibt Artikel zur Veröffentlichung frei?) | Tag 1 |
| 6 | **Keyword-Planner-Zugang** (Google-Ads-Konto, kostenlos) für Suchvolumen-Bereiche; optional kostenpflichtiges Tool (Sistrix/Ahrefs/Semrush) | Woche 1 |
| 7 | Freigabe für **Outreach** (Texte aus `08-…`) bzw. rechtliche Klärung Kaltakquise (§ 7 UWG) | vor Woche 4 |

## 1. Phasen

### Phase 0 – Fundament (Tag 0–3)
- P0-Punkte oben abschließen (Host, Search Console, Bing, Rechtsseiten).
- Baseline festhalten: indexierte Seiten, Impressionen/Klicks (anfangs 0), Screenshots der SERP für 20 Kern-Keywords (google.de, Inkognito).
- `npm run check:seo` in den Release-Ablauf aufnehmen (vor jedem Deployment).
- On-Page-Änderungen aus `02-…` §3 **freigeben und deployen** (Titel-Regel, Retitles).

### Phase 1 – Kern aufbauen (Woche 1–4, Tag 1–30)
**Redaktion:** 60 Artikel (30 Tage × 2), Schwerpunkt Cluster **Lademeter**, **Volumengewicht**, **Paletten**, **Fahrzeuge**; zuerst Tier-A-Säulen (Kalender Woche 1–2).
**Produkt/Assets:**
- L01 Excel-Vorlage Lademeter: **gebaut und verifiziert** (20.10.2026), Landingpage-Entwurf liegt vor; Anleitungsartikel erst ab 26.10. L06 Aufgabenblatt PDF: **gebaut**, Landingpage-Entwurf liegt vor. V-Tabellen (Divisoren) mit Stand-Datum: offen (Primärquellen fehlen).
- Verbessern: Artikel-Titel/Descriptions bestehender Seiten nach Search-Console-Daten (ab Tag 14).
**Technik:** Frontmatter-Feld `cluster`, Komponente `ClusterNav` (nach 5. Artikel je Cluster).
**Backlinks:** Linkwürdige Assets fertigstellen (Aufgabenblatt, Excel, Divisor-Tabelle, Ladeplan-Studie); noch **kein** aktiver Outreach, bis ≥ 20 Artikel live sind und Rechtsseiten stehen.
**Gate Tag 30:** ≥ 85 % der veröffentlichten URLs indexiert; keine Canonical-/Weiterleitungsfehler; Qualitäts-Checkliste bei ≥ 95 % der Artikel bestanden.

### Phase 2 – Ausbauen (Woche 5–8, Tag 31–60)
**Redaktion:** weitere 60 Artikel: Cluster **Versand/Frachtkosten**, **Ladungssicherung**, **Palettierung**, **Container**, **Schüttgewicht** starten.
**Produkt:** **m³↔t-Rechner** (Schüttgut) entwickeln und mit D01–D10 verzahnen (nur Werte mit Quellen); **Divisor-Tabelle** der Paketdienste als „lebende Seite“ (Review-Zyklus 6 Monate).
**Technik:** Hub-Seiten `/ratgeber/thema/<cluster>/` für Cluster mit ≥ 8 Artikeln; Breadcrumbs mit Thema; „Vertiefung“-Block auf Rechner-Seiten.
**Backlinks:** Outreach-Welle 1 (siehe `08-…`): Berufsschulen, Fachportale (Fachbeitrag-Angebote), Ressourcenseiten; Broken-Link-Recherche.
**Gate Tag 60:** Search-Console-Review: Query-Überschneidungen (Kannibalisierung) prüfen und konsolidieren; Artikel mit 0 Impressionen nach 45 Tagen überarbeiten oder zusammenlegen.

### Phase 3 – Skalieren und verfeinern (Woche 9–13, Tag 61–90)
**Redaktion:** letzte 60 Artikel (Ladungssicherung/Recht, Vorschriften, Container, Versand-Reste). **Refresh-Runde:** die 20 Artikel mit den meisten Impressionen vertiefen (Tabellen, Grafiken, FAQ aus Search-Console-Queries).
**Produkt:** Embed/Widget (optional), dynamische OG-Bilder (optional).
**Backlinks:** Outreach-Welle 2 (Datenstudie „Wie viele Paletten passen wirklich?“, Vergleichstest L17), Expertenzitate.
**Gate Tag 90:** Ergebnisbericht (siehe §5) und Entscheidung: Tempo, Cluster-Gewichtung, AdSense-Antrag (erst bei vollständigen Rechtstexten, stabiler Indexierung und ausreichend eigenständigem Inhalt – Google nennt keine feste Mindestzahl).

## 2. Wochenrhythmus

| Tag | Aufgabe |
|---|---|
| Montag | Search-Console-Review (Indexierung, Queries, Fehler); Wochen-Backlog festlegen; Quellen-Recherche Batch |
| Di–Do | Schreiben, Faktencheck, Grafiken; 2. Person Gegenlesen (Rechts-/Sicherheitsthemen) |
| Freitag | Qualitäts-Stichprobe (10 % der Wochenartikel, vollständige Checkliste); `npm test` + `npm run check:seo`; Freigabe |
| Täglich | Veröffentlichung gemäß Kalender **nur** bei bestandenem Gate |

## 3. Drosselregeln („Notbremse“)

Zurück auf **1 Artikel/Tag** (oder weniger), falls einer der Fälle eintritt:
- > 30 % der in den letzten 14 Tagen veröffentlichten URLs stehen als „Gefunden – zurzeit nicht indexiert“ / „Gecrawlt – zurzeit nicht indexiert“.
- Manuelle Maßnahme oder auffälliger Sichtbarkeitseinbruch nach einem Update.
- > 2 Artikel pro Woche scheitern am Qualitäts-Gate (Kapazitätsproblem).
- Keine Impressionen für > 50 % der Artikel nach 45 Tagen (Hinweis auf Intent-/Qualitätsproblem → Überarbeiten statt Nachlegen).

## 4. Validierungs-Gate für Keywords (vor jedem Slot)

80 der 180 geplanten Haupt-Keywords kamen **nicht** als Google-Autosuggest vor (Spalte „In Google-Autosuggest gefunden“). Das ist bei Long-Tail normal, bedeutet aber: **Nachfrage unbestätigt.** Vor dem Schreiben prüfen: (1) Autosuggest, (2) Keyword Planner (Volumenbereich), (3) Search-Console-Queries ab Woche 3. Fällt die Prüfung negativ aus: Thema mit verwandtem Artikel zusammenlegen oder streichen – kein Slot wird „aus Prinzip“ gefüllt.

## 5. KPIs (Planungsziele, keine Prognosen)

| Kennzahl | Tag 30 | Tag 60 | Tag 90 | Quelle |
|---|---|---|---|---|
| Veröffentlichte Artikel (Plan bei 2/Tag; bei Drosselung entsprechend weniger) | 60 | 120 | 180 | CMS/Kalender |
| Anteil indexierter URLs | ≥ 85 % | ≥ 85 % | ≥ 85 % | Search Console |
| Canonical-/Weiterleitungsfehler | 0 | 0 | 0 | Search Console |
| Seiten mit ≥ 1 Impression | beobachten | ≥ 50 % | ≥ 70 % | Search Console |
| Rankings Top 20 für Kern-Keywords (`lademeter berechnen`, `volumengewicht berechnen`, `wie viele paletten passen in einen lkw`) | beobachten | beobachten | Ziel: Eintritt in Top 20 | manuell / GSC |
| Referring Domains (qualitativ, redaktionell/themenrelevant) | 0–2 | 3–6 | 8–15 | Search Console „Links“ / Bing WMT |
| Artikel, die das Qualitäts-Gate bestehen | ≥ 95 % | ≥ 95 % | ≥ 95 % | Freitags-Stichprobe |

*Die Backlink-Zahlen sind interne Arbeitsziele für nachweislich legitime Links; sie werden **nicht** durch Linkkauf oder Tauschringe erreicht.*

## 6. Produkt-/Technik-Backlog (priorisiert)

| Prio | Maßnahme | Nutzen |
|---|---|---|
| P0 | Canonical-Host vereinheitlichen | Indexierung/Signale |
| P0 | Rechtstexte vervollständigen, `index` | Vertrauen, später AdSense |
| P1 | Excel-Vorlage Lademeter (L01), Aufgabenblatt (L06), Checkliste PDF (R18) | Linkwürdigkeit, Nutzwert |
| P1 | Divisor-Tabelle Paketdienste („lebende Seite“) | Autorität in Volumengewicht-Cluster |
| P1 | Hub-Seiten + `ClusterNav` | interne Verlinkung |
| P2 | m³↔t-Rechner (Schüttgut) | großer Long-Tail-Cluster |
| P2 | Eigene SVG-Grafiken je Tier-A-Artikel (aus Rechenkernen) | Einzigartigkeit, Bildersuche |
| P2 | Dynamische OG-Bilder | Klickrate Social |
| P3 | Embed-Widget „Lademeter-Rechner für Ihre Website“ | natürliche Backlinks (Quellenangabe) |
| P3 | Named-Author-Profil (mit Freigabe) | E-E-A-T |

## 7. Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Qualität leidet unter Tempo (180 Artikel) | Gate, Drosselregel, zweite Person, Stichproben |
| Kannibalisierung | Eigentümer-Tabelle, Search-Console-Query-Prüfung ab Tag 30 |
| Veraltete Zahlen (Divisoren, Maut, Bußgelder, Fahrverbote) | Stand-Datum + Review-Zyklus 6/12 Monate, Kalenderaufgaben |
| Rechtliche Fehler (Haftung, Ladungssicherung) | Primärquellen, Hinweis, Gegenlesen, ggf. Fachjurist |
| Google-Algorithmus-Updates | Fokus auf Nutzen/E-E-A-T, keine Tricks, Beobachtung der Search Console |
| AdSense-Prüfung scheitert an dünnen/ähnlichen Seiten | Gate; AdSense erst bei vollständigen Rechtstexten und eigenständiger Substanz |
| Datenquelle Autosuggest verändert sich | Keyword-Liste ab Woche 3 mit Search-Console-Queries abgleichen |
