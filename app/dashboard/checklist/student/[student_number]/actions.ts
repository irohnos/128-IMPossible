'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { parseDatabaseError } from '@/lib/error-handler';
import RestrictedInput from "@/components/restricted-inputs";

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