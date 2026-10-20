import Link from "next/link";
import type { Article } from "@/lib/content/ratgeber";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all focus-within:shadow-lift hover:-translate-y-1 hover:shadow-lift">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-700">{article.category}</p>
      <h3 className="mt-2 text-lg font-extrabold leading-snug tracking-tight text-slate-950">
        <Link
          href={`/ratgeber/${article.slug}/`}
          className="after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{article.description}</p>
      <p className="mt-4 text-xs text-slate-500">
        <time dateTime={article.updatedAt ?? article.publishedAt}>
          {article.updatedAt ? "Aktualisiert" : "Veröffentlicht"}: {formatDate(article.updatedAt ?? article.publishedAt)}
        </time>
      </p>
    </article>
  );
}
