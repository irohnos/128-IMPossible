import { createClient } from '@/lib/supabase/server';
import { Suspense } from "react";
import SearchInput from "@/components/searchinput";
import Link from "next/link";
import { ArrowLeftIcon, UserIcon, PencilSquareIcon, TrashIcon, ExclamationTriangleIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formatFullName } from "@/lib/utils";
import { populateAdvisers } from "@/lib/data";
import { parseDatabaseError } from "@/lib/error-handler";
import RestrictedInput from "@/components/restricted-inputs";

async function BatchChecklistContent({ params, searchParams }: { params: Promise<{ year: string }>, searchParams: Promise<{ query?: string; edit?: string; delete?: string; error?: string }> }) {
  const { year } = await params;
  const { query = "", edit, delete: deleteParam } = await searchParams;
  const supabase = await createClient();

  async function deleteStudent(studentNumber: number) {
    "use server";
    const supabaseAction = await createClient();
    const { error } = await supabaseAction
      .from('student')
      .delete()
      .eq('student_number', studentNumber);

    if (error) {
      const errMsg = parseDatabaseError(error);
      redirect(`/dashboard/checklist/${year}?delete=${studentNumber}&error=${encodeURIComponent(errMsg)}${query ? `&query=${query}` : ''}`);
    } else {
      revalidatePath(`/dashboard/checklist/${year}`); 
      redirect(`/dashboard/checklist/${year}${query ? `?query=${query}` : ''}`);
    }
  }

  async function updateStudent(formData: FormData) {
    "use server";
    const supabaseAction = await createClient();
    const studentNumber = formData.get('student_number');
    const submittedAdviserName = formData.get('adviser_name')?.toString();
    const submittedTermName = formData.get('term_admitted')?.toString();
    const advisersList = await populateAdvisers();
    const { data: termsActionData } = await supabaseAction.from('term').select('*');
    let adviserIdToSave = null;
    let termIdToSave = null;
 
    if (advisersList && submittedAdviserName) {
      const matchedAdviser = advisersList.find(adv => adv.name === submittedAdviserName);
      if (matchedAdviser) adviserIdToSave = matchedAdviser.id;
    }

    if (termsActionData && submittedTermName) {
      const matchedTerm = termsActionData.find(term => {
        const termFullName = `${term.semester} ${term.academic_year}`.trim();
        return termFullName === submittedTermName;
      });
      if (matchedTerm) termIdToSave = matchedTerm.term_id;
    }
    
    const { error } = await supabaseAction
      .from('student')
      .update({
        student_fname: formData.get('student_fname'),
        student_mname: formData.get('student_mname'),
        student_lname: formData.get('student_lname'),
        student_suffix: formData.get('student_suffix'),
        student_email: formData.get('student_email'),
        student_contact_no: formData.get('student_contact_no'),
        term_admitted: termIdToSave,
        adviser_id: adviserIdToSave, 
      })
      .eq('student_number', studentNumber);

    if (error) {
      const errMsg = parseDatabaseError(error);
      redirect(`/dashboard/checklist/${year}?edit=${studentNumber}&error=${encodeURIComponent(errMsg)}${query ? `&query=${query}` : ''}`);
    } else {
      revalidatePath(`/dashboard/checklist/${year}`);
      redirect(`/dashboard/checklist/${year}${query ? `?query=${query}` : ''}`);
    }
  }
  
  const startRange = parseInt(`${year}000`);
  const endRange = parseInt(`${year}999`);

  const { data: students, error } = await supabase
    .from('student')
    .select('*')
    .gte('student_number', startRange)
    .lte('student_number', endRange)
    .order('student_lname', { ascending: true });

  const { data: termsData } = await supabase
    .from('term')
    .select('*')
    .order('academic_year', { ascending: false });
  const terms = termsData || [];

  const advisersList = await populateAdvisers();
  let filteredStudents = students || [];

  if (!error && query) {
    const lowerQuery = query.toLowerCase();
    filteredStudents = filteredStudents.filter(s => 
      s.student_fname?.toLowerCase().includes(lowerQuery) ||
      s.student_lname?.toLowerCase().includes(lowerQuery) ||
      s.student_number?.toString().includes(query) ||
      s.student_sais_id?.toString().includes(query)
    );
  }

  let studentToEdit = null;
  let defaultAdviser = "";
  let defaultTerm = "";

  if (edit) {
    const { data: studentData, error: studentError } = await supabase
      .from('student')
      .select(`*, 
        adviser:adviser_id (adviser_fname, adviser_mname, adviser_lname, adviser_suffix),
        admission_term:term_admitted (semester, academic_year)
      `)
      .eq('student_number', edit)
      .single();

    if (!studentError && studentData) {
      studentToEdit = studentData;
      if (studentData.adviser) {
        const adv = Array.isArray(studentData.adviser) ? studentData.adviser[0] : studentData.adviser;
        if (adv) defaultAdviser = formatFullName(adv.adviser_fname, adv.adviser_mname, adv.adviser_lname, adv.adviser_suffix);
      }

      if (studentData.admission_term) {
        const term = Array.isArray(studentData.admission_term) ? studentData.admission_term[0] : studentData.admission_term;
        if (term) defaultTerm = `${term.semester} ${term.academic_year}`.trim();
      }
    }
  }

  const studentToDelete = deleteParam ? students?.find(s => String(s.student_number) === String(deleteParam)) : null;
  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="bg-red-50 border border-red-100 text-red px-4 py-3 rounded-lg inline-block">
          <p className="font-bold">Database Error</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-auto mx-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const initials = `${student.student_fname?.[0] || ''}${student.student_lname?.[0] || ''}`;
            const suffix = student.student_suffix ? ` ${student.student_suffix}` : "";

            return (
              <div key={student.student_number} className="group relative flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-maroon/30 transition-all duration-200">
                <Link href={`/dashboard/checklist/student/${student.student_number}`} className="flex items-center gap-4 overflow-hidden flex-1">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-maroon font-bold text-sm group-hover:bg-maroon group-hover:text-white transition-colors">
                    {initials || <UserIcon className="h-5 w-5" />}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[15px] text-maroon-900 font-bold truncate group-hover:text-maroon transition-colors">
                      {student.student_lname}{suffix}, {student.student_fname} {student.student_mname}
                    </span>
                    <div className="flex flex-col text-[12px] text-gray-500 mt-0.5">
                      <span className="font-medium">SN: {student.student_number}</span>
                      <span className="italic opacity-80">SAIS ID: {student.student_sais_id || "N/A"}</span>
                    </div>
                  </div>
                </Link>

                <div className="flex flex-col gap-3 pl-4 ml-2 border-l border-gray-100">
                  <Link href={`?${new URLSearchParams({ ...(query && { query }), edit: student.student_number.toString() }).toString()}`} scroll={false}>
                    <PencilSquareIcon className="h-5 w-5 text-zinc-400 hover:text-yellow transition-colors" />
                  </Link>
                  
                  <Link href={`?${new URLSearchParams({ ...(query && { query }), delete: student.student_number.toString() }).toString()}`} scroll={false}>
                    <TrashIcon className="h-5 w-5 text-zinc-400 hover:text-maroon transition-colors" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center">
            <p className="text-maroon font-bold tracking-widest uppercase text-sm py-20">{query ? `No results for "${query}"` : "No student records found."}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href="/dashboard/checklist" className="inline-flex items-center gap-2 text-gray-400 hover:text-maroon transition-colors group">
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Batch Folders</span>
        </Link>
      </div>

      {studentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Link href={`?${query ? `query=${query}` : ''}`} scroll={false} className="absolute inset-0 cursor-default" />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 shrink-0">
              <h2 className="text-lg font-bold text-maroon">Update Student Record — #{studentToEdit.student_number}</h2>
              <Link href={`?${query ? `query=${query}` : ''}`} scroll={false}>
                <p className="p-2 text-gray-700 hover:text-white hover:bg-maroon rounded-lg transition-colors flex items-center justify-center">
                  <XMarkIcon className="w-5 h-5" />
                </p>
              </Link>
            </div>

            <form key={`form-${studentToEdit.student_number}`} action={updateStudent} className="flex flex-col flex-1 overflow-hidden">
              <input type="hidden" name="student_number" value={studentToEdit.student_number} />
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1 text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">First Name</label>
                    <RestrictedInput restrictionType="name" type="text" name="student_fname" defaultValue={studentToEdit.student_fname || ""} placeholder="John" className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" required />
                  </div>
                  <div className="sm:col-span-1 text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Middle Name</label>
                    <RestrictedInput restrictionType="name" type="text"  name="student_mname" defaultValue={studentToEdit.student_mname || ""} placeholder="Baron" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
                  </div>
                  <div className="sm:col-span-1 text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Last Name</label>
                    <RestrictedInput restrictionType="name" type="text" name="student_lname" defaultValue={studentToEdit.student_lname || ""} placeholder="Cruz" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" required />
                  </div>
                  <div className="sm:col-span-1 text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Suffix</label>
                    <RestrictedInput restrictionType="name" type="text" name="student_suffix" defaultValue={studentToEdit.student_suffix || ""} placeholder="Jr." className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Email</label>
                    <input type="email" name="student_email" defaultValue={studentToEdit.student_email || ""} placeholder="jbcruz@university.edu.ph"className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" required />
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Contact Number</label>
                    <RestrictedInput restrictionType="number" type="tel" name="student_contact_no" defaultValue={studentToEdit.student_contact_no || ""} placeholder="9007797147" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" 
                      minLength={10}
                      maxLength={10}
                      pattern="[9]{1}[0-9]{9}"
                      title="Contact number must be exactly 10 digits"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Term Admitted</label>
                    <div className="relative">
                      <select name="term_admitted" defaultValue={defaultTerm} className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all appearance-none">
                        <option value="" disabled>Select a Term</option>
                        {terms.map((term) => {
                          const termFullName = `${term.semester} ${term.academic_year}`.trim();
                          
                          return (<option key={term.term_id} value={termFullName}>{termFullName}</option>);
                        })}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Adviser</label>
                    <div className="relative">
                      <select name="adviser_name" defaultValue={defaultAdviser} className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all appearance-none">
                        <option value="" disabled>Select an Adviser</option>
                        {advisersList.map((adviser) => ( <option key={adviser.id} value={adviser.name}>{adviser.name}</option> ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-red-50 shrink-0">
                <Link href={`?${query ? `query=${query}` : ''}`} scroll={false} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-maroon transition-colors flex items-center">
                  Cancel
                </Link>
                <button type="submit" className="px-6 py-2 bg-maroon text-white rounded-lg text-sm font-bold hover:bg-maroon-800 disabled:bg-zinc-400 transition-all active:scale-95 shadow-md">
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm">
          <Link href={`?${query ? `query=${query}` : ''}`} scroll={false} className="absolute inset-0 cursor-default" />
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon mb-4 shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-lg font-black text-maroon text-center uppercase tracking-wider">Confirm Deletion</h3>

            <div className="mt-2 w-full">
              <p className="text-sm text-gray-500 text-center leading-relaxed break-words">
                Are you sure you want to delete <br />
                <span className="text-maroon-900 font-bold text-lg block my-2 px-2">{studentToDelete.student_fname} {studentToDelete.student_lname}?</span>
                <span className="text-gray-400 block text-xs uppercase tracking-widest font-bold">This action cannot be undone.</span>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 w-full gap-3">
              <Link href={`?${query ? `query=${query}` : ''}`} scroll={false} className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-xs uppercase tracking-widest font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center justify-center">
                Cancel
              </Link>
              <form action={deleteStudent.bind(null, studentToDelete.student_number)} className="w-full">
                <button type="submit" className="w-full rounded-2xl bg-maroon px-4 py-3 text-xs uppercase tracking-widest font-bold text-white shadow-sm hover:bg-maroon-900 transition-colors disabled:opacity-50">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BatchChecklistPage({ params, searchParams }: { params: Promise<{ year: string }>, searchParams: Promise<{ query?: string; edit?: string; delete?: string }> }) {
  return (
    <div className="max-w-auto mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full max-w-3xl">
          <Suspense fallback={<div className="h-9 w-full rounded-md bg-gray-200 animate-pulse" />}>
            <SearchInput placeholder="Search by Name, Student Number, etc." />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={
        <div className="p-10 flex flex-col items-center justify-center">
          <div className="h-8 w-8 border-4 border-maroon border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-center animate-pulse text-maroon font-bold tracking-widest uppercase text-sm">Loading students...</p>
        </div>
      }>
        <BatchChecklistContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}