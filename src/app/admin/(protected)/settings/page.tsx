"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminShell";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { useToast } from "@/components/admin/Toast";
import type { SiteSettingsData } from "@/types";
import {
  adminButtonPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

export default function SettingsPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => data.settings && setSettings(data.settings))
      .catch(() => error("Failed to load settings"));
  }, [error]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success("Settings saved");
    } catch (err) {
      error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <AdminPage title="Settings" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Settings" }]}>
        <p className="text-muted-silver">Loading…</p>
      </AdminPage>
    );
  }

  const update = (patch: Partial<SiteSettingsData>) =>
    setSettings({ ...settings, ...patch });

  const updateClaims = (
    patch: Partial<NonNullable<SiteSettingsData["operationalClaims"]>>
  ) =>
    update({
      operationalClaims: { ...settings.operationalClaims, ...patch },
    });

  return (
    <AdminPage
      title="Settings"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Settings" }]}
      actions={
        <button className={adminButtonPrimary} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      }
    >
      <div className="space-y-6">
        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Business info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Business name</label>
              <input
                className={adminInputClass}
                value={settings.businessName}
                onChange={(e) => update({ businessName: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Short name</label>
              <input
                className={adminInputClass}
                value={settings.shortName}
                onChange={(e) => update({ shortName: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={adminLabelClass}>Headline</label>
              <input
                className={adminInputClass}
                value={settings.headline}
                onChange={(e) => update({ headline: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Primary email</label>
              <input
                type="email"
                className={adminInputClass}
                value={settings.primaryEmail}
                onChange={(e) => update({ primaryEmail: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Primary phone (display)</label>
              <input
                className={adminInputClass}
                value={settings.primaryPhoneDisplay}
                onChange={(e) => update({ primaryPhoneDisplay: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Primary phone (link)</label>
              <input
                className={adminInputClass}
                value={settings.primaryPhoneLink}
                onChange={(e) => update({ primaryPhoneLink: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Service area text</label>
              <input
                className={adminInputClass}
                value={settings.serviceAreaText}
                onChange={(e) => update({ serviceAreaText: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Branding</h2>
          <MediaUpload
            directory="settings"
            label="Logo"
            value={{ url: settings.logoUrl, alt: settings.shortName }}
            onChange={(media) => media && update({ logoUrl: media.url })}
          />
          <div className="mt-4">
            <label className={adminLabelClass}>About statement</label>
            <textarea
              className={`${adminInputClass} min-h-[100px]`}
              value={settings.aboutStatement}
              onChange={(e) => update({ aboutStatement: e.target.value })}
            />
          </div>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Operational claims</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "availability247" as const, label: "24/7 availability" },
              { key: "flightMonitoring" as const, label: "Flight monitoring" },
              { key: "meetAndGreet" as const, label: "Meet & greet" },
              { key: "licensedInsured" as const, label: "Licensed & insured" },
              { key: "chauffeurTraining" as const, label: "Chauffeur training" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-ivory">
                <input
                  type="checkbox"
                  checked={settings.operationalClaims?.[key] ?? false}
                  onChange={(e) => updateClaims({ [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className={adminLabelClass}>Licensed & insured text</label>
            <input
              className={adminInputClass}
              value={settings.operationalClaims?.licensedInsuredText ?? ""}
              onChange={(e) =>
                updateClaims({ licensedInsuredText: e.target.value })
              }
            />
          </div>
          <div className="mt-4">
            <label className={adminLabelClass}>Years in business</label>
            <input
              type="number"
              className={adminInputClass}
              value={settings.operationalClaims?.yearsInBusiness ?? 0}
              onChange={(e) =>
                updateClaims({ yearsInBusiness: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Site behavior</h2>
          <label className="flex items-center gap-2 text-sm text-ivory">
            <input
              type="checkbox"
              checked={settings.introAnimationEnabled ?? false}
              onChange={(e) => update({ introAnimationEnabled: e.target.checked })}
            />
            Enable intro animation
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm text-ivory">
            <input
              type="checkbox"
              checked={settings.analyticsConsentRequired ?? false}
              onChange={(e) =>
                update({ analyticsConsentRequired: e.target.checked })
              }
            />
            Require analytics consent
          </label>
          <div className="mt-4">
            <label className={adminLabelClass}>Analytics ID</label>
            <input
              className={adminInputClass}
              value={settings.analyticsId ?? ""}
              onChange={(e) => update({ analyticsId: e.target.value })}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
