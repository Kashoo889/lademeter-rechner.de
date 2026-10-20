/**
 * Volumengewicht (dimensional weight) calculation.
 *
 * Carriers convert volume into a fictitious weight and bill the higher of
 * real weight and volume weight ("frachtpflichtiges Gewicht"). Two
 * conventions exist and both are supported:
 *
 * - divisor:  volumeWeightKg = (L_cm * B_cm * H_cm) / divisor
 *             e.g. 6000 (IATA air freight, = 166.67 kg/m3) or 5000 (many
 *             parcel/express services, = 200 kg/m3)
 * - factor:   volumeWeightKg = volume_m3 * kgPerCbm
 *             e.g. 1000 kg/m3 (sea freight "W/M") or carrier-specific
 *             road/groupage factors (often 150-333 kg/m3)
 *
 * Presets are orientation values only - the carrier's tariff is binding.
 * Rounding rules of individual carriers (e.g. rounding up to 0.5 kg) are not
 * applied.
 */

export type VolumeWeightMode = "air" | "express" | "sea" | "custom-divisor" | "custom-factor";

export type VolumeWeightPackage = {
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  quantity: number;
  /** Real weight per package in kg (optional). */
  weightKg: number | null;
};

export type VolumeWeightInput = {
  mode: VolumeWeightMode;
  /** Used when mode === "custom-divisor". */
  divisor?: number | null;
  /** Used when mode === "custom-factor" (kg per m3). */
  kgPerCbm?: number | null;
  packages: VolumeWeightPackage[];
};

export type VolumeWeightResult = {
  totalVolumeCbm: number;
  volumeWeightKg: number;
  realWeightKg: number;
  chargeableWeightKg: number;
  /** "volumen" when the volume weight is higher, "gewicht" otherwise. */
  basis: "volumen" | "gewicht";
  /** Effective kg per m3 used. */
  kgPerCbm: number;
  utilizationNotes: string[];
};

export const VOLUME_WEIGHT_MODES: Record<
  Exclude<VolumeWeightMode, "custom-divisor" | "custom-factor">,
  { label: string; kgPerCbm: number; description: string }
> = {
  air: {
    label: "Luftfracht (Divisor 6.000)",
    kgPerCbm: 1_000_000 / 6000,
    description: "IATA-Standard: 1 m³ entspricht 166,67 kg.",
  },
  express: {
    label: "Paket/Express (Divisor 5.000)",
    kgPerCbm: 1_000_000 / 5000,
    description: "Bei vielen Paket- und Expressdiensten üblich: 1 m³ entspricht 200 kg.",
  },
  sea: {
    label: "Seefracht (1 m³ = 1.000 kg)",
    kgPerCbm: 1000,
    description: "Seefracht-Sammelgut (LCL) nach der Regel „W/M“: 1 m³ entspricht 1 Tonne.",
  },
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isPositive(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function resolveKgPerCbm(input: VolumeWeightInput): number | null {
  switch (input.mode) {
    case "custom-divisor":
      return isPositive(input.divisor) ? 1_000_000 / input.divisor : null;
    case "custom-factor":
      return isPositive(input.kgPerCbm) ? input.kgPerCbm : null;
    default:
      return VOLUME_WEIGHT_MODES[input.mode]?.kgPerCbm ?? null;
  }
}

export function calculateVolumeWeight(input: VolumeWeightInput): VolumeWeightResult | null {
  const kgPerCbm = resolveKgPerCbm(input);
  if (kgPerCbm === null) return null;

  let volume = 0;
  let realWeight = 0;
  let valid = 0;
  let missingWeight = 0;

  for (const pkg of input.packages) {
    if (!isPositive(pkg.lengthCm) || !isPositive(pkg.widthCm) || !isPositive(pkg.heightCm) || !(pkg.quantity > 0)) {
      continue;
    }
    valid++;
    volume += (pkg.lengthCm / 100) * (pkg.widthCm / 100) * (pkg.heightCm / 100) * pkg.quantity;
    if (isPositive(pkg.weightKg)) {
      realWeight += pkg.weightKg * pkg.quantity;
    } else {
      missingWeight++;
    }
  }

  if (valid === 0) return null;

  const volumeWeightKg = volume * kgPerCbm;
  const chargeable = Math.max(volumeWeightKg, realWeight);
  const notes: string[] = [
    "Der Umrechnungsfaktor ist eine Tarifregel des jeweiligen Frachtführers. Maßgeblich sind dessen Bedingungen, einschließlich Rundungsregeln und Mindestgewichten.",
  ];
  if (missingWeight > 0) {
    notes.push(
      `Für ${missingWeight} Position(en) wurde kein Gewicht angegeben. Das tatsächliche Gewicht ist daher unvollständig.`,
    );
  }

  return {
    totalVolumeCbm: round2(volume),
    volumeWeightKg: round2(volumeWeightKg),
    realWeightKg: round2(realWeight),
    chargeableWeightKg: round2(chargeable),
    basis: volumeWeightKg > realWeight ? "volumen" : "gewicht",
    kgPerCbm: round2(kgPerCbm),
    utilizationNotes: notes,
  };
}
