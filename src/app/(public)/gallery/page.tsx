import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getPublishedCategories, getPublishedImages } from "@/lib/repositories/gallery";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("gallery");
  if (!page) return { title: "Gallery" };
  return generatePageMetadata(page);
}

export default async function GalleryPage() {
  const [page, categories, images] = await Promise.all([
    getPageBySlug("gallery"),
    getPublishedCategories(),
    getPublishedImages(),
  ]);

  if (!page) notFound();

  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Gallery", url: `${baseUrl}/gallery` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer sections={page.sections} context={{ galleryImages: images }} />

      <section className="section-theme-black py-[var(--section-padding-y)]">
        <Container>
          <GalleryGrid categories={categories} images={images} />
        </Container>
      </section>
    </>
  );
}
