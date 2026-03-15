"use client";

import { useState } from "react";

interface ModalProps {
  id: number;
  title: string;
  type: string;
  pages: number;
  summary: string;
  references: string;
}

export default function PaperModal({ id, title, type, pages, summary, references }: ModalProps) {
  const [open, setOpen] = useState(false);

  const getSummaryLabel = () => {
    if (type === "Thesis") return "Abstract";
    if (type === "Strategic Paper") return "Executive Summary";
    return "Summary";
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-[#7b1113] hover:underline text-left font-medium transition-colors">{title}</button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setOpen(false)}/>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#faf7f5]">
              <h2 className="text-lg font-bold text-[#7b1113]">Paper Details — #{id}</h2>
              <button onClick={() => setOpen(false)} className="p-2 text-gray-700 hover:text-white hover:bg-[#7b1113] rounded-lg transition-colors">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xs font-bold text-[#3b0708] uppercase tracking-widest mb-2">Title</h3>
                <p className="text-lg font-semibold text-gray-900 leading-snug">{title}</p>
              </div>
              
              <div>
                <h3 className="text-xs font-bold text-[#3b0708] uppercase tracking-widest mb-2">{getSummaryLabel()}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary || "No summary available."}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#3b0708] uppercase tracking-widest mb-2">References</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{references || "No references listed."}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#3b0708] uppercase tracking-widest mb-2">Number of Pages</h3>
                <p className="text-gray-700 leading-relaxed">{pages}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}