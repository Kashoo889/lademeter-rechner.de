import { cn } from "@/lib/utils";

type Bar = { label: string; percent: number | null };

/** Horizontal utilization bars (floor area, payload, volume). Over 100 % is shown in red. */
export function UtilizationBars({ bars }: { bars: Bar[] }) {
  return (
    <ul className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4">
      {bars.map((bar) => {
        const percent = bar.percent;
        const width = percent === null ? 0 : Math.min(100, Math.max(0, percent));
        const tone =
          percent === null ? "bg-slate-200" : percent > 100 ? "bg-red-600" : percent > 85 ? "bg-amber-500" : "bg-emerald-600";
        return (
          <li key={bar.label}>
            <div className="flex justify-between text-xs text-slate-700">
              <span>{bar.label}</span>
              <span className="num font-bold">
                {percent === null ? "keine Angabe" : `${percent.toLocaleString("de-DE", { maximumFractionDigits: 1 })} %`}
              </span>
            </div>
            <div
              className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="meter"
              aria-label={bar.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent === null ? undefined : Math.round(width)}
            >
              <div className={cn("h-full rounded-full transition-[width] duration-500 ease-out", tone)} style={{ width: `${width}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
