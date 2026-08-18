"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { ToastProvider } from "./Toast";

interface AdminContextValue {
  email: string;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdminSession() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminSession must be used within AdminShell");
  return ctx;
}

interface AdminShellProps {
  email: string;
  children: ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  return (
    <AdminContext.Provider value={{ email }}>
      <ToastProvider>
        <AdminShellInner>{children}</AdminShellInner>
      </ToastProvider>
    </AdminContext.Provider>
  );
}

function AdminShellInner({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-obsidian">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div
        className={cn(
          "min-h-screen w-full min-w-0 max-w-full overflow-x-clip transition-all duration-300",
          "pl-[72px]",
          !collapsed && "md:pl-64"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface AdminPageProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: ReactNode;
  actions?: ReactNode;
}

export function AdminPage({
  title,
  breadcrumbs,
  children,
  actions,
}: AdminPageProps) {
  const { email } = useAdminSession();

  return (
    <>
      <AdminHeader title={title} breadcrumbs={breadcrumbs} email={email} />
      <main className="w-full min-w-0 max-w-full overflow-x-clip p-4 sm:p-6">
        {actions && <div className="mb-6 flex justify-end">{actions}</div>}
        {children}
      </main>
    </>
  );
}
