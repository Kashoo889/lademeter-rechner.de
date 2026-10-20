/**
 * Lademeter (loading meter) calculation.
 *
 * Methodology and external references are documented on /methodik/.
 *
 *   ldm(item) = (length_m * width_m) / 2.4
 *
 * where 2.4 m is the standard reference/usable width of a European truck
 * trailer floor. For multiple items, each item's ldm is computed
 * individually (multiplied by its quantity) and summed - this is the
 * documented industry convention, not a 2D bin-packing optimization.
 *
 * Stacking: when the user states how many layers an item may be stacked
 * (`stackLayers`, 1 = not stackable), only the floor positions count:
 *   floorPositions = ceil(quantity / stackLayers)
 *   ldm(item)      = (length_m * width_m) / 2.4 * floorPositions
 * The user is responsible for the layer count being physically possible
 * (vehicle inner height, crush resistance, load securing) - a note says so.
 * The legacy boolean `stackable` without `stackLayers` stays informational.
 *
 * Chargeable weight (frachtpflichtiges Gewicht): if a conversion factor in kg
 * per ldm is supplied, ldmWeight = ldm * factor and the chargeable weight is
 * the higher of the real total weight and ldmWeight. The factor is a tariff
 * convention of each carrier (commonly 1,500-2,000 kg/ldm), never a norm.
 *
 * Business/billing rounding (e.g. rounding up to 0.1 ldm) is NOT applied: the
 * precise value is returned.
 */

export type LademeterUnit = "mm" | "cm" | "m";

export type LademeterCargoItem = {
  length: number | null;
  width: number | null;
  height?: number | null;
  quantity: number;
  weight?: number | null;
  stackable?: boolean;
  /** Maximum layers this item may be stacked (1 = not stackable). */
  stackLayers?: number | null;
};

export type LademeterInput = {
  unit: LademeterUnit;
  items: LademeterCargoItem[];
  /** Optional carrier conversion factor in kg per Lademeter. */
  kgPerLoadingMeter?: number | null;
};

export type LademeterResult = {
  totalLoadingMeters: number;
  totalFootprintSqm: number;
  totalVolumeCbm: number;
  totalWeightKg: number;
  /** Floor positions after stacking. */
  totalFloorPositions: number;
  /** Share of a 13.6 m standard semi-trailer in percent. */
  semiTrailerSharePercent: number;
  /** ldm * factor, or null when no factor was given. */
  loadingMeterWeightKg: number | null;
  /** max(real weight, ldm weight), or null when no factor was given. */
  chargeableWeightKg: number | null;
  utilizationNotes: string[];
};

/** Standard reference loading width for European trucks/trailers, in meters. */
const REFERENCE_WIDTH_M = 2.4;

/** Loading length of a standard semi-trailer in meters (= 13.6 ldm). */
const SEMI_TRAILER_LDM = 13.6;

function toMeters(value: number, unit: LademeterUnit): number {
  switch (unit) {
    case "mm":
      return value / 1000;
    case "cm":
      return value / 100;
    case "m":
      return value;
  }
}

/** Rounds to 2 decimals - display sanity only, never business/billing rounding. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isPositiveFinite(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/**
 * Computes Lademeter, footprint, volume and weight totals for a set of
 * cargo items. Returns `null` when there is nothing valid to calculate
 * from (e.g. all items missing required fields) so the UI can keep showing
 * its placeholder state rather than a fabricated zero result.
 */
export function calculateLademeter(input: LademeterInput): LademeterResult | null {
  const { unit, items } = input;

  let rawLdm = 0;
  let rawFootprint = 0;
  let rawVolume = 0;
  let rawWeight = 0;

  let validItemCount = 0;
  let skippedInvalidCount = 0;
  let missingHeightCount = 0;
  let missingWeightCount = 0;
  let hasStackable = false;
  let hasStacked = false;
  let hasOversizedWidth = false;
  let hasOverlength = false;
  let floorPositionsTotal = 0;

  for (const item of items) {
    if (
      !isPositiveFinite(item.length) ||
      !isPositiveFinite(item.width) ||
      !isPositiveFinite(item.quantity)
    ) {
      skippedInvalidCount += 1;
      continue;
    }

    validItemCount += 1;

    const lengthM = toMeters(item.length, unit);
    const widthM = toMeters(item.width, unit);
    const quantity = item.quantity;

    if (widthM > REFERENCE_WIDTH_M) {
      hasOversizedWidth = true;
    }

    if (Math.max(lengthM, widthM) > SEMI_TRAILER_LDM) {
      hasOverlength = true;
    }

    const layers = isPositiveFinite(item.stackLayers) ? Math.max(1, Math.floor(item.stackLayers)) : 1;
    const floorPositions = Math.ceil(quantity / layers);
    if (layers > 1) hasStacked = true;
    floorPositionsTotal += floorPositions;

    const itemLdm = (lengthM * widthM) / REFERENCE_WIDTH_M;
    rawLdm += itemLdm * floorPositions;
    rawFootprint += lengthM * widthM * floorPositions;

    if (isPositiveFinite(item.height)) {
      const heightM = toMeters(item.height, unit);
      rawVolume += lengthM * widthM * heightM * quantity;
    } else {
      missingHeightCount += 1;
    }

    if (isPositiveFinite(item.weight)) {
      rawWeight += item.weight * quantity;
    } else {
      missingWeightCount += 1;
    }

    if (item.stackable && layers === 1) {
      hasStackable = true;
    }
  }

  if (validItemCount === 0) {
    return null;
  }

  const utilizationNotes: string[] = [
    "Der tats\u00e4chliche Platzbedarf kann in der Praxis abweichen, u. a. durch die Ausrichtung der Ladung, die genauen Fahrzeugma\u00dfe, \u00dcberstand, Ladungssicherung und das Zusammenspiel mit anderer Fracht.",
    "Einzelne Spediteure runden den berechneten Lademeterwert f\u00fcr die Abrechnung unter Umst\u00e4nden auf 0,1 oder ganze Lademeter auf. Dieser Rechner zeigt den genauen rechnerischen Wert ohne eine solche Aufrundung.",
  ];

  if (skippedInvalidCount > 0) {
    utilizationNotes.push(
      `${skippedInvalidCount} Position(en) mit unvollst\u00e4ndigen oder ung\u00fcltigen Angaben wurden bei der Berechnung nicht ber\u00fccksichtigt.`,
    );
  }

  if (missingHeightCount > 0) {
    utilizationNotes.push(
      `Das Gesamtvolumen ist unvollst\u00e4ndig: ${missingHeightCount} Position(en) ohne H\u00f6henangabe wurden dabei nicht ber\u00fccksichtigt.`,
    );
  }

  if (missingWeightCount > 0) {
    utilizationNotes.push(
      `Das Gesamtgewicht ist unvollst\u00e4ndig: ${missingWeightCount} Position(en) ohne Gewichtsangabe wurden dabei nicht ber\u00fccksichtigt.`,
    );
  }

  if (hasStacked) {
    utilizationNotes.push(
      "Gestapelte Positionen wurden nur mit ihren Bodenstellplätzen angerechnet (Anzahl ÷ Stapellagen, aufgerundet). Prüfen Sie, ob Innenhöhe des Fahrzeugs, Belastbarkeit der Ware und Ladungssicherung die angegebene Lagenzahl zulassen – und ob Ihre Spedition gestapelte Ware so abrechnet.",
    );
  }

  if (hasStackable) {
    utilizationNotes.push(
      "Als stapelbar markierte Positionen wurden in dieser Berechnung nicht platzsparend angerechnet, da dies eine gepr\u00fcfte Fahrzeug-Innenh\u00f6he voraussetzt. Die Angabe ist aktuell rein informativ.",
    );
  }

  if (hasOversizedWidth) {
    utilizationNotes.push(
      "Mindestens eine Position ist breiter als die Standard-Ladebreite von 2,4 m. Bitte pr\u00fcfen Sie die tats\u00e4chliche Innenbreite des vorgesehenen Fahrzeugs gesondert.",
    );
  }

  if (hasOverlength) {
    utilizationNotes.push(
      "Mindestens eine Position ist länger als die Ladelänge eines Standard-Sattelaufliegers (13,6 m). Hier handelt es sich ggf. um einen Sondertransport.",
    );
  }

  let loadingMeterWeightKg: number | null = null;
  let chargeableWeightKg: number | null = null;
  if (isPositiveFinite(input.kgPerLoadingMeter)) {
    loadingMeterWeightKg = round2(rawLdm * input.kgPerLoadingMeter);
    chargeableWeightKg = round2(Math.max(rawWeight, rawLdm * input.kgPerLoadingMeter));
    utilizationNotes.push(
      missingWeightCount > 0 || rawWeight === 0
        ? `Frachtpflichtiges Gewicht mit ${input.kgPerLoadingMeter.toLocaleString("de-DE")} kg je Lademeter berechnet. Da nicht für alle Positionen ein Gewicht angegeben wurde, ist der Vergleich mit dem tatsächlichen Gewicht unvollständig.`
        : `Frachtpflichtiges Gewicht = höherer Wert aus tatsächlichem Gewicht und Lademetergewicht (${input.kgPerLoadingMeter.toLocaleString("de-DE")} kg je Lademeter). Der Umrechnungsfaktor ist eine Tarifvereinbarung Ihrer Spedition.`,
    );
  }

  return {
    totalLoadingMeters: round2(rawLdm),
    totalFootprintSqm: round2(rawFootprint),
    totalVolumeCbm: round2(rawVolume),
    totalWeightKg: round2(rawWeight),
    totalFloorPositions: floorPositionsTotal,
    semiTrailerSharePercent: round2((rawLdm / SEMI_TRAILER_LDM) * 100),
    loadingMeterWeightKg,
    chargeableWeightKg,
    utilizationNotes,
  };
}
