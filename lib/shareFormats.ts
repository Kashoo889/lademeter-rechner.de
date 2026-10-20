import type { PalletType } from "@/lib/calculators/truckPallets";
import type { VehiclePreset } from "@/lib/calculators/vehicles";

/**
 * Form state + share-link format of the LKW-Palettenrechner. Kept outside the
 * client component so server components (e.g. /fahrzeuge/ pages) can build
 * pre-filled calculator links.
 */
export type PalettenFormState = {
  vehiclePreset: VehiclePreset;
  vehicleLength: string;
  vehicleWidth: string;
  vehicleHeight: string;
  palletType: PalletType;
  palletLength: string;
  palletWidth: string;
  palletCount: string;
  allowRotation: boolean;
  allowStacking: boolean;
  loadHeight: string;
  maxLayers: string;
};

export const PALETTEN_INITIAL: PalettenFormState = {
  vehiclePreset: "standard-semi-trailer",
  vehicleLength: "",
  vehicleWidth: "",
  vehicleHeight: "",
  palletType: "euro",
  palletLength: "",
  palletWidth: "",
  palletCount: "33",
  allowRotation: false,
  allowStacking: false,
  loadHeight: "",
  maxLayers: "2",
};

export function palettenToShare(state: PalettenFormState) {
  return {
    v: state.vehiclePreset,
    vl: state.vehicleLength,
    vw: state.vehicleWidth,
    vh: state.vehicleHeight,
    p: state.palletType,
    pl: state.palletLength,
    pw: state.palletWidth,
    n: state.palletCount,
    r: state.allowRotation,
    s: state.allowStacking,
    h: state.loadHeight,
    m: state.maxLayers,
  };
}
