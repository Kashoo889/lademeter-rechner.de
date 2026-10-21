# Entwürfe (nicht veröffentlicht)

Dateien in diesem Ordner werden **nicht** ausgeliefert. Nach bestandenem Qualitäts-Gate (`../05-content-richtlinien.md` §5) nach `content/ratgeber/` verschieben, `npm test` und `npm run check:seo` ausführen, dann Freigabe zum Deployment einholen. Beide Entwürfe verlinken aufeinander – **gemeinsam** verschieben, sonst schlägt der Link-Test fehl.

Quellenprüfung am 20.10.2026 über gesetze-im-internet.de (Text-Abruf, Wortlaut je Absatz abgeglichen): § 32 StVZO, § 22 StVO, § 23 StVO, § 31 StVZO, § 412 HGB. **Bitte vor Veröffentlichung alle Zahlen und Fundstellen einmal von einer Person gegen den aktuellen Gesetzestext prüfen lassen.**

## `lkw-hoechstmasse-deutschland.md` (G01, Kalender 26.10.2026, Slot 1)

- Umfang ca. 1.980 Wörter (Tier-A-Ziel 1.800 erfüllt), Tabelle der Grenzwerte mit Fundstellen, Teillängen im Wortlaut erklärt, Planungswert-Tabelle aus `lib/calculators/vehicles.ts`, durchgerechnetes Beispiel.
- **Offen:** (1) Satz 2 von § 32 Abs. 1 (Einrichtungen, die bei der Breitenmessung außer Betracht bleiben) im Gesetzestext gegenlesen – ich habe nur Nr. 11 und Nr. 17 paraphrasiert. (2) Eigene SVG-Maßzeichnung (Außen- vs. Innenmaß, 4 m) mit `alt` ergänzen. (3) Zweite Person liest gegen. (4) Datum auf Veröffentlichungstag setzen.

## `paragraf-22-stvo-ladung.md` (R01, Kalender 26.10.2026, Slot 2)

- Umfang ca. 1.610 Wörter – **unter dem Tier-A-Ziel (1.800)**. Nicht auffüllen: entweder um fachlich Sinnvolles ergänzen (z. B. Fallbeispiele zur Kennzeichnung mit Skizze) oder auf Tier B herabstufen.
- Alle Zahlen zu Absatz 2–5 sind abgeglichen. Absatz 1: Wortlaut nur teilweise zitiert („anerkannte Regeln der Technik“); Aufzählung der Gefahren paraphrasiert.
- **Bewusst nicht enthalten:** Bußgelder (eigener Artikel mit Stand-Datum), Beschleunigungswerte der VDI 2700 (konnte nicht belegt werden; die VDI-Richtlinie wird nur als in der Praxis herangezogene Regel genannt – bitte prüfen).
- **Offen:** (1) Absatz 3: „Höhe von 2,50 m“ – Bezugshöhe (über Fahrbahn) im Gesetzestext prüfen. (2) Skizze/Grafik zu Überstand und Kennzeichnung. (3) Gegenlesen durch zweite Person. (4) Abgrenzung zu „Ladungssicherung im LKW“ im Redaktionsgespräch bestätigen.

## Zurückgestellt: V01 „Volumengewicht bei DHL“

Keine offizielle DHL-Quelle für den Paket-Divisor gefunden; Drittquellen widersprechen sich (5.000 vs. 6.000 je nach Dienst). Der Artikel wird erst geschrieben, wenn die DHL-Geschäftskundenbedingungen/Preislisten als Primärquelle vorliegen. Gleiches gilt für V02, V11, V14, V15 (Kalenderstatus „Carrier-Quelle vorab verifizieren“).
