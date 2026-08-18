import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import type { IFAQ } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface FaqPreviewSectionProps {
  section: PageSection;
  faqs: IFAQ[];
}

export function FaqPreviewSection({ section, faqs }: FaqPreviewSectionProps) {
  const dark = isDarkTheme(section.theme);
  const displayFaqs = faqs.slice(0, 5);

  if (!displayFaqs.length) return null;

  const accordionItems = displayFaqs.map((faq) => ({
    id: faq._id?.toString() || faq.question,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container size="narrow">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading || "Frequently Asked Questions"}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <Accordion items={accordionItems} />
        </RevealOnScroll>

        <div className="mt-8 text-center">
          <Link
            href="/faqs"
            className="text-sm font-medium text-signature-gold hover:text-champagne transition-colors"
          >
            View all FAQs →
          </Link>
        </div>
      </Container>
    </section>
  );
}
