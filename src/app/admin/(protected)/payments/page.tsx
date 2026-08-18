"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { formatCurrency } from "@/lib/utils";
import { adminCardClass } from "@/components/admin/admin-styles";
import { Info } from "lucide-react";

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  providerSessionId?: string;
  providerPaymentIntentId?: string;
  providerConfirmedAt?: string;
  quoteId: string;
  bookingId: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const { error } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((data) => data.payments && setPayments(data.payments))
      .catch(() => error("Failed to load payments"));
  }, [error]);

  return (
    <AdminPage
      title="Payments"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Payments" }]}
    >
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-950/20 px-4 py-3 text-sm text-blue-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Payment status is managed by Stripe and cannot be manually set to Paid.
          Status updates occur automatically via webhooks.
        </p>
      </div>

      <div className={adminCardClass}>
        <DataTable
          data={payments}
          searchKeys={["status"]}
          getRowId={(r) => r._id}
          columns={[
            {
              key: "amount",
              header: "Amount",
              render: (r) => formatCurrency(r.amount, r.currency),
            },
            {
              key: "status",
              header: "Provider status",
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: "session",
              header: "Stripe session",
              render: (r) => (
                <span className="font-mono text-xs text-muted-silver">
                  {r.providerSessionId
                    ? `${r.providerSessionId.slice(0, 16)}…`
                    : "—"}
                </span>
              ),
            },
            {
              key: "intent",
              header: "Payment intent",
              render: (r) => (
                <span className="font-mono text-xs text-muted-silver">
                  {r.providerPaymentIntentId
                    ? `${r.providerPaymentIntentId.slice(0, 16)}…`
                    : "—"}
                </span>
              ),
            },
            {
              key: "confirmed",
              header: "Confirmed at",
              render: (r) =>
                r.providerConfirmedAt
                  ? new Date(r.providerConfirmedAt).toLocaleString()
                  : "—",
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
