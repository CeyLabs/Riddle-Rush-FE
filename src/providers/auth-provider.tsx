"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthState, TelegramUser } from "@/types/auth";

const AuthContext = createContext<{
  auth: AuthState;
  login: (user: TelegramUser) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("telegram_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);

        // Also ensure cookie is set if it's missing
        const cookieExists = document.cookie.includes("telegram_user=");
        if (!cookieExists) {
          document.cookie = `telegram_user=${encodeURIComponent(stored)}; path=/; max-age=2592000; SameSite=Lax`;
        }

        setAuth({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem("telegram_user");
        document.cookie = "telegram_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setAuth((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuth((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (user: TelegramUser) => {
    const userData = JSON.stringify(user);

    // Store in localStorage
    localStorage.setItem("telegram_user", userData);

    // Also set cookie for middleware
    document.cookie = `telegram_user=${encodeURIComponent(userData)}; path=/; max-age=2592000; SameSite=Lax`;

    setAuth({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("telegram_user");

    // Also remove cookie
    document.cookie = "telegram_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
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
