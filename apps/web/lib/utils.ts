import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEmailDate(emailDate: string): string {
  const date = new Date(emailDate);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  } else if (isThisYear) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}
