import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import type { MissingItem } from "@/lib/legal/operator";

type LegalPageProps = {
  title: string;
  path: string;
  breadcrumbLabel?: string;
  /** "Stand" date shown under the heading (YYYY-MM-DD). */
  updatedAt: string;
  /** Missing mandatory operator details for this page. */
  missing?: MissingItem[];
  /** False until the operator has recorded a legal review. */
  reviewed: boolean;
  intro?: React.ReactNode;
  children: React.ReactNode;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * Shared layout for legal pages. While mandatory details are missing or the
 * legal review is pending, a clearly visible notice explains this (the pages
 * are also set to noindex by their metadata).
 */
export function LegalPage({
  title,
  path,
  breadcrumbLabel,
  updatedAt,
  missing = [],
  reviewed,
  intro,
  children,
}: LegalPageProps) {
  const breadcrumbItems = [{ label: breadcrumbLabel ?? title, href: path }];
  const incomplete = missing.length > 0 || !reviewed;

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <PageHero
        title={title}
        breadcrumbs={breadcrumbItems}
        description={<span className="text-sm text-slate-400">Stand: {formatDate(updatedAt)}</span>}
      />
      <Container className="max-w-3xl py-10">
      {incomplete ? (
        <div role="note" className="mt-6 rounded-lg border-2 border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            Diese Seite ist noch nicht vollständig.
          </p>
          {missing.length > 0 ? (
            <>
              <p className="mt-2">Folgende Pflichtangaben des Betreibers fehlen noch:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                {missing.map((item) => (
                  <li key={item.field}>{item.label}</li>
                ))}
              </ul>
            </>
          ) : null}
          {!reviewed ? (
            <p className="mt-2">Die rechtliche Prüfung dieses Textes steht noch aus.</p>
          ) : null}
        </div>
      ) : null}

      {intro ? <div className="mt-6 text-base leading-7 text-slate-700">{intro}</div> : null}

      <div className="legal-content mt-8 space-y-8 rounded-2xl border border-slate-200/80 bg-white p-6 text-[15px] leading-7 text-slate-700 shadow-card sm:p-8">
          {children}
        </div>
      </Container>
    </>
  );
}

/** Inline marker for a mandatory value that has not been supplied yet. */
export function Missing({ label }: { label: string }) {
  return (
    <mark className="rounded bg-amber-100 px-1 font-medium text-amber-950">[Angabe fehlt: {label}]</mark>
  );
}

export function LegalSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline underline-offset-2">
      {children}
    </a>
  );
}
