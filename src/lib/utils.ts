import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatScore(value: number): string {
  return Math.round(value).toString();
}

export function getRiskLevel(score: number): {
  level: "Rendah" | "Sedang" | "Tinggi";
  color: string;
  badgeClass: string;
} {
  if (score >= 70) {
    return {
      level: "Tinggi",
      color: "#ef4444",
      badgeClass: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
    };
  }
  if (score >= 45) {
    return {
      level: "Sedang",
      color: "#f59e0b",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    };
  }
  return {
    level: "Rendah",
    color: "#10b981",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  };
}

