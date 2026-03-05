import { createClient } from '@/lib/supabase/server';
import { Suspense } from "react";
import SearchInput from "@/components/searchinput";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
  const endRange = parseInt(`${year}9999`);

  const { data: rawData, error } = await supabase
    .from('checklist')
    .select('*')
    .gte('student_number', startRange)
    .lte('student_number', endRange);

  let checklist = rawData;
  if (!error && query) {
    const lowerQuery = query.toLowerCase();
    checklist = rawData?.filter(row => 
      row.course_id?.toLowerCase().includes(lowerQuery) ||
      row.student_number?.toString().includes(query) ||
      row.term_taken?.toString().includes(query) ||
      row.grade?.toString().includes(query)
    ) ?? [];
  }

  if (error) {
    return <div className="p-10 text-red-500 font-sans">Database Error: {error.message}</div>;
  }

  return (
    <div className="p-10 bg-white min-h-screen font-sans">
      <div className="bg-[#4b4b4b] h-14 w-full shadow-sm mb-10 rounded-md" />
      
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/checklist" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-500 group-hover:text-black" />
        </Link>
        <h1 className="text-2xl font-bold text-[#374151]">Batch {year} Academic Checklist</h1>
      </div>

      <div className="w-full max-w-lg mb-8">
        <Suspense fallback={<div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />}>
          <SearchInput placeholder="Search by Student Number, Course, etc." />
        </Suspense>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Term</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {checklist && checklist.length > 0 ? (
              checklist.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.student_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.course_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                    {row.grade ? Number(row.grade).toFixed(2) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.term_taken}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                  {query ? `No results for "${query}" in Batch ${year}` : "No records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
