'use client'

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { updateChecklist, deleteChecklistRecord, addChecklistRecord } from '@/app/dashboard/checklist/student/[student_number]/actions';
import { XMarkIcon, ExclamationTriangleIcon, PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { gradesOnly, isValidGrade, formatGrade } from "@/lib/utils";

export function EditableTerm({ 
  termId, data, studentNumber, allCourses, takenCourseIds, isEditingGlobal, onValidationChange, onEmptyCleanup 
}: { 
  termId: string, data: any, studentNumber: string, allCourses: any[], takenCourseIds: string[], isEditingGlobal?: boolean, onValidationChange?: (termId: string, isInvalid: boolean) => void, onEmptyCleanup?: (termId: number) => void 
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editedGrades, setEditedGrades] = useState<Record<string, string>>({});
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [newCourses, setNewCourses] = useState<{ tempId: number, courseId: string, grade: string }[]>([]);
  const handleGradeChange = (recordId: string, value: string) => { setEditedGrades(prev => ({ ...prev, [recordId]: value })); };
  const hasInvalidEditedGrade = Object.values(editedGrades).some(grade => !isValidGrade(grade));
  const hasInvalidNewCourse = newCourses.some(c => !c.courseId || !isValidGrade(c.grade));
  const isInvalid = hasInvalidEditedGrade || hasInvalidNewCourse;
  
  useEffect(() => { 
    if (onValidationChange) onValidationChange(termId, isInvalid); 
  }, [isInvalid, termId, onValidationChange]);

  const handleSave = () => {
    startTransition(async () => {
      try {
        const promises = Object.entries(editedGrades).map(([recordId, newGrade]) => updateChecklist(recordId, formatGrade(newGrade), studentNumber));

        newCourses.forEach(c => { if (c.courseId && c.grade) promises.push(addChecklistRecord(studentNumber, termId, c.courseId, formatGrade(c.grade))); });

        if (promises.length > 0) {
          const results = await Promise.all(promises);
          const failed = results.find(res => res?.error);
          if (failed) { alert(failed.error); return; }
        }

        setIsEditing(false);
        setNewCourses([]);
        setEditedGrades({});
        router.refresh(); 
      } catch (error) {
        alert("Failed to save changes. Please try again.");
      }
    });
  };

  useEffect(() => {
    if (isEditingGlobal !== undefined) {
      if (!isEditingGlobal && isEditing) {
        if (Object.keys(editedGrades).length > 0 || newCourses.some(c => c.courseId && c.grade)) {
          handleSave();
        } else {
          setIsEditing(false);
          setNewCourses([]);
          if (data.courses.length === 0 && onEmptyCleanup) onEmptyCleanup(Number(termId));
        }
      } else {
        setIsEditing(isEditingGlobal);
      }
    }
  }, [isEditingGlobal]);

  const confirmDelete = () => {
    if (!courseToDelete) return;
    startTransition(async () => {
      try {
        const res = await deleteChecklistRecord(courseToDelete, studentNumber);
        if (res?.error) { alert(res.error); return; }
        setCourseToDelete(null); 
        router.refresh();
      } catch (error) {
        alert("Failed to remove the course. Please try again.");
      }
    });
  };

  const courseToDeleteData = data.courses.find((c: any) => c.id === courseToDelete);
  const availableCourses = allCourses.filter(c => !takenCourseIds.includes(c.course_id));

  return (
    <>
      <div className="h-full bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 bg-red-50 border-b border-red-100 flex flex-row justify-between items-center gap-4 shrink-0">
          <h3 className="text-left font-black text-maroon text-sm uppercase tracking-widest leading-tight truncate">
            {`${data.termMetadata?.semester || 'Unknown Term'}`}
          </h3>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest items-center shrink-0">
            <span className="text-gray-400">Units: <span className="text-maroon-900 text-sm ml-1">{data.termUnits}</span></span>
            <span className="text-gray-400">GWA: <span className="text-maroon-900 text-sm ml-1">{data.termGwa}</span></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap table-fixed">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-black border-b-2 border-gray-100">
                <th className="w-full px-5 py-3 text-left">Course</th>
                <th className="w-24 px-5 py-3 text-center">Units</th>
                <th className={`w-36 py-3 text-right transition-all duration-200 ${isEditing ? 'pr-[3.75rem]' : 'pr-5'}`}>Grade</th>
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
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {isEditing ? (
                          <>
                            <input type="text" 
                              value={currentGrade} 
                              onKeyDown={gradesOnly} 
                              onChange={(e) => handleGradeChange(record.id, e.target.value.toUpperCase())} 
                              onBlur={(e) => handleGradeChange(record.id, formatGrade(e.target.value))}
                              className={`w-16 text-center text-sm font-mono font-bold rounded-lg border bg-gray-50 focus:bg-white outline-none px-2 py-1.5 transition-all shadow-sm
                                ${isPassing ? "text-green border-gray-200 focus:border-green" : "text-maroon border-gray-200 focus:border-maroon"}`}
                            />

                            <button 
                              type="button" 
                              onClick={() => setCourseToDelete(record.id)} 
                              disabled={isPending} 
                              className="p-1 w-7 h-7 flex items-center justify-center shrink-0 text-gray-400 hover:text-maroon hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <span className={`inline-block w-16 text-center text-sm font-mono font-bold rounded-lg border transition-colors px-2 py-1.5 
                            ${ isPassing ? "bg-green/10 text-green border-transparent": "bg-maroon/10 text-maroon border-transparent" }`}
                          >
                            {record.grade}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {isEditing && newCourses.map((newCourse) => {
                const selectedCourse = allCourses.find(c => c.course_id === newCourse.courseId);
                const newCourseUnits = selectedCourse ? selectedCourse.course_units : "-";
                const numericNewGrade = parseFloat(newCourse.grade);
                const isNewPassing = !isNaN(numericNewGrade) && numericNewGrade <= 3;
                const hasInput = newCourse.grade.length > 0;
                const localTakenIds = newCourses.filter(c => c.tempId !== newCourse.tempId).map(c => c.courseId);
                const availableForThisRow = availableCourses.filter(c => !localTakenIds.includes(c.course_id));

                return (
                  <tr key={newCourse.tempId} className="bg-red-50/50">
                    <td className="px-5 py-4">
                      <div className="relative">
                        <select 
                          value={newCourse.courseId} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewCourses(prev => prev.map(c => c.tempId === newCourse.tempId ? { ...c, courseId: val } : c));
                          }} 
                          className="w-full bg-white text-gray-800 text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:border-maroon focus:bg-white outline-none transition-all appearance-none shadow-sm"
                        >
                          <option value="" disabled>Courses</option>
                          {availableForThisRow.map(c => ( <option key={c.course_id} value={c.course_id}>{c.course_id}</option> ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <ChevronDownIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-bold text-gray-500">{newCourseUnits}</td>
                    <td className="px-5 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-3">
                        <input 
                          type="text" 
                          value={newCourse.grade} 
                          onKeyDown={gradesOnly} 
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setNewCourses(prev => prev.map(c => c.tempId === newCourse.tempId ? { ...c, grade: val } : c));
                          }} 
                          onBlur={(e) => {
                            const val = formatGrade(e.target.value);
                            setNewCourses(prev => prev.map(c => c.tempId === newCourse.tempId ? { ...c, grade: val } : c));
                          }} 
                          placeholder="Grade" 
                          className={`w-16 text-center text-sm font-mono font-bold rounded-lg border bg-white outline-none px-2 py-1.5 shadow-sm transition-all
                            ${hasInput 
                              ? (isNewPassing ? "text-green border-green focus:border-green" : "text-maroon border-maroon focus:border-maroon")
                              : "text-gray-800 border-gray-200 focus:border-maroon" 
                            }`}
                        />

                        <button 
                          type="button" 
                          onClick={() => setNewCourses(prev => prev.filter(c => c.tempId !== newCourse.tempId))} 
                          className="p-1 w-7 h-7 flex items-center justify-center shrink-0 text-gray-400 hover:text-maroon hover:bg-white rounded-full transition-all shadow-sm"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {isEditing && (
                <tr>
                  <td colSpan={3} className="px-5 py-4">
                    <button 
                      type="button" 
                      onClick={() => setNewCourses(prev => [...prev, { tempId: Date.now(), courseId: "", grade: "" }])} 
                      className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-bold uppercase tracking-widest text-maroon border-2 border-dashed border-maroon/20 bg-red-50/30 rounded-lg hover:bg-maroon hover:text-white hover:border-maroon transition-all"
                    >
                      <PlusIcon className="w-4 h-4 stroke-[2.5]" /> Add {newCourses.length > 0 ? "Another Course" : "Course"}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex-1 bg-white"></div>
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