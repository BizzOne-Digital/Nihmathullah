"use client";

import { useEffect, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
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
  { value: "private-car", label: "Private Car Service" },
  { value: "hourly", label: "Hourly / As Directed" },
];

export interface BookingVehicleOption {
  id: string;
  name: string;
}

interface BookingFormProps {
  initialValues?: Partial<BookingFormInput>;
  confirmationText?: string;
  vehicles?: BookingVehicleOption[];
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
  durationHours: 3,
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
  vehiclePreference: "",
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
  initialValues,
  confirmationText,
  vehicles = [],
}: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [reference, setReference] = useState("");

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      ...defaultFormValues,
      timezone: getTimezone(),
      ...initialValues,
      mode: "booking",
    },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const tripStructure = watch("tripStructure");
  const rideType = watch("rideType");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && !initialValues?.pickupAddress) {
        const parsed = JSON.parse(saved) as Partial<BookingFormInput>;
        reset({ ...defaultFormValues, mode: "booking", ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, [initialValues?.pickupAddress, reset]);

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

  useEffect(() => {
    if (tripStructure === "hourly") {
      setValue("rideType", "hourly");
    }
  }, [tripStructure, setValue]);

  const inputClass =
    "w-full rounded-sm border border-antique-gold/20 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-muted-silver focus:outline-none focus:ring-2 focus:ring-signature-gold/50";

  const onInvalid = (fieldErrors: FieldErrors<BookingFormInput>) => {
    setValidationMessage(
      "Please complete the required fields below before submitting your request."
    );
    const firstField = Object.keys(fieldErrors)[0];
    if (firstField) {
      const el = document.querySelector<HTMLElement>(
        `[name="${firstField}"], #booking-${firstField}`
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    }
  };

  const onSubmit = async (data: BookingFormInput) => {
    setStatus("loading");
    setErrorMessage("");
    setValidationMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          mode: "booking",
          destinationAddress:
            data.tripStructure === "hourly"
              ? "As directed"
              : data.destinationAddress,
          referrer: document.referrer,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to submit request");
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
          Booking Request Received
        </h3>
        {reference && (
          <p className="mt-2 text-ivory">
            Reference: <span className="font-mono text-signature-gold">{reference}</span>
          </p>
        )}
        <p className="mt-4 text-muted-silver">
          {confirmationText ||
            "Thank you. We received your request and will contact you by email or phone to confirm availability, pricing, and payment. This is not a confirmed reservation yet."}
        </p>
        <p className="mt-3 text-sm text-muted-silver">
          A confirmation email has been sent to the address you provided.
        </p>
      </div>
    );
  }

  const showFlightFields = rideType === "airport";

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-8"
      noValidate
    >
      <input
        type="text"
        {...register("honeypot")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="rounded-sm border border-antique-gold/20 bg-obsidian/30 px-4 py-3 text-sm text-muted-silver">
        Submit a <strong className="text-ivory">booking request</strong> — no account
        required. This is not an instant confirmation or online payment. We will
        contact you to confirm availability, price, and payment details.
      </div>

      {validationMessage && (
        <div
          role="alert"
          className="rounded-sm border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-300"
        >
          {validationMessage}
        </div>
      )}

      <FormSection title="Trip details">
        <div className="mb-4 flex rounded-sm border border-antique-gold/20 bg-obsidian/40 p-1">
          <StructureTab
            active={tripStructure === "one-way"}
            onClick={() => setValue("tripStructure", "one-way")}
          >
            One way
          </StructureTab>
          <StructureTab
            active={tripStructure === "hourly"}
            onClick={() => setValue("tripStructure", "hourly")}
          >
            By the hour
          </StructureTab>
          <StructureTab
            active={tripStructure === "round-trip"}
            onClick={() => setValue("tripStructure", "round-trip")}
          >
            Round trip
          </StructureTab>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Service type" error={errors.rideType?.message}>
            <select
              {...register("rideType")}
              className={inputClass}
              disabled={tripStructure === "hourly"}
            >
              {RIDE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Preferred vehicle">
            <select {...register("vehiclePreference")} className={inputClass}>
              <option value="">No preference</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.name}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Pickup location" error={errors.pickupAddress?.message}>
            <input type="text" {...register("pickupAddress")} className={inputClass} />
          </Field>

          {tripStructure === "one-way" || tripStructure === "round-trip" ? (
            <Field label="Destination" error={errors.destinationAddress?.message}>
              <input type="text" {...register("destinationAddress")} className={inputClass} />
            </Field>
          ) : (
            <Field label="Hours needed" error={errors.durationHours?.message}>
              <select {...register("durationHours")} className={inputClass}>
                {[2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                  <option key={h} value={h}>
                    {h} hours
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Date" error={errors.pickupDate?.message}>
            <input type="date" {...register("pickupDate")} className={inputClass} />
          </Field>
          <Field label="Pickup time" error={errors.pickupTime?.message}>
            <input type="time" {...register("pickupTime")} className={inputClass} />
          </Field>

          <Field label="Passengers" error={errors.passengerCount?.message}>
            <input type="number" min={1} {...register("passengerCount")} className={inputClass} />
          </Field>
          <Field label="Luggage pieces" error={errors.luggageCount?.message}>
            <input type="number" min={0} {...register("luggageCount")} className={inputClass} />
          </Field>
        </div>

        {tripStructure === "round-trip" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Return date" error={errors.returnDate?.message}>
              <input type="date" {...register("returnDate")} className={inputClass} />
            </Field>
            <Field label="Return time" error={errors.returnTime?.message}>
              <input type="time" {...register("returnTime")} className={inputClass} />
            </Field>
          </div>
        )}
      </FormSection>

      {showFlightFields && (
        <FormSection title="Flight details (if applicable)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Airport code">
              <input
                type="text"
                {...register("airportCode")}
                placeholder="ALB or JFK"
                className={inputClass}
              />
            </Field>
            <Field label="Flight type">
              <select {...register("flightType")} className={inputClass}>
                <option value="">Select</option>
                <option value="arrival">Arrival</option>
                <option value="departure">Departure</option>
              </select>
            </Field>
            <Field label="Airline">
              <input type="text" {...register("airline")} className={inputClass} />
            </Field>
            <Field label="Flight number">
              <input type="text" {...register("flightNumber")} className={inputClass} />
            </Field>
          </div>
        </FormSection>
      )}

      <FormSection title="Your contact information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.contactName?.message}>
            <input type="text" {...register("contactName")} className={inputClass} />
          </Field>
          <Field label="Phone" error={errors.contactPhone?.message}>
            <input type="tel" {...register("contactPhone")} className={inputClass} />
          </Field>
          <Field label="Email" error={errors.contactEmail?.message} className="sm:col-span-2">
            <input type="email" {...register("contactEmail")} className={inputClass} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Notes (optional)">
            <textarea
              rows={4}
              {...register("specialInstructions")}
              placeholder="Special instructions, child seats, accessibility needs, etc."
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      <div className="flex items-start gap-3">
        <input
          id="booking-consent"
          type="checkbox"
          {...register("consent")}
          className="mt-1 h-4 w-4 rounded border-antique-gold/30"
          aria-invalid={errors.consent ? true : undefined}
        />
        <label htmlFor="booking-consent" className="text-sm text-muted-silver">
          I agree to be contacted about this booking request and understand my
          information will be handled per the privacy policy.
        </label>
      </div>
      {errors.consent && <p className="text-sm text-red-400">{errors.consent.message}</p>}

      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        {status === "loading" ? "Submitting request..." : "Submit Booking Request"}
      </Button>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-antique-gold/15 bg-charcoal/20 p-5 md:p-6">
      <h3 className="mb-4 font-display text-xl text-ivory">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function StructureTab({
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
        "flex-1 rounded-sm px-3 py-2 text-sm font-semibold transition-colors",
        active ? "bg-signature-gold text-obsidian" : "text-muted-silver hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}
