import type { CSSProperties } from "react";

// Inline styles only — email clients strip <style> tags and external CSS
// unpredictably, so every rule has to travel with its element. Kept in one
// place so both templates stay visually consistent (same accent color as
// app/icon.tsx / DESIGN.md) without duplicating the object.
export const emailStyles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    margin: 0,
    padding: "32px 16px",
  },
  container: {
    maxWidth: 480,
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #e4e4e7",
  },
  header: {
    backgroundColor: "#7c2882",
    padding: "20px 32px",
  },
  brand: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
  },
  content: {
    padding: "32px",
  },
  heading: {
    fontSize: 20,
    fontWeight: 600,
    color: "#18181b",
    margin: "0 0 16px",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#3f3f46",
    margin: "0 0 16px",
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#71717a",
    margin: "0 0 4px",
  },
  value: {
    fontSize: 15,
    color: "#18181b",
    margin: "0 0 20px",
    whiteSpace: "pre-wrap",
  },
  footer: {
    padding: "20px 32px",
    borderTop: "1px solid #e4e4e7",
  },
  footerText: {
    fontSize: 13,
    color: "#a1a1aa",
    margin: 0,
  },
} satisfies Record<string, CSSProperties>;
