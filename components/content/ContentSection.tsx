import { cn } from "@/lib/utils";

type ContentSectionProps = {
  title: string;
  children: React.ReactNode;
  id?: string;
  /** Render without the surrounding card (e.g. for card grids). */
  bare?: boolean;
};

/** Consistent heading + body wrapper for the recurring tool-page prose sections. */
export function ContentSection({ title, children, id, bare }: ContentSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24",
        bare ? "py-6" : "mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8",
      )}
    >
      <h2 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">{children}</div>
    </section>
  );
}
