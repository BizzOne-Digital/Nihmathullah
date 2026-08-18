import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPublishedPosts, getPostBySlug } from "@/lib/repositories/blog";
import { resolveStaticParams } from "@/lib/db/build-time";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";
import type { BlogContentBlock } from "@/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return resolveStaticParams("blog posts", async () => {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };
  return generatePageMetadata({
    title: post.title,
    seo: post.seo,
  }, post.excerpt);
}

function renderBlock(block: BlogContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      const level = block.level && block.level >= 2 && block.level <= 4 ? block.level : 2;
      const HeadingTag = `h${level}` as "h2" | "h3" | "h4";
      return (
        <HeadingTag key={index} className="mt-8 font-display text-2xl text-ivory">
          {block.content}
        </HeadingTag>
      );
    case "paragraph":
      return (
        <p key={index} className="mt-4 text-muted-silver leading-relaxed">
          {block.content}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="mt-4 list-disc space-y-2 pl-6 text-muted-silver">
          {(block.items ?? []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="mt-6 border-l-2 border-signature-gold pl-6 font-display text-xl text-ivory"
        >
          {block.content}
        </blockquote>
      );
    case "image":
      if (!block.media?.url) return null;
      return (
        <figure key={index} className="my-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
            <OptimizedImage
              src={block.media.url}
              alt={block.media.alt}
              fill
              className="object-cover"
            />
          </div>
          {block.media.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-silver">
              {block.media.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const baseUrl = getBaseUrl();
  const publishDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: baseUrl },
            { name: "Blog", url: `${baseUrl}/blog` },
            { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishDate
              ? new Date(post.publishDate).toISOString()
              : undefined,
            author: post.authorDisplay
              ? { "@type": "Person", name: post.authorDisplay }
              : undefined,
            image: post.featuredImage?.url,
          },
        ]}
      />

      <article>
        {post.featuredImage?.url && (
          <div className="relative h-[40vh] min-h-[280px]">
            <OptimizedImage
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian" />
          </div>
        )}

        <Container size="narrow" className="py-12 md:py-16">
          {post.category && (
            <p className="text-xs font-medium uppercase tracking-wider text-signature-gold">
              {post.category}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl text-ivory">{post.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-silver">
            {publishDate && <time>{publishDate}</time>}
            {post.authorDisplay && <span>{post.authorDisplay}</span>}
          </div>
          <p className="mt-6 text-lg text-muted-silver leading-relaxed">{post.excerpt}</p>

          <div className="mt-8">
            {post.contentBlocks.map((block, i) => renderBlock(block, i))}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-antique-gold/20 px-3 py-1 text-xs text-muted-silver"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 border-t border-antique-gold/20 pt-8">
            <Link href="/blog" className="text-sm text-signature-gold hover:text-champagne">
              ← Back to Blog
            </Link>
          </div>
        </Container>
      </article>
    </>
  );
}
