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
  const { error } = useToast();
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        else error(data.error || "Failed to load");
      })
      .catch(() => error("Failed to load services"))
      .finally(() => setLoading(false));
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
            getRowId={(r) => r._id}
            onRowClick={(r) => router.push(`/admin/services/${r._id}`)}
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
            ]}
          />
        )}
      </div>
    </AdminPage>
  );
}
