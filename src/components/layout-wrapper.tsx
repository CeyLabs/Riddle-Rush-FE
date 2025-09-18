"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

const publicRoutes = ["/login"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { auth, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }

    if (pathname === "/login") {
      if (auth.isAuthenticated && isAdmin()) {
        router.replace("/");
      }
      return;
    }

    // For all other pages (protected routes)
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/login");
      return;
    }
  }, [pathname, auth.isLoading, auth.isAuthenticated, isAdmin, router]);

  // Show loading spinner while checking auth on protected routes
  if (pathname !== "/login" && auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full size-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For protected routes, don't render anything while redirecting
  if (
    pathname !== "/login" &&
    !auth.isLoading &&
    (!auth.isAuthenticated || !isAdmin())
  ) {
    return null;
  }

  return <>{children}</>;
}
