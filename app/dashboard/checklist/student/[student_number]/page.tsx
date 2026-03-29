import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeftIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, AcademicCapIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { ChecklistManager } from '@/app/dashboard/checklist/student/[student_number]/checklist-manager';
import { formatFullName, calculateChecklistStats } from "@/lib/utils";
import { getStudentProfileData } from "@/lib/data";

async function StudentProfileContent({ student_number }: { student_number: string }) {
  const { student, studentError, records, allCourses, allTerms } = await getStudentProfileData(student_number);
  if (studentError || !student) return notFound();
  const passedCourseIds = records
    .filter(record => {
      const numericGrade = parseFloat(record.grade);
      return !isNaN(numericGrade) && numericGrade <= 3;
    })
    .map(record => record.course_id) || [];
  
  const { passedUnits, gwa: overallGwa } = calculateChecklistStats(records);
  
  const studentSuffix = student.student_suffix ? ` ${student.student_suffix}` : "";
  const adviserName = student.adviser 
    ? formatFullName(student.adviser.adviser_fname, student.adviser.adviser_mname, student.adviser.adviser_lname, student.adviser.adviser_suffix) 
    : 'N/A';

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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-4">
              <div className="flex items-center gap-3 text-sm text-maroon font-bold">
                <IdentificationIcon className="h-4 w-4" /> Student Number: {student.student_number}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IdentificationIcon className="h-4 w-4" /> SAIS ID: {student.student_sais_id || 'N/A'}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4" /> {student.student_contact_no || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4" /> {student.student_email || 'N/A'}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" /> {`${student.admission_term?.semester || 'Unknown'}, AY ${student.admission_term?.academic_year || 'Unknown'}`}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AcademicCapIcon className="h-4 w-4" /> Prof. {adviserName}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-maroon text-white p-6 rounded-2xl text-center w-[140px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Overall GWA</p>
              <p className="text-3xl font-black">{overallGwa}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-center w-[140px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Passed Units</p>
              <p className="text-3xl font-black text-maroon-900">{passedUnits}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <ChecklistManager 
          studentNumber={student.student_number} 
          records={records} 
          allTerms={allTerms} 
          allCourses={allCourses} 
          takenCourseIds={passedCourseIds}
          admissionTerm={student.admission_term}
        />
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