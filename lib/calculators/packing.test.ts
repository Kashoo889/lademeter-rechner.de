import { describe, expect, it } from "vitest";
import { packRectangles } from "./packing";

describe("packRectangles", () => {
  it("uses only the as-entered orientation without rotation", () => {
    const result = packRectangles(1360, 240, 120, 80, false);
    expect(result.count).toBe(33);
    expect(result.pattern).toBe("laengs");
  });

  it("prefers the simpler pattern on ties", () => {
    const result = packRectangles(1200, 800, 120, 80, true);
    expect(result.count).toBe(100);
    expect(result.pattern).toBe("laengs");
  });

  it("never places items outside the container or overlapping", () => {
    const cases: [number, number, number, number][] = [
      [1360, 240, 120, 80],
      [589, 235, 120, 80],
      [770, 245, 120, 100],
      [120, 80, 35, 25],
      [120, 100, 37, 23],
    ];
    for (const [L, W, l, w] of cases) {
      const { placements } = packRectangles(L, W, l, w, true);
      for (const [i, a] of placements.entries()) {
        expect(a.x + a.lengthCm).toBeLessThanOrEqual(L + 1e-6);
        expect(a.y + a.widthCm).toBeLessThanOrEqual(W + 1e-6);
        for (const b of placements.slice(i + 1)) {
          const overlap =
            a.x < b.x + b.lengthCm - 1e-6 &&
            b.x < a.x + a.lengthCm - 1e-6 &&
            a.y < b.y + b.widthCm - 1e-6 &&
            b.y < a.y + a.widthCm - 1e-6;
          expect(overlap).toBe(false);
        }
      }
    }
  });

  it("returns zero placements when the item does not fit", () => {
    expect(packRectangles(100, 100, 120, 80, true).count).toBe(0);
  });
});
