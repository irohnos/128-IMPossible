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

export async function addPaperAction(data: any) {
  const supabase = await createClient();

const { data: paperData, error: paperError } = await supabase
  .from("academic_papers")
  .insert([{
    paper_title: data.paper_title,
    paper_year_submitted: data.paper_year_submitted,
    paper_pages: data.paper_pages,
    paper_summary: data.paper_summary,
    paper_references: data.paper_references || "",
    adviser_id: data.adviser_id ? Number(data.adviser_id) : null,
  }])
  .select()   
  .single();  

if (paperError) throw new Error("Paper creation failed: " + paperError.message);

  const authorsToInsert = data.authors.map((a: any) => ({
    author_fname: a.author_fname,
    author_lname: a.author_lname,
    author_mname: a.author_mname || null,
    author_suffix: a.author_suffix || null,
    paper_id: paperData.paper_id,
  }));

  const { error: authorError } = await supabase
    .from("author")  
    .insert(authorsToInsert);

  if (authorError) throw new Error("Author creation failed: " + authorError.message);

  revalidatePath("/papers");
  return { success: true };
}