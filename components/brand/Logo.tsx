import { cn } from "@/lib/utils";

/** Inline logo mark: a trailer floor with three loaded pallets (matches the favicon). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-9 w-9", className)} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#0b1324" />
      <rect x="7" y="13" width="26" height="14" rx="2.5" fill="none" stroke="#cbd5e1" strokeWidth="1.6" />
      <rect x="9.6" y="15.6" width="6.2" height="8.8" rx="1.2" fill="#f97316" />
      <rect x="16.9" y="15.6" width="6.2" height="8.8" rx="1.2" fill="#f97316" />
      <rect x="24.2" y="15.6" width="6.2" height="8.8" rx="1.2" fill="#fb923c" />
    </svg>
  );
}
