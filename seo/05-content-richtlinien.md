# 05 – Content-Richtlinien (Ratgeber, Referenzseiten, Vorlagen)

Ziel: **hilfreiche, genaue, eigenständige** deutsche Inhalte, die Suchintention erfüllen. Dieses Dokument ist verbindlich für jeden geplanten Artikel aus `07-editorial-calendar.csv`. Es gilt auch für KI-gestützte Entwürfe: **Jeder Entwurf wird von einem Menschen fachlich geprüft, bevor er veröffentlicht wird.**

## 1. Leitprinzipien

1. **Nutzen vor Menge.** Kein Artikel nur wegen eines Keywords. Wer die Frage beantwortet bekommt, soll nicht erneut suchen müssen.
2. **Eine Seite = eine Hauptsuchintention = ein Haupt-Keyword** (Eigentümer-Tabelle in `04-…`).
3. **Genauigkeit vor Geschwindigkeit.** Zahlen, Gesetze, Tarife und Bußgelder nur mit **Primärquelle** und **Stand-Datum**. Fehlt die Quelle: als „Richtwert“/„nicht verbindlich“ kennzeichnen oder weglassen.
4. **Erfahrung sichtbar machen.** Eigene Rechenbeispiele aus den Rechenkernen (`lib/calculators`), eigene Ladeplan-Grafiken, eigene Tabellen – kein bloßes Umschreiben fremder Seiten.
5. **Ehrlichkeit.** Keine erfundenen Preise, Studien, Zitate, Kundenstimmen, Autorenprofile oder Statistiken. Keine „Top-10 beste…“ ohne offengelegtes Prüfverfahren.
6. **Rechtlich heikle Themen** (Ladungssicherung, Bußgelder, Haftung, Zoll, Gefahrgut): nur Primärquellen (Gesetzestext, Norm, Behörde), Hinweis „keine Rechtsberatung“, 6- bzw. 12-Monats-Review.

## 2. Pflichtstruktur eines Artikels

| Baustein | Vorgabe |
|---|---|
| **Titel (`title`)** | ≤ 60 Zeichen, Haupt-Keyword vorn, kein Clickbait; ohne Marken-Suffix (wird automatisch ergänzt, wenn Platz bleibt) |
| **Description** | 130–155 Zeichen, Nutzenversprechen + Keyword, kein Doppelmuster zu anderen Seiten |
| **H1** | = Titel oder leicht erweitert; genau eine H1 |
| **Einstieg** | 2–3 Sätze: direkte Antwort/Ergebnis zuerst („Eine Europalette belegt 0,4 Lademeter …“), danach Kontext. Eignet sich für Featured Snippets. |
| **Gliederung** | H2 entsprechen echten Teilfragen; H3 nur bei echter Untergliederung; Inhaltsverzeichnis wird aus H2 erzeugt |
| **Rechenbeispiel/Tabelle** | mindestens **ein** durchgerechnetes Beispiel *oder* eine eigene Tabelle je Artikel; Zahlen aus den Rechenkernen nachprüfbar |
| **Grafik** | Tier A: mindestens eine eigene SVG-Grafik (Ladeplan, Maßzeichnung, Ablaufschema) mit `alt` und Bildunterschrift |
| **Rechner-Verweis** | im Text an passender Stelle und im Frontmatter `relatedTool` |
| **Interne Links** | nach Regeln in `04-…` §3 |
| **FAQ** | nur 3–6 **echte** Fragen (Autosuggest/„Ähnliche Fragen“/Support), keine Füllfragen; Antworten 2–4 Sätze |
| **Quellen** | Frontmatter `sources:` mit Titel + URL (Primärquellen), im Text als Fundstelle genannt (z. B. „§ 22 Abs. 1 StVO“) |
| **Hinweis/Haftung** | bei Rechts-/Sicherheitsthemen: kurzer Hinweis, dass der Artikel keine Einzelfallberatung ist |
| **Datum** | `publishedAt` = echtes Datum; `updatedAt` nur bei inhaltlicher Änderung |
| **Umfang** | Tier A ≥ 1.800 Wörter, Tier B ≥ 1.200 Wörter – **Untergrenze, kein Ziel**; kürzer, wenn die Frage vollständig beantwortet ist, dann zusammenlegen oder verwerfen |

## 3. Sprache und Stil (Deutsch)

- Ansprache **„Sie“**, sachlich, klar, aktiv. Keine Floskeln („In der heutigen Zeit …“), keine Marketing-Superlative.
- Zahlen deutsch: **1.850 kg**, **0,4 ldm**, **2,40 m**, Dezimalkomma; Einheiten mit geschütztem Leerzeichen (`1.850&nbsp;kg`) wenn möglich.
- Fachbegriffe beim ersten Auftreten erklären (Lademeter, Stapelfaktor, frachtpflichtiges Gewicht), danach konsequent verwenden (Glossar L22 als Referenz).
- Kurze Absätze (max. 4 Sätze), Listen für Schritte, Tabellen für Vergleiche.
- Konsequente Schreibweisen: *Europalette* (nicht „Euro-Palette“), *LKW*, *ldm* bzw. *Lademeter*, *frachtpflichtiges Gewicht*.
- DACH: Aussagen zu Gesetzen **für Deutschland** formulieren; bei Österreich/Schweiz nur mit eigener Quelle.

## 4. Recherche- und Faktencheck-Prozess

1. **Quellenliste zuerst:** Für jede Zahl/Regel die Primärquelle notieren (Gesetz, Norm, Behördenseite, Herstellerdatenblatt, Carrier-Dokumentation).
2. **Zwei-Quellen-Regel** bei Zahlen ohne Normcharakter (z. B. Divisoren, Faktoren): Primärquelle + eine unabhängige Bestätigung; bei Widerspruch den Widerspruch **benennen** statt eine Zahl zu wählen.
3. **Stand-Datum** im Text („Stand: 20.10.2026“) für alles, was sich ändert (Divisoren, Maut, Bußgelder, Fahrverbote).
4. **Rechenkerne nutzen:** Beispiele mit dem Rechner nachrechnen und das Ergebnis im Artikel exakt übernehmen.
5. **Sekundärquellen** (Händler-, Vergleichsportale) nur als Hinweis, nie als Beleg für Normwerte.
6. **KI-Entwürfe:** gelten als ungeprüft; Zahlen, Paragrafen und Namen werden einzeln gegen die Quelle abgeglichen. Nicht belegbare Aussagen werden gestrichen.

## 5. Qualitäts-Checkliste (Veröffentlichungs-Gate)

Ein Artikel wird nur veröffentlicht, wenn **alle** Punkte erfüllt sind:

- [ ] Suchintention klar beantwortet (Test: Würde ich nach dem Lesen nochmals suchen?)
- [ ] Haupt-Keyword nicht bei einer anderen URL belegt (`04-…` §2)
- [ ] Jede Zahl/Regel hat eine Primärquelle oder ist als Richtwert gekennzeichnet; Stand-Datum vorhanden
- [ ] Mindestens ein eigenes, nachgerechnetes Beispiel oder eine eigene Tabelle
- [ ] Tier A: eigene Grafik mit `alt`
- [ ] Keine erfundenen Preise, Zitate, Studien, Testimonials, Autorenangaben
- [ ] Interne Links (≥ 1 Rechner, 1 Hub, 2 Geschwister) gesetzt; Rückverlinkung von 2 bestehenden Seiten geplant
- [ ] Titel ≤ 60, Description 130–155, genau eine H1, Slug = Haupt-Keyword
- [ ] Kein Textbaustein-Duplikat: max. 25 % identische 8-Wort-Folgen zu einem anderen Artikel der Seite (Prüfung per Skript/Stichprobe)
- [ ] Rechts-/Sicherheitsthemen: Primärquelle (Gesetz/Norm), Hinweis „keine Rechtsberatung“, zweite Person hat gegengelesen
- [ ] Rechtschreibung/Grammatik geprüft, Zahlenformat deutsch
- [ ] `npm test` und `npm run check:seo` laufen grün; Barrierefreiheit (Überschriftenhierarchie, Tabellenüberschriften, Alt-Texte)

**Bei Nichterfüllung:** Artikel bleibt im Entwurf, der Slot rutscht nach hinten. **Niemals** mit dünnen Texten auffüllen, um den Plan (2/Tag) zu halten.

## 6. Verbotene Muster (Spam-/Qualitätsrisiko)

- Massenhaft ähnliche Seiten mit ausgetauschten Zahlen/Orten („Programmatic Thin Content“).
- Umschreiben fremder Seiten ohne eigenen Mehrwert; Übersetzen englischer Seiten 1:1.
- Seiten nur für Suchmaschinen (Keyword-Wiederholung, versteckter Text).
- Gekaufte oder getauschte Links in großem Stil; Gästebuch-/Foren-Spam; automatisierte Kommentare.
- Veraltete Inhalte stehen lassen: Seiten mit Stand-Datum und Review-Zyklus (`07-…` Spalte „Review-Zyklus“).
- Vorgetäuschte Expertise (erfundene Autoren, Titel, Referenzen).

## 7. Formate und Spezialfälle

- **Referenz-Tabellen** (z. B. Divisoren, Bußgelder, Maße): immer mit Quellenspalte je Zeile + Stand-Datum; Review alle 6 bzw. 12 Monate (Kalendereintrag).
- **Assets zum Download** (Excel-Vorlagen, PDF-Checklisten, Aufgabenblätter): eigene Landing-Sektion im Artikel, Lizenzhinweis (z. B. „frei nutzbar mit Quellenangabe“), Dateiname sprechend, ohne Makros, Rechenlogik im Blatt dokumentiert.
- **Vergleichstests** (z. B. L17): feste Eingaben veröffentlichen, nur beobachtete Ergebnisse berichten, Hinweis auf Testdatum; keine Abwertung einzelner Anbieter ohne Beleg.
- **Glossare:** alphabetisch, jeder Eintrag mit Quelle oder Verweis auf den vertiefenden Artikel.
- **Schüttgewicht-Tabellen:** Werte als **Bereiche** (trocken/feucht) mit Quelle (z. B. DIN-Wichtetabellen, Herstellerangaben) und Hinweis „Messwerte schwanken“; keine Einzelwerte ohne Quelle.

## 8. Technische Umsetzung neuer Artikel

1. Datei in `seo/drafts/<slug>.md` anlegen (Entwurf, wird **nicht** ausgeliefert).
2. Frontmatter wie in `README.md` des Projekts (`title, description, slug, publishedAt, updatedAt, category, tags, relatedTool, faq, sources`).
3. Nach bestandenem Gate nach `content/ratgeber/<slug>.md` verschieben; `npm test` (prüft Slug, Meta-Längen, FAQ, interne Links) und `npm run check:seo` ausführen.
4. Veröffentlichung/Deployment **nur nach Freigabe** durch den Betreiber.
5. Nach dem Deployment: URL in der Search Console prüfen („Indexierung beantragen“ nur für Tier-A-Artikel, nicht in Masse) und in `07-editorial-calendar.csv` den Status auf `veröffentlicht` setzen.
6. Nach 14 und 45 Tagen in der Search Console prüfen: indexiert? Impressionen? Query-Überschneidung mit anderen URLs?
