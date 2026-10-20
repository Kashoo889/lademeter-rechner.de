import { ArrowUp } from "lucide-react";
import type { BreadcrumbItem } from "@/components/seo/Breadcrumbs";
import { PageHero, TrustChips } from "@/components/layout/PageHero";
import { ToolSwitcher } from "@/components/calculator/ToolSwitcher";
import { ContentSection } from "@/components/content/ContentSection";
import { DefinitionList, type Definition } from "@/components/content/DefinitionList";
import { FaqAccordion, type FaqItem } from "@/components/content/FaqAccordion";
import { RelatedTools } from "@/components/content/RelatedTools";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { ToolNotice } from "@/components/calculator/ToolNotice";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { Container } from "@/components/ui/Container";
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd } from "@/lib/seo/jsonLd";

export type ToolPageProps = {
  /** Canonical path, e.g. "/lkw-palettenrechner/". */
  path: string;
  /** Slug in lib/site-config.ts (excluded from "Weitere Rechner"). */
  slug: string;
  /** Breadcrumb trail below "Start"; empty on the homepage. */
  breadcrumbs: BreadcrumbItem[];
  h1: string;
  intro: string;
  schemaName: string;
  schemaDescription: string;
  calculator: React.ReactNode;
  /** Short explanation of how the result is computed. */
  howItWorks: React.ReactNode;
  steps: string[];
  /** Worked example (rendered prose). */
  example: React.ReactNode;
  /** Optional unique reference block (tables etc.). */
  reference?: React.ReactNode;
  definitions: Definition[];
  mistakes: string[];
  faqs: FaqItem[];
  /** Ratgeber slugs to show (hand-picked). */
  articleSlugs: string[];
  disclaimer?: string;
};

const tocLinks = [
  { id: "berechnung", label: "Berechnung" },
  { id: "beispiel", label: "Rechenbeispiel" },
  { id: "begriffe", label: "Begriffe" },
  { id: "fehler", label: "Häufige Fehler" },
  { id: "weitere-rechner", label: "Weitere Rechner" },
  { id: "ratgeber", label: "Ratgeber" },
  { id: "faq", label: "FAQ" },
];

/**
 * Shared page template for all calculators: H1 + calculator first (above the
 * fold), then explanation, example, reference data, definitions, mistakes,
 * links, FAQ and the calculation disclaimer. Ads (when enabled) are only placed
 * between content sections, never next to the form or results.
 */
export function ToolPage({
  path,
  slug,
  breadcrumbs,
  h1,
  intro,
  schemaName,
  schemaDescription,
  calculator,
  howItWorks,
  steps,
  example,
  reference,
  definitions,
  mistakes,
  faqs,
  articleSlugs,
  disclaimer = "Alle Angaben dienen der ersten Orientierung und ersetzen keine verbindliche Ladeplanung inklusive Ladungssicherung, Achslastprüfung und rechtlicher Vorgaben.",
}: ToolPageProps) {
  return (
    <>
      {breadcrumbs.length > 0 ? <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} /> : null}
      <JsonLd data={buildCalculatorJsonLd({ name: schemaName, description: schemaDescription, path })} />

      <PageHero
        variant="tool"
        eyebrow="Kostenloser Online-Rechner"
        title={h1}
        description={intro}
        breadcrumbs={breadcrumbs}
      >
        <TrustChips
          items={["Kostenlos & ohne Anmeldung", "Berechnung im Browser", "Mit Formel, Beispiel & Quellen"]}
        />
      </PageHero>

      <Container className="relative z-10 -mt-20 lg:-mt-24">
        <div id="rechner" className="scroll-mt-24 space-y-3">
          <ToolSwitcher />
          {calculator}
        </div>
      </Container>

      <Container className="mt-12 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="no-print hidden lg:block" aria-label="Seitenübersicht">
          <nav className="sticky top-24 text-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Auf dieser Seite</p>
            <ul className="mt-3 space-y-1 border-l border-slate-200">
              {tocLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-slate-600 transition-colors hover:border-brand-500 hover:text-slate-950"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#rechner"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Zum Rechner
            </a>
          </nav>
        </aside>

        <div className="min-w-0">
          <ContentSection title="So funktioniert die Berechnung" id="berechnung">
            {howItWorks}
            <ol className="list-decimal space-y-2 pl-5 marker:font-bold marker:text-brand-600">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </ContentSection>

          <ContentSection title="Rechenbeispiel" id="beispiel">
            {example}
          </ContentSection>

          {reference}

          <AdSlot placement="section-break" />

          <ContentSection title="Wichtige Begriffe" id="begriffe">
            <DefinitionList items={definitions} />
          </ContentSection>

          <ContentSection title="Häufige Fehler" id="fehler">
            <ul className="space-y-2.5">
              {mistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection title="Weitere Rechner" id="weitere-rechner" bare>
            <RelatedTools excludeSlug={slug} />
          </ContentSection>

          <ContentSection title="Passende Ratgeber-Artikel" id="ratgeber" bare>
            <RelatedArticles currentSlug="" slugs={articleSlugs} />
          </ContentSection>

          <ContentSection title="Häufig gestellte Fragen" id="faq">
            <FaqAccordion items={faqs} />
          </ContentSection>

          <ContentSection title="Hinweis zur Berechnung" id="hinweis">
            <ToolNotice variant="warning">{disclaimer}</ToolNotice>
            <p className="text-sm text-slate-600">
              Annahmen, Standardmaße und Formeln aller Rechner sind auf der Seite{" "}
              <a href="/methodik/" className="font-semibold text-brand-700 underline underline-offset-2">
                Berechnungsgrundlagen
              </a>{" "}
              dokumentiert.
            </p>
          </ContentSection>
        </div>
      </Container>
    </>
  );
}
