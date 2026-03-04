'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { PanelLeftIcon } from "lucide-react"

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`relative flex h-full flex-col bg-zinc-600 py-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-white border border-zinc-500 hover:bg-zinc-700 transition-colors"
      >
        {isCollapsed ? <PanelLeftIcon className="w-4" /> : <PanelLeftIcon className="w-4" />}
      </button>

      <div className="mb-8 flex items-center gap-4 px-6 overflow-hidden">
        <Image 
          src="/IM-TRANSPARENT.png" 
          alt="IM Logo" 
          width={60} 
          height={60} 
          className="shrink-0 object-contain"
          priority
        />
        {!isCollapsed && (
          <h1 className="text-sm font-bold leading-tight text-white whitespace-nowrap">
            Institute of <br /> Management System
          </h1>
        )}
      </div>

      <div className="mb-2 px-6">
        <span className={`text-[10px] font-bold tracking-widest text-zinc-300 uppercase transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          {!isCollapsed && 'Menu'}
        </span>
      </div>

      <div className="flex flex-col">
        <NavLinks isCollapsed={isCollapsed} />
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <Link 
          href="/dashboard/profile" 
          className="flex h-[48px] items-center gap-4 px-6 text-sm font-medium text-zinc-200 hover:bg-zinc-500 hover:text-white transition-colors"
        >
          <UserCircleIcon className="w-6 shrink-0" />
          {!isCollapsed && <p className="whitespace-nowrap">Profile</p>}
        </Link>
        
        <form>
          <button className="flex h-[48px] w-full items-center gap-4 px-6 text-sm font-medium text-zinc-200 hover:bg-zinc-500 hover:text-white transition-colors">
            <ArrowLeftOnRectangleIcon className="w-6 shrink-0" />
            {!isCollapsed && <p className="whitespace-nowrap text-left">Logout</p>}
          </button>
        </form>
      </div>
    </div>
  );
}