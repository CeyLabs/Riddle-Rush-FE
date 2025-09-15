"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { questionSchema, type QuestionFormData } from "@/lib/validations";
import { toast } from "sonner";

interface Question {
  id: string;
  campaignId: string;
  question: string;
  answerType: "static" | "ai-validated";
  answer: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "active" | "ended";
}

interface EditQuestionDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditQuestion: (question: Question) => void;
}

export function EditQuestionDialog({
  question,
  open,
  onOpenChange,
  onEditQuestion,
}: EditQuestionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const answerType = watch("answerType");

  useEffect(() => {
    if (question) {
      reset({
        question: question.question,
        answerType: question.answerType,
        answer: question.answer,
        startTime: question.startTime,
        endTime: question.endTime,
      });
    }
  }, [question, reset]);

  const onSubmit = async (data: QuestionFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      onEditQuestion({
        ...question,
        ...data,
      });

      toast.success("Question updated successfully", {
        description: "Your riddle question has been updated.",
      });

      setIsLoading(false);
    } catch (error) {
      toast.error("Error updating question", {
        description: "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Update your riddle question details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter your riddle question..."
                className={`min-h-[100px] ${
                  errors.question ? "border-destructive" : ""
                }`}
                {...register("question")}
              />
              {errors.question && (
                <p className="text-sm text-destructive">
                  {errors.question.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Answer Type</Label>
              <RadioGroup
                value={answerType}
                onValueChange={(value: "static" | "ai-validated") =>
                  setValue("answerType", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="static" id="static" />
                  <Label htmlFor="static">Static Answer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ai-validated" id="ai-validated" />
                  <Label htmlFor="ai-validated">AI Validated</Label>
                </div>
              </RadioGroup>
              {errors.answerType && (
                <p className="text-sm text-destructive">
                  {errors.answerType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">
                {answerType === "static"
                  ? "Answer"
                  : "Answer Context/Description"}
              </Label>
              {answerType === "static" ? (
                <Input
                  id="answer"
                  placeholder="Enter the exact answer..."
                  className={errors.answer ? "border-destructive" : ""}
                  {...register("answer")}
                />
              ) : (
                <Textarea
                  id="answer"
                  placeholder="Describe the answer context for AI validation..."
                  className={`min-h-[80px] ${
                    errors.answer ? "border-destructive" : ""
                  }`}
                  {...register("answer")}
                />
              )}
              {errors.answer && (
                <p className="text-sm text-destructive">
                  {errors.answer.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      id="startTime"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select start date and time"
                      className={errors.startTime ? "border-destructive" : ""}
                    />
                  )}
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      id="endTime"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select end date and time"
                      className={errors.endTime ? "border-destructive" : ""}
                    />
                  )}
                />
                {errors.endTime && (
                  <p className="text-sm text-destructive">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-black hover:bg-primary/90"
            >
              {isLoading ? "Updating..." : "Update Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
