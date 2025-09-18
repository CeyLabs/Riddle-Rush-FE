"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Clock,
  FileText,
  Trophy,
  Bitcoin,
  Grid3X3,
  List,
} from "lucide-react";
import { CreateCampaignDialog } from "@/components/create-campaign-dialog";
import { getStatusColor, getStatusTextColor } from "@/lib/utils";
import { useAllCampaigns } from "@/hooks/query-hooks";
import Link from "next/link";

export function CampaignGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: campaigns = [], isLoading, error, refetch } = useAllCampaigns();

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayStatus = (isActive: boolean) =>
    isActive ? "active" : "draft";

  const isBlockchainProject = (name: string) => {
    const blockchainKeywords = [
      "blockchain",
      "crypto",
      "bitcoin",
      "ethereum",
      "defi",
      "nft",
      "web3",
    ];
    return blockchainKeywords.some((keyword) =>
      name.toLowerCase().includes(keyword)
    );
  };

  const CampaignSkeleton = () => (
    <Card className="h-48">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="size-4" />
        </div>
      </CardContent>
    </Card>
  );

  const CampaignListSkeleton = () => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search campaigns..."
              className="pl-10"
              disabled
            />
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-black rounded-r-none border-r-0"
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-black rounded-l-none"
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CampaignSkeleton />
            <CampaignSkeleton />
            <CampaignSkeleton />
          </div>
        ) : (
          <div className="space-y-4">
            <CampaignListSkeleton />
            <CampaignListSkeleton />
            <CampaignListSkeleton />
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
          <FileText className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load campaigns</h3>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "Something went wrong while fetching campaigns."}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`rounded-r-none border-r-0 ${
              viewMode === "grid"
                ? "bg-primary hover:bg-primary/90 text-black"
                : ""
            }`}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={`rounded-l-none ${
              viewMode === "list"
                ? "bg-primary hover:bg-primary/90 text-black"
                : ""
            }`}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Campaigns Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card
            className="border-dashed border-2 border-primary cursor-pointer transition-all duration-200 h-48 group"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-200 group-hover:bg-primary/20">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                  Create New Campaign
                </h3>
              </div>
            </CardContent>
          </Card>

          {filteredCampaigns.map((campaign) => (
            <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-48 group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {campaign.name}
                      </CardTitle>
                      {isBlockchainProject(campaign.name) && (
                        <Bitcoin className="size-4 text-primary" />
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(
                        getDisplayStatus(campaign.is_active)
                      )} ${getStatusTextColor(
                        getDisplayStatus(campaign.is_active)
                      )} transition-colors duration-200`}
                    >
                      {getDisplayStatus(campaign.is_active)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <span className="text-muted-foreground">
                        Language: {campaign.language.toUpperCase()}
                      </span>
                    </span>
                    {campaign.description && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {campaign.description}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center space-x-1">
                      <FileText className="size-4" />
                      <span>0 questions</span>
                    </span>
                    <Clock className="size-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <Card
            className="border-dashed border-2 border-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 p-4 group"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                  Create New Campaign
                </h3>
              </div>
            </div>
          </Card>

          {filteredCampaigns.map((campaign) => (
            <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer p-4 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-200">
                        {campaign.name}
                      </h3>
                      {isBlockchainProject(campaign.name) && (
                        <Bitcoin className="size-4 text-primary" />
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(
                        getDisplayStatus(campaign.is_active)
                      )} ${getStatusTextColor(
                        getDisplayStatus(campaign.is_active)
                      )} transition-colors duration-200`}
                    >
                      {getDisplayStatus(campaign.is_active)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <span>Language: {campaign.language.toUpperCase()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FileText className="size-4" />
                      <span>0 questions</span>
                    </span>
                    <Trophy className="size-4 group-hover:text-primary transition-colors duration-200" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {filteredCampaigns.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No campaigns found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or create a new campaign.
          </p>
        </div>
      )}

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
