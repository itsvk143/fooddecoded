import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { validateSession, isAdminRole } from "@/lib/session";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const validation = await validateSession({ cookies: cookieStore });

  if (!validation.authenticated || !validation.user) {
    redirect("/login?redirect=/admin");
  }

  if (!isAdminRole(validation.user.role)) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50">
          403 — Access Forbidden
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          Your signed-in account ({validation.user.email}) has role{" "}
          <strong>{validation.user.role}</strong> and does not have administrator privileges.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs"
        >
          Return to FoodDecode
        </Link>
      </div>
    );
  }

  return (
    <AdminDashboardClient
      adminEmail={validation.user.email}
      adminRole={validation.user.role}
    />
  );
}
