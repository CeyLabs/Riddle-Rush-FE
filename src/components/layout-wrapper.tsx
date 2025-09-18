"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

const publicRoutes = ["/login"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { auth } = useAuth();
  const router = useRouter();
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isPublicRoute && !auth.isLoading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [isPublicRoute, auth.isLoading, auth.isAuthenticated, router]);

  if (!isPublicRoute && auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isPublicRoute && !auth.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
