import Link from "next/link";
import { ArrowRight, Caravan, Layers, PackageSearch, Ruler, Scale, Truck, Weight } from "lucide-react";
import type { CalculatorDefinition } from "@/lib/site-config";

const iconBySlug: Record<string, React.ComponentType<{ className?: string }>> = {
  "lademeter-rechner": Ruler,
  "lkw-palettenrechner": Layers,
  "kartons-pro-palette-rechner": PackageSearch,
  "lkw-beladungsrechner": Truck,
  "volumengewicht-rechner": Scale,
  "anhaenger-zuladungsrechner": Caravan,
  "zuladungsrechner": Weight,
};

export function ToolCard({ tool }: { tool: CalculatorDefinition }) {
  const Icon = iconBySlug[tool.slug] ?? Ruler;

  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-ink-900">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-950">{tool.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tool.shortDescription}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-800">
        Rechner öffnen
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
