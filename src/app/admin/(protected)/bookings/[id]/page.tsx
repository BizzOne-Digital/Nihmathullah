"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Copy, Link2, Plus, Trash2 } from "lucide-react";
import { BOOKING_STATUSES } from "@/lib/constants";
import { formatCurrency, getBaseUrl } from "@/lib/utils";
import { AdminPage } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import type { QuoteLineItem } from "@/types";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface Booking {
  _id: string;
  reference: string;
  status: string;
  mode: string;
  internalNotes?: string;
  tripDetails: Record<string, unknown>;
  auditLog?: Array<{ action: string; note?: string; timestamp: string }>;
}

interface CreatedQuote {
  id: string;
  reference: string;
  token: string;
  total: number;
  depositAmount: number;
}

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { success, error } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([
    { label: "Base fare", amount: 0 },
  ]);
  const [createdQuote, setCreatedQuote] = useState<CreatedQuote | null>(null);
  const [creatingQuote, setCreatingQuote] = useState(false);

  const load = () => {
    fetch(`/api/admin/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.booking) {
          setBooking(data.booking);
          setStatus(data.booking.status);
          setNotes(data.booking.internalNotes ?? "");
        }
      })
      .catch(() => error("Failed to load booking"));
  };

  useEffect(() => { load(); }, [id, error]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes: notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      success("Booking updated");
      setBooking(data.booking);
    } catch (err) {
      error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateQuote = async () => {
    setCreatingQuote(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems,
          status: "Sent/Shared",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Quote creation failed");
      setCreatedQuote(data.quote);
      success("Quote created");
      load();
    } catch (err) {
      error(err instanceof Error ? err.message : "Quote creation failed");
    } finally {
      setCreatingQuote(false);
    }
  };

  const copyQuoteLink = () => {
    if (!createdQuote?.token) return;
    const url = `${getBaseUrl()}/quotes/${createdQuote.token}`;
    navigator.clipboard.writeText(url);
    success("Quote link copied to clipboard");
  };

  const copyPaymentLink = () => {
    if (!createdQuote?.token) return;
    const url = `${getBaseUrl()}/quotes/${createdQuote.token}?pay=1`;
    navigator.clipboard.writeText(url);
    success("Payment link copied to clipboard");
  };

  if (!booking) {
    return (
      <AdminPage title="Booking" breadcrumbs={[{ label: "Bookings", href: "/admin/bookings" }]}>
        <p className="text-muted-silver">Loading…</p>
      </AdminPage>
    );
  }

  const trip = booking.tripDetails;

  return (
    <AdminPage
      title={booking.reference}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Bookings", href: "/admin/bookings" },
        { label: booking.reference },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={adminCardClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ivory">Booking details</h2>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-silver">Mode</dt>
              <dd className="text-ivory">{booking.mode}</dd>
            </div>
            {Object.entries(trip).map(([key, val]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted-silver capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </dt>
                <dd className="text-right text-ivory">{String(val ?? "—")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Update status</h2>
          <div className="space-y-4">
            <div>
              <label className={adminLabelClass}>Status</label>
              <select
                className={adminInputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {BOOKING_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={adminLabelClass}>Internal notes</label>
              <textarea
                className={`${adminInputClass} min-h-[100px]`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button className={adminButtonPrimary} onClick={handleUpdate} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        <div className={`lg:col-span-2 ${adminCardClass}`}>
          <h2 className="mb-4 font-display text-lg text-ivory">Create quote</h2>
          <div className="space-y-3">
            {lineItems.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={adminInputClass}
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => {
                    const next = [...lineItems];
                    next[i] = { ...next[i], label: e.target.value };
                    setLineItems(next);
                  }}
                />
                <input
                  type="number"
                  className={`${adminInputClass} w-32`}
                  placeholder="Cents"
                  value={item.amount}
                  onChange={(e) => {
                    const next = [...lineItems];
                    next[i] = { ...next[i], amount: Number(e.target.value) };
                    setLineItems(next);
                  }}
                />
                <button
                  type="button"
                  className="text-red-400"
                  onClick={() => setLineItems(lineItems.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={adminButtonSecondary}
              onClick={() => setLineItems([...lineItems, { label: "", amount: 0 }])}
            >
              <Plus className="h-4 w-4" /> Add line item
            </button>
          </div>
          <button
            className={`${adminButtonPrimary} mt-4`}
            onClick={handleCreateQuote}
            disabled={creatingQuote}
          >
            {creatingQuote ? "Creating…" : "Create & send quote"}
          </button>

          {createdQuote && (
            <div className="mt-6 rounded-md border border-signature-gold/20 bg-signature-gold/5 p-4">
              <p className="text-sm text-ivory">
                Quote <strong>{createdQuote.reference}</strong> created — Total:{" "}
                {formatCurrency(createdQuote.total)} (Deposit:{" "}
                {formatCurrency(createdQuote.depositAmount)})
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className={adminButtonSecondary} onClick={copyQuoteLink}>
                  <Link2 className="h-4 w-4" /> Copy quote link
                </button>
                <button className={adminButtonSecondary} onClick={copyPaymentLink}>
                  <Copy className="h-4 w-4" /> Copy payment link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
