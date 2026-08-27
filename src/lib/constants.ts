export const BRAND = {
  obsidian: "#060807",
  richBlack: "#0C0E0D",
  charcoal: "#181A19",
  deepBronze: "#706246",
  antiqueGold: "#AC9461",
  signatureGold: "#D0AF6F",
  champagne: "#E2C179",
  ivory: "#F5EFE5",
  white: "#FFFFFF",
  mutedSilver: "#A7AAA7",
} as const;

export const SITE_NAME = "SierraLink Executive Transportation LLC";
export const SITE_SHORT_NAME = "SierraLink";

export const BOOKING_STATUSES = [
  "New",
  "Needs Quote",
  "Quoted",
  "Customer Accepted",
  "Confirmed",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
  "Archived",
] as const;

export const QUOTE_STATUSES = [
  "Draft",
  "Sent/Shared",
  "Viewed",
  "Accepted",
  "Declined",
  "Expired",
  "Superseded",
  "Cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "Not Requested",
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
  "Partially Refunded",
  "Cancelled",
] as const;

export const FAQ_CATEGORIES = [
  "Booking",
  "Airport Travel",
  "Local Rides",
  "Long-Distance Travel",
  "Executive/Corporate",
  "Pricing & Payment",
  "Luggage/Special Requests",
  "Cancellations",
] as const;

export const UPLOAD_DIRS = [
  "pages",
  "services",
  "service-areas",
  "fleet",
  "gallery",
  "testimonials",
  "blogs",
  "settings",
] as const;

export type UploadDir = (typeof UPLOAD_DIRS)[number];

/** MongoDB-backed upload folders (serverless-safe). */
export const STORED_UPLOAD_FOLDERS = [
  "products",
  "gallery",
  "pages",
  "misc",
] as const;

export type StoredUploadFolder = (typeof STORED_UPLOAD_FOLDERS)[number];

export const STORED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const STORED_MAX_UPLOAD_SIZE = 8 * 1024 * 1024; // 8MB

/** Maps legacy admin upload directories to MongoDB stored folders. */
export const UPLOAD_DIR_TO_STORED_FOLDER: Record<UploadDir, StoredUploadFolder> =
  {
    pages: "pages",
    gallery: "gallery",
    fleet: "products",
    services: "products",
    "service-areas": "misc",
    testimonials: "misc",
    blogs: "misc",
    settings: "misc",
  };

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

export const PAGE_SLUGS = [
  "home",
  "about",
  "services",
  "fleet",
  "service-areas",
  "gallery",
  "testimonials",
  "faqs",
  "booking",
  "contact",
  "blog",
  "privacy-policy",
  "terms",
] as const;

export type PageSlug = (typeof PAGE_SLUGS)[number];
