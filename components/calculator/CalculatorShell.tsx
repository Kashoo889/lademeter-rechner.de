type CalculatorShellProps = {
  form: React.ReactNode;
  result: React.ReactNode;
};

/**
 * Card layout used by every calculator page: form on the left, result panel
 * on the right (stacked on mobile). The result column is sticky on large
 * screens so it stays visible while long forms are filled in.
 */
export function CalculatorShell({ form, result }: CalculatorShellProps) {
  return (
    <div className="calculator-shell grid overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-slate-200/80 lg:grid-cols-[minmax(0,1fr)_390px]">
      <div className="min-w-0 p-5 sm:p-8">{form}</div>
      <div className="min-w-0 border-t border-slate-200 bg-slate-50 p-5 sm:p-8 lg:border-l lg:border-t-0">
        <div className="lg:sticky lg:top-24">{result}</div>
      </div>
    </div>
  );
}
