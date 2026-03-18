"use client";

import { useMemo } from "react";
import { createBatchStudentSearchConfig } from "@/lib/search-config";
import { SearchInputInner } from "@/components/searchinput";  // ← named import, not default

export default function BatchStudentSearch({ batchYear }: { batchYear: string }) {
  const config = useMemo(() => createBatchStudentSearchConfig(batchYear), [batchYear]);
  return (
    <SearchInputInner
      config={config}
      placeholder="Search by Name, Student Number, etc."
      queryParam="query"
    />
  );
}