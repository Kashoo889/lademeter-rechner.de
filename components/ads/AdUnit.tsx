"use client";

import { useEffect, useRef } from "react";

/** One responsive AdSense unit. The library itself is loaded by components/consent/GoogleServices.tsx. */
export function AdUnit({ client, slot }: { client: string; slot: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or a missing library must never break the page.
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block min-h-[100px] w-full sm:min-h-[250px]"
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
