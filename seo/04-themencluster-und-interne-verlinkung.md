# 04 – Themencluster und interne Verlinkung

## 1. Architektur: Hub → Säulen → Ergänzungen → Tools

Jedes der 10 Themencluster hat **einen Hub** (bereits vorhandene Seite oder künftige Themenseite), **Tiefenartikel (Tier A)** als Säulen, **Ergänzungsartikel (Tier B)** für Long-Tails und – wo vorhanden – **einen Rechner** als Conversion-Ziel. Alle Artikel stehen in `07-editorial-calendar.csv`.

| Cluster | Hub (vorhanden) | Rechner/Tool | Geplante Artikel (A/B) | Künftige Hub-Seite | Wettbewerb (Einschätzung) |
|---|---|---|---|---|---|
| Lademeter | `/` + `/ratgeber/was-sind-lademeter/` | Lademeter-Rechner | 23 (A 7 / B 16) | `/ratgeber/thema/lademeter/` | mittel |
| Paletten & Ladungsträger | `/ratgeber/europaletten-und-palettenarten/` | Palettenrechner | 22 (A 7 / B 15) | `/ratgeber/thema/paletten/` | hoch |
| Volumengewicht & Fracht | `/volumengewicht-rechner/` | Volumengewicht-Rechner | 22 (A 6 / B 16) | `/ratgeber/thema/volumengewicht/` | hoch (Carrier-Begriffe) |
| Fahrzeuge & Ladeflächen | `/fahrzeuge/` | Palettenrechner, Beladungsrechner | 22 (A 3 / B 19) | `/fahrzeuge/` (bleibt Hub) | mittel |
| Versand, Stückgut, Frachtkosten | `/ratgeber/stueckgut-teilladung-komplettladung/` | Beladungsrechner, Volumengewicht | 23 (A 9 / B 14) | `/ratgeber/thema/versand/` | hoch |
| Ladungssicherung & Recht | `/ratgeber/ladungssicherung-lkw-grundlagen/` | Beladungsrechner | 22 (A 9 / B 13) | `/ratgeber/thema/ladungssicherung/` | hoch |
| Gewichte, Maße, Vorschriften | `/ratgeber/achslast-und-gesamtgewicht-lkw/` | Beladungsrechner | 12 (A 4 / B 8) | `/ratgeber/thema/vorschriften/` | hoch/mittel |
| Container & See-/Luftfracht | `/fahrzeuge/container-40-fuss/` | Palettenrechner | 12 (A 4 / B 8) | `/ratgeber/thema/container/` | mittel |
| Kartons & Palettierung | `/kartons-pro-palette-rechner/` | Kartons-Rechner | 12 (A 2 / B 10) | `/ratgeber/thema/palettierung/` | mittel |
| Schüttgewicht & Dichte | `/lkw-beladungsrechner/` (+ geplanter m³↔t-Rechner) | *neu geplant* | 10 (A 5 / B 5) | `/ratgeber/thema/schuettgewicht/` | mittel |

Die Hub-Seiten (`/ratgeber/thema/...`) werden **erst angelegt, wenn ein Cluster ≥ 8 veröffentlichte Artikel hat** – vorher wären es dünne Listenseiten.

## 2. Keyword-Eigentümer (gegen Kannibalisierung)

Pro URL gibt es **ein** Haupt-Keyword. Neue Artikel dürfen dieses nicht als Haupt-Keyword nutzen.

| URL | Haupt-Keyword (Eigentümer) | Nebenbegriffe | Nicht bedienen (gehört anderer URL) |
|---|---|---|---|
| `/` | lademeter berechnen / lademeter rechner | ldm lkw berechnen, lademeter kalkulator | Definition → `/ratgeber/was-sind-lademeter/` |
| `/ratgeber/was-sind-lademeter/` | was ist ein lademeter | lademeter definition, lademeter formel | „berechnen“, „Rechner“ |
| `/lkw-palettenrechner/` | wie viele paletten passen in einen lkw | palettenrechner lkw | Maße je Fahrzeug → `/fahrzeuge/…` |
| `/kartons-pro-palette-rechner/` | kartons pro palette berechnen | wie viele kartons passen auf eine palette | Tabelle → Artikel M02 („…tabelle“) |
| `/lkw-beladungsrechner/` | lkw beladung berechnen | lkw beladung berechnen excel | Checkliste → Ratgeber „LKW-Beladung planen“ |
| `/volumengewicht-rechner/` | volumengewicht berechnen | volumengewicht rechner/formel | Carrier-Divisoren → Artikel V01/V02 |
| `/lademeter-excel-vorlage/` | lademeter berechnen excel | excel vorlage lademeter | künftiger Anleitungsartikel L01 erweitert **diese** URL, kein neuer Artikel |
| `/lademeter-aufgaben/` | lademeter aufgaben (lkw berechnen aufgaben) | lademeter übungsaufgaben | künftiger Beitrag L06 erweitert **diese** URL |
| `/lademeter-tabelle/` | lademeter tabelle | lademeter europalette, lademeter paletten | – |
| `/fahrzeuge/` + `/fahrzeuge/<typ>/` | `<fahrzeug> maße / ladefläche` | lademeter + Paletten je Fahrzeug | Aufbauten/Typen → Fahrzeug-Artikel F01–F22 |
| `/ratgeber/lademeter-in-kg-umrechnen/` | lademeter in kg umrechnen | lademeter gewicht, kg pro lademeter | Fläche vs. Gewicht → Artikel L03 |
| `/ratgeber/stapelfaktor-lademeter/` | stapelfaktor lademeter | stapelfaktor palette | Höhenprüfung → Artikel L21 |
| `/ratgeber/europaletten-und-palettenarten/` | palettenarten | europalette vs industriepalette | „Europalette Maße“ → Artikel P01 |
| `/ratgeber/ladungssicherung-lkw-grundlagen/` | ladungssicherung lkw | wer ist verantwortlich | § 22 StVO → Artikel R01 |
| `/ratgeber/kartons-pro-palette-berechnen/` | kartons palettieren (Rechenweg) | lagen, höhe, gewicht | beobachten: Überschneidung mit Rechner-Seite |

*Prüfregel vor jedem Artikel:* Haupt-Keyword in dieser Tabelle und in `07-editorial-calendar.csv` suchen. Treffer = anderes Keyword wählen oder bestehenden Artikel erweitern.

## 3. Verlinkungsregeln

**Pro Artikel (Mindestanforderung):**
1. **1 Link auf den passenden Rechner** (Kontext: „Rechnen Sie es nach …“), nicht nur am Seitenende.
2. **1 Link auf den Cluster-Hub** (Pillar bzw. Hub-Seite).
3. **2–4 Links auf Geschwister-Artikel** desselben Clusters (jeweils mit thematisch passendem Ankertext).
4. **1 Link auf eine Nachbar-Seite eines anderen Clusters**, wenn der Leser sie logisch braucht (z. B. Volumengewicht → Palettenversand).
5. Externe Links nur auf **Primärquellen** (Gesetze, Normstellen, Behörden, Hersteller); Quellen im Frontmatter `sources:` und im Text.

**Ankertexte:** beschreibend und variiert („Lademeter in Palettenstellplätze umrechnen“, nicht nur „hier“); pro Zielseite höchstens 40 % identische Anker.

**Rückverlinkung:** Jeder neue Artikel wird innerhalb von 7 Tagen von mindestens **2 bestehenden** Seiten verlinkt (Cluster-Hub und ein verwandter Artikel). Kein Artikel ohne eingehenden Link („Waisen“).

**Linkdichte:** höchstens ~100 interne Links je Seite (aktuell 40–54).

**Von der Startseite:** Neue Tiefenartikel (Tier A) bekommen einen Platz im Startseiten-Block „Passende Ratgeber-Artikel“ bzw. in einem künftigen Block „Beliebte Themen“ (rotierend, max. 6).

**Aktualisierungen:** Wird ein Artikel inhaltlich überarbeitet (nicht nur Datum), steht das neue Datum in `updatedAt`. Reine Datums-Updates ohne Änderung sind verboten.

## 4. Technische Umsetzung (Backlog)

| # | Maßnahme | Status |
|---|---|---|
| 1 | Skript `npm run check:seo` – prüft Titel-/Description-Länge, H1-Anzahl, Canonical, **Waisenseiten (keine eingehenden internen Links)** und Linkdichte gegen eine laufende Instanz | **umgesetzt** (`scripts/check-seo.mjs`) |
| 2 | Frontmatter-Feld `cluster:` ergänzen (Wert = Cluster-Slug) für automatische „Weiterlesen im Thema“-Box | offen (erst mit dem 5. Artikel je Cluster) |
| 3 | Komponente `ClusterNav` unter Artikeln: Hub-Link + 3 Geschwister | offen |
| 4 | Hub-Seiten `/ratgeber/thema/<cluster>/` (Einleitung, Artikelliste, FAQ, Verweis auf Rechner) | offen (ab ≥ 8 Artikeln/Cluster) |
| 5 | Breadcrumb `Start › Ratgeber › Thema › Artikel` + passendes BreadcrumbList-Schema | offen (zusammen mit 4) |
| 6 | Rechner-Seiten: Block „Vertiefung zu diesem Rechner“ mit 3–5 Artikeln des Clusters (statt fester Slug-Liste) | offen |
| 7 | HTML-Sitemap `/sitemap/` (Nutzer-Navigation, schwache SEO-Wirkung) | optional |

## 5. Beispiel: Linkgraph Cluster „Lademeter“

```
Rechner (/) ◄──────────────┐
  │                        │
  ├─ Definition (/ratgeber/was-sind-lademeter/)
  │     ├─ Glossar (L22)  ├─ Möbelwagenmeter/Spurmeter (L10)
  │     └─ Aufgaben mit Lösungen (L06) ──► Berufsschulen (Backlink-Ziel)
  ├─ Umrechnung kg (/ratgeber/lademeter-in-kg-umrechnen/)
  │     ├─ Lademeter oder Gewicht (L03) ── Abrechnung durch Speditionen (L07) ── Preisstaffeln (L23)
  │     └─ Nutzlast-Grenze (L15)
  ├─ Stapelfaktor (/ratgeber/stapelfaktor-lademeter/) ── Höhenprüfung (L21)
  ├─ Tabelle (/lademeter-tabelle/) ── Teilladungen 3/5/8/10 Paletten (L16) ── Stellplätze (L04, L14)
  └─ Excel-Vorlage (L01) ── Rechner-Vergleich (L17)
```
