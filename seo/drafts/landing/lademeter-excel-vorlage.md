> **UMGESETZT (20.10.2026):** Dieses Gerüst ist als Seite `app/lademeter-excel-vorlage/page.tsx` umgesetzt (versteckt hinter `DOWNLOADS_LIVE`). Der Text unten ist nur noch Referenz; maßgeblich ist der Code.

# Landingpage-Entwurf: Excel-Vorlage Lademeter (zugehörig zu Kalender-ID L01)

> **Status:** Entwurf, nicht veröffentlicht. Dies ist nur das **Gerüst der Download-Seite**. Der ausführliche Ratgeber „Lademeter berechnen mit Excel“ (L01) wird erst **nach dem 26.10.2026** geschrieben und ersetzt/erweitert diese Seite. Die Datei liegt unter `seo/assets/`; für die Veröffentlichung nach `public/downloads/` kopieren (nach Freigabe).

| Feld | Vorschlag |
|---|---|
| URL | `/lademeter-excel-vorlage/` (Datei: `/downloads/Lademeter-Berechnung-Excel-Vorlage.xlsx`) |
| Haupt-Keyword | `lademeter berechnen excel` (Autosuggest: „lademeter berechnen excel“, „lademeter berechnen rechner excel“) |
| Title (≤ 60) | Lademeter berechnen mit Excel: kostenlose Vorlage |
| Description (130–155) | Kostenlose Excel-Vorlage zum Lademeter berechnen: bis zu 25 Positionen, Stapellagen, Gewicht und frachtpflichtiges Gewicht – ohne Makros, mit Beispiel. |
| H1 | Lademeter berechnen mit Excel: kostenlose Vorlage zum Download |
| Breadcrumb | Start › Ratgeber › Excel-Vorlage Lademeter (bzw. künftiger Themen-Hub „Lademeter“) |
| Schema | WebPage + BreadcrumbList (keine erfundenen Bewertungen) |

## Seitentext (Entwurf)

**Einleitung**
Mit dieser Excel-Vorlage berechnen Sie Lademeter, Bodenstellplätze und das frachtpflichtige Gewicht für Ihre Sendung – direkt in Excel, ohne Makros und ohne Anmeldung. Sie ist für Disposition, Versand und Lager gedacht und liefert dieselben Ergebnisse wie der [Lademeter-Rechner](/).

[Button: Excel-Vorlage herunterladen (.xlsx, ca. 25 KB, Version 1.0, Stand 20.10.2026)]

**Das steckt in der Vorlage**
- **Rechner** (leeres Blatt): bis zu 25 Ladungspositionen mit Länge, Breite, Höhe, Anzahl, Stapellagen und Gewicht je Stück; Maßeinheit mm, cm oder m wählbar.
- **Beispiel:** eine ausgefüllte Sendung (Europaletten, zweilagig gestapelte Industriepaletten, Kisten) mit 10,10 Lademetern, 33 Bodenstellplätzen und einem frachtpflichtigen Gewicht von 18.692,71 kg bei 1.850 kg je Lademeter.
- **Referenz:** Lademeter von Europalette (0,40), Industriepalette (0,50) und Halbpalette (0,20) sowie eine Tabelle für typische Mengen (1 bis 34 Paletten).
- **Anleitung, Hinweise und Quellen** inklusive Formeln und Grenzen.
- **Prüfhinweise** je Zeile (z. B. „Breite größer als Referenzbreite“, „Gestapelt gerechnet – Innenhöhe prüfen“) und Warnung, wenn die Sendung die Ladelänge des Vergleichsfahrzeugs (13,6 m) überschreitet.

**So rechnet die Vorlage**
Lademeter = Länge × Breite ÷ 2,4 m × Bodenstellplätze, Bodenstellplätze = Anzahl ÷ Stapellagen (aufgerundet), Lademetergewicht = Lademeter × Faktor, frachtpflichtiges Gewicht = höherer Wert aus tatsächlichem Gewicht und Lademetergewicht. Mehr dazu im Ratgeber [Was ist ein Lademeter?](/ratgeber/was-sind-lademeter/) und unter [Berechnungsgrundlagen](/methodik/).

**Geprüfte Rechnung**
Die Formeln wurden mit automatisierten Testfällen (feste Fälle und Zufallsfälle mit unterschiedlichen Einheiten, Stapellagen, unvollständigen Positionen und Faktoren) gegen die Rechenkerne des Online-Rechners abgeglichen. Ergebnis: 72 Testfälle der ersten Fassung und 36 Testfälle der Endfassung, jeweils ohne Abweichung (Details in `seo/assets/README.md`). Das ist eine technische Prüfung der Rechnung, keine Haftungszusage für den Einzelfall.

**Wichtige Grenzen**
Der Umrechnungsfaktor ist eine Tarifregel Ihrer Spedition, kein Standard (im Beispiel: 1.850 kg als Beispielwert). Speditionen runden Lademeter für die Abrechnung teilweise auf. Stapeln setzt geprüfte Innenhöhe, Belastbarkeit und Ladungssicherung voraus. Die Vorlage ersetzt keinen Ladeplan und keine Achslastprüfung.

**Lizenz:** CC BY 4.0 – frei nutzbar, auch angepasst, mit Quellenangabe „lademeter-rechner.de“.

## FAQ (Entwurf, 4 Fragen)
1. **Brauche ich Makros?** Nein, die Vorlage kommt ohne Makros aus und funktioniert in Excel und kompatiblen Programmen (z. B. LibreOffice).
2. **Warum zeigt die Vorlage Punkt statt Komma?** Das Dezimalzeichen richtet sich nach der Spracheinstellung Ihres Programms.
3. **Kann ich mehr als 25 Positionen eingeben?** Die Vorlage ist für 25 Positionen ausgelegt; für größere Sendungen Blätter kopieren und die Ergebnisse addieren. *(Hinweis: Blätter sind geschützt, Schutz ohne Kennwort aufhebbar.)*
4. **Stimmt das Ergebnis mit meiner Spedition überein?** Nur, wenn Ihre Spedition dieselbe Rechenkonvention verwendet. Maßgeblich sind immer Angebot und Tarif Ihrer Spedition.

## Interne Links (Eingang/Ausgang)
- **Ausgang:** `/` (Rechner), `/ratgeber/was-sind-lademeter/`, `/methodik/`, `/lademeter-tabelle/`, `/lkw-palettenrechner/`.
- **Eingang (nach Veröffentlichung):** Startseite („Passende Ratgeber“), Ratgeber „Lademeter in kg umrechnen“, `/lademeter-tabelle/`, `/methodik/`.

## Technische Hinweise für die Veröffentlichung
- Datei mit sprechendem Namen ausliefern (`Lademeter-Berechnung-Excel-Vorlage.xlsx`), Versionsnummer im Blatt „Hinweise und Quellen“ pflegen.
- Download-Link als normaler `<a href>` mit `download`-Attribut; Dateigröße und Version im Linktext.
- XLSX-Dateien werden von Suchmaschinen nicht als Landingpage-Ziel genutzt: Backlinks bitte auf die **Landingpage**, nicht auf die Datei lenken.
