import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { cn } from "@/lib/utils";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface SplitMediaSectionProps {
  section: PageSection;
}

export function SplitMediaSection({ section }: SplitMediaSectionProps) {
  const dark = isDarkTheme(section.theme);
  const imageRight = section.layout === "image-right";

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <div
          className={cn(
            "grid min-w-0 gap-10 lg:grid-cols-2 lg:items-center",
            imageRight && "lg:[&>*:first-child]:order-2"
          )}
        >
          <RevealOnScroll direction={imageRight ? "right" : "left"}>
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
            <div className="mt-6 flex flex-wrap gap-4">
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
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction={imageRight ? "left" : "right"}>
            <div className="space-y-4">
              {section.primaryMedia?.url && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <OptimizedImage
                    src={section.primaryMedia.url}
                    alt={section.primaryMedia.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {section.media && section.media.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {section.media.slice(0, 2).map((item, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                      <OptimizedImage src={item.url} alt={item.alt} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
