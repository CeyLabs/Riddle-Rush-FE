import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:3344/api";

type SupportedLanguages = "en" | "ar";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  language: SupportedLanguages;
  is_active: boolean;
}

interface Riddle {
  id: string;
  campaign_id: string;
  question: string;
  answer: string;
  is_answer_static: boolean;
  start_date: string;
  end_date: string;
}

interface LeaderboardEntry {
  id: string;
  campaign_id: string;
  username: string;
  score: number;
  completed_at: string;
  time_spent: number; // in seconds
}

export function useAllCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async (): Promise<Campaign[]> => {
      const response = await fetch(`${API_BASE_URL}/campaigns`);
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }
      return response.json();
    },
  });
}

export function useCampaignRiddles(campaignId: string) {
  return useQuery({
    queryKey: ["riddles", campaignId],
    queryFn: async (): Promise<Riddle[]> => {
      const response = await fetch(
        `${API_BASE_URL}/campaigns/${campaignId}/riddles`
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
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(
        `${API_BASE_URL}/campaigns/${campaignId}/riddles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
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
      const response = await fetch(`${API_BASE_URL}/riddles/${riddleId}`, {
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
        }
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
      const response = await fetch(`${API_BASE_URL}/riddles/${riddleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(
        `${API_BASE_URL}/campaigns/${campaignId}/leaderboard?limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return response.json();
    },
    enabled: !!campaignId, // Only fetch if campaignId is provided
  });
}
