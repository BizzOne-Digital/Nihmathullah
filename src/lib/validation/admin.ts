import { z } from "zod";
import {
  BOOKING_STATUSES,
  FAQ_CATEGORIES,
  PAGE_SLUGS,
  QUOTE_STATUSES,
  UPLOAD_DIRS,
} from "@/lib/constants";
import { INQUIRY_STATUSES } from "@/models/Inquiry";
import {
  ctaLinkSchema,
  emailField,
  mediaItemSchema,
  mongoIdField,
  nameField,
  seoFieldsSchema,
  slugField,
} from "./common";

export const adminLoginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export const pageSectionSchema = z.object({
  key: z.string().trim().min(1).max(80),
  type: z.string().trim().min(1).max(80),
  adminLabel: z.string().trim().min(1).max(120),
  eyebrow: z.string().trim().max(120).optional(),
  heading: z.string().trim().max(200).optional(),
  subheading: z.string().trim().max(300).optional(),
  body: z.string().trim().max(10000).optional(),
  items: z.array(z.record(z.unknown())).optional(),
  primaryMedia: mediaItemSchema.optional(),
  media: z.array(mediaItemSchema).optional(),
  primaryCta: ctaLinkSchema.optional(),
  secondaryCta: ctaLinkSchema.optional(),
  layout: z.string().trim().max(80).optional(),
  theme: z.enum(["black", "charcoal", "gold", "ivory", "white"]).optional(),
  visible: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export const pageUpdateSchema = z.object({
  slug: z.enum(PAGE_SLUGS),
  title: z.string().trim().min(1, "Title is required").max(200),
  hero: z
    .object({
      eyebrow: z.string().trim().max(120).optional(),
      heading: z.string().trim().max(200).optional(),
      subheading: z.string().trim().max(300).optional(),
      backgroundImage: mediaItemSchema.optional(),
    })
    .optional(),
  sections: z.array(pageSectionSchema).default([]),
  seo: seoFieldsSchema.optional(),
  published: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export const serviceListingUpdateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugField,
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(500),
  mainImage: mediaItemSchema.optional(),
  icon: z.string().trim().max(80).optional(),
  features: z.array(z.string().trim().min(1).max(200)).max(20).optional(),
  cta: ctaLinkSchema.optional(),
  published: z.boolean(),
  order: z.coerce.number().int().min(0),
  seo: seoFieldsSchema.optional(),
});

export const serviceDetailSectionSchema = z.object({
  type: z.string().trim().min(1).max(80),
  heading: z.string().trim().max(200).optional(),
  subheading: z.string().trim().max(300).optional(),
  body: z.string().trim().max(10000).optional(),
  items: z.array(z.record(z.unknown())).optional(),
  media: z.array(mediaItemSchema).optional(),
  primaryCta: ctaLinkSchema.optional(),
  layout: z.string().trim().max(80).optional(),
  theme: z.enum(["black", "charcoal", "gold", "ivory", "white"]).optional(),
  visible: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export const serviceUpdateSchema = z.object({
  listing: serviceListingUpdateSchema,
  detailPage: z
    .object({
      hero: z
        .object({
          eyebrow: z.string().trim().max(120).optional(),
          heading: z.string().trim().max(200).optional(),
          subheading: z.string().trim().max(300).optional(),
          backgroundImage: mediaItemSchema.optional(),
        })
        .optional(),
      sections: z.array(serviceDetailSectionSchema).default([]),
      relatedServiceAreas: z.array(z.string().trim().min(1).max(120)).optional(),
      relatedFleetIds: z.array(mongoIdField).optional(),
      relatedFaqIds: z.array(mongoIdField).optional(),
      seo: seoFieldsSchema.optional(),
    })
    .default({ sections: [] }),
  archived: z.boolean().optional(),
});

export const siteSettingsUpdateSchema = z.object({
  businessName: z.string().trim().min(1).max(200),
  shortName: z.string().trim().min(1).max(80),
  headline: z.string().trim().min(1).max(300),
  primaryEmail: emailField,
  primaryPhoneDisplay: z.string().trim().min(1).max(40),
  primaryPhoneLink: z.string().trim().min(1).max(40),
  alternatePhoneDisplay: z.string().trim().max(40).optional().or(z.literal("")),
  alternatePhoneLink: z.string().trim().max(40).optional().or(z.literal("")),
  serviceAreaText: z.string().trim().min(1).max(500),
  aboutStatement: z.string().trim().min(1).max(2000),
  publicPricingStatement: z.string().trim().min(1).max(1000),
  logoUrl: z.string().trim().min(1).max(2048),
  faviconUrl: z.string().trim().max(2048).optional().or(z.literal("")),
  streetAddress: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  state: z.string().trim().max(80).optional().or(z.literal("")),
  zip: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  geoLat: z.coerce.number().min(-90).max(90).optional(),
  geoLng: z.coerce.number().min(-180).max(180).optional(),
  businessHours: z.string().trim().max(500).optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().trim().min(1).max(80),
        url: z.string().trim().min(1).max(2048),
      })
    )
    .optional(),
  headerCtas: z
    .object({
      callLabel: z.string().trim().min(1).max(80),
      quoteLabel: z.string().trim().min(1).max(80),
      bookLabel: z.string().trim().min(1).max(80),
    })
    .optional(),
  footerCopy: z.string().trim().max(1000).optional().or(z.literal("")),
  footerNav: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        href: z.string().trim().min(1).max(2048),
      })
    )
    .optional(),
  operationalClaims: z
    .object({
      availability247: z.boolean().optional(),
      flightMonitoring: z.boolean().optional(),
      meetAndGreet: z.boolean().optional(),
      licensedInsured: z.boolean().optional(),
      licensedInsuredText: z.string().trim().max(500).optional(),
      yearsInBusiness: z.coerce.number().int().min(0).optional(),
      chauffeurTraining: z.boolean().optional(),
      chauffeurTrainingText: z.string().trim().max(500).optional(),
    })
    .optional(),
  airports: z
    .array(
      z.object({
        code: z.string().trim().min(2).max(10),
        name: z.string().trim().min(1).max(200),
        description: z.string().trim().max(500).optional(),
      })
    )
    .optional(),
  bookingConfirmationText: z.string().trim().max(2000).optional().or(z.literal("")),
  introAnimationEnabled: z.boolean().optional(),
  analyticsId: z.string().trim().max(120).optional().or(z.literal("")),
  analyticsConsentRequired: z.boolean().optional(),
  copyrightText: z.string().trim().max(500).optional().or(z.literal("")),
});

export const pricingSettingsUpdateSchema = z
  .object({
    publicPricingStatement: z.string().trim().min(1).max(1000),
    showPublicPricing: z.boolean(),
    currency: z
      .string()
      .trim()
      .length(3, "Currency must be a 3-letter code")
      .transform((value) => value.toUpperCase()),
    taxLabel: z.string().trim().max(80).optional().or(z.literal("")),
    taxRate: z.coerce.number().min(0).max(1).optional(),
    feeLabel: z.string().trim().max(80).optional().or(z.literal("")),
    feeRate: z.coerce.number().min(0).max(1).optional(),
    defaultQuoteExpirationDays: z.coerce.number().int().min(1).max(365),
    depositMode: z.enum(["none", "fixed", "percentage", "full"]),
    depositFixedAmount: z.coerce.number().min(0).optional(),
    depositPercentage: z.coerce.number().min(0).max(100).optional(),
    paymentEnabled: z.boolean(),
    cancellationPolicy: z.string().trim().max(5000).optional().or(z.literal("")),
    cancellationPolicyPublished: z.boolean(),
    refundPolicy: z.string().trim().max(5000).optional().or(z.literal("")),
    refundPolicyPublished: z.boolean(),
    specialOffersEnabled: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.depositMode === "fixed" && data.depositFixedAmount == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fixed deposit amount is required",
        path: ["depositFixedAmount"],
      });
    }

    if (data.depositMode === "percentage" && data.depositPercentage == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deposit percentage is required",
        path: ["depositPercentage"],
      });
    }
  });

export const quoteLineItemSchema = z.object({
  label: z.string().trim().min(1, "Line item label is required").max(200),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  amount: z.coerce
    .number()
    .int("Amount must be in cents")
    .min(0, "Amount cannot be negative"),
});

export const quoteCreateSchema = z.object({
  bookingId: mongoIdField,
  lineItems: z.array(quoteLineItemSchema).min(1, "At least one line item is required"),
  customerNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  internalNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(QUOTE_STATUSES).default("Draft"),
  expiresAt: z.coerce.date().optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  internalNotes: z.string().trim().max(5000).optional().or(z.literal("")),
  assignedVehicle: z.string().trim().max(120).optional().or(z.literal("")),
  assignedDriver: z.string().trim().max(120).optional().or(z.literal("")),
});

export const inquiryUpdateSchema = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  internalNotes: z.string().trim().max(5000).optional().or(z.literal("")),
});

export const quoteUpdateSchema = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  customerNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  internalNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  lineItems: z.array(quoteLineItemSchema).min(1).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const checkoutSchema = z.object({
  token: z.string().trim().min(1, "Quote token is required"),
});

export const faqCreateSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(10000),
  category: z.enum(FAQ_CATEGORIES),
  relatedServiceIds: z.array(mongoIdField).optional(),
  published: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});

export const faqUpdateSchema = faqCreateSchema.partial().extend({
  id: mongoIdField,
});

export const testimonialCreateSchema = z.object({
  customerName: nameField,
  company: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  quote: z.string().trim().min(1).max(2000),
  image: mediaItemSchema.optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  serviceId: mongoIdField.optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});

export const testimonialUpdateSchema = testimonialCreateSchema
  .partial()
  .extend({ id: mongoIdField });

export const vehicleCreateSchema = z.object({
  displayName: z.string().trim().min(1).max(200),
  make: z.string().trim().max(80).optional().or(z.literal("")),
  model: z.string().trim().max(80).optional().or(z.literal("")),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  category: z.enum(["sedan", "suv", "van", "sprinter", "luxury", "other"]),
  passengerCapacity: z.coerce.number().int().min(1).optional(),
  luggageGuidance: z.string().trim().max(500).optional().or(z.literal("")),
  amenities: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
  primaryImage: mediaItemSchema.optional(),
  gallery: z.array(mediaItemSchema).max(20).optional(),
  relatedServices: z.array(mongoIdField).optional(),
  published: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  isIllustrative: z.boolean().default(true),
});

export const vehicleUpdateSchema = vehicleCreateSchema
  .partial()
  .extend({ id: mongoIdField });

export const galleryCategoryCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: slugField,
  description: z.string().trim().max(500).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(false),
});

export const galleryCategoryUpdateSchema = galleryCategoryCreateSchema
  .partial()
  .extend({ id: mongoIdField });

export const galleryImageCreateSchema = z.object({
  title: z.string().trim().max(200).optional().or(z.literal("")),
  caption: z.string().trim().max(500).optional().or(z.literal("")),
  alt: z.string().trim().min(1).max(200),
  url: z.string().trim().min(1).max(2048),
  categoryId: mongoIdField,
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});

export const galleryImageUpdateSchema = galleryImageCreateSchema
  .partial()
  .extend({ id: mongoIdField });

export const blogPostCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: slugField,
  excerpt: z.string().trim().min(1).max(500),
  contentBlocks: z
    .array(
      z.object({
        type: z.enum(["paragraph", "heading", "list", "image", "quote"]),
        content: z.string().max(10000).optional(),
        items: z.array(z.string().max(2000)).optional(),
        media: mediaItemSchema.optional(),
        level: z.coerce.number().int().min(1).max(6).optional(),
      })
    )
    .default([]),
  featuredImage: mediaItemSchema.optional(),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  authorDisplay: z.string().trim().max(120).optional().or(z.literal("")),
  publishDate: z.coerce.date().optional(),
  draft: z.boolean().default(true),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  seo: seoFieldsSchema.optional(),
});

export const blogPostUpdateSchema = blogPostCreateSchema
  .partial()
  .extend({ id: mongoIdField });

export const serviceAreaCreateSchema = z.object({
  city: z.string().trim().min(1).max(120),
  slug: slugField,
  shortSummary: z.string().trim().min(1).max(500),
  sections: z.array(pageSectionSchema).default([]),
  relatedServices: z.array(mongoIdField).optional(),
  image: mediaItemSchema.optional(),
  published: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  seo: seoFieldsSchema.optional(),
  allowIndexing: z.boolean().default(true),
});

export const serviceAreaUpdateSchema = serviceAreaCreateSchema
  .partial()
  .extend({ id: mongoIdField });

export const uploadSchema = z.object({
  directory: z.enum(UPLOAD_DIRS),
});

export const uploadDeleteSchema = z.object({
  url: z.string().trim().min(1).max(2048),
});

export const idParamSchema = z.object({ id: mongoIdField });

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type PageUpdateInput = z.infer<typeof pageUpdateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
export type SiteSettingsUpdateInput = z.infer<typeof siteSettingsUpdateSchema>;
export type PricingSettingsUpdateInput = z.infer<typeof pricingSettingsUpdateSchema>;
export type QuoteCreateInput = z.infer<typeof quoteCreateSchema>;
