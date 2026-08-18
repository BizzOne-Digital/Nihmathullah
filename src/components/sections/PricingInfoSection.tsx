import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection, PricingSettingsData } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface PricingInfoSectionProps {
  section: PageSection;
  pricing?: PricingSettingsData;
}

export function PricingInfoSection({ section, pricing }: PricingInfoSectionProps) {
  const dark = isDarkTheme(section.theme);
  const statement =
    pricing?.publicPricingStatement || section.body || "Contact us for a personalized quote.";

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container size="narrow">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading || "Pricing"}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
          <p className="text-center text-muted-silver leading-relaxed">{statement}</p>
          {pricing?.cancellationPolicyPublished && pricing.cancellationPolicy && (
            <div className="mt-8 rounded-sm border border-antique-gold/20 bg-charcoal/30 p-6">
              <h3 className="font-display text-lg text-ivory">Cancellation Policy</h3>
              <p className="mt-2 text-sm text-muted-silver">{pricing.cancellationPolicy}</p>
            </div>
          )}
        </RevealOnScroll>
      </Container>
    </section>
  );
}
