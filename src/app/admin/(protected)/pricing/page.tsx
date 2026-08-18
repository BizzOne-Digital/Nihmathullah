"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import type { PricingSettingsData } from "@/types";
import {
  adminButtonPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

export default function PricingPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<PricingSettingsData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data) => data.settings && setSettings(data.settings))
      .catch(() => error("Failed to load pricing settings"));
  }, [error]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success("Pricing settings saved");
    } catch (err) {
      error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <AdminPage title="Pricing" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pricing" }]}>
        <p className="text-muted-silver">Loading…</p>
      </AdminPage>
    );
  }

  const update = (patch: Partial<PricingSettingsData>) =>
    setSettings({ ...settings, ...patch });

  return (
    <AdminPage
      title="Pricing"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pricing" }]}
      actions={
        <button className={adminButtonPrimary} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      }
    >
      <div className="space-y-6">
        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Public pricing</h2>
          <div className="space-y-4">
            <div>
              <label className={adminLabelClass}>Public pricing statement</label>
              <textarea
                className={adminInputClass}
                value={settings.publicPricingStatement}
                onChange={(e) => update({ publicPricingStatement: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input
                type="checkbox"
                checked={settings.showPublicPricing}
                onChange={(e) => update({ showPublicPricing: e.target.checked })}
              />
              Show public pricing on site
            </label>
          </div>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Quotes & deposits</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Currency</label>
              <input
                className={adminInputClass}
                value={settings.currency}
                onChange={(e) => update({ currency: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Quote expiration (days)</label>
              <input
                type="number"
                className={adminInputClass}
                value={settings.defaultQuoteExpirationDays}
                onChange={(e) =>
                  update({ defaultQuoteExpirationDays: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className={adminLabelClass}>Deposit mode</label>
              <select
                className={adminInputClass}
                value={settings.depositMode}
                onChange={(e) =>
                  update({
                    depositMode: e.target.value as PricingSettingsData["depositMode"],
                  })
                }
              >
                {["none", "fixed", "percentage", "full"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            {settings.depositMode === "fixed" && (
              <div>
                <label className={adminLabelClass}>Fixed deposit (cents)</label>
                <input
                  type="number"
                  className={adminInputClass}
                  value={settings.depositFixedAmount ?? 0}
                  onChange={(e) =>
                    update({ depositFixedAmount: Number(e.target.value) })
                  }
                />
              </div>
            )}
            {settings.depositMode === "percentage" && (
              <div>
                <label className={adminLabelClass}>Deposit percentage</label>
                <input
                  type="number"
                  className={adminInputClass}
                  value={settings.depositPercentage ?? 0}
                  onChange={(e) =>
                    update({ depositPercentage: Number(e.target.value) })
                  }
                />
              </div>
            )}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-ivory">
            <input
              type="checkbox"
              checked={settings.paymentEnabled}
              onChange={(e) => update({ paymentEnabled: e.target.checked })}
            />
            Enable online payments
          </label>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Policies</h2>
          <div className="space-y-4">
            <div>
              <label className={adminLabelClass}>Cancellation policy</label>
              <textarea
                className={`${adminInputClass} min-h-[100px]`}
                value={settings.cancellationPolicy ?? ""}
                onChange={(e) => update({ cancellationPolicy: e.target.value })}
              />
              <label className="mt-2 flex items-center gap-2 text-sm text-ivory">
                <input
                  type="checkbox"
                  checked={settings.cancellationPolicyPublished}
                  onChange={(e) =>
                    update({ cancellationPolicyPublished: e.target.checked })
                  }
                />
                Publish cancellation policy
              </label>
            </div>
            <div>
              <label className={adminLabelClass}>Refund policy</label>
              <textarea
                className={`${adminInputClass} min-h-[100px]`}
                value={settings.refundPolicy ?? ""}
                onChange={(e) => update({ refundPolicy: e.target.value })}
              />
              <label className="mt-2 flex items-center gap-2 text-sm text-ivory">
                <input
                  type="checkbox"
                  checked={settings.refundPolicyPublished}
                  onChange={(e) =>
                    update({ refundPolicyPublished: e.target.checked })
                  }
                />
                Publish refund policy
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
