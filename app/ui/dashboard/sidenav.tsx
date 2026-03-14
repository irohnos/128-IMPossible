'use client';

import { useState } from 'react';
import Image from 'next/image';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const theme = {
    bg: 'bg-[#faf7f5]',
    border: 'border-[#7b1113]',
    primary: 'text-[#7b1113]',
    primaryBg: 'bg-[#7b1113]',
    hoverBg: 'hover:bg-[#7b1113]',
    text: 'text-[#3b0708]',
  };

  return (
    <aside
      className={`relative flex h-full flex-col border-r-2 transition-all duration-300 ease-in-out ${theme.bg} ${theme.border} ${
        isCollapsed ? 'w-28' : 'w-64'
      }`}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-4 top-12 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${theme.bg} ${theme.border} ${theme.primary} hover:text-white ${theme.hoverBg} shadow-sm`}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
      </button>

      <div className={`flex h-16 items-center border-b border-[#7b1113]/10 transition-all duration-300 ${
        isCollapsed ? 'justify-center px-0' : 'justify-start px-6 gap-4'
      }`}>
        <div className="shrink-0 flex items-center justify-center">
          <Image 
            src="/IM-TRANSPARENT.png" 
            alt="IM Logo" 
            width={50} 
            height={50} 
            className="object-contain transition-all"
            priority
          />
        </div>
        
        {!isCollapsed && (
          <div className="flex flex-col text-left overflow-hidden">
            <h1 className={`text-[10px] font-bold uppercase tracking-[0.35em] leading-none ${theme.primary} whitespace-nowrap opacity-90`}>
              Institute of
            </h1>
            <h1 className={`text-lg font-black uppercase leading-none ${theme.primary}`}>
              Management
            </h1>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-4">
        <div className="px-6 mb-2">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 ${theme.primary} ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? ' ' : 'Main Menu'}
          </p>
        </div>
        
        <nav className="space-y-1">
          <NavLinks isCollapsed={isCollapsed} />
        </nav>
      </div>
    </aside>
  );
}