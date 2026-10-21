---
title: "Lademeter bei nicht stapelbarer Ware: 6 Rechenfälle"
description: "Lademeter berechnen, wenn Ware nicht stapelbar ist: Formel, sechs durchgerechnete Fälle (Maschine, Kisten, Überhöhe, Rohre) und die Grenzen der Faustformel."
slug: "lademeter-berechnen-nicht-stapelbar"
publishedAt: "2026-10-21"
updatedAt: "2026-10-21"
category: "Grundlagen"
tags: ["lademeter", "nicht stapelbar", "berechnen", "sperrgut", "ladeplanung"]
cluster: "lademeter"
relatedTool: "lademeter-rechner"
faq:
  - question: "Wie berechnet man Lademeter bei nicht stapelbarer Ware?"
    answer: "Jedes Packstück belegt einen eigenen Stellplatz am Boden. Die Lademeter ergeben sich aus Länge × Breite ÷ 2,4 m je Packstück, multipliziert mit der Stückzahl. Eine Stapellage gibt es nicht, der Stapelfaktor ist 1."
  - question: "Wie viele Lademeter belegt eine Maschine mit 3,20 m × 1,50 m?"
    answer: "Rechnerisch 3,20 m × 1,50 m ÷ 2,4 m = 2,0 Lademeter. Das ist eine reine Flächenrechnung; wie viel Ladefläche daneben tatsächlich nutzbar bleibt, hängt von der restlichen Breite und der anderen Fracht ab."
  - question: "Ändert die Höhe der Ware die Lademeter?"
    answer: "Nein. Die Höhe fließt in die Lademeter nicht ein. Sie entscheidet aber, ob die Ware überhaupt ins Fahrzeug passt und ob Stapeln möglich ist. Bei sehr hoher Ware kann deshalb ein höheres Fahrzeug nötig sein, ohne dass sich die Lademeter ändern."
  - question: "Warum weicht die Abrechnung der Spedition manchmal vom Rechner ab?"
    answer: "Der Rechner liefert den exakten Flächenwert. Speditionen können laut Hinweis des Rechners auf 0,1 oder ganze Lademeter aufrunden und legen eigene Umrechnungsfaktoren in Kilogramm je Lademeter fest. Maßgeblich sind die Bedingungen und Preislisten der Spedition."
sources:
  - title: "Methodik der Lademeter-Berechnung (lademeter-rechner.de)"
    url: "https://lademeter-rechner.de/methodik/"
  - title: "Rechenkern Lademeter (lademeter-rechner.de, nachgerechnet mit dem Rechner)"
    url: "https://lademeter-rechner.de/"
---

Nicht stapelbare Ware ist der einfachste Fall der Lademeter-Berechnung und gleichzeitig der, bei dem die Faustformel am häufigsten an ihre Grenzen stößt. Die Formel ist kurz: **Länge × Breite ÷ 2,4 m, mal Stückzahl.** Dieser Ratgeber rechnet sechs Fälle mit dem Rechenkern dieser Seite durch (Maschine, Kisten, überhohe Paletten, Mischladung, lange Ware, sehr breite Ware) und zeigt, wo die Zahl allein nicht mehr ausreicht. Alle Ergebnisse lassen sich im [Lademeter-Rechner](/) mit denselben Eingaben nachvollziehen.

## Die Regel für nicht stapelbare Ware

Bei stapelbarer Ware zählt die Zahl der **Bodenstellplätze**: Zwei Lagen halbieren sie. Bei nicht stapelbarer Ware gibt es nur eine Lage, also ist jedes Packstück ein eigener Stellplatz:

**Lademeter = Länge (m) × Breite (m) ÷ 2,4 × Stückzahl**

Die 2,4 m sind die Referenzbreite des Laderaums eines europäischen Sattelzugs; die Methodik steht auf der Seite [Methodik](/methodik/). Der Rechner rundet nicht zwischendurch, sondern erst das Endergebnis auf zwei Nachkommastellen.

Wie groß der Unterschied zur stapelbaren Ware ist, zeigt ein Vergleich mit derselben Ladung: **11 Europaletten** (je 1,20 m × 0,80 m, 0,4 ldm) belegen

- **zweilagig** 6 Stellplätze, also 2,4 ldm (11 ÷ 2 = 5,5, aufgerundet auf 6);
- **nicht stapelbar** 11 Stellplätze, also 4,4 ldm.

Die Voraussetzungen und Grenzen des Stapelns erklärt der Ratgeber [Stapelfaktor bei Lademetern](/ratgeber/stapelfaktor-lademeter/). Wenn Sie nicht sicher sind, ob die Ware tragen kann, rechnen Sie mit dem Faktor 1, also nicht stapelbar: Das ist die vorsichtige Annahme, und das Ergebnis liegt eher über als unter dem tatsächlichen Platzbedarf.

## Fall 1: Maschine, 3,20 m × 1,50 m

Eine Maschine (Länge 320 cm, Breite 150 cm, Höhe 180 cm, 2.400 kg) steht als ein Packstück im Fahrzeug.

- 3,20 m × 1,50 m = 4,8 m²
- 4,8 m² ÷ 2,4 m = **2,0 Lademeter**

Wird mit einem Umrechnungsfaktor von 1.850 kg je Lademeter gerechnet (ein Beispielwert; in der Praxis liegen die Faktoren laut der Seite [Methodik](/methodik/) meist zwischen 1.500 und 2.000 kg), ergibt sich ein Lademetergewicht von 3.700 kg. Das ist mehr als das tatsächliche Gewicht von 2.400 kg, abgerechnet würde das höhere. Der Faktor ist eine Tarifvereinbarung der Spedition, keine Norm. Mehr dazu im Ratgeber [Lademeter in kg umrechnen](/ratgeber/lademeter-in-kg-umrechnen/).

## Fall 2: Acht Holzkisten, je 1,10 m × 0,70 m

Acht nicht stapelbare Kisten (110 × 70 cm, je 150 kg):

- Fläche je Kiste: 1,10 m × 0,70 m = 0,77 m²
- Lademeter je Kiste: 0,77 ÷ 2,4 = 0,3208 ldm
- Acht Kisten: 8 × 0,3208 = **2,57 Lademeter** (2,5667 gerundet)

Rechnet man die Kiste zuerst auf 0,32 ldm und multipliziert dann, kommt man auf 2,56. Der Unterschied entsteht durch frühes Runden – ein typischer Fehler in Tabellenkalkulationen. Der Rechner rundet erst am Ende.

## Fall 3: Überhohe Paletten

Sechs Paletten (120 × 80 cm, 2,80 m hoch, je 300 kg), nicht stapelbar:

- 6 × 0,4 = **2,4 Lademeter**

Die Höhe verändert die Lademeter nicht. Sie entscheidet aber, ob die Ware in das Fahrzeug passt. Als Planungswerte nutzt der Palettenrechner dieser Seite für den Standard-Sattelauflieger eine Innenhöhe von 2,70 m, für den Megatrailer 3,00 m. 2,80 m hohe Paletten passen damit nach diesen Planungswerten nicht in den Standard-Auflieger, wohl aber in einen Megatrailer. Die tatsächliche Innenhöhe weicht je Fahrzeug ab und muss im Einzelfall geprüft werden; das kann den Fahrzeugtyp und damit den Preis ändern, ohne dass sich die Lademeter ändern.

## Fall 4: Mischladung

Vier Europaletten (120 × 80 cm), zwei Industriepaletten (120 × 100 cm) und eine Maschine (200 × 100 cm), alle nicht stapelbar:

| Position | Rechnung | Lademeter |
| --- | --- | --- |
| 4 Europaletten | 4 × (1,2 × 0,8 ÷ 2,4) | 1,60 |
| 2 Industriepaletten | 2 × (1,2 × 1,0 ÷ 2,4) | 1,00 |
| 1 Maschine | 1 × (2,0 × 1,0 ÷ 2,4) | 0,83 |
| **Summe** | | **3,43** |

Der Rechner summiert die Lademeter der einzelnen Positionen, wie es der Branchenkonvention entspricht. Er sucht keine optimale Anordnung – ob sich Teile ineinander schieben lassen, bleibt dabei unberücksichtigt. Das Ergebnis ist daher eine Planungsgröße und kein Ladeplan.

## Fall 5: Lange Ware, Rohrbündel 6 m × 0,60 m

Zehn Rohrbündel, je 600 cm lang und 60 cm breit (nicht stapelbar im Beispiel):

- Fläche je Bündel: 6,0 m × 0,6 m = 3,6 m²
- Lademeter je Bündel: 3,6 ÷ 2,4 = 1,5
- Zehn Bündel: **15,0 Lademeter**

Das sind **110,29 %** eines Sattelzugs mit 13,6 Lademetern. Die Ladung passt also nicht in einen einzelnen Standard-Sattelzug, auch wenn jedes einzelne Bündel kurz genug ist. Der Anteil am Sattelzug ist ein einfacher Plausibilitätscheck, den man bei jeder größeren Sendung durchführen sollte: Liegt er über 100 %, ist ein zweites Fahrzeug nötig oder die Ware muss gestapelt werden.

## Fall 6: Sehr breite Ware, 3,00 m × 1,65 m

Eine Maschine mit 300 cm Länge und 165 cm Breite:

- 3,0 m × 1,65 m ÷ 2,4 m = **2,06 Lademeter** (2,0625 gerundet)

Hier zeigt sich die Grenze der Formel. Die Ladefläche ist 2,4 m breit, neben der Maschine bleiben 2,4 m − 1,65 m = **0,75 m**. Eine Europalette ist mindestens 0,80 m breit; sie passt in diesen Streifen nicht. Ein Streifen von 3 m Länge und 0,75 m Breite ist praktisch nicht belegbar, es sei denn mit sehr schmaler Ware. Die Formel rechnet nur mit der Fläche der Maschine (2,06 ldm), tatsächlich versperrt sie aber 3,0 m Ladelänge. Ob und wie eine Spedition solche Fälle abweichend berechnet, steht in deren Bedingungen und lässt sich nur dort erfragen. Rechnen Sie in diesem Fall beide Varianten durch und fragen Sie vor der Buchung nach.

## Grenzen der Faustformel – auf einen Blick

| Situation | Was die Formel zeigt | Was sie nicht zeigt |
| --- | --- | --- |
| Hohe Ware | gleiche Lademeter wie niedrige | ob das Fahrzeug hoch genug ist |
| Breite über 1,60 m | nur die eigene Fläche | ob der Restraum nutzbar bleibt |
| Mischladung | Summe der Einzelwerte | die tatsächliche Anordnung |
| Viele Positionen | exakte Zwischenergebnisse | die Rundung der Spedition |
| Schwere Ware | Lademeter | ob das Gewicht die Grenze ist |

Zwei Punkte aus der Tabelle verdienen eine eigene Prüfung. Erstens: **Gewicht.** Bei schwerer Ware kann das Lademetergewicht oder das tatsächliche Gewicht die abrechnungsrelevante Größe sein, nicht die Fläche. Das Beispiel der Maschine in Fall 1 zeigt es. Zweitens: **Rundung.** Der Rechner weist ausdrücklich darauf hin, dass einzelne Speditionen auf 0,1 oder auf ganze Lademeter aufrunden; der exakte Wert des Rechners ist daher meist eine Untergrenze der Abrechnung.

## Häufige Fehler bei nicht stapelbarer Ware

- **Maße mit Verpackung vergessen.** Maßgeblich sind die Außenmaße des Packstücks einschließlich Kufen, Kantenschutz und Umreifung, nicht die Maße des Produkts.
- **Einheiten mischen.** 120 cm und 0,8 m in einer Rechnung führen zu falschen Ergebnissen; erfassen Sie alles in derselben Einheit.
- **Zu früh runden.** Zwischenwerte wie 0,32 ldm verfälschen bei vielen Stücken das Ergebnis (Fall 2).
- **Stapelbarkeit annehmen, ohne sie zu kennen.** Im Zweifel mit Faktor 1 rechnen und die Stapelbarkeit beim Versender erfragen.
- **Nur die Lademeter prüfen.** Gewicht, Höhe und Restbreite gehören zur Plausibilitätsprüfung.

## So gehen Sie vor

1. Maße je Packstück in einer Einheit erfassen (Zentimeter oder Meter, nicht mischen).
2. Stückzahl und Gewicht je Position ergänzen.
3. Im [Lademeter-Rechner](/) als „nicht stapelbar“ (Faktor 1) eintragen.
4. Anteil am Sattelzug prüfen: über 100 % bedeutet mehr als ein Fahrzeug.
5. Höhe gegen die Innenhöhe des Fahrzeugs prüfen, Breite gegen den Restraum.
6. Bei Sonderfällen (sehr breit, sehr lang, sehr schwer) die Berechnung der Spedition vor der Buchung erfragen.

Für Standardpaletten liefert die [Lademeter-Tabelle](/lademeter-tabelle/) die Werte ohne Rechnung.

## Hinweis

Alle Ergebnisse stammen aus dem Rechenkern von lademeter-rechner.de (Stand 21.10.2026); sie geben die rechnerische Fläche wieder und ersetzen weder den Ladeplan noch die Preisliste der Spedition. Umrechnungsfaktoren, Rundung und Sonderregeln legt jede Spedition selbst fest.
