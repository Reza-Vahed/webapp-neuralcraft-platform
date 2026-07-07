"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "neuralcraft-cookie-notice-dismissed";
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function getServerSnapshot() {
  return false;
}

function dismiss() {
  window.localStorage.setItem(STORAGE_KEY, "1");
  listeners.forEach((listener) => listener());
}

// Informational notice only — no consent management, no optional/tracking
// cookies to opt in or out of (see PrivacyPage.sections.cookies). Dismissal
// is persisted in localStorage and read via useSyncExternalStore so the
// server-rendered pass (always "not dismissed") is reconciled with the real
// client value right after hydration, with no separate effect needed.
export function CookieNotice() {
  const t = useTranslations("CookieNotice");
  const dismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label={t("label")}
      className="border-border/60 bg-background fixed inset-x-0 bottom-0 z-50 border-t"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="text-muted-foreground text-sm">
          {t.rich("message", {
            link: (chunks) => (
              <Link
                href="/privacy"
                className="text-foreground underline underline-offset-4"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <Button size="sm" onClick={dismiss} className="shrink-0">
          {t("dismiss")}
        </Button>
      </div>
    </div>
  );
}
