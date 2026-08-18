"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { formatCurrency } from "@/lib/utils";
import { adminCardClass } from "@/components/admin/admin-styles";

interface Quote {
  _id: string;
  reference: string;
  status: string;
  total: number;
  depositAmount: number;
  bookingId: string;
  expiresAt: string;
  createdAt: string;
}

export default function QuotesPage() {
  const { error } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((data) => data.quotes && setQuotes(data.quotes))
      .catch(() => error("Failed to load quotes"));
  }, [error]);

  return (
    <AdminPage
      title="Quotes"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Quotes" }]}
    >
      <div className={adminCardClass}>
        <DataTable
          data={quotes}
          searchKeys={["reference"]}
          getRowId={(r) => r._id}
          columns={[
            { key: "reference", header: "Reference", sortable: true },
            {
              key: "total",
              header: "Total",
              render: (r) => formatCurrency(r.total),
            },
            {
              key: "deposit",
              header: "Deposit",
              render: (r) => formatCurrency(r.depositAmount),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: "expiresAt",
              header: "Expires",
              render: (r) => new Date(r.expiresAt).toLocaleDateString(),
            },
            {
              key: "createdAt",
              header: "Created",
              render: (r) => new Date(r.createdAt).toLocaleDateString(),
            },
          ]}
        />
      </div>
    </AdminPage>
  );
}
