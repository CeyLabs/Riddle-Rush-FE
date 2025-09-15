import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-binance-yellow rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <span className="text-black font-bold text-lg">R</span>
          </div>
          <span className="text-2xl font-bold text-foreground group-hover:text-binance-yellow transition-colors duration-200">
            RiddleRush
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="outline"
            className="border-binance-yellow text-binance-yellow hover:bg-binance-yellow hover:text-black bg-transparent transition-all duration-200 hover:scale-105"
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}
