import { siteConfig } from "@/lib/site-config";
import type { Article } from "@/lib/content/ratgeber";
import type { BreadcrumbItem } from "@/components/seo/Breadcrumbs";

/**
 * Structured data helpers. Only real, verifiable fields are populated - no
 * fake ratings, reviews, author credentials, or business identity data.
 */

const ORGANIZATION_ID = `${siteConfig.domain}/#organization`;
const WEBSITE_ID = `${siteConfig.domain}/#website`;

function absolute(path: string) {
  return new URL(path, siteConfig.domain).toString();
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: absolute("/"),
    inLanguage: "de-DE",
    description: siteConfig.description,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: absolute("/"),
    logo: {
      "@type": "ImageObject",
      url: absolute("/logo.png"),
      width: 512,
      height: 512,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const allItems: BreadcrumbItem[] = [{ label: "Start", href: "/" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absolute(item.href),
    })),
  };
}

export function buildArticleJsonLd(article: Article) {
  const url = absolute(`/ratgeber/${article.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: "de-DE",
    image: absolute("/opengraph-image"),
    author: { "@id": ORGANIZATION_ID, "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: url,
    url,
    isPartOf: { "@id": WEBSITE_ID },
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
  };
}

/** WebApplication schema for a free calculator. No ratings are added on purpose. */
export function buildCalculatorJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absolute(path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Alle (Webbrowser)",
    browserRequirements: "JavaScript erforderlich",
    inLanguage: "de-DE",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Generic page (legal/info pages). */
export function buildWebPageJsonLd({ name, path, description }: { name: string; path: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absolute(path),
    inLanguage: "de-DE",
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** FAQPage schema. Only for questions that are visible on the page (see FaqAccordion). */
export function buildFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
