'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

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
      className={`relative flex h-full flex-col border-r-2 py-6 transition-all duration-300 ease-in-out ${theme.bg} ${theme.border} ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-4 top-10 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${theme.bg} ${theme.border} ${theme.primary} hover:text-white ${theme.hoverBg} shadow-sm`}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
      </button>

      <div className={`mb-8 flex items-center gap-4 px-5 overflow-hidden transition-all ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="shrink-0 rounded-xlp-1 shadow-sm">
          <Image 
            src="/IM-TRANSPARENT.png" 
            alt="IM Logo" 
            width={45} 
            height={45} 
            className="object-contain"
            priority
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className={`text-xs font-bold uppercase tracking-tighter leading-none ${theme.primary}`}>
              Institute of
            </h1>
            <h1 className={`text-sm font-black uppercase leading-tight ${theme.primary}`}>
              Management
            </h1>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div className="px-6 mb-4">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 ${theme.primary} ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Main Menu'}
          </p>
        </div>
        
        <nav className="space-y-1">
          <NavLinks isCollapsed={isCollapsed} />
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto border-t border-[#7b1113]/10 pt-4 flex flex-col gap-1">
        <SideNavLink 
          href="/dashboard/profile" 
          icon={<UserCircleIcon className="w-6 shrink-0" />} 
          label="Profile" 
          isCollapsed={isCollapsed} 
          theme={theme}
        />
        
        <form action={() => {}} className="w-full">
          <button
            className={`group flex h-12 w-full items-center gap-4 px-6 text-sm font-medium transition-all ${theme.text} ${theme.hoverBg} hover:text-white`}
          >
            <ArrowLeftOnRectangleIcon className={`w-6 shrink-0 transition-colors ${theme.primary} group-hover:text-white`} />
            {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}

function SideNavLink({ href, icon, label, isCollapsed, theme }: any) {
  return (
    <Link 
      href={href} 
      className={`group flex h-12 items-center gap-4 px-6 text-sm font-medium transition-all ${theme.text} ${theme.hoverBg} hover:text-white`}
    >
      <div className={`${theme.primary} group-hover:text-white transition-colors`}>
        {icon}
      </div>
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
}