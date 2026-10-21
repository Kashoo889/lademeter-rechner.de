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
