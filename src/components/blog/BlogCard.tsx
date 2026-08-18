import Link from "next/link";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { truncate } from "@/lib/utils";
import type { IBlogPost } from "@/models";

interface BlogCardProps {
  post: IBlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const date = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-sm border border-antique-gold/10 bg-charcoal/30 transition-all hover:border-signature-gold/40"
    >
      {post.featuredImage?.url && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <OptimizedImage
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {post.category && (
          <p className="text-xs font-medium uppercase tracking-wider text-signature-gold">
            {post.category}
          </p>
        )}
        <h3 className="mt-2 font-display text-xl text-ivory group-hover:text-signature-gold transition-colors">
          {post.title}
        </h3>
        {date && <p className="mt-1 text-xs text-muted-silver">{date}</p>}
        <p className="mt-3 text-sm text-muted-silver leading-relaxed">
          {truncate(post.excerpt, 140)}
        </p>
        <span className="mt-4 inline-block text-sm font-medium text-signature-gold">
          Read more →
        </span>
      </div>
    </Link>
  );
}
