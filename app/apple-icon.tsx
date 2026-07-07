import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same placeholder monogram as app/icon.tsx, sized for iOS home screens
// (Apple applies its own corner rounding, so no border-radius here).
const BRAND_INDIGO = "#4F46E5";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_INDIGO,
        color: "#fff",
        fontSize: 96,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      N
    </div>,
    { ...size }
  );
}
