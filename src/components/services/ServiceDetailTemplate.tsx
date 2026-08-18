import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { IService } from "@/models";
import type { ServiceDetailSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "@/components/sections/theme";

interface ServiceDetailTemplateProps {
  service: IService;
}

export function ServiceDetailTemplate({ service }: ServiceDetailTemplateProps) {
  const listing = service.listing;
  const hero = service.detailPage?.hero;
  const sections = (service.detailPage?.sections ?? [])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center bg-obsidian py-16">
        {(hero?.backgroundImage?.url || listing.mainImage?.url) && (
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src={hero?.backgroundImage?.url || listing.mainImage!.url}
              alt={
                hero?.backgroundImage?.alt ||
                listing.mainImage?.alt ||
                listing.title
              }
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/60 to-obsidian" />
          </div>
        )}
        <Container className="relative z-10">
          <RevealOnScroll>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-signature-gold">
              {hero?.eyebrow || "Service"}
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl text-ivory">
              {hero?.heading || listing.title}
            </h1>
            {(hero?.subheading || listing.shortDescription) && (
              <p className="mt-4 max-w-2xl text-muted-silver leading-relaxed">
                {hero?.subheading || listing.shortDescription}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/booking?mode=quote" variant="gold" size="lg" magnetic>
                Get a Quote
              </Button>
              <Button href="/booking?mode=booking" variant="outline" size="lg">
                Book This Service
              </Button>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {listing.features && listing.features.length > 0 && (
        <section className="section-theme-charcoal py-12">
          <Container>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listing.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-silver">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-signature-gold" />
                  {feature}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {sections.map((section) => (
        <ServiceDetailSectionBlock key={section._id || section.order} section={section} />
      ))}

      <section className="section-theme-black py-12">
        <Container className="text-center">
          <h2 className="font-display text-2xl text-ivory">Ready to book {listing.title}?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href={`/booking?mode=quote&rideType=${listing.slug}`} variant="gold" magnetic>
              Request a Quote
            </Button>
            <Link href="/services" className="text-sm text-signature-gold hover:text-champagne">
              ← All Services
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function ServiceDetailSectionBlock({ section }: { section: ServiceDetailSection }) {
  const dark = isDarkTheme(section.theme);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll>
            {section.heading && (
              <h2 className={dark ? "font-display text-3xl text-ivory" : "font-display text-3xl text-obsidian"}>
                {section.heading}
              </h2>
            )}
            {section.subheading && (
              <p className="mt-2 text-signature-gold">{section.subheading}</p>
            )}
            {section.body && (
              <p className={dark ? "mt-4 text-muted-silver leading-relaxed" : "mt-4 text-obsidian/70 leading-relaxed"}>
                {section.body}
              </p>
            )}
            {section.primaryCta && (
              <Button href={section.primaryCta.href} variant="gold" className="mt-6" magnetic>
                {section.primaryCta.label}
              </Button>
            )}
          </RevealOnScroll>

          {section.media && section.media.length > 0 && (
            <RevealOnScroll direction="right">
              <div className="grid gap-4 sm:grid-cols-2">
                {section.media.slice(0, 4).map((item, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                    <OptimizedImage src={item.url} alt={item.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </Container>
    </section>
  );
}
