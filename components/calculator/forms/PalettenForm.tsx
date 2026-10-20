"use client";

import { useId, useMemo } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { NumberField } from "@/components/calculator/NumberField";
import { QuantityField } from "@/components/calculator/QuantityField";
import { UnitSelect } from "@/components/calculator/UnitSelect";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { ResultActions } from "@/components/calculator/ResultActions";
import { ToolActions } from "@/components/calculator/ToolActions";
import { LoadPlan } from "@/components/calculator/LoadPlan";
import { revealResult, useCalculatorState } from "@/components/calculator/useCalculatorState";
import { calculateTruckPallets, type PalletType } from "@/lib/calculators/truckPallets";
import { VEHICLE_LIST, VEHICLES, type VehiclePreset } from "@/lib/calculators/vehicles";
import { PALLET_LIST } from "@/lib/calculators/pallets";
import { formatDecimal, parseDecimal } from "@/lib/parseDecimal";
import { asBool, asOneOf, asString } from "@/lib/shareState";
import { PALETTEN_INITIAL, palettenToShare, type PalettenFormState } from "@/lib/shareFormats";

const VEHICLE_IDS = [...VEHICLE_LIST.map((vehicle) => vehicle.id), "custom"] as const;
const PALLET_IDS = [...PALLET_LIST.map((pallet) => pallet.id), "custom"] as const;

function sanitize(raw: unknown): PalettenFormState | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.v !== "string") return null;
  return {
    vehiclePreset: asOneOf(d.v, VEHICLE_IDS, "standard-semi-trailer"),
    vehicleLength: asString(d.vl),
    vehicleWidth: asString(d.vw),
    vehicleHeight: asString(d.vh),
    palletType: asOneOf(d.p, PALLET_IDS, "euro"),
    palletLength: asString(d.pl),
    palletWidth: asString(d.pw),
    palletCount: asString(d.n, "33"),
    allowRotation: asBool(d.r, false),
    allowStacking: asBool(d.s, false),
    loadHeight: asString(d.h),
    maxLayers: asOneOf(asString(d.m, "2"), ["2", "3", "4"] as const, "2"),
  };
}

type Errors = Partial<Record<keyof PalettenFormState, string>>;

function validate(state: PalettenFormState): Errors {
  const errors: Errors = {};
  const positive = (value: string) => (parseDecimal(value) ?? 0) > 0;
  if (state.vehiclePreset === "custom") {
    if (!positive(state.vehicleLength)) errors.vehicleLength = "Bitte die Innenlänge angeben.";
    if (!positive(state.vehicleWidth)) errors.vehicleWidth = "Bitte die Innenbreite angeben.";
  }
  if (state.palletType === "custom") {
    if (!positive(state.palletLength)) errors.palletLength = "Bitte die Palettenlänge angeben.";
    if (!positive(state.palletWidth)) errors.palletWidth = "Bitte die Palettenbreite angeben.";
  }
  const count = parseDecimal(state.palletCount);
  if (!(count !== null && count >= 1 && Number.isInteger(count)))
    errors.palletCount = "Bitte eine ganze Anzahl ab 1 angeben.";
  return errors;
}

const RESULT_ID = "paletten-ergebnis";

export function PalettenForm() {
  const formId = useId();
  const { state, setState, showErrors, markSubmitted, reset } = useCalculatorState(
    PALETTEN_INITIAL,
    sanitize,
    palettenToShare,
  );
  const update = (patch: Partial<PalettenFormState>) => setState((current) => ({ ...current, ...patch }));

  const errors = useMemo(() => validate(state), [state]);
  const isValid = Object.keys(errors).length === 0;
  const shownErrors = showErrors ? errors : {};

  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateTruckPallets({
      vehiclePreset: state.vehiclePreset,
      vehicleDimensions:
        state.vehiclePreset === "custom"
          ? {
              lengthCm: parseDecimal(state.vehicleLength) ?? 0,
              widthCm: parseDecimal(state.vehicleWidth) ?? 0,
              heightCm: parseDecimal(state.vehicleHeight) ?? undefined,
            }
          : undefined,
      palletType: state.palletType,
      palletDimensions:
        state.palletType === "custom"
          ? { lengthCm: parseDecimal(state.palletLength) ?? 0, widthCm: parseDecimal(state.palletWidth) ?? 0 }
          : undefined,
      palletCount: parseDecimal(state.palletCount) ?? 0,
      allowRotation: state.allowRotation,
      allowStacking: state.allowStacking,
      loadedPalletHeightCm: parseDecimal(state.loadHeight),
      maxStackLayers: parseDecimal(state.maxLayers),
    });
  }, [isValid, state]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    markSubmitted();
    if (isValid) revealResult(RESULT_ID);
  }

  const vehicleLabel =
    state.vehiclePreset === "custom" ? "Benutzerdefiniertes Fahrzeug" : VEHICLES[state.vehiclePreset].label;
  const requested = parseDecimal(state.palletCount) ?? 0;

  const status = result
    ? result.maxCapacity === 0
      ? { tone: "danger" as const, label: "Die Palette passt nicht auf diese Ladefläche." }
      : result.overflowPallets > 0
        ? { tone: "danger" as const, label: `${result.overflowPallets} Palette(n) passen nicht mehr.` }
        : result.palletPositions === result.maxCapacity
          ? { tone: "warning" as const, label: "Ladefläche voll ausgelastet." }
          : { tone: "success" as const, label: `Alle ${result.palletPositions} Paletten passen.` }
    : null;

  const summary = result
    ? [
        "LKW-Palettenrechner (lademeter-rechner.de)",
        `Fahrzeug: ${vehicleLabel}`,
        `Paletten angefragt: ${requested}, verladen: ${result.palletPositions}, Kapazität: ${result.maxCapacity}`,
        `Lademeter: ${formatDecimal(result.loadingMetersEquivalent)} ldm, Bodenauslastung: ${formatDecimal(result.utilizationPercent, 1)} %`,
      ].join("\n")
    : "";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate aria-label="Paletten im LKW berechnen">
      <CalculatorShell
        form={
          <div>
            <CalculatorHeader title="Fahrzeug und Paletten" description="Alle Maße in Zentimetern." />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <UnitSelect
                id={`${formId}-vehicle`}
                label="Fahrzeugtyp"
                value={state.vehiclePreset}
                onChange={(value) => update({ vehiclePreset: value as VehiclePreset })}
                options={[
                  ...VEHICLE_LIST.map((vehicle) => ({ value: vehicle.id, label: vehicle.label })),
                  { value: "custom", label: "Benutzerdefiniert" },
                ]}
              />
              <UnitSelect
                id={`${formId}-pallet`}
                label="Palettentyp"
                value={state.palletType}
                onChange={(value) => update({ palletType: value as PalletType })}
                options={[
                  ...PALLET_LIST.map((pallet) => ({ value: pallet.id, label: pallet.label })),
                  { value: "custom", label: "Benutzerdefiniert" },
                ]}
              />
            </div>

            {state.vehiclePreset === "custom" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <NumberField
                  id={`${formId}-vl`}
                  label="Innenlänge"
                  unitLabel="cm"
                  required
                  value={state.vehicleLength}
                  onChange={(value) => update({ vehicleLength: value })}
                  error={shownErrors.vehicleLength}
                />
                <NumberField
                  id={`${formId}-vw`}
                  label="Innenbreite"
                  unitLabel="cm"
                  required
                  value={state.vehicleWidth}
                  onChange={(value) => update({ vehicleWidth: value })}
                  error={shownErrors.vehicleWidth}
                />
                <NumberField
                  id={`${formId}-vh`}
                  label="Innenhöhe (optional)"
                  unitLabel="cm"
                  value={state.vehicleHeight}
                  onChange={(value) => update({ vehicleHeight: value })}
                  helpText="Nur zum Stapeln nötig."
                />
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Innenmaße ca. {formatDecimal(VEHICLES[state.vehiclePreset].lengthCm / 100)} ×{" "}
                {formatDecimal(VEHICLES[state.vehiclePreset].widthCm / 100)} ×{" "}
                {formatDecimal(VEHICLES[state.vehiclePreset].heightCm / 100)} m
              </p>
            )}

            {state.palletType === "custom" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id={`${formId}-pl`}
                  label="Palettenlänge"
                  unitLabel="cm"
                  required
                  value={state.palletLength}
                  onChange={(value) => update({ palletLength: value })}
                  error={shownErrors.palletLength}
                />
                <NumberField
                  id={`${formId}-pw`}
                  label="Palettenbreite"
                  unitLabel="cm"
                  required
                  value={state.palletWidth}
                  onChange={(value) => update({ palletWidth: value })}
                  error={shownErrors.palletWidth}
                />
              </div>
            ) : null}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <QuantityField
                id={`${formId}-count`}
                label="Anzahl Paletten"
                value={state.palletCount}
                onChange={(value) => update({ palletCount: value })}
                error={shownErrors.palletCount}
              />
            </div>

            <div className="mt-5 space-y-3">
              <label className="flex items-start gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={state.allowRotation}
                  onChange={(event) => update({ allowRotation: event.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-500"
                />
                <span>
                  Drehen erlauben
                  <span className="block text-xs text-slate-500">
                    Prüft auch quer und gemischt verladene Paletten.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={state.allowStacking}
                  onChange={(event) => update({ allowStacking: event.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-500"
                />
                <span>
                  Stapeln erlauben
                  <span className="block text-xs text-slate-500">Nur wenn Ware und Ladungssicherung es zulassen.</span>
                </span>
              </label>
            </div>

            {state.allowStacking ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id={`${formId}-lh`}
                  label="Höhe einer beladenen Palette"
                  unitLabel="cm"
                  value={state.loadHeight}
                  onChange={(value) => update({ loadHeight: value })}
                  helpText="Inklusive Palette, z. B. 120."
                />
                <UnitSelect
                  id={`${formId}-ml`}
                  label="Maximale Lagen"
                  value={state.maxLayers}
                  onChange={(value) => update({ maxLayers: value })}
                  options={[
                    { value: "2", label: "2 Lagen" },
                    { value: "3", label: "3 Lagen" },
                    { value: "4", label: "4 Lagen" },
                  ]}
                />
              </div>
            ) : null}

            <ToolActions onReset={reset} />
          </div>
        }
        result={
          <ResultPanel
            id={RESULT_ID}
            primary={{
              label: "Paletten verladen",
              value: result ? `${result.palletPositions} von ${requested}` : undefined,
              hint: result ? `Kapazität: ${result.maxCapacity} Paletten` : undefined,
            }}
            status={status}
            metrics={[
              {
                label: "Belegte Stellplätze",
                value: result ? `${result.usedFloorPositions} von ${result.floorPositions}` : undefined,
              },
              {
                label: "Lademeter",
                unit: "ldm",
                value: result ? formatDecimal(result.loadingMetersEquivalent) : undefined,
              },
              {
                label: "Genutzte Bodenfläche",
                unit: "m²",
                value: result ? formatDecimal(result.usedFloorAreaSqm) : undefined,
              },
              {
                label: "Rechnerisch freie Fläche",
                unit: "m²",
                value: result ? formatDecimal(result.remainingFloorAreaSqm) : undefined,
              },
              {
                label: "Bodenauslastung",
                unit: "%",
                value: result ? formatDecimal(result.utilizationPercent, 1) : undefined,
              },
            ]}
            visual={
              result && result.floorPositions > 0 ? (
                <LoadPlan
                  lengthCm={result.layout.vehicleLengthCm}
                  widthCm={result.layout.vehicleWidthCm}
                  placements={result.layout.placements}
                  layers={result.layout.layers}
                  title={`Ladeplan: ${vehicleLabel}`}
                  frontLabel="Stirnwand"
                />
              ) : null
            }
            notes={result?.utilizationNotes}
            actions={<ResultActions shareState={palettenToShare(state)} summary={summary} />}
          />
        }
      />
    </form>
  );
}
