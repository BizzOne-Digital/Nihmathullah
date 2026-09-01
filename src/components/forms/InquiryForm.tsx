"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquiryFormSchema, type InquiryFormInput } from "@/lib/validation/booking";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface InquiryFormProps {
  className?: string;
  defaultInquiryType?: InquiryFormInput["inquiryType"];
}

const INQUIRY_TYPES: Array<{ value: InquiryFormInput["inquiryType"]; label: string }> = [
  { value: "general", label: "General Inquiry" },
  { value: "quote", label: "Quote Request" },
  { value: "booking", label: "Booking Question" },
  { value: "corporate", label: "Corporate / Executive" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

export function InquiryForm({ className, defaultInquiryType = "general" }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InquiryFormInput>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiryType: defaultInquiryType,
      pickup: "",
      destination: "",
      preferredDateTime: "",
      message: "",
      consent: undefined,
      honeypot: "",
    },
  });

  const inquiryType = watch("inquiryType");
  const showTripFields = inquiryType === "quote" || inquiryType === "booking";

  const onSubmit = async (data: InquiryFormInput) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          referrer: document.referrer,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to submit inquiry");
      }

      setStatus("success");
      reset({ inquiryType: defaultInquiryType });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClass =
    "w-full rounded-sm border border-antique-gold/20 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-muted-silver focus:outline-none focus:ring-2 focus:ring-signature-gold/50";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)} noValidate>
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div>
        <label htmlFor="inquiry-type" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
          Inquiry Type
        </label>
        <select id="inquiry-type" {...register("inquiryType")} className={inputClass}>
          {INQUIRY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inquiry-name" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
            Name
          </label>
          <input id="inquiry-name" type="text" {...register("name")} className={inputClass} />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="inquiry-email" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
            Email
          </label>
          <input id="inquiry-email" type="email" {...register("email")} className={inputClass} />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="inquiry-phone" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
          Phone (optional)
        </label>
        <input id="inquiry-phone" type="tel" {...register("phone")} className={inputClass} />
      </div>

      {showTripFields && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry-pickup" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
              Pickup
            </label>
            <input id="inquiry-pickup" type="text" {...register("pickup")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="inquiry-destination" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
              Destination
            </label>
            <input id="inquiry-destination" type="text" {...register("destination")} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="inquiry-datetime" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
              Preferred Date / Time
            </label>
            <input id="inquiry-datetime" type="text" {...register("preferredDateTime")} className={inputClass} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="inquiry-message" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
          Message
        </label>
        <textarea id="inquiry-message" rows={5} {...register("message")} className={inputClass} />
        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="inquiry-consent"
          type="checkbox"
          {...register("consent")}
          className="mt-1 h-4 w-4 rounded border-antique-gold/30 bg-charcoal text-signature-gold"
        />
        <label htmlFor="inquiry-consent" className="text-sm text-muted-silver">
          I agree to be contacted about my inquiry.
        </label>
      </div>
      {errors.consent && <p className="text-sm text-red-400">{errors.consent.message}</p>}

      {status === "success" && (
        <p className="text-sm text-signature-gold">
          Thank you — we received your inquiry. Check your email for a confirmation message.
        </p>
      )}
      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <Button type="submit" variant="gold" magnetic disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
