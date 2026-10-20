import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseDecimal } from "@/lib/parseDecimal";

type QuantityFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  error?: string;
  className?: string;
};

/** Integer quantity input with increment/decrement buttons. */
export function QuantityField({
  id,
  label,
  value,
  onChange,
  min = 1,
  error,
  className,
}: QuantityFieldProps) {
  const numericValue = Math.floor(parseDecimal(value) ?? 0);

  function step(delta: number) {
    const next = Math.max(min, numericValue + delta);
    onChange(String(next));
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
        {label}
      </label>
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={`${label} verringern`}
          className="flex w-11 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-800"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          id={id}
          name={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="num w-full min-w-0 border border-slate-300 bg-white px-3 py-3 text-center text-base font-semibold text-slate-900 shadow-sm focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/20 sm:py-2.5 sm:text-sm"
        />
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`${label} erhöhen`}
          className="flex w-11 items-center justify-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-800"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
