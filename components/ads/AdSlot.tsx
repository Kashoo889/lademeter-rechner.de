import { adSlots, adsActive, adsenseClient, type AdPlacement } from "@/lib/ads/config";
import { AdUnit } from "@/components/ads/AdUnit";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
};

/**
 * Advertising slot. Renders nothing unless ads are enabled AND an ad unit ID
 * exists for this placement (see lib/ads/config.ts).
 *
 * Placement rules (also an AdSense policy requirement): never next to
 * calculator inputs, the "Berechnen" button, results or navigation - only
 * between content sections. Ads are labelled "Anzeige" and reserve their
 * height to avoid layout shift.
 */
export function AdSlot({ placement, className }: AdSlotProps) {
  const slotId = adSlots[placement];
  if (!adsActive || !adsenseClient || !slotId) return null;

  return (
    <aside aria-label="Anzeige" className={cn("no-print my-6", className)}>
      <p className="mb-1 text-center text-[11px] uppercase tracking-wide text-slate-500">Anzeige</p>
      <AdUnit client={adsenseClient} slot={slotId} />
    </aside>
  );
}
