"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
    
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
    
if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const range = 2; 

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range) 
      ) {
        pages.push(i);
      } else if (i === currentPage - range - 1 || i === currentPage + range + 1
      ) {
        pages.push("...");
      }
    }
    return pages.filter((page, index) => page !== "..." || pages[index - 1] !== "...");
  };

  const navBtnClass = "flex items-center justify-center h-9 w-9 rounded-full bg-[#7b1113] text-white border-2 border-[#7b1113] hover:bg-[#faf7f5] hover:text-[#7b1113] hover:border-[#7b1113] hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm";
  const numberBtnClass = "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all border";    
    
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="text-sm text-[#7b1113]">
            Showing <span className="font-semibold ">{startItem}</span> to{" "}
            <span className="font-semibold">{endItem}</span> of{" "}
            <span className="font-semibold">{totalItems}</span> results
          </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={navBtnClass}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

        <div className="flex items-center gap-1.5 bg-[#faf7f5]">
          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              disabled={page === "..."}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`${numberBtnClass} ${
                currentPage === page
                  ? "border-2 border-[#7b1113] text-[#7b1113] font-bold shadow-sm hover:bg-[#7b1113] hover:text-[#faf7f5] hover:scale-110"
                  : "border-transparent text-[#7b1113]/50 hover:bg-[#7b1113]/10 hover:text-[#7b1113]/70 hover:font-semibold hover:scale-110" 
              } ${page === "..." ? "cursor-default border-none hover:bg-transparent" : ""}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={navBtnClass}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}