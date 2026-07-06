import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Builds the href for a given page number, e.g. (2) => "/blog/page/2" */
  buildHref: (page: number) => string;
};

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  const t = useTranslations("Pagination");

  if (totalPages <= 1) return null;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label={t("label")}
      className="mt-12 flex items-center justify-between"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrevious}
        nativeButton={false}
        render={
          hasPrevious ? (
            <Link href={buildHref(currentPage - 1)} />
          ) : (
            <span aria-disabled="true" />
          )
        }
      >
        <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
        {t("previous")}
      </Button>

      <p className="text-muted-foreground text-sm">
        {t("pageOf", { current: currentPage, total: totalPages })}
      </p>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        nativeButton={false}
        render={
          hasNext ? (
            <Link href={buildHref(currentPage + 1)} />
          ) : (
            <span aria-disabled="true" />
          )
        }
      >
        {t("next")}
        <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
      </Button>
    </nav>
  );
}
