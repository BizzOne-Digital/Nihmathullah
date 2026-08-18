import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(254, "Email is too long")
  .transform((value) => value.toLowerCase());

export const phoneField = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .regex(
    /^[\d\s().+-]+$/,
    "Phone number may only contain digits and common formatting characters"
  );

export const optionalPhoneField = z
  .string()
  .trim()
  .max(20, "Phone number is too long")
  .regex(
    /^[\d\s().+-]*$/,
    "Phone number may only contain digits and common formatting characters"
  )
  .optional()
  .or(z.literal(""));

export const slugField = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers, and hyphens only"
  );

export const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(120, "Name is too long");

export const messageField = z
  .string()
  .trim()
  .min(1, "Message is required")
  .max(5000, "Message is too long");

export const consentField = z.literal(true, {
  errorMap: () => ({ message: "You must agree to continue" }),
});

export const honeypotField = z
  .string()
  .max(0, "Invalid submission")
  .optional()
  .or(z.literal(""));

export const urlField = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .max(2048, "URL is too long");

export const optionalUrlField = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .max(2048, "URL is too long")
  .optional()
  .or(z.literal(""));

export const mongoIdField = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const mediaItemSchema = z.object({
  url: z.string().trim().min(1, "Media URL is required").max(2048),
  alt: z.string().trim().min(1, "Alt text is required").max(200),
  title: z.string().trim().max(200).optional(),
  caption: z.string().trim().max(500).optional(),
});

export const ctaLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(80),
  href: z.string().trim().min(1, "Link is required").max(2048),
});

export const seoFieldsSchema = z.object({
  title: z.string().trim().max(120).optional(),
  description: z.string().trim().max(320).optional(),
  socialImage: z.string().trim().max(2048).optional(),
  canonical: z.string().trim().max(2048).optional(),
  noIndex: z.boolean().optional(),
});

export const utmFields = {
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  referrer: z.string().trim().max(500).optional(),
};
