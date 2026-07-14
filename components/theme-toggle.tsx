"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

// Avoids a hydration mismatch: the server never knows the persisted theme,
// so the toggle renders as a neutral placeholder until mounted on the client.
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const t = useTranslations("Common");

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-hidden className="opacity-0" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    // Mobile-audit: the visual 32px icon button stays compact (this sits
    // in the dense desktop navbar too, where a 44px icon would look
    // oversized) — the `after:` pseudo-element instead grows an invisible,
    // centered 44px hit area around it, satisfying the touch-target
    // guideline without changing what anyone actually sees.
    <Button
      variant="ghost"
      size="icon"
      className="relative after:absolute after:inset-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"
      aria-label={isDark ? t("switchToLightTheme") : t("switchToDarkTheme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
