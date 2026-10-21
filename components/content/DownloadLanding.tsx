import Link from "next/link";
import { Download, FileSpreadsheet, FileText, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero, TrustChips } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/content/ContentSection";
import { FaqAccordion, type FaqItem } from "@/components/content/FaqAccordion";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { ToolNotice } from "@/components/calculator/ToolNotice";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/jsonLd";
import {
  DOWNLOAD_LICENSE,
  DOWNLOAD_UPDATED,
  DOWNLOAD_VERSION,
  downloadHref,
  formatFileSize,
  type DownloadAsset,
} from "@/lib/downloads";

type Feature = { title: string; text: string };

type DownloadLandingProps = {
  asset: DownloadAsset;
  h1: string;
  description: string;
  intro: string;
  features: Feature[];
  featuresTitle: string;
  howTitle: string;
  how: React.ReactNode;
  checkedTitle: string;
  checked: React.ReactNode;
  limits: React.ReactNode;
  faqs: FaqItem[];
  articleSlugs: string[];
  /** Short breadcrumb label. */
  crumb: string;
  metaDescription: string;
};

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" });

/**
 * Shared landing page for a downloadable asset: hero, sticky download card, feature list, how-to,
 * verification note, limits, FAQ and related articles. Download links are plain anchors with the `download`
 * attribute so they work without JavaScript.
 */
export function DownloadLanding({
  asset,
  h1,
  description,
  intro,
  features,
  featuresTitle,
  howTitle,
  how,
  checkedTitle,
  checked,
  limits,
  faqs,
  articleSlugs,
  crumb,
  metaDescription,
}: DownloadLandingProps) {
  const breadcrumbs = [{ label: crumb, href: asset.path }];
  const [primary, ...others] = asset.files;
  const PrimaryIcon = primary.format === "xlsx" ? FileSpreadsheet : FileText;

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildWebPageJsonLd({ name: asset.title, path: asset.path, description: metaDescription })} />
      <PageHero title={h1} eyebrow="Kostenloser Download" breadcrumbs={breadcrumbs} description={description}>
        <TrustChips items={["Kostenlos & ohne Anmeldung", `Lizenz ${DOWNLOAD_LICENSE.name}`, "Rechenweg offen dokumentiert"]} />
      </PageHero>

      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <aside className="order-1 lg:order-2" aria-label="Download">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lift lg:sticky lg:top-24">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-brand-400">
                  <PrimaryIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-lg font-extrabold leading-tight tracking-tight text-slate-950">
                    {primary.format === "xlsx" ? "Excel-Vorlage" : "Aufgabenblatt"}
                  </p>
                  <p className="text-sm text-slate-600">{primary.note}</p>
                </div>
              </div>

              <a
                href={downloadHref(primary.filename)}
                download
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 text-base font-bold text-ink-900 shadow-[0_6px_16px_-6px_rgb(234_88_12/0.7)] transition-all hover:bg-brand-400"
              >
                <Download className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="text-center">{primary.label}</span>
              </a>

              {others.map((file) => (
                <a
                  key={file.filename}
                  href={downloadHref(file.filename)}
                  download
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="text-center">
                    {file.label}{" "}
                    <span className="whitespace-nowrap font-normal text-slate-500">({formatFileSize(file.filename)})</span>
                  </span>
                </a>
              ))}

              <dl className="mt-5 divide-y divide-slate-100 text-sm">
                {[
                  ["Format", primary.format === "xlsx" ? "Excel (.xlsx)" : "PDF (A4)"],
                  ["Größe", formatFileSize(primary.filename)],
                  ["Version", `${DOWNLOAD_VERSION} · Stand ${dateFormat.format(new Date(DOWNLOAD_UPDATED))}`],
                  ["Lizenz", DOWNLOAD_LICENSE.name],
                ].map(([term, value]) => (
                  <div key={term} className="flex justify-between gap-4 py-2">
                    <dt className="text-slate-500">{term}</dt>
                    <dd className="text-right font-semibold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <ShieldCheck className="mr-1 inline h-4 w-4 text-brand-700" aria-hidden="true" />
                Nutzung, Weitergabe und Anpassung sind mit Quellenangabe „{DOWNLOAD_LICENSE.attribution}“ erlaubt (
                <a
                  href={DOWNLOAD_LICENSE.url}
                  className="font-semibold text-brand-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {DOWNLOAD_LICENSE.name}
                </a>
                ). Alle Angaben ohne Gewähr.
              </p>
            </div>
          </aside>

          <div className="order-2 min-w-0 lg:order-1">
            <p className="text-base leading-8 text-slate-700">{intro}</p>

            <ContentSection title={featuresTitle}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <li key={feature.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-sm font-bold text-slate-950">{feature.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{feature.text}</p>
                  </li>
                ))}
              </ul>
            </ContentSection>

            <ContentSection title={howTitle}>{how}</ContentSection>
            <ContentSection title={checkedTitle}>{checked}</ContentSection>
            <ContentSection title="Wichtige Grenzen">
              <ToolNotice variant="warning">{limits}</ToolNotice>
            </ContentSection>
          </div>
        </div>

        <ContentSection title="Häufige Fragen">
          <FaqAccordion items={faqs} />
        </ContentSection>

        <ContentSection title="Passende Ratgeber und Rechner" bare>
          <RelatedArticles currentSlug="" slugs={articleSlugs} />
          <p className="text-sm text-slate-600">
            Mehr dazu: <Link href="/" className="font-semibold text-brand-700 underline">Lademeter-Rechner</Link>,{" "}
            <Link href="/lademeter-tabelle/" className="font-semibold text-brand-700 underline">Lademeter-Tabelle</Link> und{" "}
            <Link href="/methodik/" className="font-semibold text-brand-700 underline">Berechnungsgrundlagen</Link>.
          </p>
        </ContentSection>
      </Container>
    </>
  );
}
