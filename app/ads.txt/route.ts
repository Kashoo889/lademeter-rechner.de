import { adsenseClient } from "@/lib/consent/config";

export const dynamic = "force-static";

/**
 * ads.txt (Authorized Digital Sellers). Generated from NEXT_PUBLIC_ADSENSE_CLIENT
 * so no publisher ID is ever hardcoded. Returns 404 until a valid ID is set.
 * f08c47fec0942fa0 is Google's public TAG certification authority ID.
 */
export function GET() {
  if (!adsenseClient) {
    return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  const publisherId = adsenseClient.replace(/^ca-/, "");
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
