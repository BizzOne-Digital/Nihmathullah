import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection, SiteSettingsData } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface AirportSpotlightSectionProps {
  section: PageSection;
  settings?: Pick<SiteSettingsData, "airports">;
}

const DEFAULT_AIRPORTS = [
  {
    code: "ALB",
    name: "Albany International Airport",
    description: "Reliable meet-and-greet transfers with flight monitoring.",
  },
  {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    description: "Comfortable long-distance service to and from JFK.",
  },
];

export function AirportSpotlightSection({
  section,
  settings,
}: AirportSpotlightSectionProps) {
  const dark = isDarkTheme(section.theme);
  const airports =
    settings?.airports && settings.airports.length > 0
      ? settings.airports
      : DEFAULT_AIRPORTS;

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow || "Airport Service"}
            heading={section.heading || "Airport Transfers"}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-2">
          {airports.map((airport, i) => (
            <RevealOnScroll key={airport.code} delay={i * 0.1} direction={i === 0 ? "left" : "right"}>
              <div className="group relative overflow-hidden rounded-sm border border-antique-gold/20 bg-charcoal/40 p-8 transition-all hover:border-signature-gold/50">
                <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-signature-gold/10 to-transparent" />
                <p className="text-4xl font-display text-signature-gold">{airport.code}</p>
                <h3 className="mt-2 font-display text-2xl text-ivory">{airport.name}</h3>
                {airport.description && (
                  <p className="mt-3 text-sm text-muted-silver leading-relaxed">
                    {airport.description}
                  </p>
                )}
                <Link
                  href={`/booking?rideType=airport&airport=${airport.code}`}
                  className="mt-6 inline-block text-sm font-medium text-signature-gold hover:text-champagne"
                >
                  Book {airport.code} transfer →
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {section.primaryCta && (
          <div className="mt-10 text-center">
            <Button href={section.primaryCta.href} variant="gold" magnetic>
              {section.primaryCta.label}
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
