import type { ArticleSource } from "@/lib/content/ratgeber";

export function ArticleSources({ sources }: { sources?: ArticleSource[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <section aria-labelledby="quellen" className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h2 id="quellen" className="text-base font-semibold text-slate-950">
        Quellen und weiterführende Informationen
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
