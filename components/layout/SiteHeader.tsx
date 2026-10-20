import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";
import { SiteNav } from "@/components/layout/SiteNav";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900 text-white">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${siteConfig.name} – Startseite`}
        >
          <LogoMark className="h-9 w-9 transition-transform group-hover:-rotate-3" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[17px] font-extrabold tracking-tight">{siteConfig.name}</span>
            <span className="hidden text-[11px] text-slate-400 sm:block">{siteConfig.descriptor}</span>
          </span>
        </Link>

        <SiteNav />

        <div className="hidden md:block">
          <Button href="/" className="py-2.5">
            Lademeter berechnen
          </Button>
        </div>
      </Container>
    </header>
  );
}
