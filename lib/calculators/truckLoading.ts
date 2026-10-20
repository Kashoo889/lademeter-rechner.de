/**
 * LKW Beladungsrechner - combined plausibility check of several cargo rows
 * against one vehicle.
 *
 * Per row:
 *   layers         = stackLayers (>= 1), limited by vehicle inner height / row height when both are known
 *   floorPositions = ceil(quantity / layers)
 *   ldm            = (length_m * width_m) / 2.4 * floorPositions
 *   floor area     = length_m * width_m * floorPositions
 *
 * Fit checks:
 *   - geometry: every single item must fit the loading area in at least one
 *     horizontal orientation and (if heights are known) under the roof
 *   - floor area: sum of occupied floor area vs. vehicle floor area
 *   - weight: total weight vs. payload (user value or preset default)
 *   - volume: total volume vs. inner volume (informational)
 *
 * Verdict ("Fahrzeugeignung"):
 *   "passt nicht"  - an item does not fit geometrically, floor area > 100 %, or weight > payload
 *   "passt knapp"  - floor area > 85 % or weight > 90 % of payload (arrangement must be checked)
 *   "passt"        - otherwise
 *
 * Area sums cannot prove that a concrete arrangement exists (2D packing), so
 * the verdict is an estimate - the result notes say so.
 */

import { getVehicle, vehicleBasisNote, type VehiclePreset } from "@/lib/calculators/vehicles";
import type { PlanDimensions } from "@/lib/calculators/truckPallets";

export type CargoRow = {
  id: string;
  name: string;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  quantity: number;
  weightKg: number | null;
  /** Legacy flag, informational only. Use stackLayers. */
  stackable?: boolean;
  /** Maximum layers (1 = not stackable). */
  stackLayers?: number | null;
  /** Legacy flag, informational only. */
  palletized?: boolean;
};

export type TruckLoadingInput = {
  vehiclePreset: VehiclePreset;
  /** Dimensions are required when vehiclePreset === "custom"; maxPayloadKg overrides the preset payload. */
  vehicleDimensions?: Partial<PlanDimensions> & { heightCm?: number; maxPayloadKg?: number };
  rows: CargoRow[];
};

export type TruckLoadingResult = {
  totalVolumeCbm: number;
  totalWeightKg: number;
  totalLoadingMeters: number;
  totalFloorAreaSqm: number;
  vehicleFloorAreaSqm: number;
  floorAreaUtilizationPercent: number;
  /** null when no payload is known. */
  weightUtilizationPercent: number | null;
  /** null when the vehicle height is unknown. */
  volumeUtilizationPercent: number | null;
  payloadKg: number | null;
  /** Remaining loading length in meters at full width (13.6-based for the standard trailer). */
  remainingLoadingMeters: number;
  vehicleSuitability: "passt" | "passt knapp" | "passt nicht" | "unbekannt";
  itemsNotFitting: string[];
  utilizationNotes: string[];
};

const LADEMETER_REFERENCE_WIDTH_M = 2.4;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isPositive(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function calculateTruckLoading(input: TruckLoadingInput): TruckLoadingResult | null {
  let vehicleLengthCm: number;
  let vehicleWidthCm: number;
  let vehicleHeightCm: number | null;
  let payloadKg: number | null;

  const preset = getVehicle(input.vehiclePreset);
  if (input.vehiclePreset === "custom" || !preset) {
    const dims = input.vehicleDimensions;
    if (!isPositive(dims?.lengthCm) || !isPositive(dims?.widthCm)) {
      return null;
    }
    vehicleLengthCm = dims.lengthCm;
    vehicleWidthCm = dims.widthCm;
    vehicleHeightCm = isPositive(dims.heightCm) ? dims.heightCm : null;
    payloadKg = isPositive(dims.maxPayloadKg) ? dims.maxPayloadKg : null;
  } else {
    vehicleLengthCm = preset.lengthCm;
    vehicleWidthCm = preset.widthCm;
    vehicleHeightCm = preset.heightCm;
    payloadKg = isPositive(input.vehicleDimensions?.maxPayloadKg)
      ? input.vehicleDimensions.maxPayloadKg
      : preset.payloadKg;
  }

  const vehicleFloorAreaSqm = (vehicleLengthCm / 100) * (vehicleWidthCm / 100);

  let totalLdm = 0;
  let totalFootprintSqm = 0;
  let totalVolumeCbm = 0;
  let totalWeightKg = 0;
  let missingHeightCount = 0;
  let missingWeightCount = 0;
  let validRowCount = 0;
  const itemsNotFitting: string[] = [];
  const clampedRows: string[] = [];
  let hasStacked = false;

  for (const row of input.rows) {
    if (!isPositive(row.lengthCm) || !isPositive(row.widthCm) || !(row.quantity > 0)) {
      continue;
    }

    validRowCount++;

    const lengthCm = row.lengthCm;
    const widthCm = row.widthCm;
    const heightCm = isPositive(row.heightCm) ? row.heightCm : null;
    const qty = row.quantity;
    const label = row.name.trim() || `Position ${validRowCount}`;

    // Geometry: one item must fit the floor in some orientation and under the roof.
    const fitsFloor =
      (lengthCm <= vehicleLengthCm + 1e-9 && widthCm <= vehicleWidthCm + 1e-9) ||
      (widthCm <= vehicleLengthCm + 1e-9 && lengthCm <= vehicleWidthCm + 1e-9);
    const fitsHeight = heightCm === null || vehicleHeightCm === null || heightCm <= vehicleHeightCm + 1e-9;
    if (!fitsFloor || !fitsHeight) {
      itemsNotFitting.push(label);
    }

    let layers = isPositive(row.stackLayers) ? Math.max(1, Math.floor(row.stackLayers)) : 1;
    if (layers > 1 && heightCm !== null && vehicleHeightCm !== null) {
      const byHeight = Math.max(1, Math.floor(vehicleHeightCm / heightCm + 1e-9));
      if (byHeight < layers) {
        layers = byHeight;
        clampedRows.push(label);
      }
    }
    if (layers > 1) hasStacked = true;
    const floorPositions = Math.ceil(qty / layers);

    const areaPerItemSqm = (lengthCm / 100) * (widthCm / 100);
    totalLdm += (areaPerItemSqm / LADEMETER_REFERENCE_WIDTH_M) * floorPositions;
    totalFootprintSqm += areaPerItemSqm * floorPositions;
    if (heightCm !== null) {
      totalVolumeCbm += areaPerItemSqm * (heightCm / 100) * qty;
    } else {
      missingHeightCount++;
    }
    if (isPositive(row.weightKg)) {
      totalWeightKg += row.weightKg * qty;
    } else {
      missingWeightCount++;
    }
  }

  if (validRowCount === 0) {
    return null;
  }

  const utilizationPercent = (totalFootprintSqm / vehicleFloorAreaSqm) * 100;
  const weightUtilizationPercent = payloadKg !== null ? (totalWeightKg / payloadKg) * 100 : null;
  const vehicleVolumeCbm =
    vehicleHeightCm !== null ? vehicleFloorAreaSqm * (vehicleHeightCm / 100) : null;
  const volumeUtilizationPercent =
    vehicleVolumeCbm !== null && totalVolumeCbm > 0 ? (totalVolumeCbm / vehicleVolumeCbm) * 100 : null;

  const weightExceeded = weightUtilizationPercent !== null && weightUtilizationPercent > 100;
  const areaExceeded = utilizationPercent > 100 + 1e-9;

  let vehicleSuitability: TruckLoadingResult["vehicleSuitability"];
  if (itemsNotFitting.length > 0 || areaExceeded || weightExceeded) {
    vehicleSuitability = "passt nicht";
  } else if (utilizationPercent > 85 || (weightUtilizationPercent !== null && weightUtilizationPercent > 90)) {
    vehicleSuitability = "passt knapp";
  } else {
    vehicleSuitability = "passt";
  }

  const utilizationNotes: string[] = [
    "Die Einschätzung basiert auf Grundfläche, Gewicht und Einzelmaßen aller Positionen. Ob sich die Ladung in genau dieser Kombination anordnen lässt, hängt zusätzlich von Ladungssicherung, Achslastverteilung, Ladereihenfolge und den Fahrzeuginnenmaßen ab.",
  ];

  if (itemsNotFitting.length > 0) {
    utilizationNotes.push(
      `Zu groß für das gewählte Fahrzeug (Länge, Breite oder Höhe): ${itemsNotFitting.join(", ")}.`,
    );
  }

  if (areaExceeded) {
    utilizationNotes.push(
      `Die benötigte Bodenfläche (${round2(totalFootprintSqm).toLocaleString("de-DE")} m²) ist größer als die Ladefläche des Fahrzeugs (${round2(vehicleFloorAreaSqm).toLocaleString("de-DE")} m²).`,
    );
  }

  if (weightExceeded && payloadKg !== null) {
    utilizationNotes.push(
      `Das Gesamtgewicht (${round2(totalWeightKg).toLocaleString("de-DE")} kg) übersteigt die Kapazität des gewählten Fahrzeugs (Nutzlast ${payloadKg.toLocaleString("de-DE")} kg).`,
    );
  }

  if (vehicleSuitability === "passt knapp") {
    utilizationNotes.push(
      "Die Ladung nutzt die Kapazität fast vollständig aus. Prüfen Sie die konkrete Anordnung (z. B. mit einem Ladeplan) und die Achslasten, bevor Sie das Fahrzeug disponieren.",
    );
  }

  if (hasStacked) {
    utilizationNotes.push(
      "Gestapelte Positionen belegen nur ihre Bodenstellplätze (Anzahl ÷ Lagen, aufgerundet). Stapelbarkeit, Druckbelastbarkeit und Ladungssicherung sind gesondert zu prüfen.",
    );
  }

  if (clampedRows.length > 0) {
    utilizationNotes.push(
      `Die Lagenzahl wurde wegen der Innenhöhe des Fahrzeugs reduziert bei: ${clampedRows.join(", ")}.`,
    );
  }

  if (missingHeightCount > 0) {
    utilizationNotes.push(
      `Das Gesamtvolumen ist unvollständig: ${missingHeightCount} Position(en) ohne Höhenangabe wurden nicht berücksichtigt.`,
    );
  }

  if (missingWeightCount > 0) {
    utilizationNotes.push(
      `Das Gesamtgewicht ist unvollständig: ${missingWeightCount} Position(en) ohne Gewichtsangabe wurden nicht berücksichtigt.`,
    );
  }

  if (payloadKg === null) {
    utilizationNotes.push("Ohne Angabe der Nutzlast wurde das Gewicht nicht gegen eine Fahrzeuggrenze geprüft.");
  } else if (preset && !isPositive(input.vehicleDimensions?.maxPayloadKg)) {
    utilizationNotes.push(
      `Für die Gewichtsprüfung wurde die typische Nutzlast der Fahrzeugklasse (${preset.payloadKg.toLocaleString("de-DE")} kg) verwendet. Maßgeblich ist die Nutzlast laut Fahrzeugpapieren.`,
    );
  }

  if (preset) {
    const note = vehicleBasisNote(preset);
    if (note) utilizationNotes.push(note);
  }

  const vehicleLdm = ((vehicleLengthCm / 100) * (vehicleWidthCm / 100)) / LADEMETER_REFERENCE_WIDTH_M;

  return {
    totalVolumeCbm: round2(totalVolumeCbm),
    totalWeightKg: round2(totalWeightKg),
    totalLoadingMeters: round2(totalLdm),
    totalFloorAreaSqm: round2(totalFootprintSqm),
    vehicleFloorAreaSqm: round2(vehicleFloorAreaSqm),
    floorAreaUtilizationPercent: round2(utilizationPercent),
    weightUtilizationPercent: weightUtilizationPercent !== null ? round2(weightUtilizationPercent) : null,
    volumeUtilizationPercent: volumeUtilizationPercent !== null ? round2(volumeUtilizationPercent) : null,
    payloadKg,
    remainingLoadingMeters: round2(Math.max(0, vehicleLdm - totalLdm)),
    vehicleSuitability,
    itemsNotFitting,
    utilizationNotes,
  };
}
