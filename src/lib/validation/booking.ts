import { z } from "zod";
import {
  consentField,
  emailField,
  honeypotField,
  messageField,
  nameField,
  optionalPhoneField,
  phoneField,
  utmFields,
} from "./common";

const tripStructureField = z.enum(["one-way", "round-trip"]);
const preferredContactField = z.enum(["phone", "email", "either"]);
const flightTypeField = z.enum(["arrival", "departure"]);

export const bookingFormSchema = z
  .object({
    mode: z.enum(["booking", "quote"]),
    rideType: z.string().trim().min(1, "Ride type is required").max(120),
    tripStructure: tripStructureField,
    pickupAddress: z
      .string()
      .trim()
      .min(1, "Pickup address is required")
      .max(500),
    destinationAddress: z
      .string()
      .trim()
      .min(1, "Destination address is required")
      .max(500),
    stops: z.array(z.string().trim().min(1).max(500)).max(10).optional(),
    pickupDate: z.string().trim().min(1, "Pickup date is required").max(20),
    pickupTime: z.string().trim().min(1, "Pickup time is required").max(20),
    returnDate: z.string().trim().max(20).optional().or(z.literal("")),
    returnTime: z.string().trim().max(20).optional().or(z.literal("")),
    timezone: z.string().trim().min(1, "Timezone is required").max(80),
    airportCode: z.string().trim().max(10).optional().or(z.literal("")),
    flightType: flightTypeField.optional(),
    airline: z.string().trim().max(120).optional().or(z.literal("")),
    flightNumber: z.string().trim().max(20).optional().or(z.literal("")),
    passengerCount: z.coerce
      .number()
      .int("Passenger count must be a whole number")
      .min(1, "At least one passenger is required")
      .max(50),
    luggageCount: z.coerce
      .number()
      .int("Luggage count must be a whole number")
      .min(0, "Luggage count cannot be negative")
      .max(50),
    childSeatRequest: z.boolean().optional(),
    accessibilityRequest: z.boolean().optional(),
    specialAssistance: z.string().trim().max(1000).optional().or(z.literal("")),
    contactName: nameField,
    contactEmail: emailField,
    contactPhone: phoneField,
    company: z.string().trim().max(120).optional().or(z.literal("")),
    preferredContact: preferredContactField,
    specialInstructions: z
      .string()
      .trim()
      .max(2000)
      .optional()
      .or(z.literal("")),
    consent: consentField,
    honeypot: honeypotField,
    ...utmFields,
  })
  .superRefine((data, ctx) => {
    if (data.tripStructure === "round-trip") {
      if (!data.returnDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Return date is required for round-trip bookings",
          path: ["returnDate"],
        });
      }
      if (!data.returnTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Return time is required for round-trip bookings",
          path: ["returnTime"],
        });
      }
    }
  });

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: optionalPhoneField,
  message: messageField,
  consent: consentField,
  honeypot: honeypotField,
  ...utmFields,
});

export const inquiryFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: optionalPhoneField,
  inquiryType: z.enum([
    "general",
    "quote",
    "booking",
    "corporate",
    "feedback",
    "other",
  ]),
  pickup: z.string().trim().max(500).optional().or(z.literal("")),
  destination: z.string().trim().max(500).optional().or(z.literal("")),
  preferredDateTime: z.string().trim().max(80).optional().or(z.literal("")),
  message: messageField,
  consent: consentField,
  honeypot: honeypotField,
  ...utmFields,
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type InquiryFormInput = z.infer<typeof inquiryFormSchema>;
