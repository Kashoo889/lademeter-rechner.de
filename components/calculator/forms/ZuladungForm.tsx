"use client";

import { useId, useMemo } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { NumberField } from "@/components/calculator/NumberField";
import { QuantityField } from "@/components/calculator/QuantityField";
import { UnitSelect } from "@/components/calculator/UnitSelect";
import { ResultPanel, type ResultStatus } from "@/components/calculator/ResultPanel";
import { ResultActions } from "@/components/calculator/ResultActions";
import { ToolActions } from "@/components/calculator/ToolActions";
import { revealResult, useCalculatorState } from "@/components/calculator/useCalculatorState";
import { calculateZuladung, validateZuladung, type FahrzeugArt, type ZuladungInput } from "@/lib/calculators/zuladung";
import { formatDecimal, parseDecimal } from "@/lib/parseDecimal";
import { asBool, asOneOf, asString } from "@/lib/shareState";

type FormState = {
  art: FahrzeugArt;
  zgg: string;
  leer: string;
  personen: string;
  gewichtProPerson: string;
  fahrer: string;
  gepaeck: string;
  zubehoer: string;
  raeder: string;
  gewichtProRad: string;
  wasserLiter: string;
  gasKg: string;
  wasserGasInLeermasse: boolean;
  stuetzlast: string;
};

const INITIAL: FormState = {
  art: "pkw",
  zgg: "",
  leer: "",
  personen: "",
  gewichtProPerson: "",
  fahrer: "",
  gepaeck: "",
  zubehoer: "",
  raeder: "",
  gewichtProRad: "",
  wasserLiter: "",
  gasKg: "",
  wasserGasInLeermasse: false,
  stuetzlast: "",
};

/** Frei gewählte Beispielwerte, kein bestimmtes Fahrzeugmodell. */
const EXAMPLE: FormState = {
  ...INITIAL,
  zgg: "2000",
  leer: "1400",
  personen: "3",
  gepaeck: "100",
  zubehoer: "30",
  raeder: "2",
  gewichtProRad: "20",
};

const TEXT_KEYS = [
  "zgg",
  "leer",
  "personen",
  "gewichtProPerson",
  "fahrer",
  "gepaeck",
  "zubehoer",
  "raeder",
  "gewichtProRad",
  "wasserLiter",
  "gasKg",
  "stuetzlast",
] as const;

function toShare(state: FormState) {
  return { ...Object.fromEntries(TEXT_KEYS.map((key) => [key, state[key]])), art: state.art, wg: state.wasserGasInLeermasse };
}

function sanitize(raw: unknown): FormState | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!TEXT_KEYS.some((key) => asString(d[key]) !== "")) return null;
  const next: FormState = { ...INITIAL };
  for (const key of TEXT_KEYS) next[key] = asString(d[key]).slice(0, 12);
  next.art = asOneOf(d.art, ["pkw", "transporter", "wohnmobil"] as const, "pkw");
  next.wasserGasInLeermasse = asBool(d.wg, false);
  return next;
}

function toInput(state: FormState): ZuladungInput {
  return {
    art: state.art,
    zgg: parseDecimal(state.zgg),
    leer: parseDecimal(state.leer),
    personen: parseDecimal(state.personen),
    gewichtProPerson: parseDecimal(state.gewichtProPerson),
    fahrer: parseDecimal(state.fahrer),
    gepaeck: parseDecimal(state.gepaeck),
    zubehoer: parseDecimal(state.zubehoer),
    raeder: parseDecimal(state.raeder),
    gewichtProRad: parseDecimal(state.gewichtProRad),
    wasserLiter: parseDecimal(state.wasserLiter),
    gasKg: parseDecimal(state.gasKg),
    wasserGasInLeermasse: state.wasserGasInLeermasse,
    stuetzlast: parseDecimal(state.stuetzlast),
  };
}

const RESULT_ID = "zuladung-ergebnis";
const kg = (value: number) => `${formatDecimal(Math.round(value * 10) / 10, 1)} kg`;

export function ZuladungForm() {
  const formId = useId();
  const { state, setState, showErrors, markSubmitted, reset } = useCalculatorState(INITIAL, sanitize, toShare);

  const input = useMemo(() => toInput(state), [state]);
  const errors = useMemo(() => {
    const result: Record<string, string> = { ...validateZuladung(input) } as Record<string, string>;
    for (const key of TEXT_KEYS) {
      const value = state[key].trim();
      if (value !== "" && parseDecimal(value) === null) result[key] = "Bitte eine Zahl angeben.";
    }
    return result;
  }, [input, state]);
  const hasErrors = Object.keys(errors).length > 0;
  const result = useMemo(() => (hasErrors ? null : calculateZuladung(input)), [hasErrors, input]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }
  const err = (key: keyof FormState) => (showErrors ? errors[key] : undefined);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    markSubmitted();
    if (!hasErrors && result) revealResult(RESULT_ID);
  }

  const status: ResultStatus | null = result
    ? result.tone === "danger"
      ? { tone: "danger", label: "Das Fahrzeug wäre überladen." }
      : result.tone === "warning"
        ? { tone: "warning", label: "Es wird knapp. Wiegen Sie vor der Fahrt." }
        : { tone: "success", label: "Die Zuladung reicht." }
    : null;

  const summary = result
    ? [
        "Zuladungsrechner (lademeter-rechner.de)",
        result.summary,
        ...result.items.map((item) => `${item.label}: ${kg(item.kg)}`),
        "Angaben ohne Gewähr; maßgeblich sind die Fahrzeugpapiere. Achslasten wurden nicht geprüft.",
      ].join("\n")
    : "";

  const wohnmobil = state.art === "wohnmobil";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate aria-label="Zuladung berechnen">
      <CalculatorShell
        form={
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CalculatorHeader title="Fahrzeug (Fahrzeugschein)" description="Werte in kg aus der Zulassungsbescheinigung Teil I." />
              <button
                type="button"
                onClick={() => setState(EXAMPLE)}
                className="no-print text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Beispielwerte einsetzen
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <UnitSelect
                id={`${formId}-art`}
                label="Fahrzeugart"
                value={state.art}
                onChange={(v) => set("art", v as FahrzeugArt)}
                options={[
                  { value: "pkw", label: "Pkw / Kombi" },
                  { value: "transporter", label: "Transporter / Kastenwagen" },
                  { value: "wohnmobil", label: "Wohnmobil / Reisemobil" },
                ]}
                className="sm:col-span-2"
              />
              <NumberField
                id={`${formId}-zgg`}
                label="Zulässige Gesamtmasse"
                unitLabel="kg"
                required
                value={state.zgg}
                onChange={(v) => set("zgg", v)}
                helpText="Feld F.2, ersatzweise F.1 – bei Abweichung der kleinere Wert."
                error={err("zgg")}
              />
              <NumberField
                id={`${formId}-leer`}
                label="Leermasse"
                unitLabel="kg"
                required
                value={state.leer}
                onChange={(v) => set("leer", v)}
                helpText="Feld G. Steht in Feld 22 eine tatsächliche Masse, nehmen Sie diese."
                error={err("leer")}
              />
            </div>

            <div className="mt-8">
              <CalculatorHeader title="Personen" description="Der Fahrer ist üblicherweise mit 75 kg schon in der Leermasse enthalten." />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <QuantityField
                id={`${formId}-personen`}
                label="Mitfahrer (ohne Fahrer)"
                value={state.personen}
                onChange={(v) => set("personen", v)}
                error={err("personen")}
              />
              <NumberField
                id={`${formId}-pro-person`}
                label="Gewicht je Mitfahrer"
                unitLabel="kg"
                value={state.gewichtProPerson}
                onChange={(v) => set("gewichtProPerson", v)}
                placeholder="75"
                helpText="Leer = 75 kg."
                error={err("gewichtProPerson")}
              />
              <NumberField
                id={`${formId}-fahrer`}
                label="Fahrergewicht"
                unitLabel="kg"
                value={state.fahrer}
                onChange={(v) => set("fahrer", v)}
                placeholder="75"
                helpText="Nur der Teil über 75 kg wird abgezogen."
                error={err("fahrer")}
              />
            </div>

            <div className="mt-8">
              <CalculatorHeader title="Ladung und Zubehör" description="Tatsächliche Gewichte, im Zweifel wiegen." />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField
                id={`${formId}-gepaeck`}
                label="Gepäck und Ladung"
                unitLabel="kg"
                value={state.gepaeck}
                onChange={(v) => set("gepaeck", v)}
                helpText="Alles, was im Fahrzeug liegt."
                error={err("gepaeck")}
              />
              <NumberField
                id={`${formId}-zubehoer`}
                label="Zubehör nach der Erstzulassung"
                unitLabel="kg"
                value={state.zubehoer}
                onChange={(v) => set("zubehoer", v)}
                helpText="z. B. Dachbox, Träger, Markise, Aufbauten."
                error={err("zubehoer")}
              />
              <QuantityField
                id={`${formId}-raeder`}
                label="Fahrräder"
                value={state.raeder}
                onChange={(v) => set("raeder", v)}
                error={err("raeder")}
              />
              <NumberField
                id={`${formId}-pro-rad`}
                label="Gewicht je Fahrrad"
                unitLabel="kg"
                value={state.gewichtProRad}
                onChange={(v) => set("gewichtProRad", v)}
                helpText="E-Bikes wiegen oft über 20 kg."
                error={err("gewichtProRad")}
              />
            </div>

            {wohnmobil ? (
              <>
                <div className="mt-8">
                  <CalculatorHeader title="Wohnmobil: Wasser und Gas" description="1 Liter Frischwasser wiegt 1 kg." />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <NumberField
                    id={`${formId}-wasser`}
                    label="Frischwasser"
                    unitLabel="Liter"
                    value={state.wasserLiter}
                    onChange={(v) => set("wasserLiter", v)}
                    error={err("wasserLiter")}
                  />
                  <NumberField
                    id={`${formId}-gas`}
                    label="Gas (Flascheninhalt plus Flasche)"
                    unitLabel="kg"
                    value={state.gasKg}
                    onChange={(v) => set("gasKg", v)}
                    error={err("gasKg")}
                  />
                </div>
                <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={state.wasserGasInLeermasse}
                    onChange={(event) => set("wasserGasInLeermasse", event.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>
                    Wasser und Gas sind laut Herstellerdatenblatt bereits in der Leermasse enthalten.
                    <span className="block text-xs text-slate-500">Im Zweifel nicht ankreuzen, dann rechnet der Rechner auf der sicheren Seite.</span>
                  </span>
                </label>
              </>
            ) : null}

            <details className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <summary className="cursor-pointer text-sm font-bold text-slate-800">Mit Anhänger: Stützlast (optional)</summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id={`${formId}-stuetz`}
                  label="Stützlast des Anhängers"
                  unitLabel="kg"
                  value={state.stuetzlast}
                  onChange={(v) => set("stuetzlast", v)}
                  helpText="Die Last auf der Kupplung zählt zur Zuladung des Zugfahrzeugs."
                  error={err("stuetzlast")}
                />
              </div>
            </details>

            <ToolActions onReset={reset} submitLabel="Zuladung berechnen" />
            {showErrors && !hasErrors && !result ? (
              <p className="mt-3 text-sm font-medium text-red-700">Bitte zulässige Gesamtmasse und Leermasse eintragen.</p>
            ) : null}
          </div>
        }
        result={
          <ResultPanel
            id={RESULT_ID}
            primary={
              result
                ? {
                    label: result.rest >= 0 ? "Restzuladung" : "Überladen um",
                    value: formatDecimal(Math.abs(Math.round(result.rest * 10) / 10), 1),
                    unit: "kg",
                    hint: `Maximale Zuladung: ${kg(result.max)}`,
                  }
                : undefined
            }
            status={status}
            metrics={[
              { label: "Maximale Zuladung", unit: "kg", value: result ? formatDecimal(result.max, 1) : undefined },
              { label: "Davon belegt", unit: "kg", value: result ? formatDecimal(Math.round(result.belegt * 10) / 10, 1) : undefined },
              { label: "Auslastung der Zuladung", unit: "%", value: result ? formatDecimal(Math.round(result.auslastungProzent * 10) / 10, 1) : undefined },
            ]}
            visual={
              result ? (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-bold text-slate-900">So setzt sich die Last zusammen</p>
                  {result.items.length > 0 ? (
                    <ul className="mt-2 divide-y divide-slate-100 text-sm">
                      {result.items.map((item) => (
                        <li key={item.id} className="flex items-start justify-between gap-3 py-2">
                          <span className="text-slate-700">
                            {item.label}
                            {item.hint ? <span className="block text-xs text-slate-500">{item.hint}</span> : null}
                          </span>
                          <span className="num shrink-0 font-semibold text-slate-950">{kg(item.kg)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">Noch keine Last angegeben: Die gesamte Zuladung ist frei.</p>
                  )}
                  <p className="mt-3 text-sm leading-6 text-slate-800">{result.summary}</p>
                </div>
              ) : undefined
            }
            notes={result?.notes}
            actions={<ResultActions shareState={toShare(state)} summary={summary} />}
          />
        }
      />
    </form>
  );
}
