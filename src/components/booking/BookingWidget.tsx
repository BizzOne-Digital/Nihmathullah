"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type TripMode = "one-way" | "hourly";

export interface BookingWidgetValues {
  tripMode: TripMode;
  pickup: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  durationHours: string;
}

interface BookingWidgetProps {
  className?: string;
  submitLabel?: string;
  compact?: boolean;
  initialValues?: Partial<BookingWidgetValues>;
}

const inputClass =
  "h-[46px] w-full rounded-sm border border-antique-gold/15 bg-ivory/95 pl-10 pr-3 text-sm text-obsidian placeholder:text-obsidian/45 focus:outline-none focus:ring-2 focus:ring-signature-gold/40";

export function BookingWidget({
  className,
  submitLabel = "Request a Ride",
  compact = false,
  initialValues,
}: BookingWidgetProps) {
  const router = useRouter();
  const [tripMode, setTripMode] = useState<TripMode>(initialValues?.tripMode ?? "one-way");
  const [pickup, setPickup] = useState(initialValues?.pickup ?? "");
  const [destination, setDestination] = useState(initialValues?.destination ?? "");
  const [pickupDate, setPickupDate] = useState(initialValues?.pickupDate ?? "");
  const [pickupTime, setPickupTime] = useState(initialValues?.pickupTime ?? "");
  const [durationHours, setDurationHours] = useState(initialValues?.durationHours ?? "3");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ tripStructure: tripMode });
    if (pickup) params.set("pickup", pickup);
    if (tripMode === "one-way" && destination) params.set("destination", destination);
    if (tripMode === "hourly") {
      params.set("rideType", "hourly");
      if (durationHours) params.set("durationHours", durationHours);
    }
    if (pickupDate) params.set("date", pickupDate);
    if (pickupTime) params.set("time", pickupTime);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full min-w-0 rounded-md border border-antique-gold/20 bg-charcoal/75 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-4 md:p-5",
        className
      )}
    >
      <div className="mb-4 flex rounded-sm border border-antique-gold/20 bg-obsidian/40 p-1">
        <TripTab
          active={tripMode === "one-way"}
          onClick={() => setTripMode("one-way")}
        >
          One way
        </TripTab>
        <TripTab
          active={tripMode === "hourly"}
          onClick={() => setTripMode("hourly")}
        >
          By the hour
        </TripTab>
      </div>

      <div
        className={cn(
          "grid gap-3",
          compact
            ? "md:grid-cols-2"
            : "md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.85fr_0.85fr_auto] lg:items-end"
        )}
      >
        <WidgetField label="Pickup location" id="widget-pickup">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
            <input
              id="widget-pickup"
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              className={inputClass}
              required
            />
          </div>
        </WidgetField>

        {tripMode === "one-way" ? (
          <WidgetField label="Drop-off location" id="widget-destination">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
              <input
                id="widget-destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter drop-off location"
                className={inputClass}
                required
              />
            </div>
          </WidgetField>
        ) : (
          <WidgetField label="Hours needed" id="widget-hours">
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
              <select
                id="widget-hours"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className={cn(inputClass, "appearance-none")}
              >
                {[2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                  <option key={h} value={String(h)}>
                    {h} hours
                  </option>
                ))}
              </select>
            </div>
          </WidgetField>
        )}

        <WidgetField label="Date" id="widget-date">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
            <input
              id="widget-date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </WidgetField>

        <WidgetField label="Pickup time" id="widget-time">
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-bronze" />
            <input
              id="widget-time"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </WidgetField>

        <Button
          type="submit"
          variant="gold"
          size="md"
          magnetic
          className={cn(
            "h-[46px] w-full px-4 text-xs uppercase tracking-wider sm:text-sm",
            !compact && "lg:min-w-[150px] lg:w-auto lg:whitespace-nowrap"
          )}
        >
          {submitLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function TripTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "bg-signature-gold text-obsidian shadow-sm"
          : "text-muted-silver hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}

function WidgetField({
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
