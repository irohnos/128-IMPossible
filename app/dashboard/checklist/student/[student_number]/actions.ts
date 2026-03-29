'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { parseDatabaseError } from '@/lib/error-handler';

async function executeAction(studentNumber: string, result: { error: any }) {
  if (result.error) return { error: parseDatabaseError(result.error) };
  revalidatePath(`/dashboard/checklist/student/${studentNumber}`);
  return { success: true };
}

export async function updateChecklist(recordId: string, newGrade: string, studentNumber: string) {
  const supabase = await createClient();
  return executeAction(
    studentNumber, 
    await supabase.from('checklist').update({ grade: newGrade.trim() }).eq('id', recordId)
  );
}

export async function deleteChecklistRecord(recordId: string, studentNumber: string) {
  const supabase = await createClient();
  return executeAction(
    studentNumber, 
    await supabase.from('checklist').delete().eq('id', recordId)
  );
}

export async function addChecklistRecord(studentNumber: string, termId: string, courseId: string, grade: string) {
  const supabase = await createClient();
  return executeAction(
    studentNumber, 
    await supabase.from('checklist').insert({
      student_number: studentNumber,
      term_taken: termId,
      course_id: courseId,
      grade: grade.trim()
    })
  );
}

export async function addNewTermAction(studentNumber: string, termId: number, semester: string, academicYear: number) {
  const supabase = await createClient();
  return executeAction(
    studentNumber, 
    await supabase.from('term').insert({
      term_id: termId,
      semester: semester,
      academic_year: academicYear
    })
  );
}