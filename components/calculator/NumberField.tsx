import { cn } from "@/lib/utils";

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unitLabel?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

/**
 * Numeric input with label, optional unit suffix, help text and inline
 * validation error. Uses a text input with `inputMode="decimal"` instead of
 * `type="number"` so German decimal commas ("1,2") work in every browser;
 * values are parsed with lib/parseDecimal.ts.
 */
export function NumberField({
  id,
  label,
  value,
  onChange,
  unitLabel,
  helpText,
  error,
  required,
  placeholder,
  className,
}: NumberFieldProps) {
  const describedBy = [error ? `${id}-error` : null, helpText ? `${id}-help` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
        {label}
        {required ? <span aria-hidden="true" className="text-brand-700"> *</span> : null}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(
            "num w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base font-medium text-slate-900 shadow-sm transition-shadow placeholder:font-normal placeholder:text-slate-400 hover:border-slate-400 sm:py-2.5 sm:text-sm",
            "focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/20",
            unitLabel && "pr-16",
            error && "border-red-500 focus:border-red-600 focus:ring-red-600/20",
          )}
        />
        {unitLabel ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-500">
            {unitLabel}
          </span>
        ) : null}
      </div>
      {helpText && !error ? (
        <p id={`${id}-help`} className="text-xs leading-5 text-slate-500">
          {helpText}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
