"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { BookingWidget } from "@/components/booking/BookingWidget";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface QuickQuoteSectionProps {
  section: PageSection;
}

export function QuickQuoteSection({ section }: QuickQuoteSectionProps) {
  const dark = isDarkTheme(section.theme);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading || "Plan Your Ride"}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="mx-auto max-w-5xl">
            <BookingWidget
              mode="quote"
              submitLabel={section.primaryCta?.label || "Get a Quote"}
            />
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
