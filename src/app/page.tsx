import { CampaignGrid } from "@/components/campaign-grid"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to RiddleRush</h1>
          <p className="text-muted-foreground text-lg">Create and manage your riddle campaigns with ease</p>
        </div>
        <CampaignGrid />
      </main>
    </div>
  )
}