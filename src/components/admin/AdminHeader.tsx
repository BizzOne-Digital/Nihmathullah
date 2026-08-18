"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, LogOut, User } from "lucide-react";
import { useToast } from "./Toast";
import { adminButtonSecondary } from "./admin-styles";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  email: string;
}

export function AdminHeader({ title, breadcrumbs = [], email }: AdminHeaderProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      success("Signed out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      error("Failed to sign out");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-antique-gold/15 bg-obsidian/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          {breadcrumbs.length > 0 && (
            <nav className="mb-0.5 flex items-center gap-1 text-xs text-muted-silver">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3" />}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-signature-gold">
                      {crumb.label}
                    </a>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-display text-xl text-ivory">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm text-muted-silver sm:flex">
            <User className="h-4 w-4 text-signature-gold" />
            <span>{email}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={adminButtonSecondary}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
