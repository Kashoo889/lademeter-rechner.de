import { describe, expect, it } from "vitest";
import { calculateTruckPallets, type TruckPalletsInput } from "./truckPallets";

function input(overrides: Partial<TruckPalletsInput> = {}): TruckPalletsInput {
  return {
    vehiclePreset: "standard-semi-trailer",
    palletType: "euro",
    palletCount: 1,
    allowRotation: true,
    allowStacking: false,
    ...overrides,
  };
}

describe("calculateTruckPallets", () => {
  it("1. Euro pallet, standard semi-trailer, rotation allowed, requesting more than fits caps at 34", () => {
    const result = calculateTruckPallets(input({ palletCount: 40, allowRotation: true }));

    expect(result).not.toBeNull();
    expect(result!.maxCapacity).toBe(34);
    expect(result!.palletPositions).toBe(34);
    expect(
      result!.utilizationNotes.some((note) => note.includes("passen maximal 34")),
    ).toBe(true);
  });

  it("2. Euro pallet, standard semi-trailer, rotation NOT allowed caps at 33 (orientation as entered)", () => {
    const result = calculateTruckPallets(input({ palletCount: 40, allowRotation: false }));

    expect(result!.maxCapacity).toBe(33);
    expect(result!.palletPositions).toBe(33);
  });

  it("3. Industrial pallet, standard semi-trailer, rotation allowed -> capacity 26 (cross-checked figure)", () => {
    const result = calculateTruckPallets(
      input({ palletType: "industrial", palletCount: 30, allowRotation: true }),
    );

    expect(result!.maxCapacity).toBe(26);
    expect(result!.palletPositions).toBe(26);
  });

  it("4. Requesting fewer pallets than capacity places exactly the requested count", () => {
    const result = calculateTruckPallets(input({ palletCount: 10, allowRotation: true }));

    expect(result!.maxCapacity).toBe(34);
    expect(result!.palletPositions).toBe(10);
    expect(result!.usedFloorAreaSqm).toBe(9.6);
    expect(result!.remainingFloorAreaSqm).toBe(23.04);
    expect(result!.utilizationPercent).toBeCloseTo(29.41, 1);
  });

  it("5. Custom vehicle smaller than the pallet in both orientations yields zero capacity, no crash", () => {
    const result = calculateTruckPallets(
      input({
        vehiclePreset: "custom",
        vehicleDimensions: { lengthCm: 50, widthCm: 50 },
        palletCount: 1,
      }),
    );

    expect(result!.maxCapacity).toBe(0);
    expect(result!.palletPositions).toBe(0);
    expect(
      result!.utilizationNotes.some((note) => note.includes("passt bei den gew\u00e4hlten Ma\u00dfen")),
    ).toBe(true);
  });

  it("6. Custom pallet exactly equal to vehicle dimensions fits exactly one", () => {
    const result = calculateTruckPallets(
      input({
        vehiclePreset: "custom",
        vehicleDimensions: { lengthCm: 120, widthCm: 80 },
        palletType: "custom",
        palletDimensions: { lengthCm: 120, widthCm: 80 },
        palletCount: 5,
      }),
    );

    expect(result!.maxCapacity).toBe(1);
    expect(result!.palletPositions).toBe(1);
  });

  it("7. allowStacking does not change the numbers, only adds an informational note", () => {
    const stacking = calculateTruckPallets(input({ palletCount: 5, allowStacking: true }));
    const noStacking = calculateTruckPallets(input({ palletCount: 5, allowStacking: false }));

    expect(stacking!.palletPositions).toBe(noStacking!.palletPositions);
    expect(stacking!.maxCapacity).toBe(noStacking!.maxCapacity);
    expect(stacking!.utilizationNotes.some((note) => note.includes("Stapeln erlauben"))).toBe(
      true,
    );
    expect(noStacking!.utilizationNotes.some((note) => note.includes("Stapeln erlauben"))).toBe(
      false,
    );
  });

  it("8. Missing custom dimensions returns null", () => {
    const missingVehicle = calculateTruckPallets(
      input({ vehiclePreset: "custom", vehicleDimensions: undefined }),
    );
    const missingPallet = calculateTruckPallets(
      input({ palletType: "custom", palletDimensions: undefined }),
    );

    expect(missingVehicle).toBeNull();
    expect(missingPallet).toBeNull();
  });

  it("9. Requesting exactly the max capacity fully utilizes the floor area for the perfectly-tiling orientation", () => {
    const result = calculateTruckPallets(input({ palletCount: 34, allowRotation: true }));

    expect(result!.palletPositions).toBe(34);
    expect(result!.usedFloorAreaSqm).toBe(32.64);
    expect(result!.remainingFloorAreaSqm).toBe(0);
    expect(result!.utilizationPercent).toBe(100);
  });

  it("10. loadingMetersEquivalent cross-checks against known figures", () => {
    const r34 = calculateTruckPallets(input({ palletCount: 34, allowRotation: true }));
    expect(r34!.loadingMetersEquivalent).toBe(13.6);

    const r33 = calculateTruckPallets(input({ palletCount: 33, allowRotation: false }));
    expect(r33!.loadingMetersEquivalent).toBe(13.2);

    const r26 = calculateTruckPallets(
      input({ palletType: "industrial", palletCount: 26, allowRotation: true }),
    );
    expect(r26!.loadingMetersEquivalent).toBe(13.0);
  });

  it("11. Solo-LKW preset computes with representative dimensions and flags them as typical", () => {
    const result = calculateTruckPallets(
      input({ vehiclePreset: "solo-truck", palletCount: 20, allowRotation: true }),
    );

    expect(result).not.toBeNull();
    expect(result!.maxCapacity).toBeGreaterThan(0);
    expect(
      result!.utilizationNotes.some((note) => note.includes("typische Richtwerte")),
    ).toBe(true);
  });

  it("12. Large requested count with a small custom vehicle is capped without overflow", () => {
    const result = calculateTruckPallets(
      input({
        vehiclePreset: "custom",
        vehicleDimensions: { lengthCm: 240, widthCm: 240 },
        palletCount: 10000,
        allowRotation: true,
      }),
    );

    expect(result!.palletPositions).toBe(result!.maxCapacity);
    expect(Number.isFinite(result!.palletPositions)).toBe(true);
  });

  it("13. Square custom pallet gives identical capacity in both orientations", () => {
    const result = calculateTruckPallets(
      input({
        palletType: "custom",
        palletDimensions: { lengthCm: 120, widthCm: 120 },
        palletCount: 50,
        allowRotation: true,
      }),
    );

    const noRotation = calculateTruckPallets(
      input({
        palletType: "custom",
        palletDimensions: { lengthCm: 120, widthCm: 120 },
        palletCount: 50,
        allowRotation: false,
      }),
    );

    expect(result!.maxCapacity).toBe(noRotation!.maxCapacity);
  });

  it("returns null for a non-positive palletCount", () => {
    expect(calculateTruckPallets(input({ palletCount: 0 }))).toBeNull();
    expect(calculateTruckPallets(input({ palletCount: -5 }))).toBeNull();
  });

  it("14. flags 34 as a theoretical maximum only for standard-semi-trailer + euro pallet reaching it via rotation", () => {
    const rotated34 = calculateTruckPallets(
      input({ vehiclePreset: "standard-semi-trailer", palletType: "euro", allowRotation: true, palletCount: 34 }),
    );
    expect(rotated34!.maxCapacity).toBe(34);
    expect(
      rotated34!.utilizationNotes.some((note) => note.includes("theoretisches Optimum")),
    ).toBe(true);

    const notRotated33 = calculateTruckPallets(
      input({ vehiclePreset: "standard-semi-trailer", palletType: "euro", allowRotation: false, palletCount: 33 }),
    );
    expect(notRotated33!.maxCapacity).toBe(33);
    expect(
      notRotated33!.utilizationNotes.some((note) => note.includes("theoretisches Optimum")),
    ).toBe(false);

    const industrialRotated = calculateTruckPallets(
      input({ vehiclePreset: "standard-semi-trailer", palletType: "industrial", allowRotation: true, palletCount: 26 }),
    );
    expect(
      industrialRotated!.utilizationNotes.some((note) => note.includes("theoretisches Optimum")),
    ).toBe(false);

    const customVehicleSameSize = calculateTruckPallets(
      input({
        vehiclePreset: "custom",
        vehicleDimensions: { lengthCm: 1360, widthCm: 240 },
        palletType: "euro",
        allowRotation: true,
        palletCount: 34,
      }),
    );
    expect(
      customVehicleSameSize!.utilizationNotes.some((note) => note.includes("theoretisches Optimum")),
    ).toBe(false);
  });

  it("15. custom dimensions are always interpreted as centimeters, never inferred from magnitude", () => {
    // Vehicle 1200x800 cm (=12x8 m) with a 120x80 cm (=1.2x0.8 m) custom pallet
    // - a 10x scale-up of the standard-trailer/Euro-pallet case. If units were
    // ever confused (e.g. cm treated as m), this would silently produce wrong
    // results instead of the deterministic, arithmetic-consistent ones below.
    const result = calculateTruckPallets(
      input({
        vehiclePreset: "custom",
        vehicleDimensions: { lengthCm: 1200, widthCm: 800 },
        palletType: "custom",
        palletDimensions: { lengthCm: 120, widthCm: 80 },
        palletCount: 1000,
        allowRotation: true,
      }),
    );

    // orientation A: floor(12/1.2)=10 rows * floor(8/0.8)=10 per row = 100
    // orientation B: floor(12/0.8)=15 rows * floor(8/1.2)=6 per row = 90
    expect(result!.maxCapacity).toBe(100);
    expect(result!.usedFloorAreaSqm).toBe(96);
  });

  it("16. mixed patterns reproduce known container and swap-body figures", () => {
    // 20' container (589 x 235 cm): 4 laengs + 7 quer lanes = 11 Europaletten
    expect(calculateTruckPallets(input({ vehiclePreset: "container-20", palletCount: 1 }))!.maxCapacity).toBe(11);
    // 40' container (1203 x 235 cm): 10 + 15 = 25 Europaletten
    expect(calculateTruckPallets(input({ vehiclePreset: "container-40", palletCount: 1 }))!.maxCapacity).toBe(25);
    // Wechselbruecke C 7.82 (770 cm): 5 rows laengs + 2 rows quer = 19 Europaletten
    expect(calculateTruckPallets(input({ vehiclePreset: "swap-body-782", palletCount: 1 }))!.maxCapacity).toBe(19);
    // Wechselbruecke C 7.45 (730 cm): 18 Europaletten
    expect(calculateTruckPallets(input({ vehiclePreset: "swap-body-745", palletCount: 1 }))!.maxCapacity).toBe(18);
  });

  it("17. returns a layout with exactly the occupied floor positions inside the vehicle", () => {
    const result = calculateTruckPallets(input({ palletCount: 20 }));
    expect(result!.layout.placements).toHaveLength(20);
    for (const p of result!.layout.placements) {
      expect(p.x + p.lengthCm).toBeLessThanOrEqual(1360 + 1e-6);
      expect(p.y + p.widthCm).toBeLessThanOrEqual(240 + 1e-6);
    }
  });

  it("18. stacking with a loaded height doubles capacity within the inner height", () => {
    const result = calculateTruckPallets(
      input({ allowRotation: false, allowStacking: true, loadedPalletHeightCm: 120, palletCount: 66 }),
    );
    expect(result!.layers).toBe(2);
    expect(result!.maxCapacity).toBe(66);
    expect(result!.usedFloorPositions).toBe(33);

    const tooHigh = calculateTruckPallets(
      input({ allowRotation: false, allowStacking: true, loadedPalletHeightCm: 150, palletCount: 66 }),
    );
    expect(tooHigh!.layers).toBe(1);
    expect(tooHigh!.overflowPallets).toBe(33);
  });
});
