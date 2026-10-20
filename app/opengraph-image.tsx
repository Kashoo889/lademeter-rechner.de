import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { BrandMark } from "@/lib/brand/BrandMark";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lademeter Rechner – Online-Rechner für Lademeter, Paletten und LKW-Ladeplanung";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", width: 96, height: 96, marginBottom: 32 }}>
          <BrandMark size={96} />
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "white" }}>{siteConfig.name}</div>
        <div style={{ display: "flex", fontSize: 34, color: "#cbd5e1", marginTop: 16 }}>
          Lademeter · Paletten · Kartons · LKW-Beladung · Volumengewicht
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#fdba74", marginTop: 32 }}>
          Kostenlos online berechnen – mit Ladeplan
        </div>
      </div>
    ),
    { ...size },
  );
}
