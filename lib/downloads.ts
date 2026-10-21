import fs from "node:fs";
import path from "node:path";

/**
 * Download assets (Excel-Vorlage, Aufgabenblatt) and their landing pages.
 *
 * The landing pages exist but stay HIDDEN while DOWNLOADS_LIVE is false: they are `noindex`, missing from
 * the sitemap and not linked from anywhere. Set it to true only after the operator has approved the files,
 * the licence (CC BY 4.0 proposed) and completed the manual Excel check in seo/assets/README.md.
 *
 * The files live in /public/downloads (copied from seo/assets by seo/tools/sync_downloads.mjs; a test checks
 * that both copies are identical).
 */
export const DOWNLOADS_LIVE = false;

export const DOWNLOAD_VERSION = "1.0";
/** ISO date of the last substantive change to the assets. */
export const DOWNLOAD_UPDATED = "2026-10-20";
export const DOWNLOAD_LICENSE = {
  name: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/deed.de",
  attribution: "lademeter-rechner.de",
} as const;

export type DownloadFile = {
  filename: string;
  label: string;
  format: "xlsx" | "pdf";
  note?: string;
};

export type DownloadAsset = {
  slug: string;
  /** Canonical landing page path with trailing slash. */
  path: string;
  title: string;
  files: DownloadFile[];
};

export const excelAsset: DownloadAsset = {
  slug: "lademeter-excel-vorlage",
  path: "/lademeter-excel-vorlage/",
  title: "Lademeter berechnen mit Excel: kostenlose Vorlage",
  files: [
    {
      filename: "Lademeter-Berechnung-Excel-Vorlage.xlsx",
      label: "Excel-Vorlage herunterladen",
      format: "xlsx",
      note: "ohne Makros, 25 Positionen",
    },
  ],
};

export const worksheetAsset: DownloadAsset = {
  slug: "lademeter-aufgaben",
  path: "/lademeter-aufgaben/",
  title: "Lademeter berechnen: Aufgaben mit Lösungen (PDF)",
  files: [
    {
      filename: "Aufgabenblatt-Lademeter-berechnen.pdf",
      label: "Aufgabenblatt mit Lösungen herunterladen",
      format: "pdf",
      note: "12 Aufgaben, Lösungen, Hinweise für Lehrkräfte",
    },
    {
      filename: "Aufgabenblatt-Lademeter-berechnen-ohne-Loesungen.pdf",
      label: "Schülerfassung ohne Lösungen",
      format: "pdf",
      note: "nur die Aufgaben",
    },
  ],
};

export const downloadPages: DownloadAsset[] = [excelAsset, worksheetAsset];

export function downloadHref(filename: string): string {
  return `/downloads/${filename}`;
}

/** Absolute path of a file inside /public/downloads. */
export function downloadFilePath(filename: string): string {
  return path.join(process.cwd(), "public", "downloads", filename);
}

/** Human-readable file size read from disk at build time, e.g. "25 KB" or "1,2 MB". */
export function formatFileSize(filename: string): string {
  try {
    const bytes = fs.statSync(downloadFilePath(filename)).size;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
    return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("de-DE")} KB`;
  } catch {
    return "";
  }
}
