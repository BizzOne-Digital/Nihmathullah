import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { isBlockedMediaUrl } from "@/lib/media/sanitize";
import type { PageSection, SiteSettingsData } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface CtaSectionProps {
  section: PageSection;
  settings?: Pick<
    SiteSettingsData,
    "primaryPhoneDisplay" | "primaryPhoneLink"
  >;
}

export function CtaSection({ section, settings }: CtaSectionProps) {
  const dark = isDarkTheme(section.theme);
  const backgroundUrl = section.primaryMedia?.url;
  const showBackground = Boolean(backgroundUrl && !isBlockedMediaUrl(backgroundUrl));

  return (
    <section className={sectionWrapperClass(section.theme, "relative overflow-hidden")}>
      {showBackground && backgroundUrl && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={backgroundUrl}
            alt={section.primaryMedia!.alt}
            fill
            className="object-cover opacity-30"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-antique-gold/5 via-signature-gold/10 to-antique-gold/5" />
      <Container className="relative z-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading}
              subheading={section.subheading}
              dark={!dark}
              align="center"
            />
            {section.body && (
              <p className="mb-8 text-muted-silver leading-relaxed">{section.body}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {section.primaryCta && (
                <Button href={section.primaryCta.href} variant="gold" size="lg" magnetic>
                  {section.primaryCta.label}
                </Button>
              )}
              {section.secondaryCta && (
                <Button href={section.secondaryCta.href} variant="outline" size="lg">
                  {section.secondaryCta.label}
                </Button>
              )}
              {settings && (
                <PhoneLink
                  display={settings.primaryPhoneDisplay}
                  href={settings.primaryPhoneLink}
                  showIcon
                />
              )}
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
