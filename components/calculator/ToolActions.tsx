import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ToolActionsProps = {
  submitLabel?: string;
  onReset: () => void;
};

/**
 * Shared submit/reset row for calculator forms. Results update live once all
 * required fields are valid; submitting shows validation messages and moves
 * the focus to the result (important on mobile, where it sits below the form).
 */
export function ToolActions({ submitLabel = "Berechnen", onReset }: ToolActionsProps) {
  return (
    <div className="no-print mt-6 flex flex-wrap items-center gap-3">
      <Button type="submit" className="px-7 py-3.5 text-base">{submitLabel}</Button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Zurücksetzen
      </button>
    </div>
  );
}
