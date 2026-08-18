"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminButtonPrimary, adminCardClass } from "@/components/admin/admin-styles";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  draft: boolean;
  publishDate?: string;
}

export default function BlogListPage() {
  const router = useRouter();
  const { error } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((data) => data.posts && setPosts(data.posts))
      .catch(() => error("Failed to load blog posts"));
  }, [error]);

  return (
    <AdminPage
      title="Blog"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Blog" }]}
      actions={
        <Link href="/admin/blog/new" className={adminButtonPrimary}>
          <Plus className="h-4 w-4" /> New post
        </Link>
      }
    >
      <div className={adminCardClass}>
        <DataTable
          data={posts}
          searchKeys={["title", "slug"]}
          getRowId={(r) => r._id}
          onRowClick={(r) => router.push(`/admin/blog/${r._id}`)}
          columns={[
            { key: "title", header: "Title", sortable: true },
            { key: "slug", header: "Slug" },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <StatusBadge
                  status={r.published && !r.draft ? "Published" : "Draft"}
                  variant={r.published && !r.draft ? "success" : "muted"}
                />
              ),
            },
            {
              key: "publishDate",
              header: "Published",
              render: (r) =>
                r.publishDate
                  ? new Date(r.publishDate).toLocaleDateString()
                  : "—",
            },
          ]}
        />
      </div>
    </AdminPage>
  );
}
