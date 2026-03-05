"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePaperAction(id: number, updates: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("academic_papers")
    .update(updates)
    .eq("paper_id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/papers"); 
  return { success: true };
}

export async function deletePaperAction(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("academic_papers")
    .delete()
    .eq("paper_id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/papers");
  return { success: true };
}