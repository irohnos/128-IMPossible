import { createClient } from '@/lib/supabase/server';
import { Suspense } from "react";
import SearchInput from "@/components/searchinput";
import Link from "next/link";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/outline";

export default async function BatchChecklistPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ year: string }>,
  searchParams: Promise<{ query?: string }> 
}) {
  const { year } = await params;
  const { query = "" } = await searchParams;
  const supabase = await createClient();

  const startRange = parseInt(`${year}000`);
  const endRange = parseInt(`${year}999`);

  const { data: students, error } = await supabase
    .from('student')
    .select('*')
    .gte('student_number', startRange)
    .lte('student_number', endRange)
    .order('student_lname', { ascending: true });

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
    <div className="max-w-auto mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full max-w-3xl">
          <Suspense fallback={<div className="h-9 w-full rounded-md bg-gray-200 animate-pulse" />}>
            <SearchInput placeholder="Search by Name, Student Number, etc." />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const initials = `${student.student_fname?.[0] || ''}${student.student_lname?.[0] || ''}`;
            const suffix = student.student_suffix ? ` ${student.student_suffix}` : "";
            
            return (
              <Link 
                key={student.student_number} 
                href={`/dashboard/checklist/student/${student.student_number}`}
                className="group relative flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-maroon/30 transition-all duration-200"
              >
                <div className="flex items-center gap-4 overflow-hidden">
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
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic text-lg">
              {query ? `No results for "${query}"` : "No student records found."}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href="/dashboard/checklist" className="inline-flex items-center gap-2 text-gray-400 hover:text-maroon transition-colors group">
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Batch Folders</span>
        </Link>
      </div>
    </div>
  );
}