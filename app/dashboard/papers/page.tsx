import { Suspense } from "react";
import PaperRows, { RowSkeleton } from "./rows";
import UploadButton from "./upload-button";
import SearchInput from "@/components/searchinput";
import Pagination from "@/components/pagination";

export type SearchProps = {
  searchParams: Promise<{ 
    sort?: string; 
    order?: "asc" | "desc";
    query?: string;
    page?: number;
    itemsPerPage?: number;}>;
};

export default function AcademicPapersPage({ searchParams }: SearchProps) {
  return (
    <div className="max-w-auto mx-auto py-10 px-4">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academic Papers</h1>
          <p className="text-gray-600 mt-2">
            Collection of BSME Theses and MM Strategic Papers for the Institute of Management.
          </p>
        </div>
      </header>

      
      {/* Action Bar: Search, Filters, and Upload */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className=" w-full max-w-lg">
          <Suspense fallback={<div className="h-9 w-full rounded-md bg-gray-200 animate-pulse" />}>
            <SearchInput placeholder="Search papers..." />
          </Suspense>
        </div>

        <div className="w-full sm:w-auto">
          <UploadButton />
        </div>
      </div>

      <Suspense fallback={<RowSkeleton />}>
        <PaperRows searchParams={searchParams} />
      </Suspense>
    </div>
  );
}