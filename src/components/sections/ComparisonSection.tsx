import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface ComparisonItem {
  label?: string;
  us?: string;
  them?: string;
  description?: string;
}

interface ComparisonSectionProps {
  section: PageSection;
}

export function ComparisonSection({ section }: ComparisonSectionProps) {
  const dark = isDarkTheme(section.theme);
  const items = (section.items as ComparisonItem[] | undefined) ?? [];

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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <div className="rounded-sm border border-antique-gold/20 bg-charcoal/30 p-6">
                <h3 className="font-display text-lg text-signature-gold">{item.label}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-silver">{item.description}</p>
                )}
                {item.us && (
                  <p className="mt-4 text-sm text-ivory">
                    <span className="text-signature-gold">SierraLink: </span>
                    {item.us}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
