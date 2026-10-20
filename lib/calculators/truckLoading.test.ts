import { describe, expect, it } from "vitest";
import { calculateTruckLoading, type CargoRow, type TruckLoadingInput } from "./truckLoading";

function row(overrides: Partial<CargoRow> = {}): CargoRow {
  return {
    id: "row-1",
    name: "Position 1",
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    quantity: 1,
    weightKg: null,
    stackable: false,
    palletized: false,
    ...overrides,
  };
}

function input(overrides: Partial<TruckLoadingInput> = {}): TruckLoadingInput {
  return {
    vehiclePreset: "standard-semi-trailer",
    rows: [],
    ...overrides,
  };
}

describe("calculateTruckLoading", () => {
  it("1. computes totals for a single row on the standard semi-trailer preset (13,6 x 2,4 m)", () => {
    const result = calculateTruckLoading(
      input({
        rows: [
          row({ lengthCm: 120, widthCm: 80, heightCm: 100, quantity: 24, weightKg: 300 }),
        ],
      }),
    );

    expect(result).not.toBeNull();
    // ldm = (1.2*0.8/2.4) * 24 = 9.6
    expect(result!.totalLoadingMeters).toBe(9.6);
    // volume = 1.2*0.8*1.0*24 = 23.04
    expect(result!.totalVolumeCbm).toBe(23.04);
    // weight = 300*24 = 7200
    expect(result!.totalWeightKg).toBe(7200);
    // utilization = (1.2*0.8*24) / (13.6*2.4) * 100 = 23.04/32.64*100 = 70.588...
    expect(result!.floorAreaUtilizationPercent).toBe(70.59);
    expect(result!.vehicleSuitability).toBe("passt");
    expect(result!.itemsNotFitting).toEqual([]);
  });

  it("2. sums multiple rows together", () => {
    const result = calculateTruckLoading(
      input({
        rows: [
          row({ id: "a", lengthCm: 120, widthCm: 80, heightCm: 100, quantity: 10, weightKg: 300 }),
          row({ id: "b", lengthCm: 120, widthCm: 100, heightCm: 150, quantity: 5, weightKg: 400 }),
        ],
      }),
    );

    // footprint = 0.96*10 + 1.2*5 = 9.6 + 6 = 15.6 sqm -> util = 15.6/32.64*100
    expect(result!.floorAreaUtilizationPercent).toBe(47.79);
    expect(result!.totalWeightKg).toBe(5000);
  });

  it("3. requires explicit dimensions and a positive payload for the custom vehicle preset", () => {
    const missingDims = calculateTruckLoading(
      input({
        vehiclePreset: "custom",
        rows: [row({ lengthCm: 120, widthCm: 80, quantity: 1 })],
      }),
    );
    expect(missingDims).toBeNull();

    const withDims = calculateTruckLoading(
      input({
        vehiclePreset: "custom",
        vehicleDimensions: { lengthCm: 800, widthCm: 240 },
        rows: [row({ lengthCm: 120, widthCm: 80, quantity: 1 })],
      }),
    );
    expect(withDims).not.toBeNull();
  });

  it("4. marks volume as partial and adds a note when a row has no height", () => {
    const result = calculateTruckLoading(
      input({
        rows: [
          row({ id: "a", lengthCm: 120, widthCm: 80, heightCm: 100, quantity: 1 }),
          row({ id: "b", lengthCm: 120, widthCm: 80, heightCm: null, quantity: 1 }),
        ],
      }),
    );

    expect(result!.totalVolumeCbm).toBe(0.96);
    expect(
      result!.utilizationNotes.some((note) => note.includes("Gesamtvolumen ist unvollständig")),
    ).toBe(true);
  });

  it("5. marks weight as partial and adds a note when a row has no weight", () => {
    const result = calculateTruckLoading(
      input({
        rows: [
          row({ id: "a", lengthCm: 120, widthCm: 80, weightKg: 300, quantity: 1 }),
          row({ id: "b", lengthCm: 120, widthCm: 80, weightKg: null, quantity: 1 }),
        ],
      }),
    );

    expect(result!.totalWeightKg).toBe(300);
    expect(
      result!.utilizationNotes.some((note) => note.includes("Gesamtgewicht ist unvollständig")),
    ).toBe(true);
  });

  it("6. adds a representative-dimensions note for the solo-truck preset only", () => {
    const solo = calculateTruckLoading(
      input({ vehiclePreset: "solo-truck", rows: [row({ lengthCm: 100, widthCm: 100, quantity: 1 })] }),
    );
    const semi = calculateTruckLoading(
      input({ rows: [row({ lengthCm: 100, widthCm: 100, quantity: 1 })] }),
    );

    expect(solo!.utilizationNotes.some((note) => note.includes("typische Richtwerte"))).toBe(true);
    expect(semi!.utilizationNotes.some((note) => note.includes("typische Richtwerte"))).toBe(false);
  });

  it("7. classifies more than 100% floor utilization as 'passt nicht' (no 'passt knapp' band above 100%)", () => {
    // 30 Industriepaletten = 36 sqm > 32.64 sqm floor area of the standard trailer.
    const result = calculateTruckLoading(
      input({ rows: [row({ lengthCm: 120, widthCm: 100, quantity: 30 })] }),
    );

    expect(result!.floorAreaUtilizationPercent).toBeGreaterThan(100);
    expect(result!.vehicleSuitability).toBe("passt nicht");
  });

  it("8. classifies 85-100% floor utilization as 'passt knapp'", () => {
    // 30 Europaletten = 28.8 sqm = 88.24 % of 32.64 sqm.
    const result = calculateTruckLoading(
      input({ rows: [row({ lengthCm: 120, widthCm: 80, quantity: 30 })] }),
    );

    expect(result!.floorAreaUtilizationPercent).toBe(88.24);
    expect(result!.vehicleSuitability).toBe("passt knapp");
  });

  it("9. classifies suitability as 'passt nicht' when total weight exceeds max payload, even with low floor usage", () => {
    const result = calculateTruckLoading(
      input({
        vehiclePreset: "custom",
        vehicleDimensions: { lengthCm: 1360, widthCm: 240, maxPayloadKg: 1000 },
        rows: [row({ lengthCm: 120, widthCm: 80, quantity: 1, weightKg: 1500 })],
      }),
    );

    expect(result!.vehicleSuitability).toBe("passt nicht");
    expect(
      result!.utilizationNotes.some((note) => note.includes("übersteigt die Kapazität")),
    ).toBe(true);
  });

  it("10. flags a single item whose own footprint already exceeds the vehicle floor area", () => {
    const result = calculateTruckLoading(
      input({
        rows: [row({ name: "Übergroße Maschine", lengthCm: 1500, widthCm: 300, quantity: 1 })],
      }),
    );

    expect(result!.itemsNotFitting).toContain("Übergroße Maschine");
  });

  it("11. returns null when there are no valid rows", () => {
    const allInvalid = calculateTruckLoading(
      input({ rows: [row({ lengthCm: null, widthCm: null, quantity: 1 })] }),
    );
    expect(allInvalid).toBeNull();

    const empty = calculateTruckLoading(input({ rows: [] }));
    expect(empty).toBeNull();
  });

  it("12. skips invalid rows (non-positive dimensions/quantity) but still computes valid ones", () => {
    const result = calculateTruckLoading(
      input({
        rows: [
          row({ id: "valid", lengthCm: 120, widthCm: 80, quantity: 1 }),
          row({ id: "invalid-qty", lengthCm: 120, widthCm: 80, quantity: 0 }),
          row({ id: "invalid-width", lengthCm: 120, widthCm: 0, quantity: 1 }),
        ],
      }),
    );

    expect(result!.totalLoadingMeters).toBe(0.4);
  });

  it("13. flags items that are too wide or too high even when total floor area is small", () => {
    const tooWide = calculateTruckLoading(
      input({ rows: [row({ name: "Breite Kiste", lengthCm: 300, widthCm: 260, quantity: 1 })] }),
    );
    expect(tooWide!.itemsNotFitting).toContain("Breite Kiste");
    expect(tooWide!.vehicleSuitability).toBe("passt nicht");

    const tooHigh = calculateTruckLoading(
      input({ rows: [row({ name: "Hohe Kiste", lengthCm: 120, widthCm: 80, heightCm: 290, quantity: 1 })] }),
    );
    expect(tooHigh!.itemsNotFitting).toContain("Hohe Kiste");
  });

  it("14. stacking halves the floor positions and is limited by the vehicle inner height", () => {
    const stacked = calculateTruckLoading(
      input({ rows: [row({ lengthCm: 120, widthCm: 80, heightCm: 120, quantity: 40, stackLayers: 2 })] }),
    );
    // 20 floor positions x 0.4 ldm = 8 ldm
    expect(stacked!.totalLoadingMeters).toBe(8);
    expect(stacked!.vehicleSuitability).toBe("passt");

    const clamped = calculateTruckLoading(
      input({ rows: [row({ name: "Hoch", lengthCm: 120, widthCm: 80, heightCm: 150, quantity: 10, stackLayers: 2 })] }),
    );
    // 2 x 150 cm > 270 cm inner height -> no stacking, 10 floor positions
    expect(clamped!.totalLoadingMeters).toBe(4);
    expect(clamped!.utilizationNotes.some((note) => note.includes("Innenh\u00f6he"))).toBe(true);
  });

  it("15. uses the preset payload by default and flags overweight loads", () => {
    const result = calculateTruckLoading(
      input({ rows: [row({ lengthCm: 120, widthCm: 80, quantity: 26, weightKg: 1000 })] }),
    );
    expect(result!.payloadKg).toBe(24000);
    expect(result!.weightUtilizationPercent).toBeCloseTo(108.33, 1);
    expect(result!.vehicleSuitability).toBe("passt nicht");
  });
});
