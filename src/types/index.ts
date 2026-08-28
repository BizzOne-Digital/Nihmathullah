export interface MediaItem {
  url: string;
  alt: string;
  title?: string;
  caption?: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export type PageSectionType =
  | "hero"
  | "quickQuote"
  | "richText"
  | "splitMedia"
  | "serviceCards"
  | "airportSpotlight"
  | "routeStory"
  | "serviceAreas"
  | "fleetPreview"
  | "imageMosaic"
  | "galleryRail"
  | "process"
  | "testimonials"
  | "faqs"
  | "contactPanel"
  | "cta"
  | "editorial"
  | "comparison"
  | "passengerTypes"
  | "pricingInfo"
  | "bookingProcess"
  | "locationGrid"
  | "blogPreview";

export type SectionTheme = "black" | "charcoal" | "gold" | "ivory" | "white";

export interface PageSection {
  _id?: string;
  key: string;
  type: PageSectionType;
  adminLabel: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  items?: Array<Record<string, unknown>>;
  primaryMedia?: MediaItem;
  media?: MediaItem[];
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  layout?: string;
  theme?: SectionTheme;
  visible: boolean;
  order: number;
}

export interface PageHero {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  backgroundImage?: MediaItem;
}

export interface SeoFields {
  title?: string;
  description?: string;
  socialImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export interface SiteSettingsData {
  businessName: string;
  shortName: string;
  headline: string;
  primaryEmail: string;
  primaryPhoneDisplay: string;
  primaryPhoneLink: string;
  alternatePhoneDisplay?: string;
  alternatePhoneLink?: string;
  serviceAreaText: string;
  aboutStatement: string;
  publicPricingStatement: string;
  logoUrl: string;
  faviconUrl?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  geoLat?: number;
  geoLng?: number;
  businessHours?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  headerCtas?: {
    callLabel: string;
    quoteLabel: string;
    bookLabel: string;
  };
  footerCopy?: string;
  footerNav?: Array<{ label: string; href: string }>;
  operationalClaims?: {
    availability247?: boolean;
    flightMonitoring?: boolean;
    meetAndGreet?: boolean;
    licensedInsured?: boolean;
    licensedInsuredText?: string;
    yearsInBusiness?: number;
    chauffeurTraining?: boolean;
    chauffeurTrainingText?: string;
  };
  airports?: Array<{ code: string; name: string; description?: string }>;
  bookingConfirmationText?: string;
  introAnimationEnabled?: boolean;
  analyticsId?: string;
  analyticsConsentRequired?: boolean;
  copyrightText?: string;
}

export interface PricingSettingsData {
  publicPricingStatement: string;
  showPublicPricing: boolean;
  currency: string;
  taxLabel?: string;
  taxRate?: number;
  feeLabel?: string;
  feeRate?: number;
  defaultQuoteExpirationDays: number;
  depositMode: "none" | "fixed" | "percentage" | "full";
  depositFixedAmount?: number;
  depositPercentage?: number;
  paymentEnabled: boolean;
  cancellationPolicy?: string;
  cancellationPolicyPublished: boolean;
  refundPolicy?: string;
  refundPolicyPublished: boolean;
  specialOffersEnabled: boolean;
}

export interface BookingFormData {
  mode: "booking" | "quote";
  rideType: string;
  tripStructure: "one-way" | "round-trip" | "hourly";
  pickupAddress: string;
  destinationAddress: string;
  durationHours?: number;
  stops?: string[];
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  timezone: string;
  airportCode?: string;
  flightType?: "arrival" | "departure";
  airline?: string;
  flightNumber?: string;
  vehiclePreference?: string;
  passengerCount: number;
  luggageCount: number;
  childSeatRequest?: boolean;
  accessibilityRequest?: boolean;
  specialAssistance?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  company?: string;
  preferredContact: "phone" | "email" | "either";
  specialInstructions?: string;
  consent: boolean;
  honeypot?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}

export interface QuoteLineItem {
  label: string;
  description?: string;
  amount: number;
}

export interface ServiceListing {
  title: string;
  slug: string;
  shortDescription: string;
  mainImage?: MediaItem;
  icon?: string;
  features?: string[];
  cta?: CtaLink;
  published: boolean;
  order: number;
  seo?: SeoFields;
}

export interface ServiceDetailSection {
  _id?: string;
  type: string;
  heading?: string;
  subheading?: string;
  body?: string;
  items?: Array<Record<string, unknown>>;
  media?: MediaItem[];
  primaryCta?: CtaLink;
  layout?: string;
  theme?: SectionTheme;
  visible: boolean;
  order: number;
}

export interface ServiceDetailPage {
  hero?: PageHero;
  sections: ServiceDetailSection[];
  relatedServiceAreas?: string[];
  relatedFleetIds?: string[];
  relatedFaqIds?: string[];
  seo?: SeoFields;
}

export interface BlogContentBlock {
  type: "paragraph" | "heading" | "list" | "image" | "quote";
  content?: string;
  items?: string[];
  media?: MediaItem;
  level?: number;
}
