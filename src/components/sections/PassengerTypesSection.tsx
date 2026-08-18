import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface PassengerTypeItem {
  label?: string;
  description?: string;
  image?: { url: string; alt: string };
}

interface PassengerTypesSectionProps {
  section: PageSection;
}

export function PassengerTypesSection({ section }: PassengerTypesSectionProps) {
  const dark = isDarkTheme(section.theme);
  const items = (section.items as PassengerTypeItem[] | undefined) ?? [];

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <div className="text-center">
                {item.image?.url && (
                  <div className="relative mx-auto mb-4 aspect-square w-32 overflow-hidden rounded-full">
                    <OptimizedImage
                      src={item.image.url}
                      alt={item.image.alt || item.label || "Passenger type"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-display text-lg text-ivory">{item.label}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-silver">{item.description}</p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
