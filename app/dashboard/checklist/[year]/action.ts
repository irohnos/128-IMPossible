"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { parseDatabaseError } from "@/lib/error-handler";

export async function addStudentAction(formData: FormData) {
  const supabase = await createClient();
  const batchYear = formData.get("batch_year") as string;

  const newStudent = {
    student_number: formData.get("student_number") as string,
    student_sais_id: (formData.get("student_sais_id") as string) || null,
    student_fname: formData.get("student_fname") as string,
    student_mname: (formData.get("student_mname") as string) || null,
    student_lname: formData.get("student_lname") as string,
    student_suffix: (formData.get("student_suffix") as string) || null,
    student_email: (formData.get("student_email") as string) || null,
    student_contact_no: (formData.get("student_contact_no") as string) || null,
    adviser_id: formData.get("adviser_id") ? Number(formData.get("adviser_id")) : null,
    term_admitted: formData.get("term_admitted") ? Number(formData.get("term_admitted")) : null,
  };

  if (!newStudent.student_number || !newStudent.student_fname || !newStudent.student_lname || !newStudent.term_admitted) {
    return { error: "Missing required fields." };
  }

  const { error } = await supabase.from("student").insert(newStudent);
  if (error) return { error: parseDatabaseError(error) };

  revalidatePath(`/dashboard/checklist/${batchYear}`);
  return { success: true };
}