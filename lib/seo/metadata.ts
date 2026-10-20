import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

/** Approximate number of characters Google shows in a result title. */
const SERP_TITLE_LIMIT = 60;

type PageMetadataInput = {
  /** Page title without the site-name suffix (the root layout template adds it). */
  title: string;
  description: string;
  /** Canonical path with trailing slash, e.g. "/lkw-palettenrechner/". */
  path: string;
  /** Use the title as-is without the "| Lademeter Rechner" template. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

/**
 * Builds per-page metadata: canonical, Open Graph and Twitter values that
 * match the page (instead of inheriting the homepage values), plus optional
 * noindex. The OG image comes from the opengraph-image file convention.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex,
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteConfig.domain).toString();
  // Google truncates titles at roughly 60 characters. When the brand suffix from
  // the root layout template would push the title past that, show the title alone.
  const withSuffix = `${title} | ${siteConfig.name}`;
  const useAbsolute = absoluteTitle || withSuffix.length > SERP_TITLE_LIMIT;
  const socialTitle = useAbsolute ? title : withSuffix;

  return {
    title: useAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "de_DE",
      siteName: siteConfig.name,
      url,
      title: socialTitle,
      description,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
