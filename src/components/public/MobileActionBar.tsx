"use client";

import Link from "next/link";
import { Phone, MessageSquare, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteSettingsData } from "@/types";

interface MobileActionBarProps {
  settings: Pick<
    SiteSettingsData,
    "primaryPhoneDisplay" | "primaryPhoneLink" | "headerCtas"
  >;
}

export function MobileActionBar({ settings }: MobileActionBarProps) {
  const ctas = settings.headerCtas ?? {
    callLabel: "Call Now",
    quoteLabel: "Get a Quote",
    bookLabel: "Book a Ride",
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 w-full max-w-full md:hidden",
        "border-t border-antique-gold/20 bg-obsidian/95 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)]"
      )}
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="flex h-[var(--mobile-action-bar-height)] items-stretch">
        <a
          href={settings.primaryPhoneLink}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-signature-gold transition-colors active:bg-charcoal"
          aria-label={`Call ${settings.primaryPhoneDisplay}`}
        >
          <Phone className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wide">
            {ctas.callLabel}
          </span>
        </a>

        <Link
          href="/contact"
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-ivory/80 transition-colors active:bg-charcoal hover:text-signature-gold"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wide">
            {ctas.quoteLabel}
          </span>
        </Link>

        <Link
          href="/booking"
          className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-gold-gradient text-obsidian transition-colors active:brightness-95"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wide">
            {ctas.bookLabel}
          </span>
        </Link>
      </div>
    </div>
  );
}
