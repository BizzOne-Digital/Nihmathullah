import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection, SiteSettingsData } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface ContactPanelSectionProps {
  section: PageSection;
  settings?: SiteSettingsData;
}

export function ContactPanelSection({ section, settings }: ContactPanelSectionProps) {
  const dark = isDarkTheme(section.theme);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <div className="rounded-sm border border-antique-gold/20 bg-charcoal/40 p-8 md:p-12">
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading || "Contact SierraLink"}
              subheading={section.subheading}
              dark={!dark}
              align="center"
            />
            {settings && (
              <div className="mt-6 flex flex-col items-center gap-4 text-center">
                <PhoneLink
                  display={settings.primaryPhoneDisplay}
                  href={settings.primaryPhoneLink}
                  showIcon
                />
                <a
                  href={`mailto:${settings.primaryEmail}`}
                  className="text-muted-silver hover:text-signature-gold"
                >
                  {settings.primaryEmail}
                </a>
              </div>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {section.primaryCta && (
                <Button href={section.primaryCta.href} variant="gold" magnetic>
                  {section.primaryCta.label}
                </Button>
              )}
              {section.secondaryCta && (
                <Button href={section.secondaryCta.href} variant="outline">
                  {section.secondaryCta.label}
                </Button>
              )}
              {!section.primaryCta && (
                <Button href="/contact" variant="gold" magnetic>Contact Us</Button>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
