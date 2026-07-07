"use client";

import "./globals.css";

// Last-resort error boundary: it replaces the entire app, including
// app/[locale]/layout.tsx, so there is no NextIntlClientProvider and no
// next-themes class on <html> here — hence plain English and hardcoded
// dark colors (inline, not the CSS custom properties that `.dark` normally
// toggles) rather than the usual translated, theme-aware UI. Deliberately
// dependency-free: this only renders when something has already gone
// severely wrong, so it avoids the rest of the component library.
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{ background: "#0a0a0a", color: "#fafafa" }}
        className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center font-sans"
      >
        <div
          style={{ background: "rgba(79, 70, 229, 0.15)", color: "#818cf8" }}
          className="flex size-20 items-center justify-center rounded-full text-4xl"
          aria-hidden
        >
          !
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          Something went wrong
        </h1>
        <p
          style={{ color: "#a1a1aa" }}
          className="max-w-md text-lg text-balance"
        >
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{ background: "#4f46e5", color: "#fff" }}
          className="rounded-lg px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
