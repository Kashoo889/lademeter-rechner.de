"use client";

import { useId, useMemo } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { NumberField } from "@/components/calculator/NumberField";
import { QuantityField } from "@/components/calculator/QuantityField";
import { UnitSelect } from "@/components/calculator/UnitSelect";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { ResultActions } from "@/components/calculator/ResultActions";
import { ToolActions } from "@/components/calculator/ToolActions";
import { nextRowId, revealResult, useCalculatorState } from "@/components/calculator/useCalculatorState";
import { calculateLademeter, type LademeterUnit } from "@/lib/calculators/lademeter";
import { formatDecimal, parseDecimal } from "@/lib/parseDecimal";
import { asOneOf, asString } from "@/lib/shareState";

type CargoRowState = {
  id: string;
  name: string;
  length: string;
  width: string;
  height: string;
  quantity: string;
  weight: string;
  layers: string;
};

type FormState = {
  unit: LademeterUnit;
  factor: string;
  rows: CargoRowState[];
};

const UNITS = ["mm", "cm", "m"] as const;
const LAYER_OPTIONS = ["1", "2", "3", "4"] as const;
const FACTOR_PRESETS = ["1500", "1750", "1850", "2000"];

function createRow(index: number, patch: Partial<CargoRowState> = {}): CargoRowState {
  return {
    id: nextRowId(),
    name: `Ladung ${index + 1}`,
    length: "",
    width: "",
    height: "",
    quantity: "1",
    weight: "",
    layers: "1",
    ...patch,
  };
}

const INITIAL: FormState = {
  unit: "cm",
  factor: "",
  rows: [{ id: "row-initial", name: "Ladung 1", length: "", width: "", height: "", quantity: "1", weight: "", layers: "1" }],
};

function sanitize(raw: unknown): FormState | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (!Array.isArray(data.r) || data.r.length === 0) return null;
  return {
    unit: asOneOf(data.u, UNITS, "cm"),
    factor: asString(data.f),
    rows: data.r.slice(0, 50).map((entry, index) => {
      const row = Array.isArray(entry) ? entry : [];
      return createRow(index, {
        name: asString(row[0], `Ladung ${index + 1}`),
        length: asString(row[1]),
        width: asString(row[2]),
        height: asString(row[3]),
        quantity: asString(row[4], "1"),
        weight: asString(row[5]),
        layers: asOneOf(asString(row[6], "1"), LAYER_OPTIONS, "1"),
      });
    }),
  };
}

function toShare(state: FormState) {
  return {
    u: state.unit,
    f: state.factor,
    r: state.rows.map((row) => [row.name, row.length, row.width, row.height, row.quantity, row.weight, row.layers]),
  };
}

type RowErrors = Partial<Record<"length" | "width" | "quantity", string>>;

function rowErrors(row: CargoRowState): RowErrors {
  const errors: RowErrors = {};
  if (!((parseDecimal(row.length) ?? 0) > 0)) errors.length = "Bitte eine Länge größer 0 angeben.";
  if (!((parseDecimal(row.width) ?? 0) > 0)) errors.width = "Bitte eine Breite größer 0 angeben.";
  const quantity = parseDecimal(row.quantity);
  if (!(quantity !== null && quantity >= 1 && Number.isInteger(quantity)))
    errors.quantity = "Bitte eine ganze Anzahl ab 1 angeben.";
  return errors;
}

const RESULT_ID = "lademeter-ergebnis";

export function LademeterForm() {
  const formId = useId();
  const { state, setState, showErrors, markSubmitted, reset } = useCalculatorState(INITIAL, sanitize, toShare);

  const errors = useMemo(() => Object.fromEntries(state.rows.map((row) => [row.id, rowErrors(row)])), [state.rows]);
  const isValid = Object.values(errors).every((rowError) => Object.keys(rowError).length === 0);

  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateLademeter({
      unit: state.unit,
      kgPerLoadingMeter: parseDecimal(state.factor),
      items: state.rows.map((row) => ({
        length: parseDecimal(row.length),
        width: parseDecimal(row.width),
        height: parseDecimal(row.height),
        quantity: parseDecimal(row.quantity) ?? 0,
        weight: parseDecimal(row.weight),
        stackLayers: Number(row.layers),
      })),
    });
  }, [isValid, state]);

  function updateRow(id: string, patch: Partial<CargoRowState>) {
    setState((current) => ({
      ...current,
      rows: current.rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    }));
  }

  function addRow() {
    setState((current) => ({ ...current, rows: [...current.rows, createRow(current.rows.length)] }));
  }

  function duplicateRow(id: string) {
    setState((current) => {
      const source = current.rows.find((row) => row.id === id);
      if (!source) return current;
      return {
        ...current,
        rows: [...current.rows, { ...source, id: nextRowId(), name: `${source.name} (Kopie)` }],
      };
    });
  }

  function removeRow(id: string) {
    setState((current) =>
      current.rows.length > 1 ? { ...current, rows: current.rows.filter((row) => row.id !== id) } : current,
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    markSubmitted();
    if (isValid) {
      revealResult(RESULT_ID);
    } else {
      const firstInvalid = document.querySelector<HTMLInputElement>(`#${CSS.escape(formId)} [aria-invalid="true"]`);
      firstInvalid?.focus();
    }
  }

  const summary = result
    ? [
        `Lademeter-Berechnung (lademeter-rechner.de)`,
        ...state.rows.map(
          (row) =>
            `${row.name}: ${row.length} × ${row.width}${row.height ? ` × ${row.height}` : ""} ${state.unit}, Anzahl ${row.quantity}${row.layers !== "1" ? `, ${row.layers} Lagen` : ""}`,
        ),
        `Lademeter: ${formatDecimal(result.totalLoadingMeters)} ldm`,
        `Grundfläche: ${formatDecimal(result.totalFootprintSqm)} m²`,
        result.chargeableWeightKg !== null
          ? `Frachtpflichtiges Gewicht: ${formatDecimal(result.chargeableWeightKg, 0)} kg`
          : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate aria-label="Lademeter berechnen">
      <CalculatorShell
        form={
          <div>
            <CalculatorHeader
              title="Ladungsdaten"
              description="Erfassen Sie eine oder mehrere Ladungspositionen. Dezimalzahlen mit Komma oder Punkt."
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <UnitSelect
                id={`${formId}-unit`}
                label="Maßeinheit"
                value={state.unit}
                onChange={(value) => setState((current) => ({ ...current, unit: value as LademeterUnit }))}
                options={[
                  { value: "mm", label: "Millimeter (mm)" },
                  { value: "cm", label: "Zentimeter (cm)" },
                  { value: "m", label: "Meter (m)" },
                ]}
              />
            </div>

            <div className="mt-6 space-y-6">
              {state.rows.map((row, index) => {
                const rowError = showErrors ? errors[row.id] : undefined;
                return (
                  <fieldset key={row.id} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                    <legend className="sr-only">Ladungsposition {index + 1}</legend>
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex min-w-0 flex-1 max-w-xs flex-col text-xs text-slate-500">
                        Bezeichnung
                        <input
                          value={row.name}
                          maxLength={40}
                          onChange={(event) => updateRow(row.id, { name: event.target.value })}
                          className="mt-0.5 rounded-md border border-dashed border-slate-300 bg-white px-2 py-1 text-sm font-semibold text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                        />
                      </label>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => duplicateRow(row.id)}
                          aria-label={`${row.name} duplizieren`}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        >
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          disabled={state.rows.length === 1}
                          aria-label={`${row.name} entfernen`}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <NumberField
                        id={`${row.id}-length`}
                        label="Länge"
                        unitLabel={state.unit}
                        required
                        value={row.length}
                        onChange={(value) => updateRow(row.id, { length: value })}
                        error={rowError?.length}
                      />
                      <NumberField
                        id={`${row.id}-width`}
                        label="Breite"
                        unitLabel={state.unit}
                        required
                        value={row.width}
                        onChange={(value) => updateRow(row.id, { width: value })}
                        error={rowError?.width}
                      />
                      <QuantityField
                        id={`${row.id}-quantity`}
                        label="Anzahl"
                        value={row.quantity}
                        onChange={(value) => updateRow(row.id, { quantity: value })}
                        error={rowError?.quantity}
                      />
                      <UnitSelect
                        id={`${row.id}-layers`}
                        label="Stapellagen"
                        value={row.layers}
                        onChange={(value) => updateRow(row.id, { layers: value })}
                        options={[
                          { value: "1", label: "1 – nicht stapelbar" },
                          { value: "2", label: "2 Lagen" },
                          { value: "3", label: "3 Lagen" },
                          { value: "4", label: "4 Lagen" },
                        ]}
                      />
                      <NumberField
                        id={`${row.id}-height`}
                        label="Höhe (optional)"
                        unitLabel={state.unit}
                        value={row.height}
                        onChange={(value) => updateRow(row.id, { height: value })}
                        helpText="Nur für das Volumen."
                      />
                      <NumberField
                        id={`${row.id}-weight`}
                        label="Gewicht pro Stück (optional)"
                        unitLabel="kg"
                        value={row.weight}
                        onChange={(value) => updateRow(row.id, { weight: value })}
                      />
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 hover:underline"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Weitere Ladung hinzufügen
            </button>

            <fieldset className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <legend className="px-1 text-sm font-bold text-slate-900">
                Frachtpflichtiges Gewicht (optional)
              </legend>
              <NumberField
                id={`${formId}-factor`}
                label="Umrechnungsfaktor Ihrer Spedition"
                unitLabel="kg/ldm"
                value={state.factor}
                onChange={(value) => setState((current) => ({ ...current, factor: value }))}
                placeholder="z. B. 1850"
                helpText="Viele Tarife rechnen mit 1.500–2.000 kg je Lademeter. Maßgeblich ist Ihr Tarif."
              />
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Häufige Umrechnungsfaktoren">
                {FACTOR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setState((current) => ({ ...current, factor: preset }))}
                    aria-pressed={state.factor === preset}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-500 aria-pressed:border-brand-500 aria-pressed:bg-brand-500 aria-pressed:text-ink-900"
                  >
                    {Number(preset).toLocaleString("de-DE")} kg
                  </button>
                ))}
              </div>
            </fieldset>

            <ToolActions onReset={reset} />
          </div>
        }
        result={
          <ResultPanel
            id={RESULT_ID}
            primary={{
              label: "Lademeter gesamt",
              value: result ? formatDecimal(result.totalLoadingMeters) : undefined,
              unit: "ldm",
              hint: result
                ? `${formatDecimal(result.semiTrailerSharePercent, 1)} % eines Sattelzugs (13,6 ldm)`
                : undefined,
            }}
            metrics={[
              {
                label: "Bodenstellplätze",
                value: result ? formatDecimal(result.totalFloorPositions, 0) : undefined,
              },
              {
                label: "Grundfläche",
                unit: "m²",
                value: result ? formatDecimal(result.totalFootprintSqm) : undefined,
              },
              {
                label: "Volumen",
                unit: "m³",
                value: result && result.totalVolumeCbm > 0 ? formatDecimal(result.totalVolumeCbm) : undefined,
              },
              {
                label: "Tatsächliches Gewicht",
                unit: "kg",
                value: result && result.totalWeightKg > 0 ? formatDecimal(result.totalWeightKg, 0) : undefined,
              },
              {
                label: "Lademetergewicht",
                unit: "kg",
                value:
                  result && result.loadingMeterWeightKg !== null
                    ? formatDecimal(result.loadingMeterWeightKg, 0)
                    : undefined,
              },
              {
                label: "Frachtpflichtiges Gewicht",
                unit: "kg",
                value:
                  result && result.chargeableWeightKg !== null ? formatDecimal(result.chargeableWeightKg, 0) : undefined,
              },
            ]}
            notes={result?.utilizationNotes}
            actions={<ResultActions shareState={toShare(state)} summary={summary} />}
          />
        }
      />
    </form>
  );
}
