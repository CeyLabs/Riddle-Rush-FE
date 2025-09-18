import { z } from "zod";

export const campaignSchema = z.object({
  name: z
    .string()
    .min(1, "Campaign name is required")
    .min(3, "Campaign name must be at least 3 characters")
    .max(50, "Campaign name must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  language: z.enum(["en", "ar"], {
    message: "Please select a language",
  }),
});

export const questionSchema = z
  .object({
    question: z
      .string()
      .min(1, "Question is required")
      .min(10, "Question must be at least 10 characters")
      .max(500, "Question must be less than 500 characters"),
    answerType: z.enum(["static", "ai-validated"]),
    answer: z.string().min(1, "Answer is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      if (data.answerType === "static") {
        return data.answer.length >= 1 && data.answer.length <= 100;
      }
      return data.answer.length >= 10 && data.answer.length <= 300;
    },
    {
      message: "Answer length is invalid for the selected type",
      path: ["answer"],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return start < end;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const now = new Date();
      return start >= now;
    },
    {
      message: "Start time must be in the future",
      path: ["startTime"],
    },
  );

export type CampaignFormData = z.infer<typeof campaignSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
