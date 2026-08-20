import type { ISiteSettings } from "@/models";
import type { SiteSettingsData } from "@/types";

export function toSiteSettingsData(settings: ISiteSettings): SiteSettingsData {
  return {
    businessName: settings.businessName,
    shortName: settings.shortName,
    headline: settings.headline,
    primaryEmail: settings.primaryEmail,
    primaryPhoneDisplay: settings.primaryPhoneDisplay,
    primaryPhoneLink: settings.primaryPhoneLink,
    alternatePhoneDisplay: settings.alternatePhoneDisplay,
    alternatePhoneLink: settings.alternatePhoneLink,
    serviceAreaText: settings.serviceAreaText,
    aboutStatement: settings.aboutStatement,
    publicPricingStatement: settings.publicPricingStatement,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    streetAddress: settings.streetAddress,
    city: settings.city,
    state: settings.state,
    zip: settings.zip,
    country: settings.country,
    geoLat: settings.geoLat,
    geoLng: settings.geoLng,
    businessHours: settings.businessHours,
    socialLinks: settings.socialLinks,
    headerCtas: settings.headerCtas,
    footerCopy: settings.footerCopy,
    footerNav: settings.footerNav,
    operationalClaims: settings.operationalClaims,
    airports: settings.airports,
    bookingConfirmationText: settings.bookingConfirmationText,
    introAnimationEnabled: settings.introAnimationEnabled,
    analyticsId: settings.analyticsId,
    analyticsConsentRequired: settings.analyticsConsentRequired,
    copyrightText: settings.copyrightText,
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  businessName: "SierraLink Executive Transportation LLC",
  shortName: "SierraLink",
  headline:
    "Reliable Airport, Executive, Local & Long-Distance Transportation in Albany & the Capital Region",
  primaryEmail: "info@sierralinkexecutivetransportation.com",
  primaryPhoneDisplay: "(518) 290-0675",
  primaryPhoneLink: "tel:+15182900675",
  alternatePhoneDisplay: "(914) 483-2266",
  alternatePhoneLink: "tel:+19144832266",
  serviceAreaText:
    "Saratoga Springs, Clifton Park, Latham, Albany, Schenectady, and surrounding Capital Region areas",
  aboutStatement:
    "SierraLink Executive Transportation LLC provides professional, reliable, and comfortable private transportation throughout Albany and the Capital Region.",
  publicPricingStatement:
    "Pricing is provided by quote. Please call, request a quote, or book online for pricing.",
  logoUrl: "/uploads/settings/sierralink-logo.png",
  introAnimationEnabled: true,
};
