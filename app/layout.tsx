import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConsentScripts } from "@/components/consent/ConsentScripts";
import { GoogleServices } from "@/components/consent/GoogleServices";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/jsonLd";
import { consentConfig } from "@/lib/consent/config";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// next/font self-hosts the font files at build time - no request to Google
// Fonts is made by visitors' browsers (relevant for the privacy policy).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.name} – ${siteConfig.descriptor}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  // AdSense site verification. Only rendered when a valid publisher ID is
  // configured; it does not load any script or set cookies.
  ...(consentConfig.adsenseClient
    ? { other: { "google-adsense-account": consentConfig.adsenseClient } }
    : {}),
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-slate-900">
        <ConsentScripts />
        <GoogleServices
          gaId={consentConfig.gaId}
          adsenseClient={consentConfig.adsenseClient}
          adsEnabled={consentConfig.adsEnabled}
          cmpProvider={consentConfig.cmpProvider}
        />
        <JsonLd data={buildWebsiteJsonLd()} />
        <JsonLd data={buildOrganizationJsonLd()} />
        <SkipLink />
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
