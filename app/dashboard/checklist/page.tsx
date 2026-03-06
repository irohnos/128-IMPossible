import { Suspense } from "react";
import { Search, Filter, Plus } from "lucide-react";
import FolderGrid from "./batch folders";
import SearchInput from "@/components/searchinput";

export default function StudentChecklistPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string }> 
}) {
  return (
    <div className="bg-white min-h-screen">
      
      
      <div className="px-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">

              <Suspense fallback={<div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />}>
                <SearchInput placeholder="Search by Admission Year (e.g. 2022)" />
              </Suspense>
            </div>
            {/*<button className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#e5e7eb] text-gray-600 hover:bg-gray-300 border-none transition-colors text-sm font-medium">
              <Filter className="h-5 w-5 text-gray-500" />
              Filters
            </button>     //comment muna since non functioning*/} 
          </div>
          {/*<button className="p-2 bg-[#e5e7eb] hover:bg-gray-300 rounded-md transition-colors border-none shadow-sm ml-4">
            <Plus className="h-6 w-6 text-gray-500" />
          </button>*/}
        </div>
        

        <Suspense fallback={<div className="text-center py-20 text-gray-400 italic">Loading batches...</div>}>
          <FolderGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}