"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAnnounceWinners,
  useCampaignLeaderboard,
  useCampaignExclusions,
  WinnerAnnouncementResult,
} from "@/hooks/query-hooks";
import { Trophy, UserX, Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnnounceWinnersDialogProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnnounceWinnersDialog({
  campaignId,
  open,
  onOpenChange,
}: AnnounceWinnersDialogProps) {
  const [maxWinners, setMaxWinners] = useState<number>(10);
  const [excludedUserIds, setExcludedUserIds] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [announcementResult, setAnnouncementResult] =
    useState<WinnerAnnouncementResult | null>(null);

  const { data: leaderboard = [] } = useCampaignLeaderboard(campaignId);
  const { data: existingExclusions = [] } = useCampaignExclusions(campaignId);
  const announceWinners = useAnnounceWinners();

  const handleAnnounce = async () => {
    const userIdsArray = excludedUserIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    try {
      const result = await announceWinners.mutateAsync({
        campaignId,
        payload: {
          excludedUserIds: userIdsArray,
          maxWinners,
          customMessage: customMessage || undefined,
        },
      });

      setAnnouncementResult(result);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to announce winners:", error);
    }
  };

  const handleClose = () => {
    setShowResults(false);
    setAnnouncementResult(null);
    setExcludedUserIds("");
    setCustomMessage("");
    setMaxWinners(10);
    onOpenChange(false);
  };

  if (showResults && announcementResult) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Winners Announced!</span>
            </DialogTitle>
            <DialogDescription>
              Successfully announced {announcementResult.winners.length}{" "}
              winner(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span>Total Participants</span>
                </div>
                <div className="text-2xl font-bold">
                  {announcementResult.totalParticipants}
                </div>
              </div>
              <div className="p-3 bg-yellow-500/5 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                  <Trophy className="w-4 h-4" />
                  <span>Winners</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {announcementResult.winners.length}
                </div>
              </div>
              <div className="p-3 bg-destructive/5 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                  <UserX className="w-4 h-4" />
                  <span>Excluded</span>
                </div>
                <div className="text-2xl font-bold text-destructive">
                  {announcementResult.excludedCount}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Winner List</span>
              </h3>
              <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                {announcementResult.winners.map((winner, index) => (
                  <div
                    key={winner.user_id}
                    className="p-3 flex items-center justify-between hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                                ? "bg-orange-600 text-white"
                                : "bg-muted"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{winner.name}</div>
                        <div className="text-sm text-muted-foreground">
                          @{winner.username}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {winner.total_score}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        points
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span>Announce Winners</span>
          </DialogTitle>
          <DialogDescription>
            Configure winner selection and exclude users if needed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {existingExclusions.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {existingExclusions.length} user(s) are already excluded from
                this campaign
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="maxWinners">Maximum Winners</Label>
            <Input
              id="maxWinners"
              type="number"
              min={1}
              max={100}
              value={maxWinners}
              onChange={(e) => setMaxWinners(parseInt(e.target.value) || 1)}
              placeholder="10"
            />
            <p className="text-sm text-muted-foreground">
              Total participants: {leaderboard.length}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excludedUsers">
              Exclude Users (Optional)
            </Label>
            <Textarea
              id="excludedUsers"
              value={excludedUserIds}
              onChange={(e) => setExcludedUserIds(e.target.value)}
              placeholder="Enter user IDs separated by commas (e.g., 12345, 67890)"
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              These users will be excluded from winning in addition to any
              existing exclusions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customMessage">
              Custom Message (Optional)
            </Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom message for the winners announcement..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={announceWinners.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAnnounce}
            disabled={announceWinners.isPending || maxWinners < 1}
          >
            {announceWinners.isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Announcing...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Announce Winners
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
