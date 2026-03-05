"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({ placeholder = "Search..." }: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchTerm) {
        params.set("query", searchTerm);
      } else {
        params.delete("query");
      }
      
      // Reset to page 1 when the user types a new search
      params.delete("page"); 


      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

   return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="relative flex-grow">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
      <input
        type="text"
        placeholder={placeholder}
        className="flex h-9 w-full rounded-md border border-[#d1d5db] bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8C9657]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
   </div>
  );
}