import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} – ${siteConfig.descriptor}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "de-DE",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [{ src: "/logo.png", sizes: "512x512", type: "image/png" }],
  };
}
