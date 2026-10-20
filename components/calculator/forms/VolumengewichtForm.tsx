"use client";

import { useId, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { NumberField } from "@/components/calculator/NumberField";
import { QuantityField } from "@/components/calculator/QuantityField";
import { UnitSelect } from "@/components/calculator/UnitSelect";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { ResultActions } from "@/components/calculator/ResultActions";
import { ToolActions } from "@/components/calculator/ToolActions";
import { nextRowId, revealResult, useCalculatorState } from "@/components/calculator/useCalculatorState";
import {
  calculateVolumeWeight,
  VOLUME_WEIGHT_MODES,
  type VolumeWeightMode,
} from "@/lib/calculators/volumeWeight";
import { formatDecimal, parseDecimal } from "@/lib/parseDecimal";
import { asOneOf, asString } from "@/lib/shareState";

type PackageRow = {
  id: string;
  length: string;
  width: string;
  height: string;
  quantity: string;
  weight: string;
};

type FormState = {
  mode: VolumeWeightMode;
  divisor: string;
  factor: string;
  rows: PackageRow[];
};

const MODES = ["air", "express", "sea", "custom-divisor", "custom-factor"] as const;

const INITIAL: FormState = {
  mode: "air",
  divisor: "",
  factor: "",
  rows: [{ id: "row-initial", length: "", width: "", height: "", quantity: "1", weight: "" }],
};

function toShare(state: FormState) {
  return {
    m: state.mode,
    d: state.divisor,
    f: state.factor,
    r: state.rows.map((row) => [row.length, row.width, row.height, row.quantity, row.weight]),
  };
}

function sanitize(raw: unknown): FormState | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!Array.isArray(d.r) || d.r.length === 0) return null;
  return {
    mode: asOneOf(d.m, MODES, "air"),
    divisor: asString(d.d),
    factor: asString(d.f),
    rows: d.r.slice(0, 50).map((entry) => {
      const row = Array.isArray(entry) ? entry : [];
      return {
        id: nextRowId(),
        length: asString(row[0]),
        width: asString(row[1]),
        height: asString(row[2]),
        quantity: asString(row[3], "1"),
        weight: asString(row[4]),
      };
    }),
  };
}

type RowErrors = Partial<Record<"length" | "width" | "height" | "quantity", string>>;

function rowErrors(row: PackageRow): RowErrors {
  const errors: RowErrors = {};
  if (!((parseDecimal(row.length) ?? 0) > 0)) errors.length = "Bitte eine Länge angeben.";
  if (!((parseDecimal(row.width) ?? 0) > 0)) errors.width = "Bitte eine Breite angeben.";
  if (!((parseDecimal(row.height) ?? 0) > 0)) errors.height = "Bitte eine Höhe angeben.";
  const quantity = parseDecimal(row.quantity);
  if (!(quantity !== null && quantity >= 1 && Number.isInteger(quantity)))
    errors.quantity = "Bitte eine ganze Anzahl ab 1 angeben.";
  return errors;
}

const RESULT_ID = "volumengewicht-ergebnis";

export function VolumengewichtForm() {
  const formId = useId();
  const { state, setState, showErrors, markSubmitted, reset } = useCalculatorState(INITIAL, sanitize, toShare);

  const errors = useMemo(() => Object.fromEntries(state.rows.map((row) => [row.id, rowErrors(row)])), [state.rows]);
  const modeError =
    state.mode === "custom-divisor" && !((parseDecimal(state.divisor) ?? 0) > 0)
      ? "Bitte einen Divisor angeben, z. B. 4000."
      : state.mode === "custom-factor" && !((parseDecimal(state.factor) ?? 0) > 0)
        ? "Bitte einen Faktor in kg je m³ angeben, z. B. 250."
        : undefined;
  const isValid = !modeError && Object.values(errors).every((rowError) => Object.keys(rowError).length === 0);

  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateVolumeWeight({
      mode: state.mode,
      divisor: parseDecimal(state.divisor),
      kgPerCbm: parseDecimal(state.factor),
      packages: state.rows.map((row) => ({
        lengthCm: parseDecimal(row.length),
        widthCm: parseDecimal(row.width),
        heightCm: parseDecimal(row.height),
        quantity: parseDecimal(row.quantity) ?? 0,
        weightKg: parseDecimal(row.weight),
      })),
    });
  }, [isValid, state]);

  function updateRow(id: string, patch: Partial<PackageRow>) {
    setState((current) => ({
      ...current,
      rows: current.rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    markSubmitted();
    if (isValid) revealResult(RESULT_ID);
  }

  const modeDescription =
    state.mode === "custom-divisor"
      ? "Volumengewicht = L × B × H (cm) ÷ Divisor."
      : state.mode === "custom-factor"
        ? "Volumengewicht = Volumen (m³) × Faktor (kg/m³)."
        : VOLUME_WEIGHT_MODES[state.mode].description;

  const summary = result
    ? [
        "Volumengewicht-Rechner (lademeter-rechner.de)",
        `Volumen: ${formatDecimal(result.totalVolumeCbm, 3)} m³ (Faktor ${formatDecimal(result.kgPerCbm)} kg/m³)`,
        `Volumengewicht: ${formatDecimal(result.volumeWeightKg)} kg, tatsächliches Gewicht: ${formatDecimal(result.realWeightKg)} kg`,
        `Frachtpflichtiges Gewicht: ${formatDecimal(result.chargeableWeightKg)} kg`,
      ].join("\n")
    : "";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate aria-label="Volumengewicht berechnen">
      <CalculatorShell
        form={
          <div>
            <CalculatorHeader title="Tarif" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <UnitSelect
                id={`${formId}-mode`}
                label="Berechnungsart"
                value={state.mode}
                onChange={(value) => setState((current) => ({ ...current, mode: value as VolumeWeightMode }))}
                options={[
                  ...Object.entries(VOLUME_WEIGHT_MODES).map(([value, mode]) => ({ value, label: mode.label })),
                  { value: "custom-divisor", label: "Eigener Divisor (cm³/kg)" },
                  { value: "custom-factor", label: "Eigener Faktor (kg/m³)" },
                ]}
              />
              {state.mode === "custom-divisor" ? (
                <NumberField
                  id={`${formId}-divisor`}
                  label="Divisor"
                  value={state.divisor}
                  onChange={(value) => setState((current) => ({ ...current, divisor: value }))}
                  error={showErrors ? modeError : undefined}
                  placeholder="z. B. 4000"
                />
              ) : null}
              {state.mode === "custom-factor" ? (
                <NumberField
                  id={`${formId}-factor`}
                  label="Faktor"
                  unitLabel="kg/m³"
                  value={state.factor}
                  onChange={(value) => setState((current) => ({ ...current, factor: value }))}
                  error={showErrors ? modeError : undefined}
                  placeholder="z. B. 250"
                />
              ) : null}
            </div>
            <p className="mt-2 text-xs text-slate-500">{modeDescription}</p>

            <div className="mt-8">
              <CalculatorHeader title="Packstücke" description="Außenmaße in Zentimetern, Gewicht je Packstück." />
            </div>
            <div className="mt-4 space-y-4">
              {state.rows.map((row, index) => {
                const rowError = showErrors ? errors[row.id] : undefined;
                return (
                  <fieldset key={row.id} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                    <legend className="px-1 text-sm font-semibold text-slate-800">Packstück {index + 1}</legend>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <NumberField
                        id={`${row.id}-l`}
                        label="Länge"
                        unitLabel="cm"
                        required
                        value={row.length}
                        onChange={(value) => updateRow(row.id, { length: value })}
                        error={rowError?.length}
                      />
                      <NumberField
                        id={`${row.id}-w`}
                        label="Breite"
                        unitLabel="cm"
                        required
                        value={row.width}
                        onChange={(value) => updateRow(row.id, { width: value })}
                        error={rowError?.width}
                      />
                      <NumberField
                        id={`${row.id}-h`}
                        label="Höhe"
                        unitLabel="cm"
                        required
                        value={row.height}
                        onChange={(value) => updateRow(row.id, { height: value })}
                        error={rowError?.height}
                      />
                      <QuantityField
                        id={`${row.id}-q`}
                        label="Anzahl"
                        value={row.quantity}
                        onChange={(value) => updateRow(row.id, { quantity: value })}
                        error={rowError?.quantity}
                      />
                      <NumberField
                        id={`${row.id}-kg`}
                        label="Gewicht/Stück (optional)"
                        unitLabel="kg"
                        value={row.weight}
                        onChange={(value) => updateRow(row.id, { weight: value })}
                      />
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() =>
                            setState((current) =>
                              current.rows.length > 1
                                ? { ...current, rows: current.rows.filter((entry) => entry.id !== row.id) }
                                : current,
                            )
                          }
                          disabled={state.rows.length === 1}
                          className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Entfernen
                        </button>
                      </div>
                    </div>
                  </fieldset>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  rows: [
                    ...current.rows,
                    { id: nextRowId(), length: "", width: "", height: "", quantity: "1", weight: "" },
                  ],
                }))
              }
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 hover:underline"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Weiteres Packstück hinzufügen
            </button>

            <ToolActions onReset={reset} />
          </div>
        }
        result={
          <ResultPanel
            id={RESULT_ID}
            primary={{
              label: "Frachtpflichtiges Gewicht",
              value: result ? formatDecimal(result.chargeableWeightKg) : undefined,
              unit: "kg",
              hint: result
                ? result.basis === "volumen"
                  ? "Abrechnung nach Volumengewicht"
                  : "Abrechnung nach tatsächlichem Gewicht"
                : undefined,
            }}
            metrics={[
              { label: "Volumen", unit: "m³", value: result ? formatDecimal(result.totalVolumeCbm, 3) : undefined },
              { label: "Volumengewicht", unit: "kg", value: result ? formatDecimal(result.volumeWeightKg) : undefined },
              {
                label: "Tatsächliches Gewicht",
                unit: "kg",
                value: result && result.realWeightKg > 0 ? formatDecimal(result.realWeightKg) : undefined,
              },
              { label: "Verwendeter Faktor", unit: "kg/m³", value: result ? formatDecimal(result.kgPerCbm) : undefined },
            ]}
            notes={result?.utilizationNotes}
            actions={<ResultActions shareState={toShare(state)} summary={summary} />}
          />
        }
      />
    </form>
  );
}
