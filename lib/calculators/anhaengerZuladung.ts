/**
 * Anhänger- und Zuladungsrechner (Pkw/Transporter bis 3,5 t mit Anhänger bis 3,5 t zulässiger Gesamtmasse).
 *
 * Alle Angaben in Kilogramm. Rechenregeln und ihre Fundstellen (gelesen auf gesetze-im-internet.de und im
 * Leitfaden des Kraftfahrt-Bundesamts zur Zulassungsbescheinigung, Stand Juli 2026):
 *
 * - § 34 Abs. 3 StVZO: zulässige Achslast und zulässiges Gesamtgewicht sind im Betrieb einzuhalten.
 * - § 42 Abs. 1 Nr. 1 StVZO: Die gezogene Anhängelast darf bei Pkw (ausgenommen Geländefahrzeuge) und Lkw
 *   (ausgenommen Nr. 3) weder das zulässige Gesamtgewicht des ziehenden Fahrzeugs noch den vom Hersteller
 *   angegebenen oder amtlich als zulässig erklärten Wert übersteigen. Achslast plus Stützlast des Anhängers
 *   (Pkw) dürfen nie 3.500 kg überschreiten.
 * - § 42 Abs. 2 StVZO: Ungebremste Anhänger hinter Pkw nur einachsig und bei Allradbremse am Zugfahrzeug;
 *   Anhängelast höchstens die Hälfte des um 75 kg erhöhten Leergewichts des Zugfahrzeugs, nicht mehr als 750 kg.
 * - § 42 Abs. 3 StVZO: Leergewicht = betriebsfertig, Kraftstoff zu 90 %, bei Kfz zuzüglich 75 kg Fahrer.
 * - § 44 Abs. 3 StVZO: Stützlast mindestens 4 % des tatsächlichen Anhängergesamtgewichts, aber nicht mehr als
 *   25 kg verlangt (Anhänger bis 3,5 t); Stützlast darf Herstellerangaben von Zugfahrzeug, Anhängekupplung bzw.
 *   Zugeinrichtung nicht überschreiten.
 * - § 6 Abs. 1 FeV (Klasse B/BE) und § 6a FeV (B96): zulässige Gesamtmassen, nicht tatsächliche Gewichte.
 *
 * Grenzen: Geländefahrzeuge (Pkw nach Anhang II RL 70/156/EWG, bis 1,5-fache zulässige Gesamtmasse), Lkw über
 * 3,5 t, Starrdeichselanhänger über 3,5 t, Wohnmobile mit Sonderregeln und Geschwindigkeitsregeln sind nicht
 * abgebildet. Die Papiere des Fahrzeugs bleiben maßgeblich.
 */

export type CheckTone = "success" | "warning" | "danger" | "info";

export type Check = {
  id: "anhaenger-zuladung" | "anhaengelast" | "ungebremst" | "stuetzlast" | "zugfahrzeug-zuladung" | "fuehrerschein";
  title: string;
  tone: CheckTone;
  /** Ein Satz mit dem Ergebnis. */
  summary: string;
  /** Rechenweg und Hinweise in einfachen Sätzen. */
  details: string[];
};

export type AnhaengerZuladungInput = {
  zug: {
    /** Zulässige Gesamtmasse (Feld F.2, ersatzweise F.1; bei Abweichung der kleinere Wert). */
    zgg: number | null;
    /** Leermasse (Feld G). */
    leer: number | null;
    /** Technisch zulässige Anhängelast gebremst (Feld O.1). */
    anhaengelastGebremst: number | null;
    /** Technisch zulässige Anhängelast ungebremst (Feld O.2). */
    anhaengelastUngebremst: number | null;
    /** Stützlast Zugfahrzeug (Feld 13 bzw. Herstellerangabe). */
    stuetzlast: number | null;
    /** Stützlast laut Typschild der Anhängekupplung. */
    kupplungStuetzlast: number | null;
  };
  anhaenger: {
    zgg: number | null;
    leer: number | null;
    gebremst: boolean;
    einachsig: boolean;
    /** Stützlast laut Papieren des Anhängers (Feld 13). */
    stuetzlast: number | null;
  };
  beladung: {
    /** Ladung auf dem Anhänger (ohne Anhänger-Leergewicht). */
    ladung: number | null;
    /** Tatsächlich gemessene oder geschätzte Stützlast. */
    stuetzlastIst: number | null;
    /** Mitfahrer im Zugfahrzeug (ohne Fahrer). */
    mitfahrer: number | null;
    /** Gepäck, Zubehör und Ladung im Zugfahrzeug. */
    gepaeck: number | null;
    /** Gewicht des Fahrers, Standard 75 kg (im Leergewicht bereits enthalten). */
    fahrer: number | null;
  };
};

export type FieldErrors = Partial<Record<string, string>>;

export type AnhaengerZuladungResult = {
  checks: Check[];
  overall: "success" | "warning" | "danger";
  /** Nur gesetzt, wenn berechenbar. */
  numbers: {
    anhaengerZuladungMax: number | null;
    anhaengerZuladungRest: number | null;
    anhaengerGesamt: number | null;
    anhaengelastGrenze: number | null;
    anhaengelastReserve: number | null;
    stuetzlastMin: number | null;
    stuetzlastMax: number | null;
    zugZuladungMax: number | null;
    zugZuladungRest: number | null;
  };
  notes: string[];
};

export const FAHRER_PAUSCHALE_KG = 75;
const UNGEBREMST_MAX_KG = 750;
const ANHAENGER_PKW_MAX_KG = 3500;
const STUETZ_MIN_ANTEIL = 0.04;
const STUETZ_MIN_DECKEL_KG = 25;
const KNAPP_ANTEIL = 0.05;

const nf = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const kg = (value: number) => `${nf.format(Math.round(value * 10) / 10)} kg`;

const present = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

function tonePair(rest: number, limit: number): "success" | "warning" | "danger" {
  if (rest < 0) return "danger";
  if (limit > 0 && rest < Math.max(10, limit * KNAPP_ANTEIL)) return "warning";
  return "success";
}

/** Plausibilitätsprüfung der Eingaben. Leere optionale Felder sind erlaubt. */
export function validateInput(input: AnhaengerZuladungInput): FieldErrors {
  const errors: FieldErrors = {};
  const nonNegative = (path: string, value: number | null, label: string) => {
    if (value !== null && (!Number.isFinite(value) || value < 0)) errors[path] = `${label}: bitte eine Zahl ab 0 angeben.`;
  };
  const positive = (path: string, value: number | null, label: string) => {
    if (value !== null && (!Number.isFinite(value) || value <= 0)) errors[path] = `${label}: bitte eine Zahl größer 0 angeben.`;
  };
  positive("zug.zgg", input.zug.zgg, "Zulässige Gesamtmasse Zugfahrzeug");
  positive("zug.leer", input.zug.leer, "Leermasse Zugfahrzeug");
  nonNegative("zug.anhaengelastGebremst", input.zug.anhaengelastGebremst, "Anhängelast gebremst");
  nonNegative("zug.anhaengelastUngebremst", input.zug.anhaengelastUngebremst, "Anhängelast ungebremst");
  nonNegative("zug.stuetzlast", input.zug.stuetzlast, "Stützlast Zugfahrzeug");
  nonNegative("zug.kupplungStuetzlast", input.zug.kupplungStuetzlast, "Stützlast Kupplung");
  positive("anhaenger.zgg", input.anhaenger.zgg, "Zulässige Gesamtmasse Anhänger");
  positive("anhaenger.leer", input.anhaenger.leer, "Leermasse Anhänger");
  nonNegative("anhaenger.stuetzlast", input.anhaenger.stuetzlast, "Stützlast Anhänger");
  nonNegative("beladung.ladung", input.beladung.ladung, "Ladung");
  nonNegative("beladung.stuetzlastIst", input.beladung.stuetzlastIst, "Stützlast");
  nonNegative("beladung.mitfahrer", input.beladung.mitfahrer, "Mitfahrer");
  nonNegative("beladung.gepaeck", input.beladung.gepaeck, "Gepäck");
  nonNegative("beladung.fahrer", input.beladung.fahrer, "Fahrergewicht");

  const { zug, anhaenger } = input;
  if (present(zug.zgg) && present(zug.leer) && zug.leer >= zug.zgg)
    errors["zug.leer"] = "Die Leermasse muss kleiner als die zulässige Gesamtmasse sein.";
  if (present(anhaenger.zgg) && present(anhaenger.leer) && anhaenger.leer >= anhaenger.zgg)
    errors["anhaenger.leer"] = "Die Leermasse muss kleiner als die zulässige Gesamtmasse des Anhängers sein.";
  if (present(zug.zgg) && zug.zgg > 3500)
    errors["zug.zgg"] = "Dieser Rechner gilt für Pkw und Transporter bis 3.500 kg zulässiger Gesamtmasse.";
  if (present(anhaenger.zgg) && anhaenger.zgg > 3500)
    errors["anhaenger.zgg"] = "Dieser Rechner gilt für Anhänger bis 3.500 kg zulässiger Gesamtmasse.";
  return errors;
}

/**
 * Berechnet alle Prüfungen, für die ausreichend Angaben vorliegen. Gibt `null` zurück, wenn gar nichts
 * berechenbar ist oder die Eingaben Fehler enthalten.
 */
export function calculateAnhaengerZuladung(input: AnhaengerZuladungInput): AnhaengerZuladungResult | null {
  if (Object.keys(validateInput(input)).length > 0) return null;
  const { zug, anhaenger, beladung } = input;
  const checks: Check[] = [];
  const notes: string[] = [];
  const numbers: AnhaengerZuladungResult["numbers"] = {
    anhaengerZuladungMax: null,
    anhaengerZuladungRest: null,
    anhaengerGesamt: null,
    anhaengelastGrenze: null,
    anhaengelastReserve: null,
    stuetzlastMin: null,
    stuetzlastMax: null,
    zugZuladungMax: null,
    zugZuladungRest: null,
  };

  const ladung = beladung.ladung ?? 0;
  const hasTrailer = present(anhaenger.zgg) && present(anhaenger.leer);

  // 1) Zuladung des Anhängers
  if (hasTrailer) {
    const max = anhaenger.zgg! - anhaenger.leer!;
    const gesamt = anhaenger.leer! + ladung;
    const rest = anhaenger.zgg! - gesamt;
    numbers.anhaengerZuladungMax = max;
    numbers.anhaengerGesamt = gesamt;
    numbers.anhaengerZuladungRest = rest;
    const tone = beladung.ladung === null ? "info" : tonePair(rest, max);
    checks.push({
      id: "anhaenger-zuladung",
      title: "Zuladung des Anhängers",
      tone,
      summary:
        beladung.ladung === null
          ? `Sie dürfen höchstens ${kg(max)} auf den Anhänger laden.`
          : rest < 0
            ? `Der Anhänger ist um ${kg(-rest)} überladen (Gesamtgewicht ${kg(gesamt)}, zulässig ${kg(anhaenger.zgg!)}).`
            : `Es bleiben ${kg(rest)} Zuladung (Gesamtgewicht ${kg(gesamt)} von ${kg(anhaenger.zgg!)}).`,
      details: [
        `Rechnung: zulässige Gesamtmasse ${kg(anhaenger.zgg!)} − Leermasse ${kg(anhaenger.leer!)} = ${kg(max)} maximale Zuladung.`,
        "Das tatsächliche Gewicht des beladenen Anhängers darf die zulässige Gesamtmasse nicht überschreiten (§ 34 Abs. 3 StVZO).",
      ],
    });
  }

  // 2) Stützlast
  const gesamtFuerStuetz = numbers.anhaengerGesamt;
  if (gesamtFuerStuetz !== null) {
    const min = Math.min(STUETZ_MIN_ANTEIL * gesamtFuerStuetz, STUETZ_MIN_DECKEL_KG);
    const limits = [zug.stuetzlast, zug.kupplungStuetzlast, anhaenger.stuetzlast].filter(present);
    const max = limits.length > 0 ? Math.min(...limits) : null;
    numbers.stuetzlastMin = min;
    numbers.stuetzlastMax = max;
    const ist = beladung.stuetzlastIst;
    const rangeText = `mindestens ${kg(min)}${max !== null ? `, höchstens ${kg(max)}` : ""}`;
    let tone: CheckTone = "info";
    let summary = `Die Stützlast sollte ${rangeText} betragen.`;
    if (ist !== null) {
      if (max !== null && ist > max) {
        tone = "danger";
        summary = `Die Stützlast von ${kg(ist)} liegt über dem zulässigen Höchstwert von ${kg(max)}.`;
      } else if (ist < min) {
        tone = "warning";
        summary = `Die Stützlast von ${kg(ist)} liegt unter dem Mindestwert von ${kg(min)}: Das Gespann kann instabil laufen.`;
      } else {
        tone = max !== null && ist > max * (1 - KNAPP_ANTEIL) ? "warning" : "success";
        summary = `Die Stützlast von ${kg(ist)} liegt im zulässigen Bereich (${rangeText}).`;
      }
    }
    const details = [
      `Mindestwert: 4 % des tatsächlichen Anhängergewichts (${kg(gesamtFuerStuetz)}), aber höchstens 25 kg verlangt (§ 44 Abs. 3 StVZO): ${kg(min)}.`,
    ];
    if (max !== null) {
      details.push(`Höchstwert: der kleinste Ihrer Herstellerwerte (${limits.map(kg).join(", ")}), siehe § 44 Abs. 3 StVZO.`);
    } else {
      details.push(
        "Den Höchstwert nennen die Papiere: Feld 13 im Fahrzeugschein des Zugfahrzeugs, Feld 13 im Anhängerschein und das Typschild der Anhängekupplung. Es gilt der kleinste Wert. Tragen Sie ihn oben ein.",
      );
    }
    checks.push({ id: "stuetzlast", title: "Stützlast", tone, summary, details });
  }

  // 3) Anhängelast (Gespann)
  if (gesamtFuerStuetz !== null) {
    const hersteller = anhaenger.gebremst ? zug.anhaengelastGebremst : zug.anhaengelastUngebremst;
    const grenzen: { wert: number; label: string }[] = [];
    if (present(hersteller)) {
      grenzen.push({
        wert: hersteller,
        label: `Anhängelast ${anhaenger.gebremst ? "gebremst (Feld O.1)" : "ungebremst (Feld O.2)"} ${kg(hersteller)}`,
      });
    }
    if (present(zug.zgg)) grenzen.push({ wert: zug.zgg, label: `zulässige Gesamtmasse des Zugfahrzeugs ${kg(zug.zgg)} (§ 42 Abs. 1 StVZO)` });
    grenzen.push({ wert: ANHAENGER_PKW_MAX_KG, label: `Obergrenze ${kg(ANHAENGER_PKW_MAX_KG)} für Achslast plus Stützlast (§ 42 Abs. 1 StVZO)` });
    const massgeblich = grenzen.reduce((a, b) => (b.wert < a.wert ? b : a));
    numbers.anhaengelastGrenze = massgeblich.wert;
    const reserve = massgeblich.wert - gesamtFuerStuetz;
    numbers.anhaengelastReserve = reserve;
    const tone = beladung.ladung === null ? "info" : tonePair(reserve, massgeblich.wert);
    const fehlt = !present(hersteller);
    checks.push({
      id: "anhaengelast",
      title: "Anhängelast des Zugfahrzeugs",
      tone: fehlt && tone === "success" ? "info" : tone,
      summary:
        reserve < 0
          ? `Der Anhänger ist ${kg(-reserve)} zu schwer für dieses Zugfahrzeug (${kg(gesamtFuerStuetz)} gezogen, erlaubt ${kg(massgeblich.wert)}).`
          : `Das Zugfahrzeug darf ${kg(massgeblich.wert)} ziehen; mit ${kg(gesamtFuerStuetz)} bleiben ${kg(reserve)} Reserve.`,
      details: [
        `Maßgeblich ist der niedrigste Wert: ${massgeblich.label}.`,
        ...(fehlt
          ? [
              `Die Herstellerangabe (${anhaenger.gebremst ? "Feld O.1" : "Feld O.2"}) fehlt. Ohne sie ist das Ergebnis nicht verlässlich: Tragen Sie den Wert aus dem Fahrzeugschein ein.`,
            ]
          : []),
        `Alle geprüften Grenzen: ${grenzen.map((g) => g.label).join("; ")}.`,
        "Bei Geländefahrzeugen kann die gesetzliche Obergrenze höher liegen (§ 42 Abs. 1 Nr. 2 StVZO); dann gilt der Herstellerwert aus Feld O.1.",
      ],
    });
  }

  // 4) Ungebremster Anhänger
  if (hasTrailer && !anhaenger.gebremst) {
    const items: string[] = [];
    let tone: CheckTone = "success";
    let summary = "";
    if (!anhaenger.einachsig) {
      tone = "danger";
      summary = "Ungebremste Anhänger sind hinter Pkw nur einachsig erlaubt (§ 42 Abs. 2 StVZO).";
    } else if (present(zug.leer) && gesamtFuerStuetz !== null) {
      const gesetz = Math.min(UNGEBREMST_MAX_KG, 0.5 * (zug.leer + FAHRER_PAUSCHALE_KG));
      const grenze = present(zug.anhaengelastUngebremst) ? Math.min(gesetz, zug.anhaengelastUngebremst) : gesetz;
      const reserve = grenze - gesamtFuerStuetz;
      tone = tonePair(reserve, grenze);
      summary =
        reserve < 0
          ? `Ungebremst dürfen höchstens ${kg(grenze)} gezogen werden; Ihr Anhänger wiegt ${kg(gesamtFuerStuetz)}.`
          : `Ungebremst dürfen höchstens ${kg(grenze)} gezogen werden; es bleiben ${kg(reserve)} Reserve.`;
      items.push(
        `Gesetzliche Grenze: die Hälfte des um 75 kg erhöhten Leergewichts des Zugfahrzeugs, höchstens 750 kg: 0,5 × (${kg(zug.leer)} + 75 kg) = ${kg(0.5 * (zug.leer + FAHRER_PAUSCHALE_KG))}, gedeckelt auf ${kg(gesetz)} (§ 42 Abs. 2 StVZO).`,
      );
      if (present(zug.anhaengelastUngebremst)) items.push(`Herstellerwert Feld O.2: ${kg(zug.anhaengelastUngebremst)}; es gilt der niedrigere Wert.`);
    } else {
      tone = "info";
      summary = "Für die Grenze beim ungebremsten Anhänger fehlt die Leermasse des Zugfahrzeugs.";
    }
    items.push("Voraussetzung: Das Zugfahrzeug hat eine Allradbremse und der Anhänger nur eine Achse (§ 42 Abs. 2 StVZO).");
    checks.push({ id: "ungebremst", title: "Ungebremster Anhänger", tone, summary, details: items });
  }

  // 5) Zuladung des Zugfahrzeugs
  if (present(zug.zgg) && present(zug.leer)) {
    const max = zug.zgg - zug.leer;
    numbers.zugZuladungMax = max;
    const mitfahrer = beladung.mitfahrer ?? 0;
    const gepaeck = beladung.gepaeck ?? 0;
    const fahrerMehr = Math.max(0, (beladung.fahrer ?? FAHRER_PAUSCHALE_KG) - FAHRER_PAUSCHALE_KG);
    const stuetz = beladung.stuetzlastIst ?? zug.stuetzlast ?? 0;
    const stuetzAnnahme = beladung.stuetzlastIst === null && present(zug.stuetzlast);
    const belegt = mitfahrer + gepaeck + fahrerMehr + stuetz;
    const rest = max - belegt;
    numbers.zugZuladungRest = rest;
    const details = [
      `Rechnung: zulässige Gesamtmasse ${kg(zug.zgg)} − Leermasse ${kg(zug.leer)} = ${kg(max)} Zuladung. Davon abgezogen: Mitfahrer ${kg(mitfahrer)}, Gepäck/Zubehör ${kg(gepaeck)}${fahrerMehr > 0 ? `, Fahrer über 75 kg: ${kg(fahrerMehr)}` : ""}, Stützlast ${kg(stuetz)}.`,
      "Üblicherweise ist ein Fahrer mit 75 kg bereits in der Leermasse enthalten (vgl. § 42 Abs. 3 StVZO); nur ein höheres Fahrergewicht wird zusätzlich abgezogen. Steht in Ihren Papieren etwas anderes, rechnen Sie den Fahrer selbst dazu.",
      "Die Stützlast des Anhängers drückt auf die Kupplung und zählt zum Gewicht des Zugfahrzeugs.",
    ];
    if (stuetzAnnahme) details.push(`Weil keine tatsächliche Stützlast angegeben ist, rechnet der Rechner vorsichtig mit dem Höchstwert Ihres Zugfahrzeugs (${kg(zug.stuetzlast!)}).`);
    if (!present(beladung.stuetzlastIst) && !present(zug.stuetzlast)) details.push("Es ist weder eine tatsächliche Stützlast noch Feld 13 angegeben; die Stützlast wurde mit 0 kg angesetzt. Das Ergebnis ist dann zu optimistisch.");
    checks.push({
      id: "zugfahrzeug-zuladung",
      title: "Zuladung des Zugfahrzeugs",
      tone: tonePair(rest, max),
      summary:
        rest < 0
          ? `Das Zugfahrzeug ist um ${kg(-rest)} überladen (Zuladung ${kg(max)}, belegt ${kg(belegt)}).`
          : `Im Zugfahrzeug bleiben ${kg(rest)} Zuladung (von ${kg(max)}).`,
      details,
    });
  }

  // 6) Führerschein
  if (present(zug.zgg) && present(anhaenger.zgg)) {
    const summe = zug.zgg + anhaenger.zgg;
    let tone: CheckTone = "info";
    let summary: string;
    const details: string[] = [
      `Maßgeblich sind die zulässigen Gesamtmassen, nicht die tatsächlichen Gewichte: Zugfahrzeug ${kg(zug.zgg)} + Anhänger ${kg(anhaenger.zgg)} = ${kg(summe)}.`,
    ];
    if (anhaenger.zgg <= 750) {
      tone = "success";
      summary = "Mit Klasse B dürfen Sie diesen Anhänger ziehen (Anhänger bis 750 kg zulässige Gesamtmasse).";
    } else if (summe <= 3500) {
      tone = "success";
      summary = `Mit Klasse B reicht es: Die Kombination darf höchstens 3.500 kg haben, hier sind es ${kg(summe)}.`;
    } else if (summe <= 4250) {
      tone = "warning";
      summary = `Klasse B genügt nicht (${kg(summe)} über 3.500 kg). Erforderlich ist Klasse BE oder die Schlüsselzahl 96 (B96, Kombination bis 4.250 kg).`;
      details.push("B96 erfordert eine Fahrerschulung; Klasse BE eine Prüfung (§ 6a FeV, § 6 FeV).");
    } else {
      tone = "warning";
      summary = `Klasse B genügt nicht (${kg(summe)}). Erforderlich ist Klasse BE (Anhänger bis 3.500 kg).`;
    }
    details.push("Maßgeblich bleibt Ihr Führerschein: Fragen Sie im Zweifel die Fahrerlaubnisbehörde.");
    checks.push({ id: "fuehrerschein", title: "Führerschein", tone, summary, details });
  }

  if (checks.length === 0) return null;

  if (beladung.fahrer === null) notes.push("Das Fahrergewicht ist mit 75 kg angesetzt, die üblicherweise im Leergewicht enthalten sind (vgl. § 42 Abs. 3 StVZO).");
  notes.push("Die Leermasse im Fahrzeugschein (Feld G) kann von der tatsächlichen Leermasse abweichen (Ausstattung, Zubehör, Tankfüllung). Bei knappen Ergebnissen wiegen Sie das Fahrzeug.");
  notes.push("Maßgeblich sind immer die Eintragungen in Ihren Fahrzeugpapieren. Der Rechner ersetzt weder Wiegen noch Rechtsberatung.");
  notes.push("Nicht abgebildet: Geländefahrzeuge, Zugfahrzeuge und Anhänger über 3.500 kg, Wohnwagen mit Tempo-100-Zulassung und Dachlasten.");

  const tones = checks.map((c) => c.tone);
  const overall = tones.includes("danger") ? "danger" : tones.includes("warning") ? "warning" : "success";
  return { checks, overall, numbers, notes };
}
