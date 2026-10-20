import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "@/components/layout/HeroVisual";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description?: React.ReactNode;
  /** Short label above the H1. */
  eyebrow?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** "tool" shows the trailer visual and leaves room for the calculator to overlap. */
  variant?: "tool" | "page";
  /** Extra content under the description (chips, meta). */
  children?: React.ReactNode;
  className?: string;
};

/** Dark navy page header shared by every page, so the site feels like one product. */
export function PageHero({
  title,
  description,
  eyebrow,
  breadcrumbs = [],
  variant = "page",
  children,
  className,
}: PageHeroProps) {
  const isTool = variant === "tool";
  return (
    <section className={cn("relative overflow-hidden bg-ink-900 text-white", className)}>
      <div className="bg-blueprint pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl"
        aria-hidden="true"
      />
      <Container className={cn("relative", isTool ? "pb-24 pt-6 sm:pt-8 lg:pb-28" : "pb-12 pt-8 sm:pb-14 sm:pt-10")}>
        {breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} tone="dark" /> : null}
        <div className={cn("mt-4 grid items-center gap-8 lg:gap-10", isTool && "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]")}>
          <div className="animate-fade-up">
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl xl:text-[2.75rem]">
              {title}
            </h1>
            {description ? (
              <div className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                {description}
              </div>
            ) : null}
            {children}
          </div>
          {isTool ? (
            <div className="hidden lg:block">
              <HeroVisual />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** Row of small trust facts (all true statements about how the site works). */
export function TrustChips({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" className="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m3 8.5 3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}
