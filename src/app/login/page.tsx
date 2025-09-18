"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TelegramLogin } from "@/components/telegram-login";
import { useAuth } from "@/providers/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isAuthenticated, router]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to RiddleRush
          </CardTitle>
          <CardDescription>
            Sign in with your Telegram account to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <TelegramLogin
              botName={
                process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "YOUR_BOT_NAME"
              }
              buttonSize="large"
              showUserPic={true}
              cornerRadius={8}
            />
          </div>
          <div className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
            Only authenticated users can access RiddleRush campaigns.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
