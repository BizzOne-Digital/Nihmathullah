import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import type { IService } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface ServiceCardsSectionProps {
  section: PageSection;
  services: IService[];
}

const SERVICE_TAG: Record<string, string> = {
  "airport-transportation": "Airport",
  "local-transportation": "Local",
  "long-distance-transportation": "Long-Distance",
  "executive-transportation": "Executive",
  "corporate-transportation": "Corporate",
  "hotel-residential-transportation": "Hotel & Residential",
  "private-car-service": "Private Car",
};

function getServiceTag(slug: string, title: string): string {
  return SERVICE_TAG[slug] ?? title.split(" ")[0] ?? "Service";
}

export function ServiceCardsSection({ section, services }: ServiceCardsSectionProps) {
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

        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const listing = service.listing;
            const tag = getServiceTag(listing.slug, listing.title);
            const hasImage = Boolean(listing.mainImage?.url);

            return (
              <RevealOnScroll
                key={listing.slug}
                delay={i * 0.08}
                direction="bottom"
                className="h-full"
              >
                <Link
                  href={`/services/${listing.slug}`}
                  className="group flex h-full min-h-[420px] flex-col overflow-hidden rounded-sm border border-antique-gold/15 bg-obsidian transition-all duration-300 hover:border-signature-gold/45 hover:shadow-lg hover:shadow-signature-gold/10"
                >
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-obsidian">
                    {hasImage ? (
                      <>
                        <OptimizedImage
                          src={listing.mainImage!.url}
                          alt={listing.mainImage!.alt || listing.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
                      </>
                    ) : (
                      <ServiceImagePlaceholder tag={tag} />
                    )}
                  </div>

                  <div className="flex min-h-[180px] flex-1 flex-col border-t border-antique-gold/10 bg-obsidian p-6">
                    <h3 className="font-display text-xl leading-snug text-signature-gold transition-colors group-hover:text-champagne">
                      {listing.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-champagne/75 line-clamp-3">
                      {listing.shortDescription}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-signature-gold">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ServiceImagePlaceholder({ tag }: { tag: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-obsidian via-charcoal to-rich-black">
      <div className="flex h-[88px] w-[72px] items-center justify-center rounded-sm border border-signature-gold/50 bg-obsidian/40">
        <span className="font-display text-3xl font-bold text-signature-gold">SL</span>
      </div>
      <p className="mt-4 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-champagne/80">
        {tag}
        <ArrowRight className="h-3 w-3 text-signature-gold" />
      </p>
    </div>
  );
}
