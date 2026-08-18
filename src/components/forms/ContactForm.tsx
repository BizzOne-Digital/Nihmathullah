"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation/booking";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: undefined,
      honeypot: "",
    },
  });

  const onSubmit = async (data: ContactFormInput) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          referrer: document.referrer,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClass =
    "w-full rounded-sm border border-antique-gold/20 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-muted-silver focus:outline-none focus:ring-2 focus:ring-signature-gold/50";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)} noValidate>
      <input
        type="text"
        {...register("honeypot")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="contact-name" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
          Name
        </label>
        <input id="contact-name" type="text" {...register("name")} className={inputClass} />
        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
            Email
          </label>
          <input id="contact-email" type="email" {...register("email")} className={inputClass} />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
            Phone (optional)
          </label>
          <input id="contact-phone" type="tel" {...register("phone")} className={inputClass} />
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-xs font-medium uppercase tracking-wider text-signature-gold">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          className={inputClass}
        />
        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="contact-consent"
          type="checkbox"
          {...register("consent")}
          className="mt-1 h-4 w-4 rounded border-antique-gold/30 bg-charcoal text-signature-gold focus:ring-signature-gold"
        />
        <label htmlFor="contact-consent" className="text-sm text-muted-silver">
          I agree to be contacted about my inquiry and understand my information will be handled per the privacy policy.
        </label>
      </div>
      {errors.consent && <p className="text-sm text-red-400">{errors.consent.message}</p>}

      {status === "success" && (
        <p className="text-sm text-signature-gold">Thank you — your message has been sent.</p>
      )}
      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <Button type="submit" variant="gold" magnetic disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
