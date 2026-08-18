"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface Category {
  _id: string;
  name: string;
  slug: string;
  published: boolean;
  order: number;
}

export default function GalleryPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => data.categories && setCategories(data.categories))
      .catch(() => error("Failed to load gallery"));
  };

  useEffect(() => { load(); }, [error]);

  const createCategory = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "category",
        name: newName,
        slug: slugify(newName),
        published: false,
        order: categories.length,
      }),
    });
    if (res.ok) {
      success("Category created");
      setNewName("");
      setShowForm(false);
      load();
    } else error("Failed to create category");
  };

  return (
    <AdminPage
      title="Gallery"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Gallery" }]}
      actions={
        <button className={adminButtonPrimary} onClick={() => setShowForm(true)}>
          New category
        </button>
      }
    >
      {showForm && (
        <div className={`mb-6 ${adminCardClass}`}>
          <div className="flex gap-2">
            <input
              className={adminInputClass}
              placeholder="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className={adminButtonPrimary} onClick={createCategory}>
              Create
            </button>
            <button className={adminButtonSecondary} onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={adminCardClass}>
        <DataTable
          data={categories}
          searchKeys={["name", "slug"]}
          getRowId={(r) => r._id}
          onRowClick={(r) => router.push(`/admin/gallery/${r._id}`)}
          columns={[
            { key: "name", header: "Category", sortable: true },
            { key: "slug", header: "Slug" },
            {
              key: "published",
              header: "Status",
              render: (r) => (
                <StatusBadge
                  status={r.published ? "Published" : "Draft"}
                  variant={r.published ? "success" : "muted"}
                />
              ),
            },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <Link
                  href={`/admin/gallery/${r._id}`}
                  className="text-signature-gold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Manage images
                </Link>
              ),
            },
          ]}
        />
      </div>
    </AdminPage>
  );
}
