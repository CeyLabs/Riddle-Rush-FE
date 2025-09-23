"use client";

import { Navbar } from "@/components/layout/navbar";
import { QuestionList } from "@/components/question-list";
import { CampaignLeaderboard } from "@/components/campaign-leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, use } from "react";
import { useCampaign } from "@/hooks/query-hooks";

export default function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: campaign, isLoading, error } = useCampaign(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div>Loading campaign...</div>
        </main>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div>Failed to load campaign</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-x-4">
          <h1 className="text-3xl font-bold text-foreground">
            {campaign.name}
          </h1>
          {campaign.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {campaign.description}
            </p>
          )}
        </div>

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
