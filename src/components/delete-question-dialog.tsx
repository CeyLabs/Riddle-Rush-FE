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
import { isQuestionEditable, getQuestionStatus } from "@/lib/utils";
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

  const isEditable = isQuestionEditable(question.start_date, question.end_date);
  const questionStatus = getQuestionStatus(
    question.start_date,
    question.end_date
  );

  const handleDeleteQuestion = (question: Question) => {
    if (!isEditable) {
      return; // Prevent deletion of non-upcoming questions
    }
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
            <AlertTriangle
              className={`w-5 h-5 ${
                !isEditable ? "text-amber-500" : "text-destructive"
              }`}
            />
            <DialogTitle>
              {!isEditable ? "Cannot Delete Question" : "Delete Question"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {!isEditable
              ? `This question is currently ${questionStatus} and cannot be deleted. Only upcoming questions can be modified or deleted.`
              : "Are you sure you want to delete this question? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div
            className={`p-3 rounded-lg ${
              !isEditable ? "bg-amber-50 border border-amber-200" : "bg-muted"
            }`}
          >
            <p className="text-sm font-medium text-foreground mb-1">
              Question:
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {question.question}
            </p>
            {!isEditable && (
              <div className="mt-2 pt-2 border-t border-amber-200">
                <p className="text-xs text-amber-700 font-medium">
                  Status:{" "}
                  {questionStatus.charAt(0).toUpperCase() +
                    questionStatus.slice(1)}
                  {questionStatus === "ended" &&
                    ` on ${new Date(question.end_date).toLocaleDateString()}`}
                  {questionStatus === "active" && " - In Progress"}
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteRiddleMutation.isPending}
          >
            {!isEditable ? "Close" : "Cancel"}
          </Button>
          {isEditable && (
            <Button
              variant="destructive"
              onClick={() => handleDeleteQuestion(question)}
              disabled={deleteRiddleMutation.isPending}
            >
              {deleteRiddleMutation.isPending
                ? "Deleting..."
                : "Delete Question"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
