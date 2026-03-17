'use client'

import { useState, useTransition } from 'react';
import { updateChecklist } from '@/app/dashboard/checklist/student/[student_number]/actions';
import { PencilSquareIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function EditableTerm({ termId, data, studentNumber }: { termId: string, data: any, studentNumber: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editedGrades, setEditedGrades] = useState<Record<string, string>>({});
  const termGwa = data.termUnits > 0 ? (data.termWeightedPoints / data.termUnits).toFixed(2) : "0.00";
  const handleGradeChange = (recordId: string, value: string) => { setEditedGrades(prev => ({ ...prev, [recordId]: value })); };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const updatePromises = Object.entries(editedGrades).map(([recordId, newGrade]) => 
          updateChecklist(recordId, newGrade, studentNumber)
        );
        
        await Promise.all(updatePromises);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update grades:", error);
        alert("Failed to save some grades. Please try again.");
      }
    });
  };

  return (
    <div className="h-full bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 bg-red-50/50 border-b border-gray-100 flex flex-row justify-between items-center gap-4 shrink-0">
        <h3 className="font-black text-maroon text-sm uppercase tracking-widest leading-tight truncate">{`${data.termMetadata.semester}`}</h3>
        <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest items-center shrink-0">
          <span className="text-gray-400">Units: <span className="text-maroon-900 text-sm">{data.termUnits}</span></span>
          <span className="text-gray-400">GWA: <span className="text-maroon-900 text-sm">{termGwa}</span></span>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          {isEditing ? (
            <button onClick={handleSave} disabled={isPending} className="flex items-center gap-1 bg-maroon text-white px-3 py-1.5 rounded-md hover:bg-maroon-900 disabled:opacity-50 transition-colors">
              {isPending ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (<><CheckIcon className="h-4 w-4" /></>) }
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)}>
              <PencilSquareIcon className="h-5 w-5 text-zinc-400 hover:text-yellow transition-colors" />
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-black border-b border-gray-50">
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3 text-center">Units</th>
              <th className="px-5 py-3 text-right">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.courses.map((record: any) => {
              const currentGrade = editedGrades[record.id] !== undefined ? editedGrades[record.id] : record.grade;
              const numericGrade = parseFloat(currentGrade);
              const isPassing = !isNaN(numericGrade) && numericGrade < 3;
              
              return (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-sm text-maroon-900">{record.course_id}</td>
                  <td className="px-5 py-4 text-center text-sm text-gray-500">{record.course?.course_units}</td>
                  <td className="px-5 py-4 text-right flex justify-end">
                    {isEditing ? (
                      <input type="text" value={currentGrade}
                        onChange={(e) => handleGradeChange(record.id, e.target.value)}
                        className={`w-16 text-right font-mono font-bold rounded-lg border-2 bg-transparent focus:outline-none px-2 py-1 transition-colors ${
                          isPassing ? "text-green border-green/50 focus:border-green" : "text-maroon border-maroon/50 focus:border-maroon"
                        }`}
                      />
                    ) : (
                      <span className={`font-mono font-bold rounded-lg transition-colors px-2 py-1 ${ isPassing ? "bg-green/10 text-green": "bg-maroon/10 text-maroon" }`}>
                        {record.grade}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}