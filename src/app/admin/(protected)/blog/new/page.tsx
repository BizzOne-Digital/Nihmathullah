"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import {
  adminButtonPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          excerpt,
          contentBlocks: content
            ? [{ type: "paragraph", content }]
            : [],
          draft: true,
          published: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      success("Post created");
      router.push(`/admin/blog/${data.post._id}`);
    } catch (err) {
      error(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="New Blog Post"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Blog", href: "/admin/blog" },
        { label: "New" },
      ]}
      actions={
        <button className={adminButtonPrimary} onClick={handleCreate} disabled={saving}>
          {saving ? "Creating…" : "Create post"}
        </button>
      }
    >
      <div className={`space-y-4 ${adminCardClass}`}>
        <div>
          <label className={adminLabelClass}>Title</label>
          <input
            className={adminInputClass}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Slug</label>
          <input
            className={adminInputClass}
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Excerpt</label>
          <textarea className={adminInputClass} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div>
          <label className={adminLabelClass}>Content</label>
          <textarea
            className={`${adminInputClass} min-h-[200px]`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </AdminPage>
  );
}
