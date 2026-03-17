import { Suspense } from "react";
import PaperRows, { RowSkeleton } from "./rows";
import UploadButton from "./upload-button";
import SearchInput from "@/components/searchinput";
import { AddPaperActions } from "./actions";
import { createClient } from "@/lib/supabase/server";

async function AddPaperWrapper() {
  const supabase = await createClient();

  const { data: adviser } = await supabase
    .from("adviser")
    .select("adviser_id, adviser_fname, adviser_mname, adviser_lname, adviser_suffix")
    .order("adviser_lname", { ascending: true });

  const adviserOptions = (adviser ?? []).map((a) => ({
    id: a.adviser_id,
    name: `${a.adviser_fname} ${a.adviser_lname}`,
  }));

  return <AddPaperActions adviser={adviserOptions} />;
}

export type SearchProps = {
  searchParams: Promise<{ 
    sort?: string; 
    order?: "asc" | "desc";
    query?: string;
    page?: string;
    itemsPerPage?: string;}>;
};

export default async function AcademicPapersPage({ searchParams }: SearchProps) {
  
  return (
    <div className="max-w-auto mx-auto">
      {/* Action Bar: Search, Add */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full max-w-3xl">
          <Suspense fallback={<div className="h-9 w-full rounded-md bg-gray-200 animate-pulse" />}>
            <SearchInput placeholder="Search Titles, Authors, Etc..." />
          </Suspense>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Suspense fallback={<div className="h-9 w-24 rounded-lg bg-gray-200 animate-pulse" />}>
            <AddPaperWrapper />
          </Suspense>
          <UploadButton />
        </div>
      </div>

      <Suspense fallback={<RowSkeleton />}>
        <PaperRows searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

