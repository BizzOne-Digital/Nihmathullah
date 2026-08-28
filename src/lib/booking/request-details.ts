import type { BookingFormInput } from "@/lib/validation/booking";
import type { BookingRequestDetails } from "@/lib/email/templates";

export function buildBookingRequestDetails(
  reference: string,
  data: BookingFormInput
): BookingRequestDetails {
  return {
    reference,
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    rideType: data.rideType,
    tripStructure: data.tripStructure,
    pickupAddress: data.pickupAddress,
    destinationAddress:
      data.tripStructure === "hourly"
        ? `As directed (${data.durationHours || 3} hours)`
        : data.destinationAddress || "",
    pickupDate: data.pickupDate,
    pickupTime: data.pickupTime,
    passengerCount: data.passengerCount,
    luggageCount: data.luggageCount,
    vehiclePreference: data.vehiclePreference || undefined,
    airportCode: data.airportCode || undefined,
    flightType: data.flightType,
    airline: data.airline || undefined,
    flightNumber: data.flightNumber || undefined,
    specialInstructions: data.specialInstructions || undefined,
  };
}
