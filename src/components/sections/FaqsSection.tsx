"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import type { IFAQ } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface FaqsSectionProps {
  section: PageSection;
  faqs?: IFAQ[];
}

export function FaqsSection({ section, faqs = [] }: FaqsSectionProps) {
  const dark = isDarkTheme(section.theme);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  const accordionItems = filtered.map((faq) => ({
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
            heading={section.heading}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
        </RevealOnScroll>

        {faqs.length > 3 && (
          <div className="mb-8">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full rounded-sm border border-antique-gold/20 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-muted-silver focus:outline-none focus:ring-2 focus:ring-signature-gold/50"
              aria-label="Search FAQs"
            />
          </div>
        )}

        {accordionItems.length > 0 ? (
          <Accordion items={accordionItems} />
        ) : (
          <p className="text-center text-muted-silver">
            {query ? "No FAQs match your search." : "FAQs coming soon."}
          </p>
        )}
      </Container>
    </section>
  );
}
