"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/layout/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/case-studies", key: "caseStudies" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/careers", key: "careers" },
] as const;

export function Navbar() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes. Adjusting state during
  // render (rather than in an effect) avoids an extra post-navigation paint.
  const [previousPathname, setPreviousPathname] = useState(pathname);
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-heading text-base font-semibold tracking-tight"
        >
          NeuralCraft
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/contact" />}
          >
            {t("contact")}
          </Button>
        </div>

        {/* Mobile-audit: p-3 around a 20px icon gives a 44px tap target
            (20 + 12 + 12), the min. touch-target guideline this audit
            checked against — only touches this button since it's already
            md:hidden, no desktop-density tradeoff to weigh. */}
        <button
          type="button"
          className="text-foreground -me-3 inline-flex items-center justify-center rounded-md p-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? tCommon("closeMenu") : tCommon("openMenu")}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>
      </Container>

      {open && (
        <nav id="mobile-nav" className="border-border/60 border-t md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              // py-3 (not the desktop-shared py-2): text-sm's 20px line
              // height + 12px top/bottom lands exactly on the 44px
              // touch-target guideline this audit checked against.
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-3 text-sm font-medium transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between px-3">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            {/* h-11 override: the shared Button "default" size (h-8/32px)
                is fine for the same CTA in the dense desktop navbar, but
                this is the primary mobile conversion action — same 44px
                reasoning as the `lg` Button size, without bumping every
                default-size button sitewide. */}
            <Button
              className="mx-3 mt-2 h-11"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {t("contact")}
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
