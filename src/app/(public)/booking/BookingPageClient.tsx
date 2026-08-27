"use client";

import { useSearchParams } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";
import type { BookingFormInput } from "@/lib/validation/booking";

interface BookingPageClientProps {
  confirmationText?: string;
}

export function BookingPageClient({ confirmationText }: BookingPageClientProps) {
  const searchParams = useSearchParams();

  const mode: "booking" | "quote" =
    searchParams.get("mode") === "booking" ? "booking" : "quote";

  const tripStructureParam = searchParams.get("tripStructure");
  const tripStructure: BookingFormInput["tripStructure"] =
    tripStructureParam === "hourly"
      ? "hourly"
      : tripStructureParam === "round-trip"
        ? "round-trip"
        : "one-way";

  const initialValues: Partial<BookingFormInput> = {
    mode,
    tripStructure,
    rideType:
      searchParams.get("rideType") ||
      (tripStructure === "hourly" ? "hourly" : "airport"),
    pickupAddress: searchParams.get("pickup") || "",
    destinationAddress: searchParams.get("destination") || "",
    pickupDate: searchParams.get("date") || "",
    pickupTime: searchParams.get("time") || "",
    airportCode: searchParams.get("airport") || "",
    durationHours: searchParams.get("durationHours")
      ? Number(searchParams.get("durationHours"))
      : 3,
  };

  return (
    <BookingForm
      defaultMode={mode}
      initialValues={initialValues}
      confirmationText={confirmationText}
    />
  );
}
