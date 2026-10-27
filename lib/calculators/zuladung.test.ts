import { describe, expect, it } from "vitest";
import { calculateZuladung, validateZuladung, type ZuladungInput } from "@/lib/calculators/zuladung";

function input(overrides: Partial<ZuladungInput> = {}): ZuladungInput {
  return {
    art: "pkw",
    zgg: 2000,
    leer: 1400,
    personen: null,
    gewichtProPerson: null,
    fahrer: null,
    gepaeck: null,
    zubehoer: null,
    raeder: null,
    gewichtProRad: null,
    wasserLiter: null,
    gasKg: null,
    wasserGasInLeermasse: false,
    stuetzlast: null,
    ...overrides,
  };
}

describe("Zuladung", () => {
  it("rechnet zulässige Gesamtmasse minus Leermasse", () => {
    const result = calculateZuladung(input());
    expect(result?.max).toBe(600);
    expect(result?.belegt).toBe(0);
    expect(result?.rest).toBe(600);
    expect(result?.tone).toBe("success");
  });

  it("zieht Mitfahrer (Standard 75 kg) und Gepäck ab", () => {
    const result = calculateZuladung(input({ personen: 3, gepaeck: 100 }));
    expect(result?.belegt).toBe(325);
    expect(result?.rest).toBe(275);
  });

  it("verwendet das angegebene Gewicht je Mitfahrer", () => {
    const result = calculateZuladung(input({ personen: 2, gewichtProPerson: 60 }));
    expect(result?.belegt).toBe(120);
  });

  it("zieht nur ein Fahrergewicht über 75 kg zusätzlich ab", () => {
    expect(calculateZuladung(input({ fahrer: 100 }))?.belegt).toBe(25);
    expect(calculateZuladung(input({ fahrer: 60 }))?.belegt).toBe(0);
    expect(calculateZuladung(input({ fahrer: 75 }))?.belegt).toBe(0);
  });

  it("rechnet Fahrräder und Zubehör mit", () => {
    const result = calculateZuladung(input({ raeder: 2, gewichtProRad: 22, zubehoer: 30 }));
    expect(result?.belegt).toBe(74);
  });

  it("rechnet die Stützlast eines Anhängers ein", () => {
    expect(calculateZuladung(input({ stuetzlast: 75 }))?.rest).toBe(525);
  });

  it("meldet Überladung", () => {
    const result = calculateZuladung(input({ personen: 4, gepaeck: 400 }));
    expect(result?.rest).toBe(-100);
    expect(result?.tone).toBe("danger");
    expect(result?.summary).toContain("überladen");
  });

  it("warnt bei knapper Reserve (unter 5 % der Zuladung)", () => {
    const result = calculateZuladung(input({ gepaeck: 580 }));
    expect(result?.rest).toBe(20);
    expect(result?.tone).toBe("warning");
  });

  it("gilt genau an der Grenze nicht als überladen", () => {
    const result = calculateZuladung(input({ gepaeck: 600 }));
    expect(result?.rest).toBe(0);
    expect(result?.tone).toBe("warning");
  });
});

describe("Wohnmobil", () => {
  const camper = (overrides: Partial<ZuladungInput> = {}) =>
    input({ art: "wohnmobil", zgg: 3500, leer: 2900, wasserLiter: 100, gasKg: 22, ...overrides });

  it("zieht Frischwasser (1 l = 1 kg) und Gas ab", () => {
    const result = calculateZuladung(camper());
    expect(result?.max).toBe(600);
    expect(result?.belegt).toBe(122);
    expect(result?.items.map((i) => i.id)).toEqual(["wasser", "gas"]);
  });

  it("zieht Wasser und Gas nicht ab, wenn sie laut Papieren in der Leermasse enthalten sind", () => {
    const result = calculateZuladung(camper({ wasserGasInLeermasse: true }));
    expect(result?.belegt).toBe(0);
    expect(result?.notes.join(" ")).toContain("nicht abgezogen");
  });

  it("ignoriert Wasser und Gas bei Pkw und Transporter", () => {
    expect(calculateZuladung(input({ art: "pkw", wasserLiter: 100, gasKg: 22 }))?.belegt).toBe(0);
    expect(calculateZuladung(input({ art: "transporter", wasserLiter: 100 }))?.belegt).toBe(0);
  });
});

describe("Eingaben", () => {
  it("liefert ohne Gesamtmasse oder Leermasse kein Ergebnis", () => {
    expect(calculateZuladung(input({ zgg: null }))).toBeNull();
    expect(calculateZuladung(input({ leer: null }))).toBeNull();
  });

  it("verlangt Leermasse kleiner als zulässige Gesamtmasse", () => {
    expect(validateZuladung(input({ leer: 2000 })).leer).toBeTruthy();
    expect(calculateZuladung(input({ leer: 2100 }))).toBeNull();
  });

  it("begrenzt auf 7.500 kg", () => {
    expect(validateZuladung(input({ zgg: 7600, leer: 3000 })).zgg).toContain("7.500");
    expect(validateZuladung(input({ zgg: 7500, leer: 3000 })).zgg).toBeUndefined();
  });

  it("lehnt negative und gebrochene Eingaben ab", () => {
    expect(validateZuladung(input({ gepaeck: -1 })).gepaeck).toBeTruthy();
    expect(validateZuladung(input({ personen: 2.5 })).personen).toBeTruthy();
    expect(validateZuladung(input({ personen: 25 })).personen).toBeTruthy();
    expect(calculateZuladung(input({ gepaeck: -1 }))).toBeNull();
  });
});
