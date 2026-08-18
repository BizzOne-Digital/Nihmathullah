import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface ProcessItem {
  step?: number;
  title?: string;
  description?: string;
}

interface ProcessSectionProps {
  section: PageSection;
}

export function ProcessSection({ section }: ProcessSectionProps) {
  const dark = isDarkTheme(section.theme);
  const items = (section.items as ProcessItem[] | undefined) ?? [];

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll>
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading}
              subheading={section.subheading}
              dark={!dark}
            />
            <ol className="space-y-6">
              {items.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-signature-gold/20 text-sm font-bold text-signature-gold">
                    {item.step ?? i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ivory">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted-silver">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </RevealOnScroll>

          {section.primaryMedia?.url && (
            <RevealOnScroll direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <OptimizedImage
                  src={section.primaryMedia.url}
                  alt={section.primaryMedia.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
          )}
        </div>
      </Container>
    </section>
  );
}
