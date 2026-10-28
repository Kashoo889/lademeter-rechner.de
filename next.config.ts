import type { NextConfig } from "next";
import { isNonProductionVercelDeployment } from "./lib/deployment";
import { DOWNLOADS_LIVE, downloadPages } from "./lib/downloads";
import { siteConfig } from "./lib/site-config";

/**
 * Deployments other than production (Vercel preview/development builds) must
 * never be indexed. Locally (`next start`) VERCEL_ENV is unset and the site
 * behaves like production so the real output can be tested.
 */
const isNonProductionDeploy = isNonProductionVercelDeployment();

// A conservative CSP that cannot break Next.js inline scripts: it restricts
// framing, plugins, base URIs and form targets, and upgrades insecure requests.
const contentSecurityPolicy = [
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  // All internal links, canonicals, and sitemap entries use a trailing
  // slash. Enforce it at the routing layer too so the non-slash URL
  // 308-redirects to the canonical form.
  trailingSlash: true,
  poweredByHeader: false,

  async redirects() {
    return [
      // www is not canonical: send every www request to the apex domain (also when the host does not do it).
      {
        source: "/:path((?!.*\\.[a-z0-9]+$).*)",
        has: [{ type: "host", value: "www.lademeter-rechner.de" }],
        destination: "https://lademeter-rechner.de/:path/",
        permanent: true,
      },
      // Files (sitemap.xml, downloads, icons) keep their exact path.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lademeter-rechner.de" }],
        destination: "https://lademeter-rechner.de/:path*",
        permanent: true,
      },
      // The Lademeter-Rechner moved to the homepage (one URL for the main keyword).
      { source: "/lademeter-rechner/", destination: "/", permanent: true },
      // Browsers request /favicon.ico by default; the icon is generated at /icon.
      { source: "/favicon.ico", destination: "/icon", permanent: false },
    ];
  },

  async headers() {
    const headers = [{ source: "/:path*", headers: securityHeaders }];
    if (isNonProductionDeploy) {
      headers.push({ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] as typeof securityHeaders });
    }
    // Download files: point search engines to the landing page as the canonical result and keep the
    // files out of the index entirely while the landing pages are still hidden.
    for (const page of downloadPages) {
      for (const file of page.files) {
        headers.push({
          source: `/downloads/${file.filename}`,
          headers: [
            { key: "Link", value: `<${siteConfig.domain}${page.path}>; rel="canonical"` },
            ...(DOWNLOADS_LIVE ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
          ],
        } as (typeof headers)[number]);
      }
    }
    return headers;
  },
};

export default nextConfig;
