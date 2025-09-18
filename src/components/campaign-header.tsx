"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { getStatusColor, getStatusTextColor, formatDate } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  status: "active" | "completed" | "draft";
  description?: string;
}

interface CampaignHeaderProps {
  campaign: Campaign;
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-foreground">
              {campaign.name}
            </h1>
            <Badge
              variant="secondary"
              className={`${getStatusColor(
                campaign.status
              )} ${getStatusTextColor(campaign.status)}`}
            >
              {campaign.status}
            </Badge>
          </div>

          {campaign.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {campaign.description}
            </p>
          )}

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span className="flex items-center space-x-2">
              <Calendar className="size-4" />
              <span>Created {formatDate(campaign.createdAt)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
