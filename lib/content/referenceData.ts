import { calculateTruckPallets } from "@/lib/calculators/truckPallets";
import { PALLET_LIST, type PalletPreset } from "@/lib/calculators/pallets";
import { VEHICLES, type VehiclePreset } from "@/lib/calculators/vehicles";
import { formatDecimal } from "@/lib/parseDecimal";

/**
 * Reference figures for the tables on the site, computed from the same
 * engines the calculators use so published numbers can never drift from the
 * tool results.
 */

export function ldmOfPallet(pallet: PalletPreset): number {
  const spec = PALLET_LIST.find((entry) => entry.id === pallet);
  if (!spec) return 0;
  return (spec.lengthCm / 100) * (spec.widthCm / 100) / 2.4;
}

/** Rows for the Lademeter-per-pallet table. */
export function palletLdmRows() {
  return PALLET_LIST.map((pallet) => {
    const area = (pallet.lengthCm / 100) * (pallet.widthCm / 100);
    const ldm = area / 2.4;
    return [pallet.label, `${formatDecimal(area)} m²`, `${formatDecimal(ldm, 3)} ldm`, `${formatDecimal(1 / ldm, 2)} Stück je ldm`];
  });
}

/** Capacity of one vehicle for one pallet type with the best pattern. */
export function vehicleCapacity(vehicle: Exclude<VehiclePreset, "custom">, pallet: PalletPreset) {
  const lengthwise = calculateTruckPallets({
    vehiclePreset: vehicle,
    palletType: pallet,
    palletCount: 1,
    allowRotation: false,
    allowStacking: false,
  });
  const best = calculateTruckPallets({
    vehiclePreset: vehicle,
    palletType: pallet,
    palletCount: 1,
    allowRotation: true,
    allowStacking: false,
  });
  return {
    lengthwise: lengthwise?.maxCapacity ?? 0,
    best: best?.maxCapacity ?? 0,
    pattern: best?.pattern ?? "laengs",
    description: best ? best.utilizationNotes.find((note) => note.startsWith("Ermittelte Anordnung")) ?? "" : "",
  };
}

export function vehicleFloorLdm(vehicle: Exclude<VehiclePreset, "custom">): number {
  const spec = VEHICLES[vehicle];
  return (spec.lengthCm / 100) * (spec.widthCm / 100) / 2.4;
}

/** Table: pallets per vehicle (Euro, Industrie, Halb) for the Lademeter-Tabelle and /fahrzeuge/. */
export function vehicleCapacityRows() {
  return Object.values(VEHICLES).map((vehicle) => {
    const euro = vehicleCapacity(vehicle.id, "euro");
    const industrial = vehicleCapacity(vehicle.id, "industrial");
    const half = vehicleCapacity(vehicle.id, "half");
    return [
      vehicle.label,
      `${formatDecimal(vehicle.lengthCm / 100)} × ${formatDecimal(vehicle.widthCm / 100)} m`,
      `${formatDecimal(vehicleFloorLdm(vehicle.id), 1)} ldm`,
      euro.lengthwise === euro.best ? String(euro.best) : `${euro.lengthwise} (längs) / ${euro.best} (max.)`,
      industrial.lengthwise === industrial.best
        ? String(industrial.best)
        : `${industrial.lengthwise} (längs) / ${industrial.best} (max.)`,
      half.lengthwise === half.best ? String(half.best) : `${half.lengthwise} (längs) / ${half.best} (max.)`,
    ];
  });
}

/** Kurzer Auszug der Fahrzeugtabelle (Fahrzeug, Lademeter, Europaletten), damit die volle Tabelle nur auf /fahrzeuge/ steht. */
export function vehicleExcerptRows(ids: Exclude<VehiclePreset, "custom">[]) {
  return ids.map((id) => {
    const vehicle = VEHICLES[id];
    const euro = vehicleCapacity(id, "euro");
    return [
      vehicle.label,
      `${formatDecimal(vehicleFloorLdm(id), 1)} ldm`,
      euro.lengthwise === euro.best ? String(euro.best) : `bis ${euro.best}`,
    ];
  });
}

/** Table: ldm for N Europaletten / Industriepaletten (1..N). */
export function ldmByQuantityRows(quantities: number[]) {
  const euro = ldmOfPallet("euro");
  const industrial = ldmOfPallet("industrial");
  return quantities.map((count) => [
    String(count),
    `${formatDecimal(count * euro, 2)} ldm`,
    `${formatDecimal(count * industrial, 2)} ldm`,
  ]);
}
