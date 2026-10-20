type ResultMetricProps = {
  label: string;
  value?: string;
  unit?: string;
  hint?: string;
};

/** One secondary result value. Shows a dash until a real value exists - never a fabricated number. */
export function ResultMetric({ label, value, unit, hint }: ResultMetricProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-200/80 py-3 last:border-b-0">
      <dt className="text-sm text-slate-600">
        {label}
        {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
      </dt>
      <dd className={value ? "num text-right text-sm font-bold text-slate-950" : "text-sm text-slate-400"}>
        {value ?? "–"}
        {value && unit ? <span className="ml-1 font-normal text-slate-600">{unit}</span> : null}
      </dd>
    </div>
  );
}
