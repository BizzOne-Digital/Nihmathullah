import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface EditorialSectionProps {
  section: PageSection;
}

export function EditorialSection({ section }: EditorialSectionProps) {
  const dark = isDarkTheme(section.theme);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll direction="left">
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
              <div className="mt-4 grid grid-cols-2 gap-4">
                {section.media.slice(0, 2).map((item, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                    <OptimizedImage src={item.url} alt={item.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </RevealOnScroll>

          <RevealOnScroll direction="right">
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
            {section.primaryCta && (
              <Button href={section.primaryCta.href} variant="gold" className="mt-6" magnetic>
                {section.primaryCta.label}
              </Button>
            )}
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
