import Link from "next/link";
import { operator } from "@/lib/legal/operator";
import { siteConfig } from "@/lib/site-config";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type ArticleMetaProps = {
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes?: number;
};

/**
 * Shows publish/update dates, category and reading time. The byline names the
 * responsible person from lib/legal/operator.ts (about.authorName, the same
 * person as in the Impressum) and links to the editorial notes on /ueber-uns/.
 * No credentials are invented.
 */
export function ArticleMeta({ category, publishedAt, updatedAt, readingMinutes }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
      <span className="font-semibold text-brand-800">{category}</span>
      <span aria-hidden="true">&middot;</span>
      {operator.about.authorName ? (
        <Link href="/ueber-uns/#redaktion" className="underline-offset-2 hover:underline">
          Verantwortlich: {operator.about.authorName}
        </Link>
      ) : (
        <span>Redaktion {siteConfig.name}</span>
      )}
      <span aria-hidden="true">&middot;</span>
      <span>
        Veröffentlicht: <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      </span>
      {updatedAt && updatedAt !== publishedAt ? (
        <>
          <span aria-hidden="true">&middot;</span>
          <span>
            Aktualisiert: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </span>
        </>
      ) : null}
      {readingMinutes ? (
        <>
          <span aria-hidden="true">&middot;</span>
          <span>{readingMinutes} Min. Lesezeit</span>
        </>
      ) : null}
    </div>
  );
}
