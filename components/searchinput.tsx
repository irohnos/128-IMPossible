"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { searchConfigRegistry, type SearchConfigKey, type SearchConfig } from "@/lib/search-config";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-transparent text-maroon font-semibold italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function SearchInputInner<T>({
  config,
  placeholder,
  queryParam,
  onSelect,
}: {
  config?: SearchConfig<T>;
  placeholder: string;
  queryParam: string;
  onSelect?: (value: string, label: string) => boolean | void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(queryParam)?.toString() ?? ""
  );
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedTerm = useDebounce(searchTerm, 300);

  // Sync URL 
  useEffect(() => {
    const currentUrlValue = searchParams.get(queryParam) ?? "";
    if (debouncedTerm === currentUrlValue) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedTerm) {
      params.set(queryParam, debouncedTerm);
    } else {
      params.delete(queryParam);
    }
    params.delete("page");
    
    replace(`${pathname}?${params.toString()}`, { scroll: false });
    
  }, [debouncedTerm, pathname, queryParam, replace, searchParams]);

  useEffect(() => {
    if (!debouncedTerm.trim() || !config) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const results = await config.fetchSuggestions(debouncedTerm);
        if (!cancelled) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedTerm, config]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitSuggestion = useCallback(
    (item: T) => {
      if (!config) return;

      const label = config.getLabel(item);
      const value = config.getValue ? config.getValue(item) : label;

      setSearchTerm(label);
      setIsOpen(false);
      setSuggestions([]);
      inputRef.current?.focus();

      const shouldUpdateUrl = onSelect?.(value, label) !== false;

      if (shouldUpdateUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(queryParam, value);
        params.delete("page");
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [config, onSelect, pathname, queryParam, replace, searchParams]
  );

  // press enter
  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter"){
      setIsOpen(false);
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  function handleClear() {
    setSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete(queryParam);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
    
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280] pointer-events-none z-10" />

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-[#d1d5db] bg-white pl-10 pr-10 py-2 text-sm shadow-sm transition-all placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value) setIsOpen(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 text-[#6b7280] animate-spin" />}
          {searchTerm && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#9ca3af] hover:text-maroon transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {isOpen && suggestions.length > 0 && config && (
        <ul className="absolute z-[60] mt-2 w-full max-h-[300px] overflow-auto rounded-lg border border-[#d1d5db] bg-white shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                commitSuggestion(item);
              }}
              className="group flex flex-col px-4 py-2.5 cursor-pointer hover:bg-[#fff5f5] transition-colors border-b border-[#f3f4f6] last:border-0"
            >
              <div className="flex items-center gap-3">
                <SearchIcon className="h-3.5 w-3.5 shrink-0 text-[#9ca3af] group-hover:text-maroon" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-[#111827] truncate group-hover:text-maroon">
                    {highlightMatch(config.getLabel(item), searchTerm)}
                  </span>
                  {config.getSubLabel && (
                    <span className="text-[11px] text-[#6b7280] truncate mt-0.5">
                      {highlightMatch(config.getSubLabel(item), searchTerm)}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SearchInput<K extends SearchConfigKey>({
  configKey,
  placeholder = "Search...",
  queryParam = "query",
  onSelect,
}: {
  configKey?: K;
  placeholder?: string;
  queryParam?: string;
  onSelect?: (value: string, label: string) => boolean | void;
}) {
  const config = configKey ? searchConfigRegistry[configKey] : undefined;

  return (
    <SearchInputInner
      config={config as any}
      placeholder={placeholder}
      queryParam={queryParam}
      onSelect={onSelect}
    />
  );
}