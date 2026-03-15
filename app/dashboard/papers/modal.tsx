"use client";

import { useState } from "react";

interface ModalProps {
  id: number;
  title: string;
  type: string;
  pages: number;
  summary: string;
  references: string;
  author: string;
  adviser: string;
}

export default function PaperModal({
  id,
  title,
  type,
  pages,
  summary,
  references,
  author,
  adviser,
}: ModalProps) {
  const [open, setOpen] = useState(false);

  const getSummaryLabel = () => {
    if (type === "Thesis") return "Abstract";
    if (type === "Strategic Paper") return "Executive Summary";
    return "Summary";
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[#014421] hover:text-[#7b1113] hover:underline text-left font-medium transition-colors duration-200"
      >
        {title}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ">
          <div
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-[#014421]/15">

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-2 bg-[#7b1113] shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest text-[#faf7f5]/60 uppercase">
                  #{id}
                </span>
                <span className="w-px h-4 bg-[#faf7f5]/25" />
                <span className="text-xs font-semibold text-[#faf7f5]/80 uppercase tracking-wider">
                  Paper Details
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-[#faf7f5]/60 hover:text-white hover:scale-110 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1">

              {/* Title Section */}
              <div className="px-6 pt-4 pb-5 border-b border-[#014421]/10">
                <p className="text-[10px] font-bold ppercase tracking-[0.18em] mb-2 text-[#014421]">
                  Title
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#7b1113] leading-snug">
                  {title}
                </h2>
              </div>

              {/* Metadata 2-Column Grid */}
              <div className="px-6 py-5 border-b border-[#014421]/10 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="bg-[#faf7f5] rounded-xl px-4 py-3 border border-[#014421]/10">
                    <p className="text-[10px] font-bold text-[#014421] uppercase tracking-[0.18em] mb-1">
                      Type
                    </p>
                    <p className="text-sm font-semibold text-[#7b1113]">{type || "—"}</p>
                  </div>

                  <div className="bg-[#faf7f5] rounded-xl px-4 py-3 border border-[#014421]/10">
                    <p className="text-[10px] font-bold text-[#014421] uppercase tracking-[0.18em] mb-1">
                      Pages
                    </p>
                    <p className="text-sm font-semibold text-[#7b1113]">{pages ?? "—"}</p>
                  </div>

                  <div className="bg-[#faf7f5] rounded-xl px-4 py-3 border border-[#014421]/10">
                    <p className="text-[10px] font-bold text-[#014421] uppercase tracking-[0.18em] mb-1">
                      Author
                    </p>
                    <p className="text-sm font-semibold text-[#7b1113]">{author || "—"}</p>
                  </div>

                  <div className="bg-[#faf7f5] rounded-xl px-4 py-3 border border-[#014421]/10">
                    <p className="text-[10px] font-bold text-[#014421] uppercase tracking-[0.18em] mb-1">
                      Adviser
                    </p>
                    <p className="text-sm font-semibold text-[#7b1113]">{adviser || "—"}</p>
                  </div>

                </div>
              </div>

              {/* Summary or Abstract */}
              <div className="px-6 py-5 border-b border-[#014421]/10">
                <p className="text-[10px] font-bold text-[#014421] uppercase tracking-[0.18em] mb-3">
                  {getSummaryLabel()}
                </p>
                <div className="bg-[#faf7f5] rounded-xl px-4 py-4 border border-[#014421]/10">
                  <p className="text-sm text-[#7b1113] leading-relaxed whitespace-pre-wrap">
                    {summary || "No summary available."}
                  </p>
                </div>
              </div>

              {/* References */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-[#014421] uppercase tracking-[0.18em] mb-3">
                  References
                </p>
                <div className="bg-[#faf7f5] rounded-xl px-4 py-4 border border-[#014421]/10">
                  <p className="text-sm text-[#7b1113] whitespace-pre-wrap leading-relaxed">
                    {references || "No references listed."}
                  </p>
                </div>
              </div>

            </div>


          </div>
        </div>
      )}
    </>
  );
}