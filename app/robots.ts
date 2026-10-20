import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { isNonProductionVercelDeployment } from "@/lib/deployment";

export default function robots(): MetadataRoute.Robots {
  if (isNonProductionVercelDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.domain).toString(),
  };
}
