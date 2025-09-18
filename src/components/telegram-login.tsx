"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { TelegramUser } from "@/types/auth";

interface TelegramLoginProps {
  botName: string;
  buttonSize?: "large" | "medium" | "small";
  showUserPic?: boolean;
  cornerRadius?: number;
  requestAccess?: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export function TelegramLogin({
  botName,
  buttonSize = "large",
  showUserPic = true,
  cornerRadius,
  requestAccess = "write",
}: TelegramLoginProps) {
  const { login } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up the global callback
    window.onTelegramAuth = (user: TelegramUser) => {
      login(user);
    };

    // Create and append the script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", requestAccess);

    if (!showUserPic) {
      script.setAttribute("data-userpic", "false");
    }

    if (cornerRadius !== undefined) {
      script.setAttribute("data-radius", cornerRadius.toString());
    }

    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup
      if (containerRef.current && script.parentNode) {
        containerRef.current.removeChild(script);
      }
      delete window.onTelegramAuth;
    };
  }, [botName, buttonSize, showUserPic, cornerRadius, requestAccess, login]);

  return <div ref={containerRef} className="flex justify-center" />;
}
