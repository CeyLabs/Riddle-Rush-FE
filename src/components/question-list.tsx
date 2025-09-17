"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AddQuestionDialog } from "@/components/add-question-dialog";
import { EditQuestionDialog } from "@/components/edit-question-dialog";
import { DeleteQuestionDialog } from "@/components/delete-question-dialog";
import { formatDate, getStatusColor, getStatusTextColor } from "@/lib/utils";
import { useCampaignRiddles, useDeleteRiddle } from "@/hooks/query-hooks";

interface Question {
  id: string;
  campaign_id: string;
  question: string;
  answer: string;
  is_answer_static: boolean;
  start_date: string;
  end_date: string;
}

interface QuestionListProps {
  campaignId: string;
}

export function QuestionList({ campaignId }: QuestionListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(
    null
  );

  const {
    data: questions = [],
    isLoading,
    error,
  } = useCampaignRiddles(campaignId);

  const deleteRiddleMutation = useDeleteRiddle();

  const getStatusIcon = (
    isActive: boolean,
    startDate: string,
    endDate: string
  ) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return <AlertCircle className="size-4" />; // upcoming
    } else if (now >= start && now <= end) {
      return <Clock className="size-4" />; // active
    } else {
      return <CheckCircle className="size-4" />; // ended
    }
  };

  const getQuestionStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "upcoming";
    } else if (now >= start && now <= end) {
      return "active";
    } else {
      return "ended";
    }
  };

  const handleAddQuestion = (
    newQuestion: Omit<Question, "id" | "campaign_id">
  ) => {
    // This is now handled by the mutation in add-question-dialog
    console.log("Question added:", newQuestion);
  };

  const handleEditQuestion = (updatedQuestion: Question) => {
    // TODO: Implement edit question API call
    console.log("Question updated:", updatedQuestion);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (question: Question) => {
    deleteRiddleMutation.mutate({
      riddleId: question.id,
      campaignId,
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load questions</h3>
        <p className="text-muted-foreground mb-4">
          {error.message || "Something went wrong while fetching questions."}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = formatDate(dateString);
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} at ${time}`;
  };

  const QuestionSkeleton = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          <QuestionSkeleton />
          <QuestionSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Questions</h2>
          <p className="text-muted-foreground">
            Manage your riddle questions and their schedules
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary text-black hover:bg-primary/90 transition-all duration-200 hover:scale-101"
        >
          <Plus className="size-4 mr-2" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors duration-200">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">
                No questions yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Add your first riddle question to get started
              </p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-black hover:bg-primary/90 transition-all duration-200 hover:scale-105"
            >
              Add Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questions.map((question, index) => (
            <Card
              key={question.id}
              className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group gap-3"
            >
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start space-x-3">
                      <Badge
                        variant="outline"
                        className="text-xs font-mono bg-primary/10 text-primary border-primary/30"
                      >
                        Q{index + 1}
                      </Badge>
                      <CardTitle className="text-lg leading-relaxed group-hover:text-primary transition-colors duration-200 flex-1">
                        {question.question}
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 ml-12">
                      <Badge variant="outline" className="text-xs">
                        {question.is_answer_static
                          ? "Static Answer"
                          : "AI Validated"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(
                          getQuestionStatus(
                            question.start_date,
                            question.end_date
                          )
                        )} ${getStatusTextColor(
                          getQuestionStatus(
                            question.start_date,
                            question.end_date
                          )
                        )} text-xs transition-colors duration-200`}
                      >
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(
                            question.is_answer_static,
                            question.start_date,
                            question.end_date
                          )}
                          <span className="capitalize">
                            {getQuestionStatus(
                              question.start_date,
                              question.end_date
                            )}
                          </span>
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(question)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingQuestion(question)}
                      disabled={deleteRiddleMutation.isPending}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="ml-12">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Answer:
                    </p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg border-l-4 border-primary/30">
                      {question.answer}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground ml-12">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Start: {formatDate(question.start_date)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>End: {formatDate(question.end_date)}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddQuestionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        campaignId={campaignId}
      />

      {deletingQuestion && (
        <DeleteQuestionDialog
          question={deletingQuestion}
          open={!!deletingQuestion}
          onOpenChange={(open) => !open && setDeletingQuestion(null)}
          onDeleteQuestion={handleDeleteQuestion}
          isLoading={deleteRiddleMutation.isPending}
        />
      )}

      {/* TODO: Update EditQuestionDialog to work with new API interface */}
      {/* {editingQuestion && (
        <EditQuestionDialog
          question={editingQuestion}
          open={!!editingQuestion}
          onOpenChange={(open) => !open && setEditingQuestion(null)}
          onEditQuestion={handleEditQuestion}
        />
      )} */}
    </div>
  );
}
