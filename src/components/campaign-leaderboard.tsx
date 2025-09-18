"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Clock, Calendar } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { getRankIcon, getScoreColor } from "@/lib/utils";
import { useCampaignLeaderboard } from "@/hooks/query-hooks";

interface CampaignLeaderboardProps {
  campaignId: string;
}

export function CampaignLeaderboard({ campaignId }: CampaignLeaderboardProps) {
  const {
    data: leaderboard = [],
    isLoading,
    error,
  } = useCampaignLeaderboard(campaignId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Leaderboard</span>
          </CardTitle>
          <CardDescription>Top performers for this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Leaderboard</span>
          </CardTitle>
          <CardDescription>Top performers for this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load leaderboard</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try again later
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Leaderboard</span>
          </CardTitle>
          <CardDescription>Top performers for this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No participants yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to complete this challenge!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span>Leaderboard</span>
        </CardTitle>
        <CardDescription>Top performers for this campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${
                index === 0
                  ? "bg-primary/5 border-primary/20"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                  {getRankIcon(index)}
                </div>
                <div>
                  <h4 className="font-semibold">{entry.username}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(entry.completed_at)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(entry.time_spent)}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${getScoreColor(entry.score)}`}
                >
                  {entry.score}
                </div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
