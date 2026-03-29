'use client'

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { addNewTermAction } from '@/app/dashboard/checklist/student/[student_number]/actions';
import { PencilSquareIcon, CheckIcon, XMarkIcon, PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { calculateChecklistStats, getBaseAY, getDBAcademicYear, generateTermId, getSemesterWeight } from "@/lib/utils";
import { EditableTerm } from './editable-term';

export function ChecklistManager({ studentNumber, records, allTerms, allCourses, takenCourseIds, admissionTerm }: any) {
  const router = useRouter();
  const enrichedTerms = allTerms.map((t: any) => ({ ...t, baseAY: getBaseAY(t.academic_year, t.semester) }));
  const studentRecordAYs = new Set<number>(records.map((r: any) => r.term ? getBaseAY(r.term.academic_year, r.term.semester) : 0).filter(Boolean));
  const currentDate = new Date();
  const maxAllowedAY = currentDate.getMonth() >= 7 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
  const defaultAY = admissionTerm ? getBaseAY(admissionTerm.academic_year, admissionTerm.semester) : maxAllowedAY;
  const initialAYs = studentRecordAYs.size > 0 ? Array.from(studentRecordAYs).sort((a, b) => b - a) : [defaultAY];
  const [availableAYs, setAvailableAYs] = useState<number[]>(initialAYs);
  const [selectedAY, setSelectedAY] = useState<number>(initialAYs[0]);
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
  const [manuallyAddedTerms, setManuallyAddedTerms] = useState<number[]>([]);
  const [invalidTerms, setInvalidTerms] = useState<Record<string, boolean>>({});
  const isGlobalSaveDisabled = Object.values(invalidTerms).some(isInvalid => isInvalid);
  const [isAddTermModalOpen, setIsAddTermModalOpen] = useState(false);
  const [isAddingTerm, startAddingTerm] = useTransition();
  const [modalAY, setModalAY] = useState<number>(currentDate.getFullYear());
  const [modalSem, setModalSem] = useState<string>("First Semester");
  const { passedUnits } = calculateChecklistStats(records);
  const hasCompletedProgram = passedUnits >= 137;
  const activeTermsMap: Record<number, string[]> = {};
  const usedTermIds = new Set([...records.map((r: any) => r.term_taken), ...manuallyAddedTerms]);
  
  enrichedTerms.filter((t: any) => usedTermIds.has(t.term_id)).forEach((t: any) => {
    if (!activeTermsMap[t.baseAY]) activeTermsMap[t.baseAY] = [];
    activeTermsMap[t.baseAY].push(t.semester.toLowerCase());
  });

  const getAllowedSemesters = useCallback((y: number) => {
    const taken = activeTermsMap[y] || [];
    let all = ['First Semester', 'Second Semester', 'Midyear'];
    
    if (y > maxAllowedAY) return []; 
    if (y === maxAllowedAY) {
      all = currentDate.getMonth() >= 7 
        ? ['First Semester'] 
        : currentDate.getMonth() <= 5 
          ? ['First Semester', 'Second Semester'] 
          : all;
    }
    return all.filter(sem => !taken.includes(sem.toLowerCase()));
  }, [activeTermsMap, maxAllowedAY, currentDate]);
  
  const modalAYOptions = Array.from({ length: Math.max(maxAllowedAY, Math.max(...availableAYs, defaultAY)) - defaultAY + 1 }, (_, i) => defaultAY + i)
    .filter(y => getAllowedSemesters(y).length > 0)
    .sort((a, b) => b - a);

  const handleAddNewTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAddingTerm(async () => {
      try {
        const generatedTermId = generateTermId(modalAY, modalSem);
        
        if (!allTerms.some((t: any) => t.term_id === generatedTermId)) {
          const res = await addNewTermAction(studentNumber, generatedTermId, modalSem, getDBAcademicYear(modalAY, modalSem));
          if (res?.error) return alert(res.error);
        }

        if (!availableAYs.includes(modalAY)) setAvailableAYs(prev => [...prev, modalAY].sort((a, b) => b - a));
        setSelectedAY(modalAY);
        setManuallyAddedTerms(prev => [...prev, generatedTermId]);
        setIsEditingGlobal(true);
        setIsAddTermModalOpen(false);
        router.refresh();
      } catch {
        alert("Failed to create term.");
      }
    });
  };

  const termsToDisplay = enrichedTerms
    .filter((t: any) => t.baseAY === selectedAY)
    .sort((a: any, b: any) => getSemesterWeight(a.semester) - getSemesterWeight(b.semester))
    .filter((t: any) => records.some((r: any) => r.term_taken === t.term_id) || manuallyAddedTerms.includes(t.term_id));

  return (
    <>
      <div className="bg-red-50 rounded-[2rem] border border-gray-100 shadow-sm overflow-visible mb-12">
        <div className="bg-red-50 py-2 px-8 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-t-[2rem] items-center">
          <div className="hidden md:block"></div>
          
          <div className="flex justify-center items-center h-10">
            <div className="relative flex items-center h-full">
              <select 
                value={selectedAY} 
                onChange={(e) => { setManuallyAddedTerms([]); setIsEditingGlobal(false); setSelectedAY(Number(e.target.value)); }} 
                className="appearance-none h-full bg-transparent text-maroon-900 font-black text-lg md:text-xl uppercase tracking-widest pl-8 pr-12 rounded-xl border border-transparent outline-none focus:border-maroon hover:bg-red-100/50 transition-colors cursor-pointer text-center"
              >
                {availableAYs.map(ay => ( <option key={ay} value={ay}>Academic Year {ay}-{Number(ay) + 1}</option> ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-4 w-5 h-5 text-maroon-900 opacity-60" />
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-4 h-10">
            <button 
              onClick={() => {
                const targetAY = modalAYOptions.includes(selectedAY) ? selectedAY : (modalAYOptions[0] || currentDate.getFullYear());
                setModalAY(targetAY); 
                setModalSem(getAllowedSemesters(targetAY)[0] || ""); 
                setIsAddTermModalOpen(true);
              }} 
              disabled={hasCompletedProgram || modalAYOptions.length === 0}
              className={`flex items-center justify-center gap-2 h-full w-[140px] rounded-lg text-sm font-bold shadow-sm transition-all
                ${(hasCompletedProgram || modalAYOptions.length === 0) ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-maroon text-white hover:bg-maroon-800 active:scale-95"}`}
            >
              <PlusIcon className="w-5 h-5 stroke-[2.5]" /> Add Term
            </button>
            
            <button 
              onClick={() => setIsEditingGlobal(!isEditingGlobal)} 
              disabled={isEditingGlobal && isGlobalSaveDisabled}
              className={`flex items-center justify-center gap-2 h-full w-[140px] rounded-lg text-sm font-bold transition-all shadow-sm
                ${isEditingGlobal ? isGlobalSaveDisabled ? "bg-gray-100 border border-gray-200 text-gray-700 cursor-not-allowed" : "bg-yellow text-white active:scale-95" : "bg-gray-100 border border-gray-200 text-gray-700 hover:text-yellow active:scale-95"}`} 
            >
              {isEditingGlobal ? <CheckIcon className="w-5 h-5 stroke-[2.5]" /> : <PencilSquareIcon className="w-5 h-5 stroke-[2.5]" />} 
              <span>{isEditingGlobal ? 'Save Changes' : 'Edit Terms'}</span>
            </button>
          </div>
        </div>
        
        <div className={`grid ${termsToDisplay.length >= 3 ? "lg:grid-cols-3" : termsToDisplay.length === 2 ? "lg:grid-cols-2" : "grid-cols-1"} bg-red-50 rounded-b-[2rem]`}>
          {termsToDisplay.length > 0 ? termsToDisplay.map((term: any) => {
            const termRecords = records.filter((r: any) => r.term_taken === term.term_id);
            const { enrolledUnits, gwa } = calculateChecklistStats(termRecords);

            return (
              <EditableTerm 
                key={term.term_id} 
                termId={term.term_id.toString()} 
                data={{ courses: termRecords, termUnits: enrolledUnits, termGwa: gwa, termMetadata: term }}
                studentNumber={studentNumber} 
                allCourses={allCourses} 
                takenCourseIds={takenCourseIds}
                isEditingGlobal={isEditingGlobal}
                onValidationChange={(id, isInv) => setInvalidTerms(p => p[id] === isInv ? p : { ...p, [id]: isInv })}
                onEmptyCleanup={(id) => setManuallyAddedTerms(p => p.filter(x => x !== id))}
              />
            )
          }) : (
            <div className="col-span-full py-20 text-center opacity-50">
              <p className="text-maroon font-bold tracking-widest uppercase text-sm">No records found.</p>
            </div>
          )}
        </div>
      </div>
      
      {isAddTermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm" onClick={() => !isAddingTerm && setIsAddTermModalOpen(false)}>
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
              <h2 className="text-lg font-bold text-maroon">Add Academic Term</h2>
              <button onClick={() => !isAddingTerm && setIsAddTermModalOpen(false)} className="p-2 text-gray-700 hover:text-white hover:bg-maroon rounded-lg transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddNewTermSubmit} className="flex flex-col">
              <div className="p-6 space-y-5 text-left">
                <div>
                  <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Academic Year</label>
                  <div className="relative">
                    <select 
                      value={modalAY} 
                      onChange={(e) => {
                        const newAY = Number(e.target.value);
                        setModalAY(newAY);
                        const newAllowed = getAllowedSemesters(newAY);
                        if (!newAllowed.includes(modalSem)) setModalSem(newAllowed[0] || "");
                      }} 
                      className="w-full bg-gray-50 text-gray-800 text-sm font-bold px-4 py-3 rounded-xl border border-gray-200 focus:border-maroon focus:bg-white outline-none appearance-none cursor-pointer"
                    >
                      {modalAYOptions.map(ay => ( <option key={ay} value={ay}>AY {ay}-{ay + 1}</option> ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-maroon-900 uppercase tracking-widest mb-1.5">Semester</label>
                  <div className="relative">
                    <select 
                      required value={modalSem} onChange={(e) => setModalSem(e.target.value)} 
                      className="w-full bg-gray-50 text-gray-800 text-sm font-bold px-4 py-3 rounded-xl border border-gray-200 focus:border-maroon focus:bg-white outline-none appearance-none cursor-pointer">
                      {getAllowedSemesters(modalAY).map(sem => ( <option key={sem} value={sem}>{sem}</option> ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-red-50">
                <button type="button" onClick={() => setIsAddTermModalOpen(false)} disabled={isAddingTerm} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-maroon transition-colors">Cancel</button>
                <button type="submit" disabled={isAddingTerm || !modalSem} className="px-6 py-2 bg-maroon text-white rounded-lg text-sm font-bold hover:bg-maroon-800 transition-all active:scale-95 disabled:bg-zinc-400 disabled:active:scale-100">
                  {isAddingTerm ? "Adding..." : "Add Term"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}