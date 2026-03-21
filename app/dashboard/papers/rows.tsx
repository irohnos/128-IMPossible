import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronUpIcon, ChevronDownIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { EditAction, DeleteAction, Modal } from "./actions";
import { formatFullName } from "@/lib/utils";
import PaginationController from "@/components/pagination-controller";
import { populateAdvisers } from "@/lib/data";

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
  const itemsPerPage = 8;
  const supabase = await createClient();
  const advisersList = await populateAdvisers();

  let supabaseQuery = supabase
    .from("academic_papers")
    .select(`*,
      adviser!inner (adviser_fname, adviser_mname, adviser_lname, adviser_suffix),
      author (author_fname, author_mname, author_lname, author_suffix)  
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
      if (paper.paper_title.toLowerCase().includes(q) || paper.paper_references?.toLowerCase().includes(q)) return true;
      if (paper.paper_year_submitted?.toString().includes(q) || paper.paper_pages?.toString().includes(q)) return true;
      
      const adviser = Array.isArray(paper.adviser) ? paper.adviser[0] : paper.adviser;
      if (adviser && formatFullName(adviser.adviser_fname, adviser.adviser_mname, adviser.adviser_lname, adviser.adviser_suffix).toLowerCase().includes(q)) return true;

      const hasNoAuthors = !paper.author || (Array.isArray(paper.author) && paper.author.length === 0);
      if (hasNoAuthors && "unknown".includes(q)) return true;
      
      const authorMatch = paper.author?.some((a: any) => formatFullName(a.author_fname, a.author_mname, a.author_lname, a.author_suffix).toLowerCase().includes(q));
      return !!authorMatch;
    });
  }

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
    if (sort !== column) return <ArrowsUpDownIcon className="ml-1.5 h-3.5 w-3.5 opacity-30 group-hover:opacity-100 transition-opacity" />;
    return order === "asc" ? (
      <ChevronUpIcon className="ml-1.5 h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
    ) : (
      <ChevronDownIcon className="ml-1.5 h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
        {[
          { label: "All Papers", value: "all" },
          { label: "Theses", value: "thesis" },
          { label: "Strategic Papers", value: "strategic" },
        ].map((tab) => {
          const isActive = type === tab.value;
          return (
            <Link key={tab.value} href={getTabLink(tab.value)} className={`relative pb-4 text-sm font-medium transition-all duration-200 ease-in-out ${isActive ? "text-maroon font-bold" : "text-gray-500 hover:text-maroon/70"}`}>
              {tab.label}
              {isActive && (<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-maroon rounded-t-full" aria-hidden="true"/>)}
            </Link>
          );
        })}
      </div>
    
      {/*Headers*/}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50/80">
            <tr>
              <th scope="col" className="w-[350px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <Link href={getSortLink("paper_title")} className="group flex items-center hover:text-maroon transition-colors">
                  Title <SortIcon column="paper_title" />
                </Link>
              </th>
              <th scope="col" className="w-[200px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author/s</th>
              <th scope="col" className="w-[100px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <Link href={getSortLink("paper_year_submitted")} className="group flex items-center hover:text-maroon transition-colors">
                  Year <SortIcon column="paper_year_submitted"/>
                </Link>
              </th>
              {type === "all" && ( <th className="w-[150px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th> )}
              <th scope="col" className="w-[200px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adviser</th>
              <th scope="col" className="w-[120px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedPapers.length > 0 ? (
              paginatedPapers.map((paper) => {
                const adv = Array.isArray(paper.adviser) ? paper.adviser[0] : paper.adviser;
                const formattedAdviser = adv ? formatFullName(adv.adviser_fname, adv.adviser_mname, adv.adviser_lname, adv.adviser_suffix) : "N/A";
                const formattedAuthors = paper.author?.length 
                  ? paper.author.map((a: any) => formatFullName(a.author_fname, a.author_mname, a.author_lname, a.author_suffix)).join(", ")
                  : "Unknown";

                return (
                  <tr key={paper.paper_id} className="hover:bg-red-50/30 transition-colors border-b border-gray-100">
                    <td className="px-6 py-4 w-[350px] min-w-[350px] max-w-[350px]">
                      <div className="truncate text-sm font-medium leading-tight" title={paper.paper_title}>
                        <Modal id={paper.paper_id} title={paper.paper_title} type={paper.paper_type} pages={paper.paper_pages} year={paper.paper_year_submitted} summary={paper.paper_summary} references={paper.paper_references} author={formattedAuthors} adviser={formattedAdviser}/>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[200px] min-w-[200px] max-w-[200px]">
                      <div className="truncate text-sm text-gray-600" title={formattedAuthors}>
                        {formattedAuthors}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[100px] min-w-[100px] text-sm text-gray-600 whitespace-nowrap">
                      {paper.paper_year_submitted}
                    </td>
                    {type === "all" && (
                      <td className="px-6 py-4 w-[150px] min-w-[150px] text-sm text-gray-600 truncate">
                        {paper.paper_type}
                      </td>
                    )}
                    <td className="px-6 py-4 w-[200px] min-w-[200px] max-w-[200px]">
                      <div className="truncate text-sm text-gray-600" title={formattedAdviser}>
                        {formattedAdviser}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[120px] min-w-[120px] text-right">
                      <div className="flex justify-end gap-3">
                        <EditAction paper={paper} advisers={advisersList} />
                        <DeleteAction paper={paper} />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={type === "all" ? 6 : 5} className="px-6 py-14">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-maroon font-bold tracking-widest uppercase text-sm">
                      {query ? `No results for "${query}"` : "No papers found in the archive."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalItems > 0 && (
          <div className="px-6 py-4 border-t border-red-100 bg-red-50">
            <PaginationController currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} />
          </div> 
        )}
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-14 bg-gray-50 border-b border-gray-200" />
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex px-6 py-5 border-b border-gray-100 last:border-0 gap-4 items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="h-4 bg-gray-100 rounded w-1/6" />
        </div>
      ))}
    </div>
  );
}
