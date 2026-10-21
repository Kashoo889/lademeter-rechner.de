import Link from "next/link";
import { VEHICLE_PAGES } from "@/lib/content/fahrzeuge";

/**
 * Descriptive links from calculator pages to the vehicle reference pages (Ladefläche, Lademeter, Paletten).
 * Gives the vehicle pages contextual internal links with keyword-relevant anchor text.
 */
export function VehicleLinks() {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {VEHICLE_PAGES.map((page) => (
        <li key={page.slug}>
          <Link
            href={`/fahrzeuge/${page.slug}/`}
            className="block rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-brand-400 hover:bg-brand-50"
          >
            {page.h1}
          </Link>
        </li>
      ))}
    </ul>
  );
}
