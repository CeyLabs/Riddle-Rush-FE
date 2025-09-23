import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SupportedLanguages } from "@/hooks/query-hooks";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  return `${day} ${month} ${year} ${hours12}:${minutes} ${ampm}`;
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function getRankIcon(index: number): string {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return `#${index + 1}`;
  }
}

export function getScoreColor(score: number): string {
  if (score >= 95) return "text-yellow-500";
  if (score >= 85) return "text-green-500";
  if (score >= 70) return "text-blue-500";
  return "text-muted-foreground";
}

// Question status utilities
export function isQuestionEnded(endDate: string): boolean {
  const now = new Date();
  const end = new Date(endDate);
  return now > end;
}

export function getQuestionStatus(
  startDate: string,
  endDate: string
): "upcoming" | "ongoing" | "ended" {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "upcoming";
  } else if (now >= start && now <= end) {
    return "ongoing";
  } else {
    return "ended";
  }
}

export function isQuestionEditable(
  startDate: string,
  endDate: string
): boolean {
  return getQuestionStatus(startDate, endDate) === "upcoming";
}

export function getLanguageText(languageCode: SupportedLanguages): string {
  const languageMap: Record<string, string> = {
    en: "English",
    ar: "Arabic",
  };

  return languageMap[languageCode.toLowerCase()] || languageCode.toUpperCase();
}
