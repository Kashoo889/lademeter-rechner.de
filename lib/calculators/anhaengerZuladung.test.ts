import { describe, expect, it } from "vitest";
import {
  calculateAnhaengerZuladung,
  validateInput,
  type AnhaengerZuladungInput,
} from "@/lib/calculators/anhaengerZuladung";

/** Basis: Pkw 2.050 kg zGG, 1.450 kg Leermasse; gebremster Anhänger 1.300 kg zGG, 400 kg Leermasse. */
function base(overrides: Partial<{ [K in keyof AnhaengerZuladungInput]: Partial<AnhaengerZuladungInput[K]> }> = {}): AnhaengerZuladungInput {
  return {
    zug: {
      zgg: 2050,
      leer: 1450,
      anhaengelastGebremst: 1500,
      anhaengelastUngebremst: 700,
      stuetzlast: 75,
      kupplungStuetzlast: null,
      ...overrides.zug,
    },
    anhaenger: { zgg: 1300, leer: 400, gebremst: true, einachsig: true, stuetzlast: null, ...overrides.anhaenger },
    beladung: { ladung: 800, stuetzlastIst: 75, mitfahrer: 0, gepaeck: 0, fahrer: null, ...overrides.beladung },
  };
}

const check = (result: ReturnType<typeof calculateAnhaengerZuladung>, id: string) => result?.checks.find((c) => c.id === id);

describe("Zuladung des Zugfahrzeugs", () => {
  it("Testfall 1: 600 kg Zuladung, abzüglich Mitfahrer, Gepäck und Stützlast bleiben 200 kg", () => {
    const result = calculateAnhaengerZuladung(base({ beladung: { ladung: 800, stuetzlastIst: 75, mitfahrer: 225, gepaeck: 100 } }));
    expect(result?.numbers.zugZuladungMax).toBe(600);
    expect(result?.numbers.zugZuladungRest).toBe(200);
    expect(check(result, "zugfahrzeug-zuladung")?.tone).toBe("success");
  });

  it("zieht nur ein Fahrergewicht über 75 kg zusätzlich ab", () => {
    const heavy = calculateAnhaengerZuladung(base({ beladung: { fahrer: 105, stuetzlastIst: 0 } }));
    expect(heavy?.numbers.zugZuladungRest).toBe(600 - 30);
    const light = calculateAnhaengerZuladung(base({ beladung: { fahrer: 60, stuetzlastIst: 0 } }));
    expect(light?.numbers.zugZuladungRest).toBe(600);
  });

  it("rechnet ohne angegebene Stützlast vorsichtig mit dem Höchstwert des Zugfahrzeugs", () => {
    const result = calculateAnhaengerZuladung(base({ beladung: { stuetzlastIst: null } }));
    expect(result?.numbers.zugZuladungRest).toBe(600 - 75);
  });

  it("meldet Überladung des Zugfahrzeugs", () => {
    const result = calculateAnhaengerZuladung(base({ beladung: { mitfahrer: 500, gepaeck: 100, stuetzlastIst: 75 } }));
    expect(check(result, "zugfahrzeug-zuladung")?.tone).toBe("danger");
    expect(result?.overall).toBe("danger");
  });
});

describe("Zuladung des Anhängers", () => {
  it("Testfall 4: 900 kg maximale Zuladung, mit 800 kg Ladung ist das Gesamtgewicht 1.200 kg", () => {
    const result = calculateAnhaengerZuladung(base());
    expect(result?.numbers.anhaengerZuladungMax).toBe(900);
    expect(result?.numbers.anhaengerGesamt).toBe(1200);
    expect(result?.numbers.anhaengerZuladungRest).toBe(100);
  });

  it("Testfall 11: überladener Anhänger", () => {
    const result = calculateAnhaengerZuladung(base({ beladung: { ladung: 950 } }));
    expect(check(result, "anhaenger-zuladung")?.tone).toBe("danger");
    expect(check(result, "anhaenger-zuladung")?.summary).toContain("überladen");
  });

  it("zeigt nur die maximale Zuladung, wenn keine Ladung angegeben ist", () => {
    const result = calculateAnhaengerZuladung(base({ beladung: { ladung: null } }));
    expect(check(result, "anhaenger-zuladung")?.tone).toBe("info");
  });
});

describe("Anhängelast", () => {
  it("Testfall 5: Grenze 1.500 kg (Herstellerwert), Reserve 300 kg bei 1.200 kg", () => {
    const result = calculateAnhaengerZuladung(base());
    expect(result?.numbers.anhaengelastGrenze).toBe(1500);
    expect(result?.numbers.anhaengelastReserve).toBe(300);
    expect(check(result, "anhaengelast")?.tone).toBe("success");
  });

  it("begrenzt auf die zulässige Gesamtmasse des Zugfahrzeugs, wenn der Herstellerwert höher liegt", () => {
    const result = calculateAnhaengerZuladung(base({ zug: { anhaengelastGebremst: 2400 } }));
    expect(result?.numbers.anhaengelastGrenze).toBe(2050);
  });

  it("begrenzt auf 3.500 kg", () => {
    const result = calculateAnhaengerZuladung(
      base({ zug: { zgg: 3500, leer: 2000, anhaengelastGebremst: 3500 }, anhaenger: { zgg: 3500, leer: 1000 }, beladung: { ladung: 100 } }),
    );
    expect(result?.numbers.anhaengelastGrenze).toBe(3500);
  });

  it("meldet einen zu schweren Anhänger", () => {
    const result = calculateAnhaengerZuladung(base({ zug: { anhaengelastGebremst: 1100 } }));
    expect(check(result, "anhaengelast")?.tone).toBe("danger");
  });

  it("warnt bei knapper Reserve (unter 5 %)", () => {
    const result = calculateAnhaengerZuladung(base({ zug: { anhaengelastGebremst: 1250 } }));
    expect(check(result, "anhaengelast")?.tone).toBe("warning");
  });

  it("weist auf fehlende Herstellerangabe hin und gibt dann keine Entwarnung", () => {
    const result = calculateAnhaengerZuladung(base({ zug: { anhaengelastGebremst: null } }));
    const c = check(result, "anhaengelast");
    expect(c?.tone).toBe("info");
    expect(c?.details.join(" ")).toContain("fehlt");
  });
});

describe("Ungebremster Anhänger (§ 42 Abs. 2 StVZO)", () => {
  const unbraked = (leer: number, ladung: number, extra: Partial<AnhaengerZuladungInput["anhaenger"]> = {}) =>
    base({
      zug: { leer, zgg: leer + 600, anhaengelastUngebremst: null },
      anhaenger: { zgg: 750, leer: 150, gebremst: false, einachsig: true, ...extra },
      beladung: { ladung, stuetzlastIst: 25 },
    });

  it("Testfall 2: halbe (Leergewicht + 75 kg) = 737,5 kg bei 1.400 kg Leergewicht", () => {
    const result = calculateAnhaengerZuladung(unbraked(1400, 500));
    expect(check(result, "ungebremst")?.summary).toContain("737,5");
  });

  it("Testfall 3: Deckel 750 kg bei 1.700 kg Leergewicht", () => {
    const result = calculateAnhaengerZuladung(unbraked(1700, 500));
    expect(check(result, "ungebremst")?.summary).toContain("750 kg");
    expect(check(result, "ungebremst")?.summary).not.toContain("887");
  });

  it("verwendet den niedrigeren Herstellerwert O.2", () => {
    const input = unbraked(1700, 100);
    input.zug.anhaengelastUngebremst = 600;
    const result = calculateAnhaengerZuladung(input);
    expect(check(result, "ungebremst")?.summary).toContain("600 kg");
  });

  it("verbietet mehrachsige ungebremste Anhänger", () => {
    const result = calculateAnhaengerZuladung(unbraked(1400, 100, { einachsig: false }));
    expect(check(result, "ungebremst")?.tone).toBe("danger");
  });

  it("erscheint nicht bei gebremstem Anhänger", () => {
    expect(check(calculateAnhaengerZuladung(base()), "ungebremst")).toBeUndefined();
  });
});

describe("Stützlast (§ 44 Abs. 3 StVZO)", () => {
  it("Testfall 6: Mindestwert bei 1.200 kg ist 25 kg (4 % wären 48 kg, Deckel 25 kg)", () => {
    expect(calculateAnhaengerZuladung(base())?.numbers.stuetzlastMin).toBe(25);
  });

  it("Testfall 7: Mindestwert bei 600 kg ist 24 kg", () => {
    const result = calculateAnhaengerZuladung(base({ anhaenger: { zgg: 800, leer: 150 }, beladung: { ladung: 450 } }));
    expect(result?.numbers.stuetzlastMin).toBe(24);
  });

  it("nimmt den kleinsten Höchstwert aus Zugfahrzeug, Kupplung und Anhänger", () => {
    const result = calculateAnhaengerZuladung(base({ zug: { stuetzlast: 90, kupplungStuetzlast: 75 }, anhaenger: { stuetzlast: 100 } }));
    expect(result?.numbers.stuetzlastMax).toBe(75);
  });

  it("meldet zu hohe und zu niedrige Stützlast", () => {
    expect(check(calculateAnhaengerZuladung(base({ beladung: { stuetzlastIst: 90 } })), "stuetzlast")?.tone).toBe("danger");
    expect(check(calculateAnhaengerZuladung(base({ beladung: { stuetzlastIst: 10 } })), "stuetzlast")?.tone).toBe("warning");
    expect(check(calculateAnhaengerZuladung(base({ beladung: { stuetzlastIst: 50 } })), "stuetzlast")?.tone).toBe("success");
  });

  it("nennt Höchstwert nicht, wenn keine Angabe vorliegt", () => {
    const result = calculateAnhaengerZuladung(base({ zug: { stuetzlast: null }, beladung: { stuetzlastIst: null } }));
    expect(result?.numbers.stuetzlastMax).toBeNull();
    expect(check(result, "stuetzlast")?.tone).toBe("info");
  });
});

describe("Führerschein (§ 6, § 6a FeV)", () => {
  it("Testfall 8: Summe 3.350 kg → Klasse B", () => {
    expect(check(calculateAnhaengerZuladung(base()), "fuehrerschein")?.summary).toContain("Klasse B reicht");
  });

  it("Testfall 9: Summe 3.850 kg → BE oder B96", () => {
    const c = check(calculateAnhaengerZuladung(base({ anhaenger: { zgg: 1800, leer: 500 } })), "fuehrerschein");
    expect(c?.summary).toContain("BE");
    expect(c?.summary).toContain("B96");
    expect(c?.tone).toBe("warning");
  });

  it("Testfall 10: Anhänger bis 750 kg → Klasse B ohne Summenprüfung", () => {
    const c = check(calculateAnhaengerZuladung(base({ zug: { zgg: 3000, leer: 1900 }, anhaenger: { zgg: 750, leer: 200 } })), "fuehrerschein");
    expect(c?.tone).toBe("success");
    expect(c?.summary).toContain("750 kg");
  });

  it("über 4.250 kg → nur BE", () => {
    const c = check(calculateAnhaengerZuladung(base({ zug: { zgg: 3000, leer: 1900 }, anhaenger: { zgg: 3000, leer: 900 } })), "fuehrerschein");
    expect(c?.summary).toContain("Klasse BE");
    expect(c?.summary).not.toContain("B96");
  });
});

describe("Eingaben", () => {
  it("Testfall 12: ungültige Angaben liefern keine Berechnung", () => {
    const input = base({ zug: { zgg: -5 }, beladung: { ladung: -1 } });
    expect(calculateAnhaengerZuladung(input)).toBeNull();
    const errors = validateInput(input);
    expect(errors["zug.zgg"]).toBeTruthy();
    expect(errors["beladung.ladung"]).toBeTruthy();
  });

  it("verlangt Leermasse kleiner als Gesamtmasse", () => {
    expect(validateInput(base({ zug: { leer: 2050 } }))["zug.leer"]).toBeTruthy();
    expect(validateInput(base({ anhaenger: { leer: 1300 } }))["anhaenger.leer"]).toBeTruthy();
  });

  it("begrenzt den Rechner auf Fahrzeuge und Anhänger bis 3.500 kg", () => {
    expect(validateInput(base({ zug: { zgg: 3600, leer: 2000 } }))["zug.zgg"]).toContain("3.500");
    expect(validateInput(base({ anhaenger: { zgg: 3600, leer: 1000 } }))["anhaenger.zgg"]).toContain("3.500");
  });

  it("ist nicht berechenbar, wenn nichts angegeben ist", () => {
    const empty: AnhaengerZuladungInput = {
      zug: { zgg: null, leer: null, anhaengelastGebremst: null, anhaengelastUngebremst: null, stuetzlast: null, kupplungStuetzlast: null },
      anhaenger: { zgg: null, leer: null, gebremst: true, einachsig: true, stuetzlast: null },
      beladung: { ladung: null, stuetzlastIst: null, mitfahrer: null, gepaeck: null, fahrer: null },
    };
    expect(calculateAnhaengerZuladung(empty)).toBeNull();
  });

  it("rechnet auch nur mit Anhängerdaten (ohne Zugfahrzeug)", () => {
    const result = calculateAnhaengerZuladung({
      zug: { zgg: null, leer: null, anhaengelastGebremst: null, anhaengelastUngebremst: null, stuetzlast: null, kupplungStuetzlast: null },
      anhaenger: { zgg: 1300, leer: 400, gebremst: true, einachsig: true, stuetzlast: null },
      beladung: { ladung: 700, stuetzlastIst: null, mitfahrer: null, gepaeck: null, fahrer: null },
    });
    expect(result?.numbers.anhaengerZuladungRest).toBe(200);
    expect(result?.numbers.zugZuladungRest).toBeNull();
    expect(check(result, "fuehrerschein")).toBeUndefined();
  });
});

describe("Beispiel der Rechner-Seite", () => {
  it("liefert genau die auf der Seite genannten Werte", () => {
    const result = calculateAnhaengerZuladung({
      zug: { zgg: 2050, leer: 1450, anhaengelastGebremst: 1500, anhaengelastUngebremst: 700, stuetzlast: 75, kupplungStuetzlast: null },
      anhaenger: { zgg: 1300, leer: 400, gebremst: true, einachsig: true, stuetzlast: null },
      beladung: { ladung: 800, stuetzlastIst: 60, mitfahrer: 75, gepaeck: 50, fahrer: null },
    });
    expect(result?.numbers.anhaengerZuladungMax).toBe(900);
    expect(result?.numbers.anhaengerZuladungRest).toBe(100);
    expect(result?.numbers.anhaengelastGrenze).toBe(1500);
    expect(result?.numbers.anhaengelastReserve).toBe(300);
    expect(result?.numbers.stuetzlastMin).toBe(25);
    expect(result?.numbers.stuetzlastMax).toBe(75);
    expect(result?.numbers.zugZuladungRest).toBe(415);
    expect(result?.checks.find((c) => c.id === "stuetzlast")?.tone).toBe("success");
    expect(result?.checks.find((c) => c.id === "fuehrerschein")?.summary).toContain("Klasse B reicht");
    expect(result?.overall).toBe("success");
  });
});
