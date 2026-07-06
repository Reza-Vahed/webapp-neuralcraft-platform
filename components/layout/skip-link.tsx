import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("Common");

  return (
    <a
      href="#main-content"
      className="focus-visible:ring-ring bg-background text-foreground sr-only rounded-md px-4 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:start-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:ring-2 focus-visible:outline-none"
    >
      {t("skipToContent")}
    </a>
  );
}
