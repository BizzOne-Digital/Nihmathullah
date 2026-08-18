"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { SiteSettingsData } from "@/types";

const DEFAULT_LOGO = "/uploads/settings/sierralink-logo.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Fleet", href: "/fleet" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

interface HeaderProps {
  settings: SiteSettingsData;
  services?: Array<{ title: string; slug: string }>;
}

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const logoUrl = settings.logoUrl || DEFAULT_LOGO;
  const bookLabel = settings.headerCtas?.bookLabel ?? "Book a Ride";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const overlayHeader = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-clip transition-all duration-300",
          overlayHeader
            ? "border-b border-transparent bg-transparent"
            : "border-b border-antique-gold/10 bg-obsidian/95 shadow-lg shadow-black/30 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-[var(--header-height)] w-full min-w-0 max-w-[var(--container-max)] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center"
            aria-label="SierraLink home"
          >
            <div className="relative h-10 w-32 max-w-[calc(100vw-5rem)] sm:h-11 sm:w-36 md:w-44">
              <OptimizedImage
                src={logoUrl}
                alt="SierraLink Executive Transportation"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-0.5 xl:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors lg:px-3 lg:text-xs",
                    active
                      ? "text-signature-gold"
                      : "text-ivory/85 hover:text-signature-gold"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href={settings.primaryPhoneLink}
              className="inline-flex items-center gap-2.5 text-sm font-medium text-ivory transition hover:text-signature-gold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-signature-gold/35 bg-signature-gold/10">
                <Phone className="h-4 w-4 text-signature-gold" />
              </span>
              <span className="hidden xl:inline">{settings.primaryPhoneDisplay}</span>
            </a>
            <Link
              href="/booking?mode=booking"
              className="inline-flex items-center rounded-sm bg-gold-gradient px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-obsidian shadow-md shadow-signature-gold/20 transition hover:brightness-110"
            >
              {bookLabel}
            </Link>
          </div>

          <button
            type="button"
            className="relative z-10 flex h-10 w-10 items-center justify-center text-ivory lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {!isHome && <div className="h-[var(--header-height)]" aria-hidden="true" />}

      <div
        className={cn(
          "fixed inset-0 z-40 bg-obsidian/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-full max-w-sm bg-charcoal shadow-2xl transition-transform duration-500 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="h-1 w-full bg-gradient-to-r from-antique-gold via-signature-gold to-champagne" />
        <nav className="flex flex-col p-6 pt-20" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "py-3 text-lg font-display transition-colors",
                pathname === link.href ? "text-signature-gold" : "text-ivory hover:text-signature-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3 border-t border-antique-gold/20 pt-6">
            <a
              href={settings.primaryPhoneLink}
              className="flex items-center gap-2 py-2 text-signature-gold"
            >
              <Phone className="h-5 w-5" />
              {settings.primaryPhoneDisplay}
            </a>
            <Link
              href="/booking?mode=booking"
              className="inline-flex items-center justify-center rounded-sm bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-obsidian"
            >
              {bookLabel}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
