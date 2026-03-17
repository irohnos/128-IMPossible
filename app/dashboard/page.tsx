'use client';

import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Users, FileText, FileBarChart, AlertTriangle, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [phTime, setPhTime] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [stats, setStats] = useState({ students: 0, thesis: 0, strat: 0, probation: 0 });

  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState('');

  // Calendar Navigation
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    setCurrentTitle(calendarApi?.view.title || '');
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    setCurrentTitle(calendarApi?.view.title || '');
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
    setCurrentTitle(calendarApi?.view.title || '');
  };

  useEffect(() => {
    const now = new Date();
    setPhTime(formatInTimeZone(now, 'Asia/Manila', 'yyyy-MM-dd'));
    
    const savedNotes = localStorage.getItem('admin_notepad');
    const savedTime = localStorage.getItem('admin_notepad_time');
    if (savedNotes) setNotes(savedNotes);
    if (savedTime) setLastSaved(savedTime);

    setMounted(true);

    async function fetchStats() {
      const { count: s } = await supabase.from('student').select('*', { count: 'exact', head: true });
      const { count: t } = await supabase.from('academic_papers').select('*', { count: 'exact', head: true }).eq('paper_type', 'Thesis');
      const { count: st } = await supabase.from('academic_papers').select('*', { count: 'exact', head: true }).eq('paper_type', 'Strategic Paper');
      const { count: p } = await supabase.from('evaluation_form').select('*', { count: 'exact', head: true }).eq('status', 'Probation');

      setStats({ students: s || 0, thesis: t || 0, strat: st || 0, probation: p || 0 });
    }

    fetchStats();
  }, []);

  useEffect(() => {
    if (mounted && calendarRef.current) {
      setCurrentTitle(calendarRef.current.getApi().view.title);
    }
  }, [mounted]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotes(val);
    setLastSaved(time);
    localStorage.setItem('admin_notepad', val);
    localStorage.setItem('admin_notepad_time', time);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6 h-full max-h-screen p-4">

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="No. of Students in Database" value={stats.students} icon={<Users size={20} />} />
        <StatCard title="No. of Thesis Papers" value={stats.thesis} icon={<FileText size={20} />} />
        <StatCard title="No. of Strategic Paper" value={stats.strat} icon={<FileBarChart size={20} />} />
        <StatCard title="No. of students on Probation" value={stats.probation} icon={<AlertTriangle size={20} />} />
      </div>

      <div className="grid grid-cols-4 gap-4 h-[420px]"> 
        {/* Calendar Card */}
        <div className="col-span-3 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col custom-calendar-mini">
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={handlePrev} className="p-1 hover:bg-zinc-50 rounded-full transition-colors">
              <ChevronLeft className="text-[#7b1113]" />
            </button>
            <h2 onClick={handleToday} className="text-xl font-bold cursor-pointer hover:text-[#7b1113] transition-colors select-none uppercase tracking-tight">
              {currentTitle}
            </h2>
            <button onClick={handleNext} className="p-1 hover:bg-zinc-50 rounded-full transition-colors">
              <ChevronRight className="text-[#7b1113]" />
            </button>
          </div>

          <div className="flex-1">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              now={phTime}
              initialDate={phTime}
              height="100%"
              aspectRatio={1.8}
              showNonCurrentDates={false}
              fixedWeekCount={false}
              dayCellClassNames={(arg) => {
                const dateStr = formatInTimeZone(arg.date, 'Asia/Manila', 'yyyy-MM-dd');
                return dateStr === phTime ? 'today-encircled' : '';
              }}
            />
          </div>
        </div>

        {/* Notepad */}
        <div className="col-span-1 bg-[#7b1113] text-white p-6 rounded-2xl shadow-inner flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
            <h3 className="font-bold uppercase tracking-widest text-[10px]">Notepad</h3>
            <div className="flex items-center gap-2 opacity-40">
               {lastSaved && <span className="text-[7px] uppercase font-bold tracking-tighter">Saved {lastSaved}</span>}
               <Pencil size={12} className="rotate-12" />
            </div>
          </div>
          
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Note"
            className="flex-1 bg-transparent border-none outline-none resize-none text-[11px] font-medium leading-relaxed placeholder:text-white/20 placeholder:italic scrollbar-hide"
          />

          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center opacity-40">
            <button 
              onClick={() => { 
                if(confirm('Clear notes?')) { 
                  setNotes(''); 
                  setLastSaved('');
                  localStorage.removeItem('admin_scratchpad'); 
                  localStorage.removeItem('admin_scratchpad_time');
                } 
              }}
              className="text-[9px] hover:text-white transition-colors underline"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Analystics placeholders */}
      <div className="grid grid-cols-2 gap-4 flex-1 pb-4">
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 italic text-sm text-center">
          Drop Rate Analytics Placeholder
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 italic text-sm text-center">
          Shift Rate Analystics Placeholder
        </div>
      </div>
      {/* Calendar style*/}   
      <style jsx global>{`
        .custom-calendar-mini .fc-day-disabled,
        .custom-calendar-mini .fc-day-other,
        .custom-calendar-mini .fc-daygrid-day.fc-day-no-nth { background-color: white !important; }
        .fc-daygrid-bg-harness { background-color: white !important; }
        .custom-calendar-mini .fc-theme-standard td, 
        .custom-calendar-mini .fc-theme-standard th,
        .custom-calendar-mini .fc-scrollgrid { border: none !important; }
        .fc .fc-day-today { background-color: transparent !important; }
        .fc-col-header-cell-cushion { color: #a1a1aa !important; font-size: 0.7rem !important; text-transform: uppercase; font-weight: 700; padding: 4px 0 !important; text-decoration: none !important; }
        .fc-daygrid-day-top { justify-content: center !important; padding-top: 2px !important; }
        .fc-daygrid-day-number { color: #3f3f46; font-size: 0.8rem !important; font-weight: 500; display: flex !important; align-items: center; justify-content: center; width: 24px !important; height: 24px !important; text-decoration: none !important; }
        .today-encircled .fc-daygrid-day-number { background: #7b1113 !important; color: white !important; border-radius: 50% !important; }
        .fc-daygrid-day-frame { min-height: 40px !important; }
        .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events { display: none !important; }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#7b1113]/20 p-4 rounded-xl flex items-center justify-between shadow-sm border-l-4 border-l-[#7b1113] transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">{title}</p>
        <p className="text-2xl font-black text-[#7b1113]">{value}</p>
      </div>
      <div className="text-[#7b1113] opacity-20">{icon}</div>
    </div>
  );
}
