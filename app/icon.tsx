import { ImageResponse } from "next/og";

export const contentType = "image/png";

// Placeholder brand mark: a simple "N" monogram on the accent color
// (matches --primary in app/globals.css — plum/aubergine since the Design
// Refresh). Not final brand assets — swap for a real logo-derived icon once
// the visual identity is finalized (see DESIGN.md).
const BRAND_ACCENT = "#7c2882";

function Mark({ radius, fontSize }: { radius: number; fontSize: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_ACCENT,
        borderRadius: radius,
        color: "#fff",
        fontSize,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      N
    </div>
  );
}

export function generateImageMetadata() {
  return [
    { id: "favicon", size: { width: 32, height: 32 }, contentType },
    { id: "pwa-192", size: { width: 192, height: 192 }, contentType },
    { id: "pwa-512", size: { width: 512, height: 512 }, contentType },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id;
  const sizes: Record<string, number> = {
    favicon: 32,
    "pwa-192": 192,
    "pwa-512": 512,
  };
  const size = sizes[iconId] ?? 32;

  return new ImageResponse(
    <Mark radius={size * 0.22} fontSize={size * 0.58} />,
    { width: size, height: size }
  );
}
