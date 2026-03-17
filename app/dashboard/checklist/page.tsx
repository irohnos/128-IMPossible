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
    uniqueYears = uniqueYears.filter(year => 
      year.includes(query) || `Batch '${year.substring(2)}`.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (uniqueYears.length === 0) {
    return (
      <div className="col-span-5 text-center py-20 text-gray-400 italic">
        {query ? `No batches found matching "${query}"` : "No batches found in the database."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-y-12 gap-x-6">
      {uniqueYears.map((year) => (
        <Link href={`/dashboard/checklist/${year}`} key={year}>
          <div className="group flex flex-col items-start px-4 cursor-pointer">
            <div className="relative w-20 h-16 mb-3 transition-transform duration-200 group-hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-8 h-2 bg-maroon rounded-t-sm transition-colors group-hover:bg-maroon" />
              <div className="absolute bottom-0 w-full h-14 bg-maroon opacity-50 rounded-tr-sm rounded-b-sm shadow-sm transition-all duration-300 group-hover:opacity-100 group-hover:h-12" />
              <div className="absolute bottom-0 w-full h-12 bg-red-100 rounded-b-sm origin-bottom transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:skew-x-[-15deg] group-hover:scale-y-[1.1]" />
            </div>
            <p className="text-sm font-medium text-maroon opacity-70 text-center transition-colors leading-relaxed">
              Batch {year}
            </p>
          </div>
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
            <SearchInput placeholder="Search by Admission Year (e.g. 2022)" />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-20 animate-pulse text-maroon font-bold tracking-widest uppercase text-sm">Loading batches...</div>}>
        <Folder searchParams={searchParams} />
      </Suspense>
    </div>
  );
}