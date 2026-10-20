# Content- und SEO-Roadmap

Grundsatz: **Qualität vor Menge.** Eine neue Domain mit vielen ähnlichen Texten in kurzer Zeit passt in das Muster, das
Googles Spam-Richtlinien („scaled content abuse“) adressieren, und kann zu Abstrafungen führen („Seiten mit
geringem Mehrwert“). Deshalb: 2–3 sorgfältige Beiträge pro Woche, jeder mit eigenem Rechenbeispiel, Tabelle oder
Grafik, Quellen und Verlinkung zum passenden Rechner.

## Ausgangslage (Stand 2026-10-20)

- 5 Rechner (Lademeter, Paletten, Kartons, Beladung, Volumengewicht)
- 10 Ratgeber, 8 Fahrzeugseiten, Lademeter-Tabelle, Berechnungsgrundlagen
- Rechtsseiten vorbereitet, **warten auf Betreiberdaten** (siehe `LAUNCH-CHECKLIST.md`)

## Phase 1 – Start (Woche 1–4 nach Livegang)

Ziel: Indexierung sichern, erste Long-Tail-Rankings, Daten sammeln.

- Search Console/Bing einrichten, Sitemap einreichen, Indexierung der Kernseiten prüfen
- Kernseiten manuell gegenlesen, Betreiber-/Autorenprofil ergänzen („Über uns“, E-E-A-T)
- 4–6 neue Ratgeber (jeweils 1.000+ Wörter):
  1. Düsseldorfer Palette / Halbpalette – Maße, Einsatz, Stellplätze
  2. Gitterbox – Maße, Tragfähigkeit, Stapeln
  3. Sperrgut und Überbreite – was zählt beim Lademeter (nur allgemein, ohne Bußgeldbeträge)
  4. Ab wann lohnt sich Komplettladung? (Rechenbeispiel mit eigenem Tarifvergleich)
  5. Umzug mit Transporter: Wie viele Paletten/Kartons passen? (Privatkunden-Intent)
  6. Seefracht: Container beladen – Paletten im 20’/40’

## Phase 2 – Ausbau (Monat 2–3)

- Je Ratgeber-Cluster eine Pillar-Seite: Palettenarten, Fahrzeuge, Ladungssicherung, Frachtkosten
- Interaktive Zusatzfunktionen mit Linkpotenzial: einbettbares Widget (`/embed/…`), Excel-/CSV-Export der Ladeliste
- Vergleichstabellen aktualisieren, `lastUpdated` in `lib/site-config.ts` pflegen
- Erste Auswertung der Search-Console-Daten: Seiten mit Impressionen, aber niedriger CTR → Titel/Beschreibung überarbeiten

## Phase 3 – Wachstum (Monat 4–12)

- Mehr Fahrzeug- und Ladungsarten nur mit echtem Mehrwert (z. B. Kühlkoffer, Jumbo, Gliederzug)
- Linkaufbau über Nutzen: Ausbildungs-/Schulungsmaterial, Branchenforen, Fachmedien, Hinweis auf den Rechner in Antworten
- Englische Version nur, wenn die deutsche Seite stabil rankt (hreflang, nicht automatisch übersetzen)

## Qualitäts-Checkliste je Beitrag

- [ ] Eigenes Rechenbeispiel, geprüft gegen den Rechner
- [ ] Mindestens eine Tabelle oder Grafik
- [ ] 2–5 interne Links, davon einer auf den passenden Rechner
- [ ] Quellen (Gesetze, EPAL, Normen) verlinkt; keine Bußgeldbeträge als „fest“
- [ ] `updatedAt` gesetzt, Meta-Beschreibung 120–170 Zeichen, FAQ mit 3–5 Fragen
- [ ] `npm test` (prüft Links und Metadaten) läuft grün
