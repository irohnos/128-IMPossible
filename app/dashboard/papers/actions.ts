"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Papa from "papaparse";

function parseName(fullName: string) {
  if (!fullName) return { fname: "Unknown", mname: null, lname: "Unknown", suffix: null };
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { fname: parts[0], mname: null, lname: "Unknown", suffix: null };
  }
  
  const fname = parts[0];
  let lname = parts[parts.length - 1];
  let mname = "";
  let suffix = "";

  const lowerLname = lname.toLowerCase();
  if (["jr", "sr", "ii", "iii", "iv", "jr.", "sr."].includes(lowerLname)) {
    suffix = lname;
    lname = parts[parts.length - 2];
    mname = parts.slice(1, -2).join(" ");
  } else {
    mname = parts.slice(1, -1).join(" ");
  }

  return { 
    fname, 
    mname: mname.replace(/\./g, "").trim() || null, 
    lname, 
    suffix: suffix.trim() || null 
  };
}

export async function uploadCsvAction(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    return { error: "No file uploaded" };
  }

  const text = await file.text();
  const supabase = await createClient();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    return { error: "Failed to parse CSV file properly." };
  }

  const rawRows = parsed.data as Record<string, string>[];

  for (const rawRow of rawRows) {
    const row: Record<string, string> = {};
    for (const key in rawRow) {
      row[key.trim().replace(/[\r\n]+/g, '')] = rawRow[key];
    }

    const title = row["Title"]?.trim();
    const authorsStr = row["Author/s"]?.trim(); 
    const year = parseInt(row["Year"]?.trim(), 10);
    const pages = parseInt(row["Pages"]?.trim(), 10);
    const adviserStr = row["Adviser"]?.trim();
    
    const summaryStr = row["Summary"]?.trim() || ""; 
    const referencesStr = row["References"]?.trim() || "";

    if (!title) continue; 

    let adviserId = null;
    if (adviserStr && adviserStr.toLowerCase() !== "n/a") {
      const { fname, mname, lname } = parseName(adviserStr);
      
      const { data: existingAdviser } = await supabase
        .from("adviser")
        .select("adviser_id")
        .eq("adviser_fname", fname)
        .eq("adviser_lname", lname)
        .maybeSingle();

      if (existingAdviser) {
        adviserId = existingAdviser.adviser_id;
      } else {
        const { data: newAdviser, error: advError } = await supabase
          .from("adviser")
          .insert({ adviser_fname: fname, adviser_mname: mname, adviser_lname: lname })
          .select("adviser_id")
          .single();
          
        if (advError) {
          console.error(`CRITICAL: Failed to create adviser "${fname} ${lname}":`, advError);
        } else if (newAdviser) {
          adviserId = newAdviser.adviser_id;
        }
      }
    }

    if (!adviserId) {
      console.error(`Skipping paper "${title}" because the adviser could not be resolved.`);
      continue;
    }

    const { data: newPaper, error: paperError } = await supabase
      .from("academic_papers")
      .insert({
        paper_title: title,
        paper_year_submitted: isNaN(year) ? null : year,
        paper_pages: isNaN(pages) ? null : pages,
        adviser_id: adviserId,
        paper_summary: summaryStr,       
        paper_references: referencesStr, 
      })
      .select("paper_id")
      .single();

    if (paperError || !newPaper) {
      console.error("Error inserting paper:", title, paperError);
      continue; 
    }

    if (authorsStr && authorsStr.toLowerCase() !== "unknown") {
      const authorNames = authorsStr.split(/[;,]/).map(a => a.trim()).filter(a => a);
      
      for (const authorName of authorNames) {
        const { fname, mname, lname, suffix } = parseName(authorName);

        const { error: authorError } = await supabase
          .from("author")
          .insert({ 
            author_fname: fname, 
            author_mname: mname, 
            author_lname: lname,
            author_suffix: suffix,
            paper_id: newPaper.paper_id 
          });
          
        if (authorError) {
            console.error(`Failed to attach author "${fname}" to paper:`, authorError);
        }
      }
    }
  }

  revalidatePath("/");
  return { success: true };
}