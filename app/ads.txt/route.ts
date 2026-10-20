import { adsenseClient } from "@/lib/ads/config";

/**
 * ads.txt (Authorized Digital Sellers). Generated from NEXT_PUBLIC_ADSENSE_CLIENT;
 * answers 404 until a valid publisher ID is configured.
 */
export function GET() {
  if (!adsenseClient) {
    return new Response("Not found", { status: 404 });
  }
  const publisherId = adsenseClient.replace(/^ca-/, "");
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
