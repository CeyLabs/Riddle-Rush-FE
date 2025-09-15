import { CampaignGrid } from "@/components/campaign-grid";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <CampaignGrid />
      </main>
    </div>
  );
}
