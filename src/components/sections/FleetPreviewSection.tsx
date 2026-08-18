import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import type { IVehicle } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface FleetPreviewSectionProps {
  section: PageSection;
  vehicles?: IVehicle[];
}

export function FleetPreviewSection({ section, vehicles = [] }: FleetPreviewSectionProps) {
  const dark = isDarkTheme(section.theme);
  const previewVehicles = vehicles.slice(0, 3);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            subheading={section.subheading}
            dark={!dark}
          />
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {section.primaryMedia?.url && (
            <RevealOnScroll>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm md:col-span-2 lg:col-span-1">
                <OptimizedImage
                  src={section.primaryMedia.url}
                  alt={section.primaryMedia.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
          )}

          {previewVehicles.map((vehicle, i) => (
            <RevealOnScroll key={vehicle._id?.toString() || i} delay={i * 0.08}>
              <div className="overflow-hidden rounded-sm border border-antique-gold/10 bg-charcoal/30">
                {vehicle.primaryImage?.url && (
                  <div className="relative aspect-[16/10]">
                    <OptimizedImage
                      src={vehicle.primaryImage.url}
                      alt={vehicle.primaryImage.alt || vehicle.displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-display text-lg text-ivory">{vehicle.displayName}</h3>
                  {vehicle.passengerCapacity && (
                    <p className="mt-1 text-sm text-muted-silver">
                      Up to {vehicle.passengerCapacity} passengers
                    </p>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}

          {section.media?.map((item, i) => (
            <RevealOnScroll key={i} delay={0.1 + i * 0.08}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <OptimizedImage src={item.url} alt={item.alt} fill className="object-cover" />
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
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
          {!section.primaryCta && (
            <Button href="/fleet" variant="gold" magnetic>View Fleet</Button>
          )}
        </div>
      </Container>
    </section>
  );
}
