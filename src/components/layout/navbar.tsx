"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { auth, logout, isAdmin } = useAuth();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">R</span>
          </div>
          <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
            RiddleRush
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {auth.isAuthenticated ? (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="size-8 rounded-md">
                  <AvatarFallback>
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="flex items-center space-x-3 p-4 border-b">
                  <Avatar className="size-12 rounded-md">
                    <AvatarFallback>
                      <User className="size-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {auth.user?.first_name}
                    </p>
                    {auth.user?.username && (
                      <p className="text-xs text-muted-foreground">
                        @{auth.user.username}
                      </p>
                    )}
                    {auth.user && (
                      <p className="text-xs text-muted-foreground capitalize">
                        Role: {auth.user.role}
                        {isAdmin() && " 👑"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-none ring-0"
                    onClick={logout}
                    autoFocus={false}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
