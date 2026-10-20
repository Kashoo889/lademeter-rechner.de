import { ArticleCard } from "@/components/content/ArticleCard";
import { getRelatedArticles, getArticlesBySlugs } from "@/lib/content/ratgeber";

export function RelatedArticles({
  currentSlug,
  relatedTool,
  tags,
  slugs,
  limit = 3,
}: {
  currentSlug: string;
  relatedTool?: string;
  tags?: string[];
  /** Explicit, hand-picked slugs. Takes precedence over scoring. */
  slugs?: string[];
  limit?: number;
}) {
  const articles = slugs?.length
    ? getArticlesBySlugs(slugs).filter((article) => article.slug !== currentSlug).slice(0, limit)
    : getRelatedArticles(currentSlug, { relatedTool, tags, limit });

  if (articles.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
