import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  ArrowsUpDownIcon 
} from "@heroicons/react/24/outline";
import Modal from "./modal";
import Actions from "./actions";
import PaginationController from "@/components/pagination-controller";

interface RowProps {
  searchParams: Promise<{ 
    sort?: string; 
    order?: "asc" | "desc"; 
    query?: string;
    type?: string;
    page?: string;
  }>;
}

export default async function PaperRows({ searchParams }: RowProps) {
  const { sort = "paper_title", order = "asc", query = "", type="all", page= "1" } = await searchParams;
  
  const currentPage = Number(page);
  const itemsPerPage = 10;
  const supabase = await createClient();
  
  let supabaseQuery = supabase
    .from("academic_papers")
    .select(`
      paper_id, 
      paper_title, 
      paper_summary,
      paper_year_submitted, 
      paper_references, 
      paper_type, 
      paper_pages,
      adviser!inner (
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
    `);

  const { data: rawPapers, error } = await supabaseQuery.order(sort, { ascending: order === "asc" });

  let papers = rawPapers || [];

  if (papers.length > 0 && type !== "all") {
    const targetType = type === "thesis" ? "Thesis" : "Strategic Paper";
    papers = papers.filter(p => p.paper_type === targetType);
  }

  if (!error && query && papers.length > 0){
    const q = query.toLowerCase();

    papers = rawPapers?.filter((paper) => {

      // Titles and references
      if (paper.paper_title.toLowerCase().includes(q) || paper.paper_references.toLowerCase().includes(q)) {
        return true;
      }

      // Numbers (Years and pages)
      if (paper.paper_year_submitted.toString().includes(q) || paper.paper_pages.toString().includes(q)) {
        return true;
      }

      // Adviser
      const adviser = Array.isArray(paper.adviser) ? paper.adviser[0] : paper.adviser;
      if (adviser) {

        const simpleName = `${adviser.adviser_fname} ${adviser.adviser_lname}`;
        const fullName = `${adviser.adviser_fname} ${adviser.adviser_mname ? adviser.adviser_mname.charAt(0) + ". " : ""}${adviser.adviser_lname}${adviser.adviser_suffix ? `, ${adviser.adviser_suffix}` : ""}`;
        if (simpleName.toLowerCase().includes(q) || fullName.toLowerCase().includes(q)) {
          return true;
        }
      }

      // Authors
      const hasNoAuthors = !paper.author || (Array.isArray(paper.author) && paper.author.length === 0);

      if (hasNoAuthors && "unknown".includes(q)) {
        return true;
      }
      const authorMatch = paper.author?.some((a: any) => {
        const simpleName = `${a.author_fname} ${a.author_lname}`;
        const fullName = `${a.author_fname} ${a.author_mname ? a.author_mname.charAt(0) + ". " : ""}${a.author_lname}${a.author_suffix ? `, ${a.author_suffix}` : ""}`;
        return simpleName.toLowerCase().includes(q) || fullName.toLowerCase().includes(q);
      });

      return !!authorMatch;
    });
  }

  // Calculation for pagination
  const totalItems = papers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPapers = papers.slice(startIndex, startIndex + itemsPerPage);

  const getSortLink = (column: string) => {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc";
    const base = `?sort=${column}&order=${newOrder}&type=${type}&page=1`;
    return query ? `${base}&query=${encodeURIComponent(query)}` : base;
  };

  const getTabLink = (newType: string) => {
    const base = `?type=${newType}&sort=${sort}&order=${order}`;
    return query ? `${base}&query=${encodeURIComponent(query)}` : base;
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sort !== column) {
      return <ArrowsUpDownIcon className="ml-2 h-4 w-4 opacity-30 group-hover:opacity-100 transition-opacity" />;
    }
    return order === "asc" ? (
      <ChevronUpIcon className="ml-2 h-4 w-4 text-gray-500" />
    ) : (
      <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
    );
  };

  return (
    <div className="space-y-4 min-w-0 w-full">
      <div className="flex items-center gap-4 sm:gap-8 border-b border-[#7b1113]/30 mb-6 overflow-x-auto scrollbar-none">
        {[
          { label: "All Papers", value: "all" },
          { label: "Theses", value: "thesis" },
          { label: "Strategic Papers", value: "strategic" },
        ].map((tab) => {
          const isActive = type === tab.value;
          
          return (
            <Link
              key={tab.value}
              href={getTabLink(tab.value)}
              className={`
                relative pb-4 text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap shrink-0
                ${isActive 
                  ? "text-[#7b1113]" 
                  : "text-gray-500 hover:text-[#7b1113]/70"
                }
              `}
            >
              {tab.label}

              {isActive && (
                <span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7b1113] rounded-t-full" 
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">
                <Link href={getSortLink("paper_title")} className="group flex items-center hover:text-zinc-900 transition-colors whitespace-nowrap">
                  Title <SortIcon column="paper_title" />
                </Link>
              </th>
              <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[180px]">Author/s</th>
              <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <Link href={getSortLink("paper_year_submitted")} className="group flex items-center hover:text-zinc-900 transition-colors whitespace-nowrap">
                  Year <SortIcon column="paper_year_submitted" />
                </Link>
              </th>
              {type === "all" && (
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap hidden md:table-cell">Type</th>
              )}
              <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[180px]">Adviser</th>
              <th scope="col" className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPapers.length > 0 ? (
              paginatedPapers.map((paper) => {
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
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium">
                      <div className="max-w-[200px] sm:max-w-xs lg:max-w-sm break-all" title={paper.paper_title}>
                        <Modal 
                          id={paper.paper_id} 
                          title={paper.paper_title} 
                          type={paper.paper_type} 
                          pages={paper.paper_pages} 
                          summary={paper.paper_summary} 
                          references={paper.paper_references} 
                          author={formattedAuthors} 
                          adviser={formattedAdviser} />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 min-w-[180px] max-w-[240px] break-words whitespace-normal" title={formattedAuthors}>
                      {formattedAuthors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{paper.paper_year_submitted}</td>
                    {type === "all" && (
                      <td className="px-6 py-4 text-sm text-gray-600">{paper.paper_type}</td>
                    )}
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 min-w-[180px] max-w-[240px] break-words whitespace-normal" title={formattedAdviser}>
                      {formattedAdviser}
                    </td>                  
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><Actions paper={paper} /></td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={type === "all" ? 6 : 5} className="px-6 py-10 text-center text-gray-500 italic">
                  {query ? `No papers found matching "${query}"` : "No papers found in the archive."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {/*Pagination footer*/}
        {totalItems > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-[#faf7f5]">
            <PaginationController 
              currentPage = {currentPage}
              totalPages = {totalPages}
              totalItems = {totalItems}
              itemsPerPage = {itemsPerPage}
            />
          </div> 
        )}
      </div>
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