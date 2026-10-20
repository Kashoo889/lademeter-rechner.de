import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolNoticeVariant = "info" | "warning";

type ToolNoticeProps = {
  variant?: ToolNoticeVariant;
  children: React.ReactNode;
  className?: string;
};

const variantClasses: Record<ToolNoticeVariant, string> = {
  info: "border-slate-200 bg-white text-slate-700",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
};

const iconByVariant: Record<ToolNoticeVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  warning: AlertTriangle,
};

/** Small, reusable notice banner used for placeholder-result and disclaimer messages. */
export function ToolNotice({ variant = "info", children, className }: ToolNoticeProps) {
  const Icon = iconByVariant[variant];

  return (
    <div
      role={variant === "warning" ? "alert" : undefined}
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm leading-6",
        variantClasses[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
