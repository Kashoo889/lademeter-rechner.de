> **UMGESETZT (20.10.2026):** Dieses Gerüst ist als Seite `app/lademeter-aufgaben/page.tsx` umgesetzt (versteckt hinter `DOWNLOADS_LIVE`). Der Text unten ist nur noch Referenz; maßgeblich ist der Code.

# Landingpage-Entwurf: Aufgabenblatt Lademeter (zugehörig zu Kalender-ID L06)

> **Status:** Entwurf, nicht veröffentlicht. Gerüst der Download-Seite; der ausführliche Beitrag „Lademeter-Aufgaben mit Lösungen“ (L06) wird erst **nach dem 26.10.2026** geschrieben. Datei: `seo/assets/Aufgabenblatt-Lademeter-berechnen.pdf` (für die Veröffentlichung nach `public/downloads/` kopieren – nach Freigabe).

| Feld | Vorschlag |
|---|---|
| URL | `/lademeter-aufgaben/` (Datei: `/downloads/Aufgabenblatt-Lademeter-berechnen.pdf`) |
| Haupt-Keyword | `lademeter lkw berechnen aufgaben` (Autosuggest vorhanden), Nebenbegriffe: „lademeter aufgaben“, „lademeter berechnen aufgaben“ |
| Title (≤ 60) | Lademeter berechnen: Aufgaben mit Lösungen (PDF) |
| Description (130–155) | Kostenloses Aufgabenblatt zum Lademeter berechnen: 12 Aufgaben mit Lösungsweg für Ausbildung und Unterricht – Stapellagen, Gewicht, Auslastung. |
| H1 | Lademeter berechnen: Aufgabenblatt mit Lösungen für Ausbildung und Unterricht |
| Schema | WebPage + BreadcrumbList |

## Seitentext (Entwurf)

**Einleitung**
Dieses Aufgabenblatt trainiert die Lademeter-Rechnung Schritt für Schritt: von der einzelnen Europalette über Stapellagen und Mischladungen bis zum frachtpflichtigen Gewicht. Es richtet sich an Lehrkräfte, Ausbilder und Auszubildende in Spedition und Logistik sowie an alle, die Lademeter üben wollen. Alle 12 Aufgaben haben einen vollständigen Rechenweg.

[Button: Aufgabenblatt herunterladen (PDF, 5 Seiten, Version 1.0, Stand 20.10.2026)]

**Inhalt**
- **12 Aufgaben in drei Stufen:** *Grundlagen* (Formel, Stapellagen), *Anwendung* (Mischladung, Maßumrechnung mm/cm/m, Auslastung eines Sattelzugs), *Praxis* (Lademetergewicht, frachtpflichtiges Gewicht, Prüfung der Stapelhöhe).
- **Lösungen mit Rechenweg** und Ergebnis zu jeder Aufgabe, **Bewertungsvorschlag** (35 Punkte) und **Hinweise für Lehrkräfte**.
- **Merkkasten** mit den Formeln und der Rechenkonvention (Referenzbreite 2,4 m, Rundung auf zwei Dezimalstellen).
- Zur Selbstkontrolle: Ergebnisse lassen sich mit dem [Lademeter-Rechner](/) nachrechnen.

**Wie wurde geprüft?**
Alle Lösungswerte stammen aus den Rechenkernen des Online-Rechners und wurden beim Erstellen des Blatts berechnet, nicht von Hand eingetragen. Das Blatt enthält ausschließlich eigene Aufgaben und eigene Zahlen. Es wurden keine IHK-Prüfungsaufgaben oder Verlagsaufgaben verwendet, die nicht kopiert werden dürfen.

**Wichtige Hinweise**
Die Lademeter-Formel ist eine Branchenkonvention, keine Norm. Speditionen können abweichend runden oder andere Faktoren je Lademeter ansetzen; das Blatt rechnet mit den exakten Werten. Die Aufgaben zum Stapeln setzen voraus, dass die Ware tatsächlich stapelbar und gesichert werden kann.

**Lizenz:** CC BY 4.0 – Nutzung, Vervielfältigung und Anpassung für Unterricht und Ausbildung sind mit Quellenangabe „lademeter-rechner.de“ erlaubt.

**Passend dazu:** [Excel-Vorlage zum Lademeter berechnen](/lademeter-excel-vorlage/), [Was ist ein Lademeter?](/ratgeber/was-sind-lademeter/), [Stapelfaktor bei Lademetern](/ratgeber/stapelfaktor-lademeter/), [Lademeter-Tabelle](/lademeter-tabelle/).

## FAQ (Entwurf)
1. **Darf ich das Blatt im Unterricht kopieren und verändern?** Ja, unter CC BY 4.0 mit Quellenangabe.
2. **Gibt es eine Fassung ohne Lösungen?** *(Offen: Variante „nur Aufgaben“ für Schüler erzeugen – einfache Erweiterung des Generators.)*
3. **Sind die Aufgaben prüfungsrelevant?** Sie orientieren sich an der Rechnung, nicht an Prüfungsvorgaben. Sie ersetzen keine Prüfungsvorbereitung der zuständigen Stelle.
4. **Wie rechnen Speditionen wirklich ab?** Das hängt vom Tarif ab (Rundung, Faktor, Mindestgewicht). Das Blatt vermittelt die Grundrechnung.

## Interne Links
- **Ausgang:** `/`, `/lademeter-excel-vorlage/`, `/ratgeber/was-sind-lademeter/`, `/ratgeber/stapelfaktor-lademeter/`, `/lademeter-tabelle/`, `/methodik/`.
- **Eingang (nach Veröffentlichung):** `/ratgeber/was-sind-lademeter/`, `/ratgeber/stapelfaktor-lademeter/`, `/lademeter-tabelle/`, Startseite.

## Backlink-Zielgruppe
Berufsschulen und Ausbilder (Materialsammlungen), Lernplattformen, Logistik-Fachportale (siehe `08-outreach-welle-1.md`). **Backlinks auf die Landingpage lenken, nicht auf die PDF-Datei.**

## Technische Hinweise
- PDF-Metadaten (Titel, Autor) setzen; Dateiname sprechend. Optional: `Link: <https://lademeter-rechner.de/lademeter-aufgaben/>; rel="canonical"` als HTTP-Header für die PDF, damit die Landingpage das Ranking-Ziel bleibt (Alternative: PDF indexierbar lassen, wenn sie für „Lademeter Aufgaben PDF“ ranken soll – Entscheidung nach 45 Tagen anhand der Search Console).
- Variante für Schüler (ohne Lösungen) als zweite Datei erwägen.
