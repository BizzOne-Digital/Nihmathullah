import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface ImageMosaicSectionProps {
  section: PageSection;
}

export function ImageMosaicSection({ section }: ImageMosaicSectionProps) {
  const dark = isDarkTheme(section.theme);
  const images = [
    ...(section.primaryMedia ? [section.primaryMedia] : []),
    ...(section.media ?? []),
  ];

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
        </RevealOnScroll>

        <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {images.slice(0, 5).map((item, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <div
                className={`relative overflow-hidden rounded-sm ${
                  i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto md:h-full min-h-[200px]" : "aspect-[4/3]"
                }`}
              >
                <OptimizedImage src={item.url} alt={item.alt} fill className="object-cover" />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
