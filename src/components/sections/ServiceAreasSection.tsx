import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import type { IServiceArea } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface ServiceAreasSectionProps {
  section: PageSection;
  serviceAreas?: IServiceArea[];
}

export function ServiceAreasSection({ section, serviceAreas = [] }: ServiceAreasSectionProps) {
  const dark = isDarkTheme(section.theme);
  const linkItems = (section.items as Array<{ label?: string; href?: string }> | undefined) ?? [];

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

        {section.primaryMedia?.url && (
          <RevealOnScroll delay={0.1}>
            <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-sm">
              <OptimizedImage
                src={section.primaryMedia.url}
                alt={section.primaryMedia.alt}
                fill
                className="object-cover"
              />
            </div>
          </RevealOnScroll>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.length > 0
            ? serviceAreas.map((area, i) => (
                <RevealOnScroll key={area.slug} delay={i * 0.05}>
                  <Link
                    href={`/service-areas/${area.slug}`}
                    className="group block overflow-hidden rounded-sm border border-antique-gold/20 bg-charcoal/30 p-6 transition-all hover:border-signature-gold/40"
                  >
                    {area.image?.url && (
                      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-sm">
                        <OptimizedImage
                          src={area.image.url}
                          alt={area.image.alt || area.city}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="font-display text-xl text-ivory group-hover:text-signature-gold">
                      {area.city}
                    </h3>
                    <p className="mt-2 text-sm text-muted-silver">{area.shortSummary}</p>
                  </Link>
                </RevealOnScroll>
              ))
            : linkItems.map((item, i) => (
                <RevealOnScroll key={item.href || i} delay={i * 0.05}>
                  <Link
                    href={item.href || "/service-areas"}
                    className="block rounded-sm border border-antique-gold/20 bg-charcoal/30 p-6 text-ivory hover:border-signature-gold/40 hover:text-signature-gold"
                  >
                    {item.label}
                  </Link>
                </RevealOnScroll>
              ))}
        </div>
      </Container>
    </section>
  );
}
