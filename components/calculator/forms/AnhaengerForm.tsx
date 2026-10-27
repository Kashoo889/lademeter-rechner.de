"use client";

import { useId, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { NumberField } from "@/components/calculator/NumberField";
import { UnitSelect } from "@/components/calculator/UnitSelect";
import { ResultPanel, type ResultStatus } from "@/components/calculator/ResultPanel";
import { ResultActions } from "@/components/calculator/ResultActions";
import { ToolActions } from "@/components/calculator/ToolActions";
import { revealResult, useCalculatorState } from "@/components/calculator/useCalculatorState";
import {
  calculateAnhaengerZuladung,
  validateInput,
  type AnhaengerZuladungInput,
  type Check,
  type CheckTone,
} from "@/lib/calculators/anhaengerZuladung";
import { formatDecimal, parseDecimal } from "@/lib/parseDecimal";
import { asOneOf, asString } from "@/lib/shareState";
import { cn } from "@/lib/utils";

type FormState = {
  zugZgg: string;
  zugLeer: string;
  zugO1: string;
  zugO2: string;
  zugStuetz: string;
  kupplungStuetz: string;
  anZgg: string;
  anLeer: string;
  bremse: "gebremst" | "ungebremst";
  achsen: "einachsig" | "mehrachsig";
  anStuetz: string;
  ladung: string;
  stuetzIst: string;
  mitfahrer: string;
  gepaeck: string;
  fahrer: string;
};

const INITIAL: FormState = {
  zugZgg: "",
  zugLeer: "",
  zugO1: "",
  zugO2: "",
  zugStuetz: "",
  kupplungStuetz: "",
  anZgg: "",
  anLeer: "",
  bremse: "gebremst",
  achsen: "einachsig",
  anStuetz: "",
  ladung: "",
  stuetzIst: "",
  mitfahrer: "",
  gepaeck: "",
  fahrer: "",
};

/** Beispielwerte (keine Fahrzeugdaten eines bestimmten Modells). */
const EXAMPLE: FormState = {
  ...INITIAL,
  zugZgg: "2050",
  zugLeer: "1450",
  zugO1: "1500",
  zugO2: "700",
  zugStuetz: "75",
  anZgg: "1300",
  anLeer: "400",
  ladung: "800",
  stuetzIst: "60",
  mitfahrer: "75",
  gepaeck: "50",
};

const KEYS = Object.keys(INITIAL) as (keyof FormState)[];

function toShare(state: FormState) {
  return Object.fromEntries(KEYS.map((key) => [key, state[key]]));
}

function sanitize(raw: unknown): FormState | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!KEYS.some((key) => asString(d[key]) !== "")) return null;
  const next: FormState = { ...INITIAL };
  for (const key of KEYS) {
    if (key === "bremse") next.bremse = asOneOf(d.bremse, ["gebremst", "ungebremst"] as const, "gebremst");
    else if (key === "achsen") next.achsen = asOneOf(d.achsen, ["einachsig", "mehrachsig"] as const, "einachsig");
    else (next as Record<string, string>)[key] = asString(d[key]).slice(0, 12);
  }
  return next;
}

function toInput(state: FormState): AnhaengerZuladungInput {
  return {
    zug: {
      zgg: parseDecimal(state.zugZgg),
      leer: parseDecimal(state.zugLeer),
      anhaengelastGebremst: parseDecimal(state.zugO1),
      anhaengelastUngebremst: parseDecimal(state.zugO2),
      stuetzlast: parseDecimal(state.zugStuetz),
      kupplungStuetzlast: parseDecimal(state.kupplungStuetz),
    },
    anhaenger: {
      zgg: parseDecimal(state.anZgg),
      leer: parseDecimal(state.anLeer),
      gebremst: state.bremse === "gebremst",
      einachsig: state.achsen === "einachsig",
      stuetzlast: parseDecimal(state.anStuetz),
    },
    beladung: {
      ladung: parseDecimal(state.ladung),
      stuetzlastIst: parseDecimal(state.stuetzIst),
      mitfahrer: parseDecimal(state.mitfahrer),
      gepaeck: parseDecimal(state.gepaeck),
      fahrer: parseDecimal(state.fahrer),
    },
  };
}

/** Eingabefelder, bei denen Text (nicht leer) keine gültige Zahl ergibt. */
function textErrors(state: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of KEYS) {
    if (key === "bremse" || key === "achsen") continue;
    const value = state[key].trim();
    if (value !== "" && parseDecimal(value) === null) errors[key] = "Bitte eine Zahl angeben.";
  }
  return errors;
}

const FIELD_OF: Record<string, keyof FormState> = {
  "zug.zgg": "zugZgg",
  "zug.leer": "zugLeer",
  "zug.anhaengelastGebremst": "zugO1",
  "zug.anhaengelastUngebremst": "zugO2",
  "zug.stuetzlast": "zugStuetz",
  "zug.kupplungStuetzlast": "kupplungStuetz",
  "anhaenger.zgg": "anZgg",
  "anhaenger.leer": "anLeer",
  "anhaenger.stuetzlast": "anStuetz",
  "beladung.ladung": "ladung",
  "beladung.stuetzlastIst": "stuetzIst",
  "beladung.mitfahrer": "mitfahrer",
  "beladung.gepaeck": "gepaeck",
  "beladung.fahrer": "fahrer",
};

const TONE_STYLE: Record<CheckTone, { box: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  success: { box: "border-emerald-300 bg-emerald-50", icon: CheckCircle2, label: "in Ordnung" },
  warning: { box: "border-amber-300 bg-amber-50", icon: AlertTriangle, label: "knapp bzw. Hinweis" },
  danger: { box: "border-red-300 bg-red-50", icon: XCircle, label: "Problem" },
  info: { box: "border-slate-200 bg-white", icon: Info, label: "Information" },
};

function CheckCard({ check }: { check: Check }) {
  const style = TONE_STYLE[check.tone];
  const Icon = style.icon;
  return (
    <li className={cn("rounded-xl border p-3.5", style.box)}>
      <p className="flex items-start gap-2 text-sm font-bold text-slate-950">
        <Icon
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0",
            check.tone === "success" && "text-emerald-700",
            check.tone === "warning" && "text-amber-700",
            check.tone === "danger" && "text-red-700",
            check.tone === "info" && "text-slate-500",
          )}
          aria-hidden="true"
        />
        <span>
          {check.title}
          <span className="sr-only"> – {style.label}</span>
        </span>
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-800">{check.summary}</p>
      <details className="group mt-1.5">
        <summary className="cursor-pointer text-xs font-semibold text-slate-600 underline-offset-2 hover:underline">
          Rechenweg anzeigen
        </summary>
        <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-700">
          {check.details.map((line) => (
            <li key={line} className="list-inside list-disc">
              {line}
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

const RESULT_ID = "anhaenger-ergebnis";

const kg = (value: number) => `${formatDecimal(Math.round(value * 10) / 10, 1)} kg`;

export function AnhaengerForm() {
  const formId = useId();
  const { state, setState, showErrors, markSubmitted, reset } = useCalculatorState(INITIAL, sanitize, toShare);

  const input = useMemo(() => toInput(state), [state]);
  const errors = useMemo(() => {
    const fromCore: Record<string, string> = {};
    for (const [path, message] of Object.entries(validateInput(input))) {
      const field = FIELD_OF[path];
      if (field && message) fromCore[field] = message;
    }
    return { ...fromCore, ...textErrors(state) };
  }, [input, state]);
  const hasErrors = Object.keys(errors).length > 0;
  const result = useMemo(() => (hasErrors ? null : calculateAnhaengerZuladung(input)), [hasErrors, input]);

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
    ? result.overall === "danger"
      ? { tone: "danger", label: "Mindestens eine Grenze ist überschritten." }
      : result.overall === "warning"
        ? { tone: "warning", label: "Es wird knapp oder es gibt einen Hinweis zu beachten." }
        : { tone: "success", label: "Alle berechneten Grenzen sind eingehalten." }
    : null;

  const n = result?.numbers;
  const hasLadung = parseDecimal(state.ladung) !== null;
  const primary = n
    ? n.anhaengerZuladungMax !== null
      ? hasLadung && n.anhaengerZuladungRest !== null
        ? {
            label: n.anhaengerZuladungRest >= 0 ? "Restzuladung Anhänger" : "Anhänger überladen um",
            value: formatDecimal(Math.abs(Math.round(n.anhaengerZuladungRest * 10) / 10), 1),
            unit: "kg",
            hint: `Maximale Zuladung: ${kg(n.anhaengerZuladungMax)}`,
          }
        : { label: "Maximale Zuladung Anhänger", value: formatDecimal(n.anhaengerZuladungMax, 1), unit: "kg" }
      : n.zugZuladungRest !== null
        ? {
            label: n.zugZuladungRest >= 0 ? "Restzuladung Zugfahrzeug" : "Zugfahrzeug überladen um",
            value: formatDecimal(Math.abs(Math.round(n.zugZuladungRest * 10) / 10), 1),
            unit: "kg",
          }
        : undefined
    : undefined;

  const metrics = [
    { label: "Anhänger gesamt (beladen)", unit: "kg", value: n?.anhaengerGesamt != null ? formatDecimal(n.anhaengerGesamt, 1) : undefined },
    { label: "Erlaubte Anhängelast", unit: "kg", value: n?.anhaengelastGrenze != null ? formatDecimal(n.anhaengelastGrenze, 1) : undefined },
    { label: "Reserve Anhängelast", unit: "kg", value: n?.anhaengelastReserve != null ? formatDecimal(n.anhaengelastReserve, 1) : undefined },
    {
      label: "Stützlast (Soll)",
      unit: "kg",
      value:
        n?.stuetzlastMin != null
          ? n.stuetzlastMax != null
            ? `${formatDecimal(n.stuetzlastMin, 1)} bis ${formatDecimal(n.stuetzlastMax, 1)}`
            : `ab ${formatDecimal(n.stuetzlastMin, 1)}`
          : undefined,
    },
    { label: "Restzuladung Zugfahrzeug", unit: "kg", value: n?.zugZuladungRest != null ? formatDecimal(n.zugZuladungRest, 1) : undefined },
  ];

  const summary = result
    ? [
        "Anhänger-Zuladungsrechner (lademeter-rechner.de)",
        ...result.checks.map((check) => `${check.title}: ${check.summary}`),
        "Angaben ohne Gewähr; maßgeblich sind die Fahrzeugpapiere.",
      ].join("\n")
    : "";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate aria-label="Anhänger-Zuladung berechnen">
      <CalculatorShell
        form={
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CalculatorHeader
                title="Zugfahrzeug (Fahrzeugschein)"
                description="Alle Werte in kg aus der Zulassungsbescheinigung Teil I. Felder ohne Pflicht dürfen leer bleiben."
              />
              <button
                type="button"
                onClick={() => setState(EXAMPLE)}
                className="no-print text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Beispielwerte einsetzen
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField
                id={`${formId}-zug-zgg`}
                label="Zulässige Gesamtmasse"
                unitLabel="kg"
                value={state.zugZgg}
                onChange={(v) => set("zugZgg", v)}
                helpText="Feld F.2, ersatzweise F.1 – bei Abweichung der kleinere Wert."
                error={err("zugZgg")}
              />
              <NumberField
                id={`${formId}-zug-leer`}
                label="Leermasse"
                unitLabel="kg"
                value={state.zugLeer}
                onChange={(v) => set("zugLeer", v)}
                helpText="Feld G."
                error={err("zugLeer")}
              />
              <NumberField
                id={`${formId}-zug-o1`}
                label="Anhängelast gebremst"
                unitLabel="kg"
                value={state.zugO1}
                onChange={(v) => set("zugO1", v)}
                helpText="Feld O.1."
                error={err("zugO1")}
              />
              <NumberField
                id={`${formId}-zug-o2`}
                label="Anhängelast ungebremst"
                unitLabel="kg"
                value={state.zugO2}
                onChange={(v) => set("zugO2", v)}
                helpText="Feld O.2."
                error={err("zugO2")}
              />
              <NumberField
                id={`${formId}-zug-stuetz`}
                label="Stützlast Zugfahrzeug"
                unitLabel="kg"
                value={state.zugStuetz}
                onChange={(v) => set("zugStuetz", v)}
                helpText="Feld 13 (nutzbare Stützlast), sonst Herstellerangabe."
                error={err("zugStuetz")}
              />
            </div>

            <div className="mt-8">
              <CalculatorHeader title="Anhänger" description="Werte aus dem Fahrzeugschein des Anhängers." />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField
                id={`${formId}-an-zgg`}
                label="Zulässige Gesamtmasse"
                unitLabel="kg"
                value={state.anZgg}
                onChange={(v) => set("anZgg", v)}
                helpText="Feld F.2, ersatzweise F.1."
                error={err("anZgg")}
              />
              <NumberField
                id={`${formId}-an-leer`}
                label="Leermasse"
                unitLabel="kg"
                value={state.anLeer}
                onChange={(v) => set("anLeer", v)}
                helpText="Feld G."
                error={err("anLeer")}
              />
              <UnitSelect
                id={`${formId}-bremse`}
                label="Bremse"
                value={state.bremse}
                onChange={(v) => set("bremse", v as FormState["bremse"])}
                options={[
                  { value: "gebremst", label: "gebremst (z. B. Auflaufbremse)" },
                  { value: "ungebremst", label: "ungebremst" },
                ]}
              />
              {state.bremse === "ungebremst" ? (
                <UnitSelect
                  id={`${formId}-achsen`}
                  label="Achsen"
                  value={state.achsen}
                  onChange={(v) => set("achsen", v as FormState["achsen"])}
                  options={[
                    { value: "einachsig", label: "einachsig" },
                    { value: "mehrachsig", label: "mehrachsig" },
                  ]}
                />
              ) : null}
            </div>

            <div className="mt-8">
              <CalculatorHeader title="Beladung" description="Tatsächliche Gewichte, so genau wie möglich. Im Zweifel wiegen." />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField
                id={`${formId}-ladung`}
                label="Ladung auf dem Anhänger"
                unitLabel="kg"
                value={state.ladung}
                onChange={(v) => set("ladung", v)}
                helpText="Nur die Ladung, ohne das Leergewicht des Anhängers."
                error={err("ladung")}
              />
              <NumberField
                id={`${formId}-stuetz-ist`}
                label="Stützlast, tatsächlich"
                unitLabel="kg"
                value={state.stuetzIst}
                onChange={(v) => set("stuetzIst", v)}
                helpText="Gemessen oder geschätzt (Last auf der Kupplung)."
                error={err("stuetzIst")}
              />
              <NumberField
                id={`${formId}-mitfahrer`}
                label="Mitfahrer im Zugfahrzeug"
                unitLabel="kg"
                value={state.mitfahrer}
                onChange={(v) => set("mitfahrer", v)}
                helpText="Ohne den Fahrer."
                error={err("mitfahrer")}
              />
              <NumberField
                id={`${formId}-gepaeck`}
                label="Gepäck und Zubehör im Zugfahrzeug"
                unitLabel="kg"
                value={state.gepaeck}
                onChange={(v) => set("gepaeck", v)}
                helpText="Auch Ladung im Kofferraum, Fahrradträger usw."
                error={err("gepaeck")}
              />
              <NumberField
                id={`${formId}-fahrer`}
                label="Fahrergewicht (optional)"
                unitLabel="kg"
                value={state.fahrer}
                onChange={(v) => set("fahrer", v)}
                helpText="Standard 75 kg, die üblicherweise schon in der Leermasse stecken."
                error={err("fahrer")}
              />
            </div>

            <details className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <summary className="cursor-pointer text-sm font-bold text-slate-800">Weitere Stützlast-Grenzen (optional)</summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id={`${formId}-an-stuetz`}
                  label="Stützlast laut Anhänger"
                  unitLabel="kg"
                  value={state.anStuetz}
                  onChange={(v) => set("anStuetz", v)}
                  helpText="Feld 13 im Fahrzeugschein des Anhängers."
                  error={err("anStuetz")}
                />
                <NumberField
                  id={`${formId}-kupplung-stuetz`}
                  label="Stützlast laut Anhängekupplung"
                  unitLabel="kg"
                  value={state.kupplungStuetz}
                  onChange={(v) => set("kupplungStuetz", v)}
                  helpText="Typschild an der Kupplung. Es gilt der kleinste Wert."
                  error={err("kupplungStuetz")}
                />
              </div>
            </details>

            <ToolActions onReset={reset} submitLabel="Gespann prüfen" />
            {showErrors && !hasErrors && !result ? (
              <p className="mt-3 text-sm font-medium text-red-700">
                Bitte mindestens Gesamtmasse und Leermasse von Anhänger oder Zugfahrzeug eintragen.
              </p>
            ) : null}
          </div>
        }
        result={
          <ResultPanel
            id={RESULT_ID}
            primary={primary}
            status={status}
            metrics={metrics}
            visual={
              result ? (
                <ul className="space-y-2.5" aria-label="Einzelne Prüfungen">
                  {result.checks.map((check) => (
                    <CheckCard key={check.id} check={check} />
                  ))}
                </ul>
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
