import { cn } from "@/lib/utils";

type ReferenceTableProps = {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
  className?: string;
};

/** Accessible, horizontally scrollable data table for reference content. */
export function ReferenceTable({ caption, columns, rows, className }: ReferenceTableProps) {
  return (
    <div
      className={cn("overflow-x-auto rounded-xl border border-slate-200", className)}
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-900">
          {caption}
        </caption>
        <thead>
          <tr className="bg-ink-900 text-white">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100 transition-colors even:bg-slate-50/60 last:border-b-0 hover:bg-brand-50/60">
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row" className="px-4 py-2.5 font-semibold text-slate-900">
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex} className="num px-4 py-2.5 text-slate-700">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
