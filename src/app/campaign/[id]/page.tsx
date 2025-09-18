import { Navbar } from "@/components/layout/navbar";
import { CampaignHeader } from "@/components/campaign-header";
import { QuestionList } from "@/components/question-list";
import { CampaignLeaderboard } from "@/components/campaign-leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

const getCampaign = (id: string) => ({
  id,
  name:
    id === "1"
      ? "Math Riddles Challenge"
      : id === "2"
      ? "Logic Puzzles"
      : id === "4"
      ? "Blockchain & Crypto Quiz"
      : "New Campaign",
  createdAt: "2024-01-15",
  status: "active" as const,
  description:
    "A collection of challenging riddles to test your problem-solving skills",
});

// Use Next.js PageProps for dynamic route typing
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <CampaignHeader campaign={campaign} />

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
            <Suspense fallback={<div>Loading questions...</div>}>
              <QuestionList campaignId={id} />
            </Suspense>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Suspense fallback={<div>Loading leaderboard...</div>}>
              <CampaignLeaderboard campaignId={id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
