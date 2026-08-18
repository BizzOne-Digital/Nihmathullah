"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { SITE_SHORT_NAME } from "@/lib/constants";
import { useToast } from "@/components/admin/Toast";
import { ToastProvider } from "@/components/admin/Toast";
import {
  adminButtonPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

function LoginForm() {
  const router = useRouter();
  const { error, success } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      success("Welcome back");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-charcoal)_0%,_var(--color-obsidian)_70%)]" />
      <div className={`relative w-full max-w-md ${adminCardClass}`}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-signature-gold/15">
            <Lock className="h-6 w-6 text-signature-gold" />
          </div>
          <h1 className="font-display text-2xl text-ivory">
            {SITE_SHORT_NAME} Admin
          </h1>
          <p className="mt-1 text-sm text-muted-silver">
            Sign in to manage your site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={adminLabelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className={adminLabelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${adminButtonPrimary} w-full`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <ToastProvider>
      <LoginForm />
    </ToastProvider>
  );
}
