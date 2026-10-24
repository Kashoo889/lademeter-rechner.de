---
title: "CBM berechnen: Kubikmeter für Kartons und Paletten"
description: "CBM berechnen in drei Schritten: Länge × Breite × Höhe in Metern, mit Rechenbeispielen für Kartons, Paletten und Kisten, typischen Fehlern und Volumengewicht."
slug: "cbm-berechnen"
publishedAt: "2026-10-24"
updatedAt: "2026-10-24"
category: "Frachtkosten"
tags: ["cbm", "kubikmeter", "volumen", "kartons", "paletten", "volumengewicht"]
cluster: "volumengewicht"
relatedTool: "volumengewicht-rechner"
faq:
  - question: "Wie berechnet man CBM?"
    answer: "CBM steht für Kubikmeter (m³). Sie multiplizieren Länge, Breite und Höhe in Metern. Bei Zentimetern teilen Sie das Produkt durch 1.000.000: 60 × 40 × 30 cm = 72.000 cm³ = 0,072 m³. Mehrere gleiche Packstücke multiplizieren Sie mit der Stückzahl."
  - question: "Wie viel CBM hat eine Europalette?"
    answer: "Das hängt von der beladenen Höhe ab. Die Grundfläche beträgt 0,96 m² (1,20 m × 0,80 m); die leere Palette ist 14,4 cm hoch. Bei 1,50 m Warenhöhe ergibt sich eine Gesamthöhe von 1,644 m und ein Volumen von rund 1,58 m³."
  - question: "Wie rechne ich Zentimeter in Kubikmeter um?"
    answer: "Multiplizieren Sie Länge, Breite und Höhe in Zentimetern und teilen Sie das Produkt durch 1.000.000, denn 1 m³ entspricht 100 cm × 100 cm × 100 cm. Alternativ wandeln Sie jede Maßangabe zuerst in Meter um (durch 100 teilen) und multiplizieren dann."
  - question: "Wie hängen CBM und Volumengewicht zusammen?"
    answer: "Das Volumengewicht ist ein aus dem Volumen abgeleitetes fiktives Gewicht: Volumen in m³ mal einem Faktor in kg je m³ (oder Volumen in cm³ geteilt durch einen Divisor). Welcher Faktor oder Divisor gilt, legt der Beförderer in seinem Tarif fest."
  - question: "Was ist bei runden oder unregelmäßigen Packstücken zu beachten?"
    answer: "Für die Berechnung werden üblicherweise die größten Außenmaße verwendet, also der umschließende Quader. Ein Fass mit 58 cm Durchmesser und 88 cm Höhe ergibt als Quader 0,58 × 0,58 × 0,88 m = rund 0,30 m³, auch wenn der Zylinder selbst weniger Raum einnimmt. Maßgeblich sind die Bedingungen des Beförderers."
sources:
  - title: "Methodik der Berechnungen (lademeter-rechner.de)"
    url: "https://lademeter-rechner.de/methodik/"
  - title: "Rechenkern Volumengewicht (lademeter-rechner.de, nachgerechnet)"
    url: "https://lademeter-rechner.de/volumengewicht-rechner/"
---

CBM ist die Abkürzung für **Cubic Meter**, also Kubikmeter (m³). Die Formel ist einfach: **Länge × Breite × Höhe, alles in Metern.** Schwierig wird es erst bei den Einheiten, bei der Rundung und bei der Frage, welches Maß für Paletten, Kisten oder runde Packstücke gilt. Dieser Ratgeber zeigt den Rechenweg Schritt für Schritt mit durchgerechneten Beispielen für Kartons, Paletten und Kisten, benennt die häufigsten Fehler und erklärt, wie aus dem CBM ein Volumengewicht wird. Alle Zahlen sind mit dem Rechenkern dieser Seite nachgerechnet.

## Die Formel in drei Schritten

1. **Maße in derselben Einheit erfassen** – am einfachsten in Zentimetern.
2. **Volumen in cm³ berechnen:** Länge × Breite × Höhe.
3. **In m³ umrechnen:** durch 1.000.000 teilen (denn 1 m³ = 100 cm × 100 cm × 100 cm).

**Beispiel: ein Karton mit 60 × 40 × 30 cm.**

- 60 × 40 × 30 = 72.000 cm³
- 72.000 ÷ 1.000.000 = **0,072 m³**

Wer lieber in Metern rechnet, kommt zum selben Ergebnis: 0,60 m × 0,40 m × 0,30 m = 0,072 m³. Für mehrere gleiche Packstücke multiplizieren Sie mit der Stückzahl: **50 Kartons** ergeben 50 × 0,072 = **3,6 m³**.

## Volumen typischer Packstücke

| Packstück | Maße (cm) | Rechnung | Volumen |
| --- | --- | --- | --- |
| Kleiner Karton | 40 × 30 × 20 | 24.000 cm³ | 0,024 m³ |
| Standardkarton | 60 × 40 × 30 | 72.000 cm³ | 0,072 m³ |
| Großer Karton | 60 × 40 × 40 | 96.000 cm³ | 0,096 m³ |
| Kiste | 150 × 100 × 80 | 1.200.000 cm³ | 1,20 m³ |
| Europalette, 1,00 m Ware | 120 × 80 × 114,4 | 1.098.240 cm³ | 1,10 m³ |
| Europalette, 1,50 m Ware | 120 × 80 × 164,4 | 1.578.240 cm³ | 1,58 m³ |
| Industriepalette, 1,20 m Gesamthöhe | 120 × 100 × 120 | 1.440.000 cm³ | 1,44 m³ |

Bei der Palette zählt die **Gesamthöhe inklusive Palette**: Die Europalette ist 144 mm hoch (siehe [Europalette Maße](/ratgeber/europalette-masse/)); 1,00 m Ware ergeben also 1,144 m Gesamthöhe. Wer nur die Warenhöhe nimmt, unterschätzt das Volumen um rund 0,14 m³.

## Rundung: Warum 0,02 nicht 0,024 ist

Der Rechner zeigt Ergebnisse mit zwei Nachkommastellen. Einzelne kleine Packstücke erscheinen deshalb gerundet: Der kleine Karton (0,024 m³) wird als 0,02 angezeigt, der Standardkarton (0,072 m³) als 0,07. Rechnen Sie mehrere Stücke immer **zuerst** zusammen und runden Sie erst das Endergebnis. Das Beispiel zeigt den Fehler: 50 Standardkartons ergeben 50 × 0,072 = 3,6 m³; rechnen Sie dagegen mit dem gerundeten Wert 0,07, erhalten Sie nur 3,5 m³ – ein Unterschied von 0,1 m³ allein durch frühes Runden.

## Runde und unregelmäßige Packstücke

Für die Berechnung werden üblicherweise die **größten Außenmaße** verwendet, also der Quader, der das Packstück umschließt. Das gilt unabhängig davon, wie viel Raum die Ware tatsächlich einnimmt:

- Ein Fass mit 58 cm Durchmesser und 88 cm Höhe: umschließender Quader 58 × 58 × 88 cm = 296.032 cm³ = **rund 0,30 m³**.
- Der Zylinder selbst hätte nur π × 0,29² × 0,88 ≈ 0,23 m³.

Die Differenz liegt in den „Ecken“ des Quaders. Ob der Beförderer die Außenmaße des Quaders oder das tatsächliche Volumen ansetzt, regelt sein Tarif; die Rechner dieser Seite arbeiten mit Quadern.

## Vom CBM zum Volumengewicht

Das Volumengewicht ist ein fiktives Gewicht, das aus dem Volumen abgeleitet wird. Abgerechnet wird häufig das höhere von tatsächlichem Gewicht und Volumengewicht (das „frachtpflichtige Gewicht“). Es gibt zwei übliche Schreibweisen:

- **Divisor:** Volumengewicht (kg) = Länge × Breite × Höhe in cm³ ÷ Divisor
- **Faktor:** Volumengewicht (kg) = Volumen in m³ × Faktor (kg je m³)

Der Rechenkern dieser Seite enthält als Orientierungswerte für Luftfracht den Divisor 6.000 (1 m³ entspricht 166,67 kg) und für Expressdienste den Divisor 5.000 (200 kg je m³); für Seefracht ist der Faktor 1.000 kg je m³ (W/M). Das sind **Orientierungswerte, verbindlich ist der Tarif des Beförderers.**

**Beispiel Standardkarton, 8 kg tatsächlich:**

- Divisor 6.000: 72.000 ÷ 6.000 = **12 kg** Volumengewicht – höher als 8 kg, also zählt das Volumengewicht.
- Divisor 5.000: 72.000 ÷ 5.000 = **14,4 kg**.

**Beispiel Europalette, 1,50 m Ware, 300 kg tatsächlich** (Volumen 1,578 m³):

- Divisor 6.000: 1.578.240 ÷ 6.000 = **263,04 kg** Volumengewicht – das tatsächliche Gewicht von 300 kg ist höher und zählt.
- Faktor 1.000 kg je m³ (Seefracht): 1,578 m³ × 1.000 = **1.578 kg** – hier zählt das Volumen.

Das zeigt, warum dieselbe Palette je nach Beförderungsart nach Gewicht oder nach Volumen abgerechnet werden kann. Mit dem [Volumengewicht-Rechner](/volumengewicht-rechner/) lassen sich diese Rechnungen mit eigenen Maßen und eigenem Divisor nachvollziehen.

## CBM, Lademeter und Palettenstellplätze

CBM und Lademeter beschreiben Verschiedenes: Das Volumen (m³) berücksichtigt die Höhe, die Lademeter (ldm) nur die belegte Bodenfläche. Warum es keinen festen Umrechnungsfaktor gibt, erklärt der Ratgeber [Lademeter oder Kubikmeter](/ratgeber/lademeter-oder-kubikmeter-unterschied/). Wie viele Kartons auf eine Palette passen und wie hoch die Palette dann wird, berechnet der [Kartons-pro-Palette-Rechner](/kartons-pro-palette-rechner/).

## Gemischte Sendung: Gesamt-CBM und Volumengewicht

Eine Sendung besteht aus drei Positionen. Zu jeder Zeile gehört das Volumen je Stück mal Stückzahl:

| Position | Stück | Maße (cm) | Volumen je Stück | Volumen gesamt |
| --- | --- | --- | --- | --- |
| Standardkarton | 20 | 60 × 40 × 30 | 0,072 m³ | 1,440 m³ |
| Kiste | 2 | 150 × 100 × 80 | 1,200 m³ | 2,400 m³ |
| Europalette, 1,00 m Ware | 3 | 120 × 80 × 114,4 | 1,098 m³ | 3,295 m³ |
| **Summe** | | | | **7,135 m³** |

Mit dem angenommenen Faktor 166,67 kg je m³ (Divisor 6.000, Luftfracht) ergibt sich ein Volumengewicht von 7,135 × 166,67 ≈ **1.189 kg**. Wiegt die Sendung tatsächlich weniger, zählt das Volumengewicht; wiegt sie mehr, das tatsächliche Gewicht.

## Umrechnungen im Überblick

| Von | Nach | Faktor |
| --- | --- | --- |
| m³ | Liter | × 1.000 |
| cm³ | m³ | ÷ 1.000.000 |
| m³ | Kubikfuß (cft) | × 35,3147 |
| Kubikfuß | m³ | × 0,0283168 |
| Zoll | cm | × 2,54 |

Bei Maßangaben in Zoll rechnen Sie jedes Maß zuerst in Zentimeter um (× 2,54) und danach wie oben. Ein Karton mit 24 × 16 × 12 Zoll misst 60,96 × 40,64 × 30,48 cm und hat 0,0755 m³.

## Wie viel vom Fahrzeug nimmt das Volumen ein?

Der Rechner dieser Seite nutzt für den Standard-Sattelauflieger Planungsmaße von 13,6 × 2,4 × 2,7 m, das sind rund **88,1 m³**. 33 Europaletten mit je 1,58 m³ (1,50 m Ware) ergeben 33 × 1,578 = **52,1 m³**, also etwa **59 %** des Planungsvolumens. Die Fläche ist mit 33 Paletten dagegen fast voll ausgelastet. Das ist der Grund, warum bei Palettenladungen der Platz am Boden früher knapp wird als das Volumen und warum Lademeter und Kubikmeter nicht ineinander umgerechnet werden können. Die tatsächliche Innenhöhe und Innenbreite weichen je Fahrzeug ab.

## Häufige Fehler beim CBM-Berechnen

- **Einheiten mischen.** 60 cm × 0,4 m × 30 cm führt zu unsinnigen Ergebnissen; alles in einer Einheit erfassen.
- **Durch 1.000 statt 1.000.000 teilen.** Von cm³ zu m³ sind es 1.000.000, von cm³ zu Litern nur 1.000.
- **Palettenhöhe vergessen.** Die 14,4 cm der Palette gehören zur Gesamthöhe.
- **Zu früh runden.** Erst multiplizieren, dann runden (siehe oben).
- **Innenmaße statt Außenmaße.** Maßgeblich ist das fertig verpackte Packstück, nicht die Ware darin.
- **Überstand nicht mitgemessen.** Ragen Ware oder Verpackung über die Palette hinaus, zählt das größte Außenmaß.

## So gehen Sie vor

1. Fertig verpacktes Packstück mit Maßband an den größten Stellen messen (Länge, Breite, Höhe).
2. Alles in Zentimetern notieren, bei Paletten die Palettenhöhe einrechnen.
3. L × B × H in cm³, dann ÷ 1.000.000 in m³.
4. Mit der Stückzahl multiplizieren, erst danach runden.
5. Für die Abrechnung den Divisor oder Faktor des Beförderers erfragen und das Volumengewicht berechnen.

## Hinweis

Die Rechenbeispiele sind mit dem Rechenkern von lademeter-rechner.de nachgerechnet (Stand 24.10.2026). Divisoren und Faktoren sind Orientierungswerte; Tarife, Rundungsregeln und Mindestgewichte legt jeder Beförderer selbst fest.
