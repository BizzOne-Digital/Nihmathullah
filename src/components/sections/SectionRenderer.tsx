import type { IBlogPost, IFAQ, IGalleryImage, IService, IServiceArea, ITestimonial, IVehicle } from "@/models";
import type { PageSection, PricingSettingsData, SiteSettingsData } from "@/types";
import { HeroSection } from "./HeroSection";
import { QuickQuoteSection } from "./QuickQuoteSection";
import { RichTextSection } from "./RichTextSection";
import { SplitMediaSection } from "./SplitMediaSection";
import { ServiceCardsSection } from "./ServiceCardsSection";
import { AirportSpotlightSection } from "./AirportSpotlightSection";
import { RouteStorySection } from "./RouteStorySection";
import { ServiceAreasSection } from "./ServiceAreasSection";
import { FleetPreviewSection } from "./FleetPreviewSection";
import { ImageMosaicSection } from "./ImageMosaicSection";
import { GalleryRailSection } from "./GalleryRailSection";
import { ProcessSection } from "./ProcessSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FaqPreviewSection } from "./FaqPreviewSection";
import { FaqsSection } from "./FaqsSection";
import { TrustStripSection } from "./TrustStripSection";
import { ContactPanelSection } from "./ContactPanelSection";
import { CtaSection } from "./CtaSection";
import { EditorialSection } from "./EditorialSection";
import { ComparisonSection } from "./ComparisonSection";
import { PassengerTypesSection } from "./PassengerTypesSection";
import { PricingInfoSection } from "./PricingInfoSection";
import { BookingProcessSection } from "./BookingProcessSection";
import { LocationGridSection } from "./LocationGridSection";
import { BlogPreviewSection } from "./BlogPreviewSection";

export interface SectionContext {
  services?: IService[];
  testimonials?: ITestimonial[];
  faqs?: IFAQ[];
  vehicles?: IVehicle[];
  serviceAreas?: IServiceArea[];
  galleryImages?: IGalleryImage[];
  blogPosts?: IBlogPost[];
  settings?: SiteSettingsData;
  pricing?: PricingSettingsData;
}

interface SectionRendererProps {
  sections: PageSection[];
  context?: SectionContext;
}

export function SectionRenderer({ sections, context = {} }: SectionRendererProps) {
  const visibleSections = sections
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleSections.map((section) => {
        if (section.layout === "trustStrip") {
          return (
            <TrustStripSection
              key={section.key}
              section={section}
              settings={context.settings}
            />
          );
        }

        switch (section.type) {
          case "hero":
            return <HeroSection key={section.key} section={section} />;
          case "quickQuote":
            return <QuickQuoteSection key={section.key} section={section} />;
          case "richText":
            return <RichTextSection key={section.key} section={section} />;
          case "splitMedia":
            return <SplitMediaSection key={section.key} section={section} />;
          case "serviceCards":
            return (
              <ServiceCardsSection
                key={section.key}
                section={section}
                services={context.services ?? []}
              />
            );
          case "airportSpotlight":
            return (
              <AirportSpotlightSection
                key={section.key}
                section={section}
                settings={context.settings}
              />
            );
          case "routeStory":
            return <RouteStorySection key={section.key} section={section} />;
          case "serviceAreas":
            return (
              <ServiceAreasSection
                key={section.key}
                section={section}
                serviceAreas={context.serviceAreas}
              />
            );
          case "fleetPreview":
            return (
              <FleetPreviewSection
                key={section.key}
                section={section}
                vehicles={context.vehicles}
              />
            );
          case "imageMosaic":
            return <ImageMosaicSection key={section.key} section={section} />;
          case "galleryRail":
            return (
              <GalleryRailSection
                key={section.key}
                section={section}
                galleryImages={context.galleryImages}
              />
            );
          case "process":
            return <ProcessSection key={section.key} section={section} />;
          case "testimonials":
            return (
              <TestimonialsSection
                key={section.key}
                section={section}
                testimonials={context.testimonials}
              />
            );
          case "faqs":
            if (section.layout === "preview") {
              return (
                <FaqPreviewSection
                  key={section.key}
                  section={section}
                  faqs={context.faqs ?? []}
                />
              );
            }
            return (
              <FaqsSection key={section.key} section={section} faqs={context.faqs} />
            );
          case "contactPanel":
            return (
              <ContactPanelSection
                key={section.key}
                section={section}
                settings={context.settings}
              />
            );
          case "cta":
            return (
              <CtaSection
                key={section.key}
                section={section}
                settings={context.settings}
              />
            );
          case "editorial":
            return <EditorialSection key={section.key} section={section} />;
          case "comparison":
            return <ComparisonSection key={section.key} section={section} />;
          case "passengerTypes":
            return <PassengerTypesSection key={section.key} section={section} />;
          case "pricingInfo":
            return (
              <PricingInfoSection
                key={section.key}
                section={section}
                pricing={context.pricing}
              />
            );
          case "bookingProcess":
            return <BookingProcessSection key={section.key} section={section} />;
          case "locationGrid":
            return (
              <LocationGridSection
                key={section.key}
                section={section}
                serviceAreas={context.serviceAreas}
              />
            );
          case "blogPreview":
            return (
              <BlogPreviewSection
                key={section.key}
                section={section}
                blogPosts={context.blogPosts}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
