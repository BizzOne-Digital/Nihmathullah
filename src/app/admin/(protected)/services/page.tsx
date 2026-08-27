"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { adminButtonPrimary, adminCardClass } from "@/components/admin/admin-styles";

interface ServiceRow {
  _id: string;
  listing: {
    title: string;
    slug: string;
    published: boolean;
    order: number;
  };
  archived: boolean;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        else error(data.error || "Failed to load");
      })
      .catch(() => error("Failed to load services"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [error]);

  return (
    <AdminPage
      title="Services"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Services" }]}
      actions={
        <Link href="/admin/services/new" className={adminButtonPrimary}>
          <Plus className="h-4 w-4" /> New service
        </Link>
      }
    >
      <div className={adminCardClass}>
        {loading ? (
          <p className="text-muted-silver">Loading…</p>
        ) : (
          <DataTable
            data={services}
            searchKeys={["listing"]}
            emptyMessage="No services yet. Add your first service."
            getRowId={(r) => r._id}
            columns={[
              {
                key: "title",
                header: "Title",
                sortable: true,
                render: (r) => r.listing.title,
              },
              {
                key: "slug",
                header: "Slug",
                render: (r) => r.listing.slug,
              },
              {
                key: "status",
                header: "Status",
                render: (r) => (
                  <StatusBadge
                    status={
                      r.archived
                        ? "Archived"
                        : r.listing.published
                          ? "Published"
                          : "Draft"
                    }
                    variant={
                      r.archived ? "muted" : r.listing.published ? "success" : "warning"
                    }
                  />
                ),
              },
              {
                key: "order",
                header: "Order",
                render: (r) => r.listing.order,
              },
              {
                key: "actions",
                header: "",
                render: (r) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-signature-gold hover:underline"
                      onClick={() => router.push(`/admin/services/${r._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-red-400 hover:underline"
                      onClick={() => setDeleteId(r._id)}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete service"
        message="This permanently removes the service and its detail page content."
        variant="danger"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            const res = await fetch(`/api/admin/services/${deleteId}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");
            success("Service deleted");
            load();
          } catch (err) {
            error(err instanceof Error ? err.message : "Delete failed");
          } finally {
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </AdminPage>
  );
}
