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
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

export function namesOnly(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^[a-zA-Z\s\.\-ñÑ]$/.test(e.key)) e.preventDefault();
}

export function gradesOnly(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;

  const target = e.currentTarget;
  const start = target.selectionStart || 0;
  const end = target.selectionEnd || 0;
  const nextValue = target.value.substring(0, start) + e.key + target.value.substring(end);
  const validGradePattern = /^([12](\.(0|00?|25?|50?|75?)?)?|[345](\.(0|00?)?)?|I(N(C)?)?|D(R(P)?)?)$/i;

  if (!validGradePattern.test(nextValue)) e.preventDefault(); 
}

export function isValidGrade(grade: string) {
  if (!grade) return false;
  return /^([12](\.(0|00|25|5|50|75))?|[345](\.(0|00))?|INC|DRP)$/i.test(grade.trim());
}

export function formatGrade(grade: string) {
  if (!grade) return grade;
  const g = grade.trim().toUpperCase();
  const num = parseFloat(g);
  if (g === 'INC' || g === 'DRP') return g;
  if (!isNaN(num)) return num.toFixed(2);
  return g;
}

export function calculateChecklistStats(records: any[]) {
  let totalUnits = 0, enrolledUnits = 0, passedUnits = 0, weightedPoints = 0;

  records?.forEach((record) => {
    const courseId = record.course_id?.toUpperCase() || '';
    const isExcluded = courseId.includes('PE') || courseId.includes('NSTP');

    if (!isExcluded) {
      const grade = parseFloat(record.grade);
      const units = record.course?.course_units || 0;
      enrolledUnits += units;

      if (!isNaN(grade)) {
        totalUnits += units;
        weightedPoints += (grade * units);
        if (grade <= 3) passedUnits += units;
      }
    }
  });

  const gwa = totalUnits > 0 ? (weightedPoints / totalUnits).toFixed(2) : "0.00";
  return { totalUnits, enrolledUnits, passedUnits, weightedPoints, gwa };
}

export function getBaseAY(academicYear: number, semester: string) {
  let base = Number(academicYear);
  const sem = (semester || '').toLowerCase();
  if (sem.includes('second') || sem.includes('mid')) base -= 1;
  return base;
}

export function getDBAcademicYear(baseAY: number, semester: string) {
  const sem = (semester || '').toLowerCase();
  if (sem.includes('second') || sem.includes('mid')) return baseAY + 1;
  return baseAY;
}

export function generateTermId(baseAY: number, semester: string) {
  const sem = (semester || '').toLowerCase();
  const startYear = baseAY.toString().slice(-2);       
  const endYear = (baseAY + 1).toString().slice(-2);   

  if (sem.includes('first')) return parseInt(`01${startYear}`, 10); 
  if (sem.includes('second')) return parseInt(`02${endYear}`, 10);   
  return parseInt(`03${endYear}`, 10);   
}

export function getSemesterWeight(sem: string) {
  const s = (sem || '').toLowerCase();
  if (s.includes('first')) return 1;
  if (s.includes('second')) return 2;
  if (s.includes('mid')) return 3;
  return 4; 
}