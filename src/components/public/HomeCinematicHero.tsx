"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Landmark,
  Phone,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookingWidget } from "@/components/booking/BookingWidget";
import type { SiteSettingsData } from "@/types";

export const HOME_HERO_BACKGROUND = "/uploads/pages/home-hero-bg.png";

interface HomeCinematicHeroProps {
  settings: SiteSettingsData;
  headline?: string;
  subheading?: string;
}

export function HomeCinematicHero({
  settings,
  headline = "Reliable Airport, Executive, Local & Long-Distance Transportation",
  subheading = "Professional private car service for airport transfers, business travel, local rides and long-distance trips.",
}: HomeCinematicHeroProps) {
  return (
    <section className="relative min-h-[100svh] w-full max-w-full overflow-hidden bg-obsidian">
      <div className="absolute inset-0">
        <Image
          src={HOME_HERO_BACKGROUND}
          alt="Luxury black SUV with professional chauffeur at night"
          fill
          priority
          className="object-cover object-[70%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/30" />
      </div>

      <div
        className="pointer-events-none absolute left-[4%] top-[18%] hidden h-72 w-72 opacity-[0.07] lg:block xl:h-96 xl:w-96"
        aria-hidden="true"
      >
        <Image
          src={settings.logoUrl || "/uploads/settings/sierralink-logo.png"}
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <svg
        className="pointer-events-none absolute bottom-[28%] left-0 z-[1] h-32 w-full opacity-80 md:bottom-[30%] md:h-40"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroRouteGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#AC9461" stopOpacity="0" />
            <stop offset="20%" stopColor="#D0AF6F" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#E2C179" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#AC9461" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,90 C240,40 420,110 640,60 C860,10 1080,80 1440,35"
          fill="none"
          stroke="url(#heroRouteGold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M0,100 C260,55 440,115 660,72 C880,28 1100,95 1440,50"
          fill="none"
          stroke="url(#heroRouteGold)"
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
        <circle cx="320" cy="72" r="4" fill="#E2C179" />
        <circle cx="720" cy="48" r="4" fill="#E2C179" />
        <circle cx="1120" cy="58" r="4" fill="#E2C179" />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full min-w-0 max-w-[var(--container-max)] flex-col px-4 pb-6 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="flex flex-1 flex-col justify-center pb-8 lg:max-w-3xl">
          <p className="max-w-full text-[10px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-signature-gold sm:text-[11px] sm:tracking-[0.28em] md:text-xs">
            Private Transportation • Albany &amp; the Capital Region
          </p>

          <h1 className="mt-5 break-words font-display text-[clamp(1.75rem,5vw,3.75rem)] leading-[1.08] text-ivory">
            {headline}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/75 md:text-lg">
            {subheading}
          </p>

          <div className="mt-8 flex w-full max-w-full flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/booking?mode=booking"
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-sm bg-gold-gradient px-5 py-3 text-xs font-semibold uppercase tracking-wider text-obsidian shadow-lg shadow-signature-gold/25 transition hover:brightness-110 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              Book a Ride
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/booking?mode=quote"
              className="inline-flex min-w-0 items-center justify-center rounded-sm border border-signature-gold/60 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-signature-gold transition hover:bg-signature-gold/10 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              Get a Quote
            </Link>
          </div>

          <a
            href={settings.primaryPhoneLink}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-signature-gold transition hover:text-champagne"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-signature-gold/40 bg-signature-gold/10">
              <Phone className="h-4 w-4" />
            </span>
            Call {settings.primaryPhoneDisplay}
          </a>

          <div className="mt-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/booking?mode=booking&rideType=airport&airport=ALB"
                className="inline-flex items-center gap-2 rounded-sm border border-antique-gold/25 bg-obsidian/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory backdrop-blur-sm transition hover:border-signature-gold/50"
              >
                <Building2 className="h-4 w-4 text-signature-gold" />
                ALB Airport
              </Link>
              <Link
                href="/booking?mode=booking&rideType=airport&airport=JFK"
                className="inline-flex items-center gap-2 rounded-sm border border-antique-gold/25 bg-obsidian/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory backdrop-blur-sm transition hover:border-signature-gold/50"
              >
                <Plane className="h-4 w-4 text-signature-gold" />
                JFK Airport
              </Link>
              <Link
                href="/service-areas"
                className="inline-flex items-center gap-2 rounded-sm border border-antique-gold/25 bg-obsidian/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory backdrop-blur-sm transition hover:border-signature-gold/50"
              >
                <Landmark className="h-4 w-4 text-signature-gold" />
                Capital Region
              </Link>
            </div>

            <p className="hidden items-center gap-2 rounded-sm border border-antique-gold/25 bg-obsidian/50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-signature-gold/90 backdrop-blur-sm lg:inline-flex">
              ALB
              <ArrowRight className="h-3.5 w-3.5" />
              <Landmark className="h-3.5 w-3.5" />
              Capital Region
              <ArrowRight className="h-3.5 w-3.5" />
              <Plane className="h-3.5 w-3.5" />
              JFK
            </p>
          </div>
        </div>

        <BookingWidget className="relative z-20" mode="quote" submitLabel="Get a Quote" />
      </div>
    </section>
  );
}
