import { describe, expect, it } from "vitest";
import { calculateLademeter, type LademeterCargoItem, type LademeterInput } from "./lademeter";

function item(overrides: Partial<LademeterCargoItem> = {}): LademeterCargoItem {
  return {
    length: null,
    width: null,
    height: null,
    quantity: 1,
    weight: null,
    stackable: false,
    ...overrides,
  };
}

function input(unit: LademeterInput["unit"], items: LademeterCargoItem[]): LademeterInput {
  return { unit, items };
}

describe("calculateLademeter", () => {
  it("1. computes an exact 0.4 ldm for a single Europalette (120x80cm), no rounding applied", () => {
    const result = calculateLademeter(
      input("cm", [item({ length: 120, width: 80, quantity: 1 })]),
    );

    expect(result).not.toBeNull();
    expect(result!.totalLoadingMeters).toBe(0.4);
    expect(result!.totalFootprintSqm).toBe(0.96);
  });

  it("2. computes 4.0 ldm and 9.6 sqm for 10 Europaletten", () => {
    const result = calculateLademeter(
      input("cm", [item({ length: 120, width: 80, quantity: 10 })]),
    );

    expect(result!.totalLoadingMeters).toBe(4.0);
    expect(result!.totalFootprintSqm).toBe(9.6);
  });

  it("3. computes 13.2 ldm for 33 Europaletten (arithmetic cross-check only, not a capacity claim)", () => {
    const result = calculateLademeter(
      input("cm", [item({ length: 120, width: 80, quantity: 33 })]),
    );

    expect(result!.totalLoadingMeters).toBe(13.2);
  });

  it("4. computes exactly 0.5 ldm for a single Industriepalette (120x100cm)", () => {
    const result = calculateLademeter(
      input("cm", [item({ length: 120, width: 100, quantity: 1 })]),
    );

    expect(result!.totalLoadingMeters).toBe(0.5);
  });

  it("5. produces identical results regardless of mm/cm/m unit selection", () => {
    const mm = calculateLademeter(input("mm", [item({ length: 1200, width: 800, quantity: 1 })]));
    const cm = calculateLademeter(input("cm", [item({ length: 120, width: 80, quantity: 1 })]));
    const m = calculateLademeter(input("m", [item({ length: 1.2, width: 0.8, quantity: 1 })]));

    expect(mm!.totalLoadingMeters).toBe(cm!.totalLoadingMeters);
    expect(cm!.totalLoadingMeters).toBe(m!.totalLoadingMeters);
    expect(mm!.totalFootprintSqm).toBe(cm!.totalFootprintSqm);
  });

  it("6. sums mixed item types correctly (5x Europalette + 3x Industriepalette = 3.5 ldm)", () => {
    const result = calculateLademeter(
      input("cm", [
        item({ length: 120, width: 80, quantity: 5 }),
        item({ length: 120, width: 100, quantity: 3 }),
      ]),
    );

    expect(result!.totalLoadingMeters).toBe(3.5);
  });

  it("7. flags oversized width (>2.4m) but does not flag a long item with normal width", () => {
    const oversized = calculateLademeter(
      input("cm", [item({ length: 100, width: 300, quantity: 1 })]),
    );
    expect(
      oversized!.utilizationNotes.some((note) => note.includes("breiter als die Standard-Ladebreite")),
    ).toBe(true);

    const longButNarrow = calculateLademeter(
      input("cm", [item({ length: 500, width: 80, quantity: 1 })]),
    );
    expect(
      longButNarrow!.utilizationNotes.some((note) =>
        note.includes("breiter als die Standard-Ladebreite"),
      ),
    ).toBe(false);
  });

  it("8. always includes the general disclaimer and billing-rounding notes", () => {
    const result = calculateLademeter(input("cm", [item({ length: 120, width: 80, quantity: 1 })]));

    expect(
      result!.utilizationNotes.some((note) => note.includes("Ausrichtung der Ladung")),
    ).toBe(true);
    expect(
      result!.utilizationNotes.some((note) => note.includes("runden") && note.includes("Spediteure")),
    ).toBe(true);
  });

  it("9. excludes items without height from the volume total and marks it partial", () => {
    const result = calculateLademeter(
      input("cm", [
        item({ length: 120, width: 80, height: 100, quantity: 1 }),
        item({ length: 120, width: 80, height: null, quantity: 1 }),
      ]),
    );

    // Only the first item (with height) contributes to volume: 1.2*0.8*1.0 = 0.96 m3
    expect(result!.totalVolumeCbm).toBe(0.96);
    // Both items still contribute to ldm/footprint
    expect(result!.totalLoadingMeters).toBe(0.8);
    expect(
      result!.utilizationNotes.some((note) => note.includes("Gesamtvolumen ist unvollst\u00e4ndig")),
    ).toBe(true);
  });

  it("10. excludes items without weight from the weight total and marks it partial", () => {
    const result = calculateLademeter(
      input("cm", [
        item({ length: 120, width: 80, weight: 300, quantity: 1 }),
        item({ length: 120, width: 80, weight: null, quantity: 1 }),
      ]),
    );

    expect(result!.totalWeightKg).toBe(300);
    expect(
      result!.utilizationNotes.some((note) => note.includes("Gesamtgewicht ist unvollst\u00e4ndig")),
    ).toBe(true);
  });

  it("11. preserves precision without ceiling rounding (0.31 stays 0.31, not 0.4)", () => {
    // length 0.62m x width 1.2m / 2.4 = 0.31 ldm exactly
    const result = calculateLademeter(
      input("m", [item({ length: 0.62, width: 1.2, quantity: 1 })]),
    );

    expect(result!.totalLoadingMeters).toBe(0.31);
  });

  it("12. returns null when there are no valid items", () => {
    const allInvalid = calculateLademeter(
      input("cm", [item({ length: null, width: null, quantity: 1 })]),
    );
    expect(allInvalid).toBeNull();

    const empty = calculateLademeter(input("cm", []));
    expect(empty).toBeNull();
  });

  it("13. keeps the ldm number unchanged for stackable items and adds an informational note only", () => {
    const stackable = calculateLademeter(
      input("cm", [item({ length: 120, width: 80, quantity: 1, stackable: true })]),
    );
    const nonStackable = calculateLademeter(
      input("cm", [item({ length: 120, width: 80, quantity: 1, stackable: false })]),
    );

    expect(stackable!.totalLoadingMeters).toBe(nonStackable!.totalLoadingMeters);
    expect(
      stackable!.utilizationNotes.some((note) => note.includes("stapelbar markierte")),
    ).toBe(true);
    expect(
      nonStackable!.utilizationNotes.some((note) => note.includes("stapelbar markierte")),
    ).toBe(false);
  });

  it("14. scales linearly for large quantities without precision issues", () => {
    const result = calculateLademeter(
      input("cm", [item({ length: 120, width: 80, quantity: 1000 })]),
    );

    expect(result!.totalLoadingMeters).toBe(400);
  });

  it("skips items with invalid fields (negative/zero) and reports how many were skipped", () => {
    const result = calculateLademeter(
      input("cm", [
        item({ length: 120, width: 80, quantity: 1 }),
        item({ length: -10, width: 80, quantity: 1 }),
        item({ length: 120, width: 0, quantity: 1 }),
        item({ length: 120, width: 80, quantity: 0 }),
      ]),
    );

    expect(result!.totalLoadingMeters).toBe(0.4);
    expect(
      result!.utilizationNotes.some((note) => note.startsWith("3 Position(en)")),
    ).toBe(true);
  });

  it("15. stackLayers counts only floor positions (ceil(quantity / layers))", () => {
    const result = calculateLademeter({
      unit: "cm",
      items: [{ length: 120, width: 80, quantity: 11, stackLayers: 2 }],
    });
    // ceil(11 / 2) = 6 floor positions x 0.4 ldm
    expect(result!.totalLoadingMeters).toBe(2.4);
    expect(result!.totalFloorPositions).toBe(6);
  });

  it("16. chargeable weight is the higher of real weight and ldm x factor", () => {
    const light = calculateLademeter({
      unit: "cm",
      kgPerLoadingMeter: 1850,
      items: [{ length: 120, width: 80, quantity: 10, weight: 320 }],
    });
    expect(light!.loadingMeterWeightKg).toBe(7400);
    expect(light!.chargeableWeightKg).toBe(7400);

    const heavy = calculateLademeter({
      unit: "cm",
      kgPerLoadingMeter: 1850,
      items: [{ length: 120, width: 80, quantity: 10, weight: 900 }],
    });
    expect(heavy!.chargeableWeightKg).toBe(9000);

    const none = calculateLademeter({ unit: "cm", items: [{ length: 120, width: 80, quantity: 1 }] });
    expect(none!.chargeableWeightKg).toBeNull();
  });

  it("17. reports the share of a 13.6 m semi-trailer", () => {
    const result = calculateLademeter({ unit: "cm", items: [{ length: 120, width: 80, quantity: 17 }] });
    expect(result!.semiTrailerSharePercent).toBe(50);
  });
});
