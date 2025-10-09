import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { makeAuthenticatedRequest } from "@/services/auth";

export type SupportedLanguages = "en" | "ar";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  language: SupportedLanguages;
}

interface CampaignAPIData extends Campaign {
    question_count: number;
  status: "upcoming" | "ongoing" | "ended";
}

export interface Riddle {
  id: string;
  campaign_id: string;
  question: string;
  answer: string;
  is_answer_static: boolean;
  start_date: string;
  end_date: string;
}

interface LeaderboardEntry {
  user_id: string;
  name: string;
  username: string;
  total_score: number;
}

export interface CampaignExclusion {
  id: string;
  campaign_id: string;
  user_id: string;
  excluded_by: string;
  reason?: string;
  excluded_at: string;
}

export interface WinnerAnnouncementResult {
  winners: LeaderboardEntry[];
  announcementId: string;
  totalParticipants: number;
  excludedCount: number;
}

export interface AnnounceWinnersPayload {
  excludedUserIds?: string[];
  maxWinners?: number;
  customMessage?: string;
}

export function useAllCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async (): Promise<CampaignAPIData[]> => {
      const response = await makeAuthenticatedRequest("/campaigns");
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }
      return response.json();
    },
  });
}

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async (): Promise<CampaignAPIData> => {
      const response = await makeAuthenticatedRequest(`/campaigns/${campaignId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch campaign");
      }
      return response.json();
    },
    enabled: !!campaignId, // Only fetch if campaignId is provided
  });
}

export function useCampaignRiddles(campaignId: string) {
  return useQuery<Riddle[], Error>({
    queryKey: ["riddles", campaignId],
    queryFn: async (): Promise<Riddle[]> => {
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/riddles`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch riddles");
      }
      return response.json();
    },
    enabled: !!campaignId, // Only fetch if campaignId is provided
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Campaign, "id">) => {
      const response = await makeAuthenticatedRequest("/campaigns", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create campaign");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch campaigns list
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully", {
        description: `"${data.name}" has been created and is ready for questions.`,
      });
    },
    onError: (error) => {
      toast.error("Error creating campaign", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

export function useCreateRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      data,
    }: {
      campaignId: string;
      data: Omit<Riddle, "id" | "campaign_id">;
    }) => {
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/riddles`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create riddle");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch riddles list for this campaign
      queryClient.invalidateQueries({
        queryKey: ["riddles", variables.campaignId],
      });
      toast.success("Riddle created successfully", {
        description: `"${data.question}" has been added to the campaign.`,
      });
    },
    onError: (error) => {
      toast.error("Error creating riddle", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

export function useDeleteRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      riddleId,
      campaignId,
    }: {
      riddleId: string;
      campaignId: string;
    }) => {
      const response = await makeAuthenticatedRequest(`/riddles/${riddleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete riddle");
      }

      return { riddleId, campaignId };
    },
    onSuccess: (data) => {
      // Optimistically remove the deleted riddle from cache
      queryClient.setQueryData(
        ["riddles", data.campaignId],
        (old: Riddle[] | undefined) => {
          if (!old) return old;
          return old.filter((riddle) => riddle.id !== data.riddleId);
        },
      );

      // Invalidate and refetch riddles list for this campaign
      queryClient.invalidateQueries({
        queryKey: ["riddles", data.campaignId],
      });
      toast.success("Riddle deleted successfully", {
        description: "The riddle has been removed from the campaign.",
      });
    },
    onError: (error) => {
      toast.error("Error deleting riddle", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

export function useUpdateRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      riddleId,
      campaignId,
      data,
    }: {
      riddleId: string;
      campaignId: string;
      data: Partial<Omit<Riddle, "id" | "campaign_id">>;
    }) => {
      const response = await makeAuthenticatedRequest(`/riddles/${riddleId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update riddle");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch riddles list for this campaign
      queryClient.invalidateQueries({
        queryKey: ["riddles", variables.campaignId],
      });
      toast.success("Riddle updated successfully", {
        description: "The riddle has been updated.",
      });
    },
    onError: (error) => {
      toast.error("Error updating riddle", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

export function useCampaignLeaderboard(campaignId: string) {
  return useQuery({
    queryKey: ["leaderboard", campaignId],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/leaderboard?limit=10`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return response.json();
    },
    enabled: !!campaignId, // Only fetch if campaignId is provided
  });
}

// Get campaign exclusions
export function useCampaignExclusions(campaignId: string) {
  return useQuery({
    queryKey: ["exclusions", campaignId],
    queryFn: async (): Promise<CampaignExclusion[]> => {
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/exclusions`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exclusions");
      }
      return response.json();
    },
    enabled: !!campaignId,
  });
}

// Get filtered leaderboard with exclusions
export function useFilteredLeaderboard(
  campaignId: string,
  excludedUserIds: string[] = [],
  limit?: number,
) {
  return useQuery({
    queryKey: ["leaderboard", "filtered", campaignId, excludedUserIds, limit],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const params = new URLSearchParams();
      if (excludedUserIds.length > 0) {
        params.append("excludedUserIds", excludedUserIds.join(","));
      }
      if (limit) {
        params.append("limit", limit.toString());
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/leaderboard/filtered${queryString}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filtered leaderboard");
      }
      return response.json();
    },
    enabled: !!campaignId,
  });
}

// Exclude users from campaign
export function useExcludeUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      excludedUserIds,
      reason,
    }: {
      campaignId: string;
      excludedUserIds: string[];
      reason?: string;
    }) => {
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/exclusions`,
        {
          method: "POST",
          body: JSON.stringify({ excludedUserIds, reason }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to exclude users");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["exclusions", variables.campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["leaderboard", "filtered", variables.campaignId],
      });
      toast.success("Users excluded successfully", {
        description: `${variables.excludedUserIds.length} user(s) have been excluded from the campaign.`,
      });
    },
    onError: (error) => {
      toast.error("Error excluding users", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

// Remove user exclusion
export function useRemoveExclusion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      userId,
    }: {
      campaignId: string;
      userId: string;
    }) => {
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/exclusions/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove exclusion");
      }

      return { campaignId, userId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["exclusions", data.campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["leaderboard", "filtered", data.campaignId],
      });
      toast.success("Exclusion removed", {
        description: "User has been re-included in the campaign.",
      });
    },
    onError: (error) => {
      toast.error("Error removing exclusion", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

// Announce winners
export function useAnnounceWinners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      payload,
    }: {
      campaignId: string;
      payload: AnnounceWinnersPayload;
    }) => {
      const response = await makeAuthenticatedRequest(
        `/campaigns/${campaignId}/winners/announce`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to announce winners");
      }

      return response.json();
    },
    onSuccess: (data: WinnerAnnouncementResult, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["exclusions", variables.campaignId],
      });
      toast.success("Winners announced successfully!", {
        description: `${data.winners.length} winner(s) announced out of ${data.totalParticipants} participants.`,
      });
    },
    onError: (error) => {
      toast.error("Error announcing winners", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}
