import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:3000/api";

type SupportedLanguages = "en" | "ar";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  language: SupportedLanguages;
  is_active: boolean;
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
