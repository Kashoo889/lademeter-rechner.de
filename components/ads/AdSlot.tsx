import { consentConfig } from "@/lib/consent/config";
import { AdUnit } from "@/components/ads/AdUnit";
import { cn } from "@/lib/utils";

export type AdPlacement = "article-intro" | "article-end" | "section-break";

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
};

/**
 * Advertising slot. Renders nothing unless AdSense is enabled AND a CMP is
 * configured AND an ad unit ID exists for this placement (see
 * lib/consent/config.ts and docs/ADSENSE-CONSENT-SETUP.md).
 *
 * Placement rules: never next to calculator inputs, the "Berechnen" button,
 * results or navigation - only between content sections. Ads are labelled
 * "Anzeige" (separation of advertising and content) and reserve their height
 * to avoid layout shift.
 */
export function AdSlot({ placement, className }: AdSlotProps) {
  const slotId = consentConfig.adSlots[placement];

  if (consentConfig.adsEnabled && consentConfig.adsenseClient && slotId) {
    return (
      <aside aria-label="Anzeige" className={cn("no-print my-2", className)}>
        <p className="mb-1 text-center text-[11px] uppercase tracking-wide text-slate-500">Anzeige</p>
        <AdUnit client={consentConfig.adsenseClient} slot={slotId} />
      </aside>
    );
  }

  if (process.env.NODE_ENV === "development") {
    return (
      <div
        aria-hidden="true"
        data-ad-placement={placement}
        className={cn(
          "flex min-h-[120px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-xs font-medium text-slate-500",
          className,
        )}
      >
        Anzeigenplatz ({placement}) – nur in der Entwicklung sichtbar
      </div>
    );
  }

  return null;
}
