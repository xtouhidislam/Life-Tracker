import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  return new Intl.NumberFormat("en-US").format(xp);
}

export function formatCurrency(amount: number, currency = "BDT"): string {
  const symbol = currency === "BDT" ? "৳" : "$";
  return `${symbol}${new Intl.NumberFormat("en-US").format(amount)}`;
}
