import type { MetadataRoute } from "next";
import { siteConfig, calculators } from "@/lib/site-config";
import { getAllArticles } from "@/lib/content/ratgeber";
import { VEHICLE_PAGES } from "@/lib/content/fahrzeuge";
import { legalNoindex } from "@/lib/legal/pages";
import { contactFormConfigured, operator } from "@/lib/legal/operator";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = siteConfig.lastUpdated;
  const url = (path: string) => new URL(path, siteConfig.domain).toString();

  const toolRoutes = [...new Set(calculators.map((tool) => tool.href))];
  const contentRoutes = ["/ratgeber/", "/fahrzeuge/", "/lademeter-tabelle/", "/methodik/", "/ueber-uns/"];
  // Pages that are set to noindex (incomplete operator data / pending legal
  // review) must not appear in the sitemap.
  const kontaktIndexable = (Boolean(operator.email) || contactFormConfigured()) && !legalNoindex("general");
  const legalRoutes = [
    ...(kontaktIndexable ? ["/kontakt/"] : []),
    ...(legalNoindex("impressum") ? [] : ["/impressum/"]),
    ...(legalNoindex("datenschutz") ? [] : ["/datenschutz/"]),
    ...(legalNoindex("general") ? [] : ["/cookies/", "/nutzungsbedingungen/", "/haftungsausschluss/"]),
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
