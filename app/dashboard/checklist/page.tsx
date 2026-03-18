import { Suspense } from "react";
import Link from "next/link";
import { createClient } from '@/lib/supabase/server';
import SearchInput from "@/components/searchinput";

async function Folder({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const { query = "" } = await searchParams;
  const supabase = await createClient();

  const { data: checklistData } = await supabase
    .from('checklist')
    .select('student_number');

  let uniqueYears = checklistData 
    ? Array.from(new Set(checklistData.map(s => String(s.student_number).substring(0, 4))))
        .filter(year => year.length === 4)
        .sort().reverse()
    : [];

  if (query) {
    const q = query.toLowerCase();
    uniqueYears = uniqueYears.filter(year => 
      year.includes(q) || `batch ${year}`.includes(q) || `batch '${year.substring(2)}`.includes(q)
    );
  }

  if (uniqueYears.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <p className="text-maroon font-bold tracking-widest uppercase text-sm">
          {query ? `No batches found matching "${query}"` : "No batches found in the database."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {uniqueYears.map((year) => (
        <Link href={`/dashboard/checklist/${year}`} key={year} className="group relative flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-red-100 hover:bg-red-50/30 transition-all duration-200">
          <div className="relative w-16 h-12 mb-4 transition-transform duration-300 group-hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-6 h-2 bg-maroon rounded-t-sm transition-colors" />
            <div className="absolute bottom-0 w-full h-10 bg-maroon/70 rounded-tr-sm rounded-b-sm shadow-sm transition-all duration-300 group-hover:bg-maroon" />
            <div className="absolute bottom-0 w-full h-10 bg-red-100 rounded-b-sm origin-bottom transition-all duration-300 group-hover:skew-x-[-10deg] group-hover:scale-y-[0.9] border-t border-white/20" />
          </div>
          
          <h3 className="text-xs font-black text-maroon uppercase tracking-widest transition-colors">Batch {year}</h3>
        </Link>
      ))}
    </div>
  );
}

export default function StudentChecklistPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  return (
    <div className="max-w-auto mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full max-w-3xl">
          <Suspense fallback={<div className="h-9 w-full rounded-md bg-gray-200 animate-pulse" />}>
            <SearchInput placeholder="Search by Admission Year (e.g. 2022)" 
             configKey="batchYear"/>
          </Suspense>
        </div>
      </div>

      <Suspense fallback={
        <div className="p-10 flex flex-col items-center justify-center">
          <div className="h-8 w-8 border-4 border-maroon border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-center animate-pulse text-maroon font-bold tracking-widest uppercase text-sm">Loading batches...</p>
        </div>
      }>
        <Folder searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
