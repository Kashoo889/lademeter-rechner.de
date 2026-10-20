import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleMeta } from "@/components/content/ArticleMeta";
import { ArticleSources } from "@/components/content/ArticleSources";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqAccordion } from "@/components/content/FaqAccordion";
import { TableOfContents } from "@/components/content/TableOfContents";
import { ContentSection } from "@/components/content/ContentSection";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { getAllArticles, getArticleBySlug, getCalculatorForArticle } from "@/lib/content/ratgeber";
import { addHeadingIdsAndExtractToc } from "@/lib/content/toc";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(props: PageProps<"/ratgeber/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel nicht gefunden", robots: { index: false } };
  }

  return buildPageMetadata({
    title: article.title,
    description: article.description,
    path: `/ratgeber/${article.slug}/`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
  });
}

export default async function RatgeberArticlePage(props: PageProps<"/ratgeber/[slug]">) {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { html, toc } = addHeadingIdsAndExtractToc(article.contentHtml);
  const relatedTool = getCalculatorForArticle(article);
  const breadcrumbItems = [
    { label: "Ratgeber", href: "/ratgeber/" },
    { label: article.title, href: `/ratgeber/${article.slug}/` },
  ];
  const readingMinutes = Math.max(1, Math.round(article.wordCount / 200));

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={buildArticleJsonLd(article)} />
      <PageHero title={article.title} description={article.description} breadcrumbs={breadcrumbItems} eyebrow={article.category}>
        <div className="mt-5 text-slate-300 [&_span]:!text-slate-300 [&_span.font-semibold]:!text-brand-300">
          <ArticleMeta
            category={article.category}
            publishedAt={article.publishedAt}
            updatedAt={article.updatedAt}
            readingMinutes={readingMinutes}
          />
        </div>
      </PageHero>
      <Container className="py-10">
      {relatedTool ? (
        <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-slate-800 lg:hidden">
          Passender Rechner:
          <Link href={relatedTool.href} className="font-semibold text-brand-800 underline">
            {relatedTool.navLabel}
          </Link>
        </p>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <article className="prose-content max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-10 [&>div>:first-child]:mt-0">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>

          {article.faq?.length ? (
            <section aria-labelledby="haeufige-fragen" className="mt-10 max-w-3xl">
              <h2 id="haeufige-fragen" className="text-2xl font-extrabold tracking-tight text-slate-950">
                Häufige Fragen
              </h2>
              <div className="mt-4">
                <FaqAccordion items={article.faq} />
              </div>
            </section>
          ) : null}

          <div className="max-w-3xl">
            <ArticleSources sources={article.sources} />
          </div>

          <div className="max-w-3xl">
            <AdSlot placement="article-end" />
          </div>

        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Zusatzinformationen">
          <TableOfContents items={toc} />
          {relatedTool ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="text-sm font-bold text-slate-900">Passender Rechner</p>
              <p className="mt-1 text-sm text-slate-600">{relatedTool.shortDescription}</p>
              <Button href={relatedTool.href} className="mt-4 w-full">
                {relatedTool.navLabel} öffnen
              </Button>
            </div>
          ) : null}
        </aside>
      </div>

      <ContentSection title="Weitere Ratgeber-Artikel">
        <RelatedArticles currentSlug={article.slug} relatedTool={article.relatedTool} tags={article.tags} />
      </ContentSection>
      </Container>
    </>
  );
}
