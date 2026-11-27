"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function sanitizeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/";
  }
  return raw;
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const redirectTarget = sanitizeRedirect(searchParams.get("redirect"));
  const authError = searchParams.get("auth_error");
  const [signingIn, setSigningIn] = useState(false);

  const isUserAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isLoading && isAuthenticated && isUserAdmin && redirectTarget.startsWith("/admin")) {
      router.replace(redirectTarget);
    }
  }, [isLoading, isAuthenticated, isUserAdmin, redirectTarget, router]);

  const handleGoogleLogin = () => {
    setSigningIn(true);
    window.location.href = `/api/auth/google?returnUrl=${encodeURIComponent(redirectTarget)}`;
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xl p-7 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
            Sign in to FoodDecode
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {redirectTarget.startsWith("/admin")
              ? "Administrator authentication is required to access the FoodDecode Control Plane."
              : "Authenticate with Google to vote, comment, and save product reviews."}
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            Authentication failed ({authError}). Please try again with an authorized Google account.
          </div>
        )}

        {!isLoading && isAuthenticated && user && !isUserAdmin && redirectTarget.startsWith("/admin") ? (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-900 dark:text-amber-200">
                  Signed in as {user.email} (Role: {user.role})
                </p>
                <p className="text-amber-800 dark:text-amber-300">
                  This account does not have administrator privileges. Sign out and continue with an authorized administrator Google account.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out & Switch Account</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-2 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Server-validated HttpOnly session cookies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Role-based access enforced on backend APIs</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-800 dark:text-stone-100 font-bold text-sm border border-stone-300 dark:border-stone-700 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{signingIn ? "Redirecting to Google..." : "Continue with Google"}</span>
            </button>
          </div>
        )}

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to FoodDecode</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-xs text-stone-400">
          Loading authentication...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
