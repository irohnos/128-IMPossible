'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateChecklist(recordId: string, newGrade: string, studentNumber: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('checklist')
    .update({ grade: newGrade })
    .eq('id', recordId);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/checklist/student/${studentNumber}`);
}

export async function deleteChecklistRecord(recordId: string, studentNumber: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('checklist')
    .delete()
    .eq('id', recordId);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/checklist/student/${studentNumber}`);
}