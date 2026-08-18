"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Building2,
  Calendar,
  Car,
  Landmark,
  MapPin,
  Phone,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { SiteSettingsData } from "@/types";

export const HOME_HERO_BACKGROUND = "/uploads/pages/home-hero-bg.png";

const TRIP_TYPES = [
  { value: "airport", label: "Airport Transfer" },
  { value: "local", label: "Local Ride" },
  { value: "long-distance", label: "Long Distance" },
  { value: "executive", label: "Executive / Corporate" },
  { value: "corporate", label: "Corporate" },
  { value: "private-car", label: "Private Car Service" },
];

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
  const router = useRouter();
  const [rideType, setRideType] = useState("airport");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ mode: "booking", rideType });
    if (pickup) params.set("pickup", pickup);
    if (destination) params.set("destination", destination);
    if (pickupDate) params.set("date", pickupDate);
    router.push(`/booking?${params.toString()}`);
  };

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

        <form
          onSubmit={handleBookingSubmit}
          className="relative z-20 w-full min-w-0 max-w-full rounded-md border border-antique-gold/20 bg-charcoal/75 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-4 md:p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-signature-gold" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-ivory">
              Plan Your Ride
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr_0.9fr_auto] lg:items-end">
            <HeroField label="Pickup" id="hero-pickup">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
                <input
                  id="hero-pickup"
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className={heroInputClass}
                />
              </div>
            </HeroField>

            <HeroField label="Destination" id="hero-destination">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
                <input
                  id="hero-destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className={heroInputClass}
                />
              </div>
            </HeroField>

            <HeroField label="Date" id="hero-date">
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
                <input
                  id="hero-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={heroInputClass}
                />
              </div>
            </HeroField>

            <HeroField label="Ride Type" id="hero-ride-type">
              <div className="relative">
                <Car className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
                <select
                  id="hero-ride-type"
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value)}
                  className={cn(heroInputClass, "appearance-none pr-8")}
                >
                  {TRIP_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </HeroField>

            <Button
              type="submit"
              variant="gold"
              size="md"
              magnetic
              className="h-[46px] w-full max-w-full px-4 text-xs uppercase tracking-wider sm:px-6 sm:text-sm lg:w-auto lg:min-w-[150px] lg:whitespace-nowrap"
            >
              Start Booking
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

const heroInputClass =
  "h-[46px] w-full rounded-sm border border-antique-gold/15 bg-ivory/95 pl-10 pr-3 text-sm text-obsidian placeholder:text-obsidian/45 focus:outline-none focus:ring-2 focus:ring-signature-gold/40";

function HeroField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-signature-gold"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
