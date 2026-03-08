import Link from "next/link";
import { createClient } from '@/lib/supabase/server';

export default async function Folder({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string }> 
}) {
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
      year.includes(query) || 
      `Batch '${year.substring(2)}`.toLowerCase().includes(query.toLowerCase())
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
              <div className="absolute top-0 left-0 w-8 h-2 bg-[#7b1113] rounded-t-sm transition-colors group-hover:bg-[#7b1113]" />
              <div className="absolute bottom-0 w-full h-14 bg-[#7B1113] opacity-50 rounded-tr-sm rounded-b-sm shadow-sm transition-all duration-300 group-hover:opacity-100 group-hover:h-12" />
              <div className="absolute bottom-0 w-full h-12 bg-[#BD8889] rounded-b-sm origin-bottom transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:skew-x-[-15deg] group-hover:scale-y-[1.1]" />
            </div>
            <p className="text-[15px] font-medium text-[#374151] tracking-tight transition-colors group-hover:text-black text-center leading-relaxed">
              Batch '{year.substring(2)} - '{parseInt(year.substring(2)) + 1}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}