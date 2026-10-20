import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand/BrandMark";

// 48 px: Google Search recommends favicons in multiples of 48 px.
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMark size={48} />, { ...size });
}
