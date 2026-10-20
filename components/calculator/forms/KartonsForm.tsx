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
import { calculateCartonsPerPallet } from "@/lib/calculators/cartonsPerPallet";
import { PALLET_LIST, PALLETS, type PalletPreset } from "@/lib/calculators/pallets";
import { formatDecimal, parseDecimal } from "@/lib/parseDecimal";
import { asBool, asOneOf, asString } from "@/lib/shareState";

type FormState = {
  cartonLength: string;
  cartonWidth: string;
  cartonHeight: string;
  cartonWeight: string;
  palletType: PalletPreset | "custom";
  palletLength: string;
  palletWidth: string;
  palletHeight: string;
  maxLoadedHeight: string;
  maxWeight: string;
  totalCartonCount: string;
  allowRotation: boolean;
};

const INITIAL: FormState = {
  cartonLength: "",
  cartonWidth: "",
  cartonHeight: "",
  cartonWeight: "",
  palletType: "euro",
  palletLength: "",
  palletWidth: "",
  palletHeight: "",
  maxLoadedHeight: "",
  maxWeight: "",
  totalCartonCount: "1",
  allowRotation: true,
};

const PALLET_IDS = [...PALLET_LIST.map((pallet) => pallet.id), "custom"] as const;
const SHARE_KEYS: (keyof FormState)[] = [
  "cartonLength",
  "cartonWidth",
  "cartonHeight",
  "cartonWeight",
  "palletLength",
  "palletWidth",
  "palletHeight",
  "maxLoadedHeight",
  "maxWeight",
  "totalCartonCount",
];

function toShare(state: FormState) {
  return {
    p: state.palletType,
    r: state.allowRotation,
    v: SHARE_KEYS.map((key) => state[key]),
  };
}

function sanitize(raw: unknown): FormState | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!Array.isArray(d.v)) return null;
  const values = Object.fromEntries(SHARE_KEYS.map((key, index) => [key, asString((d.v as unknown[])[index])]));
  return {
    ...INITIAL,
    ...values,
    totalCartonCount: (values.totalCartonCount as string) || "1",
    palletType: asOneOf(d.p, PALLET_IDS, "euro"),
    allowRotation: asBool(d.r, true),
  };
}

type Errors = Partial<Record<keyof FormState, string>>;

function validate(state: FormState): Errors {
  const errors: Errors = {};
  const positive = (value: string) => (parseDecimal(value) ?? 0) > 0;
  if (!positive(state.cartonLength)) errors.cartonLength = "Bitte eine Länge größer 0 angeben.";
  if (!positive(state.cartonWidth)) errors.cartonWidth = "Bitte eine Breite größer 0 angeben.";
  if (!positive(state.cartonHeight)) errors.cartonHeight = "Bitte eine Höhe größer 0 angeben.";
  if (state.palletType === "custom") {
    if (!positive(state.palletLength)) errors.palletLength = "Bitte die Palettenlänge angeben.";
    if (!positive(state.palletWidth)) errors.palletWidth = "Bitte die Palettenbreite angeben.";
  }
  const count = parseDecimal(state.totalCartonCount);
  if (!(count !== null && count >= 1 && Number.isInteger(count)))
    errors.totalCartonCount = "Bitte eine ganze Anzahl ab 1 angeben.";
  return errors;
}

const RESULT_ID = "kartons-ergebnis";

export function KartonsForm() {
  const formId = useId();
  const { state, setState, showErrors, markSubmitted, reset } = useCalculatorState(INITIAL, sanitize, toShare);
  const update = (patch: Partial<FormState>) => setState((current) => ({ ...current, ...patch }));

  const errors = useMemo(() => validate(state), [state]);
  const isValid = Object.keys(errors).length === 0;
  const shownErrors = showErrors ? errors : {};

  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateCartonsPerPallet({
      carton: {
        lengthCm: parseDecimal(state.cartonLength) ?? 0,
        widthCm: parseDecimal(state.cartonWidth) ?? 0,
        heightCm: parseDecimal(state.cartonHeight) ?? 0,
      },
      cartonWeightKg: parseDecimal(state.cartonWeight),
      palletType: state.palletType,
      palletDimensions:
        state.palletType === "custom"
          ? {
              lengthCm: parseDecimal(state.palletLength) ?? 0,
              widthCm: parseDecimal(state.palletWidth) ?? 0,
              heightCm: parseDecimal(state.palletHeight) ?? undefined,
            }
          : undefined,
      maxLoadedHeightCm: parseDecimal(state.maxLoadedHeight),
      maxWeightKg: parseDecimal(state.maxWeight),
      totalCartonCount: parseDecimal(state.totalCartonCount) ?? 0,
      allowRotation: state.allowRotation,
    });
  }, [isValid, state]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    markSubmitted();
    if (isValid) revealResult(RESULT_ID);
  }

  const status =
    result && result.cartonsPerPallet === 0
      ? {
          tone: "danger" as const,
          label: "Unter den gewählten Höhen- oder Gewichtsgrenzen kann kein Karton verladen werden.",
        }
      : null;

  const summary = result
    ? [
        "Kartons-pro-Palette-Rechner (lademeter-rechner.de)",
        `Karton: ${state.cartonLength} × ${state.cartonWidth} × ${state.cartonHeight} cm`,
        `Kartons pro Lage: ${result.cartonsPerLayer}, Lagen: ${result.layers}, Kartons pro Palette: ${result.cartonsPerPallet}`,
        `Benötigte Paletten für ${state.totalCartonCount} Kartons: ${result.palletsNeeded}`,
      ].join("\n")
    : "";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate aria-label="Kartons pro Palette berechnen">
      <CalculatorShell
        form={
          <div>
            <CalculatorHeader title="Karton" description="Außenmaße des Kartons in Zentimetern." />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <NumberField
                id={`${formId}-cl`}
                label="Länge"
                unitLabel="cm"
                required
                value={state.cartonLength}
                onChange={(value) => update({ cartonLength: value })}
                error={shownErrors.cartonLength}
              />
              <NumberField
                id={`${formId}-cw`}
                label="Breite"
                unitLabel="cm"
                required
                value={state.cartonWidth}
                onChange={(value) => update({ cartonWidth: value })}
                error={shownErrors.cartonWidth}
              />
              <NumberField
                id={`${formId}-ch`}
                label="Höhe"
                unitLabel="cm"
                required
                value={state.cartonHeight}
                onChange={(value) => update({ cartonHeight: value })}
                error={shownErrors.cartonHeight}
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField
                id={`${formId}-cwt`}
                label="Kartongewicht (optional)"
                unitLabel="kg"
                value={state.cartonWeight}
                onChange={(value) => update({ cartonWeight: value })}
              />
              <QuantityField
                id={`${formId}-count`}
                label="Gesamtanzahl Kartons"
                value={state.totalCartonCount}
                onChange={(value) => update({ totalCartonCount: value })}
                error={shownErrors.totalCartonCount}
              />
            </div>

            <div className="mt-8">
              <CalculatorHeader title="Palette und Grenzen" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <UnitSelect
                id={`${formId}-pallet`}
                label="Palettentyp"
                value={state.palletType}
                onChange={(value) => update({ palletType: value as FormState["palletType"] })}
                options={[
                  ...PALLET_LIST.map((pallet) => ({ value: pallet.id, label: pallet.label })),
                  { value: "custom", label: "Benutzerdefiniert" },
                ]}
              />
              {state.palletType !== "custom" ? (
                <p className="self-end pb-2 text-xs text-slate-500">
                  Palettenhöhe: {formatDecimal(PALLETS[state.palletType].heightCm, 1)} cm
                </p>
              ) : null}
            </div>
            {state.palletType === "custom" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
                <NumberField
                  id={`${formId}-ph`}
                  label="Palettenhöhe (optional)"
                  unitLabel="cm"
                  value={state.palletHeight}
                  onChange={(value) => update({ palletHeight: value })}
                />
              </div>
            ) : null}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField
                id={`${formId}-mh`}
                label="Max. Gesamthöhe inkl. Palette (optional)"
                unitLabel="cm"
                value={state.maxLoadedHeight}
                onChange={(value) => update({ maxLoadedHeight: value })}
                placeholder="180"
                helpText="Ohne Angabe: Richtwert 180 cm."
              />
              <NumberField
                id={`${formId}-mw`}
                label="Max. Ladungsgewicht (optional)"
                unitLabel="kg"
                value={state.maxWeight}
                onChange={(value) => update({ maxWeight: value })}
                helpText="Gewicht der Kartons ohne Palette."
              />
            </div>

            <label className="mt-5 flex items-start gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={state.allowRotation}
                onChange={(event) => update({ allowRotation: event.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-500"
              />
              <span>
                Drehen erlauben
                <span className="block text-xs text-slate-500">Prüft auch gedrehte und gemischte Lagenbilder (Verbund).</span>
              </span>
            </label>

            <ToolActions onReset={reset} />
          </div>
        }
        result={
          <ResultPanel
            id={RESULT_ID}
            primary={{
              label: "Kartons pro Palette",
              value: result ? formatDecimal(result.cartonsPerPallet, 0) : undefined,
              hint: result ? `${result.cartonsPerLayer} pro Lage × ${result.layers} Lagen` : undefined,
            }}
            status={status}
            metrics={[
              { label: "Kartons pro Lage", value: result ? String(result.cartonsPerLayer) : undefined },
              { label: "Lagen", value: result ? String(result.layers) : undefined },
              { label: "Benötigte Paletten", value: result ? String(result.palletsNeeded) : undefined },
              {
                label: "Ladehöhe inkl. Palette",
                unit: "cm",
                value: result ? formatDecimal(result.loadedHeightCm, 1) : undefined,
              },
              {
                label: "Ladungsgewicht je Palette",
                unit: "kg",
                value: result && result.totalWeightKg > 0 ? formatDecimal(result.totalWeightKg) : undefined,
              },
              {
                label: "Volumenauslastung",
                unit: "%",
                value: result ? formatDecimal(result.utilizationPercent, 1) : undefined,
              },
            ]}
            visual={
              result && result.cartonsPerPallet > 0 ? (
                <LoadPlan
                  lengthCm={result.layerLayout.palletLengthCm}
                  widthCm={result.layerLayout.palletWidthCm}
                  placements={result.layerLayout.placements}
                  title={`Lagenbild: ${result.cartonsPerLayer} Kartons pro Lage`}
                />
              ) : null
            }
            notes={result?.utilizationNotes}
            actions={<ResultActions shareState={toShare(state)} summary={summary} />}
          />
        }
      />
    </form>
  );
}
