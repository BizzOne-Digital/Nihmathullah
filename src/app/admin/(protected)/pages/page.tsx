"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminCardClass } from "@/components/admin/admin-styles";

interface PageRow {
  _id: string;
  slug: string;
  title: string;
  published: boolean;
  order: number;
}

export default function AdminPagesListPage() {
  const { error } = useToast();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((data) => {
        if (data.pages) setPages(data.pages);
        else error(data.error || "Failed to load pages");
      })
      .catch(() => error("Failed to load pages"))
      .finally(() => setLoading(false));
  }, [error]);

  return (
    <AdminPage
      title="Pages"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pages" }]}
    >
      <div className={adminCardClass}>
        {loading ? (
          <p className="text-muted-silver">Loading…</p>
        ) : (
          <DataTable
            data={pages}
            searchKeys={["title", "slug"]}
            getRowId={(r) => r._id}
            onRowClick={(r) => router.push(`/admin/pages/${r.slug}`)}
            columns={[
              { key: "title", header: "Title", sortable: true },
              { key: "slug", header: "Slug", sortable: true },
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
              { key: "order", header: "Order", sortable: true },
              {
                key: "actions",
                header: "",
                render: (r) => (
                  <Link
                    href={`/admin/pages/${r.slug}`}
                    className="text-signature-gold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                ),
              },
            ]}
          />
        )}
      </div>
    </AdminPage>
  );
}
