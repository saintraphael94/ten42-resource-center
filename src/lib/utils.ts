import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format monetary amounts in Nigerian Naira (NGN)
 */
export function formatCurrency(amount: number, currency = "NGN"): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₦${amount.toLocaleString()}`;
  }
}

/**
 * Format timestamps consistently with Africa/Lagos reference
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    if (!isValid(d)) return "—";
    return format(d, "MMM dd, yyyy h:mm a");
  } catch {
    return String(dateInput);
  }
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    if (!isValid(d)) return "—";
    return format(d, "MMM dd, yyyy");
  } catch {
    return String(dateInput);
  }
}

export function formatTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    if (!isValid(d)) return "—";
    return format(d, "h:mm a");
  } catch {
    return String(dateInput);
  }
}

