import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllArticles } from "@/lib/content/ratgeber";
import { VEHICLE_PAGES } from "@/lib/content/fahrzeuge";
import { CLUSTERS, CLUSTER_IDS, SLUG_CLUSTER, getClusterIdForArticle, getClusterNavLinks } from "@/lib/content/clusters";

function routeExists(url: string): boolean {
  const appDir = path.join(process.cwd(), "app");
  const clean = url.split("#")[0].replace(/\/$/, "");
  if (clean === "") return true;
  const segments = clean.split("/").filter(Boolean);
  if (fs.existsSync(path.join(appDir, ...segments, "page.tsx"))) return true;
  if (segments[0] === "ratgeber" && segments.length === 2) return getAllArticles().some((a) => a.slug === segments[1]);
  if (segments[0] === "fahrzeuge" && segments.length === 2) return VEHICLE_PAGES.some((p) => p.slug === segments[1]);
  return false;
}

describe("Themencluster", () => {
  it("jeder Artikel gehört zu genau einem gültigen Cluster (Frontmatter `cluster` oder SLUG_CLUSTER)", () => {
    const problems = getAllArticles()
      .filter((article) => !getClusterIdForArticle(article))
      .map((article) => `${article.slug}: kein Cluster – Frontmatter "cluster: <id>" setzen (${CLUSTER_IDS.join(", ")})`);
    expect(problems).toEqual([]);
  });

  it("SLUG_CLUSTER verweist nur auf existierende Artikel und gültige Cluster", () => {
    const slugs = new Set(getAllArticles().map((a) => a.slug));
    for (const [slug, cluster] of Object.entries(SLUG_CLUSTER)) {
      expect(slugs.has(slug), `${slug} existiert nicht`).toBe(true);
      expect(CLUSTER_IDS).toContain(cluster);
    }
  });

  it("alle kuratierten Cluster-Links zeigen auf existierende Seiten und haben Text", () => {
    const broken: string[] = [];
    for (const cluster of Object.values(CLUSTERS)) {
      for (const link of cluster.links) {
        if (!routeExists(link.href)) broken.push(`${cluster.id}: ${link.href}`);
        if (!link.label || !link.description) broken.push(`${cluster.id}: ${link.href} ohne Text`);
        if (!link.href.endsWith("/")) broken.push(`${cluster.id}: ${link.href} ohne Schrägstrich`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("Cluster-Navigation schließt die aktuelle Seite aus, hat keine Dopplungen und höchstens 6 Links", () => {
    for (const id of CLUSTER_IDS) {
      const current = CLUSTERS[id].links[0].href;
      const { links } = getClusterNavLinks(id, current);
      expect(links.length).toBeLessThanOrEqual(6);
      expect(links.map((l) => l.href)).not.toContain(current);
      expect(new Set(links.map((l) => l.href)).size).toBe(links.length);
    }
  });
});
