import { createClient } from "@/lib/supabase/server";
import { formatFullName } from "./utils";

export async function populateAdvisers() {
  const supabase = await createClient();
  
  const { data: rawAdvisers, error } = await supabase
    .from("adviser")
    .select("adviser_id, adviser_fname, adviser_mname, adviser_lname, adviser_suffix")
    .order("adviser_lname", { ascending: true });

  if (error) {
    console.error("Error fetching advisers:", error.message, error.details, error.hint);    return [];
  }

  return (rawAdvisers || []).map((adv) => ({
    id: adv.adviser_id,
    name: formatFullName(
      adv.adviser_fname, 
      adv.adviser_mname, 
      adv.adviser_lname, 
      adv.adviser_suffix
    )
  }));
}