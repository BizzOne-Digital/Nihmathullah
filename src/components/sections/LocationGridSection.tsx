import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import type { IServiceArea } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface LocationGridSectionProps {
  section: PageSection;
  serviceAreas?: IServiceArea[];
}

export function LocationGridSection({ section, serviceAreas = [] }: LocationGridSectionProps) {
  const dark = isDarkTheme(section.theme);

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceAreas.map((area, i) => (
            <RevealOnScroll key={area.slug} delay={i * 0.05}>
              <Link
                href={`/service-areas/${area.slug}`}
                className="group block overflow-hidden rounded-sm border border-antique-gold/10 transition-all hover:border-signature-gold/40"
              >
                {area.image?.url && (
                  <div className="relative aspect-[16/10]">
                    <OptimizedImage
                      src={area.image.url}
                      alt={area.image.alt || area.city}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-display text-lg text-ivory group-hover:text-signature-gold">
                    {area.city}
                  </h3>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
