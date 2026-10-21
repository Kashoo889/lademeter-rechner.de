import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getClusterNavLinks, type ClusterId } from "@/lib/content/clusters";

/**
 * "Mehr zum Thema": descriptive links to the cluster's calculators, reference pages and sibling articles.
 * Builds topical internal links without hand-maintained lists (see lib/content/clusters.ts).
 */
export function ClusterNav({ clusterId, currentPath }: { clusterId: ClusterId; currentPath: string }) {
  const { label, links } = getClusterNavLinks(clusterId, currentPath);
  if (links.length === 0) return null;

  return (
    <nav aria-label={`Mehr zum Thema ${label}`} className="no-print mt-10 max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Mehr zum Thema {label}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex h-full items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              <span>
                <span className="block text-sm font-bold text-slate-950">{link.label}</span>
                <span className="mt-0.5 block text-sm leading-6 text-slate-600">{link.description}</span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
