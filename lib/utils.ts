import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function formatFullName(
  fname?: string | null, 
  mname?: string | null, 
  lname?: string | null, 
  suffix?: string | null
) {
  if (!fname && !lname) return "Unknown";
  
  const mInitial = mname ? `${mname.charAt(0)}. ` : "";
  const suf = suffix ? `, ${suffix}` : "";
  
  return `${fname || ""} ${mInitial}${lname || ""}${suf}`.trim();
}