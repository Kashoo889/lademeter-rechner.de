"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { mainNavigation } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

/**
 * Primary site navigation. Dropdowns use native <details>/<summary> so they
 * are keyboard- and screen-reader-accessible; they close on Escape, on a
 * click outside and after navigating. The mobile panel is closed by Escape
 * and by route changes as well.
 */
export function SiteNav() {
  // The mobile panel stores the path it was opened on, so it closes
  // automatically after any navigation without a state update in an effect.
  const pathname = usePathname();
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const mobileOpen = mobileOpenPath === pathname;
  const navRef = useRef<HTMLElement>(null);

  const setMobileOpen = (next: boolean | ((open: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(mobileOpen) : next;
    setMobileOpenPath(value ? pathname : null);
  };

  const closeDropdowns = () => {
    navRef.current?.querySelectorAll("details[open]").forEach((element) => element.removeAttribute("open"));
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpenPath(null);
        closeDropdowns();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        navRef.current.querySelectorAll("details[open]").forEach((element) => element.removeAttribute("open"));
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Hauptnavigation"
        className="hidden md:flex md:items-center md:gap-1"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) closeDropdowns();
        }}
      >
        {mainNavigation.map((item) =>
          "children" in item && item.children ? (
            <details key={item.label} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white [&::-webkit-details-marker]:hidden">
                {item.label}
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <ul className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lift">
                {item.children.map((child) => (
                  <li key={child.href + child.label}>
                    <Link
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-800"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white hover:bg-white/10"
        >
          <span className="sr-only">{mobileOpen ? "Menü schließen" : "Menü öffnen"}</span>
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile Navigation"
          className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-lg md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {mainNavigation.map((item) => (
              <li key={item.label}>
                {"children" in item && item.children ? (
                  <div>
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                    <ul className="flex flex-col gap-1">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <Button href="/" className="w-full" onClick={() => setMobileOpen(false)}>
              Lademeter berechnen
            </Button>
          </div>
        </nav>
      ) : null}
    </>
  );
}
