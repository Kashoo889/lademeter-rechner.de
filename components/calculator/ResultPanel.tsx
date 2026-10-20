import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ToolNotice } from "@/components/calculator/ToolNotice";
import { ResultMetric } from "@/components/calculator/ResultMetric";
import { cn } from "@/lib/utils";

export type ResultStatus = {
  tone: "success" | "warning" | "danger";
  label: string;
};

type Metric = { label: string; value?: string; unit?: string; hint?: string };

type ResultPanelProps = {
  /** DOM id used to scroll/focus the panel after calculating. */
  id: string;
  title?: string;
  placeholderMessage?: string;
  primary?: Metric;
  status?: ResultStatus | null;
  metrics: Metric[];
  /** Assumptions/notes shown in a collapsible block once a result exists. */
  notes?: string[];
  visual?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

const statusStyles: Record<ResultStatus["tone"], { box: string; icon: React.ComponentType<{ className?: string }> }> = {
  success: { box: "border-emerald-300 bg-emerald-50 text-emerald-900", icon: CheckCircle2 },
  warning: { box: "border-amber-300 bg-amber-50 text-amber-900", icon: AlertTriangle },
  danger: { box: "border-red-300 bg-red-50 text-red-900", icon: XCircle },
};

/**
 * Result panel: large primary value, optional status badge, secondary
 * metrics, an optional visual (load plan) and collapsible assumptions. The
 * value region is an aria-live region so screen readers announce updates.
 */
export function ResultPanel({
  id,
  title = "Ergebnis",
  placeholderMessage = "Das Ergebnis erscheint hier, sobald die Pflichtfelder ausgefüllt sind.",
  primary,
  status,
  metrics,
  notes,
  visual,
  actions,
  className,
}: ResultPanelProps) {
  const hasResult = Boolean(primary?.value) || metrics.some((metric) => metric.value !== undefined);
  const StatusIcon = status ? statusStyles[status.tone].icon : null;

  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-24 outline-none", className)}
    >
      <h2 id={`${id}-title`} className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {title}
      </h2>

      <div aria-live="polite" aria-atomic="true">
        {hasResult ? (
          <>
            {primary ? (
              <div
                key={primary.value}
                className="animate-pop relative mt-3 overflow-hidden rounded-2xl bg-ink-900 px-5 py-5 text-white shadow-lift"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/25 blur-2xl" aria-hidden="true" />
                <p className="relative text-sm font-medium text-slate-300">{primary.label}</p>
                <p className="num relative mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {primary.value ?? "–"}
                  {primary.value && primary.unit ? (
                    <span className="ml-2 text-lg font-bold text-brand-400">{primary.unit}</span>
                  ) : null}
                </p>
                {primary.hint ? <p className="relative mt-2 text-xs text-slate-300">{primary.hint}</p> : null}
              </div>
            ) : null}
            {status && StatusIcon ? (
              <p
                className={cn(
                  "mt-3 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold",
                  statusStyles[status.tone].box,
                )}
              >
                <StatusIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {status.label}
              </p>
            ) : null}
          </>
        ) : (
          <div className="mt-3">
            <ToolNotice>{placeholderMessage}</ToolNotice>
          </div>
        )}

        <dl className="mt-3 rounded-xl border border-slate-200 bg-white px-4">
          {metrics.map((metric) => (
            <ResultMetric key={metric.label} {...metric} />
          ))}
        </dl>
      </div>

      {hasResult && visual ? <div className="mt-4">{visual}</div> : null}

      {hasResult && actions ? <div className="mt-4 no-print">{actions}</div> : null}

      {hasResult && notes && notes.length > 0 ? (
        <details className="group mt-4 rounded-xl border border-slate-200 bg-white">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
            Annahmen &amp; Hinweise ({notes.length})
            <span className="ml-1 text-slate-500 group-open:hidden">– anzeigen</span>
          </summary>
          <ul className="space-y-2 px-4 pb-4 text-sm leading-6 text-slate-700">
            {notes.map((note) => (
              <li key={note} className="list-inside list-disc">
                {note}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
