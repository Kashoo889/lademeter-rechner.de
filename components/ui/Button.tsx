import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost-light";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-ink-900 shadow-[0_1px_0_rgb(255_255_255/0.35)_inset,0_6px_16px_-6px_rgb(234_88_12/0.7)] hover:bg-brand-400 active:translate-y-px",
  secondary: "bg-ink-900 text-white hover:bg-ink-700 focus-visible:outline-ink-900",
  outline:
    "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
  "ghost-light": "border border-white/25 text-white hover:bg-white/10",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: () => void;
};

/**
 * Shared button component. Renders a real <button> for in-page actions, or a
 * Next.js <Link> when an `href` is provided - satisfies "no clickable divs"
 * and proper button/link semantics (spec section 21).
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  // Spread the native props first so the merged class list is never overridden.
  const { variant: _variant, className: _className, children: _children, ...buttonProps } = props as ButtonAsButton;
  void _variant;
  void _className;
  void _children;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
