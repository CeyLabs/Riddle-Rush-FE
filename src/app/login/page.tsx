"use client";

import { useEffect, useState } from "react";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { auth, isAdmin } = useAuth();
  const router = useRouter();
  const [showRoleError, setShowRoleError] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (isAdmin()) {
        // User is admin, redirect to home
        router.push("/");
      } else {
        // User is not admin, show error and stay on login page
        setShowRoleError(true);
      }
    }
  }, [auth.isAuthenticated, isAdmin, router]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to RiddleRush
          </CardTitle>
          <CardDescription>
            {auth.isAuthenticated 
              ? "Authentication successful"
              : "Sign in with your Telegram account to access the platform"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showRoleError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
               You do not have the necessary permissions to access this platform.
              </AlertDescription>
            </Alert>
          )}
          
          {auth.isAuthenticated ? (
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Logged in as: <strong>{auth.user?.first_name} (@{auth.user?.username})</strong>
              </div>
            </div>
          ) : (
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
          )}
          
          <div className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
            Only authenticated admin users can access RiddleRush campaigns.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
