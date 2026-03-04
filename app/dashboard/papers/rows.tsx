import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  ArrowsUpDownIcon 
} from "@heroicons/react/24/outline";
import Modal from "./modal";

interface RowProps {
  searchParams: Promise<{ sort?: string; order?: "asc" | "desc" }>;
}

export default async function PaperRows({ searchParams }: RowProps) {
  const { sort = "paper_title", order = "asc" } = await searchParams;
  
  const supabase = await createClient();
  const { data: papers, error } = await supabase
  .from("academic_papers")
  .select(`
    paper_id,
    paper_title,
    paper_summary,
    paper_year_submitted,
    paper_references,
    paper_pages,
    adviser (
      adviser_fname,
      adviser_mname,
      adviser_lname,
      adviser_suffix
    ),
    author (
      author_fname,
      author_mname,
      author_lname,
      author_suffix
    )
  `)
  .order(sort, { ascending: order === "asc" });

  if (error) {
    console.error("Error fetching papers:", error);
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 font-medium">Error loading papers. Please try again later.</p>
      </div>
    );
  }

  const getSortLink = (column: string) => {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc";
    return `?sort=${column}&order=${newOrder}`;
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sort !== column) {
      return <ArrowsUpDownIcon className="ml-2 h-4 w-4 opacity-30 group-hover:opacity-100 transition-opacity" />;
    }
    return order === "asc" ? (
      <ChevronUpIcon className="ml-2 h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDownIcon className="ml-2 h-4 w-4 text-blue-600" />
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Link href={getSortLink("paper_title")} className="group flex items-center hover:text-zinc-900 transition-colors">
                Title <SortIcon column="paper_title" />
              </Link>
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author/s</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Link href={getSortLink("paper_year_submitted")} className="group flex items-center hover:text-zinc-900 transition-colors">
                Year <SortIcon column="paper_year_submitted" />
              </Link>
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Adviser</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {papers?.map((paper) => {
            const adv = Array.isArray(paper.adviser) ? paper.adviser[0] : paper.adviser;
            const middleInitial = adv?.adviser_mname ? `${adv.adviser_mname.charAt(0)}. ` : "";
            const formattedAdviser = adv 
              ? `${adv.adviser_fname} ${middleInitial} ${adv.adviser_lname}${adv.adviser_suffix ? `, ${adv.adviser_suffix}` : ""}`
              : "N/A";

            const formattedAuthors = paper.author?.length 
              ? paper.author.map((a: any) => {
                  const mInitial = a.author_mname ? `${a.author_mname.charAt(0)}. ` : "";
                  const suffix = a.author_suffix ? `, ${a.author_suffix}` : "";
                  return `${a.author_fname} ${mInitial}${a.author_lname}${suffix}`;
                }).join(", ")
              : "Unknown";

            return (
              <tr key={paper.paper_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium leading-tight">
                  <Modal title={paper.paper_title} summary={paper.paper_summary} references={paper.paper_references} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"> {formattedAuthors} </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{paper.paper_year_submitted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{paper.paper_pages}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{formattedAdviser}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-50 border-b border-gray-200" />
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex px-6 py-4 border-b border-gray-100 last:border-0 gap-4">
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-1/6" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}
