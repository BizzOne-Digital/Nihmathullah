"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface QuickQuoteSectionProps {
  section: PageSection;
}

const TRIP_TYPES = [
  { value: "airport", label: "Airport Transfer" },
  { value: "local", label: "Local Ride" },
  { value: "long-distance", label: "Long Distance" },
  { value: "executive", label: "Executive / Corporate" },
];

export function QuickQuoteSection({ section }: QuickQuoteSectionProps) {
  const router = useRouter();
  const dark = isDarkTheme(section.theme);

  const [rideType, setRideType] = useState("airport");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("rideType", rideType);
    if (pickup) params.set("pickup", pickup);
    if (destination) params.set("destination", destination);
    if (pickupDate) params.set("date", pickupDate);
    if (pickupTime) params.set("time", pickupTime);
    router.push(`/booking?${params.toString()}`);
  };

  const inputClass = dark
    ? "bg-charcoal border-antique-gold/20 text-ivory placeholder:text-muted-silver"
    : "bg-white border-obsidian/10 text-obsidian placeholder:text-obsidian/40";

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading || "Quick Quote"}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl rounded-sm border border-antique-gold/20 bg-charcoal/50 p-6 md:p-8 backdrop-blur-sm"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="rideType"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold"
                >
                  Trip Type
                </label>
                <select
                  id="rideType"
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value)}
                  className={`w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-gold/50 ${inputClass}`}
                >
                  {TRIP_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="pickup"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold"
                >
                  Pickup Location
                </label>
                <input
                  id="pickup"
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup address"
                  className={`w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-gold/50 ${inputClass}`}
                />
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold"
                >
                  Destination
                </label>
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className={`w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-gold/50 ${inputClass}`}
                />
              </div>

              <div>
                <label
                  htmlFor="pickupDate"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold"
                >
                  Date
                </label>
                <input
                  id="pickupDate"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={`w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-gold/50 ${inputClass}`}
                />
              </div>

              <div>
                <label
                  htmlFor="pickupTime"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold"
                >
                  Time
                </label>
                <input
                  id="pickupTime"
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className={`w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-gold/50 ${inputClass}`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button type="submit" variant="gold" size="lg" magnetic>
                {section.primaryCta?.label || "Continue to Booking"}
              </Button>
            </div>
          </form>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
