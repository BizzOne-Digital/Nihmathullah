"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { PageSectionEditor } from "@/components/admin/PageSectionEditor";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { useToast } from "@/components/admin/Toast";
import type { PageHero, PageSection, SeoFields } from "@/types";
import {
  adminButtonPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface PageData {
  slug: string;
  title: string;
  hero?: PageHero;
  sections: PageSection[];
  seo?: SeoFields;
  published: boolean;
  order: number;
}

export default function EditPagePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { success, error } = useToast();
  const [page, setPage] = useState<PageData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/pages/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.page) setPage(data.page);
        else error(data.error || "Page not found");
      })
      .catch(() => error("Failed to load page"));
  }, [slug, error]);

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success("Page saved");
    } catch (err) {
      error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!page) {
    return (
      <AdminPage title="Edit Page" breadcrumbs={[{ label: "Pages", href: "/admin/pages" }, { label: slug }]}>
        <p className="text-muted-silver">Loading…</p>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={`Edit: ${page.title}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Pages", href: "/admin/pages" },
        { label: page.title },
      ]}
      actions={
        <button className={adminButtonPrimary} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save page"}
        </button>
      }
    >
      <div className="space-y-6">
        <div className={`${adminCardClass} grid gap-4 sm:grid-cols-2`}>
          <div>
            <label className={adminLabelClass}>Title</label>
            <input
              className={adminInputClass}
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Order</label>
            <input
              type="number"
              className={adminInputClass}
              value={page.order}
              onChange={(e) => setPage({ ...page, order: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ivory sm:col-span-2">
            <input
              type="checkbox"
              checked={page.published}
              onChange={(e) => setPage({ ...page, published: e.target.checked })}
            />
            Published
          </label>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Hero</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Eyebrow</label>
              <input
                className={adminInputClass}
                value={page.hero?.eyebrow ?? ""}
                onChange={(e) =>
                  setPage({ ...page, hero: { ...page.hero, eyebrow: e.target.value } })
                }
              />
            </div>
            <div>
              <label className={adminLabelClass}>Heading</label>
              <input
                className={adminInputClass}
                value={page.hero?.heading ?? ""}
                onChange={(e) =>
                  setPage({ ...page, hero: { ...page.hero, heading: e.target.value } })
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <MediaUpload
              directory="pages"
              label="Background image"
              value={page.hero?.backgroundImage}
              onChange={(media) =>
                setPage({ ...page, hero: { ...page.hero, backgroundImage: media } })
              }
            />
          </div>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Sections</h2>
          <PageSectionEditor
            sections={page.sections}
            onChange={(sections) => setPage({ ...page, sections })}
          />
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">SEO</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Meta title</label>
              <input
                className={adminInputClass}
                value={page.seo?.title ?? ""}
                onChange={(e) =>
                  setPage({ ...page, seo: { ...page.seo, title: e.target.value } })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className={adminLabelClass}>Meta description</label>
              <textarea
                className={adminInputClass}
                value={page.seo?.description ?? ""}
                onChange={(e) =>
                  setPage({ ...page, seo: { ...page.seo, description: e.target.value } })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
