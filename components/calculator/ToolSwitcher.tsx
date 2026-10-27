"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Caravan, Layers, PackageSearch, Ruler, Scale, Truck, Weight } from "lucide-react";
import { calculators } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  "lademeter-rechner": Ruler,
  "lkw-palettenrechner": Layers,
  "kartons-pro-palette-rechner": PackageSearch,
  "lkw-beladungsrechner": Truck,
  "volumengewicht-rechner": Scale,
  "anhaenger-zuladungsrechner": Caravan,
  "zuladungsrechner": Weight,
};

/** Horizontal switcher between the calculators, shown above each calculator. */
export function ToolSwitcher() {
  const pathname = usePathname();
  return (
    <nav aria-label="Rechner wechseln" className="no-print">
      <ul className="flex gap-1.5 overflow-x-auto rounded-xl bg-white/90 p-1.5 shadow-card ring-1 ring-slate-200/80 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {calculators.map((tool) => {
          const Icon = icons[tool.slug] ?? Ruler;
          const active = tool.href === pathname;
          return (
            <li key={tool.slug} className="shrink-0">
              <Link
                href={tool.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  active ? "bg-ink-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-brand-400")} aria-hidden="true" />
                {tool.navLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
