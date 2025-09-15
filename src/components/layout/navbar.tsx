import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";

export function Navbar() {
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

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline">Login</Button>
        </div>
      </div>
    </nav>
  );
}
