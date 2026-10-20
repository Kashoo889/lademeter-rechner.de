import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { getAllArticles } from "@/lib/content/ratgeber";
import { VEHICLE_PAGES } from "@/lib/content/fahrzeuge";

describe("Inhalte (Integrität)", () => {
  it("jeder Artikel hat updatedAt, description (120–170 Zeichen) und mindestens eine FAQ", () => {
    const problems: string[] = [];
    for (const article of getAllArticles()) {
      if (!article.updatedAt) problems.push(`${article.slug}: updatedAt fehlt`);
      if (article.description.length < 120 || article.description.length > 170)
        problems.push(`${article.slug}: description hat ${article.description.length} Zeichen`);
      if (!article.faq?.length) problems.push(`${article.slug}: FAQ fehlt`);
    }
    expect(problems).toEqual([]);
  });

  it("alle internen Links in den Artikeln zeigen auf existierende Seiten", () => {
    const appDir = path.join(process.cwd(), "app");
    const exists = (url: string) => {
      const clean = url.split("#")[0].split("?")[0].replace(/\/$/, "");
      if (clean === "") return true;
      const segments = clean.split("/").filter(Boolean);
      if (fs.existsSync(path.join(appDir, ...segments, "page.tsx"))) return true;
      // dynamic routes
      if (segments[0] === "ratgeber" && segments.length === 2)
        return getAllArticles().some((article) => article.slug === segments[1]);
      if (segments[0] === "fahrzeuge" && segments.length === 2)
        return fs.existsSync(path.join(appDir, "fahrzeuge", "[slug]", "page.tsx"));
      return false;
    };
    const broken: string[] = [];
    for (const article of getAllArticles()) {
      for (const match of article.contentHtml.matchAll(/href="(\/[^"]*)"/g)) {
        if (!exists(match[1])) broken.push(`${article.slug}: ${match[1]}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("Fahrzeugseiten verweisen nur auf existierende Ratgeber", () => {
    const slugs = new Set(getAllArticles().map((article) => article.slug));
    const missing = VEHICLE_PAGES.flatMap((page) =>
      page.relatedArticles.filter((slug) => !slugs.has(slug)).map((slug) => `${page.slug}: ${slug}`),
    );
    expect(missing).toEqual([]);
  });

  it("Meta-Titel und -Beschreibungen haben eine sinnvolle Länge", () => {
    const problems: string[] = [];
    for (const page of VEHICLE_PAGES) {
      if (page.metaTitle.length > 65) problems.push(`${page.slug}: Titel ${page.metaTitle.length} Zeichen`);
      if (page.metaDescription.length < 110 || page.metaDescription.length > 170)
        problems.push(`${page.slug}: Beschreibung ${page.metaDescription.length} Zeichen`);
    }
    for (const article of getAllArticles()) {
      if (article.title.length > 75) problems.push(`${article.slug}: Titel ${article.title.length} Zeichen`);
    }
    expect(problems).toEqual([]);
  });
});

