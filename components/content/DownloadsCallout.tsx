import Link from "next/link";
import { FileSpreadsheet, FileText } from "lucide-react";
import { DOWNLOADS_LIVE, excelAsset, worksheetAsset } from "@/lib/downloads";

/**
 * Teaser for the free Excel template and worksheet. Renders nothing until DOWNLOADS_LIVE is switched on in
 * lib/downloads.ts, so existing pages stay unchanged while the assets await approval.
 */
export function DownloadsCallout() {
  if (!DOWNLOADS_LIVE) return null;

  const items = [
    { href: excelAsset.path, Icon: FileSpreadsheet, title: "Excel-Vorlage Lademeter", text: "Kostenlos, ohne Makros, mit Beispiel und Prüfhinweisen." },
    { href: worksheetAsset.path, Icon: FileText, title: "Aufgabenblatt mit Lösungen", text: "12 Aufgaben für Ausbildung und Unterricht (PDF)." },
  ];

  return (
    <div className="no-print rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-bold text-slate-950">Kostenlose Downloads</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map(({ href, Icon, title, text }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-brand-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-950">{title}</span>
                <span className="mt-0.5 block text-sm leading-6 text-slate-600">{text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
