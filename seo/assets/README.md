# Download-Assets (fertig, nicht veröffentlicht)

Stand 20.10.2026 · Lizenzvorschlag: CC BY 4.0 (Namensnennung „lademeter-rechner.de“) – **bitte freigeben**, bevor die Dateien veröffentlicht werden.

| Datei | Inhalt | Kalender-ID | Landingpage-Entwurf |
|---|---|---|---|
| `Lademeter-Berechnung-Excel-Vorlage.xlsx` | Excel-Vorlage ohne Makros: 25 Positionen, Einheit mm/cm/m, Stapellagen, Höhe, Gewicht, Faktor → Lademeter, Bodenstellplätze, Grundfläche, Volumen, Gewicht, Lademetergewicht, frachtpflichtiges Gewicht, Anteil und Rest eines Vergleichsfahrzeugs; Blätter: Anleitung, Rechner, Beispiel, Referenz, Hinweise und Quellen | L01 | Seite `app/lademeter-excel-vorlage/` |
| `Aufgabenblatt-Lademeter-berechnen.pdf` | 5 Seiten: Lernziele, Merkkasten, 12 Aufgaben in 3 Stufen (35 Punkte), Lösungen mit Rechenweg, Bewertungsvorschlag, Hinweise für Lehrkräfte | L06 | Seite `app/lademeter-aufgaben/` |
| `Aufgabenblatt-Lademeter-berechnen-ohne-Loesungen.pdf` | Schülerfassung, 3 Seiten, nur die 12 Aufgaben | L06 | ebenda |

## Verifikation (reproduzierbar)

Alle Werkzeuge liegen in `../tools/`:

| Prüfung | Ergebnis |
|---|---|
| **Excel-Formeln gegen Rechenkern** (`verify_lademeter_excel.py`): 12 feste Fälle (u. a. Aufrunden bei ungerader Anzahl und Stapeln, mm/cm/m, Faktor mit/ohne Gewicht, ungültige Zeilen, nur ungültige Zeilen, breite Ware) + zufällige Fälle (1–8 Positionen, gemischte Einheiten, optionale Höhe/Gewicht/Lagen, Faktor 1.500–2.000 oder leer) | Erste Fassung: **72 Fälle (12 + 60), 0 Abweichungen.** Endfassung nach den Layout-Änderungen: **36 Fälle (12 + 24), 0 Abweichungen** |
| **Negativ-Kontrolle:** Formel absichtlich verfälscht (ROUNDDOWN statt ROUNDUP) | Prüfer meldet Abweichung (Bodenstellplätze, Lademeter, Grundfläche, Anteil, Rest) → Prüfung ist wirksam |
| **Aufgabenblatt:** alle Lösungswerte werden von `build_worksheet_html.mjs` mit dem Rechenkern berechnet (nicht von Hand eingetragen); Rechenwege zusätzlich von Hand nachgerechnet (z. B. Aufgabe 7: 0,85 × 0,65 ÷ 2,4 × 20 = 4,60 ldm) | stimmig |
| Beispielblatt der Vorlage | 10,10 Lademeter, 33 Bodenstellplätze, 24,25 m², 34,42 m³, 9.500 kg, bei 1.850 kg/ldm: 18.692,71 kg frachtpflichtig (entspricht Rechenkern) |

**Grenzen der Prüfung:** Die Excel-Formeln wurden mit der Python-Bibliothek `formulas` berechnet, **nicht** in Microsoft Excel oder LibreOffice geöffnet (beide standen nicht zur Verfügung). Die verwendeten Funktionen sind Standard (IF, AND, ISNUMBER, MAX, INT, ROUNDUP, ROUND, SUM, COUNTA, TRIM); Datenvalidierung, Blattschutz, bedingte Formatierung und Druckeinstellungen wurden **nicht** in Excel geprüft. **Bitte vor Veröffentlichung einmal in Excel (und optional LibreOffice) öffnen, das Beispielblatt mit dem Online-Rechner vergleichen und eine Testeingabe machen** (Checkliste unten).

## Checkliste für die manuelle Abnahme (10 Minuten)

1. Datei in Excel öffnen: öffnet ohne Reparaturmeldung? Blatt „Rechner“ aktiv?
2. Blatt „Beispiel“: Ergebnisfelder 10,10 / 33 / 24,25 / 34,42 / 9.500 / 18.692,71 vorhanden? Beschriftungen vollständig sichtbar?
3. Blatt „Rechner“: 10 Europaletten (120 × 80 cm) eingeben → 4,00 Lademeter; Stapellagen 2 → 2,00; Einheit auf „m“ und Maße 1,2 / 0,8 → gleiches Ergebnis.
4. Ungültige Eingaben (Text, 0, negative Zahl) werden abgelehnt oder als Prüfhinweis markiert; Zeile bleibt ohne Ergebnis.
5. Blattschutz: Formelzellen nicht überschreibbar; Schutz aufhebbar ohne Kennwort.
6. Druckvorschau Querformat A4, eine Seite breit.
7. In Excel mit deutscher Spracheinstellung: Dezimalkomma wird akzeptiert.
8. PDF: 5 Seiten, Fußzeile mit Seitenzahl, Lösungen auf eigener Seite, Lizenzhinweis vorhanden.

## Neu erzeugen

```bash
python seo/tools/build_lademeter_excel.py                       # Excel
node --no-warnings seo/tools/build_worksheet_html.mjs out.html   # Aufgabenblatt als HTML (Lösungen aus dem Rechenkern)
# HTML im Browser öffnen und als PDF drucken (A4, Hochformat, Hintergrundgrafiken an)
python seo/tools/verify_lademeter_excel.py 60                    # Excel gegen Rechenkern prüfen (pip install openpyxl formulas)
```

## Wettbewerbs-Recherche (Kurzfassung)

- In der Suche (20.10.2026) tauchte **keine** brauchbare kostenlose deutsche Lademeter-Excel-Vorlage auf; Treffer waren Online-Rechner (calcforlife.com, rechner-portal.de, quicargo), kommerzielle Software (Stapel Maxx) und englischsprachige Spiegel-/Spam-Seiten zu „Pallet Calculator Excel Templates“ (nicht vertrauenswürdig).
- Freie **Arbeitsblätter** zu Lademetern mit Lösungen wurden nicht gefunden. Berufsschul-Material existiert (z. B. IHK-Probeklausuren), ist aber urheberrechtlich geschützt und darf nicht kopiert werden – das Blatt ist deshalb komplett eigenständig erstellt.
- Differenzierung der Assets: ohne Makros, transparente Formeln, Prüfhinweise, Referenzblatt, dokumentierte Verifikation, offene Lizenz, Beispiel mit Gegenprobe zum Online-Rechner.

## Landingpages und Go-Live-Schalter

Die Download-Seiten existieren als echte Routen (`app/lademeter-excel-vorlage/`, `app/lademeter-aufgaben/`, gemeinsame Komponente `components/content/DownloadLanding.tsx`), sind aber **versteckt**, solange `DOWNLOADS_LIVE = false` in `lib/downloads.ts` steht:

| Zustand | `false` (aktuell) | `true` (nach Freigabe) |
|---|---|---|
| Landingpages | erreichbar per URL, `noindex`, nicht verlinkt | indexierbar |
| Sitemap | nicht enthalten | enthalten |
| Teaser „Kostenlose Downloads“ auf Startseite und Lademeter-Tabelle | unsichtbar | sichtbar (damit ≥ 2 interne Links pro Seite) |
| Dateien unter `/downloads/…` | erreichbar, Header `X-Robots-Tag: noindex, nofollow` + `Link: <Landingpage>; rel="canonical"` | `Link`-Canonical bleibt, kein noindex |

**Vor dem Umschalten:** Lizenz (CC BY 4.0) freigeben, manuelle Excel-Abnahme (Checkliste oben), Impressum/Datenschutz fertig (Vertrauen), Deployment-Freigabe. Danach `npm run check:seo` gegen die Live-URL.

Dateien: Quelle der Wahrheit ist `seo/assets/`; `node seo/tools/sync_downloads.mjs` kopiert nach `public/downloads/` (ein Test in `lib/downloads.test.ts` prüft Identität, Dateiformat und Größe).

## Test der Landingpages (20.10.2026, lokaler Produktions-Build)

- Beide Seiten bei 390, 768 und 1440 px: kein horizontales Scrollen, genau eine H1, keine Konsolenfehler.
- Download per echtem Klick im Browser: alle drei Dateien identisch mit der Quelle; Content-Types korrekt (XLSX/PDF).
- Veröffentlichter Zustand (Schalter testweise `true`): `check:seo` mit 34 URLs ohne Fehler und ohne Waisenseiten; Titel 49 Zeichen, Descriptions 153/147 Zeichen, Canonical korrekt, JSON-LD (WebPage + BreadcrumbList), beide Seiten in der Sitemap, Teaser auf Startseite und Tabelle sichtbar. Danach Schalter zurück auf `false`.
