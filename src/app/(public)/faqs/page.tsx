import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { Container } from "@/components/ui/Container";
import { FaqSearchAccordion } from "@/components/faqs/FaqSearchAccordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getPublishedFaqs } from "@/lib/repositories/faqs";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("faqs");
  if (!page) return { title: "FAQs" };
  return generatePageMetadata(page);
}

export default async function FaqsPage() {
  const [page, faqs] = await Promise.all([
    getPageBySlug("faqs"),
    getPublishedFaqs(),
  ]);

  if (!page) notFound();

  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: baseUrl },
            { name: "FAQs", url: `${baseUrl}/faqs` },
          ]),
          buildFaqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer }))),
        ]}
      />
      <PageHero hero={page.hero} title={page.title} />
      <section className="section-theme-black py-[var(--section-padding-y)]">
        <Container size="narrow">
          <FaqSearchAccordion faqs={faqs} />
        </Container>
      </section>
    </>
  );
}
