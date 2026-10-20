import { describe, expect, it } from "vitest";
import { calculateVolumeWeight } from "./volumeWeight";

const pkg = { lengthCm: 60, widthCm: 40, heightCm: 40, quantity: 1, weightKg: 10 };

describe("calculateVolumeWeight", () => {
  it("air freight divisor 6000: 60x40x40 cm = 16 kg volume weight", () => {
    const result = calculateVolumeWeight({ mode: "air", packages: [pkg] });
    expect(result!.volumeWeightKg).toBe(16);
    expect(result!.chargeableWeightKg).toBe(16);
    expect(result!.basis).toBe("volumen");
  });

  it("express divisor 5000: 19.2 kg", () => {
    expect(calculateVolumeWeight({ mode: "express", packages: [pkg] })!.volumeWeightKg).toBe(19.2);
  });

  it("real weight wins when higher", () => {
    const result = calculateVolumeWeight({ mode: "air", packages: [{ ...pkg, weightKg: 30 }] });
    expect(result!.chargeableWeightKg).toBe(30);
    expect(result!.basis).toBe("gewicht");
  });

  it("supports a custom kg/m3 factor and multiplies quantities", () => {
    const result = calculateVolumeWeight({
      mode: "custom-factor",
      kgPerCbm: 250,
      packages: [{ ...pkg, quantity: 10 }],
    });
    expect(result!.totalVolumeCbm).toBe(0.96);
    expect(result!.volumeWeightKg).toBe(240);
  });

  it("returns null without a valid factor or package", () => {
    expect(calculateVolumeWeight({ mode: "custom-divisor", packages: [pkg] })).toBeNull();
    expect(calculateVolumeWeight({ mode: "air", packages: [] })).toBeNull();
  });
});
