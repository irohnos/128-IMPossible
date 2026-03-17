'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { parseDatabaseError } from '@/lib/error-handler';

export async function updateChecklist(recordId: string, newGrade: string, studentNumber: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('checklist').update({ grade: newGrade.trim() }).eq('id', recordId);

  if (error) return { error: parseDatabaseError(error) };
  
  revalidatePath(`/dashboard/checklist/student/${studentNumber}`);
  return { success: true };
}

export async function deleteChecklistRecord(recordId: string, studentNumber: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('checklist').delete().eq('id', recordId);

  if (error) return { error: parseDatabaseError(error) };
  
  revalidatePath(`/dashboard/checklist/student/${studentNumber}`);
  return { success: true };
}

export async function addChecklistRecord(studentNumber: string, termId: string, courseId: string, grade: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('checklist').insert({
    student_number: studentNumber,
    term_taken: termId,
    course_id: courseId,
    grade: grade.trim()
  });

  if (error) return { error: parseDatabaseError(error) };
  
  revalidatePath(`/dashboard/checklist/student/${studentNumber}`);
  return { success: true };
}