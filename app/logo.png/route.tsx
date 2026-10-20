import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand/BrandMark";

export const dynamic = "force-static";

/** 512 x 512 logo referenced by the Organization structured data and the web manifest. */
export function GET() {
  return new ImageResponse(<BrandMark size={512} />, { width: 512, height: 512 });
}
