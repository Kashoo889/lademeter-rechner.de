export type Definition = {
  term: string;
  detail: string;
};

export function DefinitionList({ items }: { items: Definition[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.term} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <dt className="text-sm font-bold text-slate-950">{item.term}</dt>
          <dd className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
