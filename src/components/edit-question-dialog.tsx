"use client";

import { useEffect } from "react";
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
import { useUpdateRiddle } from "@/hooks/query-hooks";

interface Question {
  id: string;
  campaign_id: string;
  question: string;
  answer: string;
  is_answer_static: boolean;
  start_date: string;
  end_date: string;
}

interface EditQuestionDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditQuestionDialog({
  question,
  open,
  onOpenChange,
}: EditQuestionDialogProps) {
  const updateRiddleMutation = useUpdateRiddle();

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
        answerType: question.is_answer_static ? "static" : "ai-validated",
        answer: question.answer,
        startTime: question.start_date,
        endTime: question.end_date,
      });
    }
  }, [question, reset]);

  const onSubmit = async (data: QuestionFormData) => {
    const riddleData = {
      question: data.question,
      answer: data.answer,
      is_answer_static: data.answerType === "static",
      start_date: data.startTime,
      end_date: data.endTime,
    };

    updateRiddleMutation.mutate(
      {
        riddleId: question.id,
        campaignId: question.campaign_id,
        data: riddleData,
      },
      {
        onSuccess: () => {
          // Reset form and close dialog
          reset();
          onOpenChange(false);
        },
      }
    );
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
              disabled={updateRiddleMutation.isPending}
              className="bg-primary text-black hover:bg-primary/90"
            >
              {updateRiddleMutation.isPending
                ? "Updating..."
                : "Update Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
