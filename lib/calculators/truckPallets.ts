/**
 * LKW/Pallet capacity calculation.
 *
 * For a rectangular loading area (vehicle length x width) and a rectangular
 * pallet footprint the best supported loading pattern is searched (see
 * lib/calculators/packing.ts):
 *
 * - without rotation: only the pallets exactly as entered ("laengs")
 * - with rotation: "laengs", "quer", mixed rows and mixed lanes
 *
 * For a 13.6 x 2.4 m standard semi-trailer this reproduces the widely
 * published figures of 33 Europaletten (laengs), 34 Europaletten (quer) and
 * 26 Industriepaletten, and for ISO containers the well-known 11 (20') and
 * 25 (40') Europaletten - none of these numbers is hardcoded.
 *
 * Stacking is only applied when the user explicitly allows it AND enters the
 * loaded pallet height; the number of layers is then limited by the vehicle's
 * inner height and by the user-defined maximum number of layers.
 *
 * The loading-meter equivalent uses ldm = (length_m * width_m) / 2.4 per
 * occupied floor position.
 */

import { packRectangles, type PackingPattern, type Placement } from "@/lib/calculators/packing";
import { PALLETS, type PalletPreset } from "@/lib/calculators/pallets";
import { getVehicle, vehicleBasisNote, type VehiclePreset } from "@/lib/calculators/vehicles";

export type { VehiclePreset } from "@/lib/calculators/vehicles";

export type PalletType = PalletPreset | "custom";

/**
 * Always expressed in centimeters (see the `Cm` field suffix) - units are
 * never inferred from a numeric value's magnitude anywhere in this module.
 */
export type PlanDimensions = {
  lengthCm: number;
  widthCm: number;
};

export type TruckPalletsInput = {
  vehiclePreset: VehiclePreset;
  /** Required when vehiclePreset === "custom". heightCm is optional. */
  vehicleDimensions?: PlanDimensions & { heightCm?: number };
  palletType: PalletType;
  /** Required when palletType === "custom". */
  palletDimensions?: PlanDimensions;
  palletCount: number;
  allowRotation: boolean;
  allowStacking: boolean;
  /** Total height of one loaded pallet (incl. pallet) in cm - required for stacking. */
  loadedPalletHeightCm?: number | null;
  /** Maximum layers the goods allow (default 2). */
  maxStackLayers?: number | null;
};

export type TruckPalletsLayout = {
  vehicleLengthCm: number;
  vehicleWidthCm: number;
  /** Floor positions actually occupied by the requested pallets. */
  placements: Placement[];
  /** Pallets per occupied floor position (1 = not stacked). */
  layers: number;
};

export type TruckPalletsResult = {
  /** Requested pallets actually placed = min(palletCount, maxCapacity). */
  palletPositions: number;
  /** The vehicle's total capacity for this pallet type and the rules chosen, independent of palletCount. */
  maxCapacity: number;
  /** Floor positions (stellplätze) available in the selected pattern. */
  floorPositions: number;
  /** Floor positions occupied by the placed pallets. */
  usedFloorPositions: number;
  /** Pallets stacked per floor position (1 = not stacked). */
  layers: number;
  pattern: PackingPattern;
  /** Footprint of the occupied floor positions only. */
  usedFloorAreaSqm: number;
  remainingFloorAreaSqm: number;
  loadingMetersEquivalent: number;
  utilizationPercent: number;
  /** Pallets that do not fit (0 when everything fits). */
  overflowPallets: number;
  layout: TruckPalletsLayout;
  utilizationNotes: string[];
};

/** Standard reference loading width used for the Lademeter-equivalent conversion. */
const LADEMETER_REFERENCE_WIDTH_M = 2.4;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isPositiveFinite(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

type ResolvedVehicle = { lengthCm: number; widthCm: number; heightCm: number | null };

function resolveVehicle(input: TruckPalletsInput): ResolvedVehicle | null {
  if (input.vehiclePreset === "custom") {
    const dims = input.vehicleDimensions;
    if (!dims || !isPositiveFinite(dims.lengthCm) || !isPositiveFinite(dims.widthCm)) return null;
    return {
      lengthCm: dims.lengthCm,
      widthCm: dims.widthCm,
      heightCm: isPositiveFinite(dims.heightCm) ? dims.heightCm : null,
    };
  }
  const spec = getVehicle(input.vehiclePreset);
  if (!spec) return null;
  return { lengthCm: spec.lengthCm, widthCm: spec.widthCm, heightCm: spec.heightCm };
}

function resolvePallet(input: TruckPalletsInput): PlanDimensions | null {
  if (input.palletType === "custom") {
    const dims = input.palletDimensions;
    if (!dims || !isPositiveFinite(dims.lengthCm) || !isPositiveFinite(dims.widthCm)) return null;
    return dims;
  }
  const preset = PALLETS[input.palletType];
  return preset ? { lengthCm: preset.lengthCm, widthCm: preset.widthCm } : null;
}

/**
 * Computes how many pallets of the given type fit in the given vehicle's
 * loading area, and how much of the requested `palletCount` is actually
 * placed. Returns `null` when required dimensions cannot be resolved or
 * `palletCount` is invalid.
 */
export function calculateTruckPallets(input: TruckPalletsInput): TruckPalletsResult | null {
  const vehicle = resolveVehicle(input);
  const pallet = resolvePallet(input);

  if (!vehicle || !pallet || !isPositiveFinite(input.palletCount)) {
    return null;
  }

  const packing = packRectangles(
    vehicle.lengthCm,
    vehicle.widthCm,
    pallet.lengthCm,
    pallet.widthCm,
    input.allowRotation,
  );
  const floorPositions = packing.count;

  const utilizationNotes: string[] = [
    "Die tatsächliche Beladung kann in der Praxis abweichen, u. a. durch Überhang, Ladungssicherung, Mischladung und die genaue Innenausstattung des jeweiligen Fahrzeugs.",
  ];

  // Stacking: only with an explicit loaded-pallet height.
  let layers = 1;
  if (input.allowStacking) {
    const maxLayers = isPositiveFinite(input.maxStackLayers) ? Math.max(1, Math.floor(input.maxStackLayers)) : 2;
    if (!isPositiveFinite(input.loadedPalletHeightCm)) {
      utilizationNotes.push(
        "Die Option „Stapeln erlauben“ wurde nicht platzsparend angerechnet, weil keine Höhe der beladenen Palette angegeben wurde. Geben Sie die Ladungshöhe an, um die Stapelung zu berücksichtigen.",
      );
    } else if (vehicle.heightCm === null) {
      utilizationNotes.push(
        "Die Option „Stapeln erlauben“ wurde nicht angerechnet, weil für das benutzerdefinierte Fahrzeug keine Innenhöhe angegeben wurde.",
      );
    } else {
      const byHeight = Math.floor(vehicle.heightCm / input.loadedPalletHeightCm + 1e-9);
      layers = Math.max(1, Math.min(maxLayers, byHeight));
      if (byHeight < 2) {
        utilizationNotes.push(
          `Bei einer Ladungshöhe von ${round2(input.loadedPalletHeightCm)} cm und einer Innenhöhe von ${vehicle.heightCm} cm ist keine zweite Lage möglich.`,
        );
      } else {
        utilizationNotes.push(
          `Gestapelt in ${layers} Lagen (Innenhöhe ${vehicle.heightCm} cm, Palettenhöhe ${round2(input.loadedPalletHeightCm)} cm, max. ${maxLayers} Lagen). Prüfen Sie Stapelbarkeit, Druckbelastbarkeit und Ladungssicherung der Ware.`,
        );
      }
    }
  }

  const maxCapacity = floorPositions * layers;
  const palletPositions = Math.min(input.palletCount, maxCapacity);
  const usedFloorPositions = Math.min(floorPositions, Math.ceil(palletPositions / layers));
  const overflowPallets = Math.max(0, input.palletCount - maxCapacity);

  const palletFootprintSqm = (pallet.lengthCm / 100) * (pallet.widthCm / 100);
  const vehicleFloorAreaSqm = (vehicle.lengthCm / 100) * (vehicle.widthCm / 100);
  const usedFloorAreaSqm = usedFloorPositions * palletFootprintSqm;

  if (floorPositions > 0) {
    utilizationNotes.push(`Ermittelte Anordnung: ${packing.description}.`);
  }

  if (
    packing.pattern !== "laengs" &&
    floorPositions === 34 &&
    input.vehiclePreset === "standard-semi-trailer" &&
    input.palletType === "euro"
  ) {
    utilizationNotes.push(
      "Die rechnerische Maximalkapazität von 34 Europaletten ist ein theoretisches Optimum ohne Spielraum. In der Praxis gilt bei Standard-Sattelzügen häufig eine Anordnung mit 33 Europaletten (längs) als gängiger Planungsrichtwert, u. a. wegen Rangierspiel und Ladungssicherung.",
    );
  }

  if (floorPositions === 0) {
    utilizationNotes.push(
      "Die angegebene Palette passt bei den gewählten Maßen in keiner Ausrichtung auf die gewählte Ladefläche.",
    );
  } else if (overflowPallets > 0) {
    utilizationNotes.push(
      `Von den gewünschten ${input.palletCount} Paletten passen maximal ${maxCapacity} auf die gewählte Ladefläche. Für die restlichen ${overflowPallets} Paletten wird zusätzliche Kapazität benötigt.`,
    );
  }

  const spec = getVehicle(input.vehiclePreset);
  if (spec) {
    const note = vehicleBasisNote(spec);
    if (note) utilizationNotes.push(note);
  }

  return {
    palletPositions,
    maxCapacity,
    floorPositions,
    usedFloorPositions,
    layers,
    pattern: packing.pattern,
    usedFloorAreaSqm: round2(usedFloorAreaSqm),
    remainingFloorAreaSqm: round2(vehicleFloorAreaSqm - usedFloorAreaSqm),
    loadingMetersEquivalent: round2((usedFloorPositions * palletFootprintSqm) / LADEMETER_REFERENCE_WIDTH_M),
    utilizationPercent: round2((usedFloorAreaSqm / vehicleFloorAreaSqm) * 100),
    overflowPallets,
    layout: {
      vehicleLengthCm: vehicle.lengthCm,
      vehicleWidthCm: vehicle.widthCm,
      placements: packing.placements.slice(0, usedFloorPositions),
      layers,
    },
    utilizationNotes,
  };
}
