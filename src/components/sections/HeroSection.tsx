import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { isDarkTheme, sectionWrapperClass } from "./theme";

interface HeroSectionProps {
  section: PageSection;
}

export function HeroSection({ section }: HeroSectionProps) {
  const bgImage = section.primaryMedia?.url;
  const dark = isDarkTheme(section.theme);

  return (
    <section className={sectionWrapperClass(section.theme, "relative min-h-[70vh] flex items-center")}>
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src={bgImage}
            alt={section.primaryMedia?.alt || section.heading || "Hero"}
            className="absolute inset-0 h-full w-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian" />
        </div>
      )}

      <Container className="relative z-10">
        <RevealOnScroll direction="bottom">
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading}
              subheading={section.subheading}
              dark={!dark}
            />
            {section.body && (
              <p
                className={
                  dark ? "text-muted-silver leading-relaxed" : "text-obsidian/70 leading-relaxed"
                }
              >
                {section.body}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
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
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
