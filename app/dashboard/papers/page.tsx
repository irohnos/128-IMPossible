import { Suspense } from "react";
import PaperRows, { RowSkeleton } from "./rows";

export type SearchProps = {
  searchParams: Promise<{ sort?: string; order?: "asc" | "desc" }>;
};

export default function AcademicPapersPage({ searchParams }: SearchProps) {
  return (
    <div className="max-w-auto mx-auto py-10 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academic Papers</h1>
        <p className="text-gray-600 mt-2">
          Collection of BSME Theses and MM Strategic Papers for the Institute of Management.
        </p>
      </header>

      <Suspense fallback={<RowSkeleton />}>
        <PaperRows searchParams={searchParams} />
      </Suspense>
    </div>
  );
}