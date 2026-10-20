/**
 * Brand mark for generated images (favicon, Apple touch icon, logo, OG image):
 * a stylised trailer floor with three pallets in Warnorange on navy.
 * Uses only inline styles supported by next/og ImageResponse.
 */
export function BrandMark({ size }: { size: number }) {
  const radius = Math.round(size * 0.2);
  const floorWidth = size * 0.72;
  const floorHeight = size * 0.36;
  const gap = size * 0.03;
  const palletWidth = (floorWidth - gap * 4) / 3;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        borderRadius: radius,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap,
          padding: gap,
          width: floorWidth,
          height: floorHeight,
          border: `${Math.max(1, Math.round(size * 0.035))}px solid #cbd5e1`,
          borderRadius: Math.round(size * 0.04),
        }}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              display: "flex",
              width: palletWidth,
              height: "100%",
              backgroundColor: "#ea580c",
              borderRadius: Math.round(size * 0.025),
            }}
          />
        ))}
      </div>
    </div>
  );
}
