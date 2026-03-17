"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon, ExclamationTriangleIcon, PlusIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { updatePaperAction, deletePaperAction, addPaperAction } from "@/lib/actions";

export interface Person {
  id: number;
  name: string;
}

export interface ModalProps {
  id: number;
  title: string;
  type: string;
  pages: number;
  summary: string;
  references: string;
}

export interface AuthorInput {
  author_fname: string;
  author_mname: string;
  author_lname: string;
  author_suffix: string;
}


export function getSummaryLabel(type?: string) {
  if (type === "Thesis") return "Abstract";
  if (type === "Strategic Paper") return "Executive Summary";
  return "Summary";
}

function authorActions(initialAuthors?: any[]) {
  const [authors, setAuthors] = useState<AuthorInput[]>(() => {
    if (initialAuthors && initialAuthors.length > 0) {
      return initialAuthors.map((a: any) => ({
        author_fname: a.author_fname || "",
        author_mname: a.author_mname || "",
        author_lname: a.author_lname || "",
        author_suffix: a.author_suffix || "",
      }));
    }
    return [{ author_fname: "", author_mname: "", author_lname: "", author_suffix: "" }];
  });

  const addAuthor = () => setAuthors([...authors, { author_fname: "", author_mname: "", author_lname: "", author_suffix: "" }]);
  const removeAuthor = (index: number) => setAuthors(authors.filter((_, i) => i !== index));
  const updateAuthor = (index: number, field: keyof AuthorInput, value: string) => setAuthors(authors.map((a, i) => i === index ? { ...a, [field]: value } : a));
  return { authors, setAuthors, addAuthor, removeAuthor, updateAuthor };
}

function FormFooter({ onCancel, isProcessing, submitText }: { onCancel: () => void, isProcessing: boolean, submitText: string }) {
  return (
    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-red-50 shrink-0">
      <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-maroon transition-colors">
        Cancel
      </button>
      <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-maroon text-white rounded-lg text-sm font-bold hover:bg-maroon-800 disabled:bg-zinc-400 transition-all active:scale-95 shadow-md">
        {isProcessing ? "Processing..." : submitText}
      </button>
    </div>
  );
}

interface FormFieldsProps {
  authors: AuthorInput[];
  addAuthor: () => void;
  removeAuthor: (index: number) => void;
  updateAuthor: (index: number, field: keyof AuthorInput, value: string) => void;
  advisers: Person[];
  defaultValues?: any;
}

function FormFields({ authors, addAuthor, removeAuthor, updateAuthor, advisers, defaultValues = {} }: FormFieldsProps) {
  const [paperType, setPaperType] = useState(defaultValues.paper_type || "");

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b-2 border-red-100 pb-2">
          <h3 className="text-xs font-black text-maroon uppercase tracking-widest">Authors</h3>
          <button type="button" onClick={addAuthor} className="flex items-center gap-1 text-xs font-bold text-green hover:text-ygreen transition-colors">
            <PlusIcon className="w-4 h-4 stroke-[2.5]" /> Add Author
          </button>
        </div>

        {authors.map((a, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-maroon-900">Author {index + 1}</span>
              {authors.length > 1 && (
                <button type="button" onClick={() => removeAuthor(index)} className="text-xs font-bold text-orange hover:text-red transition-colors">Remove</button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1 text-left">
                <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">First Name</label>
                <input value={a.author_fname} onChange={(e) => updateAuthor(index, "author_fname", e.target.value)} required placeholder="John" className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
              </div>
              <div className="sm:col-span-1 text-left">
                <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Middle Name</label>
                <input value={a.author_mname} onChange={(e) => updateAuthor(index, "author_mname", e.target.value)} placeholder="B." className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
              </div>
              <div className="sm:col-span-1 text-left">
                <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Last Name</label>
                <input value={a.author_lname} onChange={(e) => updateAuthor(index, "author_lname", e.target.value)} required placeholder="Cruz" className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
              </div>
              <div className="sm:col-span-1 text-left">
                <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Suffix</label>
                <input value={a.author_suffix} onChange={(e) => updateAuthor(index, "author_suffix", e.target.value)} placeholder="Jr." className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5 pt-2">
        <div className="flex items-center justify-between border-b-2 border-red-100 pb-2 mb-4">
          <h3 className="text-xs font-black text-maroon uppercase tracking-widest">Paper Details</h3>
        </div>

        <div className="text-left">
          <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Paper Title</label>
          <input name="paper_title" defaultValue={defaultValues.paper_title || ""} required placeholder="Enter full title..." className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all"/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Paper Type</label>
            <div className="relative">
              <select name="paper_type" value={paperType} onChange={(e) => setPaperType(e.target.value)} required className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all appearance-none">
                <option value="" disabled>Select a Type</option>
                <option value="Thesis">Thesis</option>
                <option value="Strategic Paper">Strategic Paper</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Adviser</label>
            <div className="relative">
              <select name="adviser_id" defaultValue={defaultValues.adviser_id || ""} required className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all appearance-none">
                <option value="" disabled>Select an Adviser</option>
                {advisers.map((adv) => ( <option key={adv.id} value={adv.id}>{adv.name}</option> ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Year Submitted</label>
            <input name="paper_year_submitted" type="number" defaultValue={defaultValues.paper_year_submitted || ""} placeholder="e.g. 2024" className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" 
              onKeyDown={(e) => {if (["-", ".", "e", "E", "+", "/"].includes(e.key)) {e.preventDefault();}}}
              min={1998} 
              max={new Date().getFullYear()} 
            />
          </div>
          <div className="text-left">
            <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Total Pages</label>
            <input name="paper_pages" type="number" defaultValue={defaultValues.paper_pages || ""} placeholder="e.g. 50" className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" 
              min={1}
              onKeyDown={(e) => {if (["-", ".", "e", "E", "+", "/"].includes(e.key)) {e.preventDefault();}}}
            />
          </div>
        </div>

        <div className="text-left">
          <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">
            {getSummaryLabel(paperType)}
          </label>
          <textarea name="paper_summary" rows={5} defaultValue={defaultValues.paper_summary || ""} placeholder="Enter abstract or summary..." className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:bg-white transition-all resize-none whitespace-pre-wrap"/>
        </div>

        <div className="text-left">
          <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">References</label>
          <textarea name="paper_references" rows={5} defaultValue={defaultValues.paper_references || ""} placeholder="List references here..." className="w-full bg-gray-50 text-black text-sm px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:bg-white transition-all break-words resize-none"/>
        </div>
      </div>
    </>
  );
}

export function EditAction({ paper, advisers = [] }: { paper: any; advisers?: Person[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authors, addAuthor, removeAuthor, updateAuthor } = authorActions(paper.author);

  const handleEdit = async (formData: FormData) => {
    setIsProcessing(true);
    setError(null);
    
    const updates = {
      paper_title: formData.get("paper_title"),
      paper_type: formData.get("paper_type"),
      adviser_id: formData.get("adviser_id") ? Number(formData.get("adviser_id")) : null,
      paper_year_submitted: parseInt(formData.get("paper_year_submitted") as string),
      paper_pages: parseInt(formData.get("paper_pages") as string),
      paper_summary: formData.get("paper_summary"),
      paper_references: formData.get("paper_references"),
      authors: authors.map(a => ({
        author_fname: a.author_fname,
        author_mname: a.author_mname,
        author_lname: a.author_lname,
        author_suffix: a.author_suffix,
      })),
    };

    try {
      await updatePaperAction(Number(paper.paper_id), updates);
      setIsOpen(false);
    } catch (err: any) {
      setError("Update failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-zinc-400 hover:text-yellow transition-colors">
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm" onClick={() => !isProcessing && setIsOpen(false)}>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 shrink-0">
              <h2 className="text-lg font-bold text-maroon">Update Paper Record — #{paper.paper_id}</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-700 hover:text-white hover:bg-maroon rounded-lg transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form action={handleEdit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {error && ( <div className="p-3 bg-red-50 text-red text-sm rounded-lg border border-red-100 break-words">{error}</div> )}
                <FormFields authors={authors} addAuthor={addAuthor} removeAuthor={removeAuthor} updateAuthor={updateAuthor} advisers={advisers} defaultValues={paper} />
              </div>
              <FormFooter onCancel={() => setIsOpen(false)} isProcessing={isProcessing} submitText="Save Updates" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteAction({ paper }: { paper: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await deletePaperAction(Number(paper.paper_id));
      setIsOpen(false);
    } catch (err: any) {
      setError("Delete failed: " + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-zinc-400 hover:text-maroon transition-colors">
        <TrashIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 transition-opacity backdrop-blur-sm" onClick={() => !isProcessing && setIsOpen(false)}>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center transform transition-all animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon mb-4 shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-lg font-black text-maroon text-center uppercase tracking-wider">Confirm Deletion</h3>

            <div className="mt-2 w-full">
              <p className="text-sm text-gray-500 text-center leading-relaxed break-words">
                Are you sure you want to delete <br />
                <span className="text-maroon-900 font-bold text-lg block my-2 px-2">{paper.paper_title}?</span>
                <span className="text-gray-400 block text-xs uppercase tracking-widest font-bold">This action cannot be undone.</span>
              </p>
            </div>
            
            {error && (<p className="mt-3 w-full text-xs text-red font-medium bg-red-50 p-2 rounded border border-red-100 break-words text-center">{error}</p>)}

            <div className="mt-8 grid grid-cols-2 w-full gap-3">
              <button type="button" onClick={() => setIsOpen(false)} disabled={isProcessing} className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-xs uppercase tracking-widest font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} disabled={isProcessing} className="w-full rounded-2xl bg-maroon px-4 py-3 text-xs uppercase tracking-widest font-bold text-white shadow-sm hover:bg-maroon-900 transition-colors disabled:opacity-50">
                {isProcessing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AddPaperActions({ adviser }: { adviser: Person[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authors, setAuthors, addAuthor, removeAuthor, updateAuthor } = authorActions();

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
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm" onClick={() => !isProcessing && setIsOpen(false)}>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 shrink-0">
              <h2 className="text-lg font-bold text-maroon">New Paper Submission</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form action={handleAdd} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {error && <div className="p-3 bg-red-50 text-red text-sm rounded-lg border border-red-100">{error}</div>}
                <FormFields authors={authors} addAuthor={addAuthor} removeAuthor={removeAuthor} updateAuthor={updateAuthor} advisers={adviser} />
              </div>
              <FormFooter onCancel={() => setIsOpen(false)} isProcessing={isProcessing} submitText="Create Paper" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function Modal({ id, title, type, pages, summary, references }: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-maroon hover:underline text-left font-medium transition-colors">{title}</button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setOpen(false)}/>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
              <h2 className="text-lg font-bold text-maroon">Paper Details — #{id}</h2>
              <button onClick={() => setOpen(false)} className="p-2 text-gray-700 hover:text-white hover:bg-maroon rounded-lg transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xs font-bold text-maroon-900 uppercase tracking-widest mb-2">Title</h3>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{title}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-maroon-900 uppercase tracking-widest mb-2">{getSummaryLabel(type)}</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary || "No summary available."}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-maroon-900 uppercase tracking-widest mb-2">References</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{references || "No references listed."}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-maroon-900 uppercase tracking-widest mb-2">Number of Pages</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{pages}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}