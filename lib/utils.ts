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

export function numbersOnly(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
  
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

export function namesOnly(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
  
  if (!/^[a-zA-Z\s\.\-ñÑ]$/.test(e.key)) {
    e.preventDefault();
  }
}

export function gradesOnly(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;

  const target = e.currentTarget;
  const start = target.selectionStart || 0;
  const end = target.selectionEnd || 0;
  const nextValue = target.value.substring(0, start) + e.key + target.value.substring(end);
  const validGradePattern = /^([0-9]+(\.[0-9]*)?|I(N(C)?)?|D(R(P)?)?)$/i;

  if (!validGradePattern.test(nextValue)) {
    e.preventDefault(); 
  }
}