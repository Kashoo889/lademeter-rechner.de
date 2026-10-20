"use client";

import { useState } from "react";
import { Check, Link2, Printer, ClipboardCopy } from "lucide-react";
import { buildShareUrl } from "@/lib/shareState";

type ResultActionsProps = {
  /** Current form state - encoded into the share link. */
  shareState: unknown;
  /** Plain-text summary of the result for the clipboard. */
  summary: string;
};

/** Share link, copy summary and print/PDF actions for a calculator result. */
export function ResultActions({ shareState, summary }: ResultActionsProps) {
  const [copied, setCopied] = useState<"link" | "text" | null>(null);

  async function copy(kind: "link" | "text") {
    const text = kind === "link" ? buildShareUrl(shareState) : `${summary}\n\n${buildShareUrl(shareState)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      // Clipboard can be blocked (permissions, insecure context) - fall back to selecting nothing.
      setCopied(null);
    }
  }

  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] font-semibold text-slate-800 shadow-sm transition-colors hover:border-brand-400 hover:bg-brand-50";

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={buttonClass} onClick={() => copy("link")}>
        {copied === "link" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
        {copied === "link" ? "Link kopiert" : "Link kopieren"}
      </button>
      <button type="button" className={buttonClass} onClick={() => copy("text")}>
        {copied === "text" ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
        )}
        {copied === "text" ? "Ergebnis kopiert" : "Ergebnis kopieren"}
      </button>
      <button type="button" className={buttonClass} onClick={() => window.print()}>
        <Printer className="h-4 w-4" aria-hidden="true" />
        Drucken / PDF
      </button>
      <span className="sr-only" aria-live="polite">
        {copied === "link" ? "Link in die Zwischenablage kopiert." : copied === "text" ? "Ergebnis in die Zwischenablage kopiert." : ""}
      </span>
    </div>
  );
}
