import { notFound } from "next/navigation";

// Catches any path under a valid locale that doesn't match a defined route
// (e.g. a typo'd or dead link). Without this, Next.js falls back to its
// built-in generic 404 instead of the styled app/[locale]/not-found.tsx,
// since a bare [locale] segment only matches routes that exist beneath it.
export default function CatchAll() {
  notFound();
}
