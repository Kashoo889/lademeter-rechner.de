import { ToolCard } from "@/components/content/ToolCard";
import { calculators } from "@/lib/site-config";

export function RelatedTools({ excludeSlug, limit = 4 }: { excludeSlug: string; limit?: number }) {
  const relatedTools = calculators.filter((tool) => tool.slug !== excludeSlug).slice(0, limit);

  if (relatedTools.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {relatedTools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  );
}
