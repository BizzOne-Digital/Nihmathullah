"use client";

import { useSearchParams } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";

interface BookingPageClientProps {
  confirmationText?: string;
}

export function BookingPageClient({ confirmationText }: BookingPageClientProps) {
  const searchParams = useSearchParams();

  const mode: "booking" | "quote" = searchParams.get("mode") === "quote" ? "quote" : "booking";

  const initialValues = {
    mode,
    rideType: searchParams.get("rideType") || "airport",
    pickupAddress: searchParams.get("pickup") || "",
    destinationAddress: searchParams.get("destination") || "",
    pickupDate: searchParams.get("date") || "",
    pickupTime: searchParams.get("time") || "",
    airportCode: searchParams.get("airport") || "",
  };

  return (
    <BookingForm
      defaultMode={mode}
      initialValues={initialValues}
      confirmationText={confirmationText}
    />
  );
}
