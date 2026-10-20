import type { TocEntry } from "@/lib/content/toc";

export function TableOfContents({ items }: { items: TocEntry[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Inhaltsverzeichnis" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Inhaltsverzeichnis</p>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-slate-700 hover:text-brand-700 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
