import { createClient } from "@/lib/supabase/server";

export default async function PaperRows() {
  const supabase = await createClient();

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
    <>
      {papers.map((paper) => {
        const adv = Array.isArray(paper.adviser) ? paper.adviser[0] : paper.adviser;
        const middleInitial = adv?.adviser_mname 
          ? `${adv.adviser_mname.charAt(0)}. `
          : "";
                
        const formattedAdviser = adv 
          ? `${adv.adviser_fname} ${middleInitial} ${adv.adviser_lname}${adv.adviser_suffix ? `, ${adv.adviser_suffix}` : ""}`
          : "N/A";

        return (
          <tr key={paper.paper_id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900 leading-tight">{paper.paper_title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{paper.paper_year_submitted}</td>
            <td className="px-6 py-4 text-sm text-gray-500 italic truncate max-w-xs">{paper.paper_references || "None"}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{paper.paper_pages}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{formattedAdviser}</td>
          </tr>
        );
      })}
    </>
  );
}

export function RowSkeleton() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-3/4"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-1/2"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-8"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
        </tr>
      ))}
    </>
  );
}
