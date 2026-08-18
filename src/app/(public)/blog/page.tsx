import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getPublishedPosts } from "@/lib/repositories/blog";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("blog");
  if (!page) return { title: "Blog" };
  return generatePageMetadata(page);
}

export default async function BlogIndexPage() {
  const [page, posts] = await Promise.all([
    getPageBySlug("blog"),
    getPublishedPosts(),
  ]);

  if (!page) notFound();

  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer sections={page.sections} context={{ blogPosts: posts }} />

      <section className="section-theme-black py-[var(--section-padding-y)]">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <RevealOnScroll key={post.slug} delay={i * 0.06}>
                  <BlogCard post={post} />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-silver">Blog posts coming soon.</p>
          )}
        </Container>
      </section>
    </>
  );
}
