import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ArticleCard } from "@/components/content/ArticleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAllArticles } from "@/lib/content/ratgeber";
import { PageHero } from "@/components/layout/PageHero";

const breadcrumbItems = [{ label: "Ratgeber", href: "/ratgeber/" }];

export const metadata: Metadata = buildPageMetadata({
  title: "Ratgeber: Lademeter, Paletten und LKW-Beladung",
  description:
    "Praxisnahe Ratgeber zu Lademeter, Paletten, Stapelfaktor, Volumengewicht, Achslast und Ladungssicherung – mit Rechenbeispielen und Quellen.",
  path: "/ratgeber/",
});

export default function RatgeberPage() {
  const articles = getAllArticles();
  const categories = [...new Set(articles.map((article) => article.category))].sort((a, b) =>
    a.localeCompare(b, "de"),
  );

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title="Ratgeber für Ladeplanung und Transport"
        breadcrumbs={breadcrumbItems}
        description={
          <>
            Verständliche Grundlagen mit Rechenbeispielen: von der Lademeter-Formel über Palettenarten und
        Stapelfaktor bis zu Achslast und Ladungssicherung. Jeder Beitrag verweist auf den passenden
        Rechner.
          </>
        }
      />
      <Container className="py-10">

      {categories.map((category) => (
        <section key={category} className="mt-10" aria-labelledby={`kategorie-${category}`}>
          <h2 id={`kategorie-${category}`} className="text-xl font-semibold text-slate-950">
            {category}
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles
              .filter((article) => article.category === category)
              .map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
          </div>
        </section>
      ))}
    </Container>
    </>
  );
}
