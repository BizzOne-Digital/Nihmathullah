import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { cn } from "@/lib/utils";
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
              <div
                className={cn(
                  "flex items-start gap-4 rounded-sm border p-6",
                  dark
                    ? "border-antique-gold/10 bg-charcoal/20"
                    : "border-obsidian/15 bg-obsidian/[0.06]"
                )}
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-signature-gold/15 text-xl font-display text-signature-gold">
                  {item.step ?? i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "font-display text-lg",
                      dark ? "text-ivory" : "text-obsidian"
                    )}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className={cn(
                        "mt-1 text-sm leading-relaxed",
                        dark ? "text-muted-silver" : "text-obsidian/75"
                      )}
                    >
                      {item.description}
                    </p>
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
