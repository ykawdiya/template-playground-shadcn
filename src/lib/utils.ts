import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This utility function combines Tailwind CSS classes with proper type checking
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}