# Redaktions-Workflow: 2 Artikel pro Tag ab Montag, 26.10.2026

**Stand 21.10.2026.** Bis einschließlich Sonntag, 25.10.2026, wird **nichts** veröffentlicht. Die Werkzeuge erzwingen das (siehe §6). Grundlagen: `05-content-richtlinien.md` (Qualitätsstandard), `07-editorial-calendar.csv` (Themen), `04-…` (Verlinkung), `06-…` (Roadmap, Drosselregeln).

## 1. Kapazität – bitte zuerst festlegen
Ein Artikel kostet realistisch 4–7 Stunden (Recherche mit Primärquellen 1–1,5 h, Schreiben 2–4 h, Faktencheck/Gegenlesen 0,5–1 h, Gate und Freigabe 0,25 h, Einbindung 0,25 h). **Zwei Artikel pro Tag erfordern daher mindestens zwei Personen**; mit einer Person ist **1 Artikel pro Tag** die vertretbare Obergrenze. Fällt die Kapazität, verschiebt sich der Slot – es wird nie mit dünnen Texten aufgefüllt.

## 2. Rollen
| Rolle | Aufgabe |
|---|---|
| Recherche/Briefing | Briefing prüfen, Primärquellen beschaffen, Faktencheck-Tabelle füllen |
| Autor/in | Entwurf schreiben, Beispiele im Rechner nachrechnen |
| Gegenleser/in | Fakten gegen Quellen, Sprache, Verständlichkeit; bei Rechts-/Sicherheitsthemen zwingend eine zweite Person |
| Freigabe (Betreiber) | Freigabe zur Veröffentlichung und – getrennt davon – zum Deployment |

## 3. Pipeline (gestaffelt, damit jeden Tag zwei Artikel fertig werden)
| Zeitpunkt | Schritt | Werkzeug |
|---|---|---|
| **T−2** | Briefing für Tag T lesen, Validierungs-Gate entscheiden (Nachfrage? Überschneidung?), Quellen beschaffen | `seo/briefs/<Datum>-<ID>.md` |
| **T−1** | Gerüst anlegen, schreiben, Beispiele nachrechnen, Gate laufen lassen | `npm run seo:new -- --id <ID>`, `npm run seo:check -- <datei>` |
| **T−1 abends** | Gegenlesen, Korrekturen, erneut Gate | – |
| **T** | Freigabe, Einbindung (nur ab Veröffentlichungsdatum), Tests | `npm run seo:promote -- <datei> --approved-by "Name"`, `npm test`, `npm run check:seo` |
| **T** | Deployment **nur nach Freigabe** durch den Betreiber; danach Kalenderstatus setzen | – |

Briefings erzeugen: `npm run seo:brief -- --from 2026-10-26 --days 14` (liegt für die ersten 14 Tage bereits vor, siehe `seo/briefs/`).

## 4. Das Qualitäts-Gate (`npm run seo:check`)
Prüft automatisch: Frontmatter vollständig (inkl. `cluster`, `relatedTool`), Slug = Dateiname, Titel ≤ 60, Description 130–160, FAQ 3–6, Quellen mit https-URL, Umfang nach Tier, keine H1 im Text, ≥ 3 H2, Tabelle oder Rechenbeispiel, keine Floskeln/Platzhalter (TODO), deutsches Zahlenformat, Stand-Datum und Hinweis „keine Rechtsberatung“ bei Gesetzesquellen, Haupt-Keyword in Titel und Einstieg, interne Links existieren und enden mit „/“, mindestens 1 Rechner-Link, 1 Cluster-Link, 2 Ratgeber/Fahrzeug-Links, externe Links nur auf Primär-/Behördenquellen, Textdopplung ≤ 25 % gegenüber veröffentlichten Artikeln und anderen Entwürfen.
**Das Gate ersetzt nicht das Gegenlesen:** Es erkennt Form- und Regelverstöße, keine inhaltlichen Fehler. Jede Zahl braucht weiterhin eine Quelle (Faktencheck-Tabelle im Briefing).

## 5. Nach der Veröffentlichung
1. `seo/07-editorial-calendar.csv`: Status auf „veröffentlicht (Datum)“ setzen.
2. Verlinkung: Der Artikel erscheint automatisch in „Mehr zum Thema …“ seines Clusters (`lib/content/clusters.ts`). Zusätzlich 1–2 **inhaltlich passende** bestehende Seiten um einen Kontext-Link ergänzen (nur sinnvolle Stellen).
3. Search Console: für Tier-A-Artikel „URL prüfen → Indexierung beantragen“ (nicht für alle Artikel).
4. Nach 14 Tagen: indexiert? Nach 45 Tagen: Impressionen? Überschneidung mit anderen URLs (Query-Bericht)? Auffällige Artikel überarbeiten statt neue nachlegen.
5. Monatlich: `python seo/tools/autosuggest.py …` (siehe `tools/README.md`) und mit Search-Console-Queries abgleichen; Kalender anpassen.

## 6. Sicherungen gegen Fehlveröffentlichung
- `promote_draft` verweigert ohne `--approved-by`, vor dem `publishedAt`-Datum, bei nicht bestandenem Gate und beim Überschreiben bestehender Artikel. Es committet und deployt nichts.
- Ein Test (`lib/content/clusters.test.ts`) lässt Artikel ohne gültigen Cluster nicht durch; `npm test` prüft zusätzlich Slug, Metalängen, FAQ und interne Links.
- Entwürfe liegen in `seo/drafts/` und werden nie ausgeliefert.

## 7. Drosselregeln (aus `06-…`)
Zurück auf 1 Artikel/Tag, wenn > 30 % der Artikel der letzten 14 Tage nicht indexiert sind, mehr als 2 Artikel pro Woche das Gate nicht bestehen, eine manuelle Maßnahme vorliegt oder > 50 % der Artikel nach 45 Tagen keine Impressionen haben.

## 8. Konkret für den Start (Montag, 26.10.2026)
- **Slot 1 – G01 „LKW-Höchstmaße“:** Entwurf besteht das Gate. Vor Freigabe offen: § 32 Abs. 1 Satz 2 StVZO gegenlesen, Maßzeichnung (SVG mit alt-Text) ergänzen, zweite Person liest gegen (siehe `drafts/README.md`).
- **Slot 2 – R01 „§ 22 StVO Ladung“** (jetzt Tier B): Entwurf besteht das Gate. Vor Freigabe offen: Bezugshöhe „2,50 m“ in Absatz 3 prüfen, zweite Person liest gegen.
- Beide Entwürfe verlinken aufeinander: **gemeinsam** freigeben.
- Briefings für 27.10.–08.11. liegen bereit; V02/V11/V14/V15 (Carrier-Divisoren) erst schreiben, wenn offizielle Quellen vorliegen.
