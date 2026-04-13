"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { DashboardSkeleton } from "@/components/Skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading skeleton while checking auth
  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  // Only redirect if we're sure the user is NOT authenticated
  // and there is NO token in localStorage
  if (!isAuthenticated) {
    const hasToken = typeof window !== "undefined" && localStorage.getItem("token");
    if (!hasToken) {
      window.location.href = "/login";
      return (
        <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center">
          <p className="text-white/60">Redirecting...</p>
        </div>
      );
    }
    // Token exists but user not set yet — still loading, show skeleton
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 p-4 lg:p-6">
        <aside>
          <Sidebar />
        </aside>
        <main className="py-8">{children}</main>
      </div>
    </div>
  );
}
