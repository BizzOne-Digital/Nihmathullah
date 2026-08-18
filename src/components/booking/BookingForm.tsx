"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingFormSchema, type BookingFormInput } from "@/lib/validation/booking";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sierralink-booking-form";

const RIDE_TYPES = [
  { value: "airport", label: "Airport Transfer" },
  { value: "local", label: "Local Ride" },
  { value: "long-distance", label: "Long Distance" },
  { value: "executive", label: "Executive" },
  { value: "corporate", label: "Corporate" },
  { value: "hourly", label: "Hourly / As Directed" },
  { value: "other", label: "Other" },
];

const STEPS = ["Trip Details", "Passengers", "Contact", "Review"];

interface BookingFormProps {
  defaultMode?: "booking" | "quote";
  initialValues?: Partial<BookingFormInput>;
  confirmationText?: string;
}

function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}

const defaultFormValues: BookingFormInput = {
  mode: "booking",
  rideType: "airport",
  tripStructure: "one-way",
  pickupAddress: "",
  destinationAddress: "",
  stops: [],
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  timezone: getTimezone(),
  airportCode: "",
  flightType: undefined,
  airline: "",
  flightNumber: "",
  passengerCount: 1,
  luggageCount: 0,
  childSeatRequest: false,
  accessibilityRequest: false,
  specialAssistance: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  company: "",
  preferredContact: "either",
  specialInstructions: "",
  consent: undefined as unknown as true,
  honeypot: "",
};

export function BookingForm({
  defaultMode = "booking",
  initialValues,
  confirmationText,
}: BookingFormProps) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reference, setReference] = useState("");

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      ...defaultFormValues,
      mode: defaultMode,
      timezone: getTimezone(),
      ...initialValues,
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = form;

  const mode = watch("mode");
  const tripStructure = watch("tripStructure");
  const rideType = watch("rideType");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<BookingFormInput>;
        reset({ ...defaultFormValues, mode: defaultMode, ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, [defaultMode, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        /* ignore */
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const inputClass =
    "w-full rounded-sm border border-antique-gold/20 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-muted-silver focus:outline-none focus:ring-2 focus:ring-signature-gold/50";

  const stepFields: Record<number, (keyof BookingFormInput)[]> = {
    0: ["rideType", "tripStructure", "pickupAddress", "destinationAddress", "pickupDate", "pickupTime", "returnDate", "returnTime"],
    1: ["passengerCount", "luggageCount"],
    2: ["contactName", "contactEmail", "contactPhone", "preferredContact"],
    3: ["consent"],
  };

  const goNext = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: BookingFormInput) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          referrer: document.referrer,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to submit booking");
      }

      const body = await res.json();
      setReference(body.reference || "");
      setStatus("success");
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-signature-gold/30 bg-charcoal/40 p-8 text-center">
        <h3 className="font-display text-2xl text-signature-gold">
          {mode === "quote" ? "Quote Request Received" : "Booking Submitted"}
        </h3>
        {reference && (
          <p className="mt-2 text-ivory">
            Reference: <span className="font-mono text-signature-gold">{reference}</span>
          </p>
        )}
        <p className="mt-4 text-muted-silver">
          {confirmationText ||
            "Thank you. Our team will review your request and contact you with confirmation or a quote."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="flex gap-2 border-b border-antique-gold/20 pb-4">
        <button
          type="button"
          onClick={() => form.setValue("mode", "booking")}
          className={cn(
            "rounded-sm px-4 py-2 text-sm font-medium transition-colors",
            mode === "booking" ? "bg-signature-gold text-obsidian" : "text-muted-silver hover:text-ivory"
          )}
        >
          Book a Ride
        </button>
        <button
          type="button"
          onClick={() => form.setValue("mode", "quote")}
          className={cn(
            "rounded-sm px-4 py-2 text-sm font-medium transition-colors",
            mode === "quote" ? "bg-signature-gold text-obsidian" : "text-muted-silver hover:text-ivory"
          )}
        >
          Request a Quote
        </button>
      </div>

      <div className="flex gap-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "flex-1 rounded-sm py-2 text-center text-xs font-medium uppercase tracking-wider",
              i === step ? "bg-signature-gold/20 text-signature-gold" : "text-muted-silver",
              i < step && "text-signature-gold/70"
            )}
          >
            {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Ride Type</label>
              <select {...register("rideType")} className={inputClass}>
                {RIDE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Trip Type</label>
              <select {...register("tripStructure")} className={inputClass}>
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Pickup Address</label>
              <input type="text" {...register("pickupAddress")} className={inputClass} />
              {errors.pickupAddress && <p className="mt-1 text-sm text-red-400">{errors.pickupAddress.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Destination</label>
              <input type="text" {...register("destinationAddress")} className={inputClass} />
              {errors.destinationAddress && <p className="mt-1 text-sm text-red-400">{errors.destinationAddress.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Pickup Date</label>
              <input type="date" {...register("pickupDate")} className={inputClass} />
              {errors.pickupDate && <p className="mt-1 text-sm text-red-400">{errors.pickupDate.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Pickup Time</label>
              <input type="time" {...register("pickupTime")} className={inputClass} />
              {errors.pickupTime && <p className="mt-1 text-sm text-red-400">{errors.pickupTime.message}</p>}
            </div>
          </div>

          {tripStructure === "round-trip" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Return Date</label>
                <input type="date" {...register("returnDate")} className={inputClass} />
                {errors.returnDate && <p className="mt-1 text-sm text-red-400">{errors.returnDate.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Return Time</label>
                <input type="time" {...register("returnTime")} className={inputClass} />
                {errors.returnTime && <p className="mt-1 text-sm text-red-400">{errors.returnTime.message}</p>}
              </div>
            </div>
          )}

          {rideType === "airport" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Airport Code</label>
                <input type="text" {...register("airportCode")} placeholder="ALB" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Flight Type</label>
                <select {...register("flightType")} className={inputClass}>
                  <option value="">Select</option>
                  <option value="arrival">Arrival</option>
                  <option value="departure">Departure</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Flight Number</label>
                <input type="text" {...register("flightNumber")} className={inputClass} />
              </div>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Passengers</label>
              <input type="number" min={1} {...register("passengerCount")} className={inputClass} />
              {errors.passengerCount && <p className="mt-1 text-sm text-red-400">{errors.passengerCount.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Luggage Pieces</label>
              <input type="number" min={0} {...register("luggageCount")} className={inputClass} />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-muted-silver">
              <input type="checkbox" {...register("childSeatRequest")} className="rounded border-antique-gold/30" />
              Child seat needed
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-silver">
              <input type="checkbox" {...register("accessibilityRequest")} className="rounded border-antique-gold/30" />
              Accessibility assistance
            </label>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Special Assistance</label>
            <textarea rows={3} {...register("specialAssistance")} className={inputClass} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Full Name</label>
              <input type="text" {...register("contactName")} className={inputClass} />
              {errors.contactName && <p className="mt-1 text-sm text-red-400">{errors.contactName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Company (optional)</label>
              <input type="text" {...register("company")} className={inputClass} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Email</label>
              <input type="email" {...register("contactEmail")} className={inputClass} />
              {errors.contactEmail && <p className="mt-1 text-sm text-red-400">{errors.contactEmail.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Phone</label>
              <input type="tel" {...register("contactPhone")} className={inputClass} />
              {errors.contactPhone && <p className="mt-1 text-sm text-red-400">{errors.contactPhone.message}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Preferred Contact</label>
            <select {...register("preferredContact")} className={inputClass}>
              <option value="either">Either</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">Special Instructions</label>
            <textarea rows={4} {...register("specialInstructions")} className={inputClass} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-sm border border-antique-gold/20 bg-charcoal/30 p-6 text-sm text-muted-silver space-y-2">
            <p><span className="text-signature-gold">Mode:</span> {mode === "quote" ? "Quote Request" : "Booking"}</p>
            <p><span className="text-signature-gold">Ride:</span> {rideType} — {tripStructure}</p>
            <p><span className="text-signature-gold">From:</span> {watch("pickupAddress")}</p>
            <p><span className="text-signature-gold">To:</span> {watch("destinationAddress")}</p>
            <p><span className="text-signature-gold">When:</span> {watch("pickupDate")} {watch("pickupTime")}</p>
            <p><span className="text-signature-gold">Contact:</span> {watch("contactName")} — {watch("contactEmail")}</p>
          </div>
          <div className="flex items-start gap-3">
            <input
              id="booking-consent"
              type="checkbox"
              {...register("consent")}
              className="mt-1 h-4 w-4 rounded border-antique-gold/30"
            />
            <label htmlFor="booking-consent" className="text-sm text-muted-silver">
              I agree to be contacted about this request and understand my information will be handled per the privacy policy.
            </label>
          </div>
          {errors.consent && <p className="text-sm text-red-400">{errors.consent.message}</p>}
        </div>
      )}

      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <div className="flex justify-between gap-4">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={goPrev}>Back</Button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <Button type="button" variant="gold" onClick={goNext} magnetic>Continue</Button>
        ) : (
          <Button type="submit" variant="gold" magnetic disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : mode === "quote" ? "Submit Quote Request" : "Submit Booking"}
          </Button>
        )}
      </div>
    </form>
  );
}
