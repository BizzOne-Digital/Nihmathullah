import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface BookingProcessItem {
  step?: number;
  title?: string;
  description?: string;
}

interface BookingProcessSectionProps {
  section: PageSection;
}

export function BookingProcessSection({ section }: BookingProcessSectionProps) {
  const dark = isDarkTheme(section.theme);
  const items = (section.items as BookingProcessItem[] | undefined) ?? [];

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

        <div className="mx-auto max-w-3xl space-y-6">
          {items.map((item, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="flex gap-4 rounded-sm border border-antique-gold/10 bg-charcoal/20 p-6">
                <span className="text-2xl font-display text-signature-gold">
                  {item.step ?? i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ivory">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-silver">{item.description}</p>
                  )}
                </div>
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
