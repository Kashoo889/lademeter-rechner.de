import type { VehiclePreset } from "@/lib/calculators/vehicles";

/**
 * Editorial content for the /fahrzeuge/[slug]/ reference pages. All numeric
 * capacities shown on those pages are computed from lib/calculators at build
 * time - the texts below only explain them and must not contradict the
 * engine (see lib/calculators/vehicles.ts for the preset dimensions).
 */
export type VehiclePageContent = {
  slug: string;
  vehicleIds: Exclude<VehiclePreset, "custom">[];
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedArticles: string[];
};

export const VEHICLE_PAGES: VehiclePageContent[] = [
  {
    slug: "sattelzug",
    vehicleIds: ["standard-semi-trailer"],
    name: "Sattelzug (Standard-Sattelauflieger)",
    metaTitle: "Sattelzug Maße & Paletten: 33 Europaletten, 13,6 ldm",
    metaDescription:
      "Sattelzug-Innenmaße, Lademeter und Palettenanzahl: Warum 33 Europaletten der Planungswert sind, wann 34 möglich sind und was bei Nutzlast und Achslast zählt.",
    h1: "Sattelzug: Maße, Lademeter und Palettenanzahl",
    intro: [
      "Der Sattelzug mit Standard-Auflieger ist das Rückgrat des europäischen Straßengüterverkehrs. Seine Ladefläche von rund 13,60 × 2,40 Metern ist zugleich die Bezugsgröße für den Lademeter: Ein voll ausgelasteter Standard-Auflieger entspricht 13,6 Lademetern.",
      "Auf dieser Seite finden Sie die typischen Innenmaße, die rechnerische Palettenkapazität für Europaletten, Industriepaletten und Halbpaletten sowie einen Ladeplan. Alle Kapazitäten werden mit demselben Verfahren berechnet wie im LKW-Palettenrechner.",
    ],
    sections: [
      {
        heading: "Warum 33 Europaletten der Planungswert sind",
        paragraphs: [
          "Werden Europaletten längs geladen, also mit der 1,20 m langen Seite in Fahrtrichtung, passen drei Paletten nebeneinander (3 × 0,80 m = 2,40 m) und 11 Reihen hintereinander (11 × 1,20 m = 13,20 m). Das ergibt rechnerisch 33 Stellplätze und lässt rund 40 cm Restlänge, die das Be- und Entladen sowie die Ladungssicherung erleichtern.",
          "Werden die Paletten quer geladen, passen zwei nebeneinander (2 × 1,20 m) und 17 Reihen hintereinander (17 × 0,80 m = 13,60 m). Das ergibt rechnerisch 34 Stellplätze, allerdings ohne jeden Spielraum. In der Disposition wird deshalb meist mit 33 Europaletten geplant.",
        ],
      },
      {
        heading: "Industriepaletten und gemischte Ladungen",
        paragraphs: [
          "Industriepaletten (1,20 × 1,00 m) passen quer geladen zu zweit nebeneinander in 13 Reihen, also rechnerisch 26 Stück. Bei gemischten Ladungen aus Euro- und Industriepaletten lohnt sich ein Blick auf die Lademeter: Jede Europalette belegt 0,4 ldm, jede Industriepalette 0,5 ldm.",
        ],
        bullets: [
          "Europalette: 0,4 Lademeter je Stellplatz",
          "Industriepalette: 0,5 Lademeter je Stellplatz",
          "Voller Standard-Auflieger: 13,6 Lademeter",
        ],
      },
      {
        heading: "Nutzlast, Gesamtgewicht und Achslasten",
        paragraphs: [
          "Sattelkraftfahrzeuge dürfen im deutschen Straßenverkehr in der Regel ein zulässiges Gesamtgewicht von 40 Tonnen haben. Nach Abzug von Zugmaschine und Auflieger bleibt typischerweise eine Nutzlast von etwa 24 Tonnen, die genaue Zahl steht in den Fahrzeugpapieren.",
          "Schwere Ladung darf nicht nur das Gesamtgewicht einhalten, sondern muss auch so verteilt sein, dass keine Achse überlastet wird. Gerade bei Teilladungen, die nur den vorderen oder hinteren Teil der Ladefläche belegen, ist ein Lastverteilungsplan sinnvoll.",
        ],
      },
      {
        heading: "Typische Einsatzbereiche",
        paragraphs: [
          "Der Standard-Auflieger wird für Komplettladungen, Teilladungen und im Hauptlauf von Stückgutnetzen eingesetzt. Planen- und Schiebeplanenauflieger lassen sich auch von der Seite beladen, Kofferauflieger schützen die Ware besser vor Witterung. Rungen, Bordwände oder Kühlaggregate können die nutzbare Fläche geringfügig verringern.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie viele Lademeter hat ein Sattelzug?",
        answer:
          "Ein Standard-Sattelauflieger hat eine Ladelänge von rund 13,6 Metern bei 2,4 Metern Bezugsbreite und damit 13,6 Lademeter.",
      },
      {
        question: "Passen 33 oder 34 Europaletten in einen Sattelzug?",
        answer:
          "Rechnerisch passen quer geladen 34 Europaletten, allerdings ohne Spielraum. Längs geladen sind es 33, und dieser Wert wird in der Praxis meist zur Planung verwendet.",
      },
      {
        question: "Wie schwer darf die Ladung eines Sattelzugs sein?",
        answer:
          "Bei 40 Tonnen zulässigem Gesamtgewicht bleiben typischerweise rund 24 Tonnen Nutzlast. Maßgeblich ist der Wert in den Fahrzeugpapieren des konkreten Fahrzeugs.",
      },
    ],
    relatedArticles: ["was-sind-lademeter", "achslast-und-gesamtgewicht-lkw", "stueckgut-teilladung-komplettladung"],
  },
  {
    slug: "megatrailer",
    vehicleIds: ["mega-trailer"],
    name: "Megatrailer",
    metaTitle: "Megatrailer Maße: 3 m Innenhöhe, Paletten & Lademeter",
    metaDescription:
      "Megatrailer im Überblick: Innenmaße mit rund 3 m Innenhöhe, Palettenanzahl, Stapeln von Paletten und typische Einsatzbereiche für volumenstarke Ladungen.",
    h1: "Megatrailer: Maße, Paletten und Stapelmöglichkeiten",
    intro: [
      "Der Megatrailer (auch Mega- oder Volumenauflieger) hat dieselbe Ladefläche wie ein Standard-Sattelauflieger, bietet aber eine Innenhöhe von etwa 3 Metern. Möglich wird das durch kleinere Räder und eine tiefer liegende Ladefläche bei gleicher Gesamthöhe des Zuges.",
      "Für die Zahl der Bodenstellplätze ändert sich dadurch nichts: Auch auf dem Megatrailer passen rechnerisch 33 Europaletten längs. Der Vorteil liegt in der Höhe, die das Stapeln leichter, aber volumiger Ware ermöglicht.",
    ],
    sections: [
      {
        heading: "Wann sich ein Megatrailer lohnt",
        paragraphs: [
          "Megatrailer sind vor allem dort gefragt, wo Volumen statt Gewicht die knappe Ressource ist: bei Automobilteilen in Ladungsträgern, Dämmstoffen, Verpackungsmaterial, Möbeln oder leeren Behältern. Mit zwei Lagen Paletten statt einer lässt sich die transportierte Menge pro Fahrt deutlich erhöhen.",
        ],
        bullets: [
          "Gleiche Bodenfläche wie der Standard-Auflieger",
          "Rund 30 cm mehr Innenhöhe für zweilagige Beladung",
          "Besonders sinnvoll bei leichter, stapelbarer Ware",
        ],
      },
      {
        heading: "Stapeln: auf die Höhe der Ladeeinheiten kommt es an",
        paragraphs: [
          "Ob zwei Lagen passen, hängt von der Höhe der beladenen Paletten ab. Bei etwa 3 Metern Innenhöhe sind zwei Paletten mit jeweils knapp 1,50 Metern Gesamthöhe möglich. Ein kleiner Spielraum zum Dach sollte für das Einfahren mit dem Stapler bleiben.",
          "Entscheidend ist außerdem, dass die untere Lage das Gewicht der oberen tragen kann und die Ladung trotz größerer Höhe sicher gesichert wird. Im Palettenrechner können Sie das Stapeln mit Angabe der Ladungshöhe berücksichtigen.",
        ],
      },
      {
        heading: "Einschränkungen in der Praxis",
        paragraphs: [
          "Die tiefer liegende Ladefläche passt nicht an jede Laderampe, an manchen Rampen sind Anpassungen oder Ladebrücken nötig. Die kleineren Räder können zudem den Unterhalt beeinflussen. Für schwere Ware bringt der Megatrailer keinen Vorteil, da die Nutzlast ähnlich wie beim Standard-Auflieger begrenzt ist.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie hoch ist ein Megatrailer innen?",
        answer:
          "Typisch sind rund 3 Meter Innenhöhe. Die genauen Maße unterscheiden sich je nach Hersteller und Aufbau und sollten beim Frachtführer erfragt werden.",
      },
      {
        question: "Passen in einen Megatrailer mehr Paletten als in einen normalen Auflieger?",
        answer:
          "Auf dem Boden nicht: Die Stellplätze entsprechen dem Standard-Auflieger. Mehr Paletten passen nur, wenn die Ware zweilagig gestapelt werden kann.",
      },
      {
        question: "Ändert sich beim Megatrailer die Lademeter-Berechnung?",
        answer:
          "Nein. Der Lademeter bezieht sich auf die Bodenfläche. Gestapelte Paletten belegen nur einen Bodenstellplatz, sofern die Spedition gestapelte Ware so abrechnet.",
      },
    ],
    relatedArticles: ["stapelfaktor-lademeter", "lademeter-oder-kubikmeter-unterschied", "ladungssicherung-lkw-grundlagen"],
  },
  {
    slug: "wechselbruecke",
    vehicleIds: ["swap-body-745", "swap-body-715", "swap-body-782"],
    name: "Wechselbrücke (C 7.15, C 7.45, C 7.82)",
    metaTitle: "Wechselbrücke Maße: C 7.15, C 7.45, C 7.82 & Paletten",
    metaDescription:
      "Wechselbrücken der Klassen C 7.15, C 7.45 und C 7.82 im Vergleich: Innenmaße, Lademeter, Anzahl Europaletten und Einsatz im Stückgut- und Paketverkehr.",
    h1: "Wechselbrücke: Maße der Klassen C 7.15, C 7.45 und C 7.82",
    intro: [
      "Wechselbrücken sind Ladungsträger, die vom LKW abgesetzt und auf Stützbeinen abgestellt werden können. Der Fahrer kann so eine beladene Brücke abstellen und eine andere aufnehmen, ohne auf das Be- oder Entladen zu warten.",
      "Die gängigen Klassen werden nach ihrer Außenlänge benannt: C 7.15, C 7.45 und C 7.82. Die Innenlänge ist jeweils etwas kürzer. Die Tabelle auf dieser Seite zeigt die typischen Innenmaße und die rechnerische Palettenanzahl aller drei Klassen.",
    ],
    sections: [
      {
        heading: "Die drei gängigen Klassen im Vergleich",
        paragraphs: [
          "Die Zahl in der Bezeichnung steht für die Außenlänge in Metern. Mit typischen Innenlängen von etwa 7,00, 7,30 und 7,70 Metern ergeben sich rechnerisch 17, 18 und 19 Europaletten. Bei der längsten Klasse wird der höchste Wert nur mit einer gemischten Anordnung erreicht, bei der einige Reihen längs und einige quer geladen werden.",
        ],
        bullets: [
          "C 7.15: kürzeste Klasse, häufig in älteren Flotten",
          "C 7.45: weit verbreiteter Standard in Systemverkehren",
          "C 7.82: längste Klasse mit dem größten Ladevolumen",
        ],
      },
      {
        heading: "Einsatz im Stückgut- und Paketverkehr",
        paragraphs: [
          "Wechselbrücken sind typisch für Systemverkehre, etwa in Stückgutkooperationen und bei Paket- und Expressdiensten. Ein Motorwagen mit Anhänger kann zwei Brücken gleichzeitig transportieren. Das ermöglicht flexible Umläufe zwischen Depots und Umschlaganlagen.",
          "Für die Planung bedeutet das: Eine Wechselbrücke wird oft als eigenständige Ladeeinheit betrachtet. Wenn Ihre Sendung auf eine Brücke verteilt wird, hilft der Lademeterwert bei der Einschätzung, wie viel der verfügbaren Länge belegt ist.",
        ],
      },
      {
        heading: "Nutzlast hängt vom Trägerfahrzeug ab",
        paragraphs: [
          "Anders als beim Sattelauflieger ist die Nutzlast einer Wechselbrücke keine feste Größe. Sie ergibt sich aus dem zulässigen Gesamtgewicht des Trägerfahrzeugs oder Anhängers abzüglich Eigengewicht. Der hier verwendete Wert ist deshalb nur ein grober Orientierungswert, den Sie im Beladungsrechner durch die tatsächliche Nutzlast ersetzen sollten.",
        ],
      },
    ],
    faqs: [
      {
        question: "Was bedeutet C 7.45 bei einer Wechselbrücke?",
        answer:
          "Der Buchstabe C steht für die Bauart, die Zahl für die Außenlänge von etwa 7,45 Metern. Die Innenlänge liegt typischerweise bei rund 7,30 Metern.",
      },
      {
        question: "Wie viele Europaletten passen auf eine Wechselbrücke?",
        answer:
          "Rechnerisch sind es je nach Klasse 17 (C 7.15), 18 (C 7.45) oder 19 (C 7.82) Europaletten. Prüfen Sie die tatsächlichen Innenmaße, da sie je nach Hersteller abweichen.",
      },
      {
        question: "Wie berechne ich Lademeter auf einer Wechselbrücke?",
        answer:
          "Wie bei jedem Fahrzeug: Länge mal Breite der Ladung geteilt durch 2,4 Meter. Eine Europalette entspricht 0,4 Lademetern, unabhängig vom Fahrzeug.",
      },
    ],
    relatedArticles: ["stueckgut-teilladung-komplettladung", "was-sind-lademeter", "europaletten-und-palettenarten"],
  },
  {
    slug: "12-tonner",
    vehicleIds: ["truck-12t"],
    name: "12-Tonner (Koffer oder Plane)",
    metaTitle: "12-Tonner LKW: Ladefläche, Nutzlast & Europaletten",
    metaDescription:
      "12-Tonner im Überblick: typische Ladefläche um 7,20 × 2,45 m, Nutzlast, Anzahl Europaletten und wann sich der Mittelklasse-LKW für Ihre Sendung lohnt.",
    h1: "12-Tonner: Ladefläche, Nutzlast und Paletten",
    intro: [
      "Der 12-Tonner schließt die Lücke zwischen dem 7,5-Tonner und dem Sattelzug. Mit einer typischen Ladefläche von etwa 7,20 × 2,45 Metern bietet er deutlich mehr Platz und Nutzlast als die kleinere Klasse, bleibt aber wendig genug für den innerstädtischen Verteilerverkehr.",
      "Wie viel Ladung tatsächlich passt, hängt stark vom Aufbau ab. Die hier verwendeten Maße sind typische Richtwerte. Für eine verbindliche Planung sollten Sie die Innenmaße des konkreten Fahrzeugs im Rechner eintragen.",
    ],
    sections: [
      {
        heading: "Paletten auf dem 12-Tonner",
        paragraphs: [
          "Bei einer Ladelänge von rund 7,20 Metern passen Europaletten längs in sechs Reihen zu je drei Stück, also rechnerisch 18 Paletten. Quer geladen ergibt sich mit neun Reihen zu je zwei Stück derselbe Wert. Welche Anordnung besser ist, hängt von der Ladungssicherung und der Entladereihenfolge ab.",
        ],
      },
      {
        heading: "Nutzlast und Führerschein",
        paragraphs: [
          "Bei 12 Tonnen zulässigem Gesamtgewicht bleibt je nach Aufbau, Ladebordwand und Ausstattung typischerweise eine Nutzlast im Bereich von etwa 5 Tonnen. Eine Ladebordwand kann mehrere hundert Kilogramm wiegen und die Nutzlast spürbar reduzieren.",
          "Für Fahrzeuge über 7,5 Tonnen zulässigem Gesamtgewicht ist die Führerscheinklasse C erforderlich. Das ist bei der Disposition und Fahrerplanung zu berücksichtigen.",
        ],
        bullets: [
          "Ladebordwand verringert die Nutzlast",
          "Kofferaufbauten sind schwerer als Planenaufbauten",
          "Maßgeblich ist immer der Wert in den Fahrzeugpapieren",
        ],
      },
      {
        heading: "Typische Einsatzbereiche",
        paragraphs: [
          "12-Tonner werden häufig im regionalen Verteilerverkehr, in der Getränke- und Lebensmittellogistik sowie für Teilladungen eingesetzt, die für einen 7,5-Tonner zu groß und für einen Sattelzug zu klein sind. Im Lademeter ausgedrückt bietet die Ladefläche rechnerisch gut 7 Lademeter.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie viele Europaletten passen in einen 12-Tonner?",
        answer:
          "Bei einer typischen Ladefläche von 7,20 × 2,45 Metern sind es rechnerisch 18 Europaletten. Abweichende Aufbauten können mehr oder weniger Platz bieten.",
      },
      {
        question: "Wie viel darf ein 12-Tonner laden?",
        answer:
          "Typisch sind etwa 5 Tonnen Nutzlast, abhängig von Aufbau und Ausstattung. Verbindlich ist der Wert in den Fahrzeugpapieren.",
      },
      {
        question: "Welchen Führerschein brauche ich für einen 12-Tonner?",
        answer:
          "Für Fahrzeuge mit mehr als 7,5 Tonnen zulässigem Gesamtgewicht ist die Führerscheinklasse C erforderlich.",
      },
    ],
    relatedArticles: ["achslast-und-gesamtgewicht-lkw", "lkw-beladung-richtig-planen", "stueckgut-teilladung-komplettladung"],
  },
  {
    slug: "7-5-tonner",
    vehicleIds: ["solo-truck"],
    name: "7,5-Tonner (Koffer oder Plane)",
    metaTitle: "7,5-Tonner Ladefläche: Maße, Nutzlast & Paletten",
    metaDescription:
      "Wie viele Paletten passen in einen 7,5-Tonner? Typische Ladefläche, Nutzlast von oft nur rund 2,5 t, Führerscheinklasse C1 und Tipps zur Planung.",
    h1: "7,5-Tonner: Ladefläche, Nutzlast und Paletten",
    intro: [
      "Der 7,5-Tonner ist im Verteilerverkehr, bei Umzügen und im Handwerk weit verbreitet. Er darf mit der Führerscheinklasse C1 gefahren werden und ist damit für viele Unternehmen flexibel einsetzbar.",
      "Die typische Ladefläche liegt bei etwa 6,00 × 2,40 Metern. Die Maße schwanken allerdings stark je nach Fahrgestell und Aufbau. Nutzen Sie die Werte auf dieser Seite deshalb als Orientierung und tragen Sie für eine genaue Planung die Innenmaße Ihres Fahrzeugs ein.",
    ],
    sections: [
      {
        heading: "Paletten auf dem 7,5-Tonner",
        paragraphs: [
          "Auf einer Ladelänge von 6,00 Metern passen Europaletten längs in fünf Reihen zu je drei Stück, rechnerisch also 15 Paletten. Ist der Aufbau etwas kürzer oder schmaler, sinkt die Zahl schnell. Schon wenige Zentimeter Innenbreite unter 2,40 Metern verhindern drei Paletten nebeneinander.",
        ],
      },
      {
        heading: "Die Nutzlast ist oft der Engpass",
        paragraphs: [
          "Beim 7,5-Tonner wird häufig das Gewicht vor dem Platz knapp. Nach Abzug von Fahrgestell, Aufbau und gegebenenfalls Ladebordwand bleiben oft nur rund 2,5 Tonnen Nutzlast, bei leichten Ausführungen etwas mehr. Bei 15 Paletten entspricht das im Schnitt weniger als 200 Kilogramm pro Palette.",
          "Prüfen Sie deshalb immer beide Grenzen: Passen die Paletten auf die Fläche, und bleibt das Gesamtgewicht unter der Nutzlast? Der LKW-Beladungsrechner zeigt Fläche, Gewicht und Volumen gemeinsam an.",
        ],
        bullets: [
          "Zulässiges Gesamtgewicht in dieser Klasse: bis 7,5 Tonnen",
          "Führerscheinklasse C1 ausreichend",
          "Überladung ist ein häufiges Risiko bei schwerer Ware",
        ],
      },
      {
        heading: "Typische Einsätze",
        paragraphs: [
          "7,5-Tonner werden für Auslieferungen an Handel und Baustellen, Umzüge, Messe- und Eventlogistik sowie als Zubringer in Stückgutnetzen eingesetzt. In engen Innenstädten ist das Fahrzeug oft die größte noch praktikable Klasse.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie viele Europaletten passen in einen 7,5-Tonner?",
        answer:
          "Bei einer Ladefläche von 6,00 × 2,40 Metern sind es rechnerisch 15 Europaletten. Kürzere oder schmalere Aufbauten bieten entsprechend weniger Stellplätze.",
      },
      {
        question: "Wie viel Nutzlast hat ein 7,5-Tonner?",
        answer:
          "Typisch sind rund 2,5 Tonnen, je nach Aufbau und Ausstattung auch mehr oder weniger. Verbindlich ist der Wert in den Fahrzeugpapieren.",
      },
      {
        question: "Wie viele Lademeter hat ein 7,5-Tonner?",
        answer:
          "Bei 6 Metern Ladelänge und 2,4 Metern Breite sind es 6 Lademeter. Bei abweichenden Maßen berechnen Sie die Fläche geteilt durch 2,4 Meter.",
      },
    ],
    relatedArticles: ["achslast-und-gesamtgewicht-lkw", "lkw-beladung-richtig-planen", "was-sind-lademeter"],
  },
  {
    slug: "transporter-3-5-t",
    vehicleIds: ["van-3-5t"],
    name: "3,5-t-Transporter mit Kofferaufbau",
    metaTitle: "3,5-t-Transporter mit Koffer: Maße, Nutzlast & Paletten",
    metaDescription:
      "3,5-Tonner mit Kofferaufbau: typische Innenmaße, Nutzlast um 1 t, Palettenkapazität und worauf Sie bei Transportern mit Führerschein Klasse B achten müssen.",
    h1: "3,5-t-Transporter mit Kofferaufbau: Maße und Paletten",
    intro: [
      "Transporter bis 3,5 Tonnen zulässigem Gesamtgewicht dürfen mit dem Pkw-Führerschein der Klasse B gefahren werden. Mit Kofferaufbau bieten sie eine rechteckige, gut nutzbare Ladefläche und eignen sich für Kurierfahrten, Expresssendungen und kleinere Auslieferungen.",
      "Diese Seite bezieht sich auf Transporter mit Kofferaufbau und typischen Innenmaßen von etwa 4,20 × 2,10 Metern. Kastenwagen ohne Kofferaufbau haben eine andere Geometrie und werden hier bewusst nicht betrachtet.",
    ],
    sections: [
      {
        heading: "Koffer oder Kastenwagen: ein wichtiger Unterschied",
        paragraphs: [
          "Beim Kastenwagen ragen die Radkästen in den Laderaum. Die nutzbare Breite zwischen den Radkästen ist deutlich geringer als die Gesamtbreite, sodass oft nur eine Palette nebeneinander passt. Ein Kofferaufbau sitzt dagegen über den Rädern und bietet eine ebene, rechteckige Fläche.",
          "Für Kastenwagen sollten Sie im Rechner deshalb nicht die Gesamtbreite, sondern die Breite zwischen den Radkästen als Innenbreite eintragen, um realistische Werte zu erhalten.",
        ],
      },
      {
        heading: "Nutzlast ist sehr begrenzt",
        paragraphs: [
          "Der Kofferaufbau ist schwerer als die Karosserie eines Kastenwagens. Bei 3,5 Tonnen zulässigem Gesamtgewicht bleibt daher häufig nur eine Nutzlast um 1 Tonne, teilweise weniger. Schon wenige schwere Paletten können diese Grenze erreichen.",
          "Gerade bei Transportern werden Überladungen häufig unterschätzt. Wiegen Sie im Zweifel die Ware und tragen Sie das Gewicht im Beladungsrechner ein.",
        ],
        bullets: [
          "Führerscheinklasse B bis 3,5 Tonnen zulässigem Gesamtgewicht",
          "Typische Nutzlast mit Koffer: etwa 1 Tonne",
          "Ladebordwand reduziert die Nutzlast weiter",
        ],
      },
      {
        heading: "Paletten und Lademeter",
        paragraphs: [
          "Wie viele Paletten auf einen Transporter passen, hängt von Länge und Breite des Koffers ab. Die rechnerische Kapazität für Euro-, Industrie- und Halbpaletten finden Sie in der Tabelle auf dieser Seite. Für ein abweichendes Fahrzeug tragen Sie die Innenmaße im LKW-Palettenrechner ein.",
          "Auch bei Transportern wird gelegentlich in Lademetern gerechnet, etwa wenn eine Teilsendung auf ein größeres Fahrzeug umgeladen wird. Die Formel bleibt gleich: Länge mal Breite der Ladung geteilt durch 2,4 Meter.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie viel darf ein 3,5-Tonner mit Koffer laden?",
        answer:
          "Typisch ist eine Nutzlast um 1 Tonne, je nach Aufbau auch weniger. Maßgeblich ist der Wert in den Fahrzeugpapieren.",
      },
      {
        question: "Warum passen in einen Kastenwagen weniger Paletten als in einen Koffer?",
        answer:
          "Beim Kastenwagen ragen die Radkästen in den Laderaum und verringern die nutzbare Breite. Ein Kofferaufbau bietet eine ebene, rechteckige Ladefläche.",
      },
      {
        question: "Welcher Führerschein reicht für einen 3,5-Tonner?",
        answer:
          "Für Fahrzeuge bis 3,5 Tonnen zulässigem Gesamtgewicht genügt die Führerscheinklasse B.",
      },
    ],
    relatedArticles: ["europaletten-und-palettenarten", "kartons-pro-palette-berechnen"],
  },
  {
    slug: "container-20-fuss",
    vehicleIds: ["container-20"],
    name: "20-Fuß-Container",
    metaTitle: "20-Fuß-Container: Innenmaße & 11 Europaletten",
    metaDescription:
      "20-Fuß-Container Innenmaße, Volumen und Palettenanzahl: Warum 11 Europaletten passen, worauf Sie bei Türöffnung und Gewicht achten und wie Sie planen.",
    h1: "20-Fuß-Container: Innenmaße und Palettenanzahl",
    intro: [
      "Der 20-Fuß-Container ist die Grundeinheit des weltweiten Containerverkehrs; Umschlagmengen werden in TEU (Twenty-foot Equivalent Unit) angegeben. Für Verlader ist vor allem interessant, wie viel Ware tatsächlich in den Container passt.",
      "Mit gängigen Innenmaßen von etwa 5,89 × 2,35 × 2,39 Metern bietet ein Standard-Container rund 33 Kubikmeter Laderaum. Weil die Innenbreite nicht zu den Palettenmaßen passt, lohnt sich ein genauer Blick auf die Anordnung.",
    ],
    sections: [
      {
        heading: "Warum 11 Europaletten passen",
        paragraphs: [
          "Mit 2,35 Metern Innenbreite passen weder drei Europaletten längs (2,40 m) noch zwei quer (2,40 m) nebeneinander. Die beste Lösung ist eine gemischte Anordnung: Eine Spur mit längs geladenen Paletten (0,80 m breit) und daneben eine Spur mit quer geladenen Paletten (1,20 m breit) ergeben zusammen 2,00 Meter Breite.",
          "In der Längsspur passen vier Paletten (4 × 1,20 m), in der Querspur sieben (7 × 0,80 m). So kommen Sie rechnerisch auf 11 Europaletten. Der Ladeplan auf dieser Seite zeigt diese Anordnung.",
        ],
      },
      {
        heading: "Türöffnung und Beladung",
        paragraphs: [
          "Die Türöffnung eines Containers ist etwas kleiner als der Innenraum. Hohe oder breite Ladeeinheiten sollten deshalb nicht nur gegen die Innenmaße, sondern auch gegen die Türöffnung geprüft werden. Beladen wird meist mit Gabelstapler oder Hubwagen von hinten, eine seitliche Beladung ist bei Standard-Containern nicht möglich.",
        ],
      },
      {
        heading: "Gewicht im Straßentransport",
        paragraphs: [
          "Container selbst sind für hohe Gewichte ausgelegt. Im Vor- und Nachlauf auf der Straße begrenzt jedoch das zulässige Gesamtgewicht von Zugmaschine, Chassis und Container die mögliche Zuladung. Der hier verwendete Nutzlastwert ist deshalb ein Orientierungswert für den Straßentransport, kein Containerwert.",
          "Schwere Güter wie Metallteile, Fliesen oder Getränke füllen einen 20-Fuß-Container oft gewichtsmäßig, bevor der Raum ausgenutzt ist. Leichte Ware spricht eher für einen 40-Fuß-Container.",
        ],
        bullets: [
          "Rund 33 m³ Laderaum",
          "Gemischte Anordnung für maximale Palettenzahl",
          "Straßengewicht im Vor- und Nachlauf beachten",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie viele Europaletten passen in einen 20-Fuß-Container?",
        answer:
          "Rechnerisch 11 Europaletten in einer gemischten Anordnung aus einer Längs- und einer Querspur. Bei einheitlicher Ausrichtung sind es weniger.",
      },
      {
        question: "Wie groß ist ein 20-Fuß-Container innen?",
        answer:
          "Gängig sind etwa 5,89 × 2,35 × 2,39 Meter. Die genauen Maße weichen je nach Hersteller leicht ab.",
      },
      {
        question: "Rechnet man bei Containern in Lademetern?",
        answer:
          "Im Seeverkehr wird meist in Containern oder Kubikmetern gerechnet. Im Straßentransport des Containers kann der Lademeter dennoch zur Einordnung der belegten Fläche dienen.",
      },
    ],
    relatedArticles: ["lademeter-oder-kubikmeter-unterschied", "europaletten-und-palettenarten", "kartons-pro-palette-berechnen"],
  },
  {
    slug: "container-40-fuss",
    vehicleIds: ["container-40", "container-40hc"],
    name: "40-Fuß-Container (Standard und High Cube)",
    metaTitle: "40-Fuß-Container & High Cube: Innenmaße, 25 Europaletten",
    metaDescription:
      "40-Fuß-Container und 40' High Cube im Vergleich: Innenmaße, Volumen, Anzahl Europaletten in gemischter Anordnung und Hinweise zu Gewicht und Beladung.",
    h1: "40-Fuß-Container und High Cube: Maße und Paletten",
    intro: [
      "Der 40-Fuß-Container bietet doppelt so viel Länge wie der 20-Fuß-Container und ist besonders für leichtere, volumenstarke Güter beliebt. Die High-Cube-Variante ist rund 30 Zentimeter höher und schafft zusätzlichen Raum für hohe Ladeeinheiten.",
      "Mit einer Innenlänge von etwa 12,03 Metern und einer Innenbreite von rund 2,35 Metern gelten dieselben Besonderheiten wie beim 20-Fuß-Container: Für die maximale Palettenzahl ist eine gemischte Anordnung nötig.",
    ],
    sections: [
      {
        heading: "Rechnerisch 25 Europaletten",
        paragraphs: [
          "Auch im 40-Fuß-Container passen weder drei Europaletten längs noch zwei quer nebeneinander. Kombiniert man eine Längsspur mit zehn Paletten (10 × 1,20 m) und eine Querspur mit fünfzehn Paletten (15 × 0,80 m), ergeben sich rechnerisch 25 Europaletten.",
          "In der Praxis wird je nach Ware und Sicherung teilweise mit etwas weniger Paletten geplant, um Lücken für Stausäcke oder Sperrbalken zu lassen.",
        ],
      },
      {
        heading: "Standard oder High Cube?",
        paragraphs: [
          "Die Grundfläche beider Varianten ist gleich, der Unterschied liegt in der Höhe: etwa 2,39 Meter beim Standard-Container gegenüber rund 2,69 Meter beim High Cube. Für zweilagig gestapelte Paletten oder hohe Maschinen kann diese zusätzliche Höhe entscheidend sein.",
        ],
        bullets: [
          "Standard: rund 67 m³ Laderaum",
          "High Cube: rund 76 m³ Laderaum",
          "Gleiche Bodenfläche und Palettenzahl auf dem Boden",
        ],
      },
      {
        heading: "Gewicht und Vor- und Nachlauf",
        paragraphs: [
          "Wie beim 20-Fuß-Container begrenzt im Straßentransport das zulässige Gesamtgewicht des Fahrzeugs die Zuladung. Der verwendete Nutzlastwert ist ein grober Orientierungswert. Prüfen Sie bei schwerer Ware frühzeitig mit dem Spediteur, welches Gewicht im Vor- und Nachlauf möglich ist.",
          "Zum Vergleich: Ein Standard-Sattelauflieger hat mit 13,60 Metern eine etwas längere und mit 2,40 Metern eine etwas breitere Ladefläche als der 40-Fuß-Container. Deshalb passen auf den Auflieger mehr Europaletten.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie viele Europaletten passen in einen 40-Fuß-Container?",
        answer:
          "Rechnerisch 25 Europaletten in einer gemischten Anordnung aus einer Längs- und einer Querspur.",
      },
      {
        question: "Was ist der Unterschied zwischen 40' und 40' High Cube?",
        answer:
          "Der High Cube ist innen rund 30 Zentimeter höher. Grundfläche und Palettenzahl auf dem Boden sind gleich.",
      },
      {
        question: "Passen in einen 40-Fuß-Container mehr Paletten als in einen Sattelzug?",
        answer:
          "Nein. Der Standard-Sattelauflieger ist etwas länger und breiter und bietet deshalb rechnerisch mehr Stellplätze für Europaletten.",
      },
    ],
    relatedArticles: ["lademeter-oder-kubikmeter-unterschied", "stapelfaktor-lademeter", "ladungssicherung-lkw-grundlagen"],
  },
];

export function getVehiclePage(slug: string): VehiclePageContent | undefined {
  return VEHICLE_PAGES.find((page) => page.slug === slug);
}
