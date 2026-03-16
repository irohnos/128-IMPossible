import { Suspense } from "react";
import FolderGrid from "./batch folders";
import SearchInput from "@/components/searchinput";

export default function StudentChecklistPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string }> 
}) {
  return (
    <div className="max-w-auto mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full max-w-3xl">
          <Suspense fallback={<div className="h-9 w-full rounded-md bg-gray-200 animate-pulse" />}>
            <SearchInput placeholder="Search by Admission Year (e.g. 2022)" />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-20 text-maroon/40 italic">Loading batches...</div>}>
        <FolderGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}