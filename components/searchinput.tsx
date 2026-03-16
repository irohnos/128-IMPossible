"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SearchInputProps {
  placeholder?: string;
}

interface Suggestion {
  paper_title: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

async function fetchSuggestions(query: string): Promise<Suggestion[]> {
  if (!query.trim()) return [];
 
  const supabase = createClient();
 
  const { data, error } = await supabase
    .from("academic_papers") 
    .select("paper_title")
    .ilike("paper_title", `%${query}%`)
    .order("paper_title", { ascending: true })
    .limit(7);
 
  if (error) {
    console.error("[SearchInput] Supabase suggestion error:", error.message);
    return [];
  }

  const seen = new Set<string>();

  return (data as Suggestion[]).filter(({ paper_title }) => {
    if (seen.has(paper_title)) return false;
    seen.add(paper_title);
    return true;
  });
}

export default function SearchInput({
  placeholder = "Search papers…",
  }: SearchInputProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [searchTerm, setSearchTerm] = useState(
      searchParams.get("query")?.toString() ?? ""
  );
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedTerm) {
      params.set("query", debouncedTerm);
    } else {
      params.delete("query");
    }

    params.delete("page"); 

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedTerm]); 

  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const results = await fetchSuggestions(debouncedTerm);
      if (!cancelled) {
        setSuggestions(results);
        setIsOpen(results.length > 0);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedTerm]);


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const commitSuggestion = useCallback(
    (title: string) => {
      setSearchTerm(title);
      setIsOpen(false);
      setSuggestions([]);

      const params = new URLSearchParams(searchParams.toString());
      params.set("query", title);
      params.delete("page");
      replace(`${pathname}?${params.toString()}`, { scroll: false });

      inputRef.current?.focus();
    },
    [pathname, replace, searchParams]
  );


  function handleClear() {
    setSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function highlightMatch(text: string, query: string) {
    if (!query.trim()) return <span>{text}</span>;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-transparent text-green font-semibold"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative flex-grow">
      {/* Search icon */}
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280] pointer-events-none z-10" />
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="suggestions-listbox"
        placeholder={placeholder}
        className="flex h-9 w-full rounded-md border border-[#d1d5db] bg-transparent pl-9 pr-8 py-1 text-sm shadow-sm transition-colors placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maroon hover:border-maroon focus:border-maroon"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (e.target.value === "") setIsOpen(false);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        autoComplete="off"
        spellCheck={false}
      />

      {/* Right-side indicator: spinner or clear button */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 text-[#6b7280] animate-spin" />
        ) : searchTerm ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="text-[#6b7280] hover:text-maroon transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id="suggestions-listbox"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-50 mt-1 w-full rounded-md border border-[#d1d5db] bg-white shadow-lg overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.paper_title}
            id={`suggestion-${index}`}
            role="option"
            aria-selected={false}
            onMouseDown={(e) => {
              e.preventDefault();
              commitSuggestion(suggestion.paper_title);
            }}
            className={`
              flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer
              transition-colors duration-75 select-none text-[#111827] hover:bg-[#fdf5f5] hover:text-maroon
              ${index !== suggestions.length - 1 ? "border-b border-[#f3f4f6]" : ""}
            `}
          >
            <SearchIcon className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" />
            <span className="truncate">
              {highlightMatch(suggestion.paper_title, searchTerm)}
            </span>
          </li>
          ))}

        </ul>
      )}
    </div>
  );
}