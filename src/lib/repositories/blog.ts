import connectDB from "@/lib/db/connect";
import {
  sanitizeContentBlocks,
  sanitizeMediaItem,
  sanitizeSeoFields,
} from "@/lib/media/sanitize";
import { mapRepositoryDoc } from "./serialize";
import { BlogPost, type IBlogPost } from "@/models";
import { handleRepositoryError } from "./errors";
import { isDatabaseUnavailable } from "./readiness";

function sanitizePublicPost(post: IBlogPost): IBlogPost {
  return {
    ...post,
    featuredImage: sanitizeMediaItem(post.featuredImage),
    contentBlocks: sanitizeContentBlocks(post.contentBlocks ?? []),
    seo: sanitizeSeoFields(post.seo),
  } as IBlogPost;
}

export async function getPublishedPosts(): Promise<IBlogPost[]> {
  if (isDatabaseUnavailable()) {
    return [];
  }
  try {
    await connectDB();
    const posts = await BlogPost.find({ published: true, draft: false })
      .sort({ publishDate: -1, createdAt: -1 })
      .lean();
    return (mapRepositoryDoc(posts) as IBlogPost[]).map(sanitizePublicPost);
  } catch (error) {
    handleRepositoryError(error, "get published blog posts");
  }
}

export async function getPostBySlug(slug: string): Promise<IBlogPost | null> {
  if (isDatabaseUnavailable()) {
    return null;
  }
  try {
    await connectDB();
    const post = await BlogPost.findOne({
      slug,
      published: true,
      draft: false,
    }).lean();
    return post ? sanitizePublicPost(mapRepositoryDoc(post) as IBlogPost) : null;
  } catch (error) {
    handleRepositoryError(error, "get blog post by slug");
  }
}
