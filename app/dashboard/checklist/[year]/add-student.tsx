"use client";

import { useState } from "react";
import { PlusIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { addStudentAction } from "./action";
import RestrictedInput from "@/components/restricted-inputs";

interface AddStudentProps {
  batchYear: string;
  advisers: { id: number; name: string }[];
  terms: { id: number; name: string }[];
}

export default function AddStudentButton({ batchYear, advisers, terms }: AddStudentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsProcessing(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("batch_year", batchYear);

    try {
      const res = await addStudentAction(formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setIsOpen(false);
    } catch (err: any) {
      setError("An unexpected system error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const targetTermName = `First Semester, AY ${batchYear}`;
  const defaultTerm = terms.find(t => t.name === targetTermName);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-maroon-800 transition-all active:scale-95 shadow-sm">
        <PlusIcon className="w-5 h-5 stroke-[2.5]" /> Add Student
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="absolute inset-0 cursor-default" onClick={() => !isProcessing && setIsOpen(false)} />
          
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 shrink-0">
              <h2 className="text-lg font-bold text-maroon">New Student Registration</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-700 hover:text-white hover:bg-maroon rounded-lg transition-colors flex items-center justify-center">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
                {error && <div className="p-3 bg-red-50 text-red text-sm rounded-lg border border-red-100 break-words">{error}</div>}
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">First Name *</label>
                    <RestrictedInput restrictionType="name" type="text" name="student_fname" placeholder="John" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" required />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Middle Name</label>
                    <RestrictedInput restrictionType="name" type="text" name="student_mname" placeholder="Baron" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Last Name *</label>
                    <RestrictedInput restrictionType="name" type="text" name="student_lname" placeholder="Cruz" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" required />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Suffix</label>
                    <RestrictedInput restrictionType="name" type="text" name="student_suffix" placeholder="Jr." className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Email *</label>
                    <input type="email" name="student_email" placeholder="jbcruz@university.edu.ph" required className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Contact Number</label>
                    <RestrictedInput restrictionType="number" type="tel" name="student_contact_no" placeholder="09XXXXXXXXX" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all text-left" 
                      minLength={11} 
                      maxLength={11} 
                      pattern="[0]{1}[9]{1}[0-9]{9}" 
                      title="Contact number must start with 09 and be exactly 11 digits"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Student Number *</label>
                    <RestrictedInput restrictionType="number" type="text" name="student_number" placeholder={`${batchYear}XXXXX`} required className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all font-mono" 
                      minLength={9}
                      maxLength={9}
                      pattern="(19|20)[0-9]{7}"
                      title="Student Number must be exactly 9 digits and start with a valid year (e.g., 202312345)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">SAIS ID *</label>
                    <RestrictedInput restrictionType="number" type="text" name="student_sais_id" placeholder="1100XXXX" required className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all font-mono" 
                      minLength={8}
                      maxLength={8}
                      pattern="[0-9]{8}"
                      title="SAIS ID must be exactly 8 digits long"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Term Admitted *</label>
                    <div className="relative">
                      {defaultTerm && (
                        <input type="hidden" name="term_admitted" value={defaultTerm.id} />
                      )}
                      <input 
                        type="text" 
                        disabled 
                        defaultValue={defaultTerm?.name || targetTermName} 
                        className="w-full bg-gray-200 text-gray-500 text-sm px-4 py-2.5 rounded-lg border border-gray-200 cursor-not-allowed outline-none"
                      />
                      {!defaultTerm && (
                         <p className="absolute -bottom-5 left-0 text-[10px] text-red font-bold">
                           Warning: This term does not exist in the database yet.
                         </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Adviser *</label>
                    <div className="relative">
                      <select name="adviser_id" required defaultValue="" className="w-full bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all appearance-none">
                        <option value="">Select an Adviser</option>
                        {advisers.map((adviser) => ( <option key={adviser.id} value={adviser.id}>{adviser.name}</option> ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-red-50 shrink-0">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-maroon transition-colors">
                  Cancel
                </button>
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