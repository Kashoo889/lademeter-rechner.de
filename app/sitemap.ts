import type { MetadataRoute } from "next";
import { siteConfig, calculators } from "@/lib/site-config";
import { getAllArticles } from "@/lib/content/ratgeber";
import { VEHICLE_PAGES } from "@/lib/content/fahrzeuge";
import { legalNoindex } from "@/lib/legal/pages";
import { operator } from "@/lib/legal/operator";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = siteConfig.lastUpdated;
  const url = (path: string) => new URL(path, siteConfig.domain).toString();

  const toolRoutes = [...new Set(calculators.map((tool) => tool.href))];
  const contentRoutes = ["/ratgeber/", "/fahrzeuge/", "/lademeter-tabelle/", "/methodik/", "/ueber-uns/"];

  // Completed legal and contact pages are indexable and submitted to the sitemap.
  // Incomplete legal pages (Impressum, Datenschutz) remain noindex and are omitted.
  const legalRoutes = [
    ...(operator.email ? ["/kontakt/"] : []),
    ...(legalNoindex("cookies") ? [] : ["/cookies/"]),
    ...(legalNoindex("nutzungsbedingungen") ? [] : ["/nutzungsbedingungen/"]),
    ...(legalNoindex("haftungsausschluss") ? [] : ["/haftungsausschluss/"]),
    ...(legalNoindex("impressum") ? [] : ["/impressum/"]),
    ...(legalNoindex("datenschutz") ? [] : ["/datenschutz/"]),
  ];

  return [
    ...toolRoutes.map((route) => ({ url: url(route), lastModified })),
    ...contentRoutes.map((route) => ({ url: url(route), lastModified })),
    ...VEHICLE_PAGES.map((page) => ({ url: url(`/fahrzeuge/${page.slug}/`), lastModified })),
    ...getAllArticles().map((article) => ({
      url: url(`/ratgeber/${article.slug}/`),
      lastModified: article.updatedAt ?? article.publishedAt,
    })),
    ...legalRoutes.map((route) => ({ url: url(route), lastModified })),
  ];
}
