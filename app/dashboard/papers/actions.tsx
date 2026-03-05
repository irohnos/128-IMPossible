"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { updatePaperAction, deletePaperAction } from "@/lib/actions";

export default function PaperActions({ paper }: { paper: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async (formData: FormData) => {
    setIsProcessing(true);
    setError(null);

    const updates = {
      paper_title: formData.get("paper_title"),
      paper_year_submitted: parseInt(formData.get("paper_year_submitted") as string),
      paper_pages: parseInt(formData.get("paper_pages") as string),
      paper_summary: formData.get("paper_summary"),
      paper_references: formData.get("paper_references"),
    };

    try {
      await updatePaperAction(Number(paper.paper_id), updates);
      setIsEditOpen(false);
    } catch (err: any) {
      setError("Update failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await deletePaperAction(Number(paper.paper_id));
      setIsDeleteConfirmOpen(false);
    } catch (err: any) {
      setError("Delete failed: " + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-end gap-3">
      <button 
        onClick={() => setIsEditOpen(true)} 
        className="text-zinc-400 hover:text-blue-600 transition-colors"
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      <button 
        onClick={() => setIsDeleteConfirmOpen(true)} 
        className="text-zinc-400 hover:text-red-600 transition-colors"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" 
            onClick={() => !isProcessing && setIsDeleteConfirmOpen(false)} 
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4 shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 text-center">Confirm Deletion</h3>

            <div className="mt-2 w-full">
              <p className="text-sm text-gray-500 text-center leading-relaxed break-words">
                Are you sure you want to delete <br />
                <span className="text-gray-900 block my-1 px-2 italic">
                  {paper.paper_title}?
                </span>
                <span className="text-gray-500 block">This action cannot be undone.</span>
              </p>
            </div>
            
            {error && (
              <p className="mt-3 w-full text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100 break-words text-center">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-6 w-full">
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-900 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:bg-red-300 transition-all active:scale-95"
              >
                {isProcessing ? "Deleting..." : "Delete Paper"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => !isProcessing && setIsEditOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Update Paper Record</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <form action={handleEdit} className="p-6 overflow-y-auto space-y-5 min-w-0">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 break-words">
                  {error}
                </div>
              )}
              
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Paper Title</label>
                <input 
                  name="paper_title"
                  defaultValue={paper.paper_title}
                  required
                  className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 focus:border-zinc-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Year Submitted</label>
                  <input name="paper_year_submitted" type="number" defaultValue={paper.paper_year_submitted} className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 focus:border-zinc-500 focus:bg-white outline-none" />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Total Pages</label>
                  <input name="paper_pages" type="number" defaultValue={paper.paper_pages} className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 focus:border-zinc-500 focus:bg-white outline-none" />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Summary</label>
                <textarea 
                  name="paper_summary"
                  rows={5}
                  defaultValue={paper.paper_summary}
                  className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-zinc-300 resize-none whitespace-pre-wrap"
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">References</label>
                <textarea 
                  name="paper_references"
                  rows={5}
                  defaultValue={paper.paper_references}
                  className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-zinc-500 break-words resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-bold hover:bg-black disabled:bg-zinc-400">
                  {isProcessing ? "Processing..." : "Save Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}