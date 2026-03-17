'use client';

import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Users, FileText, FileBarChart, AlertTriangle, 
  ChevronLeft, ChevronRight, Zap, FilePlusIcon, UserRoundPlus
} from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [phTime, setPhTime] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [stats, setStats] = useState({ students: 0, thesis: 0, strat: 0, probation: 0 });

  const handlePrev = () => { calendarRef.current?.getApi().prev(); updateTitle(); };
  const handleNext = () => { calendarRef.current?.getApi().next(); updateTitle(); };
  const handleToday = () => { calendarRef.current?.getApi().today(); updateTitle(); };
  const updateTitle = () => setCurrentTitle(calendarRef.current?.getApi().view.title || '');

  useEffect(() => {
    const now = new Date();
    setPhTime(formatInTimeZone(now, 'Asia/Manila', 'yyyy-MM-dd'));
    setMounted(true);

    async function fetchData() {
      // Fetch stats
      const { count: s } = await supabase.from('student').select('*', { count: 'exact', head: true });
      const { count: t } = await supabase.from('academic_papers').select('*', { count: 'exact', head: true }).eq('paper_type', 'Thesis');
      const { count: st } = await supabase.from('academic_papers').select('*', { count: 'exact', head: true }).eq('paper_type', 'Strategic Paper');
      const { count: p } = await supabase.from('evaluation_form').select('*', { count: 'exact', head: true }).eq('status', 'Probation');
      setStats({ students: s || 0, thesis: t || 0, strat: st || 0, probation: p || 0 });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (mounted && calendarRef.current) updateTitle();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6 h-full p-4 overflow-y-auto bg-white">
      {/* Top row stats working */}
      <div className="grid grid-cols-4 gap-4 text-left">
        <StatCard title="No. of Students in Database" value={stats.students} icon={<Users size={20} />} />
        <StatCard title="No. of Thesis Papers" value={stats.thesis} icon={<FileText size={20} />} />
        <StatCard title="No. of Strategic Paper" value={stats.strat} icon={<FileBarChart size={20} />} />
        <StatCard title="No. of Students on Probation" value={stats.probation} icon={<AlertTriangle size={20} />} />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Rate analytics placeholders */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6 h-[350px]">
            <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 text-sm text-center px-4">
              Drop Rate Analytics Placeholder
            </div>
            <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 text-sm text-center px-4">
              Shift Rate Analytics Placeholder
            </div>
          </div>
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm h-[250px] flex items-center justify-center text-zinc-400 text-sm text-center px-4">
            Demographics Analytics Placeholder
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          {/* Quick actions */}
          <div className="bg-[#7b1113] text-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2 text-left">
              <Zap size={14} /> Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              {/* Static add student button */}
              <button className="flex items-center gap-3 w-full bg-white/10 p-3 rounded-xl text-[11px] cursor-not-allowed text-left">
                <UserRoundPlus size={16} /> 
                <span>Add Student Record</span>
              </button>
              
              {/* Static add paper button */}
              <button className="flex items-center gap-3 w-full bg-white/10 p-3 rounded-xl text-[11px] cursor-not-allowed text-left">
                <FilePlusIcon size={16} /> 
                <span>Add New Paper</span>
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm custom-calendar-mini flex flex-col">
            <div className="flex justify-between items-center mb-4 px-1">
              <button onClick={handlePrev} className="p-1 hover:bg-zinc-50 rounded-full transition-colors">
                <ChevronLeft size={16} className="text-[#7b1113]" />
              </button>
              <h2 onClick={handleToday} className="text-[11px] font-bold cursor-pointer hover:text-[#7b1113] uppercase">
                {currentTitle}
              </h2>
              <button onClick={handleNext} className="p-1 hover:bg-zinc-50 rounded-full transition-colors">
                <ChevronRight size={16} className="text-[#7b1113]" />
              </button>
            </div>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              now={phTime}
              initialDate={phTime}
              height="auto"
              showNonCurrentDates={false}
              fixedWeekCount={false}
              dayCellClassNames={(arg) => formatInTimeZone(arg.date, 'Asia/Manila', 'yyyy-MM-dd') === phTime ? 'today-encircled' : ''}
            />
          </div>

          {/* Audit Log placeholder */}
          <div className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm flex-1 min-h-[180px] flex flex-col">
             <h3 className="text-[10px] font-bold uppercase text-zinc-400 border-b border-zinc-50 pb-2 mb-3 tracking-widest text-left">Audit Log</h3>
             <div className="flex-1 flex items-center justify-center text-zinc-300 text-[10px] text-center">
               No recent activities
             </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-calendar-mini .fc-theme-standard td, 
        .custom-calendar-mini .fc-theme-standard th,
        .custom-calendar-mini .fc-scrollgrid { border: none !important; background-color: white !important; }
        .fc-daygrid-bg-harness { background-color: white !important; }
        .fc .fc-day-today { background-color: transparent !important; }
        .fc-col-header-cell-cushion { color: #a1a1aa !important; font-size: 0.6rem !important; text-transform: uppercase; font-weight: 700; text-decoration: none !important; }
        .fc-daygrid-day-top { justify-content: center !important; }
        .fc-daygrid-day-number { color: #3f3f46; font-size: 0.7rem !important; font-weight: 500; display: flex !important; align-items: center; justify-content: center; width: 20px !important; height: 20px !important; text-decoration: none !important; }
        .today-encircled .fc-daygrid-day-number { background: #7b1113 !important; color: white !important; border-radius: 50% !important; }
        .fc-daygrid-day-frame { min-height: 30px !important; }
        .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events { display: none !important; }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#7b1113]/20 p-4 rounded-xl flex items-center justify-between shadow-sm border-l-4 border-l-[#7b1113] 
                    transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1 hover:bg-zinc-50/50 cursor-default">
      <div className="text-left">
        <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">{title}</p>
        <p className="text-2xl font-black text-[#7b1113]">{value}</p>
      </div>
      <div className="text-[#7b1113] opacity-20 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </div>
    </div>
  );
}
