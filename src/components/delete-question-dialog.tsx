"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  answerType: "static" | "ai-validated";
  answer: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "active" | "ended";
}

interface DeleteQuestionDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteQuestion: (questionId: string) => void;
}

export function DeleteQuestionDialog({
  question,
  open,
  onOpenChange,
  onDeleteQuestion,
}: DeleteQuestionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      onDeleteQuestion(question.id);

      toast.success("Question deleted successfully", {
        description: "The riddle question has been removed from your project.",
      });

      setIsLoading(false);
    } catch (error) {
      toast.error("Error deleting question", {
        description: "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    }
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
