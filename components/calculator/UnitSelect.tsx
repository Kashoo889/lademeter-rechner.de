import { cn } from "@/lib/utils";

type UnitOption = {
  value: string;
  label: string;
};

type UnitSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: UnitOption[];
  className?: string;
};

/** Simple accessible select field used for units and preset choices. */
export function UnitSelect({ id, label, value, onChange, options, className }: UnitSelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/20 sm:py-2.5 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
