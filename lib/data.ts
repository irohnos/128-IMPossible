import { createClient } from "@/lib/supabase/server";
import { formatFullName } from "./utils";

export async function populateAdvisers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("adviser")
    .select("adviser_id, adviser_fname, adviser_mname, adviser_lname, adviser_suffix")
    .order("adviser_lname", { ascending: true });

  if (error) return [];
  return data.map((adv) => ({
    id: adv.adviser_id,
    name: formatFullName(adv.adviser_fname, adv.adviser_mname, adv.adviser_lname, adv.adviser_suffix)
  }));
}

export async function getStudentProfileData(student_number: string) {
  const supabase = await createClient();

  const [studentRes, recordsRes, coursesRes, termsRes] = await Promise.all([
    supabase
      .from('student')
      .select(`*, adviser:adviser_id (adviser_fname, adviser_mname, adviser_lname, adviser_suffix), admission_term:term_admitted (semester, academic_year)`)
      .eq('student_number', student_number)
      .single(),
    supabase
      .from('checklist')
      .select(`*, course:course_id (course_units, course_category), term:term_taken (semester, academic_year)`)
      .eq('student_number', student_number)
      .order('term_taken', { ascending: true })
      .order('id', { ascending: true }),
    supabase
      .from('courses')
      .select('course_id, course_units')
      .order('course_id', { ascending: true }),
    supabase
      .from('term')
      .select('*')
      .order('academic_year', { ascending: false })
      .order('term_id', { ascending: true })
  ]);

  return {
    student: studentRes.data,
    studentError: studentRes.error,
    records: recordsRes.data || [],
    allCourses: coursesRes.data || [],
    allTerms: termsRes.data || []
  };
}