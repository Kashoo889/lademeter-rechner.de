import Link from "next/link";
import { getArticleBySlug } from "@/lib/content/ratgeber";

type Group = { title: string; slugs: string[] };

/**
 * Curated, topic-grouped links from the homepage to the strongest guides. Titles come from the article
 * frontmatter, so the link text always matches the page title. Slugs that no longer exist are skipped.
 */
const GROUPS: Group[] = [
  {
    title: "Lademeter verstehen und rechnen",
    slugs: ["was-sind-lademeter", "lademeter-berechnen-nicht-stapelbar", "stapelfaktor-lademeter"],
  },
  {
    title: "Paletten, Maße und Gewicht",
    slugs: ["europalette-masse", "halbpalette-masse", "palette-gewicht-berechnen"],
  },
  {
    title: "Gewichte, Maße und Vorschriften",
    slugs: ["zulaessiges-gesamtgewicht-lkw", "lkw-hoechstmasse-deutschland", "frachtbrief-hgb"],
  },
];

export function TopicGuides() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {GROUPS.map((group) => {
        const articles = group.slugs.map((slug) => getArticleBySlug(slug)).filter((a) => a !== undefined);
        if (articles.length === 0) return null;
        return (
          <div key={group.title}>
            <h3 className="text-base font-extrabold tracking-tight text-slate-950">{group.title}</h3>
            <ul className="mt-3 space-y-2">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/ratgeber/${article.slug}/`} className="text-sm font-semibold text-brand-700 underline">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
