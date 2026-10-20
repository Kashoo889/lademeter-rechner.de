import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Use on dark hero backgrounds. */
  tone?: "light" | "dark";
};

/**
 * Visual breadcrumb trail. Pair with `buildBreadcrumbJsonLd` (lib/seo/jsonLd.ts)
 * on the page to emit matching BreadcrumbList structured data.
 */
export function Breadcrumbs({ items, tone = "light" }: BreadcrumbsProps) {
  const dark = tone === "dark";
  const allItems: BreadcrumbItem[] = [{ label: "Start", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={dark ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
      <ol className="flex flex-wrap items-center gap-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight className={dark ? "h-3.5 w-3.5 shrink-0 text-slate-500" : "h-3.5 w-3.5 shrink-0 text-slate-400"} aria-hidden="true" />
              ) : null}
              {isLast ? (
                <span aria-current="page" className={dark ? "font-medium text-white" : "font-medium text-slate-700"}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={dark ? "hover:text-white hover:underline" : "hover:text-brand-700 hover:underline"}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
