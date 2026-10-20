/**
 * Cartons-per-pallet calculation.
 *
 * Methodology (verified against 9 independent sources, several of them live
 * calculator tools whose published formulas were compared line-by-line - see
 * the plan "Kartons-pro-Palette Rechner - Calculation Methodology &
 * Implementation Design" for the full research, citations, and cross-checked
 * worked examples):
 *
 *   cartonsPerLayer = floor(palletLength / cartonLength) * floor(palletWidth / cartonWidth)
 *
 * for the as-entered orientation. When rotation is allowed, the rotated grid
 * and the two mixed block patterns of lib/calculators/packing.ts are tested
 * as well (e.g. a 35 x 25 cm carton gives 10 instead of 9 per Euro-pallet
 * layer with two rows rotated). This is the same packing module used by
 * lib/calculators/truckPallets.ts.
 *
 *   availableCartonHeight = maxLoadedHeightCm - palletHeightCm
 *   layersByHeight = floor(availableCartonHeight / cartonHeight)
 *
 * `maxLoadedHeightCm` is treated as INCLUSIVE of the pallet's own height,
 * matching this site's already-published copy ("Gesamthoehe von Palette und
 * Ladung") and directly matching CARGOLO's own published formula text:
 * "Schichten = floor((180cm - 14,4cm) / Packhoehe)". When left blank, a
 * well-documented 1800mm (inkl. Palette) road-transport default is applied
 * (cited by multiple independent sources) and flagged with a note - this is
 * a transparent default, never a silent one.
 *
 * Weight cap: when both maxWeightKg and cartonWeightKg are known,
 * `maxCartonsByWeight = floor(maxWeightKg / cartonWeightKg)` and
 * `cartonsPerPallet = min(cartonsPerLayer * layersByHeight, maxCartonsByWeight)`.
 * The reported `layers` is then `ceil(cartonsPerPallet / cartonsPerLayer)` so
 * a weight-truncated partial top layer is reflected correctly (documented
 * behaviour from a real tool, toolszone.net) rather than always reporting the
 * height-only layer count.
 *
 * Overhang: ZERO overhang is assumed. Sources disagree by an order of
 * magnitude on acceptable overhang (0mm to 150mm depending on context), so no
 * specific numeric allowance is encoded - this also matches what the
 * standard floor-based grid formula already produces by construction.
 *
 * Deliberately NOT implemented in this version:
 * - Irregular "pinwheel" layer patterns (full 2D bin-packing).
 * - Stacking stability / Box Compression Test / load securing - informational
 *   notes only.
 */

import { floorDiv, packRectangles, type Placement } from "@/lib/calculators/packing";
import { PALLETS, type PalletPreset } from "@/lib/calculators/pallets";

export type CartonDimensions = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

/**
 * Local type (not imported from truckPallets.ts) so a custom pallet's own
 * height can be captured without modifying the completed truckPallets.ts
 * module. Only needed for palletType === "custom" - Euro/Industrial presets
 * get their verified height automatically.
 */
export type CustomPalletDimensions = {
  lengthCm: number;
  widthCm: number;
  /**
   * Optional. If omitted for a custom pallet, its height is treated as 0
   * (unknown) and a result note explains that the max-height figure is then
   * interpreted as carton-stack-only height for that calculation.
   */
  heightCm?: number;
};

export type CartonsPerPalletInput = {
  carton: CartonDimensions;
  cartonWeightKg?: number | null;
  palletType: PalletPreset | "custom";
  /** Required when palletType === "custom". */
  palletDimensions?: CustomPalletDimensions;
  maxLoadedHeightCm?: number | null;
  maxWeightKg?: number | null;
  totalCartonCount: number;
  allowRotation: boolean;
};

export type CartonsPerPalletResult = {
  cartonsPerLayer: number;
  layers: number;
  cartonsPerPallet: number;
  palletsNeeded: number;
  loadedHeightCm: number;
  totalWeightKg: number;
  utilizationPercent: number;
  selectedOrientation: string;
  /** Carton positions of one full layer (x along pallet length, y along pallet width, cm). */
  layerLayout: { palletLengthCm: number; palletWidthCm: number; placements: Placement[] };
  utilizationNotes: string[];
};

/** Well-documented road-transport "logistics standard" default, inclusive of the pallet - only applied when the user leaves maxLoadedHeightCm blank. */
const DEFAULT_MAX_LOADED_HEIGHT_CM = 180;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isPositiveFinite(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

type ResolvedPallet = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  heightKnown: boolean;
};

function resolvePallet(
  palletType: PalletPreset | "custom",
  custom: CustomPalletDimensions | undefined,
): ResolvedPallet | null {
  if (palletType === "custom") {
    if (!custom || !isPositiveFinite(custom.lengthCm) || !isPositiveFinite(custom.widthCm)) {
      return null;
    }
    const heightKnown = isPositiveFinite(custom.heightCm);
    return {
      lengthCm: custom.lengthCm,
      widthCm: custom.widthCm,
      heightCm: heightKnown ? (custom.heightCm as number) : 0,
      heightKnown,
    };
  }

  const preset = PALLETS[palletType];
  if (!preset) return null;
  return { lengthCm: preset.lengthCm, widthCm: preset.widthCm, heightCm: preset.heightCm, heightKnown: true };
}

/**
 * Computes cartons per layer/pallet, layers, pallets needed, loaded height,
 * weight and utilization for a given carton/pallet combination. Returns
 * `null` when required dimensions cannot be resolved (e.g. a "custom" pallet
 * missing length/width) or `totalCartonCount` is invalid.
 */
export function calculateCartonsPerPallet(
  input: CartonsPerPalletInput,
): CartonsPerPalletResult | null {
  const { carton } = input;

  if (
    !isPositiveFinite(carton.lengthCm) ||
    !isPositiveFinite(carton.widthCm) ||
    !isPositiveFinite(carton.heightCm) ||
    !isPositiveFinite(input.totalCartonCount)
  ) {
    return null;
  }

  const pallet = resolvePallet(input.palletType, input.palletDimensions);
  if (!pallet) {
    return null;
  }

  const packing = packRectangles(
    pallet.lengthCm,
    pallet.widthCm,
    carton.lengthCm,
    carton.widthCm,
    input.allowRotation,
  );
  const cartonsPerLayer = packing.count;
  const patternLabel: Record<typeof packing.pattern, string> = {
    laengs: "Längs",
    quer: "Gedreht (quer)",
    reihen: "Verbund",
    spuren: "Verbund",
  };
  const selectedOrientation = `${patternLabel[packing.pattern]}: ${packing.description}`;
  const layerLayout = {
    palletLengthCm: pallet.lengthCm,
    palletWidthCm: pallet.widthCm,
    placements: packing.placements,
  };

  const utilizationNotes: string[] = [
    "Diese Berechnung modelliert keine Ladungssicherung, Kartonstabilit\u00e4t (z. B. Box Compression Test) oder Verzahnung der Lagen \u2013 pr\u00fcfen Sie dies gesondert.",
    "Es wird kein \u00dcberstand der Kartons \u00fcber den Palettenrand hinaus angenommen (b\u00fcndiger Sitz). Reale Toleranzen variieren je nach Frachtf\u00fchrer/Lager.",
  ];

  if (cartonsPerLayer === 0) {
    utilizationNotes.push(
      "Der Karton passt bei den angegebenen Ma\u00dfen in keiner Ausrichtung auf diese Palette.",
    );
    return {
      cartonsPerLayer: 0,
      layers: 0,
      cartonsPerPallet: 0,
      palletsNeeded: 0,
      loadedHeightCm: round2(pallet.heightCm),
      totalWeightKg: 0,
      utilizationPercent: 0,
      selectedOrientation,
      layerLayout,
      utilizationNotes,
    };
  }

  utilizationNotes.push(`Ermittelte Ausrichtung: ${selectedOrientation}.`);

  let maxLoadedHeightCm: number;
  let usedDefaultHeight = false;
  if (isPositiveFinite(input.maxLoadedHeightCm)) {
    maxLoadedHeightCm = input.maxLoadedHeightCm;
  } else {
    maxLoadedHeightCm = DEFAULT_MAX_LOADED_HEIGHT_CM;
    usedDefaultHeight = true;
  }

  if (!pallet.heightKnown) {
    utilizationNotes.push(
      "F\u00fcr die benutzerdefinierte Palette wurde keine Palettenh\u00f6he angegeben; die maximale Stapelh\u00f6he wird daher als reine Kartonstapelh\u00f6he behandelt (Palette nicht abgezogen).",
    );
  }

  if (usedDefaultHeight) {
    utilizationNotes.push(
      `Da keine maximale Stapelh\u00f6he angegeben wurde, wurde der g\u00e4ngige Logistik-Richtwert von ${DEFAULT_MAX_LOADED_HEIGHT_CM} cm (inkl. Palette) f\u00fcr den Stra\u00dfentransport verwendet \u2013 kein gesetzlicher Grenzwert. Geben Sie einen eigenen Wert an, falls abweichend.`,
    );
  }

  const availableCartonHeightCm = Math.max(0, maxLoadedHeightCm - pallet.heightCm);
  const layersByHeight = floorDiv(availableCartonHeightCm, carton.heightCm);

  let maxByWeight = Number.POSITIVE_INFINITY;
  const hasMaxWeight = isPositiveFinite(input.maxWeightKg);
  const hasCartonWeight = isPositiveFinite(input.cartonWeightKg);
  if (hasMaxWeight && hasCartonWeight) {
    maxByWeight = floorDiv(input.maxWeightKg as number, input.cartonWeightKg as number);
  } else if (hasMaxWeight !== hasCartonWeight) {
    utilizationNotes.push(
      "Die Gewichtsgrenze konnte nicht gepr\u00fcft werden, da entweder das maximale Gewicht oder das Kartongewicht fehlt.",
    );
  }

  const cartonsPerPalletByVolume = cartonsPerLayer * layersByHeight;
  const cartonsPerPallet = Math.min(cartonsPerPalletByVolume, maxByWeight);
  const weightIsBinding = cartonsPerPallet < cartonsPerPalletByVolume;

  if (weightIsBinding) {
    utilizationNotes.push(
      "Das Gewichtslimit begrenzt die Kartonanzahl st\u00e4rker als H\u00f6he/Fl\u00e4che \u2013 die oberste Lage kann daher nur teilweise gef\u00fcllt sein.",
    );
  }

  const layers = cartonsPerPallet > 0 ? Math.ceil(cartonsPerPallet / cartonsPerLayer) : 0;
  const loadedHeightCm = round2(pallet.heightCm + layers * carton.heightCm);
  const palletsNeeded = cartonsPerPallet > 0 ? Math.ceil(input.totalCartonCount / cartonsPerPallet) : 0;

  let totalWeightKg = 0;
  if (hasCartonWeight) {
    totalWeightKg = round2(cartonsPerPallet * (input.cartonWeightKg as number));
  } else {
    utilizationNotes.push("Kein Kartongewicht angegeben \u2013 Gesamtgewicht ist nicht vollst\u00e4ndig.");
  }

  // A max loaded height is always resolved at this point (user-given or the
  // documented 180 cm default), so utilization is always volumetric
  // (area x height), matching the site's own "Grundfl\u00e4che und H\u00f6he" definition.
  const palletFootprintCm2 = pallet.lengthCm * pallet.widthCm;
  const cartonFootprintCm2 = carton.lengthCm * carton.widthCm;
  const cartonVolumeCm3 = cartonFootprintCm2 * carton.heightCm;
  const availableVolumeCm3 = palletFootprintCm2 * availableCartonHeightCm;
  const utilizationPercent =
    availableVolumeCm3 > 0 ? round2(((cartonsPerPallet * cartonVolumeCm3) / availableVolumeCm3) * 100) : 0;

  return {
    cartonsPerLayer,
    layers,
    cartonsPerPallet,
    palletsNeeded,
    loadedHeightCm,
    totalWeightKg,
    utilizationPercent,
    selectedOrientation,
    layerLayout,
    utilizationNotes,
  };
}
