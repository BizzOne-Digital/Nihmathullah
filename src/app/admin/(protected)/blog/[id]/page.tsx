"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { useToast } from "@/components/admin/Toast";
import type { MediaItem } from "@/types";
import {
  adminButtonPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentBlocks: Array<{ type: string; content?: string }>;
  featuredImage?: MediaItem;
  published: boolean;
  draft: boolean;
  category?: string;
  tags?: string[];
}

export default function EditBlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const { success, error } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/blog?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.post) setPost(data.post);
        else if (data.posts) {
          const found = data.posts.find((p: BlogPost) => p._id === id);
          if (found) setPost(found);
        }
      })
      .catch(() => error("Failed to load post"));
  }, [id, error]);

  const handleSave = async () => {
    if (!post) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success("Post saved");
    } catch (err) {
      error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!post) {
    return (
      <AdminPage title="Edit Post" breadcrumbs={[{ label: "Blog", href: "/admin/blog" }]}>
        <p className="text-muted-silver">Loading…</p>
      </AdminPage>
    );
  }

  const content =
    post.contentBlocks?.find((b) => b.type === "paragraph")?.content ?? "";

  return (
    <AdminPage
      title={`Edit: ${post.title}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Blog", href: "/admin/blog" },
        { label: post.title },
      ]}
      actions={
        <button className={adminButtonPrimary} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save post"}
        </button>
      }
    >
      <div className={`space-y-4 ${adminCardClass}`}>
        <div>
          <label className={adminLabelClass}>Title</label>
          <input
            className={adminInputClass}
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Excerpt</label>
          <textarea
            className={adminInputClass}
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Content</label>
          <textarea
            className={`${adminInputClass} min-h-[200px]`}
            value={content}
            onChange={(e) =>
              setPost({
                ...post,
                contentBlocks: [{ type: "paragraph", content: e.target.value }],
              })
            }
          />
        </div>
        <MediaUpload
          directory="blogs"
          label="Featured image"
          value={post.featuredImage}
          onChange={(img) => setPost({ ...post, featuredImage: img })}
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-ivory">
            <input
              type="checkbox"
              checked={post.published}
              onChange={(e) => setPost({ ...post, published: e.target.checked })}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-ivory">
            <input
              type="checkbox"
              checked={!post.draft}
              onChange={(e) => setPost({ ...post, draft: !e.target.checked })}
            />
            Not a draft
          </label>
        </div>
      </div>
    </AdminPage>
  );
}
