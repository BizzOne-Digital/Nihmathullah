import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { cn } from "@/lib/utils";
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

function passengerGridClass(count: number): string {
  if (count <= 1) return "max-w-sm grid-cols-1";
  if (count === 2) return "max-w-2xl grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "max-w-4xl grid-cols-1 md:grid-cols-3";
  return "max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
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

        <div className={cn("mx-auto grid gap-8 gap-y-10", passengerGridClass(items.length))}>
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
