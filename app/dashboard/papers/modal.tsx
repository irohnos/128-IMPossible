"use client";

import { useState } from "react";

interface ModalProps {
  title: string;
  summary: string;
  references: string;
}

export default function PaperModal({ title, summary, references }: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-[#7b1113] hover:underline text-left font-medium transition-colors">{title}</button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setOpen(false)}/>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Paper Details</h2>
              <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Title</h3>
                <p className="text-lg font-semibold text-gray-900 leading-snug">{title}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Summary</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary || "No summary available."}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">References</h3>
                <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{references || "No references listed."}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setOpen(false)} className="px-6 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}