"use client";

import { useSearchParams } from "next/navigation";
import { BookingForm, type BookingVehicleOption } from "@/components/booking/BookingForm";
import type { BookingFormInput } from "@/lib/validation/booking";

interface BookingPageClientProps {
  confirmationText?: string;
  vehicles?: BookingVehicleOption[];
}

export function BookingPageClient({
  confirmationText,
  vehicles = [],
}: BookingPageClientProps) {
  const searchParams = useSearchParams();

  const tripStructureParam = searchParams.get("tripStructure");
  const tripStructure: BookingFormInput["tripStructure"] =
    tripStructureParam === "hourly"
      ? "hourly"
      : tripStructureParam === "round-trip"
        ? "round-trip"
        : "one-way";

  const initialValues: Partial<BookingFormInput> = {
    mode: "booking",
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
      initialValues={initialValues}
      confirmationText={confirmationText}
      vehicles={vehicles}
    />
  );
}
