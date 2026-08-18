import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import type { CtaLink, MediaItem, PageHero, PageSection } from "@/types";

const ROOT = resolve(__dirname, "../..");

export function loadEnv(): void {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export function log(step: string, detail?: string): void {
  const msg = detail ? `[seed] ${step}: ${detail}` : `[seed] ${step}`;
  console.log(msg);
}

export function img(
  path: string,
  alt: string,
  title?: string,
  caption?: string
): MediaItem {
  return { url: path, alt, title, caption };
}

export function cta(label: string, href: string): CtaLink {
  return { label, href };
}

export function hero(
  heading: string,
  opts?: Partial<PageHero>
): PageHero {
  return { heading, ...opts };
}

export function section(
  key: string,
  type: PageSection["type"],
  adminLabel: string,
  order: number,
  fields: Partial<Omit<PageSection, "key" | "type" | "adminLabel" | "order">> = {}
): PageSection {
  return {
    key,
    type,
    adminLabel,
    order,
    visible: true,
    ...fields,
  };
}

export const DEMO = {
  homeHero: "/uploads/pages/home-hero-bg.png",
  homeTrust: "/images/placeholders/home-trust-1.svg",
  homeAirport: "/images/placeholders/airport-1.svg",
  homeAirport2: "/images/placeholders/airport-2.svg",
  homeEditorial: "/images/placeholders/home-editorial-1.svg",
  homeExecutive: "/images/placeholders/executive-1.svg",
  homeRoute: "/images/placeholders/home-route-1.svg",
  homeProcess: "/images/placeholders/home-process-1.svg",
  homeFleet: "/images/placeholders/fleet-1.svg",
  homeFaq: "/images/placeholders/home-faq-1.svg",
  homeCta: "/images/placeholders/home-cta-1.svg",
  about1: "/images/placeholders/about-1.svg",
  about2: "/images/placeholders/about-2.svg",
  about3: "/images/placeholders/about-3.svg",
  about4: "/images/placeholders/about-4.svg",
  about5: "/images/placeholders/about-5.svg",
  services1: "/images/placeholders/services-1.svg",
  services2: "/images/placeholders/services-2.svg",
  services3: "/images/placeholders/services-3.svg",
  services4: "/images/placeholders/services-4.svg",
  services5: "/images/placeholders/services-5.svg",
  fleet1: "/images/placeholders/fleet-1.svg",
  fleet2: "/images/placeholders/fleet-2.svg",
  fleet3: "/images/placeholders/fleet-3.svg",
  fleet4: "/images/placeholders/fleet-4.svg",
  fleet5: "/images/placeholders/fleet-5.svg",
  areas1: "/images/placeholders/area-albany.svg",
  areas2: "/images/placeholders/area-saratoga.svg",
  areas3: "/images/placeholders/area-clifton-park.svg",
  areas4: "/images/placeholders/area-latham.svg",
  areas5: "/images/placeholders/area-schenectady.svg",
  gallery1: "/images/placeholders/gallery-1.svg",
  gallery2: "/images/placeholders/gallery-2.svg",
  gallery3: "/images/placeholders/gallery-3.svg",
  gallery4: "/images/placeholders/gallery-4.svg",
  gallery5: "/images/placeholders/gallery-5.svg",
  testimonials1: "/images/placeholders/testimonials-1.svg",
  testimonials2: "/images/placeholders/testimonials-2.svg",
  testimonials3: "/images/placeholders/testimonials-3.svg",
  testimonials4: "/images/placeholders/testimonials-4.svg",
  testimonials5: "/images/placeholders/testimonials-5.svg",
  faqs1: "/images/placeholders/faqs-1.svg",
  faqs2: "/images/placeholders/faqs-2.svg",
  faqs3: "/images/placeholders/faqs-3.svg",
  faqs4: "/images/placeholders/faqs-4.svg",
  faqs5: "/images/placeholders/faqs-5.svg",
  booking1: "/images/placeholders/booking-1.svg",
  booking2: "/images/placeholders/booking-2.svg",
  booking3: "/images/placeholders/booking-3.svg",
  booking4: "/images/placeholders/booking-4.svg",
  booking5: "/images/placeholders/booking-5.svg",
  contact1: "/images/placeholders/contact-1.svg",
  contact2: "/images/placeholders/contact-2.svg",
  contact3: "/images/placeholders/contact-3.svg",
  contact4: "/images/placeholders/contact-4.svg",
  contact5: "/images/placeholders/contact-5.svg",
  blogIndex1: "/images/placeholders/blog-index-1.svg",
  blogIndex2: "/images/placeholders/blog-index-2.svg",
  blogIndex3: "/images/placeholders/blog-index-3.svg",
  blogIndex4: "/images/placeholders/blog-index-4.svg",
  blogIndex5: "/images/placeholders/blog-index-5.svg",
  blogAirport: "/images/placeholders/blog-airport.svg",
  blogExecutive: "/images/placeholders/blog-executive.svg",
  blogLongDistance: "/images/placeholders/blog-long-distance.svg",
  airportService: "/images/placeholders/airport-1.svg",
  localService: "/images/placeholders/local-1.svg",
  longDistanceService: "/images/placeholders/long-distance-1.svg",
  executiveService: "/images/placeholders/executive-1.svg",
  corporateService: "/images/placeholders/corporate-1.svg",
  hotelService: "/images/placeholders/hotel-1.svg",
  privateCarService: "/images/placeholders/private-car-1.svg",
  vehicleSedan: "/images/placeholders/vehicle-sedan-1.svg",
  vehicleSuv: "/images/placeholders/vehicle-suv-1.svg",
  vehicleSprinter: "/images/placeholders/vehicle-sprinter-1.svg",
  pageAbout: "/images/placeholders/page-about.svg",
  pageServices: "/images/placeholders/page-services.svg",
  pageFleet: "/images/placeholders/page-fleet.svg",
  pageAreas: "/images/placeholders/page-areas.svg",
  pageGallery: "/images/placeholders/page-gallery.svg",
  pageTestimonials: "/images/placeholders/page-testimonials.svg",
  pageFaqs: "/images/placeholders/page-faqs.svg",
  pageBooking: "/images/placeholders/page-booking.svg",
  pageContact: "/images/placeholders/page-contact.svg",
  pageBlog: "/images/placeholders/page-blog.svg",
  pageLegal: "/images/placeholders/page-legal.svg",
} as const;

export const ABOUT_STATEMENT =
  "SierraLink Executive Transportation LLC provides professional, reliable, and comfortable private transportation throughout Albany and the Capital Region. We specialize in airport transportation, local and long-distance rides, executive and corporate transportation, and pre-arranged private car service. Our goal is to provide dependable, professional service while making booking simple and convenient for every customer.";

export const PRICING_STATEMENT =
  "Pricing is provided by quote. Please call, request a quote, or book online for pricing.";

export const SERVICE_AREA_TEXT =
  "Saratoga Springs, Clifton Park, Latham, Albany, Schenectady, and surrounding Capital Region areas";
