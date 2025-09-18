import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
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

  return `${day} ${month} ${year}`;
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500 hover:bg-green-600";
    case "completed":
    case "ended":
      return "bg-blue-500 hover:bg-blue-600";
    case "draft":
    case "upcoming":
      return "bg-yellow-500 hover:bg-yellow-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

export function getStatusTextColor(status: string) {
  switch (status) {
    case "draft":
    case "upcoming":
      return "text-black"; // Black text on yellow background for better contrast
    case "completed":
    case "ended":
      return "text-white"; // White text on blue background
    case "active":
    default:
      return "text-white"; // White text for green and other status colors
  }
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
