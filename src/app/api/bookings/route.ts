import { revalidatePath } from "next/cache";
import { createBooking } from "@/lib/repositories/bookings";
import { buildBookingRequestDetails } from "@/lib/booking/request-details";
import {
  notifyAdminNewBooking,
  notifyCustomerBookingConfirmation,
} from "@/lib/email/notifications";
import { bookingFormSchema } from "@/lib/validation/booking";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/request";
import {
  handleApiError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(
      ip,
      "booking",
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const body = await request.json();
    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;

    if (data.honeypot) {
      return jsonResponse({ success: true, reference: "SL-OK" });
    }

    const booking = await createBooking({
      mode: "booking",
      tripDetails: {
        rideType: data.rideType,
        tripStructure: data.tripStructure,
        durationHours: data.durationHours,
        pickupAddress: data.pickupAddress,
        destinationAddress:
          data.tripStructure === "hourly"
            ? "As directed"
            : data.destinationAddress || "",
        stops: data.stops,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        returnDate: data.returnDate || undefined,
        returnTime: data.returnTime || undefined,
        timezone: data.timezone,
        airportCode: data.airportCode || undefined,
        flightType: data.flightType,
        airline: data.airline || undefined,
        flightNumber: data.flightNumber || undefined,
        vehiclePreference: data.vehiclePreference || undefined,
        passengerCount: data.passengerCount,
        luggageCount: data.luggageCount,
        childSeatRequest: data.childSeatRequest,
        accessibilityRequest: data.accessibilityRequest,
        specialAssistance: data.specialAssistance || undefined,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        company: data.company || undefined,
        preferredContact: data.preferredContact,
        specialInstructions: data.specialInstructions || undefined,
        consent: data.consent,
      },
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      referrer: data.referrer,
    });

    revalidatePath("/admin/bookings");

    const requestDetails = buildBookingRequestDetails(
      booking.reference,
      data
    );

    void notifyAdminNewBooking(requestDetails);
    void notifyCustomerBookingConfirmation(requestDetails);

    return jsonResponse({
      success: true,
      reference: booking.reference,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
