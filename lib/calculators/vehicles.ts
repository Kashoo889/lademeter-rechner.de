/**
 * Vehicle presets shared by the LKW Palettenrechner and the LKW
 * Beladungsrechner.
 *
 * Inner dimensions are typical planning values, not manufacturer data:
 * - The standard semi-trailer uses the European planning standard of
 *   13.60 x 2.40 m (the same 2.40 m reference width used for Lademeter).
 *   Real inner widths are usually 2.45-2.48 m.
 * - Swap bodies follow the common BDF classes C 7.15 / C 7.45 / C 7.82
 *   (outer length); the inner length is roughly 0.15 m shorter.
 * - ISO containers use common dry-container lengths/heights and a conservative
 *   2.35 m planning width close to the door opening. The actual inner width is
 *   often wider and all dimensions vary slightly by series/manufacturer.
 * - Payload values are rough orientation values for the vehicle class. They
 *   are always shown as editable defaults - the registration documents of the
 *   actual vehicle are authoritative. For containers the road payload is
 *   additionally limited by the permissible gross weight of the truck.
 *
 * Every preset is used by the /fahrzeuge/ pages, so changes here change
 * published reference content - update docs/METHODIK if you change numbers.
 */

export type VehiclePreset =
  | "standard-semi-trailer"
  | "mega-trailer"
  | "swap-body-782"
  | "swap-body-745"
  | "swap-body-715"
  | "truck-12t"
  | "solo-truck"
  | "van-3-5t"
  | "container-20"
  | "container-40"
  | "container-40hc"
  | "custom";

export type VehicleSpec = {
  id: Exclude<VehiclePreset, "custom">;
  label: string;
  /** Inner loading length in cm. */
  lengthCm: number;
  /** Inner loading width in cm. */
  widthCm: number;
  /** Inner loading height in cm. */
  heightCm: number;
  /** Typical payload in kg (orientation only). */
  payloadKg: number;
  /** "standard" = planning standard; "typical" = class typical; "iso" = ISO container. */
  basis: "standard" | "typical" | "iso";
};

export const VEHICLES: Record<Exclude<VehiclePreset, "custom">, VehicleSpec> = {
  "standard-semi-trailer": {
    id: "standard-semi-trailer",
    label: "Sattelzug Standard (13,6 m)",
    lengthCm: 1360,
    widthCm: 240,
    heightCm: 270,
    payloadKg: 24000,
    basis: "standard",
  },
  "mega-trailer": {
    id: "mega-trailer",
    label: "Megatrailer (13,6 m, 3 m Innenhöhe)",
    lengthCm: 1360,
    widthCm: 240,
    heightCm: 300,
    payloadKg: 24000,
    basis: "typical",
  },
  "swap-body-782": {
    id: "swap-body-782",
    label: "Wechselbrücke C 7.82",
    lengthCm: 770,
    widthCm: 245,
    heightCm: 270,
    payloadKg: 11000,
    basis: "typical",
  },
  "swap-body-745": {
    id: "swap-body-745",
    label: "Wechselbrücke C 7.45",
    lengthCm: 730,
    widthCm: 245,
    heightCm: 270,
    payloadKg: 11000,
    basis: "typical",
  },
  "swap-body-715": {
    id: "swap-body-715",
    label: "Wechselbrücke C 7.15",
    lengthCm: 700,
    widthCm: 245,
    heightCm: 270,
    payloadKg: 11000,
    basis: "typical",
  },
  "truck-12t": {
    id: "truck-12t",
    label: "12-Tonner (Koffer/Plane)",
    lengthCm: 720,
    widthCm: 245,
    heightCm: 250,
    payloadKg: 5000,
    basis: "typical",
  },
  "solo-truck": {
    id: "solo-truck",
    label: "7,5-Tonner (Koffer/Plane)",
    lengthCm: 600,
    widthCm: 240,
    heightCm: 240,
    payloadKg: 2500,
    basis: "typical",
  },
  "van-3-5t": {
    id: "van-3-5t",
    label: "3,5-t-Transporter mit Kofferaufbau",
    lengthCm: 420,
    widthCm: 210,
    heightCm: 220,
    payloadKg: 1000,
    basis: "typical",
  },
  "container-20": {
    id: "container-20",
    label: "20-Fuß-Container",
    lengthCm: 589,
    widthCm: 235,
    heightCm: 239,
    payloadKg: 21000,
    basis: "iso",
  },
  "container-40": {
    id: "container-40",
    label: "40-Fuß-Container",
    lengthCm: 1203,
    widthCm: 235,
    heightCm: 239,
    payloadKg: 26000,
    basis: "iso",
  },
  "container-40hc": {
    id: "container-40hc",
    label: "40-Fuß-High-Cube-Container",
    lengthCm: 1203,
    widthCm: 235,
    heightCm: 269,
    payloadKg: 26000,
    basis: "iso",
  },
};

export const VEHICLE_LIST: VehicleSpec[] = Object.values(VEHICLES);

export function getVehicle(preset: VehiclePreset): VehicleSpec | undefined {
  return preset === "custom" ? undefined : VEHICLES[preset];
}

export function isVehiclePreset(value: unknown): value is VehiclePreset {
  return value === "custom" || (typeof value === "string" && value in VEHICLES);
}

/** Note shown for presets whose dimensions are class-typical rather than standardized. */
export function vehicleBasisNote(spec: VehicleSpec): string | null {
  if (spec.basis === "typical") {
    return `Die Maße für „${spec.label}“ sind typische Richtwerte (Innenmaße ca. ${formatM(spec.lengthCm)} × ${formatM(spec.widthCm)} × ${formatM(spec.heightCm)} m). Reale Innenmaße variieren je nach Hersteller und Aufbau – für eine genaue Planung bitte „Benutzerdefiniert“ mit den Maßen Ihres Fahrzeugs verwenden.`;
  }
  if (spec.basis === "iso") {
    return `ISO-Container: Es werden konservative Planungsmaße (ca. ${formatM(spec.lengthCm)} × ${formatM(spec.widthCm)} × ${formatM(spec.heightCm)} m) verwendet; die Breite von 2,35 m orientiert sich an einer typischen Türöffnung. Tatsächliche Innenmaße, Türöffnung und Nutzlast variieren je Baureihe und sind am konkreten Container zu prüfen.`;
  }
  return null;
}

function formatM(cm: number): string {
  return (cm / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
