import { describe, expect, it } from "vitest";
import {
  calculateCartonsPerPallet,
  type CartonsPerPalletInput,
} from "./cartonsPerPallet";

function input(overrides: Partial<CartonsPerPalletInput> = {}): CartonsPerPalletInput {
  return {
    carton: { lengthCm: 40, widthCm: 30, heightCm: 30 },
    palletType: "euro",
    totalCartonCount: 1,
    allowRotation: true,
    ...overrides,
  };
}

describe("calculateCartonsPerPallet", () => {
  it("1. CARGOLO cross-check: 40x30x30cm carton, Euro pallet, 180cm max height -> 5 layers", () => {
    const result = calculateCartonsPerPallet(
      input({ carton: { lengthCm: 40, widthCm: 30, heightCm: 30 }, maxLoadedHeightCm: 180 }),
    );

    expect(result).not.toBeNull();
    expect(result!.layers).toBe(5); // floor((180 - 14.4) / 30) = floor(5.52) = 5
  });

  it("2. 350x250mm carton on Euro pallet (35x25cm): uniform grids give 9/8, a mixed Verbund layer gives 10", () => {
    // Uniform: laengs 3 x 3 = 9, quer 4 x 2 = 8. Mixed rows: 2 rows of 3 (70 cm)
    // + 2 rotated rows of 2 (50 cm) = 120 cm exactly -> 10 cartons.
    const result = calculateCartonsPerPallet(
      input({ carton: { lengthCm: 35, widthCm: 25, heightCm: 10 }, allowRotation: true }),
    );

    expect(result!.cartonsPerLayer).toBe(10);
    expect(result!.selectedOrientation).toContain("Verbund");
    expect(result!.layerLayout.placements).toHaveLength(10);

    const noRotation = calculateCartonsPerPallet(
      input({ carton: { lengthCm: 35, widthCm: 25, heightCm: 10 }, allowRotation: false }),
    );
    expect(noRotation!.cartonsPerLayer).toBe(9);
    expect(noRotation!.selectedOrientation).toContain("L\u00e4ngs");
  });

  it("3. 100x60x50cm carton on Industrial pallet: rotation doubles capacity (2 vs 1)", () => {
    const withRotation = calculateCartonsPerPallet(
      input({
        carton: { lengthCm: 100, widthCm: 60, heightCm: 50 },
        palletType: "industrial",
        allowRotation: true,
      }),
    );
    const withoutRotation = calculateCartonsPerPallet(
      input({
        carton: { lengthCm: 100, widthCm: 60, heightCm: 50 },
        palletType: "industrial",
        allowRotation: false,
      }),
    );

    expect(withoutRotation!.cartonsPerLayer).toBe(1);
    expect(withRotation!.cartonsPerLayer).toBe(2);
  });

  it("4. Carton larger than the pallet in both orientations yields zero capacity, no crash", () => {
    const result = calculateCartonsPerPallet(
      input({ carton: { lengthCm: 300, widthCm: 300, heightCm: 30 } }),
    );

    expect(result).not.toBeNull();
    expect(result!.cartonsPerLayer).toBe(0);
    expect(result!.cartonsPerPallet).toBe(0);
    expect(result!.palletsNeeded).toBe(0);
    expect(
      result!.utilizationNotes.some((note) => note.includes("passt bei den angegebenen Ma\u00dfen")),
    ).toBe(true);
  });

  it("5. Weight is more restrictive than height/area: caps cartonsPerPallet and flags partial top layer", () => {
    const result = calculateCartonsPerPallet(
      input({
        carton: { lengthCm: 40, widthCm: 30, heightCm: 30 },
        cartonWeightKg: 20,
        maxWeightKg: 100, // only 5 cartons by weight, vs much higher by volume
        maxLoadedHeightCm: 180,
      }),
    );

    expect(result!.cartonsPerPallet).toBe(5);
    expect(
      result!.utilizationNotes.some((note) => note.includes("Gewichtslimit begrenzt")),
    ).toBe(true);
    // 5 cartons at 6 per layer (floor(120/40)*floor(80/30)=3*2=6) -> 1 partial layer
    expect(result!.layers).toBe(1);
  });

  it("6. maxWeightKg given without cartonWeightKg: weight check skipped with a note", () => {
    const result = calculateCartonsPerPallet(
      input({ maxWeightKg: 500, maxLoadedHeightCm: 180 }),
    );

    expect(
      result!.utilizationNotes.some((note) => note.includes("Gewichtsgrenze konnte nicht gepr\u00fcft werden")),
    ).toBe(true);
  });

  it("7. Custom pallet without height treats pallet height as 0 and flags it; with height subtracts normally", () => {
    const withoutHeight = calculateCartonsPerPallet(
      input({
        palletType: "custom",
        palletDimensions: { lengthCm: 120, widthCm: 80 },
        maxLoadedHeightCm: 180,
        carton: { lengthCm: 40, widthCm: 30, heightCm: 30 },
      }),
    );
    expect(
      withoutHeight!.utilizationNotes.some((note) => note.includes("keine Palettenh\u00f6he angegeben")),
    ).toBe(true);
    expect(withoutHeight!.layers).toBe(6); // floor(180/30) = 6, no pallet height subtracted

    const withHeight = calculateCartonsPerPallet(
      input({
        palletType: "custom",
        palletDimensions: { lengthCm: 120, widthCm: 80, heightCm: 14.4 },
        maxLoadedHeightCm: 180,
        carton: { lengthCm: 40, widthCm: 30, heightCm: 30 },
      }),
    );
    expect(withHeight!.layers).toBe(5); // same as the Euro preset (14.4cm pallet height)
  });

  it("8. maxLoadedHeightCm omitted applies the 1800mm default with a note", () => {
    const result = calculateCartonsPerPallet(
      input({ carton: { lengthCm: 40, widthCm: 30, heightCm: 30 } }),
    );

    expect(result!.layers).toBe(5); // same as explicit 180cm case
    expect(
      result!.utilizationNotes.some((note) => note.includes("g\u00e4ngige Logistik-Richtwert")),
    ).toBe(true);
  });

  it("9. Small order (less than one pallet's capacity) still reports full per-pallet capacity, needs 1 pallet", () => {
    const result = calculateCartonsPerPallet(
      input({
        carton: { lengthCm: 40, widthCm: 30, heightCm: 30 },
        maxLoadedHeightCm: 180,
        totalCartonCount: 3,
      }),
    );

    // cartonsPerLayer=8 (rotated: 4x2, since allowRotation defaults true), layers=5 -> cartonsPerPallet=40 (full capacity, not capped to 3)
    expect(result!.cartonsPerPallet).toBe(40);
    expect(result!.palletsNeeded).toBe(1);
  });

  it("10. Large order requiring multiple pallets computes palletsNeeded via ceiling division", () => {
    const result = calculateCartonsPerPallet(
      input({
        carton: { lengthCm: 40, widthCm: 30, heightCm: 30 },
        maxLoadedHeightCm: 180,
        totalCartonCount: 90, // cartonsPerPallet = 40 -> ceil(90/40) = 3
      }),
    );

    expect(result!.cartonsPerPallet).toBe(40);
    expect(result!.palletsNeeded).toBe(3);
  });

  it("11. Square carton gives identical cartonsPerLayer in both orientations", () => {
    const result = calculateCartonsPerPallet(
      input({ carton: { lengthCm: 40, widthCm: 40, heightCm: 20 }, allowRotation: true }),
    );
    const noRotation = calculateCartonsPerPallet(
      input({ carton: { lengthCm: 40, widthCm: 40, heightCm: 20 }, allowRotation: false }),
    );

    expect(result!.cartonsPerLayer).toBe(noRotation!.cartonsPerLayer);
  });

  it("12. Missing/invalid carton dimensions or non-positive totalCartonCount returns null", () => {
    expect(
      calculateCartonsPerPallet(input({ carton: { lengthCm: 0, widthCm: 30, heightCm: 30 } })),
    ).toBeNull();
    expect(calculateCartonsPerPallet(input({ totalCartonCount: 0 }))).toBeNull();
    expect(
      calculateCartonsPerPallet(
        input({ palletType: "custom", palletDimensions: undefined }),
      ),
    ).toBeNull();
  });

  it("13. Rotation disabled uses only the as-entered orientation even when rotating would yield more", () => {
    const result = calculateCartonsPerPallet(
      input({
        carton: { lengthCm: 100, widthCm: 60, heightCm: 50 },
        palletType: "industrial",
        allowRotation: false,
      }),
    );

    expect(result!.cartonsPerLayer).toBe(1);
    expect(result!.selectedOrientation).toContain("L\u00e4ngs");
  });

  it("14. Large totalCartonCount with a small carton scales palletsNeeded correctly", () => {
    const result = calculateCartonsPerPallet(
      input({
        carton: { lengthCm: 20, widthCm: 15, heightCm: 10 },
        maxLoadedHeightCm: 180,
        totalCartonCount: 100000,
      }),
    );

    expect(result!.palletsNeeded).toBeGreaterThan(0);
    expect(Number.isFinite(result!.palletsNeeded)).toBe(true);
  });

  it("15. Industriepalette uses its own deck height (16,2 cm), Halbpalette is supported", () => {
    const industrial = calculateCartonsPerPallet(
      input({ palletType: "industrial", carton: { lengthCm: 40, widthCm: 30, heightCm: 30 } }),
    );
    // (180 - 16.2) / 30 = 5.46 -> 5 layers; loaded height 16.2 + 150
    expect(industrial!.layers).toBe(5);
    expect(industrial!.loadedHeightCm).toBe(166.2);

    const half = calculateCartonsPerPallet(
      input({ palletType: "half", carton: { lengthCm: 40, widthCm: 30, heightCm: 30 } }),
    );
    // 80 x 60 pallet: 2 x 2 = 4 per layer
    expect(half!.cartonsPerLayer).toBe(4);
  });
});
