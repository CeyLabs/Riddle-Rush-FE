"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { campaignSchema, type CampaignFormData } from "@/lib/validations";
import { useCreateCampaign } from "@/hooks/query-hooks";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({
  open,
  onOpenChange,
}: CreateCampaignDialogProps) {
  const router = useRouter();
  const createCampaignMutation = useCreateCampaign();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      language: "en",
    },
  });

  const onSubmit = async (data: CampaignFormData) => {
    const payload = {
      name: data.name,
      description: data.description,
      language: data.language,
      is_active: true,
    };

    createCampaignMutation.mutate(payload, {
      onSuccess: (result) => {
        // Reset form and close dialog
        reset();
        onOpenChange(false);
        // Navigate to the campaign
        router.push(`/campaign/${result.id}`);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Create a new riddle campaign with a name, description, and
              language.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-8">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Campaign Name
              </Label>
              <Input
                id="name"
                placeholder="Enter campaign name..."
                {...register("name")}
                className={`transition-all duration-200 ${
                  errors.name
                    ? "border-destructive focus:ring-destructive/20"
                    : "focus:ring-primary/20"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Enter campaign description..."
                {...register("description")}
                className={`transition-all duration-200 ${
                  errors.description
                    ? "border-destructive focus:ring-destructive/20"
                    : "focus:ring-primary/20"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="language" className="text-sm font-medium">
                Language
              </Label>
              <Select
                value={watch("language")}
                onValueChange={(value) =>
                  setValue("language", value as "en" | "ar")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                  {errors.language.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createCampaignMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCampaignMutation.isPending}
              className="bg-primary text-black hover:bg-primary/90 transition-all duration-200"
            >
              {createCampaignMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
