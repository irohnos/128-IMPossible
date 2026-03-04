import { createClient } from "@/lib/supabase/server";

export default async function AcademicPapersPage() {
  const supabase = await createClient();

  // Fetching data 
  const { data: papers, error } = await supabase
    .from("academic_papers")
    .select(`
      paper_id, 
      paper_title, 
      paper_year_submitted, 
      paper_references, 
      paper_pages, 
      adviser (
        adviser_fname, 
        adviser_mname, 
        adviser_lname, 
        adviser_suffix
      )
    `);

  if (error) {
    console.error("Error fetching papers:", error);
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 font-medium">Error loading papers. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academic Papers</h1>
        <p className="text-gray-600 mt-2">
          Collection of BSME Theses and MM Strategic Papers for the Institute of Management.
        </p>
      </header>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div>
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
              {papers?.map((paper) => {
                // Name Concatenation Logic: "First M. Last, Suffix"
                const adv = Array.isArray(paper.adviser) ? paper.adviser[0] : paper.adviser;
                const middleInitial = adv?.adviser_mname 
                  ? '${adv.adviser_mname.charAt(0)}. '
                  : "";
                
                const formattedAdviser = adv 
                  ? '${adv.adviser_fname} ${middleInitial} ${adv.adviser_lname}${adv.adviser_suffix ? , ${adv.adviser_suffix}` : ""}`'
                  : "N/A";

                return (
                  <tr key={paper.paper_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 leading-tight">
                      {paper.paper_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {paper.paper_year_submitted}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 italic truncate max-w-xs">
                      {paper.paper_references || "None"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {paper.paper_pages}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {formattedAdviser}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}