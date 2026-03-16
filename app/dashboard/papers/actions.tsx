"use client";

interface Person {
  id: number;
  name: string;
}

import { useState } from "react";
import { PencilSquareIcon, TrashIcon, ExclamationTriangleIcon, PlusIcon} from "@heroicons/react/24/outline";
import { updatePaperAction, deletePaperAction, addPaperAction } from "@/lib/actions";

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
        className="text-zinc-400 hover:text-yellow transition-colors"
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      <button 
        onClick={() => setIsDeleteConfirmOpen(true)} 
        className="text-zinc-400 hover:text-maroon transition-colors"
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon mb-4 shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-lg font-bold text-maroon text-center">Confirm Deletion</h3>

            <div className="mt-2 w-full">
              <p className="text-sm text-gray-500 text-center leading-relaxed break-words">
                Are you sure you want to delete <br />
                <span className="text-maroon-900 block my-1 px-2 italic">{paper.paper_title}?</span>
                <span className="text-gray-500 block">This action cannot be undone.</span>
              </p>
            </div>
            
            {error && (
              <p className="mt-3 w-full text-xs text-red font-medium bg-red-50 p-2 rounded border border-red-100 break-words text-center">
                {error}
              </p>
            )}

            <div className="flex mt-4 shrink-0">
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isProcessing}
                className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-maroon transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isProcessing}
                className="px-6 py-2 bg-maroon text-white rounded-lg text-sm font-bold hover:bg-maroon-800 disabled:bg-zinc-400 transition-all active:scale-95 shadow-md"
              >
                {isProcessing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => !isProcessing && setIsEditOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 shrink-0">
              <h2 className="text-lg font-bold text-maroon">Update Paper Record — #{paper.paper_id}</h2>
              <button onClick={() => setIsEditOpen(false)} className="p-2 text-gray-700 hover:text-white hover:bg-maroon rounded-lg transition-colors">✕</button>
            </div>

            <form action={handleEdit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 text-red text-sm rounded-lg border border-red-100 break-words">
                    {error}
                  </div>
                )}
                
                <div className="text-left">
                  <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Paper Title</label>
                  <input 
                    name="paper_title"
                    defaultValue={paper.paper_title}
                    required
                    className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 focus:border-zinc-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Year Submitted</label>
                    <input 
                      name="paper_year_submitted" 
                      type="number" 
                      defaultValue={paper.paper_year_submitted} 
                      onKeyDown={(e) => {if (["-", ".", "e", "E", "+", "/"].includes(e.key)) {e.preventDefault();}}}
                      min={1998} 
                      max={new Date().getFullYear()} 
                      className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 focus:border-zinc-500 focus:bg-white outline-none" 
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Total Pages</label>
                    <input 
                      name="paper_pages" 
                      type="number" 
                      defaultValue={paper.paper_pages} 
                      min={1}
                      onKeyDown={(e) => {if (["-", ".", "e", "E", "+", "/"].includes(e.key)) {e.preventDefault();}}}
                      className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 focus:border-zinc-500 focus:bg-white outline-none" 
                    />
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Summary</label>
                  <textarea 
                    name="paper_summary"
                    rows={5}
                    defaultValue={paper.paper_summary}
                    className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-zinc-300 resize-none whitespace-pre-wrap"
                  />
                </div>

                <div className="text-left">
                  <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">References</label>
                  <textarea 
                    name="paper_references"
                    rows={5}
                    defaultValue={paper.paper_references}
                    className="w-full bg-gray-50 text-black px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-zinc-500 break-words resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-red-50 shrink-0">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-maroon transition-colors">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-maroon text-white rounded-lg text-sm font-bold hover:bg-maroon-800 disabled:bg-zinc-400 transition-all active:scale-95 shadow-md">
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

export function AddPaperActions({ adviser }: { adviser: Person[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authors, setAuthors] = useState([
    { author_fname: "", author_mname: "", author_lname: "", author_suffix: "" }
  ]);

  const addAuthor = () => {
    setAuthors([...authors, { author_fname: "", author_mname: "", author_lname: "", author_suffix: "" }]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const updateAuthor = (index: number, field: string, value: string) => {
    setAuthors(authors.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const handleAdd = async (formData: FormData) => {
    setIsProcessing(true);
    setError(null);

    const newPaper = {
      paper_title: formData.get("paper_title"),
      paper_year_submitted: parseInt(formData.get("paper_year_submitted") as string),
      paper_pages: parseInt(formData.get("paper_pages") as string),
      paper_summary: formData.get("paper_summary"),
      paper_references: formData.get("paper_references"), 
      paper_type: formData.get("paper_type"),
      adviser_id: formData.get("adviser_id") ? Number(formData.get("adviser_id")) : null,
      authors: authors.map(a => ({
        author_fname: a.author_fname,
        author_mname: a.author_mname,
        author_lname: a.author_lname,
        author_suffix: a.author_suffix,
      })),
    };

    try {
      await addPaperAction(newPaper);
      setIsOpen(false);
      setAuthors([{ author_fname: "", author_mname: "", author_lname: "", author_suffix: "" }]);
    } catch (err: any) {
      setError("Add paper failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-maroon-800 transition-all active:scale-95 shadow-sm">
        <PlusIcon className="w-5 h-5" /> Add Paper
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => !isProcessing && setIsOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">New Paper Submission</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <form action={handleAdd} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {error && <div className="p-3 bg-red-50 text-red text-sm rounded-lg border border-red-100">{error}</div>}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-1">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Authors</h3>
                    <button
                      type="button"
                      onClick={addAuthor}
                      className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-green transition-colors"
                    >
                      <PlusIcon className="w-3.5 h-3.5" /> Add Author
                    </button>
                  </div>

                  {authors.map((a, index) => (
                    <div key={index} className="space-y-2">
                      {authors.length > 1 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-400">Author {index + 1}</span>
                          <button type="button" onClick={() => removeAuthor(index)} className="text-xs text-maroon hover:text-orange">Remove</button>
                        </div>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">First Name</label>
                          <input value={a.author_fname} onChange={(e) => updateAuthor(index, "author_fname", e.target.value)} required placeholder="John" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Middle Name</label>
                          <input value={a.author_mname} onChange={(e) => updateAuthor(index, "author_mname", e.target.value)} placeholder="B." className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Last Name</label>
                          <input value={a.author_lname} onChange={(e) => updateAuthor(index, "author_lname", e.target.value)} required placeholder="Cruz" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Suffix</label>
                          <input value={a.author_suffix} onChange={(e) => updateAuthor(index, "author_suffix", e.target.value)} placeholder="Jr." className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Paper Details</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Paper Title</label>
                    <input name="paper_title" required placeholder="Enter full title..." className="w-full bg-gray-50 px-4 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Adviser</label>
                      <select name="adviser_id" required className="w-full bg-gray-50 px-3 py-2.5 rounded-md border border-gray-200 outline-none text-sm">
                        <option value="">Select Adviser</option>
                        {adviser.map((adv) => (
                          <option key={adv.id} value={adv.id}>{adv.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Year</label>
                      <input name="paper_year_submitted" type="number" min={1988} max={new Date().getFullYear()} placeholder="2024" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none" />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Total Pages</label>
                      <input name="paper_pages" type="number" min={1} placeholder="0" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none" />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Paper Type</label>
                      <select name="paper_type" required defaultValue="" className="w-full bg-gray-50 px-3 py-2.5 rounded-md border border-gray-200 outline-none text-sm">
                        <option value="" disabled>Select Type</option>
                        <option value="Thesis">Thesis</option>
                        <option value="Strategic Paper">Strategic Paper</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Summary</label>
                    <textarea name="paper_summary" rows={3} className="w-full bg-gray-50 px-4 py-2 rounded-md border border-gray-200 outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">References</label>
                    <textarea name="paper_references" rows={3} className="w-full bg-gray-50 px-4 py-2 rounded-md border border-gray-200 outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-maroon transition-colors">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-maroon text-white rounded-lg text-sm font-bold hover:bg-maroon-800 disabled:bg-zinc-400 transition-all active:scale-95 shadow-md">
                  {isProcessing ? "Saving..." : "Create Paper"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}