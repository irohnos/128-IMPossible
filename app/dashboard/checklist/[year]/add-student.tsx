"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addStudentAction } from "./action";

interface AddStudentProps {
  batchYear: string;
  advisers: { id: number; name: string }[];
  terms: { id: number; name: string }[];
}

export default function AddStudentButton({ batchYear, advisers, terms }: AddStudentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (formData: FormData) => {
    setIsProcessing(true);
    setError(null);
    formData.append("batch_year", batchYear);

    try {
      await addStudentAction(formData);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-maroon-800 transition-all active:scale-95 shadow-sm"
      >
        <PlusIcon className="w-5 h-5" /> Add Student
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => !isProcessing && setIsOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">New Student Registration — Batch {batchYear}</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <form action={handleAdd} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {error && <div className="p-3 bg-red-50 text-red text-sm rounded-lg border border-red-100">{error}</div>}
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Personal Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">First Name *</label>
                      <input name="student_fname" required placeholder="Juan" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Middle Name</label>
                      <input name="student_mname" placeholder="G." className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Last Name *</label>
                      <input name="student_lname" required placeholder="Dela Cruz" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Suffix</label>
                      <input name="student_suffix" placeholder="Jr." className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
                      <input name="student_email" type="email" placeholder="student@up.edu.ph" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                      <input name="student_contact_no" placeholder="09123456789" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Academic Records</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Student Number *</label>
                      <input name="student_number" required defaultValue={`${batchYear}`} className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500 font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SAIS ID</label>
                      <input name="student_sais_id" placeholder="1100XX" className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-zinc-500 font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Admission Term *</label>
                      <select name="term_admitted" required defaultValue="" className="w-full bg-gray-50 px-3 py-2.5 rounded-md border border-gray-200 outline-none focus:border-zinc-500 text-sm">
                        <option value="" disabled>Select Admission Term</option>
                        {terms.map((term) => (
                          <option key={term.id} value={term.id}>{term.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Academic Adviser</label>
                      <select name="adviser_id" defaultValue="" className="w-full bg-gray-50 px-3 py-2.5 rounded-md border border-gray-200 outline-none focus:border-zinc-500 text-sm">
                        <option value="">Select Adviser (Optional)</option>
                        {advisers.map((adv) => (
                          <option key={adv.id} value={adv.id}>{adv.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-maroon transition-colors">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-maroon text-white rounded-lg text-sm font-bold hover:bg-maroon-800 disabled:bg-zinc-400 transition-all active:scale-95 shadow-md">
                  {isProcessing ? "Registering..." : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}