"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthState, TelegramUser, User } from "@/types/auth";
import { authenticateWithBackend } from "@/services/auth";

const AuthContext = createContext<{
  auth: AuthState;
  login: (user: TelegramUser) => void;
  logout: () => void;
  isAdmin: () => boolean;
  requireAdmin: () => boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        setAuth({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        setAuth({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuth({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (user: TelegramUser) => {
    setAuth((prev) => ({ ...prev, isLoading: true }));

    try {
      // Authenticate with backend
      const authResponse = await authenticateWithBackend(user);

      if (
        authResponse.success &&
        authResponse.access_token &&
        authResponse.user
      ) {
        // Store auth token
        localStorage.setItem("auth_token", authResponse.access_token);

        // Store user data (the backend user with role)
        const userData = JSON.stringify(authResponse.user);
        localStorage.setItem("user", userData);

        setAuth({
          user: authResponse.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(authResponse.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuth({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      // You might want to show a toast notification here
      alert("Login failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");

    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const isAdmin = () => {
    return auth.user?.role === "admin";
  };

  const requireAdmin = () => {
    if (!auth.isAuthenticated || !auth.user) {
      router.push("/login");
      return false;
    }

    if (!isAdmin()) {
      // Don't show alert, let the login page handle the error display
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isAdmin, requireAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
