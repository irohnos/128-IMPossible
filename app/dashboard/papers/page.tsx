import { Suspense } from "react";
import PaperRows, { RowSkeleton } from "./rows";
import UploadButton from "./upload-button";

export type SearchProps = {
  searchParams: Promise<{ sort?: string; order?: "asc" | "desc" }>;
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
        
        <div className="flex-shrink-0">
          <UploadButton />
        </div>
      </header>

      <Suspense fallback={<RowSkeleton />}>
        <PaperRows searchParams={searchParams} />
      </Suspense>
    </div>
  );
}