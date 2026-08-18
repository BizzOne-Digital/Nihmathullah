import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { Container } from "@/components/ui/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { TestimonialSlider } from "@/components/testimonials/TestimonialSlider";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getPublishedTestimonials } from "@/lib/repositories/testimonials";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("testimonials");
  if (!page) return { title: "Testimonials" };
  return generatePageMetadata(page);
}

export default async function TestimonialsPage() {
  const [page, testimonials] = await Promise.all([
    getPageBySlug("testimonials"),
    getPublishedTestimonials(),
  ]);

  if (!page) notFound();

  const baseUrl = getBaseUrl();
  const withImages = testimonials.filter((t) => t.image?.url);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Testimonials", url: `${baseUrl}/testimonials` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />

      <section className="section-theme-charcoal py-[var(--section-padding-y)]">
        <Container>
          {testimonials.length > 0 ? (
            <TestimonialSlider testimonials={testimonials} />
          ) : (
            <p className="text-center text-muted-silver">
              Client testimonials will appear here once published.
            </p>
          )}
        </Container>
      </section>

      {withImages.length > 0 && (
        <section className="section-theme-black py-12">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {withImages.slice(0, 8).map((t, i) => (
                <RevealOnScroll key={t._id?.toString() || i} delay={i * 0.05}>
                  <div className="overflow-hidden rounded-sm border border-antique-gold/10">
                    {t.image?.url && (
                      <div className="relative aspect-square">
                        <OptimizedImage
                          src={t.image.url}
                          alt={t.image.alt || t.customerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-muted-silver line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                      <p className="mt-2 text-sm font-medium text-ivory">{t.customerName}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
