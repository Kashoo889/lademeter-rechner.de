import { Plus } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqJsonLd } from "@/lib/seo/jsonLd";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-2.5">
      {items.length > 0 ? <JsonLd data={buildFaqJsonLd(items)} /> : null}
      {items.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-xl border border-slate-200 bg-white transition-colors open:border-brand-300 open:bg-brand-50/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-bold text-slate-950 [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all group-open:rotate-45 group-open:bg-brand-500 group-open:text-ink-900">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </span>
          </summary>
          <p className="px-5 pb-5 text-[15px] leading-7 text-slate-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
