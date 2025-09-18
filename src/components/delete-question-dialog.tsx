"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteRiddle } from "@/hooks/query-hooks";
import { AlertTriangle } from "lucide-react";

interface Question {
  id: string;
  campaign_id: string;
  question: string;
  answer: string;
  is_answer_static: boolean;
  start_date: string;
  end_date: string;
}

interface DeleteQuestionDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteQuestionDialog({
  question,
  open,
  onOpenChange,
}: DeleteQuestionDialogProps) {
  const deleteRiddleMutation = useDeleteRiddle();

  const handleDeleteQuestion = (question: Question) => {
    deleteRiddleMutation.mutate({
      riddleId: question.id,
      campaignId: question.campaign_id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <DialogTitle>Delete Question</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this question? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">
              Question:
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {question.question}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteRiddleMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteQuestion(question)}
            disabled={deleteRiddleMutation.isPending}
          >
            {deleteRiddleMutation.isPending ? "Deleting..." : "Delete Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
