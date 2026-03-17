import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeftIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, AcademicCapIcon, CalendarIcon } from "@heroicons/react/24/outline";
import EditableTerm from '@/app/dashboard/checklist/student/[student_number]/editable-checklist';
import { formatFullName } from "@/lib/utils";

async function StudentProfileContent({ student_number }: { student_number: string }) {
  const supabase = await createClient();
  
  const { data: student, error: studentError } = await supabase
    .from('student')
    .select(`*, 
      adviser:adviser_id (adviser_fname, adviser_mname, adviser_lname, adviser_suffix),
      admission_term:term_admitted (semester, academic_year)
    `)
    .eq('student_number', student_number)
    .single();

  if (studentError || !student) return notFound();

  const { data: records } = await supabase
    .from('checklist')
    .select(`*,
      course:course_id (course_units, course_category),
      term:term_taken (semester, academic_year)
    `)
    .eq('student_number', student_number)
    .order('term_taken', { ascending: true });

  const groupedRecords: Record<string, { 
    courses: any[], 
    termUnits: number, 
    termWeightedPoints: number,
    termMetadata?: { semester: string; academic_year: number }
  }> = {};
  
  let totalUnits = 0;
  let weightedPoints = 0;

  records?.forEach((record) => {
    const termKey = `${record.term_taken}`;
    if (!groupedRecords[termKey]) groupedRecords[termKey] = { courses: [], termUnits: 0, termWeightedPoints: 0, termMetadata: record.term };    
    groupedRecords[termKey].courses.push(record);
    const courseId = record.course_id.toUpperCase();
    const isExcluded = courseId.includes('PE') || courseId.includes('NSTP');

    if (!isExcluded) {
      const grade = parseFloat(record.grade);
      const units = record.course?.course_units || 0;

      if (!isNaN(grade)) {
        groupedRecords[termKey].termUnits += units;
        groupedRecords[termKey].termWeightedPoints += (grade * units);
        totalUnits += units;
        weightedPoints += (grade * units);
      }
    }
  });

  const groupedByAY: Record<string, Array<{ termId: string, data: typeof groupedRecords[string] }>> = {};
  
  Object.entries(groupedRecords).forEach(([termId, data]) => {
    const termSem = data.termMetadata?.semester?.toLowerCase() || '';
    const termYear = data.termMetadata?.academic_year;
    let ayLabel = 'Unknown';

    if (termYear) {
      let baseYear = termYear;
      if (termSem.includes('second') || termSem.includes('short')) baseYear -= 1;
      ayLabel = `${baseYear}-${baseYear + 1}`;
    }

    if (!groupedByAY[ayLabel]) groupedByAY[ayLabel] = [];
    groupedByAY[ayLabel].push({ termId, data });
  });

  const overallGwa = totalUnits > 0 ? (weightedPoints / totalUnits).toFixed(2) : "0.00";
  const studentSuffix = student.student_suffix ? ` ${student.student_suffix}` : "";

  return (
    <>
      <div className="mb-8">
        <Link href={`/dashboard/checklist/${student.admission_term?.academic_year}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-maroon transition-colors group">
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest"> Back to Batch {student.admission_term?.academic_year} </span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-black text-maroon-900 tracking-tight uppercase">
                {student.student_lname}{studentSuffix}, {student.student_fname} {student.student_mname || ''}
              </h1>
              <p className="text-maroon font-bold flex items-center gap-2 mt-1 text-sm">
                <IdentificationIcon className="h-4 w-4" /> Student Number: {student.student_number}
                <span className="text-gray-300 mx-2">|</span> SAIS ID: {student.student_sais_id || 'N/A'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4" /> {student.student_contact_no || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4" /> {student.student_email || 'N/A'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" /> 
                {`${student.admission_term?.semester || 'Unknown'}, AY ${student.admission_term?.academic_year || 'Unknown'}`}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AcademicCapIcon className="h-4 w-4" />
                Prof. {student.adviser ? formatFullName(student.adviser.adviser_fname, student.adviser.adviser_mname, student.adviser.adviser_lname, student.adviser.adviser_suffix) : 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-maroon text-white p-6 rounded-2xl text-center min-w-[120px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Overall GWA</p>
              <p className="text-3xl font-black">{overallGwa}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-center min-w-[120px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Total Units</p>
              <p className="text-3xl font-black text-maroon-900">{totalUnits}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {Object.keys(groupedByAY).length > 0 ? (
          Object.entries(groupedByAY).map(([ayLabel, terms]) => {
            const gridCols = terms.length >= 3 ? "grid-cols-1 lg:grid-cols-3" : terms.length === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1";

            return (
              <div key={ayLabel} className="bg-red-50 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                {ayLabel !== 'Unknown' && (
                  <div className="bg-red-50 py-2 text-center">
                    <h2 className="text-lg font-black text-maroon-900 uppercase tracking-widest">
                      Academic Year {ayLabel}
                    </h2>
                  </div>
                )}

                <div className={`grid ${gridCols} items-stretch bg-red-50`}>
                  {terms.map(({ termId, data }) => (<EditableTerm key={termId} termId={termId} data={data} studentNumber={student.student_number} />))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-maroon font-bold tracking-widest uppercase text-sm">No academic records found.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default async function StudentProfilePage({ params } : { params: Promise<{ student_number: string }> }) {
  return (
    <div className="max-w-auto mx-auto">
      <Suspense fallback={
        <div className="mt-[68px] p-10 flex flex-col items-center justify-center">
          <div className="h-8 w-8 border-4 border-maroon border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-center animate-pulse text-maroon font-bold tracking-widest uppercase text-sm">Loading Student Data...</p>
        </div>
      }>
        <StudentProfileWrapper params={params} />
      </Suspense>
    </div>
  );
}

async function StudentProfileWrapper({params}: {params: Promise <{ student_number: string }>}){
  const { student_number } = await params;
  return <StudentProfileContent student_number={student_number} />;
}