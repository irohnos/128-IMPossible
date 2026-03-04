import { Suspense } from "react";
import PaperRows, { RowSkeleton } from "./rows";

export default function AcademicPapersPage() {
  return (
    <div className="max-w-auto mx-auto py-10 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academic Papers</h1>
        <p className="text-gray-600 mt-2">
          Collection of BSME Theses and MM Strategic Papers for the Institute of Management.
        </p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">References</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Adviser</th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <Suspense fallback={<RowSkeleton />}>
              <PaperRows />
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  );
}
