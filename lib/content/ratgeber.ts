import fs from "node:fs";
import path from "node:path";
import { load as parseYaml } from "js-yaml";
import { marked } from "marked";
import { calculators } from "@/lib/site-config";

const CONTENT_DIR = path.join(process.cwd(), "content", "ratgeber");

export type ArticleFaq = { question: string; answer: string };
export type ArticleSource = { title: string; url: string };

export type ArticleFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  /** Slug of a calculator in lib/site-config.ts to cross-link, if relevant. */
  relatedTool?: string;
  /** Topic cluster id (lib/content/clusters.ts) used for the "Mehr zum Thema" links. */
  cluster?: string;
  faq?: ArticleFaq[];
  sources?: ArticleSource[];
};

export type Article = ArticleFrontmatter & {
  contentHtml: string;
  wordCount: number;
};

function readArticleFile(filename: string): Article {
  const fullPath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatterMatch) throw new Error(`Ratgeber: YAML-Frontmatter fehlt in ${filename}`);

  const parsed = parseYaml(frontmatterMatch[1], { json: true });
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Ratgeber: ungültiges YAML-Frontmatter in ${filename}`);
  }
  const frontmatter = parsed as ArticleFrontmatter;
  const content = raw.slice(frontmatterMatch[0].length);
  const contentHtml = marked.parse(content, { async: false }) as string;
  const slug = frontmatter.slug ?? filename.replace(/\.md$/, "");

  if (slug !== filename.replace(/\.md$/, "")) {
    throw new Error(`Ratgeber: slug "${slug}" does not match filename ${filename}`);
  }

  return {
    ...frontmatter,
    slug,
    contentHtml,
    wordCount: content.split(/\s+/).filter(Boolean).length,
  };
}

let cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const filenames = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".md"));
  const articles = filenames.map(readArticleFile);

  cache = articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return cache;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getLatestArticles(limit = 3): Article[] {
  return getAllArticles().slice(0, limit);
}

export function getRelatedArticles(
  currentSlug: string,
  options: { relatedTool?: string; tags?: string[]; limit?: number } = {},
): Article[] {
  const { relatedTool, tags = [], limit = 3 } = options;
  const others = getAllArticles().filter((article) => article.slug !== currentSlug);

  const scored = others.map((article) => {
    let score = 0;
    if (relatedTool && article.relatedTool === relatedTool) score += 2;
    score += article.tags?.filter((tag) => tags.includes(tag)).length ?? 0;
    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.article);
}

export function getArticlesBySlugs(slugs: string[]): Article[] {
  return slugs.map((slug) => getArticleBySlug(slug)).filter((article): article is Article => Boolean(article));
}

export function getCalculatorForArticle(article: Article) {
  return calculators.find((tool) => tool.slug === article.relatedTool);
}
