/**
 * Pallet presets shared by all calculators.
 *
 * - Europalette (EPAL 1 / EN 13698-1): 1200 x 800 x 144 mm
 * - Industriepalette (EPAL 2 type): 1200 x 1000 x 162 mm
 * - Halbpalette (EPAL 6 type): 800 x 600 x 144 mm
 *
 * Heights are used only where the deck height matters (cartons per pallet).
 */

export type PalletPreset = "euro" | "industrial" | "half";

export type PalletSpec = {
  id: PalletPreset;
  label: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

export const PALLETS: Record<PalletPreset, PalletSpec> = {
  euro: { id: "euro", label: "Europalette (1200 × 800 mm)", lengthCm: 120, widthCm: 80, heightCm: 14.4 },
  industrial: {
    id: "industrial",
    label: "Industriepalette (1200 × 1000 mm)",
    lengthCm: 120,
    widthCm: 100,
    heightCm: 16.2,
  },
  half: { id: "half", label: "Halbpalette (800 × 600 mm)", lengthCm: 80, widthCm: 60, heightCm: 14.4 },
};

export const PALLET_LIST: PalletSpec[] = Object.values(PALLETS);

export function isPalletPreset(value: unknown): value is PalletPreset {
  return typeof value === "string" && value in PALLETS;
}
