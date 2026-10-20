import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { calculators } from "@/lib/site-config";

// Next.js adds `noindex` to the 404 response by itself.
export const metadata: Metadata = {
  title: "Seite nicht gefunden",
};

export default function NotFound() {
  return (
    <Container className="flex max-w-2xl flex-col items-center py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Fehler 404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Seite nicht gefunden</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Die aufgerufene Seite existiert nicht oder wurde verschoben. Nutzen Sie einen unserer Rechner
        oder kehren Sie zur Startseite zurück.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Zur Startseite</Button>
        <Button href="/ratgeber/" variant="outline">
          Zu den Ratgebern
        </Button>
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
        {calculators.map((tool) => (
          <li key={tool.slug}>
            <Link href={tool.href} className="text-brand-700 underline">
              {tool.navLabel}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
