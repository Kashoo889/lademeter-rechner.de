# Werkzeuge

`autosuggest.py` – erhebt Google-Autosuggest-Vorschläge (hl=de, gl=de) für die Seeds in `seeds.json`; für die Seeds in `expand-seeds.json` zusätzlich mit Buchstaben a–z.

```bash
python seo/tools/autosuggest.py out.json seo/tools/seeds.json seo/tools/expand-seeds.json
```

Ausgabe: JSON mit `calls` (Anzahl Abfragen, in denen der Begriff auftaucht), `best_rank` und `seeds`. Monatlich neu erheben und mit Search-Console-Queries abgleichen. Die Daten sind **Indizien für Nachfrage, keine Suchvolumina**. Bitte moderat nutzen (Pause zwischen Abfragen ist eingebaut) und die Nutzungsbedingungen des Dienstes beachten.

## Assets (Excel-Vorlage, Aufgabenblatt)

| Datei | Zweck |
|---|---|
| `build_lademeter_excel.py` | erzeugt `seo/assets/Lademeter-Berechnung-Excel-Vorlage.xlsx` (openpyxl) |
| `verify_lademeter_excel.py` | gleicht die Excel-Formeln mit den Rechenkernen ab (`pip install openpyxl formulas`; Node ≥ 22.18) |
| `core_expected.mjs` | gibt die Ergebnisse von `lib/calculators/lademeter.ts` für Testfälle aus (wird vom Prüfer genutzt) |
| `build_worksheet_html.mjs` | erzeugt das Aufgabenblatt als HTML; alle Lösungen stammen aus dem Rechenkern |

Details und Abnahme-Checkliste: `../assets/README.md`.

## Redaktions- und Audit-Werkzeuge (21.10.2026)

| Befehl | Zweck |
|---|---|
| `npm run seo:brief -- --from 2026-10-26 --days 14` | Briefings aus dem Kalender erzeugen (`seo/briefs/`) |
| `npm run seo:new -- --id L03` | Entwurfsgerüst in `seo/drafts/` (mit TODO-Platzhaltern) |
| `npm run seo:check -- seo/drafts/<slug>.md` (oder `--all`) | Qualitäts-Gate: Frontmatter, Umfang, Quellen, Links, Floskeln, Dopplung … |
| `npm run seo:promote -- seo/drafts/<slug>.md --approved-by "Name"` | Freigabe nach `content/ratgeber/`; verweigert vor dem Veröffentlichungsdatum, ohne bestandenes Gate und ohne Freigabenamen (`--dry-run` zum Testen) |
| `npm run check:crawl` | Crawl-Audit (Links, Weiterleitungen, Überschriften, Duplikate, Klicktiefe, eingehende Links); `SITE_CHECK_URL` setzen |
| `npm run check:seo` | schnelle On-Page-/Host-Prüfung |

Gemeinsame Funktionen: `lib.mjs`. Ablauf und Regeln: `../WORKFLOW.md`.
