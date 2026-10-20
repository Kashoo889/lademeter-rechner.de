import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/brand/Logo";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";
import { consentConfig } from "@/lib/consent/config";
import { footerNavigation, siteConfig } from "@/lib/site-config";

function FooterColumn({
  title,
  links,
  children,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="text-sm text-slate-200 transition-colors hover:text-brand-300">
              {link.label}
            </Link>
          </li>
        ))}
        {children}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink-950 text-slate-300">
      <Container className="py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <LogoMark className="h-9 w-9" />
              <p className="font-display text-lg font-extrabold tracking-tight text-white">{siteConfig.name}</p>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
              {siteConfig.descriptor}. Kostenlose Rechner für Lademeter, Paletten, Kartons, LKW-Beladung und
              Volumengewicht – direkt im Browser, ohne Anmeldung.
            </p>
          </div>
          <FooterColumn title="Rechner" links={footerNavigation.rechner} />
          <FooterColumn title="Wissen" links={footerNavigation.wissen} />
          <FooterColumn title="Info" links={footerNavigation.info} />
          <FooterColumn title="Rechtliches" links={footerNavigation.rechtliches}>
            {consentConfig.cmpProvider ? (
              <li>
                <ConsentSettingsButton
                  provider={consentConfig.cmpProvider}
                  className="text-sm text-slate-200 transition-colors hover:text-brand-300"
                />
              </li>
            ) : null}
          </FooterColumn>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-5 text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Alle Angaben ohne Gewähr. Ergebnisse
            dienen der ersten Orientierung und ersetzen keine verbindliche Ladeplanung.
          </p>
        </div>
      </Container>
    </footer>
  );
}
