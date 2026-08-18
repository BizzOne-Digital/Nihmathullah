"use client";

import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import type { IFAQ } from "@/models";
import { FAQ_CATEGORIES } from "@/lib/constants";

interface FaqSearchAccordionProps {
  faqs: IFAQ[];
}

export function FaqSearchAccordion({ faqs }: FaqSearchAccordionProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = category === "all" || faq.category === category;
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [faqs, query, category]);

  const accordionItems = filtered.map((faq) => ({
    id: faq._id?.toString() || faq.question,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <div className="space-y-8">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full rounded-sm border border-antique-gold/20 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-muted-silver focus:outline-none focus:ring-2 focus:ring-signature-gold/50"
        aria-label="Search FAQs"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-sm px-3 py-1.5 text-xs font-medium uppercase tracking-wider ${
            category === "all"
              ? "bg-signature-gold text-obsidian"
              : "border border-antique-gold/30 text-muted-silver"
          }`}
        >
          All
        </button>
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-sm px-3 py-1.5 text-xs font-medium uppercase tracking-wider ${
              category === cat
                ? "bg-signature-gold text-obsidian"
                : "border border-antique-gold/30 text-muted-silver"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {accordionItems.length > 0 ? (
        <Accordion items={accordionItems} allowMultiple />
      ) : (
        <p className="text-center text-muted-silver">No FAQs match your search.</p>
      )}
    </div>
  );
}
