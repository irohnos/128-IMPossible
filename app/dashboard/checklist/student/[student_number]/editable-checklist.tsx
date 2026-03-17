'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateChecklist, deleteChecklistRecord } from '@/app/dashboard/checklist/student/[student_number]/actions';
import { PencilSquareIcon, CheckIcon, XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function EditableTerm({ termId, data, studentNumber }: { termId: string, data: any, studentNumber: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editedGrades, setEditedGrades] = useState<Record<string, string>>({});
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const termGwa = data.termUnits > 0 ? (data.termWeightedPoints / data.termUnits).toFixed(2) : "0.00";
  const handleGradeChange = (recordId: string, value: string) => { setEditedGrades(prev => ({ ...prev, [recordId]: value })); };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const updatePromises = Object.entries(editedGrades).map(([recordId, newGrade]) => updateChecklist(recordId, newGrade, studentNumber));
        await Promise.all(updatePromises);
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        console.error("Failed to update grades:", error);
        alert("Failed to save some grades. Please try again.");
      }
    });
  };

  const confirmDelete = () => {
    if (!courseToDelete) return;
    startTransition(async () => {
      try {
        await deleteChecklistRecord(courseToDelete, studentNumber);
        setCourseToDelete(null); 
        router.refresh();
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Failed to remove the course. Please try again.");
      }
    });
  };

  const courseToDeleteData = data.courses.find((c: any) => c.id === courseToDelete);

  return (
    <>
      <div className="h-full bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-4 bg-red-50 border-b border-red-100 flex flex-row justify-between items-center gap-4 shrink-0">
          <h3 className="text-left font-black text-maroon text-sm uppercase tracking-widest leading-tight truncate">{`${data.termMetadata?.semester || 'Unknown Term'}`}</h3>
          <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest items-center shrink-0">
            <span className="text-gray-400">Units: <span className="text-maroon-900 text-sm">{data.termUnits}</span></span>
            <span className="text-gray-400">GWA: <span className="text-maroon-900 text-sm">{termGwa}</span></span>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            {isEditing ? (
              <button onClick={handleSave} disabled={isPending} className="flex items-center gap-1 text-zinc-400 rounded-md hover:text-green transition-colors">
                {isPending && !courseToDelete ? <div className="h-5 w-5 border-2 border-green/30 border-t-green rounded-full animate-spin"></div> : (<><CheckIcon className="h-5 w-5 stroke-[2.5]" /></>) }
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <PencilSquareIcon className="h-5 w-5 text-zinc-400 hover:text-yellow transition-colors" />
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-black border-b-2 border-gray-100">
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3 text-center">Units</th>
                <th className={`py-3 text-right transition-all ${isEditing ? 'pl-5 pr-14' : 'px-5'}`}>Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.courses.map((record: any) => {
                const currentGrade = editedGrades[record.id] !== undefined ? editedGrades[record.id] : record.grade;
                const numericGrade = parseFloat(currentGrade);
                const isPassing = !isNaN(numericGrade) && numericGrade <= 3;
                
                return (
                  <tr key={record.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-sm text-maroon-900">{record.course_id}</td>
                    <td className="px-5 py-4 text-center text-sm text-gray-500">{record.course?.course_units}</td>
                    <td className="px-3 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        {isEditing ? (
                          <>
                            <input type="text" value={currentGrade} onChange={(e) => handleGradeChange(record.id, e.target.value)}
                              className={`w-16 text-center text-sm font-mono font-bold rounded-lg border bg-gray-50 focus:bg-white outline-none px-2 py-1.5 transition-all shadow-sm
                                ${isPassing ? "text-green border-gray-200 focus:border-green" : "text-maroon border-gray-200 focus:border-maroon"}`}
                            />
                            <button type="button" onClick={() => setCourseToDelete(record.id)} disabled={isPending} className="p-1 text-gray-400 hover:text-maroon hover:bg-red-50 rounded-full transition-all disabled:opacity-50">
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <span className={`text-sm font-mono font-bold rounded-lg transition-colors px-2 py-1 ${ isPassing ? "bg-green/10 text-green": "bg-maroon/10 text-maroon" }`}>
                            {record.grade}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm" onClick={() => !isPending && setCourseToDelete(null)}>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center transform transition-all animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon mb-4 shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-lg font-black text-maroon text-center uppercase tracking-wider">Confirm Deletion</h3>

            <div className="mt-2 w-full">
              <p className="text-sm text-gray-500 text-center leading-relaxed break-words">
                Are you sure you want to delete <br />
                <span className="text-maroon-900 font-bold text-lg block my-2 px-2">{courseToDeleteData?.course_id}?</span>
                <span className="text-gray-400 block text-xs uppercase tracking-widest font-bold">This action cannot be undone.</span>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 w-full gap-3">
              <button type="button" className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-xs uppercase tracking-widest font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" onClick={() => setCourseToDelete(null)} disabled={isPending}>
                Cancel
              </button>
              <button type="button" className="w-full rounded-2xl bg-maroon px-4 py-3 text-xs uppercase tracking-widest font-bold text-white shadow-sm hover:bg-maroon-900 transition-colors disabled:opacity-50" onClick={confirmDelete} disabled={isPending}>
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}