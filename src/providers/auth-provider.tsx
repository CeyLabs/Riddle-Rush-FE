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
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

        // Combine backend user data with Telegram photo URL
        const userWithPhoto = {
          ...authResponse.user,
          photo_url: user.photo_url, // Use Telegram photo URL
        };

        // Store combined user data
        const userData = JSON.stringify(userWithPhoto);
        localStorage.setItem("user", userData);

        setAuth({
          user: userWithPhoto,
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

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAdmin }}>
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
