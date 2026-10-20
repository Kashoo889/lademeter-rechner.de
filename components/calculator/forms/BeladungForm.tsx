"use client";

import { useId, useMemo } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { NumberField } from "@/components/calculator/NumberField";
import { QuantityField } from "@/components/calculator/QuantityField";
import { UnitSelect } from "@/components/calculator/UnitSelect";
import { ResultPanel, type ResultStatus } from "@/components/calculator/ResultPanel";
import { ResultActions } from "@/components/calculator/ResultActions";
import { ToolActions } from "@/components/calculator/ToolActions";
import { UtilizationBars } from "@/components/calculator/UtilizationBars";
import { nextRowId, revealResult, useCalculatorState } from "@/components/calculator/useCalculatorState";
import { calculateTruckLoading } from "@/lib/calculators/truckLoading";
import { VEHICLE_LIST, VEHICLES, type VehiclePreset } from "@/lib/calculators/vehicles";
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
  vehiclePreset: VehiclePreset;
  vehicleLength: string;
  vehicleWidth: string;
  vehicleHeight: string;
  maxPayload: string;
  rows: CargoRowState[];
};

const VEHICLE_IDS = [...VEHICLE_LIST.map((vehicle) => vehicle.id), "custom"] as const;
const LAYER_OPTIONS = ["1", "2", "3", "4"] as const;

function createRow(index: number, patch: Partial<CargoRowState> = {}): CargoRowState {
  return {
    id: nextRowId(),
    name: `Position ${index + 1}`,
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
  vehiclePreset: "standard-semi-trailer",
  vehicleLength: "",
  vehicleWidth: "",
  vehicleHeight: "",
  maxPayload: "",
  rows: [{ id: "row-initial", name: "Position 1", length: "", width: "", height: "", quantity: "1", weight: "", layers: "1" }],
};

function toShare(state: FormState) {
  return {
    v: state.vehiclePreset,
    d: [state.vehicleLength, state.vehicleWidth, state.vehicleHeight, state.maxPayload],
    r: state.rows.map((row) => [row.name, row.length, row.width, row.height, row.quantity, row.weight, row.layers]),
  };
}

function sanitize(raw: unknown): FormState | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!Array.isArray(d.r) || d.r.length === 0) return null;
  const dims = Array.isArray(d.d) ? d.d : [];
  return {
    vehiclePreset: asOneOf(d.v, VEHICLE_IDS, "standard-semi-trailer"),
    vehicleLength: asString(dims[0]),
    vehicleWidth: asString(dims[1]),
    vehicleHeight: asString(dims[2]),
    maxPayload: asString(dims[3]),
    rows: d.r.slice(0, 50).map((entry, index) => {
      const row = Array.isArray(entry) ? entry : [];
      return createRow(index, {
        name: asString(row[0], `Position ${index + 1}`),
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

type VehicleErrors = Partial<Record<"vehicleLength" | "vehicleWidth", string>>;

function vehicleErrors(state: FormState): VehicleErrors {
  if (state.vehiclePreset !== "custom") return {};
  const errors: VehicleErrors = {};
  if (!((parseDecimal(state.vehicleLength) ?? 0) > 0)) errors.vehicleLength = "Bitte die Innenlänge angeben.";
  if (!((parseDecimal(state.vehicleWidth) ?? 0) > 0)) errors.vehicleWidth = "Bitte die Innenbreite angeben.";
  return errors;
}

const RESULT_ID = "beladung-ergebnis";

export function BeladungForm() {
  const formId = useId();
  const { state, setState, showErrors, markSubmitted, reset } = useCalculatorState(INITIAL, sanitize, toShare);

  const errors = useMemo(() => Object.fromEntries(state.rows.map((row) => [row.id, rowErrors(row)])), [state.rows]);
  const vErrors = useMemo(() => vehicleErrors(state), [state]);
  const isValid =
    Object.keys(vErrors).length === 0 &&
    Object.values(errors).every((rowError) => Object.keys(rowError).length === 0);

  const result = useMemo(() => {
    if (!isValid) return null;
    const payload = parseDecimal(state.maxPayload) ?? undefined;
    return calculateTruckLoading({
      vehiclePreset: state.vehiclePreset,
      vehicleDimensions:
        state.vehiclePreset === "custom"
          ? {
              lengthCm: parseDecimal(state.vehicleLength) ?? 0,
              widthCm: parseDecimal(state.vehicleWidth) ?? 0,
              heightCm: parseDecimal(state.vehicleHeight) ?? undefined,
              maxPayloadKg: payload,
            }
          : { maxPayloadKg: payload },
      rows: state.rows.map((row) => ({
        id: row.id,
        name: row.name,
        lengthCm: parseDecimal(row.length),
        widthCm: parseDecimal(row.width),
        heightCm: parseDecimal(row.height),
        quantity: parseDecimal(row.quantity) ?? 0,
        weightKg: parseDecimal(row.weight),
        stackLayers: Number(row.layers),
      })),
    });
  }, [isValid, state]);

  function update(patch: Partial<FormState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function updateRow(id: string, patch: Partial<CargoRowState>) {
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

  const vehicleLabel =
    state.vehiclePreset === "custom" ? "Benutzerdefiniertes Fahrzeug" : VEHICLES[state.vehiclePreset].label;
  const presetPayload = state.vehiclePreset === "custom" ? null : VEHICLES[state.vehiclePreset].payloadKg;

  const status: ResultStatus | null = result
    ? result.vehicleSuitability === "passt"
      ? { tone: "success", label: "Passt voraussichtlich" }
      : result.vehicleSuitability === "passt knapp"
        ? { tone: "warning", label: "Passt knapp – Anordnung prüfen" }
        : { tone: "danger", label: "Passt nicht" }
    : null;

  const summary = result
    ? [
        "LKW-Beladungsrechner (lademeter-rechner.de)",
        `Fahrzeug: ${vehicleLabel}`,
        ...state.rows.map(
          (row) =>
            `${row.name}: ${row.length} × ${row.width}${row.height ? ` × ${row.height}` : ""} cm, ${row.quantity} Stk.${row.weight ? `, ${row.weight} kg/Stk.` : ""}${row.layers !== "1" ? `, ${row.layers} Lagen` : ""}`,
        ),
        `Einschätzung: ${result.vehicleSuitability}`,
        `Lademeter: ${formatDecimal(result.totalLoadingMeters)} ldm, Bodenauslastung ${formatDecimal(result.floorAreaUtilizationPercent, 1)} %, Gewicht ${formatDecimal(result.totalWeightKg, 0)} kg`,
      ].join("\n")
    : "";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate aria-label="LKW-Beladung berechnen">
      <CalculatorShell
        form={
          <div>
            <CalculatorHeader title="Fahrzeug" />
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
              <NumberField
                id={`${formId}-payload`}
                label="Nutzlast"
                unitLabel="kg"
                value={state.maxPayload}
                onChange={(value) => update({ maxPayload: value })}
                placeholder={presetPayload ? String(presetPayload) : "optional"}
                helpText={
                  presetPayload
                    ? `Leer = typischer Wert ${presetPayload.toLocaleString("de-DE")} kg. Maßgeblich sind die Fahrzeugpapiere.`
                    : "Optional – ohne Angabe keine Gewichtsprüfung."
                }
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
                  error={showErrors ? vErrors.vehicleLength : undefined}
                />
                <NumberField
                  id={`${formId}-vw`}
                  label="Innenbreite"
                  unitLabel="cm"
                  required
                  value={state.vehicleWidth}
                  onChange={(value) => update({ vehicleWidth: value })}
                  error={showErrors ? vErrors.vehicleWidth : undefined}
                />
                <NumberField
                  id={`${formId}-vh`}
                  label="Innenhöhe (optional)"
                  unitLabel="cm"
                  value={state.vehicleHeight}
                  onChange={(value) => update({ vehicleHeight: value })}
                />
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Innenmaße ca. {formatDecimal(VEHICLES[state.vehiclePreset].lengthCm / 100)} ×{" "}
                {formatDecimal(VEHICLES[state.vehiclePreset].widthCm / 100)} ×{" "}
                {formatDecimal(VEHICLES[state.vehiclePreset].heightCm / 100)} m
              </p>
            )}

            <div className="mt-8">
              <CalculatorHeader
                title="Ladungspositionen"
                description="Maße je Stück in Zentimetern. Eine Position = gleichartige Packstücke."
              />
            </div>

            <div className="mt-4 space-y-6">
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
                          onClick={() =>
                            setState((current) => ({
                              ...current,
                              rows: [...current.rows, { ...row, id: nextRowId(), name: `${row.name} (Kopie)` }],
                            }))
                          }
                          aria-label={`${row.name} duplizieren`}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        >
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        </button>
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
                          aria-label={`${row.name} entfernen`}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <NumberField
                        id={`${row.id}-length`}
                        label="Länge"
                        unitLabel="cm"
                        required
                        value={row.length}
                        onChange={(value) => updateRow(row.id, { length: value })}
                        error={rowError?.length}
                      />
                      <NumberField
                        id={`${row.id}-width`}
                        label="Breite"
                        unitLabel="cm"
                        required
                        value={row.width}
                        onChange={(value) => updateRow(row.id, { width: value })}
                        error={rowError?.width}
                      />
                      <NumberField
                        id={`${row.id}-height`}
                        label="Höhe"
                        unitLabel="cm"
                        value={row.height}
                        onChange={(value) => updateRow(row.id, { height: value })}
                        helpText="Für Volumen & Stapeln."
                      />
                      <QuantityField
                        id={`${row.id}-quantity`}
                        label="Anzahl"
                        value={row.quantity}
                        onChange={(value) => updateRow(row.id, { quantity: value })}
                        error={rowError?.quantity}
                      />
                      <NumberField
                        id={`${row.id}-weight`}
                        label="Gewicht/Stück"
                        unitLabel="kg"
                        value={row.weight}
                        onChange={(value) => updateRow(row.id, { weight: value })}
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
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setState((current) => ({ ...current, rows: [...current.rows, createRow(current.rows.length)] }))}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 hover:underline"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Weitere Position hinzufügen
            </button>

            <ToolActions onReset={reset} />
          </div>
        }
        result={
          <ResultPanel
            id={RESULT_ID}
            title="Fahrzeugeignung"
            primary={{
              label: "Benötigte Lademeter",
              value: result ? formatDecimal(result.totalLoadingMeters) : undefined,
              unit: "ldm",
              hint: result ? `Rest: ca. ${formatDecimal(result.remainingLoadingMeters)} ldm` : undefined,
            }}
            status={status}
            metrics={[
              {
                label: "Bodenfläche",
                unit: "m²",
                value: result
                  ? `${formatDecimal(result.totalFloorAreaSqm)} / ${formatDecimal(result.vehicleFloorAreaSqm)}`
                  : undefined,
              },
              {
                label: "Gesamtgewicht",
                unit: "kg",
                value: result && result.totalWeightKg > 0 ? formatDecimal(result.totalWeightKg, 0) : undefined,
              },
              {
                label: "Gesamtvolumen",
                unit: "m³",
                value: result && result.totalVolumeCbm > 0 ? formatDecimal(result.totalVolumeCbm) : undefined,
              },
            ]}
            visual={
              result ? (
                <UtilizationBars
                  bars={[
                    { label: "Ladefläche", percent: result.floorAreaUtilizationPercent },
                    { label: "Nutzlast", percent: result.weightUtilizationPercent },
                    { label: "Laderaumvolumen", percent: result.volumeUtilizationPercent },
                  ]}
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
